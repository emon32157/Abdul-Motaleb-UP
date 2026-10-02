import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { SkillItem } from '../../types';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, Save, X } from 'lucide-react';

export const AdminSkills: React.FC = () => {
  const { skills, addSkill, updateSkill, deleteSkill, reorderSkills } = useData();
  const [editingSkill, setEditingSkill] = useState<SkillItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newSkill, setNewSkill] = useState<Omit<SkillItem, 'id'>>({
    name: '',
    percentage: 85,
    icon: 'Shield',
    category: 'Security',
    description: '',
    order: skills.length + 1,
    active: true,
    color: '#00f2fe'
  });

  const [notification, setNotification] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;
    await addSkill(newSkill);
    setIsAdding(false);
    setNewSkill({
      name: '',
      percentage: 85,
      icon: 'Shield',
      category: 'Security',
      description: '',
      order: skills.length + 2,
      active: true,
      color: '#00f2fe'
    });
    showNotice('New skill created successfully!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkill) return;
    await updateSkill(editingSkill.id, editingSkill);
    setEditingSkill(null);
    showNotice('Skill updated successfully!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const newItems = [...skills];
    const temp = newItems[index];
    newItems[index] = newItems[index - 1];
    newItems[index - 1] = temp;
    await reorderSkills(newItems);
  };

  const moveDown = async (index: number) => {
    if (index === skills.length - 1) return;
    const newItems = [...skills];
    const temp = newItems[index];
    newItems[index] = newItems[index + 1];
    newItems[index + 1] = temp;
    await reorderSkills(newItems);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-white">Skills & Circular Dials Management</h3>
          <p className="text-xs text-slate-400 font-mono">
            {skills.length} skills configured • Percentage dials animated on scroll
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Skill</span>
        </button>
      </div>

      {/* Skills Table List */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Skill Name</th>
                <th className="p-4">Percentage</th>
                <th className="p-4">Icon & Color</th>
                <th className="p-4">Category</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {skills.map((skill, idx) => (
                <tr key={skill.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 text-center font-mono">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => moveUp(idx)}
                        disabled={idx === 0}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                        title="Move Up"
                      >
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => moveDown(idx)}
                        disabled={idx === skills.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                        title="Move Down"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {skill.name}
                  </td>
                  <td className="p-4 font-mono font-bold text-cyan-300">
                    {skill.percentage}%
                  </td>
                  <td className="p-4 font-mono flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full border border-white/40"
                      style={{ backgroundColor: skill.color || '#00f2fe' }}
                    />
                    <span>{skill.icon}</span>
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {skill.category}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateSkill(skill.id, { active: !skill.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        skill.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {skill.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingSkill(skill)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                      title="Edit Skill"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete skill "${skill.name}"?`)) {
                          deleteSkill(skill.id);
                          showNotice('Skill deleted.');
                        }
                      }}
                      className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                      title="Delete Skill"
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

      {/* Add Skill Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Add New Skill</h3>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Skill Name *</label>
              <input
                type="text"
                required
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Percentage (0-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={newSkill.percentage}
                  onChange={(e) => setNewSkill({ ...newSkill, percentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <select
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Security">Security</option>
                  <option value="Development">Development</option>
                  <option value="Design">Design</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Icon Name</label>
                <input
                  type="text"
                  value={newSkill.icon}
                  placeholder="Shield, Terminal, Code, Cpu"
                  onChange={(e) => setNewSkill({ ...newSkill, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Accent Hex Color</label>
                <input
                  type="text"
                  value={newSkill.color}
                  onChange={(e) => setNewSkill({ ...newSkill, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
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
                Save Skill
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-md rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Skill</h3>
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Skill Name</label>
              <input
                type="text"
                required
                value={editingSkill.name}
                onChange={(e) => setEditingSkill({ ...editingSkill, name: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Percentage (0-100)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={editingSkill.percentage}
                  onChange={(e) => setEditingSkill({ ...editingSkill, percentage: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <input
                  type="text"
                  value={editingSkill.category}
                  onChange={(e) => setEditingSkill({ ...editingSkill, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Icon Name</label>
                <input
                  type="text"
                  value={editingSkill.icon}
                  onChange={(e) => setEditingSkill({ ...editingSkill, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Color Hex</label>
                <input
                  type="text"
                  value={editingSkill.color || '#00f2fe'}
                  onChange={(e) => setEditingSkill({ ...editingSkill, color: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingSkill(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update Skill
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
