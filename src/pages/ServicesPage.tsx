import React from 'react';
import { Services } from '../components/public/Services';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { Link } from 'react-router-dom';
import { Briefcase, ArrowRight } from 'lucide-react';

export const ServicesPage: React.FC = () => {
  return (
    <>
      <SEOHead
        title="Services & Security Solutions - Abdul Motaleb"
        description="Professional Cyber Security, Ethical Hacking, Vulnerability Assessments, Full-Stack Web Development, and Social Media growth services."
        canonicalUrl="/services"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        {/* Header Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Briefcase className="w-3.5 h-3.5" />
                <span>EXPERTISE & OFFERS</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Professional Services
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Penetration Testing • Web Development • Threat Mitigation • Brand Growth
              </p>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
            >
              <span>Book Consultation</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Reused Services component */}
        <Services />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <Contact />
        </div>
      </div>
    </>
  );
};
