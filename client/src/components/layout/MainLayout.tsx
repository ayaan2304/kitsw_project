import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Header from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-slate-950/95 px-4 py-6 text-slate-100 sm:px-6 lg:px-10">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_60%)]" />
      <div className="mx-auto flex max-w-[1400px] gap-6 lg:gap-10">
        <Sidebar />
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45 }}
          className="flex w-full flex-1 flex-col pb-20 lg:pb-6"
        >
          <Header />
          <main className="flex-1 space-y-6 lg:space-y-8">{children}</main>
        </motion.div>
      </div>
    </div>
  );
};

export default MainLayout;

