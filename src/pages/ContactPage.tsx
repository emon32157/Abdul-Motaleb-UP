import React from 'react';
import { Contact } from '../components/public/Contact';
import { ExtraFeaturesCard } from '../components/public/ExtraFeaturesCard';
import { SEOHead } from '../components/seo/SEOHead';
import { Mail, MessageCircle, Phone, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';

export const ContactPage: React.FC = () => {
  const { siteSettings } = useData();

  return (
    <>
      <SEOHead
        title="Contact & Secure Inquiries - Abdul Motaleb"
        description="Get in touch with Abdul Motaleb for cybersecurity audits, ethical hacking consulting, web development projects, or media inquiries."
        canonicalUrl="/contact"
      />

      <div className="pt-24 sm:pt-28 space-y-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cyan-500/20 pb-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-400">
                <Mail className="w-3.5 h-3.5" />
                <span>DIRECT INQUIRIES & CONTRACTING</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                Let's Connect & Secure Your Digital Future
              </h1>
              <p className="text-sm text-slate-400 font-mono">
                Send a secure message below or connect directly via WhatsApp and Email.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href={`mailto:${siteSettings.email || 'motaleb@example.com'}`}
              className="p-5 rounded-2xl border border-cyan-500/20 bg-[#091022]/80 hover:border-cyan-400 transition-all group flex items-center gap-3.5"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-mono text-slate-400 block">Direct Email</span>
                <span className="text-xs font-mono text-white truncate block font-semibold group-hover:text-cyan-300">
                  {siteSettings.email || 'motaleb@example.com'}
                </span>
              </div>
            </a>

            {siteSettings.whatsapp && (
              <a
                href={`https://wa.me/${siteSettings.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-5 rounded-2xl border border-emerald-500/20 bg-[#091022]/80 hover:border-emerald-400 transition-all group flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-mono text-slate-400 block">WhatsApp Direct</span>
                  <span className="text-xs font-mono text-white truncate block font-semibold group-hover:text-emerald-300">
                    {siteSettings.whatsapp}
                  </span>
                </div>
              </a>
            )}

            {siteSettings.phone && (
              <a
                href={`tel:${siteSettings.phone}`}
                className="p-5 rounded-2xl border border-blue-500/20 bg-[#091022]/80 hover:border-blue-400 transition-all group flex items-center gap-3.5"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[11px] font-mono text-slate-400 block">Voice Phone</span>
                  <span className="text-xs font-mono text-white truncate block font-semibold group-hover:text-blue-300">
                    {siteSettings.phone}
                  </span>
                </div>
              </a>
            )}

            <div className="p-5 rounded-2xl border border-purple-500/20 bg-[#091022]/80 flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[11px] font-mono text-slate-400 block">Location</span>
                <span className="text-xs font-mono text-white truncate block font-semibold">
                  {siteSettings.location || 'Feni, Bangladesh'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Reused Contact component */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Contact />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ExtraFeaturesCard />
        </div>
      </div>
    </>
  );
};
