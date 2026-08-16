import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Field, TextField } from '../../components/Field';
import { Modal } from '../../components/Modal';
import { ArrowRightIcon, CloseIcon, EyeIcon, EyeOffIcon } from '../../components/icons';
import { getErrorMessage } from '../../config/api';
import { checkUsername } from './auth.api';
import { useAuth } from './AuthContext';

type Step = 'username' | 'credentials';
type Mode = 'login' | 'register';

export function LoginPage() {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>('username');
  const [mode, setMode] = useState<Mode>('login');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);

  if (user && !welcomeOpen) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/profile'} replace />;
  }

  const isNewUser = mode === 'register';

  function backToUsername() {
    setStep('username');
    setMode('login');
    setError('');
    setPassword('');
  }

  async function handleCheckUsername(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = username.trim();
    if (!trimmed) return;

    setError('');
    setSubmitting(true);
    try {
      const { exists } = await checkUsername(trimmed);
      setMode(exists ? 'login' : 'register');
      setStep('credentials');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not check that username. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCredentials(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isNewUser) {
        await register({ name: name.trim(), username: username.trim(), email: email.trim(), password });
        setWelcomeOpen(true);
      } else {
        await login({ username: username.trim(), password });
        navigate('/profile', { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err, 'Something went wrong. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  function closeWelcome() {
    setWelcomeOpen(false);
    navigate('/profile', { replace: true });
  }

  return (
    <div className="container-site flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="display-heading text-4xl text-ink">
          {step === 'username' || isNewUser ? (
            <>
              Welcome to the <span className="text-green-700">fraction</span>
              <span className="text-red-500">.</span>
            </>
          ) : (
            <>
              Welcome back<span className="text-red-500">.</span>
            </>
          )}
        </h1>
        <p className="mt-2 text-ink-muted">
          {step === 'username'
            ? 'Start with your username. We’ll sort out the rest.'
            : isNewUser
              ? 'Looks like you’re new here. Set up your account.'
              : 'Good to see you again. Sign in to your account.'}
        </p>

        <form
          onSubmit={step === 'username' ? handleCheckUsername : handleCredentials}
          className="mt-8 flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card"
        >
          {step === 'username' ? (
            <>
              <TextField
                id="username"
                label="Username"
                type="text"
                autoComplete="username"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Button type="submit" variant="secondary" size="lg" disabled={submitting}>
                {submitting ? 'Checking…' : 'Continue'}
                {!submitting && <ArrowRightIcon />}
              </Button>
            </>
          ) : (
            <>
              {isNewUser ? (
                <>
                  <TextField
                    id="name"
                    label="Name"
                    type="text"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextField
                    id="email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </>
              ) : null}

              <div className="flex items-center justify-between gap-2 rounded-sm bg-paper px-3 py-2 text-sm">
                <span className="truncate text-ink">
                  Username <span className="font-semibold text-green-700">{username}</span>
                </span>
                <button
                  type="button"
                  onClick={backToUsername}
                  className="shrink-0 text-xs font-semibold uppercase tracking-wider text-ink-muted transition-colors hover:text-ink"
                >
                  Not you?
                </button>
              </div>

              <Field label="Password" htmlFor="password" required>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isNewUser ? 'new-password' : 'current-password'}
                    required
                    minLength={isNewUser ? 6 : undefined}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 pr-20 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-green-700 transition-colors hover:bg-green-100"
                  >
                    {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                  </button>
                </div>
              </Field>

              {error && (
                <p className="rounded-sm bg-red-100 px-3 py-2 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <Button type="submit" variant={isNewUser ? 'primary' : 'secondary'} size="lg" disabled={submitting}>
                {submitting ? (isNewUser ? 'Creating your account…' : 'Signing in…') : isNewUser ? 'Create account' : 'Sign in'}
              </Button>
            </>
          )}
        </form>
      </div>

      <Modal open={welcomeOpen} onClose={closeWelcome} labelledBy="welcome-title" maxWidth="max-w-md">
        <div className="relative p-8 text-center sm:p-10">
          <button
            type="button"
            onClick={closeWelcome}
            aria-label="Close welcome message"
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-green-100 hover:text-ink"
          >
            <CloseIcon />
          </button>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-700">You’re in</p>
          <h2 id="welcome-title" className="display-heading mt-2 text-4xl leading-tight text-ink sm:text-5xl">
            Welcome to the .1%
          </h2>
          <p className="mt-4 leading-relaxed text-ink-muted">
            The 1% is crowded — we’re looking for the fraction. Your account is ready. Pick your
            first session and bring the discipline.
          </p>
          <Button variant="primary" size="lg" className="mt-8 w-full" onClick={closeWelcome}>
            Explore events
            <ArrowRightIcon />
          </Button>
        </div>
      </Modal>
    </div>
  );
}
