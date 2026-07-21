import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Sparkles, ChevronRight } from 'lucide-react';
import { assistantService } from '../services/api';
import { useAssistantStore } from '../context/store';
import { containerVariants, itemVariants, scaleIn } from '../animations/variants';

// Import assistant images
import echoImg from '../assets/echo.png';
import titanImg from '../assets/titan.webp';
import auraImg from '../assets/aura.jpeg';
import zenithImg from '../assets/zenith.jpeg';
import alphaImg from '../assets/alpha.jpeg';

const assistantImages = {
  ECHO: echoImg,
  TITAN: titanImg,
  AURA: auraImg,
  ZENITH: zenithImg,
  ALPHA: alphaImg,
};

const AssistantCard = ({ assistant, isSelected, onSelect, onNameAssistant }) => {
  return (
    <motion.div
      variants={scaleIn}
      whileHover={{ scale: 1.05 }}
      className={`relative cursor-pointer group rounded-xl overflow-hidden backdrop-blur-xl transition-all duration-300 ${
        isSelected ? 'border-2 border-neon-blue shadow-lg shadow-neon-blue/50' : 'border border-neon-blue/20'
      }`}
      onClick={() => onSelect(assistant.type)}
    >
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900/80 to-dark-950/80" />

      {/* Animated border glow */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-neon-blue/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative p-6 h-72 flex flex-col items-center justify-between z-10">
        {/* Avatar */}
        <motion.div
          className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-neon-blue/50 group-hover:border-neon-blue transition"
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <img
            src={assistantImages[assistant.type]}
            alt={assistant.type}
            className="w-full h-full object-cover"
          />
          {/* Glow effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition duration-300"
            style={{
              boxShadow: `0 0 20px ${assistant.glowColor}`,
            }}
          />
        </motion.div>

        {/* Content */}
        <div className="text-center">
          <h3
            className="text-2xl font-bold mb-2"
            style={{ backgroundImage: `linear-gradient(to right, ${assistant.glowColor}, #00ffff)`, backgroundClip: 'text', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {assistant.type}
          </h3>
          <p className="text-gray-400 text-sm mb-4">{assistant.description}</p>
        </div>

        {/* Select button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            onNameAssistant(assistant);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-dark-950 px-6 py-2 rounded-lg font-bold hover:from-neon-cyan hover:to-neon-blue transition"
        >
          Select <ChevronRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  );
};

const AssistantSelection = () => {
  const navigate = useNavigate();
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [customName, setCustomName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const setAssistant = useAssistantStore((state) => state.setAssistant);

  useEffect(() => {
    const fetchAssistants = async () => {
      try {
        const response = await assistantService.getAssistants();
        setAssistants(response.data.assistants);
        setLoading(false);
      } catch (error) {
        toast.error('Failed to load assistants');
        setLoading(false);
      }
    };

    fetchAssistants();
  }, []);

  const handleNameAssistant = (assistant) => {
    setSelectedAssistant(assistant);
    setShowModal(true);
  };

  const handleSubmitAssistant = async () => {
    if (!customName.trim()) {
      toast.error('Please enter a name for your assistant');
      return;
    }

    setSubmitting(true);

    try {
      // Check if token exists before making request
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Session expired. Please login again.');
        navigate('/login');
        return;
      }

      const response = await assistantService.selectAssistant({
        assistantType: selectedAssistant.type,
        customName: customName.trim(),
      });

      setAssistant(response.data.assistant);
      toast.success('Assistant selected successfully!');
      // Small delay to ensure state updates before navigation
      setTimeout(() => {
        navigate('/dashboard');
      }, 50);
    } catch (error) {
      console.error('Assistant selection error:', error);
      
      // Handle specific error cases
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
        localStorage.removeItem('token');
        navigate('/login');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to select assistant. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
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
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute w-96 h-96 bg-neon-blue/10 rounded-full blur-3xl -top-48 -left-48 animate-pulse" />
        <div className="absolute w-96 h-96 bg-neon-purple/10 rounded-full blur-3xl -bottom-48 -right-48 animate-pulse" />
      </div>

      <motion.div
        className="relative z-10 container mx-auto px-4 py-16"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-16">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="text-neon-blue mr-2" size={40} />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-neon-blue via-neon-cyan to-neon-green bg-clip-text text-transparent">
              Choose Your AI Assistant
            </h1>
          </div>
          <p className="text-gray-400 text-lg">Select one of our premium AI assistants to get started</p>
        </motion.div>

        {/* Grid of assistants */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-16">
          {assistants.map((assistant) => (
            <AssistantCard
              key={assistant.type}
              assistant={assistant}
              isSelected={selectedAssistant?.type === assistant.type}
              onSelect={() => {}}
              onNameAssistant={handleNameAssistant}
            />
          ))}
        </div>
      </motion.div>

      {/* Modal for naming assistant */}
      {showModal && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="bg-dark-900/90 backdrop-blur-xl border border-neon-blue/50 rounded-2xl p-8 max-w-md w-full"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-white mb-2">Name Your Assistant</h2>
            <p className="text-gray-400 mb-6">Give your {selectedAssistant?.type} a custom name</p>

            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="Enter custom name..."
              className="w-full bg-dark-800/50 border border-neon-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue focus:ring-2 focus:ring-neon-blue/30 transition mb-6"
              onKeyPress={(e) => e.key === 'Enter' && handleSubmitAssistant()}
            />

            <div className="flex gap-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setCustomName('');
                }}
                className="flex-1 border border-gray-600 text-gray-300 py-2 rounded-lg hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAssistant}
                disabled={submitting}
                className="flex-1 bg-gradient-to-r from-neon-blue to-neon-cyan text-dark-950 py-2 rounded-lg font-bold hover:from-neon-cyan hover:to-neon-blue transition disabled:opacity-50"
              >
                {submitting ? 'Creating...' : 'Save'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AssistantSelection;
