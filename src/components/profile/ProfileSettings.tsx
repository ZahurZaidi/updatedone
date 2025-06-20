import React, { useState, useRef } from 'react';
import { Camera, Save, User, Mail, AlertCircle, CheckCircle } from 'lucide-react';
import Button from '../common/Button';
import Input from '../common/Input';
import Card from '../common/Card';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings: React.FC = () => {
  const { user, profile, updateProfile, uploadAvatar } = useAuth();
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
    username: profile?.username || '',
    bio: profile?.bio || '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setMessage({ type: 'error', text: 'Please select an image file' });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be less than 5MB' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      await uploadAvatar(file);
      setMessage({ type: 'success', text: 'Avatar updated successfully!' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card className="border-0 shadow-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-6">Profile Settings</h2>

          {message && (
            <div className={`mb-4 p-4 rounded-md flex items-center ${
              message.type === 'success' 
                ? 'bg-green-50 border border-green-200' 
                : 'bg-red-50 border border-red-200'
            }`}>
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              )}
              <span className={`text-sm ${
                message.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {message.text}
              </span>
            </div>
          )}

          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-8">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 bg-primary-600 text-white rounded-full p-2 hover:bg-primary-700 transition-colors"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
              />
            </div>
            <div>
              <h3 className="font-medium text-gray-900">{profile?.full_name || 'Your Name'}</h3>
              <p className="text-sm text-gray-500">@{profile?.username || 'username'}</p>
              <p className="text-xs text-gray-400 mt-1">
                Click the camera icon to upload a new avatar
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                id="full_name"
                name="full_name"
                type="text"
                label="Full Name"
                value={formData.full_name}
                onChange={handleChange}
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
              />

              <Input
                id="username"
                name="username"
                type="text"
                label="Username"
                value={formData.username}
                onChange={handleChange}
                leftIcon={<User className="h-5 w-5 text-gray-400" />}
              />
            </div>

            <Input
              id="email"
              type="email"
              label="Email Address"
              value={user?.email || ''}
              disabled
              leftIcon={<Mail className="h-5 w-5 text-gray-400" />}
              helperText="Email cannot be changed. Contact support if needed."
            />

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                rows={4}
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
              />
            </div>

            <Button
              type="submit"
              isLoading={isLoading}
              leftIcon={<Save className="h-4 w-4" />}
              className="w-full md:w-auto"
            >
              Save Changes
            </Button>
          </form>
        </div>
      </Card>

      {/* Account Information */}
      <Card className="border-0 shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Account Information</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Member since:</span>
              <span className="font-medium">
                {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Last login:</span>
              <span className="font-medium">
                {profile?.last_login ? new Date(profile.last_login).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email verified:</span>
              <span className={`font-medium ${user?.email_confirmed_at ? 'text-green-600' : 'text-red-600'}`}>
                {user?.email_confirmed_at ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileSettings;