import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth';
import { useAuth } from '../contexts/AuthContext';

export function OAuthCallback() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [status, setStatus] = useState<'checking' | 'success' | 'error'>('checking');

  useEffect(() => {
    const checkAuthAndRedirect = async () => {
      try {
        // Wait a bit for the session cookie to be set by the backend redirect
        // Try multiple times in case the cookie takes time to propagate
        let currentUser = null;
        let attempts = 0;
        const maxAttempts = 10; // Increased attempts
        
        while (!currentUser && attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 300));
          try {
            currentUser = await authService.getCurrentUser();
            if (currentUser && currentUser.id) {
              break; // Found user, exit loop
            }
          } catch (error) {
            // Continue trying
            console.log(`Attempt ${attempts + 1} failed, retrying...`);
          }
          attempts++;
        }
        
        if (currentUser && currentUser.id) {
          setStatus('success');
          // Update the auth context with the user
          setUser(currentUser);
          // Small delay to ensure state is updated
          await new Promise(resolve => setTimeout(resolve, 100));
          // User is authenticated, redirect based on onboarding status
          if (currentUser.onboarding_completed) {
            navigate('/workspace/dashboard', { replace: true });
          } else {
            navigate('/onboarding', { replace: true });
          }
        } else {
          setStatus('error');
          console.error('OAuth callback: Could not authenticate user after', maxAttempts, 'attempts');
          // Not authenticated, redirect to login
          setTimeout(() => {
            navigate('/login?error=oauth_failed', { replace: true });
          }, 2000);
        }
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/login?error=oauth_failed', { replace: true });
        }, 2000);
      }
    };

    checkAuthAndRedirect();
  }, [navigate, setUser]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === 'checking' && (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-slate-600">Completing login...</p>
          </>
        )}
        {status === 'success' && (
          <>
            <div className="text-green-600 text-4xl mb-4">✓</div>
            <p className="text-slate-600">Login successful! Redirecting...</p>
          </>
        )}
        {status === 'error' && (
          <>
            <div className="text-red-600 text-4xl mb-4">✗</div>
            <p className="text-slate-600">Login failed. Redirecting to login page...</p>
          </>
        )}
      </div>
    </div>
  );
}

