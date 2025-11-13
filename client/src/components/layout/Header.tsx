import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Bell, LogOut, Sparkles, MoonStar, Sun } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '../ui/Button';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const [searchValue, setSearchValue] = useState('');
  const [isDark, setIsDark] = useState(true);
  const [isLargeFont, setIsLargeFont] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get('search') ?? '';
    setSearchValue(search);
  }, [location.search]);

  useEffect(() => {
    const classList = document.documentElement.classList;
    if (isLargeFont) {
      classList.add('text-lg');
    } else {
      classList.remove('text-lg');
    }
  }, [isLargeFont]);

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  }, [isDark]);

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    if (searchValue) {
      params.set('search', searchValue);
    } else {
      params.delete('search');
    }
    navigate({ pathname: '/dashboard', search: params.toString() });
  };

  const handleLogout = () => {
    logout();
    toast.success('Session cleared — see you soon!');
    navigate('/login');
  };

  const initials = user?.name
    ? user.name
        .split(' ')
        .map((part) => part.charAt(0))
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'ST';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel mb-6 flex flex-col gap-6 border-white/10 bg-slate-900/60 px-6 py-5 lg:flex-row lg:items-center lg:justify-between"
    >
      <div className="flex flex-1 items-center gap-4">
        <Sparkles className="hidden h-6 w-6 text-secondary lg:block" />
        <div>
          <h2 className="text-lg font-semibold text-white">Hi {user?.name?.split(' ')[0] ?? 'there'} 👋</h2>
          <p className="text-sm text-slate-300">
            Ready to explore premium KITSW study resources curated for your branch.
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSearch}
        className="flex flex-1 items-center gap-3 rounded-full border border-white/10 bg-white/10 px-4 py-2.5 shadow-soft-inner backdrop-blur-xl"
        aria-label="Search subjects or resources"
      >
        <Search className="h-5 w-5 text-slate-300" />
        <input
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          placeholder="Search subjects, PYQs, or topics"
          className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
        />
        <Button type="submit" size="sm" variant="soft">
          Search
        </Button>
      </form>

      <div className="flex flex-1 items-center justify-end gap-3">
        <button
          onClick={() => setIsDark((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
        </button>
        <button
          onClick={() => setIsLargeFont((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          aria-label="Toggle large font"
        >
          <span className="text-sm font-semibold">{isLargeFont ? 'A−' : 'A+'}</span>
        </button>
        <button
          className="relative flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition hover:bg-white/10"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-secondary shadow-soft-lg" />
        </button>
        <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary via-primary to-slate-900 text-sm font-bold text-white">
            {initials}
          </div>
          <div className="hidden text-left text-xs text-slate-300 sm:block">
            <p className="text-sm font-semibold text-white">{user?.name ?? 'Student'}</p>
            <p>{user?.email ?? 'kitsw.edu'}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" icon={<LogOut className="h-4 w-4" />} onClick={handleLogout}>
          Logout
        </Button>
      </div>
    </motion.header>
  );
};

export default Header;

