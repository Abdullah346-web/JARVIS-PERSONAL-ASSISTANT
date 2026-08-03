import https from 'https';

const getDeepSeekApiKey = () => {
  if (!process.env.DEEPSEEK_API_KEY) {
    const error = new Error('DEEPSEEK_API_KEY is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  return process.env.DEEPSEEK_API_KEY;
};

const getCurrentContext = () => {
  const now = new Date();

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: process.env.APP_TIME_ZONE || 'Asia/Karachi',
  }).format(now);
};

const requestDeepSeek = (message) => {
  const apiKey = getDeepSeekApiKey();
  const model = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
  const currentContext = getCurrentContext();

  const body = JSON.stringify({
    model,
    messages: [
      {
        role: 'system',
        content: `You are Jarvis, a helpful voice assistant made by Abdullah. Give direct, accurate answers.
Current server date and time: ${currentContext}.
Use this date/time when users ask about today, date, time, day, or relative dates.
Do not say you lack real-time information for basic date/time questions.
Only mention limited real-time access for live news, current prices, live sports, weather, or events that require internet browsing.`,
      },
      {
        role: 'user',
        content: message,
      },
    ],
    temperature: 0.7,
  });

  const options = {
    hostname: 'api.deepseek.com',
    path: '/v1/chat/completions',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
      'Content-Length': Buffer.byteLength(body),
    },
  };

  return new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        let parsed;

        try {
          parsed = JSON.parse(data);
        } catch {
          const error = new Error('Invalid response from DeepSeek API');
          error.statusCode = 502;
          reject(error);
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const error = new Error(parsed.error?.message || 'DeepSeek API request failed');
          error.statusCode = response.statusCode;
          reject(error);
          return;
        }

        resolve(parsed);
      });
    });

    request.on('error', reject);
    request.write(body);
    request.end();
  });
};

const requestAI = async (message) => {
  if (process.env.DEEPSEEK_API_KEY && process.env.DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here') {
    try {
      return await requestDeepSeek(message);
    } catch (error) {
      console.warn('DeepSeek failed, falling back to local logic:', error.message);
    }
  }

  return null;
};

const getLocalFallbackReply = (message) => {
  const normalized = message.toLowerCase().trim();
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = now.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  if (!normalized) {
    return 'Hello! I’m here to help. How can I assist you today?';
  }

  if (normalized.includes('hello') || normalized.includes('hi') || normalized.includes('hey')) {
    return `Hello! I’m Jarvis. You said: “${message.trim()}”. How can I help you today?`;
  }

  if (normalized.includes('how are you')) {
    return 'I’m doing well and ready to help you. What would you like to do?';
  }

  if (normalized.includes('what is your name') || normalized.includes('who are you')) {
    return 'I’m Jarvis, your AI assistant.';
  }

  if (normalized.includes('your name') || normalized.includes('my name')) {
    return 'I’m Jarvis. If you want, I can also help you remember your own name or introduce yourself better.';
  }

  if (normalized.includes('what time') || normalized.includes('time')) {
    return `The current time is ${formattedTime}.`;
  }

  if (normalized.includes('what date') || normalized.includes('date') || normalized.includes('today')) {
    return `Today is ${formattedDate}.`;
  }

  if (normalized.includes('day') || normalized.includes('weekday')) {
    return `Today is ${now.toLocaleDateString('en-US', { weekday: 'long' })}.`;
  }

  if (normalized.includes('thank you') || normalized.includes('thanks')) {
    return 'You’re welcome! I’m here whenever you need me.';
  }

  if (normalized.includes('bye') || normalized.includes('goodbye')) {
    return 'Goodbye! I’ll be here when you need me again.';
  }

  if (normalized.includes('open') || normalized.includes('launch') || normalized.includes('start')) {
    return 'I can help you start tasks, but I need a specific command or app name.';
  }

  if (normalized.includes('weather')) {
    return 'I can help with weather questions, but live weather data is currently unavailable.';
  }

  if (normalized.includes('help')) {
    return 'I’m here to help. Tell me what you want to do and I’ll guide you.';
  }

  return `I heard: “${message.trim()}”. I can still help with simple things like greetings, time, date, and basic questions.`;
};

export const generateReply = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    let reply = getLocalFallbackReply(message.trim());

    try {
      const response = await requestAI(message.trim());
      if (response?.choices?.[0]?.message?.content) {
        reply = response.choices[0].message.content;
      } else if (response?.candidates?.[0]?.content?.parts?.[0]?.text) {
        reply = response.candidates[0].content.parts[0].text;
      }
    } catch (error) {
      console.error('AI provider error:', error.message);
      reply = getLocalFallbackReply(message.trim());
    }

    return res.status(200).json({
      success: true,
      reply,
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return res.status(503).json({ success: false, message: error.message });
    }

    if (error.message?.includes('Insufficient credits') || error.message?.includes('credits')) {
      return res.status(200).json({
        success: true,
        reply: getLocalFallbackReply(typeof req.body?.message === 'string' ? req.body.message : ''),
      });
    }

    return next(error);
  }
};