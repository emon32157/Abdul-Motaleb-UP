import React from 'react';
import {
  Facebook,
  Github,
  Linkedin,
  Youtube,
  MessageCircle,
  Twitter,
  Instagram,
  Send,
  Globe,
  Mail,
  Share2,
  ExternalLink
} from 'lucide-react';

/**
 * Ensures a social URL is a valid absolute URL (prefixes https:// if missing).
 */
export const formatSocialUrl = (url?: string, platform?: string): string => {
  if (!url) return '#';
  const trimmed = url.trim();
  if (!trimmed || trimmed === '#') return '#';

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('mailto:') ||
    trimmed.startsWith('tel:')
  ) {
    return trimmed;
  }

  // Handle WhatsApp numbers entered directly (e.g., +88017... or 017...)
  if (platform?.toLowerCase() === 'whatsapp' && !trimmed.includes('/')) {
    const cleanNum = trimmed.replace(/[^0-9]/g, '');
    return `https://wa.me/${cleanNum}`;
  }

  if (trimmed.startsWith('//')) {
    return `https:${trimmed}`;
  }

  return `https://${trimmed}`;
};

/**
 * Returns a sleek icon component for any social or communication platform.
 */
export const getSocialIconComponent = (platform: string, className = 'w-4 h-4'): React.ReactElement => {
  const p = (platform || '').toLowerCase().trim();

  switch (p) {
    case 'facebook':
    case 'fb':
      return <Facebook className={className} />;
    case 'github':
    case 'gh':
      return <Github className={className} />;
    case 'linkedin':
    case 'in':
      return <Linkedin className={className} />;
    case 'youtube':
    case 'yt':
      return <Youtube className={className} />;
    case 'whatsapp':
    case 'wa':
      return <MessageCircle className={className} />;
    case 'twitter':
    case 'x':
      return <Twitter className={className} />;
    case 'instagram':
    case 'ig':
      return <Instagram className={className} />;
    case 'telegram':
    case 'tg':
      return <Send className={className} />;
    case 'website':
    case 'portfolio':
    case 'globe':
      return <Globe className={className} />;
    case 'email':
    case 'mail':
      return <Mail className={className} />;
    default:
      return <ExternalLink className={className} />;
  }
};
