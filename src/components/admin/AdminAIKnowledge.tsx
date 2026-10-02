import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { AIKnowledgeItem } from '../../types';
import {
  BookOpen,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Save,
  X,
  AlertCircle,
  HelpCircle,
  Tag,
  Check,
  FolderOpen
} from 'lucide-react';

const CATEGORIES = ['All', 'Services', 'Skills', 'Security', 'Contact', 'Certificates', 'About', 'Other'];

export const AdminAIKnowledge: React.FC = () => {
  const { aiKnowledgeBase, addKnowledgeItem, updateKnowledgeItem, deleteKnowledgeItem } = useData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AIKnowledgeItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    question: string;
    answer: string;
    category: string;
    keywordsText: string;
    active: boolean;
  }>({
    question: '',
    answer: '',
    category: 'Services',
    keywordsText: '',
    active: true
  });

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 3000);
  };

  // Filtered entries
  const filteredItems = aiKnowledgeBase.filter((item) => {
    const matchesCat = selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const query = searchQuery.toLowerCase().trim();
    if (!query) return matchesCat;

    const matchesQ = item.question.toLowerCase().includes(query);
    const matchesA = item.answer.toLowerCase().includes(query);
    const matchesK = item.keywords?.some((k) => k.toLowerCase().includes(query));
    return matchesCat && (matchesQ || matchesA || matchesK);
  });

  const handleOpenAdd = () => {
    setEditingItem(null);
    setFormData({
      question: '',
      answer: '',
      category: 'Services',
      keywordsText: '',
      active: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (item: AIKnowledgeItem) => {
    setEditingItem(item);
    setFormData({
      question: item.question,
      answer: item.answer,
      category: item.category,
      keywordsText: (item.keywords || []).join(', '),
      active: item.active
    });
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.question.trim() || !formData.answer.trim()) {
      showNotification('error', 'Please provide both Question and Answer.');
      return;
    }

    const keywords = formData.keywordsText
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    try {
      if (editingItem) {
        await updateKnowledgeItem(editingItem.id, {
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          keywords,
          active: formData.active
        });
        showNotification('success', 'Knowledge entry updated successfully!');
      } else {
        await addKnowledgeItem({
          question: formData.question.trim(),
          answer: formData.answer.trim(),
          category: formData.category,
          keywords,
          active: formData.active,
          order: aiKnowledgeBase.length + 1
        });
        showNotification('success', 'New knowledge entry added successfully!');
      }
      setIsModalOpen(false);
    } catch (err: unknown) {
      const error = err as { message?: string };
      showNotification('error', error.message || 'Failed to save knowledge item.');
    }
  };

  const handleDelete = async (id: string, question: string) => {
    if (confirm(`Are you sure you want to delete this knowledge entry:\n"${question}"?`)) {
      try {
        await deleteKnowledgeItem(id);
        showNotification('success', 'Knowledge entry deleted.');
      } catch (err: unknown) {
        const error = err as { message?: string };
        showNotification('error', error.message || 'Failed to delete knowledge item.');
      }
    }
  };

  const handleToggleActive = async (item: AIKnowledgeItem) => {
    try {
      await updateKnowledgeItem(item.id, { active: !item.active });
      showNotification('success', `Entry ${!item.active ? 'enabled' : 'disabled'}.`);
    } catch (err: unknown) {
      const error = err as { message?: string };
      showNotification('error', error.message || 'Failed to update entry.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#091224]/80 p-5 rounded-2xl border border-cyan-500/20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_15px_rgba(0,242,254,0.3)]">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <span>AI Knowledge Base</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                {aiKnowledgeBase.length} ENTRIES
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              Custom verified Q&amp;A context injected directly into the Gemini model for ultra-accurate answers
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Knowledge Entry</span>
        </button>
      </div>

      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 animate-in fade-in ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#091224]/60 p-4 rounded-2xl border border-cyan-500/15">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search questions, answers, keywords..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                selectedCategory === cat
                  ? 'bg-cyan-500 text-black font-bold shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'bg-[#060b18] text-slate-400 hover:text-white border border-cyan-500/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Entries List */}
      <div className="space-y-3">
        {filteredItems.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#091224]/40 border border-cyan-500/15 space-y-3">
            <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
            <h4 className="text-slate-300 font-bold text-sm">No knowledge entries found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              {searchQuery || selectedCategory !== 'All'
                ? 'Try adjusting your search criteria or category filter.'
                : 'Click "Add Knowledge Entry" to create custom Q&A items for Abdul AI Assistant.'}
            </p>
          </div>
        ) : (
          filteredItems.map((item) => (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                item.active
                  ? 'bg-[#091224]/70 border-cyan-500/25 hover:border-cyan-500/50'
                  : 'bg-[#060913]/50 border-slate-800 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 font-semibold">
                      {item.category}
                    </span>
                    <button
                      onClick={() => handleToggleActive(item)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold flex items-center gap-1 border transition-colors ${
                        item.active
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${item.active ? 'bg-emerald-400' : 'bg-slate-500'}`} />
                      <span>{item.active ? 'ACTIVE' : 'INACTIVE'}</span>
                    </button>
                  </div>

                  <h4 className="text-sm font-bold text-white font-sans flex items-start gap-2">
                    <span className="text-cyan-400 font-mono">Q:</span>
                    <span>{item.question}</span>
                  </h4>

                  <div className="text-xs text-slate-300 leading-relaxed font-sans bg-[#060a16] p-3 rounded-xl border border-cyan-500/10">
                    <span className="text-emerald-400 font-mono font-bold mr-2">A:</span>
                    <span>{item.answer}</span>
                  </div>

                  {item.keywords && item.keywords.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <Tag className="w-3 h-3 text-slate-500" />
                      {item.keywords.map((k, kIdx) => (
                        <span
                          key={kIdx}
                          className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-400 text-[10px] font-mono"
                        >
                          #{k}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1.5 self-end sm:self-start shrink-0">
                  <button
                    onClick={() => handleToggleActive(item)}
                    title={item.active ? 'Disable Entry' : 'Enable Entry'}
                    className={`p-2 rounded-xl border transition-colors ${
                      item.active
                        ? 'border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10'
                        : 'border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    {item.active ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={() => handleOpenEdit(item)}
                    title="Edit Entry"
                    className="p-2 rounded-xl border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id, item.question)}
                    title="Delete Entry"
                    className="p-2 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-xl bg-[#091224] border border-cyan-500/40 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
            <div className="p-4 bg-[#0a152d] border-b border-cyan-500/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-sm text-white">
                  {editingItem ? 'Edit Knowledge Entry' : 'Add New Knowledge Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveModal} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">Question / Trigger Prompt *</label>
                <input
                  type="text"
                  required
                  value={formData.question}
                  onChange={(e) => setFormData((prev) => ({ ...prev, question: e.target.value }))}
                  placeholder="e.g. What services do you provide?"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Verified Answer (Facts / Detailed response) *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.answer}
                  onChange={(e) => setFormData((prev) => ({ ...prev, answer: e.target.value }))}
                  placeholder="e.g. Cyber Security, Ethical Hacking, Web Development, Social Media Management and Security Consultation."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                  >
                    {CATEGORIES.filter((c) => c !== 'All').map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1.5">Status</label>
                  <div className="flex items-center gap-3 pt-2">
                    <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.active}
                        onChange={(e) => setFormData((prev) => ({ ...prev, active: e.target.checked }))}
                        className="accent-cyan-400 rounded"
                      />
                      <span>Active in Gemini Context</span>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5">
                  Keywords (comma-separated tags)
                </label>
                <input
                  type="text"
                  value={formData.keywordsText}
                  onChange={(e) => setFormData((prev) => ({ ...prev, keywordsText: e.target.value }))}
                  placeholder="e.g. services, cyber security, penetration testing, cost"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#060a16] border border-cyan-500/30 text-white text-xs focus:outline-none focus:border-cyan-400"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-black font-bold text-xs uppercase tracking-wider hover:opacity-95 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{editingItem ? 'Save Changes' : 'Create Entry'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
