import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { TestimonialItem } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, Upload, X, Star } from 'lucide-react';

export const AdminTestimonials: React.FC = () => {
  const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial, reorderTestimonials } = useData();
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const [newItem, setNewItem] = useState<Omit<TestimonialItem, 'id'>>({
    clientName: '',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    position: '',
    review: '',
    reviewBn: '',
    rating: 5,
    date: '2026',
    order: testimonials.length + 1,
    active: true
  });

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToImgBB(file, 'testimonial-avatar');
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, clientImage: res.url });
      } else {
        setNewItem({ ...newItem, clientImage: res.url });
      }
      showNotice('Uploaded to ImgBB!');
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('Upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.clientName.trim() || !newItem.review.trim()) return;
    await addTestimonial(newItem);
    setIsAdding(false);
    showNotice('Testimonial added!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await updateTestimonial(editingItem.id, editingItem);
    setEditingItem(null);
    showNotice('Testimonial updated!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...testimonials];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderTestimonials(items);
  };

  const moveDown = async (index: number) => {
    if (index === testimonials.length - 1) return;
    const items = [...testimonials];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderTestimonials(items);
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
          <h3 className="text-base font-bold text-white">Client Testimonials</h3>
          <p className="text-xs text-slate-400 font-mono">
            Manage client reviews, ratings, corporate positions and avatars
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Client</th>
                <th className="p-4">Position</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Review</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {testimonials.map((test, idx) => (
                <tr key={test.id} className="hover:bg-slate-800/30 transition-colors">
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
                        disabled={idx === testimonials.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={test.clientImage}
                        alt={test.clientName}
                        className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
                      />
                      <span className="font-semibold text-white">{test.clientName}</span>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-cyan-400">
                    {test.position}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(Math.max(0, Math.min(5, Math.floor(test.rating || 5))))].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-current" />
                      ))}
                    </div>
                  </td>
                  <td className="p-4 max-w-xs truncate text-slate-300">
                    {test.review}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateTestimonial(test.id, { active: !test.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        test.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {test.active ? 'ACTIVE' : 'OFF'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingItem(test)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete testimonial from "${test.clientName}"?`)) {
                          deleteTestimonial(test.id);
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
              <h3 className="font-bold text-white">Add Client Testimonial</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Client Name *</label>
                <input
                  type="text"
                  required
                  value={newItem.clientName}
                  onChange={(e) => setNewItem({ ...newItem, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Position / Company</label>
                <input
                  type="text"
                  placeholder="CEO, TechBD"
                  value={newItem.position}
                  onChange={(e) => setNewItem({ ...newItem, position: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Client Photo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newItem.clientImage}
                  onChange={(e) => setNewItem({ ...newItem, clientImage: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/25">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Review (English) *</label>
              <textarea
                rows={3}
                required
                value={newItem.review}
                onChange={(e) => setNewItem({ ...newItem, review: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Rating (1 to 5 Stars)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={newItem.rating}
                  onChange={(e) => setNewItem({ ...newItem, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  value={newItem.date}
                  onChange={(e) => setNewItem({ ...newItem, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Testimonial</h3>
              <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={editingItem.clientName}
                  onChange={(e) => setEditingItem({ ...editingItem, clientName: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Position</label>
                <input
                  type="text"
                  value={editingItem.position}
                  onChange={(e) => setEditingItem({ ...editingItem, position: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Photo URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.clientImage}
                  onChange={(e) => setEditingItem({ ...editingItem, clientImage: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/25">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Review</label>
              <textarea
                rows={3}
                required
                value={editingItem.review}
                onChange={(e) => setEditingItem({ ...editingItem, review: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Rating</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={editingItem.rating}
                  onChange={(e) => setEditingItem({ ...editingItem, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  value={editingItem.date}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
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
