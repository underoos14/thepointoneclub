import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getErrorMessage } from '../../config/api';
import { useAuth } from '../auth/AuthContext';
import { registerForEvent } from './registrations.api';

export function useRegisterAction(eventId: string, onRegistered: () => Promise<void>) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  const handleRegister = async (paymentUrl?: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    setBusy(true);
    try {
      await registerForEvent(eventId);
      await onRegistered();
      if (paymentUrl) {
        window.open(paymentUrl, '_blank', 'noopener,noreferrer');
      }
    } catch (err) {
      alert(getErrorMessage(err, 'Could not register for this event.'));
    } finally {
      setBusy(false);
    }
  };

  return { user, busy, handleRegister };
}
