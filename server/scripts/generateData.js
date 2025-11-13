const fs = require('fs');
const path = require('path');

const DATASET = {
  'CSE(AI&ML)': {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    3: [
      'Engineering Mathematics-III',
      'Object Oriented Programming Through JAVA',
      'Operating Systems',
      'Computer Organisation and Architecture',
      'Advanced Data Structures',
      'Formal Languages and Automata Theory'
    ],
    4: [
      'Artificial Intelligence',
      'Database Management Systems',
      'Python Programming',
      'Essence of Indian Traditional Knowledge'
    ],
    5: [
      'Universal Human Values-II',
      'Internet of Things',
      'Software Engineering',
      'Compiler Design',
      'Machine Learning'
    ],
    6: [
      'Quantitative Aptitude and Logical Reasoning',
      'Management, Economics and Accountancy',
      'Design and Analysis of Algorithms',
      'Deep Learning',
      'Computer Vision and Image Processing'
    ],
    7: ['Cloud Computing'],
    8: ['Capstone Project']
  },
  CSN: {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    3: [
      'Engineering Mathematics-III',
      'Object Oriented Programming Through JAVA',
      'Operating Systems',
      'Computer Organisation and Architecture',
      'Advanced Data Structures',
      'Digital Electronics',
      'Essence of Indian Traditional Knowledge'
    ],
    4: [
      'Theory of Computation',
      'Database Management Systems',
      'Computer Networks'
    ],
    5: [
      'Quantitative Aptitude and Logical Reasoning',
      'Advanced Computer Networks',
      'Internet of Things',
      'Compiler Design',
      'Machine Learning'
    ],
    6: [
      'Universal Human Values-II',
      'Software Engineering',
      'Cloud Computing',
      'Cryptography and Network Security'
    ],
    7: [
      'Management Economics and Accountancy',
      'Design and Analysis of Algorithms'
    ],
    8: ['Capstone Project']
  },
  CSE: {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    3: [
      'Engineering Mathematics-III',
      'Object Oriented Programming Through JAVA',
      'Discrete Mathematics',
      'Computer Organisation and Architecture',
      'Advanced Data Structures',
      'Digital Electronics',
      'Essence of Indian Traditional Knowledge'
    ],
    4: [
      'Theory of Computation',
      'Database Management Systems',
      'Operating System'
    ],
    5: [
      'Quantitative Aptitude and Logical Reasoning',
      'Computer Networks',
      'Software Engineering',
      'Compiler Design',
      'Python Programming'
    ],
    6: [
      'Universal Human Values-II',
      'Design and Analysis of Algorithms',
      'Data Warehousing and Data Mining',
      'Internet of Things'
    ],
    7: [
      'Management Economics and Accountancy',
      'Cloud Computing'
    ],
    8: ['Capstone Project']
  },
  'CSE(DS)': {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    3: [
      'Engineering Mathematics-III',
      'Object Oriented Programming Through JAVA',
      'Operating Systems',
      'Computer Organisation and Architecture',
      'Advanced Data Structures',
      'Formal Languages and Automata Theory'
    ],
    4: [
      'Artificial Intelligence',
      'Database Management Systems',
      'Python Programming',
      'Essence of Indian Traditional Knowledge'
    ],
    5: [
      'Universal Human Values-II',
      'Design and Analysis Algorithms',
      'Software Engineering',
      'Compiler Design',
      'Data Mining and Data Warehousing'
    ],
    6: [
      'Quantitative Aptitude and Logical Reasoning',
      'Management Economics and Accountancy',
      'Big Data Analytics',
      'Machine Learning',
      'R Programming'
    ],
    7: ['Data Visualization'],
    8: ['Capstone Project']
  },
  ECE: {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    3: [
      'Engineering Mathematics-III',
      'Signals and Systems',
      'Analog Circuits-I',
      'Switching Theory and Logic Design',
      'Network Analysis'
    ],
    4: [
      'Electromagnetic Waves and Transmission Lines',
      'Analog Circuits-II',
      'Pulse and Digital Circuits',
      'Probability and Random Processes',
      'Digital Design',
      'Essence of Indian Traditional Knowledge'
    ],
    5: [
      'Universal Human Values-II',
      'Communication Systems',
      'Antennas and Wave Propagation',
      'Linear Integrated Circuits and Applications',
      'Microprocessors and Microcontrollers',
      'Linear Control Systems'
    ],
    6: [
      'Quantitative Aptitude and Logical Reasoning',
      'Digital Signal Processing and Applications',
      'VLSI Circuits and Systems',
      'Embedded Systems with ARM Processor and Applications',
      'Advanced Data Structures'
    ],
    7: [
      'Microwave and Optical Fiber Communication',
      'Management Economics and Accountancy'
    ],
    8: ['Capstone Project']
  },
  Civil: {
    1: [
      'Engineering Mathematics-I',
      'Programming for Problem Solving Using C',
      'Engineering Chemistry',
      'Engineering Drawing',
      'Engineering Mechanics',
      'Environmental Studies'
    ],
    2: [
      'Engineering Mathematics-II',
      'Data Structures Through C',
      'Engineering Physics',
      'English for Communication',
      'Basic Electrical Engineering'
    ],
    3: [
      'Engineering Mathematics-III',
      'Fluid Mechanics',
      'Surveying',
      'Construction Materials'
    ],
    4: [
      'Mechanics of Materials',
      'Hydraulics Engineering',
      'Design of Reinforced Concrete Structures',
      'Engineering Geology',
      'Essence of Indian Traditional Knowledge'
    ],
    5: [
      'Universal Human Values-II',
      'Structural Analysis',
      'Environmental Engineering',
      'Soil Mechanics',
      'Design of Steel Structure'
    ],
    6: [
      'Quantitative Aptitude and Logical Reasoning',
      'Advanced Data Structures',
      'Estimation and Valuation',
      'Hydrology and Water Resources Engineering',
      'Construction Management and Equipment',
      'Object Oriented Programming Through JAVA'
    ],
    7: ['Highway Engineering'],
    8: ['Capstone Project']
  }
};

