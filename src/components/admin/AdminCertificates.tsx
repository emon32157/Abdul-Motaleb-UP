import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { CertificateItem } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, Upload, X, ExternalLink } from 'lucide-react';

export const AdminCertificates: React.FC = () => {
  const { certificates, addCertificate, updateCertificate, deleteCertificate, reorderCertificates } = useData();
  const [editingCert, setEditingCert] = useState<CertificateItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const [newCert, setNewCert] = useState<Omit<CertificateItem, 'id'>>({
    title: '',
    issuer: '',
    date: '2026',
    credentialId: '',
    credentialUrl: '',
    imageUrl: 'https://iili.io/BevIDNt.jpg',
    description: '',
    order: certificates.length + 1,
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
      const res = await uploadToImgBB(file, 'certificate');
      if (isEdit && editingCert) {
        setEditingCert({ ...editingCert, imageUrl: res.url });
      } else {
        setNewCert({ ...newCert, imageUrl: res.url });
      }
      showNotice('Certificate uploaded to ImgBB!');
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('ImgBB upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.title.trim()) return;
    await addCertificate(newCert);
    setIsAdding(false);
    showNotice('Certificate added!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCert) return;
    await updateCertificate(editingCert.id, editingCert);
    setEditingCert(null);
    showNotice('Certificate updated!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...certificates];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderCertificates(items);
  };

  const moveDown = async (index: number) => {
    if (index === certificates.length - 1) return;
    const items = [...certificates];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderCertificates(items);
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
          <h3 className="text-base font-bold text-white">Certificates & Credentials</h3>
          <p className="text-xs text-slate-400 font-mono">
            Manage industry accreditations, issuers, and verification credentials
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Certificate</span>
        </button>
      </div>

      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Certificate</th>
                <th className="p-4">Title</th>
                <th className="p-4">Issuer</th>
                <th className="p-4">Year</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {certificates.map((cert, idx) => (
                <tr key={cert.id} className="hover:bg-slate-800/30 transition-colors">
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
                        disabled={idx === certificates.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <img
                      src={cert.imageUrl}
                      alt={cert.title}
                      className="w-14 h-10 object-cover rounded border border-cyan-500/30 bg-black"
                    />
                  </td>
                  <td className="p-4 font-semibold text-white">
                    {cert.title}
                  </td>
                  <td className="p-4 font-mono text-emerald-400">
                    {cert.issuer}
                  </td>
                  <td className="p-4 font-mono text-slate-400">
                    {cert.date}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateCertificate(cert.id, { active: !cert.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        cert.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {cert.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => setEditingCert(cert)}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete certificate "${cert.title}"?`)) {
                          deleteCertificate(cert.id);
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
              <h3 className="font-bold text-white">Add Certificate</h3>
              <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Certificate Title *</label>
              <input
                type="text"
                required
                placeholder="Ethical Hacking"
                value={newCert.title}
                onChange={(e) => setNewCert({ ...newCert, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Issuing Body *</label>
                <input
                  type="text"
                  required
                  placeholder="Google, Coursera, Meta"
                  value={newCert.issuer}
                  onChange={(e) => setNewCert({ ...newCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Year / Date</label>
                <input
                  type="text"
                  value={newCert.date}
                  onChange={(e) => setNewCert({ ...newCert, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Certificate Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCert.imageUrl}
                  onChange={(e) => setNewCert({ ...newCert, imageUrl: e.target.value })}
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
              <label className="block text-xs font-mono text-slate-300 mb-1">Verification URL</label>
              <input
                type="text"
                placeholder="https://..."
                value={newCert.credentialUrl}
                onChange={(e) => setNewCert({ ...newCert, credentialUrl: e.target.value })}
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
                Save
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Modal */}
      {editingCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-lg rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Certificate</h3>
              <button type="button" onClick={() => setEditingCert(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Title</label>
              <input
                type="text"
                required
                value={editingCert.title}
                onChange={(e) => setEditingCert({ ...editingCert, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Issuer</label>
                <input
                  type="text"
                  required
                  value={editingCert.issuer}
                  onChange={(e) => setEditingCert({ ...editingCert, issuer: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Date</label>
                <input
                  type="text"
                  value={editingCert.date}
                  onChange={(e) => setEditingCert({ ...editingCert, date: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingCert.imageUrl}
                  onChange={(e) => setEditingCert({ ...editingCert, imageUrl: e.target.value })}
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
              <label className="block text-xs font-mono text-slate-300 mb-1">Verification URL</label>
              <input
                type="text"
                value={editingCert.credentialUrl || ''}
                onChange={(e) => setEditingCert({ ...editingCert, credentialUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3">
              <button
                type="button"
                onClick={() => setEditingCert(null)}
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
