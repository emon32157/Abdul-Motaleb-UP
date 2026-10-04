import React from 'react';
import { Experience } from '../components/public/Experience';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Milestone } from 'lucide-react';

export const ExperiencePage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Experience & Career Milestones - Abdul Motaleb"
        description="Career history and milestone achievements: Cyber Security Specialist, Full-Stack Web Developer, and Social Media Strategist."
        canonicalUrl="/experience"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Milestone className="w-3.5 h-3.5" />
                <span>CAREER TIMELINE</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Work History & Experience
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Hands-on professional engagements, industry collaborations, and client deliverables.
              </p>
            </div>
          </div>
        </div>

        {/* Reused Experience component */}
        <Experience />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