const SUBJECTS_FILE = path.join(__dirname, '..', 'data', 'subjects.json');
const PYQS_FILE = path.join(__dirname, '..', 'data', 'pyqs.json');
const PDF_ROOT = path.join(__dirname, '..', 'public', 'pdfs');

const SLUG_CACHE = new Map();

function slugify(value) {
  if (SLUG_CACHE.has(value)) {
    return SLUG_CACHE.get(value);
  }

  const slug = value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  SLUG_CACHE.set(value, slug);
  return slug;
}

function ensureDirectories(...segments) {
  const dirPath = path.join(...segments);
  fs.mkdirSync(dirPath, { recursive: true });
  return dirPath;
}

const pdfTemplate = `%PDF-1.4
%âãÏÓ
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 76 >>
stream
BT
/F1 18 Tf
72 720 Td
(Course Web 2.0 Placeholder PDF) Tj
0 -36 Td
(Generated for demo purposes only) Tj
ET
endstream
endobj
5 0 obj
<< /Type /Font /Subtype /Type1 /Name /F1 /BaseFont /Helvetica >>
endobj
xref
0 6
0000000000 65535 f 
0000000015 00000 n 
0000000066 00000 n 
0000000121 00000 n 
0000000246 00000 n 
0000000366 00000 n 
trailer
<< /Size 6 /Root 1 0 R >>
startxref
447
%%EOF
`;

function writePdfIfMissing(pdfPath) {
  if (!fs.existsSync(pdfPath)) {
    fs.writeFileSync(pdfPath, pdfTemplate, 'utf8');
  }
}

function main() {
  ensureDirectories(path.dirname(SUBJECTS_FILE));
  ensureDirectories(PDF_ROOT);

  const subjectsOutput = {};
  const pyqsOutput = {};

  Object.entries(DATASET).forEach(([branch, semesters]) => {
    subjectsOutput[branch] = {};
    pyqsOutput[branch] = {};
    const branchSlug = slugify(branch);

    Object.entries(semesters).forEach(([semester, subjects]) => {
      subjectsOutput[branch][semester] = subjects;
      pyqsOutput[branch][semester] = {};

      subjects.forEach((subjectTitle) => {
        const subjectSlug = slugify(subjectTitle);
        const subjectDir = ensureDirectories(PDF_ROOT, branchSlug, String(semester), subjectSlug);
        const pdfFileName = `${subjectSlug}-2024.pdf`;
        const pdfPath = path.join(subjectDir, pdfFileName);

        writePdfIfMissing(pdfPath);

        const stats = fs.statSync(pdfPath);

        pyqsOutput[branch][semester][subjectSlug] = [
          {
            id: `${subjectSlug}-2024`,
            title: `${subjectTitle} PYQ 2024`,
            file: `/pdfs/${branchSlug}/${semester}/${subjectSlug}/${pdfFileName}`,
            year: 2024,
            sizeBytes: stats.size
          }
        ];
      });
    });
  });

  fs.writeFileSync(SUBJECTS_FILE, JSON.stringify(subjectsOutput, null, 2), 'utf8');
  fs.writeFileSync(PYQS_FILE, JSON.stringify(pyqsOutput, null, 2), 'utf8');

  console.log(`Generated subjects at ${SUBJECTS_FILE}`);
  console.log(`Generated PYQ index at ${PYQS_FILE}`);
}

main();

