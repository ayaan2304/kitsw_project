import { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { BrainCircuit, Calendar, Compass, Layers, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { fetchSubjects } from '../services/api';
import { YEAR_OPTIONS, YEAR_TO_SEMESTERS } from '../utils/semesters';
import Skeleton from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import type { SubjectSummary } from '../types';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  const searchQuery = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return (params.get('search') ?? '').toLowerCase();
  }, [location.search]);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['subjects', user?.branchSlug, selectedSemester],
    queryFn: () => fetchSubjects(user?.branchSlug ?? '', selectedSemester ?? ''),
    enabled: Boolean(user?.branchSlug && selectedSemester)
  });

  const subjects = useMemo<SubjectSummary[]>(() => {
    if (!data?.subjects) return [];
    if (!searchQuery) return data.subjects;
    return data.subjects.filter((subject) =>
      subject.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.subjects, searchQuery]);

  const handleYearSelect = (year: string) => {
    setSelectedYear(year);
    setSelectedSemester(null);
    toast.success(`Year ${year} selected — choose one of its semesters next.`);
  };

  const handleSemesterSelect = (semester: string) => {
    setSelectedSemester(semester);
    toast.success(`Semester ${semester} locked in — fetching curated subjects.`);
  };

  const handleNavigateSubject = (subject: SubjectSummary) => {
    if (!user) return;
    navigate(`/subjects/${user.branchSlug}/${selectedSemester}/${subject.slug}`, {
      state: {
        subjectName: subject.name,
        semester: selectedSemester
      }
    });
  };

  return (
    <section className="space-y-8">
      <HeroSection branchCode={user?.branch ?? ''} />

      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="glass-panel border border-white/10 bg-slate-900/60 p-6"
      >
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Badge variant="primary">Step 1</Badge>
            <h3 className="mt-2 text-xl font-semibold text-white">Choose your current year</h3>
            <p className="text-sm text-slate-300">
              This unlocks the exact semesters tied to KITSW&apos;s official curriculum structure.
            </p>
          </div>
          <Calendar className="hidden h-10 w-10 text-secondary sm:block" />
        </header>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {YEAR_OPTIONS.map((year) => (
            <motion.button
              key={year.id}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => handleYearSelect(year.id)}
              className={[
                'rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition duration-200 hover:border-secondary/40',
                selectedYear === year.id ? 'border-secondary/60 bg-secondary/10 text-white shadow-soft-lg' : ''
              ].join(' ')}
            >
              <p className="text-sm font-semibold uppercase tracking-wide text-secondary">{year.label}</p>
              <p className="mt-2 text-sm text-slate-200">{year.description}</p>
            </motion.button>
          ))}
        </div>
      </motion.section>

      {selectedYear && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel border border-white/10 bg-slate-900/60 p-6"
        >
          <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge variant="primary">Step 2</Badge>
              <h3 className="mt-2 text-xl font-semibold text-white">Pick the active semester</h3>
              <p className="text-sm text-slate-300">
                You&apos;ll get a curated list of subjects directly from the KITSW blueprint.
              </p>
            </div>
            <Layers className="hidden h-10 w-10 text-secondary sm:block" />
          </header>
          <div className="mt-6 flex flex-wrap gap-3">
            {YEAR_TO_SEMESTERS[selectedYear].map((semester) => (
              <Button
                key={semester}
                variant={selectedSemester === semester ? 'primary' : 'soft'}
                size="sm"
                onClick={() => handleSemesterSelect(semester)}
              >
                Semester {semester}
              </Button>
            ))}
          </div>
        </motion.section>
      )}

      {selectedSemester && (
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="glass-panel border border-white/10 bg-slate-900/60 p-6"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <Badge variant="primary">Subjects</Badge>
              <h3 className="mt-2 text-xl font-semibold text-white">Curated learning space</h3>
              <p className="text-sm text-slate-300">
                Premium cards show each subject, the number of PYQs available, and quick access to explore.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/30 bg-primary/10 px-4 py-3 text-sm text-primary shadow-soft-inner">
              {isFetching ? 'Refreshing dataset…' : `Found ${subjects.length} subjects`}
            </div>
          </div>
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {isLoading || isFetching
              ? Array.from({ length: 6 }).map((_, index) => (
                  <Skeleton key={`subject-skel-${index}`} className="h-40 rounded-3xl bg-white/10" />
                ))
              : subjects.map((subject) => (
                  <motion.article
                    key={subject.slug}
                    whileHover={{ y: -6 }}
                    transition={{ duration: 0.3 }}
                    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-5 shadow-soft-lg"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-secondary/10 blur-3xl transition duration-300 group-hover:bg-secondary/20" />
                    <p className="text-xs uppercase tracking-widest text-secondary">Subject</p>
                    <h4 className="mt-2 text-xl font-semibold text-white">{subject.name}</h4>
                    <p className="mt-1 text-xs text-slate-300">{subject.totalPyqs} premium PYQs</p>
                    <div className="mt-6 flex items-center justify-between text-xs text-slate-300">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1">
                        <Compass className="h-4 w-4 text-secondary" />
                        Semester {selectedSemester}
                      </span>
                      <Button
                        size="sm"
                        variant="primary"
                        className="rounded-full"
                        onClick={() => handleNavigateSubject(subject)}
                      >
                        Explore
                      </Button>
                    </div>
                  </motion.article>
                ))}
          </div>
        </motion.section>
      )}

      <ExperienceHighlights />
    </section>
  );
};

const HeroSection = ({ branchCode }: { branchCode: string }) => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
    className="glass-panel border border-white/10 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-950/60 p-6"
  >
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-2">
        <Badge variant="accent">KITSW Exclusive</Badge>
        <h2 className="text-2xl font-bold text-white">Branch: {branchCode ?? 'Select on login'}</h2>
        <p className="text-sm text-slate-300">
          Dive into the official curriculum flow — Course Web 2.0 mirrors KITSW&apos;s academic structure for a guided learning experience.
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
          <span className="font-semibold text-secondary">Flow</span> Branch → Year → Semester → Subjects
        </div>
        <Sparkles className="hidden h-10 w-10 text-secondary lg:block" />
      </div>
    </div>
  </motion.section>
);

const ExperienceHighlights = () => (
  <motion.section
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className="grid gap-4 lg:grid-cols-3"
  >
    {[
      {
        title: 'Framer Motion Magic',
        description: 'Smooth transitions and micro-interactions keep the interface feeling premium and alive.',
        icon: BrainCircuit
      },
      {
        title: 'PDF Intelligence',
        description:
          'Inline viewing, instant downloads, and analytics that reset each time the server restarts.',
        icon: Compass
      },
      {
        title: 'Bookmarks that stay',
        description:
          'Keep your go-to PYQs and notes ready for quick revision using localStorage persistence.',
        icon: Layers
      }
    ].map((item) => {
      const Icon = item.icon;
      return (
        <article
          key={item.title}
          className="glass-panel flex flex-col gap-3 border border-white/10 bg-white/5 p-6"
        >
          <Icon className="h-8 w-8 text-secondary" />
          <h4 className="text-lg font-semibold text-white">{item.title}</h4>
          <p className="text-sm text-slate-300">{item.description}</p>
        </article>
      );
    })}
  </motion.section>
);

export default Dashboard;

