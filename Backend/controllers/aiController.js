import https from 'https';

const getApiKey = () => {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured on the server');
    error.statusCode = 503;
    throw error;
  }

  return process.env.GEMINI_API_KEY;
};

const requestGemini = (message) => {
  const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
  const apiKey = getApiKey();
  const body = JSON.stringify({
    systemInstruction: {
      parts: [
        {
          text: `You are Jarvis, a helpful voice assistant. Give direct, accurate answers.
If you are uncertain or the answer needs current information you do not have, say that clearly instead of guessing.`,
        },
      ],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ],
  });

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    path: `/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
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
          const error = new Error('Invalid response from Gemini API');
          error.statusCode = 502;
          reject(error);
          return;
        }

        if (response.statusCode < 200 || response.statusCode >= 300) {
          const error = new Error(parsed.error?.message || 'Gemini API request failed');
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

export const generateReply = async (req, res, next) => {
  try {
    const { message } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Please provide a message' });
    }

    const response = await requestGemini(message.trim());
    const reply = response.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join('\n');

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
