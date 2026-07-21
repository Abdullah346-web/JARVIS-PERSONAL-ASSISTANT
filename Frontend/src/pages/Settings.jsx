import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, Moon, Sun, Volume2, Bell, LogOut } from 'lucide-react';
import { settingsService, assistantService } from '../services/api';
import { useAuthStore, useSettingsStore } from '../context/store';
import { containerVariants, itemVariants } from '../animations/variants';

const Settings = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const [settings, setSettings] = useState(null);
  const [assistant, setAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAssistantName, setNewAssistantName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const [settingsRes, assistantRes] = await Promise.all([
          settingsService.getSettings(),
          assistantService.getUserAssistant(),
        ]);

        setSettings(settingsRes.data.settings);
        setAssistant(assistantRes.data.assistant);
        setNewAssistantName(assistantRes.data.assistant.customName);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load settings');
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  const handleUpdateSetting = async (key, value) => {
    try {
      const response = await settingsService.updateUserSettings({
        [key]: value,
      });

      setSettings(response.data.settings);
      toast.success('Setting updated');
    } catch (error) {
      toast.error('Failed to update setting');
    }
  };

  const handleUpdateAssistantName = async () => {
    if (!newAssistantName.trim()) {
      toast.error('Please enter a name');
      return;
    }

    try {
      const response = await assistantService.updateAssistant({
        assistantId: assistant._id,
        customName: newAssistantName.trim(),
      });

      setAssistant(response.data.assistant);
      setShowNameInput(false);
      toast.success('Assistant name updated');
    } catch (error) {
      toast.error('Failed to update assistant name');
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="w-16 h-16 border-4 border-neon-blue/30 border-t-neon-blue rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-950 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute w-96 h-96 bg-neon-yellow/10 rounded-full blur-3xl top-20 right-20 animate-pulse" />
        <div className="absolute w-96 h-96 bg-neon-orange/10 rounded-full blur-3xl bottom-20 left-20 animate-pulse" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="p-2 bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 rounded-lg text-gray-300 transition"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-4xl font-bold text-white">Settings</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Settings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Assistant Name */}
            <motion.div
              variants={itemVariants}
              className="bg-dark-900/50 backdrop-blur-xl border border-neon-blue/20 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Assistant Settings</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Assistant Name
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newAssistantName}
                      onChange={(e) => setNewAssistantName(e.target.value)}
                      disabled={!showNameInput}
                      className="flex-1 bg-dark-800/50 border border-neon-blue/30 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition disabled:opacity-50"
                    />
                    {!showNameInput ? (
                      <button
                        onClick={() => setShowNameInput(true)}
                        className="px-4 py-2 bg-neon-blue/20 border border-neon-blue/50 rounded-lg text-neon-blue hover:bg-neon-blue/30 transition"
                      >
                        Edit
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleUpdateAssistantName}
                          className="px-4 py-2 bg-green-500/20 border border-green-500/50 rounded-lg text-green-400 hover:bg-green-500/30 transition"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setShowNameInput(false);
                            setNewAssistantName(assistant.customName);
                          }}
                          className="px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 hover:bg-red-500/30 transition"
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Display Settings */}
            <motion.div
              variants={itemVariants}
              className="bg-dark-900/50 backdrop-blur-xl border border-neon-purple/20 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Display Settings</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {settings?.theme === 'dark' ? <Moon size={20} className="text-neon-blue" /> : <Sun size={20} className="text-neon-yellow" />}
                    <span className="text-gray-300">Theme</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleUpdateSetting('theme', 'dark')}
                      className={`px-4 py-2 rounded-lg transition ${
                        settings?.theme === 'dark'
                          ? 'bg-neon-blue/30 border border-neon-blue/50 text-neon-blue'
                          : 'bg-dark-800/50 border border-dark-700/50 text-gray-400'
                      }`}
                    >
                      Dark
                    </button>
                    <button
                      onClick={() => handleUpdateSetting('theme', 'light')}
                      className={`px-4 py-2 rounded-lg transition ${
                        settings?.theme === 'light'
                          ? 'bg-neon-yellow/30 border border-neon-yellow/50 text-neon-yellow'
                          : 'bg-dark-800/50 border border-dark-700/50 text-gray-400'
                      }`}
                    >
                      Light
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Voice Settings */}
            <motion.div
              variants={itemVariants}
              className="bg-dark-900/50 backdrop-blur-xl border border-neon-green/20 rounded-xl p-6"
            >
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Volume2 size={24} />
                Voice Settings
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Voice Speed: {settings?.voiceSpeed}x
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings?.voiceSpeed || 1}
                    onChange={(e) => handleUpdateSetting('voiceSpeed', parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Voice Gender</label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleUpdateSetting('voiceGender', 'male')}
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        settings?.voiceGender === 'male'
                          ? 'bg-neon-blue/30 border border-neon-blue/50 text-neon-blue'
                          : 'bg-dark-800/50 border border-dark-700/50 text-gray-400'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => handleUpdateSetting('voiceGender', 'female')}
                      className={`flex-1 px-4 py-2 rounded-lg transition ${
                        settings?.voiceGender === 'female'
                          ? 'bg-neon-pink/30 border border-neon-pink/50 text-neon-pink'
                          : 'bg-dark-800/50 border border-dark-700/50 text-gray-400'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Notification Settings */}
            <motion.div
              variants={itemVariants}
              className="bg-dark-900/50 backdrop-blur-xl border border-neon-cyan/20 rounded-xl p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell size={24} className="text-neon-cyan" />
                  <span className="text-gray-300">Enable Notifications</span>
                </div>
                <button
                  onClick={() => handleUpdateSetting('notificationsEnabled', !settings?.notificationsEnabled)}
                  className={`w-12 h-6 rounded-full transition ${
                    settings?.notificationsEnabled ? 'bg-neon-cyan/50' : 'bg-gray-600/50'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-white transition-all ${
                      settings?.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Assistant Info Card */}
            <div className="bg-dark-900/50 backdrop-blur-xl border border-neon-blue/20 rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Current Assistant</h3>
              <div className="space-y-4">
                <div className="relative w-32 h-32 rounded-xl overflow-hidden border-2 border-neon-blue/50 mx-auto">
                  <img
                    src={assistant?.avatar}
                    alt={assistant?.customName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="text-center">
                  <p className="text-neon-blue font-bold text-lg">{assistant?.customName}</p>
                  <p className="text-gray-400 text-sm">{assistant?.assistantType}</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <motion.div
              variants={itemVariants}
              className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-xl p-6"
            >
              <h3 className="text-xl font-bold text-red-400 mb-4">Danger Zone</h3>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg font-bold transition"
              >
                <LogOut size={18} />
                Logout
              </motion.button>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;
