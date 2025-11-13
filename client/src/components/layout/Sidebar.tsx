import { NavLink } from 'react-router-dom';
import { GraduationCap, LayoutDashboard, BookmarkCheck, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import Badge from '../ui/Badge';

const navItems = [
  {
    to: '/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  },
  {
    to: '/bookmarks',
    label: 'Bookmarks',
    icon: BookmarkCheck
  }
];

const Sidebar = () => {
  const { user } = useAuth();

  return (
    <>
      <motion.aside
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel sticky top-6 hidden h-[calc(100vh-3rem)] w-72 flex-col justify-between p-6 lg:flex"
      >
        <div>
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-secondary to-slate-900 shadow-soft-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-400">KITSW</p>
              <h1 className="text-xl font-semibold text-white">Course Web 2.0</h1>
            </div>
          </div>
          <div className="mt-8 space-y-6">
            <div>
              <p className="text-xs uppercase tracking-widest text-slate-400">Branch</p>
              <p className="mt-1 text-base font-semibold text-slate-50">
                {user?.branch ?? 'Select branch'}
              </p>
              <Badge variant="primary" className="mt-3">
                Premium Access
              </Badge>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      [
                        'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-200',
                        isActive
                          ? 'bg-white/10 text-white shadow-soft-inner'
                          : 'text-slate-300 hover:bg-white/5 hover:text-white'
                      ].join(' ')
                    }
                  >
                    <Icon className="h-5 w-5" />
                    {item.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-start gap-3">
            <Sparkles className="h-5 w-5 text-secondary" />
            <div>
              <p className="text-sm font-semibold text-white">Tip</p>
              <p className="mt-1 text-xs text-slate-300">
                Bookmark PYQs to build your personalized revision library instantly.
              </p>
            </div>
          </div>
        </div>
      </motion.aside>

      <motion.nav
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 z-50 flex w-[90%] max-w-md -translate-x-1/2 items-center justify-around rounded-3xl border border-white/10 bg-slate-900/80 px-4 py-3 text-xs text-slate-200 shadow-soft-lg backdrop-blur-xl lg:hidden"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                [
                  'flex flex-col items-center gap-1 rounded-2xl px-3 py-2 font-medium transition-all duration-200',
                  isActive ? 'text-white' : 'text-slate-300 hover:text-white'
                ].join(' ')
              }
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          );
        })}
      </motion.nav>
    </>
  );
};

export default Sidebar;

