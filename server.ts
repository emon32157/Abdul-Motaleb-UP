import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json());

// Initialize Google GenAI with environment GEMINI_API_KEY or OPENAI_API_KEY
const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;

const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    })
  : null;

// Basic IP-based rate limiter (max 40 requests per minute)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const rateLimit = (req: Request, res: Response, next: () => void) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const limitWindow = 60 * 1000; // 1 minute
  const maxRequests = 40;

  const current = rateLimitMap.get(ip);
  if (!current || now > current.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + limitWindow });
    return next();
  }

  if (current.count >= maxRequests) {
    return res.status(429).json({
      error: 'Rate limit reached. Please wait a moment before sending another message.'
    });
  }

  current.count++;
  next();
};

function generateLocalKnowledgeAnswer(
  userQuery: string,
  _knowledgeContext: string,
  isBengali: boolean
): string {
  const query = userQuery.toLowerCase();

  if (isBengali) {
    if (
      query.includes('যোগাযোগ') ||
      query.includes('ইমেইল') ||
      query.includes('ফোন') ||
      query.includes('নাম্বার') ||
      query.includes('whatsapp') ||
      query.includes('হায়ার')
    ) {
      return 'আপনি আবদুলের সাথে সরাসরি যোগাযোগ করতে পারেন:\n\n* **ইমেইল:** motalebmirzaemon@gmail.com\n* **ফোন / হোয়াটসঅ্যাপ:** +880 1880604567\n* অথবা নিচের **Contact Me** বাটনে ক্লিক করে ওয়েবসাইট থেকে সরাসরি মেসেজ পাঠাতে পারেন।';
    }
    if (
      query.includes('সার্ভিস') ||
      query.includes('সেবা') ||
      query.includes('কাজ') ||
      query.includes('দক্ষতা') ||
      query.includes('সাইবার')
    ) {
      return 'আবদুল মোতালেব প্রধানত নিচের সেবাগুলো প্রদান করেন:\n\n1. **সাইবার সিকিউরিটি ও পেনিট্রেশন টেস্টিং** (Ethical Hacking & Vulnerability Assessment)\n2. **ফুল-স্ট্যাক ওয়েব ডেভেলপমেন্ট** (Modern Web Applications - React, PHP, Tailwind)\n3. **সোশ্যাল মিডিয়া ম্যানেজমেন্ট** ও ব্র্যান্ড গ্রোথ ক্যাম্পেইন\n4. **সিকিউরিটি কনসালটেশন**\n\nআপনি কোন বিষয়ে আরও জানতে চান?';
    }
    if (query.includes('প্রজেক্ট') || query.includes('কাজগুলো')) {
      return 'আবদুলের উল্লেখযোগ্য প্রজেক্টের মধ্যে রয়েছে:\n\n* **সাইবার সিকিউরিটি ড্যাশবোর্ড** (Real-time network monitoring & telemetry)\n* **ই-কমার্স প্ল্যাটফর্ম** (Secure multi-vendor web store)\n* **সোশ্যাল মিডিয়া অটোমেশন টুল** (Automated analytics & scheduling)\n\nবিস্তারিত দেখতে ওয়েবসাইটের Projects সেকশনটি ঘুরে দেখুন!';
    }
    return 'আমি আবদুল মোতালেবের এআই অ্যাসিস্ট্যান্ট। আবদুলের সাইবার সিকিউরিটি সেবা, ওয়েব ডেভেলপমেন্ট প্রজেক্ট বা যোগাযোগের বিষয়ে যেকোনো প্রশ্ন করতে পারেন। আমি আপনাকে সহযোগিতা করতে প্রস্তুত!';
  }

  if (
    query.includes('contact') ||
    query.includes('hire') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('whatsapp') ||
    query.includes('reach')
  ) {
    return 'You can reach out to Abdul directly via:\n\n* **Email:** motalebmirzaemon@gmail.com\n* **Phone / WhatsApp:** +880 1880604567\n* Or click the **Contact Me** button below to send a direct message through this portfolio.';
  }
  if (
    query.includes('service') ||
    query.includes('cyber') ||
    query.includes('security') ||
    query.includes('hack') ||
    query.includes('web') ||
    query.includes('skill')
  ) {
    return "Abdul Motaleb provides professional services in:\n\n1. **Cyber Security & Ethical Hacking:** Penetration testing, vulnerability assessments, network defense\n2. **Full-Stack Web Development:** Modern, high-performance web applications\n3. **Social Media Growth & Management:** Strategic campaigns and audience optimization\n4. **Security Consultation:** Risk mitigation and cybersecurity guidance\n\nWhich of these would you like to discuss further?";
  }
  if (query.includes('project')) {
    return 'Abdul has delivered featured technical projects including:\n\n* **Cyber Security Dashboard:** Real-time threat detection and network telemetry interface\n* **E-Commerce Web Application:** Secure multi-vendor store with payment gateway\n* **Social Media Management Platform:** Multi-channel analytics and automated posting\n\nYou can view full project details and live previews in the Projects section above!';
  }
  return "I'm Abdul's AI Assistant. I can assist you with information about Abdul's Cyber Security services, Web Development projects, verified skills, and direct contact details. How can I help you today?";
}

