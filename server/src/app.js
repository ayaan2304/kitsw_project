const path = require('path');
const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const subjectsData = require('../data/subjects.json');
const pyqData = require('../data/pyqs.json');

const app = express();

const JWT_SECRET = process.env.JWT_SECRET || 'courseweb-secret-key';
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || 'http://localhost:5173';

app.use(
  cors({
    origin: CLIENT_ORIGIN.split(',').map((item) => item.trim()),
    credentials: true
  })
);
app.use(helmet());
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

const PUBLIC_DIR = path.join(__dirname, '..', 'public');
const PDF_DIR = path.join(PUBLIC_DIR, 'pdfs');

app.use('/pdfs', express.static(PDF_DIR));

const CLIENT_BUILD_DIR = path.join(__dirname, '..', '..', 'client', 'dist');
const serveClient = fs.existsSync(CLIENT_BUILD_DIR);

if (serveClient) {
  app.use(express.static(CLIENT_BUILD_DIR));
}

const analytics = {
  views: new Map(),
  downloads: new Map()
};

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatBranchLabel(branch) {
  return branch.replace(/\(/g, ' (').replace(/&/g, ' & ').replace(/\s+/g, ' ').trim();
}

const branchRegistry = Object.entries(subjectsData).map(([branchName, semesters]) => {
  const slug = slugify(branchName);
  const totalSubjects = Object.values(semesters).reduce((acc, list) => acc + list.length, 0);
  return {
    code: branchName,
    name: formatBranchLabel(branchName),
    slug,
    totalSubjects,
    semesters
  };
});

app.locals.stats = {
  branches: branchRegistry.length,
  subjects: branchRegistry.reduce((acc, entry) => acc + entry.totalSubjects, 0)
};

const branchLookup = new Map();
branchRegistry.forEach((entry) => {
  branchLookup.set(entry.code.toLowerCase(), entry);
  branchLookup.set(entry.slug, entry);
});

function resolveBranch(input) {
  if (!input) return undefined;
  const normalized = input.trim().toLowerCase();
  return branchLookup.get(normalized);
}

function ensureValidSemester(semesters, semester) {
  if (!semester) return undefined;
  const normalized = String(semester);
  return semesters[normalized] ? normalized : undefined;
}

function loadPyqEntry(branchCode, semester, subjectSlug) {
  const branchPyq = pyqData[branchCode];
  if (!branchPyq) return undefined;
  const semesterPyq = branchPyq[semester];
  if (!semesterPyq) return undefined;
  return semesterPyq[subjectSlug];
}

function registerAnalytics(type, key) {
  const store = analytics[type];
  if (!store) return;
  const current = store.get(key) || 0;
  store.set(key, current + 1);
}

function toAnalyticsKey({ branch, semester, subject, id }) {
  return `${branch}|${semester}|${subject}|${id}`;
}

function resolveFilePath(relativePath) {
  const sanitized = relativePath
    .replace(/^\//, '')
    .replace(/\\/g, '/')
    .replace(/\.\.\//g, '')
    .replace(/\.\.\\+/g, '');
  if (!sanitized.startsWith('pdfs/')) {
    throw new Error('Invalid file path');
  }
  const full = path.join(PUBLIC_DIR, sanitized);
  if (!full.startsWith(PUBLIC_DIR)) {
    throw new Error('Invalid file path');
  }
  return full;
}

app.post('/api/auth/login', (req, res) => {
  const { name = 'Student', email = 'student@example.com', branch } = req.body || {};
  const branchEntry = resolveBranch(branch);

  if (!branchEntry) {
    return res.status(400).json({ message: 'Branch selection is required' });
  }

  const tokenPayload = {
    name,
    email,
    branch: branchEntry.code,
    branchSlug: branchEntry.slug
  };

  const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '12h' });

  res.cookie('course2_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 12 * 60 * 60 * 1000
  });

  return res.json({
    token,
    user: {
      ...tokenPayload
    }
  });
});

app.get('/api/branches', (_req, res) => {
  const branches = branchRegistry.map((branch) => ({
    id: branch.slug,
    code: branch.code,
    name: branch.name,
    slug: branch.slug,
    totalSubjects: branch.totalSubjects
  }));

  res.json(branches);
});

