import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { LogOut, Settings, Plus, MessageCircle, Trash2 } from 'lucide-react';
import { useAuthStore } from '../context/store';
import toast from 'react-hot-toast';

const Sidebar = ({ chats, onNewChat, onSelectChat, currentChatId, onDeleteChat }) => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <motion.div
      className="w-64 bg-dark-900/50 backdrop-blur-xl border-r border-neon-blue/20 flex flex-col h-screen"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <div className="p-6 border-b border-neon-blue/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-neon-blue to-neon-cyan text-dark-950 px-4 py-3 rounded-lg font-bold hover:from-neon-cyan hover:to-neon-blue transition"
        >
          <Plus size={20} />
          New Chat
        </motion.button>
      </div>

      {/* Chats list */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {chats.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-8">No chats yet</p>
        ) : (
          chats.map((chat) => (
            <motion.div
              key={chat.id}
              whileHover={{ x: 5 }}
              className={`group relative p-3 rounded-lg cursor-pointer transition ${
                currentChatId === chat.id
                  ? 'bg-neon-blue/20 border border-neon-blue/50 text-neon-cyan'
                  : 'bg-dark-800/30 border border-dark-700/50 text-gray-300 hover:bg-dark-800/50'
              }`}
              onClick={() => onSelectChat(chat)}
            >
              <div className="flex items-start gap-3">
                <MessageCircle size={16} className="mt-1" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{chat.title}</p>
                  <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteChat(chat.id);
                }}
                className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition"
              >
                <Trash2 size={14} />
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neon-blue/20 space-y-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={() => navigate('/settings')}
          className="w-full flex items-center justify-center gap-2 bg-dark-800/50 hover:bg-dark-800 border border-dark-700/50 text-gray-300 px-4 py-2 rounded-lg transition"
        >
          <Settings size={18} />
          Settings
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 px-4 py-2 rounded-lg transition"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Sidebar;
