import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to log in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Welcome back</h2>
        <p className="mt-2 text-sm text-gray-600">
          Log in to your account to continue your skincare journey
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
          <span className="text-sm text-error-700">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          id="email"
          type="email"
          label="Email address"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
        />
        
        <div>
          <div className="flex items-center justify-between">
            <Input
              id="password"
              type="password"
              label="Password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
            />
          </div>
          <div className="text-right mt-1">
            <Link to="/auth/forgot-password" className="text-xs text-primary-600 hover:text-primary-500">
              Forgot your password?
            </Link>
          </div>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to="/auth/signup" className="font-medium text-primary-600 hover:text-primary-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;