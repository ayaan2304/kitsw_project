import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, Sparkles, PlayCircle, ArrowRight } from 'lucide-react';
import Button from '../components/ui/Button';

const Landing = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-100">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_55%)]" />
      <div className="absolute inset-0 -z-20 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />

      <header className="flex items-center justify-between px-6 py-6 sm:px-10">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-slate-900 shadow-soft-lg">
            <GraduationCap className="h-6 w-6 text-white" />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-slate-400">KITSW</p>
            <h1 className="text-xl font-semibold text-white">Course Web 2.0</h1>
          </div>
        </Link>
        <Link to="/login">
          <Button size="md" variant="primary" icon={<ArrowRight className="h-4 w-4" />}>
            Login
          </Button>
        </Link>
      </header>

      <main className="mx-auto flex max-w-6xl flex-col items-center px-6 pb-24 pt-10 text-center sm:px-10 lg:flex-row lg:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full space-y-6 lg:w-1/2"
        >
          <Badge />
          <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Kakatiya Institute&apos;s premium digital learning playground.
          </h2>
          <p className="text-base leading-relaxed text-slate-300 sm:text-lg">
            Course Web 2.0 is built for KITSW students who demand more. Dive into a curated library
            of PYQs, smart subject pathways, and interactive learning journeys crafted on modern Web
            2.0 foundations.
          </p>
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-start sm:text-left">
            <Link to="/login">
              <Button size="lg" variant="primary" icon={<Sparkles className="h-5 w-5" />}>
                Explore Dashboard
              </Button>
            </Link>
            <a
              href="https://kitsw.ac.in"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:bg-white/10"
            >
              <PlayCircle className="h-5 w-5 text-secondary" />
              About KITSW
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative mt-12 w-full lg:mt-0 lg:w-1/2"
        >
          <div className="glass-panel relative overflow-hidden rounded-4xl border-white/5 bg-slate-900/50 p-8 shadow-soft-lg">
            <div className="absolute -top-20 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative space-y-5">
              <h3 className="text-lg font-semibold text-secondary">About KITSW</h3>
              <p className="text-left text-sm text-slate-200">
                Kakatiya Institute of Technology &amp; Science, Warangal (KITSW) is a beacon of
                innovation in Telangana. From industry-driven curriculum to a thriving research
                culture, KITSW empowers students to build software that blends academic depth with
                real-world agility.
              </p>
              <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
                <h4 className="text-base font-semibold text-white">Why Course Web 2.0?</h4>
                <ul className="space-y-2 text-sm text-slate-200">
                  <li>• Centralized access to branch-wise, semester-ready PYQs.</li>
                  <li>• Intelligent recommendations for videos, notes, and quick reads.</li>
                  <li>• Designed with Web 2.0 ethos — interactive, collaborative, and fast.</li>
                  <li>• Perfect companion for outcome-based education (OBE) journeys.</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

const Badge = () => (
  <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
    <Sparkles className="h-4 w-4" />
    Made for KITSW Innovators
  </span>
);

export default Landing;

