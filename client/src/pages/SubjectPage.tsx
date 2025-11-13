import { useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Atom, BookmarkPlus, Flame, PlayCircle, Star, Video } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchAnalytics, fetchPyqs, buildDownloadUrl } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatBytes, semesterLabel, titleCaseFromSlug, yearFromSemester } from '../utils/format';
import PdfViewerModal from '../components/pdf/PdfViewerModal';
import Button from '../components/ui/Button';
import Skeleton from '../components/ui/Skeleton';
import Badge from '../components/ui/Badge';
import { useBookmarks } from '../hooks/useBookmarks';
import type { PyqItem } from '../types';

const SubjectPage = () => {
  const { branchSlug: branchSlugParam, semester = '', subjectSlug = '' } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toggleBookmark, isBookmarked } = useBookmarks();

  const branchSlug = branchSlugParam ?? user?.branchSlug ?? '';
  const subjectNameFromState = (location.state as { subjectName?: string })?.subjectName;
  const subjectName = subjectNameFromState ?? titleCaseFromSlug(subjectSlug);

  const { data, isLoading } = useQuery({
    queryKey: ['pyqs', branchSlug, semester, subjectSlug],
    queryFn: () => fetchPyqs(branchSlug, semester, subjectSlug),
    enabled: Boolean(branchSlug && semester && subjectSlug)
  });

  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: fetchAnalytics,
    refetchInterval: 10000
  });

  const [selectedPyq, setSelectedPyq] = useState<PyqItem | null>(null);
  const [openViewer, setOpenViewer] = useState(false);

  const handleView = (pyq: PyqItem) => {
    setSelectedPyq(pyq);
    setOpenViewer(true);
  };

  const handleBookmark = (pyq: PyqItem) => {
    const bookmarkId = `${branchSlug}-${semester}-${pyq.id}`;
    const alreadySaved = isBookmarked(bookmarkId);
    toggleBookmark({
      id: bookmarkId,
      pyqId: pyq.id,
      title: pyq.title,
      subjectName,
      subjectSlug,
      branchSlug,
      semester,
      file: pyq.file,
      year: pyq.year,
      sizeBytes: pyq.sizeBytes
    });
    toast.success(alreadySaved ? 'Removed from bookmarks.' : 'Saved to bookmarks!');
  };

  const handleDownload = (pyq: PyqItem) => {
    const url = buildDownloadUrl({
      branch: branchSlug,
      sem: semester,
      subject: subjectSlug,
      id: pyq.id
    });
    window.open(url, '_blank', 'noopener');
    toast.success('Download started');
  };

  const pyqs = data?.items ?? [];

  const analyticsFor = (pyq: PyqItem) => {
    const key = `${branchSlug}|${semester}|${subjectSlug}|${pyq.id}`;
    return {
      views: analytics?.views?.[key] ?? 0,
      downloads: analytics?.downloads?.[key] ?? 0
    };
  };

  const syllabusOutline = useMemo(() => {
    const core = subjectName.split(' ').slice(0, 3).join(' ');
    return [
      `${core}: Core definitions & theory`,
      'Unit II: Application-based problems',
      'Unit III: Recent question analysis',
      'Unit IV: Lab and real-world linkages'
    ];
  }, [subjectName]);

  return (
    <section className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel grid gap-6 border border-white/10 bg-slate-900/60 p-6 lg:grid-cols-[2fr,1fr]"
      >
        <div className="space-y-2">
          <Badge variant="primary">{semesterLabel(semester)}</Badge>
          <h1 className="text-3xl font-bold text-white">{subjectName}</h1>
          <p className="text-sm text-slate-300">
            Branch: {branchSlug.toUpperCase()} • {yearFromSemester(semester)} • Premium PYQs curated for Course Web 2.0 students.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-3">
          <Button variant="soft" size="sm" icon={<Flame className="h-4 w-4 text-secondary" />} onClick={() => navigate('/bookmarks')}>
            View Bookmarks
          </Button>
        </div>
        <ul className="col-span-full grid gap-3 text-sm text-slate-200 md:grid-cols-2">
          {syllabusOutline.map((item) => (
            <li key={item} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Star className="h-4 w-4 text-secondary" />
              {item}
            </li>
          ))}
        </ul>
      </motion.section>

      <div className="grid gap-6 lg:grid-cols-[3fr,1fr]">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel border border-white/10 bg-slate-900/60 p-6"
        >
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="primary">PYQ Vault</Badge>
              <h2 className="mt-2 text-2xl font-semibold text-white">Previous Year Papers</h2>
              <p className="text-sm text-slate-300">
                Streamlined PDF viewer with instant downloads and analytics feedback.
              </p>
            </div>
            <Atom className="hidden h-10 w-10 text-secondary sm:block" />
          </header>

          <div className="mt-6 grid gap-4">
            {isLoading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`pyq-skel-${index}`} className="h-32 rounded-3xl bg-white/10" />
                ))
              : pyqs.map((pyq) => {
                  const analyticsItem = analyticsFor(pyq);
                  const bookmarkId = `${branchSlug}-${semester}-${pyq.id}`;
                  return (
                    <motion.article
                      key={pyq.id}
                      whileHover={{ y: -4 }}
                      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft-lg md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-secondary">PYQ • {pyq.year}</p>
                        <h3 className="text-lg font-semibold text-white">{pyq.title}</h3>
                        <p className="mt-1 text-xs text-slate-400">
                          {formatBytes(pyq.sizeBytes)} • Views {analyticsItem.views} • Downloads {analyticsItem.downloads}
                        </p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button variant="soft" size="sm" icon={<BookmarkPlus className="h-4 w-4" />} onClick={() => handleBookmark(pyq)}>
                          {isBookmarked(bookmarkId) ? 'Saved' : 'Bookmark'}
                        </Button>
                        <Button variant="secondary" size="sm" onClick={() => handleDownload(pyq)}>
                          Download
                        </Button>
                        <Button variant="primary" size="sm" onClick={() => handleView(pyq)}>
                          View
                        </Button>
                      </div>
                    </motion.article>
                  );
                })}

            {!isLoading && pyqs.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6 text-center text-sm text-slate-300">
                No PYQs yet for this subject. New uploads will appear here automatically.
              </div>
            )}
          </div>
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="space-y-5"
        >
          <div className="glass-panel border border-white/10 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">Recommended Deep Dives</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-slate-400">Curated Web 2.0 resources</p>
            <ul className="mt-4 space-y-3 text-sm text-slate-200">
              {recommendedResources(subjectName).map((item) => (
                <li
                  key={item.title}
                  className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <Video className="mt-1 h-4 w-4 text-secondary" />
                  <div>
                    <p className="font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-slate-400">{item.description}</p>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-2 inline-flex items-center gap-2 text-xs text-secondary hover:underline"
                    >
                      Watch tutorial <PlayCircle className="h-3.5 w-3.5" />
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="glass-panel border border-white/10 bg-slate-900/60 p-5">
            <h3 className="text-lg font-semibold text-white">Analytics Snapshot</h3>
            <p className="mt-1 text-xs text-slate-300">
              Analytics resets whenever the server restarts — perfect for demoing on campus.
            </p>
            <div className="mt-4 space-y-2 text-sm text-slate-200">
              <p>Real-time counters refresh every 10 seconds.</p>
              <p>Views increment when opening the inline PDF viewer.</p>
              <p>Downloads capture actual file download triggers.</p>
            </div>
          </div>
        </motion.aside>
      </div>

      <PdfViewerModal
        isOpen={openViewer}
        onClose={() => setOpenViewer(false)}
        branchSlug={branchSlug}
        semester={semester}
        subjectSlug={subjectSlug}
        pyq={selectedPyq ?? undefined}
      />
    </section>
  );
};

const recommendedResources = (subjectName: string) => [
  {
    title: `${subjectName} – High level crash course`,
    description: 'Curated YouTube playlist with chapter-wise explainers tailored for fast revision.',
    url: 'https://www.youtube.com/results?search_query=' + encodeURIComponent(subjectName)
  },
  {
    title: 'Important topics & expected questions',
    description: 'Community-driven annotations focusing on frequently repeated concepts.',
    url: 'https://www.google.com/search?q=' + encodeURIComponent(`${subjectName} important topics`)
  },
  {
    title: 'Labs & implementation ideas',
    description: 'Project-based resources to connect theory with hands-on practice.',
    url: 'https://www.google.com/search?q=' + encodeURIComponent(`${subjectName} labs`)
  }
];

export default SubjectPage;

