import type { Handler, HandlerEvent, HandlerContext } from '@netlify/functions';
import { GoogleGenAI } from '@google/genai';

interface ChatMessageInput {
  role?: string;
  content?: string;
}

interface ChatRequestBody {
  messages?: ChatMessageInput[];
  systemPrompt?: string;
  model?: string;
  knowledgeContext?: string;
  temperature?: number;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-cache, no-transform',
  'Connection': 'keep-alive'
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
      return 'আপনি আবদুলের সাথে সরাসরি যোগাযোগ করতে পারেন:\n\n* **ইমেইল:** motaleb@example.com\n* **ফোন / হোয়াটসঅ্যাপ:** +880 1712 345678\n* অথবা নিচের **Contact Me** বাটনে ক্লিক করে ওয়েবসাইট থেকে সরাসরি মেসেজ পাঠাতে পারেন।';
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
    return 'You can reach out to Abdul directly via:\n\n* **Email:** motaleb@example.com\n* **Phone / WhatsApp:** +880 1712 345678\n* Or click the **Contact Me** button below to send a direct message through this portfolio.';
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

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  // Handle CORS Pre-flight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Allow GET for simple health check
  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: 'ok',
        service: 'Abdul AI Assistant Netlify Function',
        timestamp: new Date().toISOString()
      })
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method Not Allowed. Use POST.' })
    };
  }

  try {
    let body: ChatRequestBody = {};
    try {
      body = JSON.parse(event.body || '{}');
    } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Invalid JSON request body.' })
      };
    }

    const { messages, systemPrompt, model, knowledgeContext, temperature } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'Messages array is required.' })
      };
    }

    const fullSystemInstruction = `${systemPrompt || ''}\n\nAdditional Verified Knowledge Base:\n${knowledgeContext || ''}`;

    const validMessages: { role: 'user' | 'assistant'; content: string }[] = [];
    let seenFirstUser = false;

    for (const m of messages) {
      if (!m.content || typeof m.content !== 'string' || !m.content.trim()) continue;
      const role: 'user' | 'assistant' =
        m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user';

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
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'No user message found to process.' })
      };
    }

    const openaiApiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    let generatedText = '';

    // 1. Try OpenAI if API key exists
    if (openaiApiKey) {
      try {
        const openaiMessages = [
          { role: 'system', content: fullSystemInstruction },
          ...validMessages.map((m) => ({
            role: m.role,
            content: m.content
          }))
        ];

        const openaiModel =
          model && (model.startsWith('gpt-') || model.startsWith('o1') || model.startsWith('o3'))
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
            temperature: typeof temperature === 'number' ? temperature : 0.7
          })
        });

        if (openaiRes.ok) {
          const data = (await openaiRes.json()) as { choices?: { message?: { content?: string } }[] };
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            generatedText = reply;
          }
        } else {
          const errText = await openaiRes.text().catch(() => '');
          console.warn('[Netlify Function OpenAI error]', errText);
        }
      } catch (e: unknown) {
        console.warn('[Netlify Function OpenAI exception]', (e as Error)?.message);
      }
    }

    // 2. Try Gemini if OpenAI failed or no OpenAI key
    if (!generatedText && geminiApiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey: geminiApiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build'
            }
          }
        });

        const selectedModel = model && model.startsWith('gemini') ? model : 'gemini-3.8-flash';
        const contents = validMessages.map((m) => ({
          role: m.role === 'assistant' ? 'model' : 'user',
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

        if (directResponse.text) {
          generatedText = directResponse.text;
        }
      } catch (geminiError: unknown) {
        console.warn('[Netlify Function Gemini exception]', (geminiError as Error)?.message);
      }
    }

    // 3. Fallback: Local Verified Knowledge Engine
    if (!generatedText) {
      const lastUserQuery = validMessages[validMessages.length - 1]?.content || '';
      const isBengali = /[\u0980-\u09FF]/.test(lastUserQuery);
      generatedText = generateLocalKnowledgeAnswer(lastUserQuery, knowledgeContext || '', isBengali);
    }

    // Format response in Server-Sent Events (SSE) format for frontend reader
    const words = generatedText.split(' ');
    let sseOutput = '';

    for (let i = 0; i < words.length; i += 3) {
      const chunkText = words.slice(i, i + 3).join(' ') + ' ';
      sseOutput += `data: ${JSON.stringify({ text: chunkText })}\n\n`;
    }

    sseOutput += 'data: [DONE]\n\n';

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: sseOutput
    };
  } catch (err: unknown) {
    const error = err as { message?: string };
    console.error('[Netlify Function General Error]', error);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: error.message || 'Internal server error processing chat.' })
    };
  }
};