// Health Check Endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    openaiConfigured: !!openaiApiKey,
    geminiConfigured: !!apiKey,
    timestamp: new Date().toISOString()
  });
});

// AI Chat Stream Endpoint (OpenAI + Gemini + Local Knowledge)
app.post('/api/chat', rateLimit, async (req: Request, res: Response) => {
  try {
    const { messages, systemPrompt, model, knowledgeContext, temperature } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Construct enriched system instruction
    const fullSystemInstruction = `${systemPrompt || ''}\n\nAdditional Verified Knowledge Base:\n${knowledgeContext || ''}`;

    // Format contents for multi-turn conversation:
    const validMessages: { role: 'user' | 'model'; content: string }[] = [];
    let seenFirstUser = false;

    for (const m of messages) {
      if (!m.content || typeof m.content !== 'string' || !m.content.trim()) continue;
      const role: 'user' | 'model' = m.role === 'assistant' || m.role === 'model' ? 'model' : 'user';

      if (!seenFirstUser) {
        if (role === 'user') {
          seenFirstUser = true;
          validMessages.push({ role, content: m.content.trim() });
        }
      } else {
        const last = validMessages[validMessages.length - 1];
        if (last && last.role === role) {
          last.content += '\n\n' + m.content.trim();
        } else {
          validMessages.push({ role, content: m.content.trim() });
        }
      }
    }

    if (validMessages.length === 0) {
      return res.status(400).json({ error: 'No user message found to process.' });
    }

    // Setup Server-Sent Events headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    if (res.flushHeaders) {
      res.flushHeaders();
    }

    // 1. First priority: Try OpenAI API if OPENAI_API_KEY is configured
    if (openaiApiKey) {
      try {
        const openaiMessages = [
          { role: 'system', content: fullSystemInstruction },
          ...validMessages.map((m) => ({
            role: m.role === 'model' ? 'assistant' : 'user',
            content: m.content
          }))
        ];

        const openaiModel = (model && (model.startsWith('gpt-') || model.startsWith('o1') || model.startsWith('o3')))
          ? model
          : 'gpt-4o-mini';

        const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${openaiApiKey}`
          },
          body: JSON.stringify({
            model: openaiModel,
            messages: openaiMessages,
            temperature: typeof temperature === 'number' ? temperature : 0.7,
            stream: true
          })
        });

        if (openaiRes.ok && openaiRes.body) {
          const reader = openaiRes.body.getReader();
          const decoder = new TextDecoder();
          let buffer = '';
          let streamedAny = false;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6);
                if (dataStr === '[DONE]') {
                  res.write('data: [DONE]\n\n');
                  res.end();
                  return;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  const content = parsed.choices?.[0]?.delta?.content;
                  if (content) {
                    res.write(`data: ${JSON.stringify({ text: content })}\n\n`);
                    streamedAny = true;
                  }
                } catch {
                  // Partial chunk, continue
                }
              }
            }
          }

          if (streamedAny) {
            res.write('data: [DONE]\n\n');
            res.end();
            return;
          }
        } else {
          const errBody = await openaiRes.text().catch(() => '');
          console.warn(`[OpenAI API status ${openaiRes.status}]`, errBody);
        }
      } catch (openaiErr: unknown) {
        console.warn('OpenAI stream connection failed, falling back:', (openaiErr as Error)?.message);
      }
    }

    // 2. Secondary priority: Try Gemini API if configured
    if (ai) {
      try {
        const selectedModel = model && model.startsWith('gemini') ? model : 'gemini-3.8-flash';
        const contents = validMessages.map((m) => ({
          role: m.role,
          parts: [{ text: m.content }]
        }));

        const directResponse = await ai.models.generateContent({
          model: selectedModel,
          contents,
          config: {
            systemInstruction: fullSystemInstruction,
            temperature: typeof temperature === 'number' ? temperature : 0.7
          }
        });

        const responseText = directResponse.text || '';
        const words = responseText.split(' ');
        for (let i = 0; i < words.length; i += 3) {
          const chunkText = words.slice(i, i + 3).join(' ') + ' ';
          res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
          await new Promise((r) => setTimeout(r, 20));
        }

        res.write(`data: [DONE]\n\n`);
        res.end();
        return;
      } catch (geminiError: unknown) {
        console.warn('Gemini API fallback invoked:', (geminiError as Error)?.message);
      }
    }

    // 3. Resilient Fallback: Local Verified Knowledge Engine
    const lastUserQuery = validMessages[validMessages.length - 1]?.content || '';
    const isBengali = /[\u0980-\u09FF]/.test(lastUserQuery);
    const fallbackText = generateLocalKnowledgeAnswer(lastUserQuery, knowledgeContext || '', isBengali);

    const words = fallbackText.split(' ');
    for (let i = 0; i < words.length; i += 3) {
      const chunkText = words.slice(i, i + 3).join(' ') + ' ';
      res.write(`data: ${JSON.stringify({ text: chunkText })}\n\n`);
      await new Promise((r) => setTimeout(r, 20));
    }

    res.write(`data: [DONE]\n\n`);
    res.end();
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('API /api/chat error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message || 'Internal server error processing chat.' });
    } else {
      res.end();
    }
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // In dev, mount Vite middleware
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static dist files
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
