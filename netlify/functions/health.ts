import type { Handler } from '@netlify/functions';

export const handler: Handler = async () => {
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      status: 'ok',
      platform: 'netlify-functions',
      openaiConfigured: !!(process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY),
      geminiConfigured: !!(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY),
      timestamp: new Date().toISOString()
    })
  };
};
