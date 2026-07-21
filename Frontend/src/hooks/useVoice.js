// Voice Recognition Hook
export const useVoiceRecognition = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognitionInstance = new SpeechRecognition();

  recognitionInstance.continuous = true;
  recognitionInstance.interimResults = true;
  recognitionInstance.lang = 'en-US';

  return recognitionInstance;
};

// Speech Synthesis Hook
export const useSpeechSynthesis = () => {
  const synth = window.speechSynthesis;

  const speak = (text, options = {}) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options.rate ?? 1;
    utterance.pitch = options.pitch ?? 1;
    utterance.volume = options.volume ?? 1;
    utterance.onstart = options.onStart;
    utterance.onend = options.onEnd;
    utterance.onerror = options.onError;

    synth.cancel();
    synth.speak(utterance);

    return utterance;
  };

  const stop = () => {
    synth.cancel();
  };

  return { speak, stop, synth };
};
