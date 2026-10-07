import React, { useState, useEffect } from 'react';
import { useData } from '../../context/DataContext';
import { SocialLink } from '../../types';
import {
  Plus,
  Trash2,
  Edit2,
  MoveUp,
  MoveDown,
  CheckCircle,
  X,
  ExternalLink,
  Save,
  Globe,
  Share2,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { formatSocialUrl, getSocialIconComponent } from '../../utils/socialUtils';

const POPULAR_PLATFORMS = [
  { id: 'facebook', label: 'Facebook' },
  { id: 'github', label: 'GitHub' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'twitter', label: 'Twitter / X' },
  { id: 'instagram', label: 'Instagram' },
  { id: 'telegram', label: 'Telegram' },
  { id: 'website', label: 'Personal Website' }
];

export const AdminSocial: React.FC = () => {
  const { socialLinks, addSocial, updateSocial, deleteSocial, reorderSocial, saveAllSocial } = useData();

  // Local state for direct editing
  const [items, setItems] = useState<SocialLink[]>([]);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Sync local items with context socialLinks
  useEffect(() => {
    setItems(socialLinks);
  }, [socialLinks]);

  const [newSocial, setNewSocial] = useState<Omit<SocialLink, 'id'>>({
    platform: 'github',
    title: 'GitHub Profile',
    url: '',
    icon: 'Github',
    order: socialLinks.length + 1,
    active: true
  });

  const showNotice = (msg: string, type: 'success' | 'error' = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleUrlChange = (id: string, newUrl: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, url: newUrl } : item))
    );
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, title: newTitle } : item))
    );
  };

  const handleToggleActive = async (id: string) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, active: !item.active } : item
    );
    setItems(updated);
    const target = updated.find((i) => i.id === id);
    if (target) {
      await updateSocial(id, { active: target.active });
      showNotice(
        `"${target.title}" is now ${target.active ? 'ACTIVE' : 'HIDDEN'}!`,
        'success'
      );
    }
  };

  // Quick single-item update
  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSocial) return;

    const formattedUrl = formatSocialUrl(editingSocial.url, editingSocial.platform);
    const updatedPayload: SocialLink = {
      ...editingSocial,
      url: formattedUrl,
      title: editingSocial.title.trim() || editingSocial.platform.toUpperCase()
    };

    setIsSaving(true);
    try {
      await updateSocial(editingSocial.id, updatedPayload);
      setEditingSocial(null);
      showNotice(`"${updatedPayload.title}" updated successfully!`);
    } catch {
      showNotice('Failed to update social channel.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Create new social channel
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSocial.url.trim()) return;

    const formattedUrl = formatSocialUrl(newSocial.url, newSocial.platform);
    setIsSaving(true);
    try {
      await addSocial({
        ...newSocial,
        url: formattedUrl,
        title: newSocial.title.trim() || newSocial.platform.toUpperCase(),
        order: items.length + 1
      });
      setIsAdding(false);
      setNewSocial({
        platform: 'github',
        title: 'GitHub Profile',
        url: '',
        icon: 'Github',
        order: items.length + 2,
        active: true
      });
      showNotice('New social channel added successfully!');
    } catch {
      showNotice('Failed to add social channel.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  // Bulk save all channels (guarantees persistence across page loads & Firebase)
  const handleSaveAll = async () => {
    setIsSaving(true);
    try {
      const sanitized = items.map((item, idx) => ({
        ...item,
        order: idx + 1,
        url: formatSocialUrl(item.url, item.platform),
        title: item.title.trim() || item.platform.toUpperCase()
      }));
      await saveAllSocial(sanitized);
      showNotice('সোশ্যাল মিডিয়া লিংক সফলভাবে আপডেট ও সংরক্ষিত হয়েছে! (All social links saved!)');
    } catch {
      showNotice('সংরক্ষণ করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[index - 1];
    reordered[index - 1] = temp;
    setItems(reordered);
    await reorderSocial(reordered);
    showNotice('Order updated.');
  };

  const moveDown = async (index: number) => {
    if (index === items.length - 1) return;
    const reordered = [...items];
    const temp = reordered[index];
    reordered[index] = reordered[index + 1];
    reordered[index + 1] = temp;
    setItems(reordered);
    await reorderSocial(reordered);
    showNotice('Order updated.');
  };

  // Quick preset adder
  const handleAddPreset = async (presetId: string, label: string) => {
    const existing = items.find((i) => i.platform.toLowerCase() === presetId);
    if (existing) {
      setEditingSocial(existing);
      return;
    }
    const newEntry: Omit<SocialLink, 'id'> = {
      platform: presetId,
      title: label,
      url: presetId === 'whatsapp' ? 'https://wa.me/8801880604567' : `https://${presetId}.com/`,
      icon: label,
      order: items.length + 1,
      active: true
    };
    await addSocial(newEntry);
    showNotice(`Added ${label}! Please enter your profile link below.`);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2.5 transition-all shadow-lg ${
            notification.type === 'success'
              ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
              : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
          }`}
        >
          {notification.type === 'success' ? (
            <CheckCircle className="w-4 h-4 shrink-0 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          )}
          <span className="font-medium">{notification.msg}</span>
        </div>
      )}

      {/* Header & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white">Social Media & Contact Channels</h3>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            হেডার, হিরো সেকশন, কন্টাক্ট এবং ফুটারে প্রদর্শিত সোশ্যাল প্রোফাইল লিঙ্ক পরিচালনা করুন
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/10 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Channel</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>Save All Links</span>
          </button>
        </div>
      </div>

      {/* Preset Quick Actions */}
      <div className="p-4 rounded-xl border border-cyan-500/10 bg-[#060b18]/70 flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-slate-400 mr-2 flex items-center gap-1">
          <Globe className="w-3.5 h-3.5 text-cyan-400" /> Quick Presets:
        </span>
        {POPULAR_PLATFORMS.map((plat) => {
          const isPresent = items.some((i) => i.platform.toLowerCase() === plat.id);
          return (
            <button
              key={plat.id}
              onClick={() => handleAddPreset(plat.id, plat.label)}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-mono transition-all border ${
                isPresent
                  ? 'border-cyan-500/20 bg-cyan-500/5 text-cyan-300 hover:border-cyan-400/40'
                  : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {getSocialIconComponent(plat.id, 'w-3 h-3')}
              <span>{plat.label}</span>
              {!isPresent && <span className="text-cyan-400 font-bold ml-0.5">+</span>}
            </button>
          );
        })}
      </div>

      {/* Main Social Channels List / Interactive Editor */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 min-w-[700px]">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-14 text-center">Order</th>
                <th className="p-4 w-44">Platform & Title</th>
                <th className="p-4">Profile URL / Link</th>
                <th className="p-4 w-28 text-center">Visibility</th>
                <th className="p-4 w-24 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {items.map((item, idx) => (
                <tr key={item.id} className="hover:bg-slate-800/30 transition-colors">
                  {/* Order control */}
                  <td className="p-4 text-center font-mono">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        title="Move Up"
                        className="p-1 hover:text-cyan-400 disabled:opacity-20 transition-colors"
                      >
                        <MoveUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === items.length - 1}
                        title="Move Down"
                        className="p-1 hover:text-cyan-400 disabled:opacity-20 transition-colors"
                      >
                        <MoveDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                  {/* Platform & Label */}
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                        {getSocialIconComponent(item.platform, 'w-4 h-4')}
                      </div>
                      <div className="space-y-1 w-full">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 block font-bold">
                          {item.platform}
                        </span>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) => handleTitleChange(item.id, e.target.value)}
                          placeholder="Display Name"
                          className="w-full px-2 py-1 rounded bg-[#060b18] border border-cyan-500/20 text-xs text-white focus:border-cyan-400 outline-none"
                        />
                      </div>
                    </div>
                  </td>

                  {/* Profile URL Input */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => handleUrlChange(item.id, e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 rounded-lg bg-[#060b18] border border-cyan-500/30 text-xs text-cyan-300 font-mono focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 outline-none"
                      />
                      {item.url && item.url !== '#' && (
                        <a
                          href={formatSocialUrl(item.url, item.platform)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Open Link"
                          className="p-1.5 rounded-lg border border-cyan-500/20 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/50 transition-colors shrink-0"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </td>

                  {/* Active Toggle Switch */}
                  <td className="p-4 text-center">
                    <button
                      onClick={() => handleToggleActive(item.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider transition-all border ${
                        item.active
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                          : 'bg-slate-800/80 border-slate-700 text-slate-500'
                      }`}
                    >
                      {item.active ? 'ACTIVE' : 'HIDDEN'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right space-x-1.5 whitespace-nowrap">
                    <button
                      onClick={() => setEditingSocial(item)}
                      title="Edit Details"
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10 transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete channel "${item.title}"?`)) {
                          deleteSocial(item.id);
                          showNotice(`Deleted "${item.title}".`);
                        }
                      }}
                      title="Delete Channel"
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer save reminder */}
        <div className="p-4 bg-[#060b18] border-t border-cyan-500/20 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="font-mono text-[11px]">
            💡 লিঙ্ক পরিবর্তন করার পর উপরের অথবা নিচের <strong className="text-cyan-400 font-bold">"Save All Links"</strong> বাটনে ক্লিক করুন।
          </p>
          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            <span>Save All Links</span>
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.25)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-cyan-400" />
                <h3 className="font-bold text-white">Add Social Channel</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Platform *</label>
              <select
                value={newSocial.platform}
                onChange={(e) => {
                  const plat = e.target.value;
                  const label = POPULAR_PLATFORMS.find((p) => p.id === plat)?.label || plat;
                  setNewSocial({
                    ...newSocial,
                    platform: plat,
                    title: `${label} Profile`
                  });
                }}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              >
                {POPULAR_PLATFORMS.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.label}
                  </option>
                ))}
                <option value="other">Other / Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Display Label</label>
              <input
                type="text"
                placeholder="e.g. GitHub Profile"
                value={newSocial.title}
                onChange={(e) => setNewSocial({ ...newSocial, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">URL / Link *</label>
              <input
                type="text"
                required
                placeholder="https://..."
                value={newSocial.url}
                onChange={(e) => setNewSocial({ ...newSocial, url: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-cyan-300 font-mono"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Tip: Direct username or URL accepted (e.g., facebook.com/abdulmotaleb)
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="newSocialActive"
                checked={newSocial.active}
                onChange={(e) => setNewSocial({ ...newSocial, active: e.target.checked })}
                className="rounded border-cyan-500/30 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="newSocialActive" className="text-xs text-slate-300 font-mono cursor-pointer">
                Visible on public portfolio (Active)
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50"
              >
                Save Channel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingSocial && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.25)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  {getSocialIconComponent(editingSocial.platform, 'w-3.5 h-3.5')}
                </div>
                <h3 className="font-bold text-white">Edit Social Channel</h3>
              </div>
              <button
                type="button"
                onClick={() => setEditingSocial(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Platform</label>
              <select
                value={editingSocial.platform}
                onChange={(e) =>
                  setEditingSocial({ ...editingSocial, platform: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              >
                {POPULAR_PLATFORMS.map((plat) => (
                  <option key={plat.id} value={plat.id}>
                    {plat.label}
                  </option>
                ))}
                <option value="other">Other / Custom</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Display Title</label>
              <input
                type="text"
                required
                value={editingSocial.title}
                onChange={(e) =>
                  setEditingSocial({ ...editingSocial, title: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Target Profile URL *</label>
              <input
                type="text"
                required
                value={editingSocial.url}
                onChange={(e) =>
                  setEditingSocial({ ...editingSocial, url: e.target.value })
                }
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-cyan-300 font-mono"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="editSocialActive"
                checked={editingSocial.active}
                onChange={(e) =>
                  setEditingSocial({ ...editingSocial, active: e.target.checked })
                }
                className="rounded border-cyan-500/30 bg-slate-900 text-cyan-500 focus:ring-0"
              />
              <label htmlFor="editSocialActive" className="text-xs text-slate-300 font-mono cursor-pointer">
                Active and visible on portfolio
              </label>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={() => setEditingSocial(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 disabled:opacity-50"
              >
                Update Channel
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
