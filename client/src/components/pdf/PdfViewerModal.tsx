import { useEffect, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { FileDown, FileText, GaugeCircle, X } from 'lucide-react';
import { Document, Page, pdfjs } from 'react-pdf';
import Button from '../ui/Button';
import { formatBytes } from '../../utils/format';
import type { PyqItem } from '../../types';
import { buildDownloadUrl, buildViewUrl } from '../../services/api';
import toast from 'react-hot-toast';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdf.worker.min.js',
  import.meta.env.VITE_PDF_WORKER ?? 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.5.136/'
).toString();

interface PdfViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  branchSlug: string;
  semester: string;
  subjectSlug: string;
  pyq?: PyqItem;
}

const PdfViewerModal = ({
  isOpen,
  onClose,
  branchSlug,
  semester,
  subjectSlug,
  pyq
}: PdfViewerModalProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [scale, setScale] = useState(1.1);

  useEffect(() => {
    setNumPages(undefined);
    setScale(1.1);
  }, [pyq]);

  if (!pyq) return null;

  const viewUrl = buildViewUrl({
    branch: branchSlug,
    sem: semester,
    subject: subjectSlug,
    id: pyq.id
  });

  const downloadUrl = buildDownloadUrl({
    branch: branchSlug,
    sem: semester,
    subject: subjectSlug,
    id: pyq.id
  });

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: { numPages: number }) => {
    setNumPages(nextNumPages);
  };

  return (
    <Transition show={isOpen} as="div">
      <Dialog onClose={onClose} className="relative z-[999]">
        <Transition.Child
          enter="duration-200 ease-out"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="duration-200 ease-in"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xl" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-4 py-6">
            <Transition.Child
              enter="duration-200 ease-out"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="glass-panel relative flex w-full max-w-5xl flex-col overflow-hidden border border-white/10 bg-slate-900/90 shadow-soft-lg">
                <header className="flex items-center justify-between border-b border-white/5 px-6 py-4">
                  <div>
                    <Dialog.Title className="text-lg font-semibold text-white">{pyq.title}</Dialog.Title>
                    <p className="text-xs uppercase tracking-wide text-slate-300">
                      {pyq.year} • {formatBytes(pyq.sizeBytes)}
                    </p>
                  </div>
                  <button
                    onClick={onClose}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-300 transition hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </header>

                <div className="flex flex-col gap-4 overflow-hidden p-6 lg:flex-row">
                  <div className="flex-1 overflow-y-auto rounded-3xl border border-white/5 bg-slate-950/60 p-4">
                    <Document
                      file={viewUrl}
                      onLoadSuccess={onDocumentLoadSuccess}
                      className="flex flex-col items-center gap-4"
                      onLoadError={() => toast.error('Unable to load PDF preview')}
                    >
                      <Page pageNumber={1} scale={scale} className="shadow-soft-lg" />
                      {numPages && numPages > 1 && (
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setScale((prev) => Math.min(prev + 0.1, 1.6))}
                          className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-slate-200"
                        >
                          Tap to enhance zoom
                        </motion.button>
                      )}
                    </Document>
                  </div>

                  <aside className="w-full max-w-sm space-y-4 rounded-3xl border border-white/5 bg-white/5 p-5 text-sm text-slate-200">
                    <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                      <GaugeCircle className="h-6 w-6 text-secondary" />
                      <div>
                        <p className="text-xs uppercase tracking-wide text-slate-400">Pages</p>
                        <p className="text-base font-semibold text-white">{numPages ?? 'Loading…'}</p>
                      </div>
                    </div>
                    <p>
                      View the PYQ directly or download it for offline revision. Downloads increment the in-memory analytics counter.
                    </p>
                    <div className="flex flex-col gap-3">
                      <Button
                        variant="primary"
                        icon={<FileText className="h-4 w-4" />}
                        onClick={() => window.open(viewUrl, '_blank', 'noopener')}
                      >
                        Open Full View
                      </Button>
                      <Button
                        variant="secondary"
                        icon={<FileDown className="h-4 w-4" />}
                        onClick={() => {
                          window.open(downloadUrl, '_blank', 'noopener');
                          toast.success('Download started');
                        }}
                      >
                        Download PDF
                      </Button>
                    </div>
                  </aside>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PdfViewerModal;

