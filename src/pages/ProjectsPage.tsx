import React from 'react';
import { Projects } from '../components/public/Projects';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { FolderGit2 } from 'lucide-react';

export const ProjectsPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Projects & Security Case Studies - Abdul Motaleb"
        description="Explore technical projects by Abdul Motaleb: Cyber security dashboards, secure web applications, penetration testing tools, and social media software."
        canonicalUrl="/projects"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        {/* Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <FolderGit2 className="w-3.5 h-3.5" />
                <span>TECHNICAL PORTFOLIO</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Featured Projects & Systems
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Click on any project to view comprehensive architecture and live case study.
              </p>
            </div>
          </div>
        </div>

        {/* Reused Projects component */}
        <Projects />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
