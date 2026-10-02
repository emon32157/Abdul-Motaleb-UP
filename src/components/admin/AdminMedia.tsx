import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { uploadToImgBB } from '../../services/imgbb';
import { Upload, Copy, Check, Trash2, ExternalLink, HardDrive, Search, CheckCircle } from 'lucide-react';

export const AdminMedia: React.FC = () => {
  const { media, addMediaItem, deleteMediaItem } = useData();
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [notification, setNotification] = useState('');

  const showNotice = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 3000);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await uploadToImgBB(file, file.name);
      await addMediaItem({
        url: res.url,
        title: res.title || file.name,
        category: 'Upload',
        size: `${Math.round(res.size / 1024)} KB`,
        uploadedAt: new Date().toISOString().split('T')[0],
        deleteUrl: res.deleteUrl
      });
      showNotice('Image successfully uploaded to ImgBB!');
    } catch (err: unknown) {
      const error = err as { message?: string };
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (url: string, id: string) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = media.filter(
    (m) =>
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.url.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl">
      {notification && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Central Media Library (ImgBB)</h3>
          <p className="text-xs text-slate-400 font-mono">
            Direct high-speed image hosting via ImgBB API • Key configured
          </p>
        </div>

        {/* Upload Button */}
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all">
          <Upload className="w-4 h-4" />
          <span>{uploading ? 'Uploading to ImgBB...' : 'Upload New Image'}</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Upload Drag & Drop Zone */}
      <div className="p-8 rounded-2xl border-2 border-dashed border-cyan-500/30 bg-[#0a1224]/50 backdrop-blur-md text-center flex flex-col items-center justify-center space-y-3 hover:border-cyan-400/60 transition-colors">
        <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <HardDrive className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">Upload directly to ImgBB cloud</p>
          <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, WEBP, GIF up to 32MB</p>
        </div>
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#060b18] border border-cyan-500/30 text-cyan-300 text-xs font-mono hover:bg-cyan-500/10 transition-colors">
          <Upload className="w-3.5 h-3.5" />
          <span>Browse File</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Search Input */}
      <div className="relative max-w-sm">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Filter media assets..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 rounded-xl border border-cyan-500/30 bg-[#060b18] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 overflow-hidden flex flex-col justify-between group hover:border-cyan-400/50 transition-all shadow-md"
          >
            <div className="h-36 bg-black relative overflow-hidden flex items-center justify-center">
              <img
                src={item.url}
                alt={item.title}
                className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform"
              />
            </div>

            <div className="p-3.5 space-y-2">
              <p className="text-xs font-bold text-white truncate" title={item.title}>
                {item.title}
              </p>
              <p className="text-[11px] font-mono text-slate-400 truncate" title={item.url}>
                {item.url}
              </p>

              <div className="pt-2 border-t border-cyan-500/10 flex items-center justify-between gap-2">
                <button
                  onClick={() => copyToClipboard(item.url, item.id)}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-mono flex items-center justify-center gap-1 transition-all ${
                    copiedId === item.id
                      ? 'border-emerald-500 bg-emerald-500/20 text-emerald-300'
                      : 'border-cyan-500/30 bg-[#060b18] text-cyan-300 hover:bg-cyan-500/10'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white hover:border-cyan-400"
                  title="Open in new tab"
                >
                  <ExternalLink className="w-3 h-3" />
                </a>

                <button
                  onClick={() => {
                    if (confirm('Delete media asset?')) {
                      deleteMediaItem(item.id);
                      showNotice('Media item removed.');
                    }
                  }}
                  className="p-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10"
                  title="Delete Media"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
