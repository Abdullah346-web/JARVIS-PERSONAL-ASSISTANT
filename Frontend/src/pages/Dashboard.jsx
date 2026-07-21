import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Mic, MicOff } from 'lucide-react';
import { useAuthStore } from '../context/store';
import { useSpeechSynthesis, useVoiceRecognition } from '../hooks/useVoice';
import { aiService } from '../services/api';

import jarvisImg from '../assets/jarvis-removebg-preview.png';

const Dashboard = () => {
  const user = useAuthStore((state) => state.user);
  const { speak } = useSpeechSynthesis();
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [isSpeakingIntro, setIsSpeakingIntro] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [responseText, setResponseText] = useState('');

  const buildGreeting = () => {
    return `Hello, ${user?.username || 'there'}, I'm Jarvis made by Abdullah. How can I assist you today?`;
  };

  const speakGreetingOnce = () => {
    const userId = user?.id || user?.email || 'guest';
    const greetingKey = `jarvis-greeting-spoken:${userId}`;

    if (sessionStorage.getItem(greetingKey) === 'true') {
      return;
    }

    sessionStorage.setItem(greetingKey, 'true');
    const greeting = buildGreeting();
    setResponseText(greeting);
    speak(greeting, {
      rate: 1,
      pitch: 1,
      onStart: () => setIsSpeakingIntro(true),
      onEnd: () => setIsSpeakingIntro(false),
      onError: () => setIsSpeakingIntro(false),
    });
  };

  useEffect(() => {
    speakGreetingOnce();
  }, []);

  const handleVoiceInput = () => {
    if (!recognitionRef.current) {
      try {
        recognitionRef.current = useVoiceRecognition();
      } catch (error) {
        toast.error('Voice recognition is not supported in this browser');
        return;
      }
    }

    const recognition = recognitionRef.current;

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      return;
    }

    recognition.onresult = async (event) => {
      let finalTranscript = '';

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
        const result = event.results[index][0].transcript;
        if (event.results[index].isFinal) {
          finalTranscript += result;
        }
      }

      if (finalTranscript.trim()) {
        const message = finalTranscript.trim();
        setTranscript(message);
        setIsThinking(true);

        try {
          const { data } = await aiService.getReply(message);
          setResponseText(data.reply);
          speak(data.reply, { rate: 0.95, pitch: 1 });
        } catch (error) {
          const reply = error.response?.data?.message || 'I could not reach the AI service. Please try again.';
          console.error('AI response error:', error);
          setResponseText(reply);
          toast.error(reply);
        } finally {
          setIsThinking(false);
        }
      }
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
    setIsListening(true);
  };

  return (
    <div className="h-screen bg-dark-950 text-white overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[32rem] h-[32rem] bg-neon-blue/10 blur-3xl rounded-full -top-32 left-1/2 -translate-x-1/2" />
        <div className="absolute w-[24rem] h-[24rem] bg-neon-purple/10 blur-3xl rounded-full bottom-0 right-0" />
      </div>

      <div className="relative z-10 h-full flex items-center justify-center px-4 py-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center"
        >
          <motion.div
            animate={isSpeakingIntro ? { scale: [1, 1.08, 1] } : {}}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="relative mx-auto w-40 h-40 sm:w-48 sm:h-48 flex items-center justify-center"
          >
            <div className="absolute inset-8 rounded-full bg-neon-blue/10 blur-xl" />
            <img
              src={jarvisImg}
              alt="Jarvis"
              className="relative z-10 w-full h-full object-contain drop-shadow-[0_0_28px_rgba(0,212,255,0.3)]"
            />
          </motion.div>

          <div className="mt-4 space-y-2">
            <h1 className="text-3xl sm:text-5xl font-black tracking-[0.14em] leading-none bg-gradient-to-r from-neon-cyan via-white to-neon-blue bg-clip-text text-transparent drop-shadow-[0_0_18px_rgba(0,212,255,0.25)]">
              JARVIS
            </h1>
            <h2 className="text-xl sm:text-3xl font-semibold leading-tight text-white/95">
              Hello, {user?.username || 'there'}, I&apos;m Jarvis made by Abdullah.
            </h2>
            <p className="text-gray-400 text-sm sm:text-base tracking-wide">Voice control only. No typing.</p>
          </div>

          <div className="mt-5 flex justify-center">
            <button
              onClick={handleVoiceInput}
              className={`flex items-center gap-2 px-5 py-3 rounded-full border transition-all duration-300 ${
                isListening
                  ? 'bg-red-500/20 border-red-500 text-red-300 shadow-lg shadow-red-500/20'
                  : 'bg-neon-blue/15 border-neon-blue/40 text-neon-cyan hover:bg-neon-blue/25'
              }`}
            >
              {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              <span className="font-semibold">{isListening ? 'Listening...' : 'Tap to Speak'}</span>
            </button>
          </div>

          <div className="mt-4 space-y-3">
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 backdrop-blur-2xl p-4 text-left shadow-[0_20px_60px_rgba(0,0,0,0.25)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-gray-400">Last command</p>
                <span className="h-2 w-2 rounded-full bg-neon-cyan shadow-[0_0_10px_rgba(0,212,255,0.9)]" />
              </div>
              <p className="text-sm text-gray-100 leading-6 min-h-[20px]">{transcript || 'Say something to Jarvis...'}</p>
            </div>

            <div className="rounded-3xl border border-neon-blue/20 bg-gradient-to-br from-neon-blue/10 to-dark-900/40 backdrop-blur-2xl p-4 text-left shadow-[0_20px_60px_rgba(0,212,255,0.08)]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] uppercase tracking-[0.35em] text-neon-cyan">Jarvis reply</p>
                <span className="h-2 w-2 rounded-full bg-neon-blue shadow-[0_0_10px_rgba(0,212,255,0.9)]" />
              </div>
              <p className="text-sm text-gray-50 leading-6 min-h-[20px]">{isThinking ? 'Jarvis is thinking...' : responseText || buildGreeting()}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
