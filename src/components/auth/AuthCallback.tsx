import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { authService } from '../../lib/auth';

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check for error in URL params
        const errorParam = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');
        
        if (errorParam) {
          console.error('OAuth error:', errorParam, errorDescription);
          setError(errorDescription || errorParam);
          setTimeout(() => navigate('/auth/login?error=oauth_failed'), 3000);
          return;
        }

        // Handle the OAuth callback
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          setError(error.message);
          setTimeout(() => navigate('/auth/login?error=auth_callback_failed'), 3000);
          return;
        }

        if (data.session?.user) {
          // Create session record for OAuth login
          await authService.createSessionRecord(data.session.user.id, 'google');
          
          // Successfully authenticated - redirect to dashboard
          navigate('/dashboard', { replace: true });
        } else {
          // No session found
          setError('No authentication session found');
          setTimeout(() => navigate('/auth/login'), 3000);
        }
      } catch (error: any) {
        console.error('Unexpected error in auth callback:', error);
        setError('An unexpected error occurred');
        setTimeout(() => navigate('/auth/login?error=unexpected_error'), 3000);
      }
    };

    handleAuthCallback();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
      <div className="text-center max-w-md mx-auto p-8">
        {error ? (
          <div className="space-y-4">
            <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900">Authentication Failed</h2>
            <p className="text-gray-600">{error}</p>
            <p className="text-sm text-gray-500">Redirecting to login page...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600 mx-auto"></div>
            <h2 className="text-xl font-semibold text-gray-900">Completing authentication...</h2>
            <p className="text-gray-600">Please wait while we sign you in.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthCallback;