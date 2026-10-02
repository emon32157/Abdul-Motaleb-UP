import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { CertificateItem } from '../../types';
import { Award, ExternalLink, X, Eye } from 'lucide-react';

export const Certificates: React.FC = () => {
  const { certificates } = useData();
  const { lang } = useLanguage();
  const [activeCert, setActiveCert] = useState<CertificateItem | null>(null);

  const activeCertificates = certificates
    .filter((c) => c.active)
    .sort((a, b) => a.order - b.order);

  return (
    <section id="certificates" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'সার্টিফিকেট' : 'Certificates'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'অর্জিত স্বীকৃতি ও সনদপত্র' : 'My Achievements'}
          </h2>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCertificates.map((cert) => (
            <div
              key={cert.id}
              className="group p-4 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md hover:border-cyan-400/50 hover:bg-[#0c162d]/90 hover:shadow-[0_8px_30px_rgba(0,242,254,0.15)] transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Certificate Preview Image Frame */}
                <div
                  className="relative h-36 rounded-xl overflow-hidden border border-cyan-500/30 bg-slate-950 cursor-pointer mb-4"
                  onClick={() => setActiveCert(cert)}
                >
                  <img
                    src={cert.imageUrl}
                    alt={cert.title}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-cyan-950/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute bottom-2 right-2 p-1.5 rounded-md bg-[#050811]/80 backdrop-blur-sm border border-cyan-500/30 text-cyan-300">
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Details */}
                <h3 className="font-bold text-base text-white group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <div className="flex items-center justify-between mt-1 text-xs text-slate-400 font-mono">
                  <span className="text-emerald-400 font-medium">{cert.issuer}</span>
                  <span>{cert.date}</span>
                </div>
              </div>

              {/* View Certificate Button */}
              <div className="pt-4 mt-3 border-t border-cyan-500/10">
                <button
                  onClick={() => setActiveCert(cert)}
                  className="w-full py-2 px-3 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 hover:text-white hover:bg-cyan-500/20 hover:border-cyan-400 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Certificate Modal Lightbox */}
      {activeCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setActiveCert(null)}
        >
          <div
            className="w-full max-w-xl rounded-2xl border border-cyan-500/40 bg-[#091022] p-5 shadow-[0_0_50px_rgba(0,242,254,0.25)] space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white">{activeCert.title}</h3>
                <p className="text-xs font-mono text-cyan-400">
                  {activeCert.issuer} • {activeCert.date}
                </p>
              </div>
              <button
                onClick={() => setActiveCert(null)}
                className="p-1 rounded-lg border border-cyan-500/30 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-cyan-500/30 bg-black">
              <img
                src={activeCert.imageUrl}
                alt={activeCert.title}
                className="w-full h-auto max-h-[60vh] object-contain"
              />
            </div>

            {activeCert.description && (
              <p className="text-xs text-slate-300 leading-relaxed font-mono">
                {activeCert.description}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-2">
              {activeCert.credentialUrl && activeCert.credentialUrl !== '#' && (
                <a
                  href={activeCert.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Verify Credential</span>
                </a>
              )}
              <button
                onClick={() => setActiveCert(null)}
                className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 text-xs hover:border-slate-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
