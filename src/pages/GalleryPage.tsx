import React from 'react';
import { Gallery } from '../components/public/Gallery';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Image as ImageIcon } from 'lucide-react';

export const GalleryPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Visual Gallery & Photo Vault - Abdul Motaleb"
        description="Comprehensive visual collection of 52+ verified photographs, cybersecurity workstations, nature, and creative captures by Abdul Motaleb."
        canonicalUrl="/gallery"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <ImageIcon className="w-3.5 h-3.5" />
                <span>VISUAL VAULT (52+ PHOTOS)</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Photo Gallery
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Explore tech setups, achievements, and captures. Click any photo to view full resolution.
              </p>
            </div>
          </div>
        </div>

        {/* Reused Gallery component */}
        <Gallery />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
