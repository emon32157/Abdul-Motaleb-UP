import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ExperienceItem } from '../../types';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, X } from 'lucide-react';

export const AdminExperience: React.FC = () => {
  const { experience, addExperience, updateExperience, deleteExperience, reorderExperience } = useData();
  const [editingExp, setEditingExp] = useState<ExperienceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState('');
  const [skillsInput, setSkillsInput] = useState('Penetration Testing, Auditing');

  const [newExp, setNewExp] = useState<Omit<ExperienceItem, 'id'>>({
    year: '2026',
    position: '',
    positionBn: '',
    organization: '',
    description: '',
    descriptionBn: '',
    skills: ['Cyber Security', 'Assessment'],
    icon: 'Shield',
    order: experience.length + 1,
    active: true
  });

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExp.position.trim()) return;
    const skillsList = skillsInput.split(',').map((s) => s.trim()).filter(Boolean);
    await addExperience({ ...newExp, skills: skillsList });
    setIsAdding(false);
    showNotice('Experience item created!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExp) return;
    await updateExperience(editingExp.id, editingExp);
    setEditingExp(null);
    showNotice('Experience updated!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...experience];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderExperience(items);
  };

  const moveDown = async (index: number) => {
    if (index === experience.length - 1) return;
    const items = [...experience];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderExperience(items);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Career Timeline & Journey</h3>
          <p className="text-xs text-slate-400 font-mono">
            Manage professional roles, years, and organizational milestones
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Journey Node</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Year</th>
                <th className="p-4">Position</th>
                <th className="p-4">Organization</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {experience.map((exp, idx) => (
                <tr key={exp.id} className="hover:bg-slate-800/30 transition-colors">
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
                        disabled={idx === experience.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-300">
                    {exp.year}
                  </td>
                  <td className="p-4 font-semibold text-white">
                    <div>{exp.position}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {exp.description}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {exp.organization || '—'}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateExperience(exp.id, { active: !exp.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        exp.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {exp.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingExp(exp)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete experience node "${exp.position}"?`)) {
                          deleteExperience(exp.id);
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
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Add Journey Node</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Year *</label>
                <input
                  type="text"
                  required
                  placeholder="2026"
                  value={newExp.year}
                  onChange={(e) => setNewExp({ ...newExp, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Organization</label>
                <input
                  type="text"
                  value={newExp.organization}
                  onChange={(e) => setNewExp({ ...newExp, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Position / Role *</label>
              <input
                type="text"
                required
                placeholder="Cyber Security Specialist"
                value={newExp.position}
                onChange={(e) => setNewExp({ ...newExp, position: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
              <input
                type="text"
                placeholder="Network Security | Vulnerability Assessment | Ethical Hacking"
                value={newExp.description}
                onChange={(e) => setNewExp({ ...newExp, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Journey Node</h3>
              <button type="button" onClick={() => setEditingExp(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Year</label>
                <input
                  type="text"
                  required
                  value={editingExp.year}
                  onChange={(e) => setEditingExp({ ...editingExp, year: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Organization</label>
                <input
                  type="text"
                  value={editingExp.organization || ''}
                  onChange={(e) => setEditingExp({ ...editingExp, organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Position</label>
              <input
                type="text"
                required
                value={editingExp.position}
                onChange={(e) => setEditingExp({ ...editingExp, position: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
              <input
                type="text"
                value={editingExp.description}
                onChange={(e) => setEditingExp({ ...editingExp, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingExp(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
