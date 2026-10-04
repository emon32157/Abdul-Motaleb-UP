import React from 'react';
import { Hero } from '../components/public/Hero';
import { About } from '../components/public/About';
import { Skills } from '../components/public/Skills';
import { Services } from '../components/public/Services';
import { Projects } from '../components/public/Projects';
import { Experience } from '../components/public/Experience';
import { Certificates } from '../components/public/Certificates';
import { Gallery } from '../components/public/Gallery';
import { Stats } from '../components/public/Stats';
import { Testimonials } from '../components/public/Testimonials';
import { ExtraFeaturesCard } from '../components/public/ExtraFeaturesCard';
import { Contact } from '../components/public/Contact';
import { SEOHead } from '../components/seo/SEOHead';
import { useData } from '../context/DataContext';

export const HomePage: React.FC = () => {
  const { siteSettings, seo } = useData();

  return (
    <>
      <SEOHead
        title={seo.seoTitle || `${siteSettings.siteTitle || 'Abdul Motaleb'} | Cyber Security Expert & Web Developer`}
        description={seo.metaDescription || siteSettings.siteSubtitle || 'Official portfolio of Abdul Motaleb: Cyber Security Expert, Ethical Hacker, Social Media Expert, and Web Developer.'}
        canonicalUrl="/"
        ogImage={seo.ogImage || 'https://iili.io/Bev2e8G.jpg'}
      />

      <div className="space-y-12 sm:space-y-16">
        <Hero />
        <About />
        <Skills />
        <Services />
        <Projects />
        <Experience />
        <Certificates />
        <Gallery />

        {/* Bottom Section: Stats, Testimonials, Extra Features, Contact */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <Stats />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7">
              <Testimonials />
            </div>
            <div className="lg:col-span-5">
              <ExtraFeaturesCard />
            </div>
          </div>

          <Contact />
        </div>
      </div>
    </>
  );
};
