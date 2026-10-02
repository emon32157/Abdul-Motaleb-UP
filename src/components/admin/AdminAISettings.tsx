import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AIChatbotSettings } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';
import {
  Bot,
  Sparkles,
  Save,
  CheckCircle,
  AlertCircle,
  Upload,
  RefreshCw,
  Plus,
  Trash2,
  Edit2,
  Sliders,
  MessageSquare,
  ShieldAlert,
  Zap,
  Cpu,
  Palette,
  BarChart3,
  HelpCircle,
  Eye,
  Settings
} from 'lucide-react';

const GEMINI_MODELS = [
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash (Recommended)', desc: 'Ultra-fast, lowest latency, smart reasoning' },
  { id: 'gemini-3.1-pro-preview', name: 'Gemini 3.1 Pro Preview', desc: 'Complex reasoning, STEM & deep code analysis' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', desc: 'Lightweight, rapid response generation' },
  { id: 'gemini-flash-latest', name: 'Gemini Flash Latest', desc: 'Latest dynamic Gemini Flash stable alias' }
];

export const AdminAISettings: React.FC = () => {
  const { aiSettings, updateAISettings, chatAnalytics } = useData();

  const [formData, setFormData] = useState<AIChatbotSettings>({ ...aiSettings });
  const [newQuestion, setNewQuestion] = useState('');
  const [editingQuestionIdx, setEditingQuestionIdx] = useState<number | null>(null);
  const [editingQuestionText, setEditingQuestionText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setErrorMessage(null);
    try {
      const res = await uploadToImgBB(file);
      setFormData((prev) => ({ ...prev, botAvatar: res.url }));
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to upload avatar to ImgBB.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return;
    const updated = [...(formData.suggestedQuestions || []), newQuestion.trim()];
    setFormData((prev) => ({ ...prev, suggestedQuestions: updated }));
    setNewQuestion('');
  };

  const handleRemoveQuestion = (index: number) => {
    const updated = formData.suggestedQuestions.filter((_, idx) => idx !== index);
    setFormData((prev) => ({ ...prev, suggestedQuestions: updated }));
  };

  const handleStartEditQuestion = (index: number) => {
    setEditingQuestionIdx(index);
    setEditingQuestionText(formData.suggestedQuestions[index]);
  };

  const handleSaveEditQuestion = () => {
    if (editingQuestionIdx === null || !editingQuestionText.trim()) return;
    const updated = [...formData.suggestedQuestions];
    updated[editingQuestionIdx] = editingQuestionText.trim();
    setFormData((prev) => ({ ...prev, suggestedQuestions: updated }));
    setEditingQuestionIdx(null);
    setEditingQuestionText('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    try {
      await updateAISettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMessage(error.message || 'Failed to save AI settings.');
    }
  };

  return (
    <div className="space-y-8">
      {/* Title & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#091224]/80 p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Abdul AI Assistant Configuration</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                formData.enabled
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
              }`}>
                {formData.enabled ? 'ACTIVE' : 'DISABLED'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Manage Google Gemini model parameters, personality, prompt guidelines, and UI appearance
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>AI Assistant configuration successfully saved and synchronized!</span>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Master Status & Identity */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Assistant Status & Identity</h4>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <span className="text-xs font-mono text-slate-300">
                {formData.enabled ? 'Chatbot Enabled' : 'Chatbot Disabled'}
              </span>
              <div
                onClick={() => setFormData((p) => ({ ...p, enabled: !p.enabled }))}
                className={`w-12 h-6 rounded-full transition-colors relative p-0.5 border ${
                  formData.enabled ? 'bg-cyan-500 border-cyan-400' : 'bg-slate-800 border-slate-700'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-black transition-transform ${
                    formData.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Bot Display Name</label>
              <input
                type="text"
                value={formData.botName}
                onChange={(e) => setFormData((prev) => ({ ...prev, botName: e.target.value }))}
                placeholder="e.g. Abdul AI Assistant"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Personality Tone</label>
              <input
                type="text"
                value={formData.personality}
                onChange={(e) => setFormData((prev) => ({ ...prev, personality: e.target.value }))}
                placeholder="e.g. Professional, Cyber Security Aware, Friendly, Concise"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          {/* Bot Avatar Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2 space-y-2">
              <label className="block text-xs font-mono text-slate-400">Bot Avatar URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.botAvatar}
                  onChange={(e) => setFormData((prev) => ({ ...prev, botAvatar: e.target.value }))}
                  placeholder="https://iili.io/..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
                <label className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-mono cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    disabled={isUploading}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-[#060a16] border border-cyan-500/20">
              <div className="w-12 h-12 rounded-xl border border-cyan-400/60 overflow-hidden bg-cyan-950/40 shrink-0">
                <img
                  src={formData.botAvatar || 'https://iili.io/Bev2e8G.jpg'}
                  alt="Bot Avatar Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                <p className="text-white font-bold">{formData.botName || 'Abdul AI'}</p>
                <p className="text-emerald-400">Online & Ready</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Gemini Model & Engine */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-cyan-500/10 pb-4">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Google Gemini Model & Parameters</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Selected Gemini Model</label>
              <select
                value={formData.model}
                onChange={(e) => setFormData((prev) => ({ ...prev, model: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                {GEMINI_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] font-mono text-slate-500 mt-1.5">
                Model configured: <span className="text-cyan-300 font-bold">{formData.model}</span> (supports multi-turn streaming)
              </p>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Language Behavior Mode
              </label>
              <select
                value={formData.languageBehavior || 'auto'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    languageBehavior: e.target.value as 'auto' | 'en' | 'bn' | 'mixed'
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="auto">Automatic (Matches Visitor's Language: EN, BN, or Mixed)</option>
                <option value="en">Always English</option>
                <option value="bn">Always Bangla (বাংলা)</option>
                <option value="mixed">Bilingual / Banglish Conversational</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Creativity / Temperature</span>
                <span className="text-cyan-400 font-bold">{formData.temperature ?? 0.7}</span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={formData.temperature ?? 0.7}
                onChange={(e) => setFormData((prev) => ({ ...prev, temperature: parseFloat(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>Precise (0.1)</span>
                <span>Balanced (0.7)</span>
                <span>Creative (1.0)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-2">
                <span>Max Context Turns</span>
                <span className="text-cyan-400 font-bold">{formData.maxTurns ?? 10}</span>
              </div>
              <input
                type="range"
                min="3"
                max="25"
                step="1"
                value={formData.maxTurns ?? 10}
                onChange={(e) => setFormData((prev) => ({ ...prev, maxTurns: parseInt(e.target.value) }))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                <span>3 turns</span>
                <span>10 turns (standard)</span>
                <span>25 turns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Welcome Messages */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-cyan-500/10 pb-4">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Welcome Greetings</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Welcome Message (English)</label>
              <textarea
                rows={4}
                value={formData.welcomeMessage}
                onChange={(e) => setFormData((prev) => ({ ...prev, welcomeMessage: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Welcome Message (বাংলা - Bengali)</label>
              <textarea
                rows={4}
                value={formData.welcomeMessageBn}
                onChange={(e) => setFormData((prev) => ({ ...prev, welcomeMessageBn: e.target.value }))}
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400 font-sans"
              />
            </div>
          </div>
        </div>

        {/* Section 4: System Prompt & Guardrails */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">System Instructions & Guardrails</h4>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
              STRICT HONESTY ENFORCED
            </span>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-2">
              System Prompt (Defines Assistant Role, Verification Rules, Language, and Knowledge Boundaries)
            </label>
            <textarea
              rows={8}
              value={formData.systemPrompt}
              onChange={(e) => setFormData((prev) => ({ ...prev, systemPrompt: e.target.value }))}
              className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-cyan-200 text-xs focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
            />
            <p className="text-[10px] font-mono text-slate-500 mt-2">
              💡 The system automatically appends verified skills, services, projects, certificates, and Knowledge Base items to this prompt at runtime.
            </p>
          </div>
        </div>

        {/* Section 5: Suggested Quick Questions */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Suggested Quick Questions</h4>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Shown to visitors as clickable chips in chat
            </span>
          </div>

          {/* Add Question input */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddQuestion())}
              placeholder="e.g. Do you offer penetration testing?"
              className="flex-1 px-4 py-2 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleAddQuestion}
              className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs flex items-center gap-1 hover:bg-cyan-400 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* List of questions */}
          <div className="space-y-2">
            {(formData.suggestedQuestions || []).map((q, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#060a16] border border-cyan-500/20 group hover:border-cyan-500/40 transition-colors"
              >
                {editingQuestionIdx === idx ? (
                  <div className="flex-1 flex gap-2">
                    <input
                      type="text"
                      value={editingQuestionText}
                      onChange={(e) => setEditingQuestionText(e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg bg-[#091022] border border-cyan-400 text-white text-xs focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleSaveEditQuestion}
                      className="px-3 py-1 rounded-lg bg-emerald-500 text-black text-xs font-bold"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingQuestionIdx(null)}
                      className="px-2 py-1 rounded-lg bg-slate-800 text-slate-300 text-xs"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <span className="text-xs text-slate-200">{q}</span>
                    <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => handleStartEditQuestion(idx)}
                        className="p-1.5 rounded-lg hover:text-cyan-400 hover:bg-slate-800/60 transition-colors"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleRemoveQuestion(idx)}
                        className="p-1.5 rounded-lg hover:text-rose-400 hover:bg-slate-800/60 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Quick Action CTAs & Appearance */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center gap-2.5 border-b border-cyan-500/10 pb-4">
            <Palette className="w-4 h-4 text-cyan-400" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Appearance, CTAs & Placement</h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Contact CTA Button Text</label>
              <input
                type="text"
                value={formData.contactCtaText}
                onChange={(e) => setFormData((prev) => ({ ...prev, contactCtaText: e.target.value }))}
                placeholder="Contact Abdul"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">WhatsApp CTA Button Text</label>
              <input
                type="text"
                value={formData.whatsappCtaText}
                onChange={(e) => setFormData((prev) => ({ ...prev, whatsappCtaText: e.target.value }))}
                placeholder="Chat on WhatsApp"
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Chatbot Theme</label>
              <select
                value={formData.theme || 'cyber-dark'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    theme: e.target.value as 'cyber-dark' | 'neon-green' | 'cyan' | 'matrix'
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="cyber-dark">Cyber Dark (Default)</option>
                <option value="neon-green">Neon Green</option>
                <option value="cyan">Cyan Glow</option>
                <option value="matrix">Matrix Green</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Floating Button Position</label>
              <select
                value={formData.position || 'bottom-right'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    position: e.target.value as 'bottom-right' | 'bottom-left'
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="bottom-right">Bottom-Right Corner (Default)</option>
                <option value="bottom-left">Bottom-Left Corner</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">Chat Window Size</label>
              <select
                value={formData.windowSize || 'standard'}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    windowSize: e.target.value as 'compact' | 'standard' | 'large'
                  }))
                }
                className="w-full px-4 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
              >
                <option value="compact">Compact (360px × 520px)</option>
                <option value="standard">Standard (420px × 620px)</option>
                <option value="large">Large (480px × 700px)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 7: Analytics Overview */}
        <div className="bg-[#091224]/70 p-6 rounded-2xl border border-cyan-500/20 space-y-6">
          <div className="flex items-center justify-between border-b border-cyan-500/10 pb-4">
            <div className="flex items-center gap-2.5">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Conversation Analytics & Privacy</h4>
            </div>
            <label className="flex items-center gap-2 text-xs font-mono text-slate-400 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.storeAnonymousHistory}
                onChange={(e) => setFormData((prev) => ({ ...prev, storeAnonymousHistory: e.target.checked }))}
                className="accent-cyan-400 rounded"
              />
              <span>Store Anonymous Conversation History</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#060a16] border border-cyan-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Total Sessions</div>
              <div className="text-2xl font-bold font-mono text-cyan-300 mt-1">
                {chatAnalytics.totalConversations}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060a16] border border-cyan-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Messages Exchanged</div>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {chatAnalytics.totalMessages}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#060a16] border border-cyan-500/20">
              <div className="text-[11px] font-mono text-slate-400 uppercase">Today's Inquiries</div>
              <div className="text-2xl font-bold font-mono text-purple-400 mt-1">
                {chatAnalytics.todayConversations}
              </div>
            </div>
          </div>

          {chatAnalytics.mostAskedQuestions.length > 0 && (
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400">Most Asked Questions:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {chatAnalytics.mostAskedQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-[#060a16] border border-cyan-500/10 flex items-center justify-between text-xs"
                  >
                    <span className="text-slate-300 truncate pr-2">{q.question}</span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      {q.count}x
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Final Save Button */}
        <div className="flex justify-end pt-4">
          <button
            type="submit"
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save All AI Assistant Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
