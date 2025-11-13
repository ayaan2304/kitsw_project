import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Listbox, Transition } from '@headlessui/react';
import { Check, ChevronDown, ShieldCheck, Sparkles, LockKeyhole } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import Button from '../components/ui/Button';
import { fetchBranches, login } from '../services/api';
import type { Branch, LoginPayload } from '../types';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [selectedBranch, setSelectedBranch] = useState<Branch | undefined>();
  const [formValues, setFormValues] = useState<LoginPayload>({
    name: '',
    email: '',
    password: '',
    branch: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: branches, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['branches'],
    queryFn: fetchBranches,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000)
  });

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedBranch) {
      toast.error('Please select your branch to continue.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: LoginPayload = {
        ...formValues,
        branch: selectedBranch.slug
      };
      console.log('Submitting login with payload:', payload);
      const response = await login(payload);
      console.log('Login successful:', response);
      setAuth(response);
      toast.success(`Welcome back to Course Web 2.0, ${response.user.name.split(' ')[0]}!`);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Unable to log in right now. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: keyof LoginPayload, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="grid min-h-screen bg-slate-950/95 text-slate-100 lg:grid-cols-2">
      <LoginHero />
      <div className="flex items-center justify-center px-6 py-12 sm:px-12 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-md space-y-8"
        >
          <div>
            <Link to="/" className="text-sm text-secondary hover:underline">
              ← Back to overview
            </Link>
            <h2 className="mt-4 text-3xl font-bold text-white sm:text-4xl">Sign in to Course Web 2.0</h2>
            <p className="mt-2 text-sm text-slate-300">
              Select your branch first, then add your details. Any credentials work — we just use them to personalize your dashboard.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Branch
              </label>
              {isError && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                  <div>
                    <div>Failed to load branches. Please check if the server is running and try refreshing the page.</div>
                    {error && (
                      <div className="mt-1 text-xxs text-red-200">Error: {(error as Error).message}</div>
                    )}
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={() => {
                        console.info('Retrying fetch branches...');
                        refetch();
                      }}
                      className="rounded-md bg-red-600/80 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
              <div className="relative">
                <Listbox
                  value={selectedBranch}
                  onChange={(branchOption: Branch) => {
                    setSelectedBranch(branchOption);
                    updateField('branch', branchOption.slug);
                  }}
                  disabled={isLoading || isError}
                >
                  <Listbox.Button className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm text-white shadow-soft-inner transition hover:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/40 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span>
                      {selectedBranch 
                        ? selectedBranch.name 
                        : isLoading 
                        ? 'Loading branches...' 
                        : isError 
                        ? 'Failed to load branches' 
                        : 'Select branch'}
                    </span>
                    <ChevronDown className="h-4 w-4 text-slate-300" />
                  </Listbox.Button>
                  <Transition
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="scrollbar-hide absolute z-10 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-white/10 bg-slate-900/95 p-2 text-sm shadow-soft-lg backdrop-blur-xl">
                      {branches && branches.length > 0 ? (
                        branches.map((branch) => (
                          <Listbox.Option
                            key={branch.id}
                            value={branch}
                            className={({ active }) =>
                              [
                                'flex cursor-pointer items-center justify-between rounded-xl px-3 py-2',
                                active ? 'bg-white/10 text-white' : 'text-slate-200'
                              ].join(' ')
                            }
                          >
                            {({ selected }) => (
                              <>
                                <div>
                                  <p className="font-semibold">{branch.name}</p>
                                  <p className="text-xs text-slate-400">
                                    {branch.totalSubjects} curated subjects
                                  </p>
                                </div>
                                {selected && <Check className="h-4 w-4 text-secondary" />}
                              </>
                            )}
                          </Listbox.Option>
                        ))
                      ) : (
                        <div className="px-3 py-2 text-slate-400 text-xs">
                          {isLoading ? 'Loading branches...' : 'No branches available'}
                        </div>
                      )}
                    </Listbox.Options>
                  </Transition>
                </Listbox>
              </div>
            </div>

            <fieldset className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Name
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-soft-inner focus:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="Your full name"
                  value={formValues.name}
                  onChange={(event) => updateField('name', event.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Email
                </label>
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white shadow-soft-inner focus:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="you@kitsw.ac.in"
                  type="email"
                  value={formValues.email}
                  onChange={(event) => updateField('email', event.target.value)}
                  required
                />
              </div>
            </fieldset>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-11 py-3 text-sm text-white shadow-soft-inner focus:border-secondary/40 focus:outline-none focus:ring-2 focus:ring-secondary/40"
                  placeholder="Any password works"
                  type="password"
                  value={formValues.password}
                  onChange={(event) => updateField('password', event.target.value)}
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={!selectedBranch}
              loading={isSubmitting}
              className="w-full"
              variant="primary"
              size="lg"
              icon={<ShieldCheck className="h-5 w-5" />}
            >
              Enter Dashboard
            </Button>
          </form>
          <p className="text-xs text-slate-400">
            By signing in you agree to explore Course Web 2.0 responsibly and share the goodness with your peers 🚀
          </p>
        </motion.div>
      </div>
    </div>
  );
};

const LoginHero = () => (
  <div className="relative hidden h-full flex-col justify-between overflow-hidden border-r border-white/5 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.18),_transparent_55%)] px-12 py-12 lg:flex">
    <div className="absolute -left-20 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-secondary/10 blur-3xl" />
    <div className="space-y-6">
      <span className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-secondary">
        <Sparkles className="h-4 w-4" />
        Web 2.0 Experience
      </span>
      <h2 className="text-4xl font-bold leading-tight text-white">
        Crafted for KITSW students building the next generation of learning portals.
      </h2>
      <p className="text-sm text-slate-200">
        Course Web 2.0 integrates curated PYQs, interactive modules, and a delightful UI — all powered by modern React, Tailwind, and premium design patterns.
      </p>
    </div>
    <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-6">
      <h3 className="text-lg font-semibold text-white">Highlights</h3>
      <ul className="space-y-3 text-sm text-slate-200">
        <li>• Dynamic branch → year → semester flow ensures academic precision.</li>
        <li>• Immersive PDF viewing with inline analytics.</li>
        <li>• Vibrant micro-interactions built with Framer Motion.</li>
      </ul>
    </div>
  </div>
);

export default Login;

