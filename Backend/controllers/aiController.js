import https from 'https';

const getGroqApiKey = () => {
  if (!process.env.GROQ_API_KEY) {
    const error = new Error('GROQ_API_KEY is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  return process.env.GROQ_API_KEY;
};

const getOpenRouterApiKey = () => {
  if (!process.env.OPENROUTER_API_KEY) {
    const error = new Error('OPENROUTER_API_KEY is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  return process.env.OPENROUTER_API_KEY;
};

const getCurrentContext = () => {
  const now = new Date();

  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: process.env.APP_TIME_ZONE || 'Asia/Karachi',
  }).format(now);
};

const requestGroq = (message) => {
  const model = 'llama-3.3-70b-versatile'; // hardcoded: reliable free model on Groq
  const apiKey = getGroqApiKey();
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
  });

  const options = {
    hostname: 'api.groq.com',
    path: '/openai/v1/chat/completions',
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
          const error = new Error('Invalid response from Groq API');
          error.statusCode = 502;
          reject(error);
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const error = new Error(parsed.error?.message || 'Groq API request failed');
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

const requestOpenRouter = (message) => {
  const model = process.env.OPENROUTER_MODEL || 'gpt-4o-mini';
  const apiKey = getOpenRouterApiKey();
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
  });

  const options = {
    hostname: 'api.openrouter.ai',
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
          const error = new Error('Invalid response from OpenRouter API');
          error.statusCode = 502;
          reject(error);
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const error = new Error(parsed.error?.message || 'OpenRouter API request failed');
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

const requestAI = (message) => {
  if (process.env.OPENROUTER_API_KEY) return requestOpenRouter(message);
  return requestGroq(message);
};

export const generateReply = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    const response = await requestGroq(message.trim());
    const reply = response.choices?.[0]?.message?.content;

    return res.status(200).json({
      success: true,
      reply: reply || 'I could not generate a response. Please try again.',
    });
  } catch (error) {
    if (error.statusCode === 503) {
      return res.status(503).json({ success: false, message: error.message });
    }
    return next(error);
  }
};