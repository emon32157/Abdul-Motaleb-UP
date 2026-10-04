import React from 'react';
import { About } from '../components/public/About';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { User, ArrowRight, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';

export const AboutPage: React.FC = () => {
  const { siteSettings } = useData();

  return (
    <>
      <SEOHead
        title="About Abdul Motaleb - Cyber Security & Ethical Hacker"
        description="Learn more about Abdul Motaleb: professional journey, ethical hacking philosophy, core values, and technical expertise from Feni, Bangladesh."
        canonicalUrl="/about"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        {/* Page Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <User className="w-3.5 h-3.5" />
                <span>BIOGRAPHY & BACKGROUND</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                About {siteSettings.logoText || 'Abdul Motaleb'}
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                {siteSettings.siteSubtitle || 'Cyber Security Expert • Ethical Hacker • Web Developer'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
              >
                <span>Direct Contact</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Reused About component */}
        <About />

        {/* Contact Inquiry Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
