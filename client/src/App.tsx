import { lazy, Suspense } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import MainLayout from './components/layout/MainLayout';

const Landing = lazy(() => import('./pages/Landing'));
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const SubjectPage = lazy(() => import('./pages/SubjectPage'));
const Bookmarks = lazy(() => import('./pages/Bookmarks'));

const SuspenseFallback = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-950/95 text-slate-100">
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel px-10 py-8 text-center"
    >
      <p className="text-lg font-semibold tracking-wide text-primary">Course Web 2.0</p>
      <p className="mt-2 text-sm text-slate-300">Loading your premium study space…</p>
    </motion.div>
  </div>
);

const ProtectedShell = () => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <SuspenseFallback />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
};

const App = () => {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedShell />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/subjects/:branchSlug/:semester/:subjectSlug" element={<SubjectPage />} />
          <Route path="/bookmarks" element={<Bookmarks />} />
        </Route>
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Suspense>
  );
};

export default App;

