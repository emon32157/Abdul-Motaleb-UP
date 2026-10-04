import React from 'react';
import { Certificates } from '../components/public/Certificates';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Award } from 'lucide-react';

export const CertificatesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Certificates & Accreditations - Abdul Motaleb"
        description="Verified cybersecurity certifications: Google, Coursera, ethical hacking credentials, and penetration testing accreditations."
        canonicalUrl="/certificates"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Award className="w-3.5 h-3.5" />
                <span>ACADEMIC & PROFESSIONAL CREDENTIALS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Certificates & Accreditations
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Click on any certificate to view full credential verification and details.
              </p>
            </div>
          </div>
        </div>

        {/* Reused Certificates component */}
        <Certificates />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
