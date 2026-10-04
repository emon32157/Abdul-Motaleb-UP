import { useEffect } from 'react';

interface SEOHeadProps {
  title: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website'
}) => {
  useEffect(() => {
    // 1. Update Document Title
    const formattedTitle = title.includes('Abdul Motaleb')
      ? title
      : `${title} | Abdul Motaleb - Cyber Security Expert`;
    document.title = formattedTitle;

    // Helper to safely set or create a meta tag
    const setMetaTag = (attribute: 'name' | 'property', key: string, content: string) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attribute}="${key}"]`) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attribute, key);
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    // Helper to set canonical link
    const setCanonical = (href: string) => {
      if (!href) return;
      let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!el) {
        el = document.createElement('link');
        el.setAttribute('rel', 'canonical');
        document.head.appendChild(el);
      }
      el.setAttribute('href', href);
    };

    // 2. Meta description
    if (description) {
      setMetaTag('name', 'description', description);
      setMetaTag('property', 'og:description', description);
      setMetaTag('name', 'twitter:description', description);
    }

    // 3. Open Graph & Twitter Titles
    setMetaTag('property', 'og:title', formattedTitle);
    setMetaTag('name', 'twitter:title', formattedTitle);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('name', 'twitter:card', 'summary_large_image');

    // 4. Image
    const defaultImage = 'https://iili.io/Bev2e8G.jpg';
    const imageToUse = ogImage || defaultImage;
    setMetaTag('property', 'og:image', imageToUse);
    setMetaTag('name', 'twitter:image', imageToUse);

    // 5. Canonical & Open Graph URL
    const fullUrl = canonicalUrl
      ? canonicalUrl.startsWith('http')
        ? canonicalUrl
        : `https://abdulmotaleb.vercel.app${canonicalUrl.startsWith('/') ? '' : '/'}${canonicalUrl}`
      : window.location.href;

    setCanonical(fullUrl);
    setMetaTag('property', 'og:url', fullUrl);
  }, [title, description, canonicalUrl, ogImage, ogType]);

  return null;
};
