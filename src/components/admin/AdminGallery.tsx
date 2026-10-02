import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { GalleryItem } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Search,
  CheckCircle,
  Eye,
  X,
  ExternalLink
} from 'lucide-react';

export const AdminGallery: React.FC = () => {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } = useData();
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  const [newItem, setNewItem] = useState<Omit<GalleryItem, 'id'>>({
    url: '',
    title: '',
    altText: '',
    category: 'Tech',
    order: gallery.length + 1,
    featured: false,
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
      const res = await uploadToImgBB(file, 'gallery-photo');
      if (isEdit && editingItem) {
        setEditingItem({ ...editingItem, url: res.url });
      } else {
        setNewItem({ ...newItem, url: res.url, title: newItem.title || file.name.replace(/\.[^/.]+$/, "") });
      }
      showNotice('Uploaded to ImgBB!');
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('ImgBB upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.url.trim()) {
      alert('Please enter or upload an image URL.');
      return;
    }
    await addGalleryItem(newItem);
    setIsAdding(false);
    setNewItem({
      url: '',
      title: '',
      altText: '',
      category: 'Tech',
      order: gallery.length + 2,
      featured: false,
      active: true
    });
    showNotice('Photo added to gallery!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    await updateGalleryItem(editingItem.id, editingItem);
    setEditingItem(null);
    showNotice('Gallery item updated!');
  };

  const categories = ['All', 'Nature', 'Tech', 'Design', 'Others'];

  const filtered = gallery
    .filter((item) => (filterCategory === 'All' ? true : item.category === filterCategory))
    .filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        (item.altText && item.altText.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6 max-w-6xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Gallery Photo Manager</h3>
          <p className="text-xs text-slate-400 font-mono">
            {gallery.length} photos loaded • All 52 original website assets preserved
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Upload / Add Photo</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title or alt text..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-cyan-500/30 bg-[#060b18] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-mono transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                  : 'bg-[#060b18] border border-cyan-500/20 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Photo Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-xl border border-cyan-500/20 bg-[#0a1224]/80 overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_4px_20px_rgba(0,242,254,0.15)] transition-all flex flex-col"
          >
            <div className="relative h-28 bg-black overflow-hidden">
              <img
                src={item.url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute top-1.5 right-1.5">
                <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-black/80 text-cyan-400 border border-cyan-500/30">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-2.5 flex-1 flex flex-col justify-between">
              <div>
                <p className="text-xs font-semibold text-white truncate" title={item.title}>
                  {item.title}
                </p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">
                  Order #{item.order}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-cyan-500/10">
                <button
                  onClick={() => updateGalleryItem(item.id, { active: !item.active })}
                  className={`text-[9px] font-mono px-1.5 py-0.5 rounded ${
                    item.active ? 'text-emerald-400 bg-emerald-500/10' : 'text-slate-500 bg-slate-800'
                  }`}
                >
                  {item.active ? 'ACTIVE' : 'OFF'}
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingItem(item)}
                    className="p-1 rounded text-cyan-400 hover:bg-cyan-500/10"
                    title="Edit Photo Info"
                  >
                    <Edit2 className="w-3 h-3" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm(`Delete "${item.title}" from gallery?`)) {
                        deleteGalleryItem(item.id);
                        showNotice('Photo deleted.');
                      }
                    }}
                    className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                    title="Delete Photo"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Add Photo to Gallery</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Photo Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Cyber Security Workstation"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL / ImgBB Direct Upload *</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  placeholder="https://iili.io/..."
                  value={newItem.url}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/25">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, false)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                >
                  <option value="Tech">Tech</option>
                  <option value="Nature">Nature</option>
                  <option value="Design">Design</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={newItem.order}
                  onChange={(e) => setNewItem({ ...newItem, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Alt Text</label>
              <input
                type="text"
                placeholder="Descriptive text for accessibility & SEO"
                value={newItem.altText}
                onChange={(e) => setNewItem({ ...newItem, altText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
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
                Add Photo
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
              <h3 className="font-bold text-white">Edit Photo Info</h3>
              <button type="button" onClick={() => setEditingItem(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="w-full h-36 bg-black rounded-xl overflow-hidden border border-cyan-500/30 flex items-center justify-center">
              <img src={editingItem.url} alt={editingItem.title} className="max-h-full object-contain" />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL / Replace</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/25">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Replace</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, true)}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                >
                  <option value="Tech">Tech</option>
                  <option value="Nature">Nature</option>
                  <option value="Design">Design</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={editingItem.order}
                  onChange={(e) => setEditingItem({ ...editingItem, order: Number(e.target.value) })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Alt Text</label>
              <input
                type="text"
                value={editingItem.altText}
                onChange={(e) => setEditingItem({ ...editingItem, altText: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
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
                Update Photo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
