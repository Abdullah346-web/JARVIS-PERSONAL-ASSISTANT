import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useSpeechSynthesis, useVoiceRecognition } from '../hooks/useVoice';
import { Mic, MicOff, Send, Trash2, Settings, MessageCircle } from 'lucide-react';

const VoiceWaveAnimation = ({ isListening }) => {
  return (
    <div className="flex items-center gap-1">
      {[0, 1, 2, 3, 4].map((index) => (
        <motion.div
          key={index}
          className="w-1 bg-neon-blue rounded-full"
          animate={isListening ? { height: ['20px', '40px', '20px'] } : { height: '20px' }}
          transition={{ duration: 0.5, repeat: Infinity, delay: index * 0.1 }}
        />
      ))}
    </div>
  );
};

const ChatInterface = ({ onSendMessage, isLoading, messages, assistantName }) => {
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const { speak } = useSpeechSynthesis();
  const recognitionRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      sender: 'user',
      content: inputValue,
      timestamp: new Date(),
      isVoice: false,
    };

    setInputValue('');
    onSendMessage(userMessage);
  };

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = useVoiceRecognition();
    }

    const recognition = recognitionRef.current;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);

      recognition.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setInputValue(transcript);
            handleSendMessage();
          } else {
            interimTranscript += transcript;
          }
        }
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 p-4 bg-dark-900/50 rounded-lg">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center">
            <div>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-4"
              >
                🤖
              </motion.div>
              <p className="text-gray-400">Start a conversation with {assistantName}</p>
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                  msg.sender === 'user'
                    ? 'bg-neon-blue/20 border border-neon-blue/50 text-gray-100'
                    : 'bg-neon-purple/20 border border-neon-purple/50 text-gray-100'
                }`}
              >
                <p className="text-sm">{msg.content}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </motion.div>
          ))
        )}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex justify-start"
          >
            <div className="bg-neon-purple/20 border border-neon-purple/50 px-4 py-3 rounded-lg">
              <div className="flex gap-2">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                  className="w-2 h-2 rounded-full bg-neon-purple"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.1 }}
                  className="w-2 h-2 rounded-full bg-neon-purple"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  className="w-2 h-2 rounded-full bg-neon-purple"
                />
              </div>
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Type or speak..."
          className="flex-1 bg-dark-800/50 border border-neon-blue/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue transition"
        />

        <button
          onClick={handleVoiceInput}
          className={`p-3 rounded-lg transition ${
            isListening
              ? 'bg-red-500/30 border border-red-500 text-red-400'
              : 'bg-neon-blue/20 border border-neon-blue/50 text-neon-blue hover:bg-neon-blue/30'
          }`}
        >
          {isListening ? <MicOff size={20} /> : <Mic size={20} />}
        </button>

        <button
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="p-3 bg-gradient-to-r from-neon-blue to-neon-cyan rounded-lg text-dark-950 hover:from-neon-cyan hover:to-neon-blue transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatInterface;
