import { useEffect, useState } from 'react';
import type { FormEvent, ReactNode } from 'react';
import { Button } from '../../components/Button';
import { Field } from '../../components/Field';
import { getErrorMessage } from '../../config/api';
import { fetchDemoStatus, verifyDemoAccess } from './demo.api';

export function DemoGate({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'locked' | 'open'>('loading');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetchDemoStatus().then((ok) => {
      if (!cancelled) setStatus(ok ? 'open' : 'locked');
    });
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!code.trim()) return;
    setError('');
    setSubmitting(true);
    try {
      await verifyDemoAccess(code.trim());
      setStatus('open');
    } catch (err) {
      setError(getErrorMessage(err, 'Could not verify that code. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  if (status === 'open') {
    return <>{children}</>;
  }

  if (status === 'loading') {
    return null;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-4 py-20">
      <div className="w-full max-w-md">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.3em] text-green-700">
          The Point One Club
        </p>
        <h1 className="display-heading mt-2 text-center text-5xl text-ink">
          The .1%<span className="text-red-500">.</span>
        </h1>
        <p className="mt-3 text-center leading-relaxed text-ink-muted">
          This demo is invite-only. Enter the access code you were given.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-xl bg-surface p-6 shadow-card">
          <Field label="Access code" htmlFor="demo-code" required>
            <input
              id="demo-code"
              type="password"
              autoComplete="off"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full rounded-sm border border-ink/15 bg-surface px-3 py-2 text-sm outline-none transition-colors focus:border-green-700 focus:ring-2 focus:ring-green-700/20"
            />
          </Field>

          {error && (
            <p className="rounded-sm bg-red-100 px-3 py-2 text-sm font-medium text-red-700">{error}</p>
          )}

          <Button type="submit" variant="primary" size="lg" disabled={submitting}>
            {submitting ? 'Checking…' : 'Enter the club'}
          </Button>
        </form>
      </div>
    </div>
  );
}