app.get('/api/subjects', (req, res) => {
  const { branch, semester } = req.query;
  const branchEntry = resolveBranch(branch);

  if (!branchEntry) {
    return res.status(400).json({ message: 'Invalid branch' });
  }

  const semesterKey = ensureValidSemester(branchEntry.semesters, semester);

  if (!semesterKey) {
    return res.status(404).json({ message: 'No subjects found for the selected semester' });
  }

  const subjects = branchEntry.semesters[semesterKey].map((subjectName) => {
    const subjectSlug = slugify(subjectName);
    const pyqs = loadPyqEntry(branchEntry.code, semesterKey, subjectSlug) || [];
    return {
      name: subjectName,
      slug: subjectSlug,
      totalPyqs: pyqs.length
    };
  });

  res.json({
    branch: {
      code: branchEntry.code,
      name: branchEntry.name,
      slug: branchEntry.slug
    },
    semester: semesterKey,
    subjects
  });
});

app.get('/api/pyqs', (req, res) => {
  const { branch, semester, subject } = req.query;
  const branchEntry = resolveBranch(branch);

  if (!branchEntry) {
    return res.status(400).json({ message: 'Invalid branch' });
  }

  const semesterKey = ensureValidSemester(branchEntry.semesters, semester);
  if (!semesterKey) {
    return res.status(404).json({ message: 'Semester not found' });
  }

  const subjectSlug = slugify(subject);
  const pyqs = loadPyqEntry(branchEntry.code, semesterKey, subjectSlug);

  if (!pyqs) {
    return res
      .status(404)
      .json({ message: 'No PYQs available for the selected subject yet.', items: [] });
  }

  res.json({
    branch: branchEntry.code,
    semester: semesterKey,
    subject: subjectSlug,
    items: pyqs
  });
});

app.get('/files/view', (req, res) => {
  const { branch, sem, subject, id } = req.query;
  const branchEntry = resolveBranch(branch);

  if (!branchEntry) {
    return res.status(400).json({ message: 'Invalid branch' });
  }

  const semesterKey = ensureValidSemester(branchEntry.semesters, sem);
  if (!semesterKey) {
    return res.status(404).json({ message: 'Semester not found' });
  }

  const subjectSlug = slugify(subject);
  const pyqs = loadPyqEntry(branchEntry.code, semesterKey, subjectSlug);

  if (!pyqs) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const pyq = pyqs.find((item) => item.id === id) || pyqs[0];
  if (!pyq) {
    return res.status(404).json({ message: 'PYQ not found' });
  }

  try {
    const filePath = resolveFilePath(pyq.file);
    registerAnalytics(
      'views',
      toAnalyticsKey({
        branch: branchEntry.slug,
        semester: semesterKey,
        subject: subjectSlug,
        id: pyq.id
      })
    );
    res.setHeader('Content-Type', 'application/pdf');
    return res.sendFile(filePath);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to open file', error: error.message });
  }
});

app.get('/files/download', (req, res) => {
  const { branch, sem, subject, id } = req.query;
  const branchEntry = resolveBranch(branch);

  if (!branchEntry) {
    return res.status(400).json({ message: 'Invalid branch' });
  }

  const semesterKey = ensureValidSemester(branchEntry.semesters, sem);
  if (!semesterKey) {
    return res.status(404).json({ message: 'Semester not found' });
  }

  const subjectSlug = slugify(subject);
  const pyqs = loadPyqEntry(branchEntry.code, semesterKey, subjectSlug);

  if (!pyqs) {
    return res.status(404).json({ message: 'Subject not found' });
  }

  const pyq = pyqs.find((item) => item.id === id) || pyqs[0];
  if (!pyq) {
    return res.status(404).json({ message: 'PYQ not found' });
  }

  try {
    const filePath = resolveFilePath(pyq.file);
    registerAnalytics(
      'downloads',
      toAnalyticsKey({
        branch: branchEntry.slug,
        semester: semesterKey,
        subject: subjectSlug,
        id: pyq.id
      })
    );
    return res.download(filePath, `${pyq.title}.pdf`);
  } catch (error) {
    return res.status(500).json({ message: 'Unable to download file', error: error.message });
  }
});

app.get('/api/analytics', (_req, res) => {
  const views = Object.fromEntries(analytics.views.entries());
  const downloads = Object.fromEntries(analytics.downloads.entries());
  res.json({ views, downloads });
});

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  const shouldServeClient =
    serveClient &&
    req.method === 'GET' &&
    !req.path.startsWith('/api') &&
    !req.path.startsWith('/files') &&
    !req.path.startsWith('/pdfs');

  if (shouldServeClient) {
    return res.sendFile(path.join(CLIENT_BUILD_DIR, 'index.html'));
  }

  return next();
});

app.use((_req, res) => {
  res.status(404).json({ message: 'Not Found' });
});

module.exports = {
  app,
  analytics,
  helpers: {
    slugify,
    ensureValidSemester,
    resolveBranch
  }
};

