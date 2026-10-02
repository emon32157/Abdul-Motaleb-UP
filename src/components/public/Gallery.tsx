import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { GalleryItem } from '../../types';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  ArrowRight,
  Search,
  Eye,
  Camera
} from 'lucide-react';

export const Gallery: React.FC = () => {
  const { gallery } = useData();
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showAllModal, setShowAllModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Nature', 'Tech', 'Design', 'Others'];

  const filteredItems = gallery
    .filter((item) => item.active)
    .filter((item) => (activeCategory === 'All' ? true : item.category === activeCategory))
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

  // Home preview displays first 8 images (2 rows of 4)
  const previewItems = filteredItems.slice(0, 8);

  const openLightbox = (item: GalleryItem) => {
    const idx = filteredItems.findIndex((g) => g.id === item.id);
    if (idx !== -1) setLightboxIndex(idx);
  };

  const nextLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => ((prev! + 1) % filteredItems.length));
  };

  const prevLightbox = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex === null) return;
    setLightboxIndex((prev) => (prev! - 1 + filteredItems.length) % filteredItems.length);
  };

  const currentLightboxItem = lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section id="gallery" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
              <span>&lt;/&gt;</span>
              <span>{lang === 'bn' ? 'ফটো গ্যালারি' : 'Gallery'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {lang === 'bn' ? 'মুহূর্ত এবং প্রজেক্ট' : 'Moments & Projects'}
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'border border-cyan-500/25 bg-[#0a1224]/80 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 8 Images Grid (2 rows x 4) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {previewItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openLightbox(item)}
              className="group relative h-40 sm:h-48 rounded-xl overflow-hidden border border-cyan-500/25 bg-slate-950 cursor-pointer shadow-lg hover:border-cyan-400/60 hover:shadow-[0_0_20px_rgba(0,242,254,0.2)] transition-all duration-300"
            >
              <img
                src={item.url}
                alt={item.altText || item.title}
                loading="lazy"
                className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#060913]/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <span className="text-xs font-bold text-white truncate">{item.title}</span>
                <span className="text-[10px] font-mono text-cyan-400">{item.category}</span>
              </div>
              <div className="absolute top-2 right-2 p-1 rounded-md bg-[#050811]/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* View All Photos Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowAllModal(true)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-cyan-500/40 bg-[#0a1224] text-cyan-300 hover:text-white hover:border-cyan-400 hover:bg-cyan-500/10 text-xs font-mono font-semibold transition-all shadow-[0_0_15px_rgba(0,242,254,0.15)] hover:scale-105"
          >
            <span>{lang === 'bn' ? `সব ছবি দেখুন (${gallery.length})` : `View All Photos (${gallery.length})`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Lightbox Modal */}
      {currentLightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl animate-in fade-in"
          onClick={() => setLightboxIndex(null)}
        >
          {/* Controls Bar */}
          <div
            className="absolute top-4 left-4 right-4 flex items-center justify-between text-white z-10 px-2"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-slate-900/80 border border-slate-700 font-mono text-xs text-cyan-400">
                {lightboxIndex! + 1} / {filteredItems.length}
              </span>
              <span className="text-sm font-semibold hidden sm:inline text-slate-200">
                {currentLightboxItem.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLightboxIndex(null)}
                className="p-2 rounded-lg bg-slate-900/80 border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Previous Button */}
          <button
            onClick={prevLightbox}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Image Display */}
          <div
            className="max-w-4xl max-h-[80vh] p-4 flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={currentLightboxItem.url}
              alt={currentLightboxItem.altText || currentLightboxItem.title}
              className="max-w-full max-h-[72vh] object-contain rounded-xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.2)]"
            />
            <div className="mt-3 text-center">
              <p className="text-sm font-bold text-white">{currentLightboxItem.title}</p>
              <p className="text-xs font-mono text-cyan-400/80 mt-0.5">
                Category: {currentLightboxItem.category}
              </p>
            </div>
          </div>

          {/* Next Button */}
          <button
            onClick={nextLightbox}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-slate-900/80 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:border-cyan-400 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}

      {/* View All Photos Full Screen Modal */}
      {showAllModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 sm:p-8 animate-in fade-in"
          onClick={() => setShowAllModal(false)}
        >
          <div
            className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-2xl border border-cyan-500/40 bg-[#070c1a] shadow-[0_0_60px_rgba(0,242,254,0.2)] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Bar */}
            <div className="p-4 sm:p-5 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-4 bg-[#091022]">
              <div className="flex items-center gap-2">
                <Camera className="w-5 h-5 text-cyan-400" />
                <h3 className="text-lg font-bold text-white">
                  {lang === 'bn' ? 'সম্পূর্ণ ফটো গ্যালারি' : 'Complete Photo Gallery'} ({filteredItems.length})
                </h3>
              </div>

              {/* Search input in modal */}
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search photos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-cyan-500/30 bg-[#060b18] text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              <button
                onClick={() => setShowAllModal(false)}
                className="p-1.5 rounded-lg border border-slate-700 text-slate-300 hover:text-white hover:border-cyan-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Gallery Grid Container */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      openLightbox(item);
                    }}
                    className="group relative h-36 rounded-lg overflow-hidden border border-cyan-500/20 bg-slate-950 cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
                  >
                    <img
                      src={item.url}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060913] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end">
                      <span className="text-[11px] font-semibold text-white truncate">{item.title}</span>
                      <span className="text-[9px] font-mono text-cyan-400">{item.category}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="p-3 border-t border-cyan-500/15 bg-[#080d1e] flex items-center justify-between text-xs text-slate-400 font-mono">
              <span>All 52+ original photographs preserved</span>
              <button
                onClick={() => setShowAllModal(false)}
                className="px-4 py-1.5 rounded-md bg-slate-800 border border-slate-700 text-slate-200 hover:border-cyan-400 text-xs"
              >
                Close Gallery
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
