import { ChatMessage, AIKnowledgeItem, AIChatbotSettings } from '../types';

export interface ChatServiceOptions {
  messages: ChatMessage[];
  aiSettings: AIChatbotSettings;
  knowledgeBase: AIKnowledgeItem[];
  siteContext: {
    siteTitle: string;
    email: string;
    phone: string;
    whatsapp: string;
    location: string;
    skillsSummary: string;
    servicesSummary: string;
    projectsSummary: string;
    experienceSummary: string;
  };
  onChunk: (textChunk: string) => void;
  signal?: AbortSignal;
}

function generateClientFallbackAnswer(
  userQuery: string,
  knowledgeBase: AIKnowledgeItem[],
  siteContext: ChatServiceOptions['siteContext']
): string {
  const query = userQuery.toLowerCase().trim();
  const isBengali = /[\u0980-\u09FF]/.test(userQuery);

  // 1. Check if user asked something matched in knowledge base
  const matchedKB = knowledgeBase
    .filter((k) => k.active)
    .find((k) => query.includes(k.question.toLowerCase()) || k.question.toLowerCase().includes(query));

  if (matchedKB) {
    return matchedKB.answer;
  }

  // 2. Intelligent portfolio fallback in Bengali
  if (isBengali) {
    if (
      query.includes('যোগাযোগ') ||
      query.includes('ইমেইল') ||
      query.includes('ফোন') ||
      query.includes('নাম্বার') ||
      query.includes('whatsapp') ||
      query.includes('হায়ার')
    ) {
      return `আপনি আবদুলের সাথে সরাসরি যোগাযোগ করতে পারেন:\n\n* **ইমেইল:** ${siteContext.email || 'motalebmirzaemon@gmail.com'}\n* **ফোন / হোয়াটসঅ্যাপ:** ${siteContext.phone || '+880 1880604567'} (${siteContext.whatsapp || '+880 1880604567'})\n* **লোকেশন:** ${siteContext.location || 'Feni, Bangladesh'}\n* অথবা নিচের **Contact Me** বাটন থেকে সরাসরি বার্তা পাঠাতে পারেন।`;
    }
    if (
      query.includes('সার্ভিস') ||
      query.includes('সেবা') ||
      query.includes('কাজ') ||
      query.includes('দক্ষতা') ||
      query.includes('সাইবার')
    ) {
      return `আবদুল মোতালেব প্রধানত নিচের সেবাগুলো প্রদান করেন:\n\n1. **সাইবার সিকিউরিটি ও এথিক্যাল হ্যাকিং** (পেনিট্রেশন টেস্টিং, সিস্টেম অডিট)\n2. **ওয়েব অ্যাপ্লিকেশন ডেভেলপমেন্ট** (আধুনিক ও সিকিউর ফুল-স্ট্যাক ওয়েবসাইট)\n3. **সোশ্যাল মিডিয়া ম্যানেজমেন্ট ও গ্রোথ**\n4. **সিকিউরিটি কনসালটেশন**\n\nআপনি কোন বিষয়ে বিস্তারিত জানতে চান?`;
    }
    if (query.includes('প্রজেক্ট') || query.includes('কাজগুলো')) {
      return `আবদুলের উল্লেখযোগ্য প্রজেক্টের মধ্যে রয়েছে:\n\n* **Cyber Security Monitoring Dashboard**\n* **E-Commerce Web Application**\n* **Social Media Management Tool**\n\nবিস্তারিত দেখতে ওয়েবসাইটের Projects সেকশনটি ঘুরে দেখুন!`;
    }
    return `আমি আবদুল মোতালেবের এআই অ্যাসিস্ট্যান্ট। আবদুলের সাইবার সিকিউরিটি সেবা, ওয়েব ডেভেলপমেন্ট প্রজেক্ট বা যেকোনো বিষয়ে প্রশ্ন করতে পারেন। আমি আপনাকে সহযোগিতা করতে প্রস্তুত!`;
  }

  // 3. Intelligent portfolio fallback in English
  if (
    query.includes('contact') ||
    query.includes('hire') ||
    query.includes('email') ||
    query.includes('phone') ||
    query.includes('whatsapp') ||
    query.includes('reach')
  ) {
    return `You can reach out to Abdul directly via:\n\n* **Email:** ${siteContext.email || 'motalebmirzaemon@gmail.com'}\n* **Phone / WhatsApp:** ${siteContext.phone || '+880 1880604567'}\n* **Location:** ${siteContext.location || 'Feni, Bangladesh'}\n* Or click the **Contact Me** button below to send a message directly.`;
  }
  if (
    query.includes('service') ||
    query.includes('cyber') ||
    query.includes('security') ||
    query.includes('hack') ||
    query.includes('web') ||
    query.includes('skill')
  ) {
    return `Abdul Motaleb provides professional services in:\n\n1. **Cyber Security & Ethical Hacking:** Vulnerability assessments, web application penetration testing\n2. **Full-Stack Web Development:** Modern, ultra-secure React & PHP web solutions\n3. **Social Media Growth & Marketing:** Organic reach and campaign optimization\n4. **Security Consultation:** Infrastructure hardening and defense\n\nHow can Abdul help with your project?`;
  }
  if (query.includes('project')) {
    return `Abdul has built several verified technical projects including:\n\n* **Cyber Security Dashboard:** Real-time threat detection interface\n* **E-Commerce Platform:** High-performance secure online store\n* **Social Media Tool:** Automated posting and audience sentiment analysis\n\nCheck out the Projects page on this site for interactive live previews!`;
  }
  return `Hi! I'm Abdul's AI Assistant. I can share details regarding Abdul Motaleb's Cyber Security expertise, Web Development projects, verified skills, and direct contact options. How can I assist you today?`;
}

