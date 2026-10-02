import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ServiceItem } from '../../types';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, X } from 'lucide-react';

export const AdminServices: React.FC = () => {
  const { services, addService, updateService, deleteService, reorderServices } = useData();
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [notification, setNotification] = useState('');

  const [newService, setNewService] = useState<Omit<ServiceItem, 'id'>>({
    title: '',
    titleBn: '',
    description: '',
    descriptionBn: '',
    icon: 'ShieldCheck',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Security',
    order: services.length + 1,
    active: true
  });

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newService.title.trim()) return;
    await addService(newService);
    setIsAdding(false);
    setNewService({
      title: '',
      titleBn: '',
      description: '',
      descriptionBn: '',
      icon: 'ShieldCheck',
      buttonText: 'Explore Service',
      buttonUrl: '#contact',
      category: 'Security',
      order: services.length + 2,
      active: true
    });
    showNotice('Service added successfully!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    await updateService(editingService.id, editingService);
    setEditingService(null);
    showNotice('Service updated successfully!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...services];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderServices(items);
  };

  const moveDown = async (index: number) => {
    if (index === services.length - 1) return;
    const items = [...services];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderServices(items);
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
          <h3 className="text-base font-bold text-white">Services Management</h3>
          <p className="text-xs text-slate-400 font-mono">
            Manage professional offerings, descriptions, and action links
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Service</span>
        </button>
      </div>

      {/* Services Table */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Title</th>
                <th className="p-4">Description</th>
                <th className="p-4">Icon</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {services.map((service, idx) => (
                <tr key={service.id} className="hover:bg-slate-800/30 transition-colors">
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
                        disabled={idx === services.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4 font-semibold text-white">
                    <div>{service.title}</div>
                    {service.titleBn && (
                      <div className="text-[11px] text-slate-400">{service.titleBn}</div>
                    )}
                  </td>
                  <td className="p-4 max-w-xs truncate text-slate-300">
                    {service.description}
                  </td>
                  <td className="p-4 font-mono text-cyan-400">
                    {service.icon}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateService(service.id, { active: !service.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        service.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {service.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingService(service)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete service "${service.title}"?`)) {
                          deleteService(service.id);
                          showNotice('Service deleted.');
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
              <h3 className="font-bold text-white">Add New Service</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title (EN) *</label>
                <input
                  type="text"
                  required
                  value={newService.title}
                  onChange={(e) => setNewService({ ...newService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title (বাংলা)</label>
                <input
                  type="text"
                  value={newService.titleBn}
                  onChange={(e) => setNewService({ ...newService, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description (EN) *</label>
              <textarea
                rows={2}
                required
                value={newService.description}
                onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Icon Name</label>
                <input
                  type="text"
                  value={newService.icon}
                  placeholder="ShieldCheck, Lock, Globe, Layout"
                  onChange={(e) => setNewService({ ...newService, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Target URL</label>
                <input
                  type="text"
                  value={newService.buttonUrl}
                  onChange={(e) => setNewService({ ...newService, buttonUrl: e.target.value })}
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
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Service</h3>
              <button type="button" onClick={() => setEditingService(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title (EN)</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title (বাংলা)</label>
                <input
                  type="text"
                  value={editingService.titleBn || ''}
                  onChange={(e) => setEditingService({ ...editingService, titleBn: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Description</label>
              <textarea
                rows={2}
                value={editingService.description}
                onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Icon</label>
                <input
                  type="text"
                  value={editingService.icon}
                  onChange={(e) => setEditingService({ ...editingService, icon: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">URL</label>
                <input
                  type="text"
                  value={editingService.buttonUrl}
                  onChange={(e) => setEditingService({ ...editingService, buttonUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
