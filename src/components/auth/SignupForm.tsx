import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, Eye, EyeOff, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import { useAuth } from '../../context/AuthContext';
import GoogleSignInButton from './GoogleSignInButton';

const SignupForm: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      await signUp(formData.email, formData.password, {
        full_name: formData.fullName,
        username: formData.username
      });
      
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
    return (
      <div className="max-w-md w-full mx-auto text-center">
        <div className="mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-3xl font-display font-bold text-gray-900">Check your email</h2>
          <p className="mt-2 text-sm text-gray-600">
            We've sent a verification link to <strong>{formData.email}</strong>
          </p>
        </div>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Click the link in the email to verify your account and complete the signup process.
          </p>
          
          <Button
            onClick={() => navigate('/auth/login')}
            className="w-full"
          >
            Continue to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-gray-900">Create your account</h2>
        <p className="mt-2 text-sm text-gray-600">
          Sign up to start your skincare journey
        </p>
      </div>
      
      {error && (
        <div className="mb-4 p-4 bg-error-50 border border-error-200 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-error-500 mr-2" />
          <span className="text-sm text-error-700">{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            label="Full Name"
            placeholder="John Doe"
            value={formData.fullName}
            onChange={handleChange}
            required
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
          
          <Input
            id="username"
            name="username"
            type="text"
            label="Username"
            placeholder="johndoe"
            value={formData.username}
            onChange={handleChange}
            leftIcon={<User className="h-5 w-5 text-gray-400" />}
          />
        </div>
        
        <Input
          id="email"
          name="email"
          type="email"
          label="Email address"
          placeholder="john@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
        />
        
        <Input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          label="Password"
          placeholder="Create a password"
          value={formData.password}
          onChange={handleChange}
          required
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />
        
        <Input
          id="confirmPassword"
          name="confirmPassword"
          type={showConfirmPassword ? "text" : "password"}
          label="Confirm Password"
          placeholder="Confirm your password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          leftIcon={<Lock className="h-5 w-5 text-gray-400" />}
          rightIcon={
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          }
        />
        
        <div className="text-xs text-gray-600">
          By creating an account, you agree to our{' '}
          <Link to="/terms" className="text-primary-600 hover:text-primary-500">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
            Privacy Policy
          </Link>
        </div>
        
        <Button
          type="submit"
          className="w-full"
          isLoading={isLoading}
        >
          Create Account
        </Button>
      </form>
      
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or continue with</span>
          </div>
        </div>
        
        <div className="mt-6">
          <GoogleSignInButton />
        </div>
      </div>
      
      <div className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/auth/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;