export async function sendChatMessageStream({
  messages,
  aiSettings,
  knowledgeBase,
  siteContext,
  onChunk,
  signal
}: ChatServiceOptions): Promise<string> {
  // Format knowledge base items
  const activeKnowledge = knowledgeBase
    .filter((k) => k.active)
    .sort((a, b) => a.order - b.order)
    .map((k) => `Q: ${k.question}\nA: ${k.answer}`)
    .join('\n\n');

  // Format website summary context
  const fullKnowledgeContext = `
${activeKnowledge}

--- Core Portfolio Context ---
Website Title: ${siteContext.siteTitle}
Owner: Abdul Motaleb (Cyber Security Expert, Ethical Hacker, Web Developer, Social Media Expert)
Location: ${siteContext.location}
Contact Email: ${siteContext.email}
Phone / WhatsApp: ${siteContext.phone} (${siteContext.whatsapp})
Skills: ${siteContext.skillsSummary}
Services: ${siteContext.servicesSummary}
Projects: ${siteContext.projectsSummary}
Experience Milestones: ${siteContext.experienceSummary}
`;

  // Limit conversation history to configured max turns
  const maxTurns = (aiSettings.maxTurns || 10) * 2;
  const recentMessages = messages.slice(-maxTurns);

  // Filter messages for backend
  const apiMessages = recentMessages.map((m) => ({
    role: m.sender === 'user' ? 'user' : 'assistant',
    content: m.text
  }));

  // Build language directive based on settings
  let languageDirective = '';
  if (aiSettings.languageBehavior === 'bn') {
    languageDirective = '\nLanguage Requirement: Always respond in natural fluent Bengali (বাংলা).';
  } else if (aiSettings.languageBehavior === 'en') {
    languageDirective = '\nLanguage Requirement: Always respond in English.';
  } else if (aiSettings.languageBehavior === 'mixed') {
    languageDirective = '\nLanguage Requirement: Respond in natural conversational Banglish (mixed Bengali and English).';
  } else {
    languageDirective = '\nLanguage Requirement: Answer in the exact language used by the visitor (English if English, Bengali if Bengali, Banglish if mixed).';
  }

  const effectiveSystemPrompt = `${aiSettings.systemPrompt || ''}\n${languageDirective}\nPersonality Style: ${aiSettings.personality || 'Professional, cybersecurity-aware, friendly and concise.'}`;

  const requestPayload = {
    messages: apiMessages,
    systemPrompt: effectiveSystemPrompt,
    model: aiSettings.model || 'gemini-3.8-flash',
    knowledgeContext: fullKnowledgeContext,
    temperature: aiSettings.temperature ?? 0.7
  };

  const lastUserMsg = apiMessages.filter((m) => m.role === 'user').pop()?.content || '';

  // Function to stream text chunk by chunk to simulate natural typing
  const streamTextSmoothly = async (fullText: string): Promise<string> => {
    const words = fullText.split(' ');
    let current = '';
    for (let i = 0; i < words.length; i += 2) {
      if (signal?.aborted) break;
      current += (i === 0 ? '' : ' ') + words.slice(i, i + 2).join(' ');
      onChunk(current);
      await new Promise((r) => setTimeout(r, 25));
    }
    return fullText;
  };

  // Try API endpoints: First /api/chat, then Netlify function fallback
  let response: Response | null = null;
  const endpoints = ['/api/chat', '/.netlify/functions/chat'];

  for (const endpoint of endpoints) {
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestPayload),
        signal
      });

      // If not 404 and ok or error with valid response, accept this response
      if (res.status !== 404) {
        response = res;
        break;
      }
    } catch (err: unknown) {
      if ((err as { name?: string })?.name === 'AbortError') {
        return '';
      }
      // Connection issue, try next endpoint
    }
  }

  // If endpoints returned valid response, process stream or JSON
  if (response && response.ok) {
    const contentType = response.headers.get('content-type') || '';

    // Case 1: Server-Sent Events stream or chunked stream
    if (contentType.includes('text/event-stream') || response.body) {
      try {
        const reader = response.body?.getReader();
        if (reader) {
          const decoder = new TextDecoder();
          let accumulatedText = '';
          let buffer = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith('data: ')) {
                const dataStr = trimmed.slice(6);
                if (dataStr === '[DONE]') {
                  return accumulatedText;
                }
                try {
                  const parsed = JSON.parse(dataStr);
                  if (parsed.text) {
                    accumulatedText += parsed.text;
                    onChunk(accumulatedText);
                  } else if (parsed.error) {
                    throw new Error(parsed.error);
                  }
                } catch {
                  if (dataStr && dataStr !== '[DONE]') {
                    accumulatedText += dataStr;
                    onChunk(accumulatedText);
                  }
                }
              }
            }
          }

          if (accumulatedText.trim()) {
            return accumulatedText;
          }
        }
      } catch (streamReadErr: unknown) {
        if ((streamReadErr as { name?: string })?.name === 'AbortError') {
          return '';
        }
        console.warn('Stream reader encountered issue, evaluating fallback:', streamReadErr);
      }
    }

    // Case 2: JSON Response
    try {
      const data = await response.json();
      if (data.text) {
        return await streamTextSmoothly(data.text);
      }
    } catch {
      // not json
    }
  }

  // If response failed with an explicit error other than 404, check error message
  if (response && !response.ok && response.status !== 404) {
    try {
      const errJson = await response.json().catch(() => ({}));
      if (errJson.error) {
        console.warn('Backend returned error, activating local knowledge engine:', errJson.error);
      }
    } catch {
      // continue to fallback
    }
  }

  // Resilient Client-Side Fallback:
  // If user has VITE_OPENAI_API_KEY in client environment, try direct OpenAI call
  const clientOpenAIKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (clientOpenAIKey) {
    try {
      const directRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${clientOpenAIKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: effectiveSystemPrompt + '\n' + fullKnowledgeContext },
            ...apiMessages
          ],
          temperature: aiSettings.temperature ?? 0.7
        }),
        signal
      });

      if (directRes.ok) {
        const data = await directRes.json();
        const reply = data.choices?.[0]?.message?.content;
        if (reply) {
          return await streamTextSmoothly(reply);
        }
      }
    } catch (e: unknown) {
      if ((e as { name?: string })?.name === 'AbortError') return '';
      console.warn('Direct client OpenAI call failed, switching to knowledge engine:', e);
    }
  }

  // Fallback to Knowledge Engine: Guarantee 100% answer delivery without any 404!
  const fallbackAnswer = generateClientFallbackAnswer(lastUserMsg, knowledgeBase, siteContext);
  return await streamTextSmoothly(fallbackAnswer);
}
