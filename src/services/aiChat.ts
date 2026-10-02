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

  try {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        messages: apiMessages,
        systemPrompt: effectiveSystemPrompt,
        model: aiSettings.model || 'gemini-3.8-flash',
        knowledgeContext: fullKnowledgeContext,
        temperature: aiSettings.temperature ?? 0.7
      }),
      signal
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      throw new Error(errorJson.error || `Server returned ${response.status}: ${response.statusText}`);
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error('Unable to read streaming response from AI server.');
    }

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
          } catch (e: unknown) {
            // If data is raw text
            if (dataStr && dataStr !== '[DONE]') {
              accumulatedText += dataStr;
              onChunk(accumulatedText);
            }
          }
        }
      }
    }

    return accumulatedText;
  } catch (err: unknown) {
    const error = err as { name?: string; message?: string };
    if (error.name === 'AbortError') {
      return '';
    }
    console.error('Chat API stream exception:', error);
    throw error;
  }
}
