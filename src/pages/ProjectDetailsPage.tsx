import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { getProjectSlug } from '../utils/slugify';
import { SEOHead } from '../components/seo/SEOHead';
import { NotFoundPage } from './NotFoundPage';
import {
  FolderGit2,
  ExternalLink,
  Github,
  ArrowLeft,
  Calendar,
  Layers,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Share2,
  Check
} from 'lucide-react';

export const ProjectDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { projects, loading } = useData();
  const { lang } = useLanguage();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  // Scroll to top on slug change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (loading && projects.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl border-2 border-cyan-400 border-t-transparent animate-spin shadow-[0_0_25px_rgba(0,242,254,0.4)]" />
        <p className="text-xs font-mono text-cyan-300 animate-pulse">
          Decrypting project specifications...
        </p>
      </div>
    );
  }

  // Find project by slug or fallback by ID
  const project = projects.find(
    (p) => getProjectSlug(p) === slug || p.id === slug
  );

  if (!project) {
    return <NotFoundPage />;
  }

  const projectSlug = getProjectSlug(project);
  const allImages = [project.mainImage, ...(project.additionalImages || [])].filter(Boolean);
  const relatedProjects = projects
    .filter((p) => p.id !== project.id && (p.category === project.category || p.featured))
    .slice(0, 3);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const title = lang === 'bn' && project.titleBn ? project.titleBn : project.title;
  const shortDesc = lang === 'bn' && project.shortDescBn ? project.shortDescBn : project.shortDesc;

  return (
    <div className="min-h-screen text-slate-100 py-24 sm:py-28 font-sans">
      <SEOHead
        title={`${project.title} - Project Case Study`}
        description={project.shortDesc || project.fullDesc}
        canonicalUrl={`/projects/${projectSlug}`}
        ogImage={project.mainImage}
        ogType="article"
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Navigation Breadcrumb Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Link to="/" className="hover:text-cyan-400 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link to="/projects" className="hover:text-cyan-400 transition-colors">
              Projects
            </Link>
            <span>/</span>
            <span className="text-cyan-300 font-semibold truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-[#091022] hover:bg-cyan-500/10 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
              title="Share Project URL"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied!' : 'Share Project'}</span>
            </button>
            <Link
              to="/projects"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 text-xs font-mono text-slate-300 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Projects</span>
            </Link>
          </div>
        </div>

        {/* Hero Section */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300">
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-amber-500/10 border border-amber-500/30 text-amber-300 inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Featured Showcase</span>
              </span>
            )}
            <span className="text-xs font-mono text-slate-400 inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{project.date}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-3xl leading-relaxed">
            {shortDesc}
          </p>
        </div>

        {/* Main Showcase Image */}
        <div className="relative rounded-2xl sm:rounded-3xl border border-cyan-500/30 bg-[#091022] overflow-hidden shadow-[0_0_40px_rgba(0,242,254,0.15)] group">
          <img
            src={project.mainImage}
            alt={project.title}
            className="w-full max-h-[520px] object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#050811] via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Quick CTA overlay banner */}
          <div className="absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-6 sm:right-6 flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[#070c1a]/90 backdrop-blur-xl border border-cyan-500/30">
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Verified Cyber Defense Case Study</span>
            </div>

            <div className="flex items-center gap-2">
              {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
                <a
                  href={project.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.4)] transition-all"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Live Preview</span>
                </a>
              )}
              {project.githubUrl && project.githubUrl !== '#' && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 bg-black/60 hover:bg-slate-800 text-white font-mono text-xs transition-all"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>View Code</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Additional Images Grid if available */}
        {allImages.length > 1 && (
          <div className="space-y-3">
            <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
              Project Screenshots & Architecture Diagrams ({allImages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {allImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className="relative rounded-xl border border-cyan-500/20 bg-[#091022] overflow-hidden aspect-video cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all group"
                >
                  <img
                    src={img}
                    alt={`${project.title} screenshot ${idx + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <span className="text-[10px] font-mono text-cyan-300 bg-black/80 px-2 py-1 rounded">
                      Zoom
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Description */}
          <div className="lg:col-span-8 space-y-6">
            <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-500/20 bg-[#091022]/80 backdrop-blur-md space-y-6">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
                  Comprehensive Overview & Architecture
                </h2>
                <div className="text-sm text-slate-300 leading-relaxed space-y-4 whitespace-pre-line">
                  {project.fullDesc || project.shortDesc}
                </div>
              </div>

              {/* Security Highlights */}
              <div className="pt-4 border-t border-cyan-500/15 space-y-3">
                <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold">
                  Key Technical & Security Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Hardened against OWASP Top 10 vulnerabilities</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Real-time response & optimized asset delivery</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Role-based access & strict session integrity</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>Clean modular code and responsive UI design</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Metadata Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 rounded-2xl border border-cyan-500/25 bg-[#091022]/90 backdrop-blur-md space-y-5">
              <h3 className="text-xs font-mono text-cyan-400 uppercase tracking-wider font-semibold border-b border-cyan-500/15 pb-2.5 flex items-center gap-2">
                <Layers className="w-4 h-4" />
                <span>Project Specifications</span>
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Category</span>
                  <span className="text-cyan-300 font-semibold">{project.category}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Release Year</span>
                  <span className="text-white font-semibold">{project.date}</span>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-2">Technologies Used</span>
                  <div className="flex flex-wrap gap-1.5">
                    {project.technologies.map((tech, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[11px]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-slate-400 block text-[11px] mb-1">Author / Engineer</span>
                  <span className="text-emerald-400 font-semibold">Abdul Motaleb</span>
                </div>
              </div>

              {/* Inquiry CTA button */}
              <div className="pt-2">
                <Link
                  to="/contact"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-95 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all text-center"
                >
                  <span>Request Similar Project</span>
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <div className="pt-8 border-t border-cyan-500/20 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  Related Projects
                </h3>
                <p className="text-xs font-mono text-slate-400 mt-1">
                  Explore other technical implementations by Abdul
                </p>
              </div>
              <Link
                to="/projects"
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
              >
                <span>All Projects</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProjects.map((relProj) => {
                const relSlug = getProjectSlug(relProj);
                return (
                  <Link
                    key={relProj.id}
                    to={`/projects/${relSlug}`}
                    className="group rounded-2xl border border-cyan-500/20 bg-[#091022]/80 hover:border-cyan-400 overflow-hidden transition-all duration-300 flex flex-col hover:shadow-[0_0_25px_rgba(0,242,254,0.2)]"
                  >
                    <div className="aspect-video w-full overflow-hidden bg-black/40">
                      <img
                        src={relProj.mainImage}
                        alt={relProj.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                      <div>
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                          {relProj.category}
                        </span>
                        <h4 className="font-bold text-white group-hover:text-cyan-300 text-sm mt-1 transition-colors">
                          {relProj.title}
                        </h4>
                        <p className="text-xs text-slate-400 line-clamp-2 mt-1">
                          {relProj.shortDesc}
                        </p>
                      </div>
                      <span className="text-xs font-mono text-cyan-400 inline-flex items-center gap-1 pt-2">
                        <span>View Project Details</span>
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
              alt="Project Full Preview"
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
