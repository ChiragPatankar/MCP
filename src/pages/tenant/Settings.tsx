import React, { useState } from 'react';
import { Settings as SettingsIcon, Key, Bell, Shield, User, Building, Mail, Save, Eye, EyeOff, Copy, Check, RefreshCw, AlertTriangle, Palette, Globe, Zap, Lock } from 'lucide-react';
import TenantLayout from '@/components/layout/TenantLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';

const SettingsCard = ({ icon, title, description, children, gradient }: {
  icon: React.ReactNode;
  title: string;
  description?: string;
  children: React.ReactNode;
  gradient: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    whileHover={{ y: -2 }}
  >
    <Card className="bg-white border-0 shadow-soft hover:shadow-large transition-all duration-300 overflow-hidden">
      <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl ${gradient} opacity-10 rounded-full blur-xl`}></div>
      <CardHeader className="border-b border-gray-100 relative">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900">{title}</CardTitle>
            {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6 relative">
        {children}
      </CardContent>
    </Card>
  </motion.div>
);

const TenantSettings = () => {
  const { user } = useAuth();
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyCopied, setApiKeyCopied] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    company: 'Your Company Name',
    avatar: user?.avatar || ''
  });

  const [notifications, setNotifications] = useState({
    email: true,
    chatWidget: true,
    systemAlerts: true,
    weeklyReports: false,
    marketingEmails: false
  });

  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: true,
    ipWhitelist: false,
    auditLogs: true
  });

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('sk-1234567890abcdef1234567890abcdef');
    setApiKeyCopied(true);
    setTimeout(() => setApiKeyCopied(false), 2000);
  };

  return (
    <TenantLayout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="space-y-8 pb-8">
          {/* Modern Header */}
          <div className="bg-white border-b border-gray-100 -mx-6 px-6 py-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
              <div className="space-y-3">
                <div className="flex items-center space-x-4">
                  <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-primary-600 to-purple-600 bg-clip-text text-transparent">
                    Settings
                  </h1>
                  <div className="flex items-center bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full shadow-sm">
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    <span className="text-sm font-medium">Configuration</span>
                  </div>
                </div>
                <p className="text-lg text-gray-600 max-w-2xl">
                  Customize your account settings, security preferences, and notification options.
                </p>
              </div>
              
              <div className="mt-6 lg:mt-0 flex items-center space-x-3">
                <Button variant="outline" className="btn-secondary">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset to Defaults
                </Button>
                <Button className="btn-modern">
                  <Save className="h-4 w-4 mr-2" />
                  Save All Changes
                </Button>
              </div>
            </div>
          </div>

          <div className="px-6">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Profile Settings */}
              <SettingsCard
                icon={<User className="h-6 w-6" />}
                title="Profile Settings"
                description="Manage your personal information and account details"
                gradient="from-blue-500 to-cyan-500"
              >
                <div className="space-y-6">
                  {/* Avatar Section */}
                  <div className="flex items-center space-x-6">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {profileForm.name.charAt(0) || 'U'}
                    </div>
                    <div>
                      <Button variant="outline" className="mb-2">
                        Upload Photo
                      </Button>
                      <p className="text-xs text-gray-500">JPG, PNG or GIF (max. 2MB)</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                        value={profileForm.name}
                        onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                      <input
                        type="email"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                        value={profileForm.email}
                        onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 transition-all"
                        value={profileForm.company}
                        onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        placeholder="Enter your company name"
                      />
                    </div>
                  </div>

                  <Button className="w-full btn-modern">
                    <Save className="h-4 w-4 mr-2" />
                    Save Profile Changes
                  </Button>
                </div>
              </SettingsCard>

              {/* API Configuration */}
              <SettingsCard
                icon={<Key className="h-6 w-6" />}
                title="API Configuration"
                description="Manage your API keys and integration settings"
                gradient="from-green-500 to-emerald-500"
              >
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                    <div className="relative">
                      <input
                        type={showApiKey ? "text" : "password"}
                        className="w-full px-4 py-3 pr-24 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 transition-all font-mono text-sm"
                        value="sk-1234567890abcdef1234567890abcdef"
                        readOnly
                      />
                      <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex space-x-1">
                        <button
                          onClick={() => setShowApiKey(!showApiKey)}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                        <button
                          onClick={handleCopyApiKey}
                          className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          {apiKeyCopied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Keep your API key secure and never share it publicly</p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                    <div className="flex items-start space-x-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="text-sm font-medium text-yellow-800">Security Notice</h4>
                        <p className="text-xs text-yellow-700 mt-1">Regenerating your API key will invalidate the current one and may break existing integrations.</p>
                      </div>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full border-red-200 text-red-600 hover:bg-red-50">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Regenerate API Key
                  </Button>
                </div>
              </SettingsCard>

              {/* Notification Settings */}
              <SettingsCard
                icon={<Bell className="h-6 w-6" />}
                title="Notification Preferences"
                description="Choose how and when you want to be notified"
                gradient="from-purple-500 to-pink-500"
              >
                <div className="space-y-6">
                  {Object.entries({
                    email: 'Email Notifications',
                    chatWidget: 'Chat Widget Alerts',
                    systemAlerts: 'System Status Updates',
                    weeklyReports: 'Weekly Performance Reports',
                    marketingEmails: 'Marketing Communications'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div>
                        <p className="font-medium text-gray-900">{label}</p>
                        <p className="text-sm text-gray-500">
                          {key === 'email' && 'Receive important updates via email'}
                          {key === 'chatWidget' && 'Get notified when someone uses your chat widget'}
                          {key === 'systemAlerts' && 'System maintenance and status notifications'}
                          {key === 'weeklyReports' && 'Weekly analytics and performance summary'}
                          {key === 'marketingEmails' && 'Product updates and feature announcements'}
                        </p>
                      </div>
                      <button
                        onClick={() => setNotifications({ ...notifications, [key]: !notifications[key as keyof typeof notifications] })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          notifications[key as keyof typeof notifications] ? 'bg-purple-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            notifications[key as keyof typeof notifications] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <Button className="w-full btn-modern">
                    <Save className="h-4 w-4 mr-2" />
                    Save Notification Settings
                  </Button>
                </div>
              </SettingsCard>

              {/* Security Settings */}
              <SettingsCard
                icon={<Shield className="h-6 w-6" />}
                title="Security & Privacy"
                description="Manage your account security and privacy settings"
                gradient="from-red-500 to-orange-500"
              >
                <div className="space-y-6">
                  {Object.entries({
                    twoFactor: 'Two-Factor Authentication',
                    sessionTimeout: 'Auto Session Timeout (2 hours)',
                    ipWhitelist: 'IP Address Whitelist',
                    auditLogs: 'Security Audit Logs'
                  }).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <Lock className="h-5 w-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">{label}</p>
                          <p className="text-sm text-gray-500">
                            {key === 'twoFactor' && 'Add an extra layer of security to your account'}
                            {key === 'sessionTimeout' && 'Automatically log out after period of inactivity'}
                            {key === 'ipWhitelist' && 'Restrict access to specific IP addresses'}
                            {key === 'auditLogs' && 'Keep detailed logs of security events'}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSecurity({ ...security, [key]: !security[key as keyof typeof security] })}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          security[key as keyof typeof security] ? 'bg-red-600' : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            security[key as keyof typeof security] ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}

                  <Button className="w-full btn-modern">
                    <Save className="h-4 w-4 mr-2" />
                    Update Security Settings
                  </Button>
                </div>
              </SettingsCard>
            </div>

            {/* Danger Zone */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <Card className="bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-soft">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center text-white shadow-lg">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-red-700">Danger Zone</CardTitle>
                      <p className="text-sm text-red-600 mt-1">Irreversible actions that will affect your account</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 bg-white/80 rounded-xl border border-red-100">
                    <h4 className="font-medium text-red-800 mb-2">Delete Account</h4>
                    <p className="text-sm text-red-600 mb-4">
                      Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700">
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </TenantLayout>
  );
};

export default TenantSettings;