import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { NavigationItem } from '../../types';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, X } from 'lucide-react';

export const AdminNavigation: React.FC = () => {
  const { navigation, addNavigation, updateNavigation, deleteNavigation, reorderNavigation } = useData();
  const [editingNav, setEditingNav] = useState<NavigationItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState('');

  const [newNav, setNewNav] = useState<Omit<NavigationItem, 'id'>>({
    title: '',
    titleBn: '',
    href: '#',
    order: navigation.length + 1,
    active: true
  });

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNav.title.trim()) return;
    await addNavigation(newNav);
    setIsAdding(false);
    showNotice('Navigation link created!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingNav) return;
    await updateNavigation(editingNav.id, editingNav);
    setEditingNav(null);
    showNotice('Navigation link updated!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...navigation];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderNavigation(items);
  };

  const moveDown = async (index: number) => {
    if (index === navigation.length - 1) return;
    const items = [...navigation];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderNavigation(items);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Main Menu Navigation</h3>
          <p className="text-xs text-slate-400 font-mono">
            Control header links, multilingual titles, section anchor targets and order
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Menu Item</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-4 w-12 text-center">Order</th>
              <th className="p-4">Title (English)</th>
              <th className="p-4">Title (বাংলা)</th>
              <th className="p-4">Section / Target</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {navigation.map((nav, idx) => (
              <tr key={nav.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 text-center font-mono">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => moveUp(idx)}
                      disabled={idx === 0}
                      className="p-1 hover:text-cyan-400 disabled:opacity-20"
                    >
                      <MoveUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => moveDown(idx)}
                      disabled={idx === navigation.length - 1}
                      className="p-1 hover:text-cyan-400 disabled:opacity-20"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="p-4 font-semibold text-white">
                  {nav.title}
                </td>
                <td className="p-4 text-slate-300">
                  {nav.titleBn}
                </td>
                <td className="p-4 font-mono text-cyan-400">
                  {nav.href}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => updateNavigation(nav.id, { active: !nav.active })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      nav.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {nav.active ? 'ACTIVE' : 'OFF'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingNav(nav)}
                    className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete menu item "${nav.title}"?`)) {
                        deleteNavigation(nav.id);
                        showNotice('Deleted.');
                      }
                    }}
                    className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Add Navigation Item</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title (EN) *</label>
              <input
                type="text"
                required
                placeholder="e.g. Services"
                value={newNav.title}
                onChange={(e) => setNewNav({ ...newNav, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title (বাংলা)</label>
              <input
                type="text"
                placeholder="e.g. সেবা সমূহ"
                value={newNav.titleBn}
                onChange={(e) => setNewNav({ ...newNav, titleBn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Target Href / Anchor *</label>
              <input
                type="text"
                required
                placeholder="#services"
                value={newNav.href}
                onChange={(e) => setNewNav({ ...newNav, href: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingNav && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Navigation Item</h3>
              <button type="button" onClick={() => setEditingNav(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title (EN)</label>
              <input
                type="text"
                required
                value={editingNav.title}
                onChange={(e) => setEditingNav({ ...editingNav, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title (বাংলা)</label>
              <input
                type="text"
                value={editingNav.titleBn}
                onChange={(e) => setEditingNav({ ...editingNav, titleBn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Target Href</label>
              <input
                type="text"
                required
                value={editingNav.href}
                onChange={(e) => setEditingNav({ ...editingNav, href: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingNav(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
