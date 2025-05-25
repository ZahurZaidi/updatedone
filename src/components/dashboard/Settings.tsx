"use client"

import { useState } from "react"
import Card from "../common/Card"
import Button from "../common/Button"
import {
  Camera,
  Shield,
  Trash2,
  Save,
  AlertTriangle,
  Info,
  Eye,
  EyeOff,
  Smartphone,
  Mail,
  Lock,
} from "lucide-react"

export default function Settings() {
  const [showPassword, setShowPassword] = useState(false)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    routine: true,
    progress: false,
    tips: true,
  })

  const [profile, setProfile] = useState({
    name: "Jane Doe",
    email: "jane@example.com",
    age: "28",
    skinType: "combination",
    concerns: "acne, dryness",
    allergies: "fragrance, sulfates",
    bio: "Skincare enthusiast on a journey to healthier skin",
  })

  const [activeTab, setActiveTab] = useState("profile")

  const handleProfileUpdate = (field: string, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }))
  }

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications((prev) => ({ ...prev, [type]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and preferences</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="bg-teal-100 text-teal-800 px-2 py-1 rounded inline-flex items-center">
            <Shield className="w-3 h-3 mr-1" />
            Account Verified
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="space-y-6">
        <div className="flex gap-2 mb-4">
          <button
            className={`px-4 py-2 rounded ${activeTab === "profile" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "notifications" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "privacy" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("privacy")}
          >
            Privacy
          </button>
          <button
            className={`px-4 py-2 rounded ${activeTab === "account" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("account")}
          >
            Account
          </button>
        </div>

        {/* Profile Settings */}
        {activeTab === "profile" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Picture */}
            <Card className="border-0 shadow-md">
              <div className="p-6">
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-600">
                    JD
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Upload
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 text-center">Recommended: Square image, at least 200x200px</p>
                </div>
              </div>
            </Card>
            {/* Basic Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <span className="text-lg font-semibold">Basic Information</span>
                  <p className="text-gray-600 mb-4">Update your personal details</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        id="name"
                        value={profile.name}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileUpdate("name", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="text-sm font-medium text-gray-700">Email Address</label>
                      <input
                        id="email"
                        type="email"
                        value={profile.email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileUpdate("email", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="age" className="text-sm font-medium text-gray-700">Age</label>
                      <input
                        id="age"
                        type="number"
                        value={profile.age}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileUpdate("age", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label htmlFor="skin-type" className="text-sm font-medium text-gray-700">Skin Type</label>
                      <select
                        id="skin-type"
                        value={profile.skinType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleProfileUpdate("skinType", e.target.value)}
                        className="w-full border rounded px-3 py-2"
                      >
                        <option value="oily">Oily</option>
                        <option value="dry">Dry</option>
                        <option value="combination">Combination</option>
                        <option value="sensitive">Sensitive</option>
                        <option value="normal">Normal</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className="text-sm font-medium text-gray-700">Bio</label>
                    <textarea
                      id="bio"
                      placeholder="Tell us about your skincare journey..."
                      value={profile.bio}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProfileUpdate("bio", e.target.value)}
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                </div>
              </Card>
              {/* Skin Information */}
              <Card className="border-0 shadow-md">
                <div className="p-6">
                  <span className="text-lg font-semibold">Skin Information</span>
                  <p className="text-gray-600 mb-4">Help us personalize your experience</p>
                  <div>
                    <label htmlFor="concerns" className="text-sm font-medium text-gray-700">Primary Skin Concerns</label>
                    <input
                      id="concerns"
                      placeholder="e.g., acne, dryness, aging"
                      value={profile.concerns}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleProfileUpdate("concerns", e.target.value)}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <div>
                    <label htmlFor="allergies" className="text-sm font-medium text-gray-700">Known Allergies & Sensitivities</label>
                    <textarea
                      id="allergies"
                      placeholder="List any ingredients or products that cause reactions..."
                      value={profile.allergies}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleProfileUpdate("allergies", e.target.value)}
                      rows={3}
                      className="w-full border rounded px-3 py-2"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 mt-4">
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}
        {/* Notification Settings */}
        {activeTab === "notifications" && (
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Notification Preferences</span>
              <p className="text-gray-600 mb-4">Choose how you want to be notified</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Mail className="w-4 h-4 text-gray-500" />
                      <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">Email Notifications</label>
                    </div>
                    <p className="text-sm text-gray-500">Receive updates via email</p>
                  </div>
                  <input
                    id="email-notifications"
                    type="checkbox"
                    checked={notifications.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange("email", e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-gray-500" />
                      <label htmlFor="push-notifications" className="text-sm font-medium text-gray-700">Push Notifications</label>
                    </div>
                    <p className="text-sm text-gray-500">Receive notifications on your device</p>
                  </div>
                  <input
                    id="push-notifications"
                    type="checkbox"
                    checked={notifications.push}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange("push", e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="routine-reminders" className="text-sm font-medium text-gray-700">Routine Reminders</label>
                    <p className="text-sm text-gray-500">Daily reminders for your skincare routine</p>
                  </div>
                  <input
                    id="routine-reminders"
                    type="checkbox"
                    checked={notifications.routine}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange("routine", e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="progress-updates" className="text-sm font-medium text-gray-700">Progress Updates</label>
                    <p className="text-sm text-gray-500">Weekly progress summaries</p>
                  </div>
                  <input
                    id="progress-updates"
                    type="checkbox"
                    checked={notifications.progress}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange("progress", e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <label htmlFor="tips-recommendations" className="text-sm font-medium text-gray-700">Tips & Recommendations</label>
                    <p className="text-sm text-gray-500">Personalized skincare tips</p>
                  </div>
                  <input
                    id="tips-recommendations"
                    type="checkbox"
                    checked={notifications.tips}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleNotificationChange("tips", e.target.checked)}
                    className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                  />
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-left flex items-start">
                <Info className="h-4 w-4 mr-2 mt-0.5" />
                <span className="text-sm">
                  You can change these preferences at any time. Critical security notifications will always be sent.
                </span>
              </div>
            </div>
          </Card>
        )}
        {/* Privacy Settings */}
        {activeTab === "privacy" && (
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Privacy & Security</span>
              <p className="text-gray-600 mb-4">Control your privacy and security settings</p>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Profile Visibility</span>
                    <p className="text-sm text-gray-500">Make your profile visible to other users</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Progress Sharing</span>
                    <p className="text-sm text-gray-500">Allow sharing of anonymized progress data</p>
                  </div>
                  <input type="checkbox" className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-sm font-medium text-gray-700">Analytics</span>
                    <p className="text-sm text-gray-500">Help improve the app with usage analytics</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 text-teal-600 border-gray-300 rounded focus:ring-teal-500" />
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <h3 className="font-medium text-gray-900">Change Password</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="current-password" className="text-sm font-medium text-gray-700">Current Password</label>
                    <div className="relative">
                      <input id="current-password" type={showPassword ? "text" : "password"} className="w-full border rounded px-3 py-2 pr-10" />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label htmlFor="new-password" className="text-sm font-medium text-gray-700">New Password</label>
                    <input id="new-password" type="password" className="w-full border rounded px-3 py-2" />
                  </div>
                </div>
                <Button variant="outline" className="mt-4">
                  <Lock className="w-4 h-4 mr-2" />
                  Update Password
                </Button>
              </div>
            </div>
          </Card>
        )}
        
        {/* Account Settings */}
        {activeTab === "account" && (
          <Card className="border-0 shadow-md">
            <div className="p-6">
              <span className="text-lg font-semibold">Account Settings</span>
              <p className="text-gray-600 mb-4">Manage your account and subscription</p>
              <div className="space-y-4">

                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Account Status</h3>
                  <div className="flex items-center space-x-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">Active</span>
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">Verified</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900">Member Since</h3>
                  <p className="text-sm text-gray-600">January 15, 2024</p>
                </div>
              </div>
              <div className="border-t pt-6 mt-6">
                <h3 className="font-medium text-red-900 mb-4">Danger Zone</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-red-50 rounded-lg flex items-start">
                    <AlertTriangle className="h-4 w-4 mr-2 mt-0.5" />
                    <span className="text-sm">
                      <strong>Delete Account:</strong> This action cannot be undone. All your data will be permanently deleted.
                    </span>
                  </div>
                  <Button variant="danger">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
