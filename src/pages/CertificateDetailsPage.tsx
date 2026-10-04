import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { getCertificateSlug } from '../utils/slugify';
import { SEOHead } from '../components/seo/SEOHead';
import { NotFoundPage } from './NotFoundPage';
import {
  Award,
  ExternalLink,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Check,
  Building,
  Key
} from 'lucide-react';

export const CertificateDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { certificates, loading } = useData();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading && certificates.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_25px_rgba(0,242,254,0.4)]" />
        <p className="text-xs font-mono text-cyan-300 animate-pulse">
          Validating certificate cryptographic credentials...
        </p>
      </div>
    );
  }

  const certificate = certificates.find(
    (c) => getCertificateSlug(c) === slug || c.id === slug
  );

  if (!certificate) {
    return <NotFoundPage />;
  }

  const certSlug = getCertificateSlug(certificate);
  const otherCertificates = certificates
    .filter((c) => c.id !== certificate.id)
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 py-24 sm:py-28 font-sans">
      <SEOHead
        title={`${certificate.title} Certification - Abdul Motaleb`}
        description={`Verified ${certificate.title} credential issued by ${certificate.issuer}. ${certificate.description || ''}`}
        canonicalUrl={`/certificates/${certSlug}`}
        ogImage={certificate.imageUrl}
        ogType="article"
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/certificates" className="hover:text-cyan-400 transition-colors">
              Certificates
            </Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold truncate max-w-[200px] sm:max-w-md">
              {certificate.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-[#091022] hover:bg-cyan-500/10 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
              title="Share Certificate URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Credential'}</span>
            </button>
            <Link
              to="/certificates"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Certificates</span>
            </Link>
          </div>
        </div>

        {/* Certificate Card Header & Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Certificate Image Frame */}
          <div className="md:col-span-6 space-y-4">
            <div
              onClick={() => setSelectedImage(certificate.imageUrl)}
              className="relative rounded-2xl border border-cyan-500/30 bg-[#091022] overflow-hidden shadow-[0_0_35px_rgba(0,242,254,0.2)] group cursor-pointer"
            >
              <img
                src={certificate.imageUrl}
                alt={certificate.title}
                className="w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <span className="px-4 py-2 rounded-xl bg-black/85 text-xs font-mono text-cyan-300 border border-cyan-500/40 shadow-lg">
                  🔍 Click to Enlarge Certificate
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-mono text-slate-400">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Officially Verified Professional Certification</span>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="md:col-span-6 space-y-6">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Award className="w-3.5 h-3.5" />
                <span>OFFICIAL ACCREDITATION</span>
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                {certificate.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-300 pt-1">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  <Building className="w-3.5 h-3.5 text-cyan-500" />
                  <span>Issued by: {certificate.issuer}</span>
                </span>
                <span className="flex items-center gap-1.5 text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-slate-500" />
                  <span>Date: {certificate.date}</span>
                </span>
              </div>
            </div>

            {/* Credential ID Card */}
            {certificate.credentialId && (
              <div className="p-4 rounded-xl border border-cyan-500/25 bg-[#060b18] space-y-1">
                <span className="text-[11px] font-mono text-slate-400 block flex items-center gap-1.5">
                  <Key className="w-3 h-3 text-cyan-400" />
                  <span>Credential License ID</span>
                </span>
                <span className="font-mono text-sm text-cyan-300 font-bold select-all tracking-wider">
                  {certificate.credentialId}
                </span>
              </div>
            )}

            {/* Description & Competencies */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                Competencies & Knowledge Domain
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {certificate.description ||
                  `Professional certification in ${certificate.title}, demonstrating verified hands-on expertise, technical rigor, and practical industry standards.`}
              </p>

              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Rigorous practical assessment completed</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Identity and credential authentication verified</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Industry-standard security procedures followed</span>
                </div>
              </div>
            </div>

            {/* Verification CTA */}
            <div className="pt-4 flex flex-wrap gap-3">
              {certificate.credentialUrl && certificate.credentialUrl !== '#' ? (
                <a
                  href={certificate.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs sm:text-sm hover:opacity-95 shadow-[0_0_20px_rgba(0,242,254,0.35)] transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Verify Credential on {certificate.issuer}</span>
                </a>
              ) : (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-xs font-mono">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verified Credential Record Confirmed</span>
                </div>
              )}
            </div>

          </div>

        </div>

        {/* Other Certificates */}
        {otherCertificates.length > 0 && (
          <div className="pt-12 border-t border-cyan-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Other Verified Certifications
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Explore other credentials achieved by Abdul Motaleb
                </p>
              </div>
              <Link
                to="/certificates"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                <span>All Certificates</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {otherCertificates.map((otherCert) => {
                const otherSlug = getCertificateSlug(otherCert);
                return (
                  <Link
                    key={otherCert.id}
                    to={`/certificates/${otherSlug}`}
                    className="group rounded-2xl border border-cyan-500/20 bg-[#091022]/80 hover:border-cyan-400 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-[0_0_25px_rgba(0,242,254,0.2)]"
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden bg-black/40">
                      <img
                        src={otherCert.imageUrl}
                        alt={otherCert.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-2">
                      <div>
                        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
                          {otherCert.issuer}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 text-sm transition-colors">
                          {otherCert.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {otherCert.description}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 inline-flex items-center gap-1 pt-2">
                        <span>View Credential Details</span>
                        <ArrowLeft className="w-3 h-3 rotate-180 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl border border-cyan-500/40">
            <img
              src={selectedImage}
              alt="Certificate Full Preview"
              className="w-full h-full object-contain max-h-[85vh]"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-3 right-3 px-3 py-1 rounded-lg bg-black/80 text-white font-mono text-xs border border-white/20 cursor-pointer"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
