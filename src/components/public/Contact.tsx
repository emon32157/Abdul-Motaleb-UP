import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { formatSocialUrl, getSocialIconComponent } from '../../utils/socialUtils';

export const Contact: React.FC = () => {
  const { siteSettings, socialLinks, submitMessage } = useData();
  const { lang } = useLanguage();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'Cyber Security Consultation',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const subjects = [
    'Cyber Security Consultation',
    'Ethical Hacking / Penetration Testing',
    'Web Development Project',
    'Social Media Growth Campaign',
    'Vulnerability Assessment',
    'General Inquiry'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      await submitMessage(
        formData.fullName,
        formData.email,
        formData.subject,
        formData.message
      );
      setSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        subject: 'Cyber Security Consultation',
        message: ''
      });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: unknown) {
      const error = err as { message?: string };
      setErrorMsg(error.message || 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'যোগাযোগ' : 'Contact Me'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'আসুন একসাথে কাজ করি' : "Let's Work Together"}
          </h2>
        </div>

        {/* 2 Columns: Contact Details (5 cols) & Form (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md space-y-6">
              
              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-cyan-400 shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">Email</h4>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-sm font-semibold text-white hover:text-cyan-300 transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl border border-emerald-500/30 bg-[#060b18] text-emerald-400 shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">Phone</h4>
                  <a
                    href={`tel:${siteSettings.phone}`}
                    className="text-sm font-semibold text-white hover:text-emerald-300 transition-colors"
                  >
                    {siteSettings.phone}
                  </a>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-3.5">
                <div className="p-2.5 rounded-xl border border-blue-500/30 bg-[#060b18] text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase">Location</h4>
                  <p className="text-sm font-semibold text-white">
                    {lang === 'bn' ? siteSettings.locationBn || siteSettings.location : siteSettings.location}
                  </p>
                </div>
              </div>

              {/* Follow Me Social Icons */}
              <div className="pt-4 border-t border-cyan-500/15">
                <h4 className="text-xs font-mono text-slate-400 uppercase mb-3">Follow Me</h4>
                <div className="flex flex-wrap items-center gap-2.5">
                  {socialLinks
                    .filter((s) => s.active)
                    .sort((a, b) => a.order - b.order)
                    .map((social) => (
                      <a
                        key={social.id}
                        href={formatSocialUrl(social.url, social.platform)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.title}
                        className="w-9 h-9 rounded-full border border-cyan-500/30 bg-[#060b18] flex items-center justify-center text-slate-300 hover:text-cyan-400 hover:border-cyan-400 hover:shadow-[0_0_12px_rgba(0,242,254,0.35)] transition-all hover:scale-105"
                      >
                        {getSocialIconComponent(social.platform, 'w-4 h-4')}
                      </a>
                    ))}
                </div>
              </div>

            </div>
          </div>

          {/* Right Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="p-6 sm:p-8 rounded-2xl border border-cyan-500/25 bg-[#0a1224]/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-4"
            >
              {success && (
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>Your message has been sent successfully! Abdul will respond promptly.</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Your name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1.5">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="your@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all"
                >
                  {subjects.map((sub, i) => (
                    <option key={i} value={sub} className="bg-[#060b18] text-white">
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1.5">Message *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your project, security requirements or ideas..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-cyan-500/30 bg-[#060b18] text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-[#050811] font-bold text-sm hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Send Message'}</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </section>
  );
};
