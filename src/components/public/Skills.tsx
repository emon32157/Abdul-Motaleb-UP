import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import {
  Shield,
  Terminal,
  Code,
  Layout,
  Megaphone,
  FileCode,
  Palette,
  Cpu,
  Sparkles
} from 'lucide-react';

export const Skills: React.FC = () => {
  const { skills } = useData();
  const { lang } = useLanguage();
  const [animated, setAnimated] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setAnimated(true);
        }
      },
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getSkillIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case 'shield':
        return <Shield className="w-5 h-5" />;
      case 'terminal':
        return <Terminal className="w-5 h-5" />;
      case 'code':
        return <Code className="w-5 h-5" />;
      case 'layout':
        return <Layout className="w-5 h-5" />;
      case 'megaphone':
        return <Megaphone className="w-5 h-5" />;
      case 'filecode':
        return <FileCode className="w-5 h-5" />;
      case 'palette':
        return <Palette className="w-5 h-5" />;
      case 'cpu':
        return <Cpu className="w-5 h-5" />;
      default:
        return <Sparkles className="w-5 h-5" />;
    }
  };

  const activeSkills = skills
    .filter((s) => s.active)
    .sort((a, b) => a.order - b.order);

  const radius = 38;
  const circumference = 2 * Math.PI * radius;

  return (
    <section id="skills" ref={sectionRef} className="py-16 lg:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'দক্ষতা' : 'My Skills'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            {lang === 'bn' ? 'প্রযুক্তি এবং টুলস' : 'Technologies & Tools I Work With'}
          </h2>
        </div>

        {/* Skills Circular Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
          {activeSkills.map((skill) => {
            const strokeDashoffset = animated
              ? circumference - (skill.percentage / 100) * circumference
              : circumference;
            const skillColor = skill.color || '#00f2fe';

            return (
              <div
                key={skill.id}
                className="group flex flex-col items-center p-5 rounded-2xl border border-cyan-500/20 bg-[#0a1224]/80 backdrop-blur-md hover:border-cyan-400/50 hover:shadow-[0_0_25px_rgba(0,242,254,0.15)] transition-all duration-300"
              >
                {/* Circular Progress Gauge */}
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 96 96">
                    {/* Background Track */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      className="text-slate-800"
                      strokeWidth="6"
                      stroke="currentColor"
                      fill="transparent"
                    />
                    {/* Animated Progress Circle */}
                    <circle
                      cx="48"
                      cy="48"
                      r={radius}
                      stroke={skillColor}
                      strokeWidth="6"
                      strokeDasharray={circumference}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      fill="transparent"
                      style={{
                        transition: 'stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        filter: `drop-shadow(0 0 6px ${skillColor}80)`
                      }}
                    />
                  </svg>

                  {/* Percentage Value inside ring */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-mono text-base sm:text-lg font-bold text-white tracking-tight">
                      {skill.percentage}%
                    </span>
                  </div>
                </div>

                {/* Skill Icon & Name */}
                <div className="mt-4 flex flex-col items-center gap-1.5 text-center">
                  <div
                    className="p-1.5 rounded-lg bg-slate-900/90 border border-slate-700/60 text-slate-300 group-hover:scale-110 transition-transform"
                    style={{ color: skillColor }}
                  >
                    {getSkillIcon(skill.icon)}
                  </div>
                  <h3 className="font-sans font-semibold text-xs sm:text-sm text-slate-200 group-hover:text-white transition-colors">
                    {skill.name}
                  </h3>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
