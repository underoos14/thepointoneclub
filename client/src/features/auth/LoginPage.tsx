import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { Field, TextField } from '../../components/Field';
import { EyeIcon, EyeOffIcon } from '../../components/icons';
import { getErrorMessage } from '../../config/api';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/'} replace />;
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const me = await login({ username, password });
      navigate(me.role === 'admin' ? '/admin' : '/', { replace: true });
    } catch (err) {
      setError(getErrorMessage(err, 'Could not sign in. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container-site flex justify-center py-20">
      <div className="w-full max-w-md">
        <h1 className="display-heading text-4xl text-ink">
          Welcome back<span className="text-red-500">.</span>
        </h1>
        <p className="mt-2 text-ink-muted">Sign in to manage the club.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
          <TextField
            id="username"
            label="Username"
            type="text"
            autoComplete="username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Field label="Password" htmlFor="password" required>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
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

          <Button type="submit" variant="secondary" size="lg" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  );
}
