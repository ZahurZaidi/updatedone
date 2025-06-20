import React from 'react';
import { AlertTriangle, Settings } from 'lucide-react';

const EnvironmentBanner: React.FC = () => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Don't show banner if environment variables are properly configured
  if (supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('your-project') && !supabaseAnonKey.includes('your-anon-key')) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <AlertTriangle className="h-5 w-5 text-yellow-400" />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            <strong>Demo Mode:</strong> This is a demonstration version. Database features are not available because Supabase environment variables are not configured.
          </p>
          <div className="mt-2">
            <div className="text-sm">
              <p className="text-yellow-700 mb-2">To enable full functionality, configure these environment variables:</p>
              <ul className="list-disc list-inside text-yellow-600 space-y-1">
                <li><code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_URL</code> - Your Supabase project URL</li>
                <li><code className="bg-yellow-100 px-1 rounded">VITE_SUPABASE_ANON_KEY</code> - Your Supabase anonymous key</li>
              </ul>
              <p className="text-yellow-700 mt-2">
                <Settings className="inline h-4 w-4 mr-1" />
                You can still explore the UI and see how the app works!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentBanner;