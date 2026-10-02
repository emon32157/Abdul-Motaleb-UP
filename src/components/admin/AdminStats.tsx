import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { StatItem } from '../../types';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, X } from 'lucide-react';

export const AdminStats: React.FC = () => {
  const { stats, addStat, updateStat, deleteStat, reorderStats } = useData();
  const [editingStat, setEditingStat] = useState<StatItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState('');

  const [newStat, setNewStat] = useState<Omit<StatItem, 'id'>>({
    number: '10+',
    label: '',
    labelBn: '',
    icon: 'Terminal',
    order: stats.length + 1,
    active: true
  });

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStat.label.trim()) return;
    await addStat(newStat);
    setIsAdding(false);
    showNotice('Statistic metric added!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingStat) return;
    await updateStat(editingStat.id, editingStat);
    setEditingStat(null);
    showNotice('Statistic updated!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...stats];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderStats(items);
  };

  const moveDown = async (index: number) => {
    if (index === stats.length - 1) return;
    const items = [...stats];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderStats(items);
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
          <h3 className="text-base font-bold text-white">Metrics & Key Statistics</h3>
          <p className="text-xs text-slate-400 font-mono">
            Numbers that matter: Projects completed, websites developed, client satisfaction
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Metric</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
            <tr>
              <th className="p-4 w-12 text-center">Order</th>
              <th className="p-4">Number</th>
              <th className="p-4">Label (EN)</th>
              <th className="p-4">Label (বাংলা)</th>
              <th className="p-4">Icon</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyan-500/10">
            {stats.map((stat, idx) => (
              <tr key={stat.id} className="hover:bg-slate-800/30 transition-colors">
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
                      disabled={idx === stats.length - 1}
                      className="p-1 hover:text-cyan-400 disabled:opacity-20"
                    >
                      <MoveDown className="w-3 h-3" />
                    </button>
                  </div>
                </td>
                <td className="p-4 font-mono font-bold text-lg text-white">
                  {stat.number}
                </td>
                <td className="p-4 font-medium text-slate-200">
                  {stat.label}
                </td>
                <td className="p-4 text-slate-400">
                  {stat.labelBn || '—'}
                </td>
                <td className="p-4 font-mono text-cyan-400">
                  {stat.icon}
                </td>
                <td className="p-4">
                  <button
                    onClick={() => updateStat(stat.id, { active: !stat.active })}
                    className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                      stat.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {stat.active ? 'ACTIVE' : 'OFF'}
                  </button>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => setEditingStat(stat)}
                    className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete stat "${stat.label}"?`)) {
                        deleteStat(stat.id);
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
              <h3 className="font-bold text-white">Add Stat Metric</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Number / Value (e.g. 50+, 5+) *</label>
              <input
                type="text"
                required
                value={newStat.number}
                onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Label (English) *</label>
              <input
                type="text"
                required
                placeholder="Projects Completed"
                value={newStat.label}
                onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Label (বাংলা)</label>
              <input
                type="text"
                placeholder="প্রজেক্ট সম্পন্ন"
                value={newStat.labelBn}
                onChange={(e) => setNewStat({ ...newStat, labelBn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Icon Name</label>
              <input
                type="text"
                value={newStat.icon}
                placeholder="Terminal, Globe, Users, Award"
                onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
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
                Save Metric
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingStat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Metric</h3>
              <button type="button" onClick={() => setEditingStat(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Number / Value</label>
              <input
                type="text"
                required
                value={editingStat.number}
                onChange={(e) => setEditingStat({ ...editingStat, number: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Label (English)</label>
              <input
                type="text"
                required
                value={editingStat.label}
                onChange={(e) => setEditingStat({ ...editingStat, label: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Label (বাংলা)</label>
              <input
                type="text"
                value={editingStat.labelBn || ''}
                onChange={(e) => setEditingStat({ ...editingStat, labelBn: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Icon</label>
              <input
                type="text"
                value={editingStat.icon}
                onChange={(e) => setEditingStat({ ...editingStat, icon: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingStat(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update Metric
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
