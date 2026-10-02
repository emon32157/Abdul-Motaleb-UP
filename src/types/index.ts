export interface SiteSettings {
  siteTitle: string;
  siteSubtitle: string;
  logoText: string;
  faviconUrl: string;
  maintenanceMode: boolean;
  googleVerification: string;
  googleAnalyticsId: string;
  googleTagManagerId: string;
  footerText: string;
  footerRights: string;
  email: string;
  phone: string;
  whatsapp: string;
  location: string;
  locationBn?: string;
  cvUrl: string;
}

export interface HeroData {
  badgeText: string;
  badgeTextBn: string;
  greeting: string;
  greetingBn: string;
  name: string;
  title: string;
  titleBn: string;
  description: string;
  descriptionBn: string;
  hireBtnText: string;
  hireBtnLink: string;
  cvBtnText: string;
  cvBtnLink: string;
  profileImageUrl: string;
  terminalUser: string;
  terminalHost: string;
  terminalWhoami: string;
  terminalProfession: string[];
  terminalStatus: string;
  terminalQuote: string;
}

export interface AboutData {
  name: string;
  role: string;
  speciality: string;
  developer: string;
  location: string;
  status: string;
  languages: string;
  terminalFooter: string;
  bioEn: string;
  bioBn: string;
  highlights: string[];
  highlightsBn: string[];
}

export interface SkillItem {
  id: string;
  name: string;
  percentage: number;
  icon: string;
  category: string;
  description?: string;
  order: number;
  active: boolean;
  color?: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  titleBn?: string;
  description: string;
  descriptionBn?: string;
  icon: string;
  buttonText: string;
  buttonUrl: string;
  category?: string;
  order: number;
  active: boolean;
}

export interface ProjectItem {
  id: string;
  title: string;
  titleBn?: string;
  shortDesc: string;
  shortDescBn?: string;
  fullDesc?: string;
  mainImage: string;
  additionalImages?: string[];
  technologies: string[];
  category: string; // 'Web Development' | 'Security' | 'Social Media' | 'Design' | 'Other'
  liveDemoUrl?: string;
  githubUrl?: string;
  date: string;
  featured: boolean;
  order: number;
  active: boolean;
}

export interface ExperienceItem {
  id: string;
  year: string;
  position: string;
  positionBn?: string;
  organization?: string;
  description: string;
  descriptionBn?: string;
  skills: string[];
  icon: string;
  order: number;
  active: boolean;
}

export interface CertificateItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  imageUrl: string;
  description?: string;
  order: number;
  active: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  altText: string;
  category: string; // 'Nature' | 'Tech' | 'Design' | 'Others'
  order: number;
  featured: boolean;
  active: boolean;
  dateAdded?: string;
}

export interface StatItem {
  id: string;
  number: string;
  label: string;
  labelBn: string;
  icon: string;
  description?: string;
  order: number;
  active: boolean;
}

export interface TestimonialItem {
  id: string;
  clientName: string;
  clientImage: string;
  position: string;
  review: string;
  reviewBn?: string;
  rating: number; // 1-5
  date: string;
  order: number;
  active: boolean;
}

export interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface NavigationItem {
  id: string;
  title: string;
  titleBn: string;
  href: string;
  icon?: string;
  order: number;
  active: boolean;
}

export interface SocialLink {
  id: string;
  platform: 'facebook' | 'github' | 'linkedin' | 'youtube' | 'whatsapp' | 'twitter' | 'instagram' | string;
  title: string;
  url: string;
  icon: string;
  order: number;
  active: boolean;
}

export interface SEOData {
  seoTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
  author: string;
  googleVerification: string;
}

export type ThemeName = 'cyber-dark' | 'blue' | 'green' | 'light';

export interface ThemeConfig {
  currentTheme: ThemeName;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  bgDark: string;
  cardBg: string;
  glowIntensity: 'subtle' | 'medium' | 'high';
}

export interface MediaItem {
  id: string;
  url: string;
  title: string;
  category: string;
  size?: string;
  uploadedAt: string;
  deleteUrl?: string;
}

export interface AIChatbotSettings {
  enabled: boolean;
  botName: string;
  botAvatar: string;
  model: string;
  welcomeMessage: string;
  welcomeMessageBn: string;
  systemPrompt: string;
  personality: string;
  languageBehavior: 'auto' | 'en' | 'bn' | 'mixed';
  suggestedQuestions: string[];
  contactCtaText: string;
  whatsappCtaText: string;
  theme: 'cyber-dark' | 'neon-green' | 'cyan' | 'matrix';
  position: 'bottom-right' | 'bottom-left';
  windowSize: 'compact' | 'standard' | 'large';
  temperature: number;
  maxTurns: number;
  storeAnonymousHistory: boolean;
  enableAnalytics: boolean;
}

export interface AIKnowledgeItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  keywords: string[];
  active: boolean;
  order: number;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  streaming?: boolean;
}

export interface ChatAnalytics {
  totalConversations: number;
  totalMessages: number;
  todayConversations: number;
  mostAskedQuestions: { question: string; count: number }[];
}
