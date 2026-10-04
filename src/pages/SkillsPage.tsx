import React from 'react';
import { Skills } from '../components/public/Skills';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Wrench } from 'lucide-react';

export const SkillsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Skills & Technical Arsenal - Abdul Motaleb"
        description="Verified technical competencies: Ethical Hacking, Cyber Security, Vulnerability Analysis, Web Development (React, PHP, JavaScript), and Digital Marketing."
        canonicalUrl="/skills"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Wrench className="w-3.5 h-3.5" />
                <span>TECHNICAL PROFICIENCIES</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Verified Skills & Tools
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Real-world benchmarked capabilities across cybersecurity and software development.
              </p>
            </div>
          </div>
        </div>

        {/* Reused Skills component */}
        <Skills />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
