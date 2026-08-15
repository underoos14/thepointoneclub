import { useState } from 'react';
import type { FormEvent } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { TextField } from '../../components/Field';
import { getErrorMessage } from '../../config/api';
import { useAuth } from './AuthContext';

export function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const me = await login({ email, password });
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
            id="email"
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            id="password"
            label="Password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

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
