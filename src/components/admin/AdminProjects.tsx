import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ProjectItem } from '../../types';
import { uploadToImgBB } from '../../services/imgbb';
import { Plus, Trash2, Edit2, MoveUp, MoveDown, CheckCircle, Upload, X, Star } from 'lucide-react';

export const AdminProjects: React.FC = () => {
  const { projects, addProject, updateProject, deleteProject, reorderProjects } = useData();
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState('');

  const [newProject, setNewProject] = useState<Omit<ProjectItem, 'id'>>({
    title: '',
    titleBn: '',
    shortDesc: '',
    shortDescBn: '',
    fullDesc: '',
    mainImage: 'https://iili.io/Bev3XOx.jpg',
    technologies: ['HTML', 'CSS', 'JavaScript'],
    category: 'Security',
    liveDemoUrl: '',
    githubUrl: '',
    date: '2026',
    featured: true,
    order: projects.length + 1,
    active: true
  });

  const [techInput, setTechInput] = useState('HTML, CSS, JavaScript');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isEdit = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadToImgBB(file, 'project-cover');
      if (isEdit && editingProject) {
        setEditingProject({ ...editingProject, mainImage: res.url });
      } else {
        setNewProject({ ...newProject, mainImage: res.url });
      }
      showNotice('Image uploaded to ImgBB!');
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('ImgBB upload error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title.trim()) return;
    const techs = techInput.split(',').map((t) => t.trim()).filter(Boolean);
    await addProject({ ...newProject, technologies: techs });
    setIsAdding(false);
    setNewProject({
      title: '',
      titleBn: '',
      shortDesc: '',
      shortDescBn: '',
      fullDesc: '',
      mainImage: 'https://iili.io/Bev3XOx.jpg',
      technologies: ['HTML', 'CSS', 'JavaScript'],
      category: 'Security',
      liveDemoUrl: '',
      githubUrl: '',
      date: '2026',
      featured: false,
      order: projects.length + 2,
      active: true
    });
    showNotice('Project created successfully!');
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    await updateProject(editingProject.id, editingProject);
    setEditingProject(null);
    showNotice('Project updated successfully!');
  };

  const moveUp = async (index: number) => {
    if (index === 0) return;
    const items = [...projects];
    const temp = items[index];
    items[index] = items[index - 1];
    items[index - 1] = temp;
    await reorderProjects(items);
  };

  const moveDown = async (index: number) => {
    if (index === projects.length - 1) return;
    const items = [...projects];
    const temp = items[index];
    items[index] = items[index + 1];
    items[index + 1] = temp;
    await reorderProjects(items);
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
          <h3 className="text-base font-bold text-white">Project Portfolio Manager</h3>
          <p className="text-xs text-slate-400 font-mono">
            Manage projects, screenshots, category tagging and live source URLs
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Table */}
      <div className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#060b18] border-b border-cyan-500/20 text-slate-400 uppercase font-mono text-[10px]">
              <tr>
                <th className="p-4 w-12 text-center">Order</th>
                <th className="p-4">Preview</th>
                <th className="p-4">Project Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Featured</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10">
              {projects.map((proj, idx) => (
                <tr key={proj.id} className="hover:bg-slate-800/30 transition-colors">
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
                        disabled={idx === projects.length - 1}
                        className="p-1 hover:text-cyan-400 disabled:opacity-20"
                      >
                        <MoveDown className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                  <td className="p-4">
                    <img
                      src={proj.mainImage}
                      alt={proj.title}
                      className="w-14 h-10 object-cover rounded-lg border border-cyan-500/30 bg-black"
                    />
                  </td>
                  <td className="p-4 font-semibold text-white">
                    <div>{proj.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {proj.technologies.join(', ')}
                    </div>
                  </td>
                  <td className="p-4 font-mono text-cyan-400">
                    {proj.category}
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateProject(proj.id, { featured: !proj.featured })}
                      className={`p-1.5 rounded-lg border ${
                        proj.featured
                          ? 'border-amber-500/40 text-amber-400 bg-amber-500/15'
                          : 'border-slate-800 text-slate-600'
                      }`}
                      title="Toggle Featured"
                    >
                      <Star className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => updateProject(proj.id, { active: !proj.active })}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono ${
                        proj.active
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}
                    >
                      {proj.active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => {
                        setEditingProject(proj);
                      }}
                      className="p-1.5 rounded-lg border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete project "${proj.title}"?`)) {
                          deleteProject(proj.id);
                          showNotice('Project deleted.');
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

      {/* Add Project Modal */}
      {isAdding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <form
            onSubmit={handleCreate}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Add New Project</h3>
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
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <select
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
                >
                  <option value="Security">Security</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Short Description (EN) *</label>
              <input
                type="text"
                required
                value={newProject.shortDesc}
                onChange={(e) => setNewProject({ ...newProject, shortDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Full Description</label>
              <textarea
                rows={2}
                value={newProject.fullDesc}
                onChange={(e) => setNewProject({ ...newProject, fullDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Main Image & ImgBB Upload */}
            <div className="space-y-2">
              <label className="block text-xs font-mono text-slate-300">Project Main Image</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newProject.mainImage}
                  onChange={(e) => setNewProject({ ...newProject, mainImage: e.target.value })}
                  className="flex-1 px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
                <label className="cursor-pointer px-3 py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-mono flex items-center gap-1 hover:bg-cyan-500/25">
                  <Upload className="w-3.5 h-3.5" />
                  <span>{uploading ? 'Uploading...' : 'ImgBB Upload'}</span>
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
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Technologies (comma separated)
              </label>
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="React, Firebase, Tailwind"
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="text"
                  value={newProject.liveDemoUrl}
                  onChange={(e) => setNewProject({ ...newProject, liveDemoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">GitHub Repo URL</label>
                <input
                  type="text"
                  value={newProject.githubUrl}
                  onChange={(e) => setNewProject({ ...newProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
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
                Create Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Project Modal */}
      {editingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
          <form
            onSubmit={handleUpdate}
            className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-[#091022] p-6 space-y-4 shadow-[0_0_40px_rgba(0,242,254,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <h3 className="font-bold text-white">Edit Project</h3>
              <button type="button" onClick={() => setEditingProject(null)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={editingProject.title}
                  onChange={(e) => setEditingProject({ ...editingProject, title: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                <select
                  value={editingProject.category}
                  onChange={(e) => setEditingProject({ ...editingProject, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
                >
                  <option value="Security">Security</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Social Media">Social Media</option>
                  <option value="Design">Design</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Short Description</label>
              <input
                type="text"
                required
                value={editingProject.shortDesc}
                onChange={(e) => setEditingProject({ ...editingProject, shortDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Full Description</label>
              <textarea
                rows={2}
                value={editingProject.fullDesc || ''}
                onChange={(e) => setEditingProject({ ...editingProject, fullDesc: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">Image URL</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={editingProject.mainImage}
                  onChange={(e) => setEditingProject({ ...editingProject, mainImage: e.target.value })}
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

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Live Demo URL</label>
                <input
                  type="text"
                  value={editingProject.liveDemoUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, liveDemoUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">GitHub URL</label>
                <input
                  type="text"
                  value={editingProject.githubUrl || ''}
                  onChange={(e) => setEditingProject({ ...editingProject, githubUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-cyan-500/20">
              <button
                type="button"
                onClick={() => setEditingProject(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-xs text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
              >
                Update Project
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
