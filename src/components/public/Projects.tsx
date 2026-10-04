import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { ProjectItem } from '../../types';
import { getProjectSlug } from '../../utils/slugify';
import { ExternalLink, Github, Eye, X, Calendar, ArrowRight } from 'lucide-react';

export const Projects: React.FC = () => {
  const { projects } = useData();
  const { lang } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);

  const categories = ['All', 'Web Development', 'Security', 'Social Media', 'Design'];

  const filteredProjects = projects
    .filter((p) => p.active)
    .filter((p) => (activeCategory === 'All' ? true : p.category === activeCategory))
    .sort((a, b) => a.order - b.order);

  return (
    <section id="projects" className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
              <span>&lt;/&gt;</span>
              <span>{lang === 'bn' ? 'প্রজেক্ট সমূহ' : 'My Projects'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              {lang === 'bn' ? 'সাম্প্রতিক কাজের নমুনা' : 'Some of my recent work'}
            </h2>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all ${
                  activeCategory === cat
                    ? 'bg-cyan-500 text-black font-semibold shadow-[0_0_15px_rgba(0,242,254,0.4)]'
                    : 'border border-cyan-500/25 bg-[#0a1224]/80 text-slate-300 hover:border-cyan-400 hover:text-cyan-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 2x2 Grid of Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="group rounded-2xl border border-cyan-500/25 bg-[#0a1224]/80 backdrop-blur-md overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_8px_32px_rgba(0,242,254,0.18)] transition-all duration-300 flex flex-col"
            >
              {/* Image Preview */}
              <Link
                to={`/projects/${getProjectSlug(project)}`}
                className="relative h-52 sm:h-60 overflow-hidden cursor-pointer bg-slate-950 block"
              >
                <img
                  src={project.mainImage}
                  alt={project.title}
                  loading="lazy"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1224] via-transparent to-transparent opacity-80" />
                
                {/* View Details Overlay Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-[#050811]/80 backdrop-blur-md border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Project</span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  {project.category}
                </div>
              </Link>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <Link
                    to={`/projects/${getProjectSlug(project)}`}
                    className="text-lg font-bold text-white group-hover:text-cyan-300 cursor-pointer transition-colors block"
                  >
                    {lang === 'bn' ? project.titleBn || project.title : project.title}
                  </Link>
                  <p className="text-xs sm:text-sm text-slate-300 line-clamp-2 mt-1.5 leading-relaxed">
                    {lang === 'bn' ? project.shortDescBn || project.shortDesc : project.shortDesc}
                  </p>
                </div>

                {/* Tech Badges */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action Buttons: View Project, Live Demo & GitHub */}
                <div className="pt-3 border-t border-cyan-500/15 space-y-2">
                  <Link
                    to={`/projects/${getProjectSlug(project)}`}
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 text-xs font-semibold hover:bg-cyan-500/25 hover:border-cyan-400 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Project Details</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  <div className="flex items-center justify-between gap-2">
                    {project.liveDemoUrl && project.liveDemoUrl !== '#' && (
                      <a
                        href={project.liveDemoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold hover:bg-emerald-500/20 transition-all"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Live Demo</span>
                      </a>
                    )}

                    {project.githubUrl && project.githubUrl !== '#' && (
                      <a
                        href={project.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 text-[11px] font-semibold hover:text-cyan-300 hover:border-cyan-500/40 transition-all"
                      >
                        <Github className="w-3 h-3" />
                        <span>Source Code</span>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setSelectedProject(null)}
        >
          <div
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-cyan-500/40 bg-[#091022] shadow-[0_0_50px_rgba(0,242,254,0.2)] p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white mt-0.5">
                  {lang === 'bn' ? selectedProject.titleBn || selectedProject.title : selectedProject.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedProject(null)}
                className="p-1.5 rounded-lg border border-cyan-500/30 text-slate-400 hover:text-white hover:border-cyan-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Main Image */}
            <div className="rounded-xl overflow-hidden border border-cyan-500/30 max-h-72">
              <img
                src={selectedProject.mainImage}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Additional Screenshots if available */}
            {selectedProject.additionalImages && selectedProject.additionalImages.length > 0 && (
              <div>
                <h4 className="text-xs font-mono text-slate-400 uppercase mb-2">Gallery Preview</h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProject.additionalImages.map((imgUrl, i) => (
                    <div key={i} className="h-28 rounded-lg overflow-hidden border border-slate-700/60">
                      <img src={imgUrl} alt={`Screenshot ${i + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Full Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider">Project Overview</h4>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedProject.fullDesc || selectedProject.shortDesc}
              </p>
            </div>

            {/* Tech badges */}
            <div>
              <h4 className="text-xs font-mono text-cyan-300 uppercase tracking-wider mb-2">Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {selectedProject.technologies.map((tech, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-md text-xs font-mono bg-cyan-500/10 text-cyan-300 border border-cyan-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Modal Links */}
            <div className="flex items-center gap-3 pt-3 border-t border-cyan-500/20">
              {selectedProject.liveDemoUrl && (
                <a
                  href={selectedProject.liveDemoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-400 text-black font-bold text-xs hover:opacity-95 transition-all shadow-[0_0_15px_rgba(0,242,254,0.3)]"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Launch Live Demo</span>
                </a>
              )}
              {selectedProject.githubUrl && (
                <a
                  href={selectedProject.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white font-medium text-xs hover:border-cyan-400 transition-all"
                >
                  <Github className="w-4 h-4" />
                  <span>Source Code</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
