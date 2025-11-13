import { motion } from 'framer-motion';
import { useBookmarks } from '../hooks/useBookmarks';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { formatBytes, semesterLabel } from '../utils/format';
import { buildDownloadUrl, buildViewUrl } from '../services/api';
import toast from 'react-hot-toast';

const Bookmarks = () => {
  const { groupedBookmarks, toggleBookmark } = useBookmarks();

  const bookmarkEntries = Object.entries(groupedBookmarks);

  return (
    <section className="space-y-6">
      <motion.header
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel border border-white/10 bg-slate-900/60 p-6"
      >
        <Badge variant="primary">Bookmarks</Badge>
        <h1 className="mt-3 text-3xl font-bold text-white">Your saved resources</h1>
        <p className="text-sm text-slate-300">
          Quickly revisit PYQs you love. Everything stays locally on your device for offline planning.
        </p>
      </motion.header>

      {bookmarkEntries.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel border border-white/10 bg-white/5 p-10 text-center text-slate-300"
        >
          No bookmarks yet. Explore a subject and tap the bookmark button on any PYQ to store it here.
        </motion.div>
      ) : (
        <div className="space-y-6">
          {bookmarkEntries.map(([group, items]) => (
            <motion.section
              key={group}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="glass-panel border border-white/10 bg-slate-900/60 p-6"
            >
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-xl font-semibold text-white">{group}</h2>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {items.length} saved item{items.length > 1 ? 's' : ''}
                </p>
              </div>

              <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {items.map((item) => {
                  const viewUrl = buildViewUrl({
                    branch: item.branchSlug,
                    sem: item.semester,
                    subject: item.subjectSlug,
                    id: item.pyqId
                  });
                  const downloadUrl = buildDownloadUrl({
                    branch: item.branchSlug,
                    sem: item.semester,
                    subject: item.subjectSlug,
                    id: item.pyqId
                  });
                  return (
                    <article
                      key={item.id}
                      className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft-lg"
                    >
                      <div>
                        <p className="text-xs uppercase tracking-wide text-secondary">
                          {semesterLabel(item.semester)}
                        </p>
                        <h3 className="mt-1 text-lg font-semibold text-white">{item.title}</h3>
                        <p className="text-xs text-slate-300">Year {item.year}</p>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => window.open(viewUrl, '_blank', 'noopener')}
                        >
                          View
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            window.open(downloadUrl, '_blank', 'noopener');
                            toast.success('Download started');
                          }}
                        >
                          Download
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBookmark(item)}
                        >
                          Remove
                        </Button>
                      </div>
                      <p className="text-xs text-slate-400">
                        Estimated size • {formatBytes(item.sizeBytes)}
                      </p>
                    </article>
                  );
                })}
              </div>
            </motion.section>
          ))}
        </div>
      )}
    </section>
  );
};

export default Bookmarks;

