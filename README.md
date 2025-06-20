# Skincare App - Authentication System

A comprehensive authentication system built with Supabase, React, and TypeScript.

## Features

### 🔐 Authentication
- **Email/Password Authentication**: Secure signup and login
- **Google OAuth Integration**: One-click social authentication
- **Password Reset**: Email-based password recovery
- **Email Verification**: Secure account verification process

### 👤 User Management
- **User Profiles**: Extended profile system with avatars and bio
- **Session Tracking**: Monitor active sessions and login history
- **Account Security**: Password updates and session management

### 🛡️ Security
- **Row Level Security (RLS)**: Database-level access control
- **Protected Routes**: Client-side route protection
- **Data Validation**: Input sanitization and validation
- **Session Management**: Secure token handling and refresh

## Setup Instructions

### 1. Supabase Configuration

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Run the migration file to set up the database schema
3. Configure authentication providers in Supabase dashboard

### 2. Google OAuth Setup (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing one
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://your-project.supabase.co/auth/v1/callback`
   - `http://localhost:5173/auth/callback` (for development)

### 3. Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_APP_URL=http://localhost:5173
```

### 4. Supabase Dashboard Configuration

#### Authentication Settings:
1. Go to Authentication > Settings
2. Configure Site URL: `http://localhost:5173`
3. Add Redirect URLs:
   - `http://localhost:5173/auth/callback`
   - `https://yourdomain.com/auth/callback`

#### Google OAuth Provider:
1. Go to Authentication > Providers
2. Enable Google provider
3. Add your Google Client ID and Secret

#### Storage Setup (for avatars):
1. Go to Storage
2. Create a new bucket named `avatars`
3. Set bucket to public
4. Add RLS policies for avatar uploads

### 5. Database Schema

The migration file creates:
- `user_profiles` table for extended user information
- `user_sessions` table for session tracking
- RLS policies for secure data access
- Triggers for automatic profile creation

## Usage

### Authentication Context

```tsx
import { useAuth } from './context/AuthContext';

function MyComponent() {
  const { 
    user, 
    profile, 
    signIn, 
    signUp, 
    signOut,
    updateProfile 
  } = useAuth();
  
  // Use authentication methods
}
```

### Protected Routes

```tsx
import ProtectedRoute from './components/auth/ProtectedRoute';

<ProtectedRoute requireEmailVerification={true}>
  <DashboardPage />
</ProtectedRoute>
```

### Profile Management

```tsx
// Update user profile
await updateProfile({
  full_name: 'John Doe',
  bio: 'Skincare enthusiast'
});

// Upload avatar
await uploadAvatar(file);
```

## Security Best Practices

1. **Environment Variables**: Never commit sensitive keys to version control
2. **RLS Policies**: All database access is secured with Row Level Security
3. **Input Validation**: All user inputs are validated and sanitized
4. **Session Management**: Secure token storage and automatic refresh
5. **HTTPS Only**: Use HTTPS in production for secure data transmission

## Database Schema

### user_profiles
- `id`: UUID primary key
- `user_id`: Reference to auth.users
- `username`: Unique username
- `email`: User email
- `full_name`: Display name
- `avatar_url`: Profile picture URL
- `bio`: User biography
- `preferences`: JSON preferences object
- `created_at`: Account creation timestamp
- `updated_at`: Last profile update
- `last_login`: Last login timestamp

### user_sessions
- `id`: UUID primary key
- `user_id`: Reference to auth.users
- `session_token`: Session identifier
- `ip_address`: Login IP address
- `user_agent`: Browser/device information
- `login_method`: Authentication method used
- `created_at`: Session creation time
- `expires_at`: Session expiration time
- `is_active`: Session status

## API Reference

### AuthService Methods

- `signUp(email, password, userData)`: Create new account
- `signIn(email, password)`: Authenticate user
- `signInWithGoogle()`: Google OAuth authentication
- `signOut()`: End user session
- `resetPassword(email)`: Send password reset email
- `updatePassword(newPassword)`: Update user password
- `getUserProfile(userId)`: Fetch user profile
- `updateUserProfile(userId, updates)`: Update profile data
- `uploadAvatar(userId, file)`: Upload profile picture

## Error Handling

The system includes comprehensive error handling:
- Network errors
- Authentication failures
- Validation errors
- Database constraints
- File upload errors

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.