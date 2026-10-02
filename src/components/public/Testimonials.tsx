import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useLanguage } from '../../context/LanguageContext';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const { testimonials } = useData();
  const { lang } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeTestimonials = testimonials
    .filter((t) => t.active)
    .sort((a, b) => a.order - b.order);

  if (activeTestimonials.length === 0) return null;

  const current = activeTestimonials[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeTestimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeTestimonials.length) % activeTestimonials.length);
  };

  return (
    <div className="py-8 relative">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-sm tracking-wider uppercase">
            <span>&lt;/&gt;</span>
            <span>{lang === 'bn' ? 'মতামত' : 'Testimonials'}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mt-0.5">
            {lang === 'bn' ? 'ক্লায়েন্টরা যা বলেন' : 'What Clients Say'}
          </h2>
        </div>

        {/* Carousel arrows */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg border border-cyan-500/30 bg-[#0a1224] text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
            aria-label="Previous Testimonial"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg border border-cyan-500/30 bg-[#0a1224] text-slate-300 hover:text-white hover:border-cyan-400 transition-all"
            aria-label="Next Testimonial"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Testimonial Card */}
      <div className="p-6 sm:p-8 rounded-2xl border border-cyan-500/25 bg-[#0a1224]/85 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)] relative">
        <Quote className="w-10 h-10 text-cyan-500/20 absolute top-5 right-6 pointer-events-none" />

        <div className="space-y-4">
          {/* Review text */}
          <p className="text-sm sm:text-base text-slate-200 leading-relaxed italic">
            "{lang === 'bn' ? current.reviewBn || current.review : current.review}"
          </p>

          {/* Client Info and Stars */}
          <div className="flex items-center justify-between pt-4 border-t border-cyan-500/15">
            <div className="flex items-center gap-3">
              <img
                src={current.clientImage}
                alt={current.clientName}
                className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400/50 shadow-[0_0_10px_rgba(0,242,254,0.3)]"
              />
              <div>
                <h4 className="font-bold text-sm text-white">{current.clientName}</h4>
                <p className="text-xs font-mono text-cyan-400">{current.position}</p>
              </div>
            </div>

            {/* Stars */}
            <div className="flex items-center gap-1 text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${
                    i < current.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            {activeTestimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all ${
                  currentIndex === idx ? 'w-5 bg-cyan-400' : 'w-1.5 bg-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
