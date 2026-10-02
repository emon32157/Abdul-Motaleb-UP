import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  SiteSettings,
  HeroData,
  AboutData,
  SkillItem,
  ServiceItem,
  ProjectItem,
  ExperienceItem,
  CertificateItem,
  GalleryItem,
  StatItem,
  TestimonialItem,
  ContactMessage,
  NavigationItem,
  SocialLink,
  SEOData,
  MediaItem,
  AIChatbotSettings,
  AIKnowledgeItem,
  ChatAnalytics
} from '../types';
import {
  defaultSiteSettings,
  defaultHeroData,
  defaultAboutData,
  defaultSkills,
  defaultServices,
  defaultProjects,
  defaultExperience,
  defaultCertificates,
  defaultGallery,
  defaultStats,
  defaultTestimonials,
  defaultNavigation,
  defaultSocialLinks,
  defaultSEO,
  defaultAIChatbotSettings,
  defaultAIKnowledgeBase,
  defaultChatAnalytics
} from '../data/defaultData';
import { db } from '../firebase/config';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';

interface DataContextType {
  siteSettings: SiteSettings;
  hero: HeroData;
  about: AboutData;
  skills: SkillItem[];
  services: ServiceItem[];
  projects: ProjectItem[];
  experience: ExperienceItem[];
  certificates: CertificateItem[];
  gallery: GalleryItem[];
  media: MediaItem[];
  stats: StatItem[];
  testimonials: TestimonialItem[];
  messages: ContactMessage[];
  navigation: NavigationItem[];
  socialLinks: SocialLink[];
  seo: SEOData;
  aiSettings: AIChatbotSettings;
  aiKnowledgeBase: AIKnowledgeItem[];
  chatAnalytics: ChatAnalytics;
  loading: boolean;
  dbConnected: boolean;

  // Update methods
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateHero: (data: Partial<HeroData>) => Promise<void>;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;
  updateAISettings: (data: Partial<AIChatbotSettings>) => Promise<void>;

  // AI Knowledge Base
  addKnowledgeItem: (item: Omit<AIKnowledgeItem, 'id'>) => Promise<void>;
  updateKnowledgeItem: (id: string, item: Partial<AIKnowledgeItem>) => Promise<void>;
  deleteKnowledgeItem: (id: string) => Promise<void>;
  recordChatInteraction: (userQuery: string) => void;

  // Skills
  addSkill: (item: Omit<SkillItem, 'id'>) => Promise<void>;
  updateSkill: (id: string, item: Partial<SkillItem>) => Promise<void>;
  deleteSkill: (id: string) => Promise<void>;
  reorderSkills: (items: SkillItem[]) => Promise<void>;

  // Services
  addService: (item: Omit<ServiceItem, 'id'>) => Promise<void>;
  updateService: (id: string, item: Partial<ServiceItem>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  reorderServices: (items: ServiceItem[]) => Promise<void>;

  // Projects
  addProject: (item: Omit<ProjectItem, 'id'>) => Promise<void>;
  updateProject: (id: string, item: Partial<ProjectItem>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  reorderProjects: (items: ProjectItem[]) => Promise<void>;

  // Experience
  addExperience: (item: Omit<ExperienceItem, 'id'>) => Promise<void>;
  updateExperience: (id: string, item: Partial<ExperienceItem>) => Promise<void>;
  deleteExperience: (id: string) => Promise<void>;
  reorderExperience: (items: ExperienceItem[]) => Promise<void>;

  // Certificates
  addCertificate: (item: Omit<CertificateItem, 'id'>) => Promise<void>;
  updateCertificate: (id: string, item: Partial<CertificateItem>) => Promise<void>;
  deleteCertificate: (id: string) => Promise<void>;
  reorderCertificates: (items: CertificateItem[]) => Promise<void>;

  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => Promise<void>;
  updateGalleryItem: (id: string, item: Partial<GalleryItem>) => Promise<void>;
  deleteGalleryItem: (id: string) => Promise<void>;
  reorderGallery: (items: GalleryItem[]) => Promise<void>;

  // Media
  addMediaItem: (item: Omit<MediaItem, 'id'>) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;

  // Stats
  addStat: (item: Omit<StatItem, 'id'>) => Promise<void>;
  updateStat: (id: string, item: Partial<StatItem>) => Promise<void>;
  deleteStat: (id: string) => Promise<void>;
  reorderStats: (items: StatItem[]) => Promise<void>;

  // Testimonials
  addTestimonial: (item: Omit<TestimonialItem, 'id'>) => Promise<void>;
  updateTestimonial: (id: string, item: Partial<TestimonialItem>) => Promise<void>;
  deleteTestimonial: (id: string) => Promise<void>;
  reorderTestimonials: (items: TestimonialItem[]) => Promise<void>;

  // Navigation
  addNavigation: (item: Omit<NavigationItem, 'id'>) => Promise<void>;
  updateNavigation: (id: string, item: Partial<NavigationItem>) => Promise<void>;
  deleteNavigation: (id: string) => Promise<void>;
  reorderNavigation: (items: NavigationItem[]) => Promise<void>;

  // Social Links
  addSocial: (item: Omit<SocialLink, 'id'>) => Promise<void>;
  updateSocial: (id: string, item: Partial<SocialLink>) => Promise<void>;
  deleteSocial: (id: string) => Promise<void>;
  reorderSocial: (items: SocialLink[]) => Promise<void>;

  // Contact Messages
  submitMessage: (fullName: string, email: string, subject: string, message: string) => Promise<void>;
  markMessageRead: (id: string, read: boolean) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;

  // SEO
  updateSEO: (data: Partial<SEOData>) => Promise<void>;

  // Backup & Restore
  exportWebsiteData: () => string;
  importWebsiteData: (jsonData: string) => Promise<{ success: boolean; message: string }>;
  resetToDefault: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'am_portfolio_';

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [dbConnected, setDbConnected] = useState(true);

  // Helper to load from localStorage with fallback
  const loadLocal = <T,>(key: string, fallback: T): T => {
    try {
      const saved = localStorage.getItem(STORAGE_PREFIX + key);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const saveLocal = (key: string, data: unknown) => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(data));
    } catch (e) {
      console.warn('Local storage write warning:', e);
    }
  };

  // State instances
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() =>
    loadLocal('siteSettings', defaultSiteSettings)
  );
  const [hero, setHero] = useState<HeroData>(() =>
    loadLocal('hero', defaultHeroData)
  );
  const [about, setAbout] = useState<AboutData>(() =>
    loadLocal('about', defaultAboutData)
  );
  const [skills, setSkills] = useState<SkillItem[]>(() =>
    loadLocal('skills', defaultSkills)
  );
  const [services, setServices] = useState<ServiceItem[]>(() =>
    loadLocal('services', defaultServices)
  );
  const [projects, setProjects] = useState<ProjectItem[]>(() =>
    loadLocal('projects', defaultProjects)
  );
  const [experience, setExperience] = useState<ExperienceItem[]>(() =>
    loadLocal('experience', defaultExperience)
  );
  const [certificates, setCertificates] = useState<CertificateItem[]>(() =>
    loadLocal('certificates', defaultCertificates)
  );
  const [gallery, setGallery] = useState<GalleryItem[]>(() =>
    loadLocal('gallery', defaultGallery)
  );
  const [media, setMedia] = useState<MediaItem[]>(() =>
    loadLocal('media', [
      { id: 'm-1', url: 'https://iili.io/Bev2e8G.jpg', title: 'Abdul Motaleb Hero Portrait', category: 'Profile', uploadedAt: '2026-02-15' },
      { id: 'm-2', url: 'https://iili.io/fe0CKOv.md.jpg', title: 'Cyber Security Workstation', category: 'Tech', uploadedAt: '2026-02-15' },
      { id: 'm-3', url: 'https://iili.io/Bev3XOx.jpg', title: 'Cyber Security Dashboard', category: 'Projects', uploadedAt: '2026-02-15' }
    ])
  );
  const [stats, setStats] = useState<StatItem[]>(() =>
    loadLocal('stats', defaultStats)
  );
  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(() =>
    loadLocal('testimonials', defaultTestimonials)
  );
  const [messages, setMessages] = useState<ContactMessage[]>(() =>
    loadLocal('messages', [
      {
        id: 'msg-sample-1',
        fullName: 'Zahirul Alam',
        email: 'zahir@example.com',
        subject: 'Security Audit & Vulnerability Assessment',
        message: 'Hello Abdul, we would like to hire you for a comprehensive network security audit for our fintech platform in Dhaka.',
        timestamp: new Date().toISOString(),
        read: false
      }
    ])
  );
  const [navigation, setNavigation] = useState<NavigationItem[]>(() =>
    loadLocal('navigation', defaultNavigation)
  );
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>(() =>
    loadLocal('socialLinks', defaultSocialLinks)
  );
  const [seo, setSEO] = useState<SEOData>(() =>
    loadLocal('seo', defaultSEO)
  );
  const [aiSettings, setAISettings] = useState<AIChatbotSettings>(() =>
    loadLocal('aiSettings', defaultAIChatbotSettings)
  );
  const [aiKnowledgeBase, setAIKnowledgeBase] = useState<AIKnowledgeItem[]>(() =>
    loadLocal('aiKnowledgeBase', defaultAIKnowledgeBase)
  );
  const [chatAnalytics, setChatAnalytics] = useState<ChatAnalytics>(() =>
    loadLocal('chatAnalytics', defaultChatAnalytics)
  );

  // Sync with Firestore in background if accessible
  useEffect(() => {
    let isMounted = true;
    const loadFirestoreData = async () => {
      try {
        const settingsSnap = await getDocs(collection(db, 'siteSettings'));
        if (!settingsSnap.empty) {
          const docData = settingsSnap.docs[0].data() as SiteSettings;
          if (isMounted) {
            setSiteSettings(docData);
            saveLocal('siteSettings', docData);
          }
        }

        const heroSnap = await getDocs(collection(db, 'hero'));
        if (!heroSnap.empty) {
          const docData = heroSnap.docs[0].data() as HeroData;
          if (isMounted) {
            setHero(docData);
            saveLocal('hero', docData);
          }
        }

        const aboutSnap = await getDocs(collection(db, 'about'));
        if (!aboutSnap.empty) {
          const docData = aboutSnap.docs[0].data() as AboutData;
          if (isMounted) {
            setAbout(docData);
            saveLocal('about', docData);
          }
        }

        const skillsSnap = await getDocs(collection(db, 'skills'));
        if (!skillsSnap.empty) {
          const items = skillsSnap.docs.map(d => ({ id: d.id, ...d.data() } as SkillItem))
            .sort((a, b) => a.order - b.order);
          if (isMounted) {
            setSkills(items);
            saveLocal('skills', items);
          }
        }

        const messagesSnap = await getDocs(collection(db, 'messages'));
        if (!messagesSnap.empty) {
          const items = messagesSnap.docs.map(d => ({ id: d.id, ...d.data() } as ContactMessage));
          if (isMounted) {
            setMessages(items);
            saveLocal('messages', items);
          }
        }
      } catch (err) {
        console.info('Firestore initial fetch fallback to offline cache/default.');
        setDbConnected(false);
      }
    };

    loadFirestoreData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Update Methods
  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...data };
    setSiteSettings(updated);
    saveLocal('siteSettings', updated);
    try {
      await setDoc(doc(db, 'siteSettings', 'general'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    const updated = { ...hero, ...data };
    setHero(updated);
    saveLocal('hero', updated);
    try {
      await setDoc(doc(db, 'hero', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    const updated = { ...about, ...data };
    setAbout(updated);
    saveLocal('about', updated);
    try {
      await setDoc(doc(db, 'about', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  // Skills
  const addSkill = async (item: Omit<SkillItem, 'id'>) => {
    const id = 'sk-' + Date.now();
    const newSkill = { ...item, id };
    const updated = [...skills, newSkill];
    setSkills(updated);
    saveLocal('skills', updated);
    try {
      await setDoc(doc(db, 'skills', id), newSkill);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateSkill = async (id: string, item: Partial<SkillItem>) => {
    const updated = skills.map(s => (s.id === id ? { ...s, ...item } : s));
    setSkills(updated);
    saveLocal('skills', updated);
    try {
      await updateDoc(doc(db, 'skills', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteSkill = async (id: string) => {
    const updated = skills.filter(s => s.id !== id);
    setSkills(updated);
    saveLocal('skills', updated);
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderSkills = async (items: SkillItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSkills(ordered);
    saveLocal('skills', ordered);
    try {
      for (const item of ordered) {
        await updateDoc(doc(db, 'skills', item.id), { order: item.order });
      }
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  // Services
  const addService = async (item: Omit<ServiceItem, 'id'>) => {
    const id = 'srv-' + Date.now();
    const newService = { ...item, id };
    const updated = [...services, newService];
    setServices(updated);
    saveLocal('services', updated);
    try {
      await setDoc(doc(db, 'services', id), newService);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateService = async (id: string, item: Partial<ServiceItem>) => {
    const updated = services.map(s => (s.id === id ? { ...s, ...item } : s));
    setServices(updated);
    saveLocal('services', updated);
    try {
      await updateDoc(doc(db, 'services', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteService = async (id: string) => {
    const updated = services.filter(s => s.id !== id);
    setServices(updated);
    saveLocal('services', updated);
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderServices = async (items: ServiceItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setServices(ordered);
    saveLocal('services', ordered);
  };

  // Projects
  const addProject = async (item: Omit<ProjectItem, 'id'>) => {
    const id = 'proj-' + Date.now();
    const newProj = { ...item, id };
    const updated = [...projects, newProj];
    setProjects(updated);
    saveLocal('projects', updated);
    try {
      await setDoc(doc(db, 'projects', id), newProj);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateProject = async (id: string, item: Partial<ProjectItem>) => {
    const updated = projects.map(p => (p.id === id ? { ...p, ...item } : p));
    setProjects(updated);
    saveLocal('projects', updated);
    try {
      await updateDoc(doc(db, 'projects', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    saveLocal('projects', updated);
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderProjects = async (items: ProjectItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setProjects(ordered);
    saveLocal('projects', ordered);
  };

  // Experience
  const addExperience = async (item: Omit<ExperienceItem, 'id'>) => {
    const id = 'exp-' + Date.now();
    const newExp = { ...item, id };
    const updated = [...experience, newExp];
    setExperience(updated);
    saveLocal('experience', updated);
    try {
      await setDoc(doc(db, 'experience', id), newExp);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateExperience = async (id: string, item: Partial<ExperienceItem>) => {
    const updated = experience.map(e => (e.id === id ? { ...e, ...item } : e));
    setExperience(updated);
    saveLocal('experience', updated);
    try {
      await updateDoc(doc(db, 'experience', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteExperience = async (id: string) => {
    const updated = experience.filter(e => e.id !== id);
    setExperience(updated);
    saveLocal('experience', updated);
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderExperience = async (items: ExperienceItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setExperience(ordered);
    saveLocal('experience', ordered);
  };

  // Certificates
  const addCertificate = async (item: Omit<CertificateItem, 'id'>) => {
    const id = 'cert-' + Date.now();
    const newCert = { ...item, id };
    const updated = [...certificates, newCert];
    setCertificates(updated);
    saveLocal('certificates', updated);
    try {
      await setDoc(doc(db, 'certificates', id), newCert);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateCertificate = async (id: string, item: Partial<CertificateItem>) => {
    const updated = certificates.map(c => (c.id === id ? { ...c, ...item } : c));
    setCertificates(updated);
    saveLocal('certificates', updated);
    try {
      await updateDoc(doc(db, 'certificates', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteCertificate = async (id: string) => {
    const updated = certificates.filter(c => c.id !== id);
    setCertificates(updated);
    saveLocal('certificates', updated);
    try {
      await deleteDoc(doc(db, 'certificates', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderCertificates = async (items: CertificateItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setCertificates(ordered);
    saveLocal('certificates', ordered);
  };

  // Gallery
  const addGalleryItem = async (item: Omit<GalleryItem, 'id'>) => {
    const id = 'gal-' + Date.now();
    const newGal = { ...item, id };
    const updated = [newGal, ...gallery];
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await setDoc(doc(db, 'gallery', id), newGal);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const updateGalleryItem = async (id: string, item: Partial<GalleryItem>) => {
    const updated = gallery.map(g => (g.id === id ? { ...g, ...item } : g));
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await updateDoc(doc(db, 'gallery', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter(g => g.id !== id);
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  const reorderGallery = async (items: GalleryItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setGallery(ordered);
    saveLocal('gallery', ordered);
  };

  // Media
  const addMediaItem = async (item: Omit<MediaItem, 'id'>) => {
    const id = 'med-' + Date.now();
    const newMedia = { ...item, id };
    const updated = [newMedia, ...media];
    setMedia(updated);
    saveLocal('media', updated);
  };

  const deleteMediaItem = async (id: string) => {
    const updated = media.filter(m => m.id !== id);
    setMedia(updated);
    saveLocal('media', updated);
  };

  // Stats
  const addStat = async (item: Omit<StatItem, 'id'>) => {
    const id = 'stat-' + Date.now();
    const newStat = { ...item, id };
    const updated = [...stats, newStat];
    setStats(updated);
    saveLocal('stats', updated);
  };

  const updateStat = async (id: string, item: Partial<StatItem>) => {
    const updated = stats.map(s => (s.id === id ? { ...s, ...item } : s));
    setStats(updated);
    saveLocal('stats', updated);
  };

  const deleteStat = async (id: string) => {
    const updated = stats.filter(s => s.id !== id);
    setStats(updated);
    saveLocal('stats', updated);
  };

  const reorderStats = async (items: StatItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setStats(ordered);
    saveLocal('stats', ordered);
  };

  // Testimonials
  const addTestimonial = async (item: Omit<TestimonialItem, 'id'>) => {
    const id = 'test-' + Date.now();
    const newTest = { ...item, id };
    const updated = [...testimonials, newTest];
    setTestimonials(updated);
    saveLocal('testimonials', updated);
  };

  const updateTestimonial = async (id: string, item: Partial<TestimonialItem>) => {
    const updated = testimonials.map(t => (t.id === id ? { ...t, ...item } : t));
    setTestimonials(updated);
    saveLocal('testimonials', updated);
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter(t => t.id !== id);
    setTestimonials(updated);
    saveLocal('testimonials', updated);
  };

  const reorderTestimonials = async (items: TestimonialItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setTestimonials(ordered);
    saveLocal('testimonials', ordered);
  };

  // Navigation
  const addNavigation = async (item: Omit<NavigationItem, 'id'>) => {
    const id = 'nav-' + Date.now();
    const newNav = { ...item, id };
    const updated = [...navigation, newNav];
    setNavigation(updated);
    saveLocal('navigation', updated);
  };

  const updateNavigation = async (id: string, item: Partial<NavigationItem>) => {
    const updated = navigation.map(n => (n.id === id ? { ...n, ...item } : n));
    setNavigation(updated);
    saveLocal('navigation', updated);
  };

  const deleteNavigation = async (id: string) => {
    const updated = navigation.filter(n => n.id !== id);
    setNavigation(updated);
    saveLocal('navigation', updated);
  };

  const reorderNavigation = async (items: NavigationItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavigation(ordered);
    saveLocal('navigation', ordered);
  };

  // Social Links
  const addSocial = async (item: Omit<SocialLink, 'id'>) => {
    const id = 'soc-' + Date.now();
    const newSoc = { ...item, id };
    const updated = [...socialLinks, newSoc];
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
  };

  const updateSocial = async (id: string, item: Partial<SocialLink>) => {
    const updated = socialLinks.map(s => (s.id === id ? { ...s, ...item } : s));
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
  };

  const deleteSocial = async (id: string) => {
    const updated = socialLinks.filter(s => s.id !== id);
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
  };

  const reorderSocial = async (items: SocialLink[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSocialLinks(ordered);
    saveLocal('socialLinks', ordered);
  };

  // Messages
  const submitMessage = async (
    fullName: string,
    email: string,
    subject: string,
    message: string
  ) => {
    const id = 'msg-' + Date.now();
    const newMsg: ContactMessage = {
      id,
      fullName,
      email,
      subject,
      message,
      timestamp: new Date().toISOString(),
      read: false
    };

    const updated = [newMsg, ...messages];
    setMessages(updated);
    saveLocal('messages', updated);

    try {
      await addDoc(collection(db, 'messages'), {
        fullName,
        email,
        subject,
        message,
        timestamp: new Date().toISOString(),
        read: false,
        createdAt: serverTimestamp()
      });
    } catch (e) {
      console.warn('Firestore addDoc message note (stored locally):', e);
    }
  };

  const markMessageRead = async (id: string, read: boolean) => {
    const updated = messages.map(m => (m.id === id ? { ...m, read } : m));
    setMessages(updated);
    saveLocal('messages', updated);
    try {
      await updateDoc(doc(db, 'messages', id), { read });
    } catch (e) {
      console.warn('Firestore updateDoc warning:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    const updated = messages.filter(m => m.id !== id);
    setMessages(updated);
    saveLocal('messages', updated);
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (e) {
      console.warn('Firestore deleteDoc warning:', e);
    }
  };

  // SEO
  const updateSEO = async (data: Partial<SEOData>) => {
    const updated = { ...seo, ...data };
    setSEO(updated);
    saveLocal('seo', updated);
    try {
      await setDoc(doc(db, 'seo', 'meta'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore write warning:', e);
    }
  };

  // AI Assistant Settings & Knowledge Base
  const updateAISettings = async (data: Partial<AIChatbotSettings>) => {
    const updated = { ...aiSettings, ...data };
    setAISettings(updated);
    saveLocal('aiSettings', updated);
    try {
      await setDoc(doc(db, 'aiSettings', 'config'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore aiSettings write note:', e);
    }
  };

  const addKnowledgeItem = async (item: Omit<AIKnowledgeItem, 'id'>) => {
    const id = 'kb-' + Date.now();
    const newItem: AIKnowledgeItem = { ...item, id };
    const updated = [...aiKnowledgeBase, newItem];
    setAIKnowledgeBase(updated);
    saveLocal('aiKnowledgeBase', updated);
    try {
      await setDoc(doc(db, 'aiKnowledgeBase', id), newItem);
    } catch (e) {
      console.warn('Firestore knowledge item write note:', e);
    }
  };

  const updateKnowledgeItem = async (id: string, item: Partial<AIKnowledgeItem>) => {
    const updated = aiKnowledgeBase.map((k) => (k.id === id ? { ...k, ...item } : k));
    setAIKnowledgeBase(updated);
    saveLocal('aiKnowledgeBase', updated);
    try {
      await updateDoc(doc(db, 'aiKnowledgeBase', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore update knowledge item note:', e);
    }
  };

  const deleteKnowledgeItem = async (id: string) => {
    const updated = aiKnowledgeBase.filter((k) => k.id !== id);
    setAIKnowledgeBase(updated);
    saveLocal('aiKnowledgeBase', updated);
    try {
      await deleteDoc(doc(db, 'aiKnowledgeBase', id));
    } catch (e) {
      console.warn('Firestore delete knowledge item note:', e);
    }
  };

  const recordChatInteraction = (userQuery: string) => {
    setChatAnalytics((prev) => {
      const topQuestions = [...prev.mostAskedQuestions];
      const existing = topQuestions.find((q) => q.question.toLowerCase() === userQuery.toLowerCase());
      if (existing) {
        existing.count++;
      } else if (userQuery.trim().length > 5) {
        topQuestions.unshift({ question: userQuery.trim(), count: 1 });
        if (topQuestions.length > 8) topQuestions.pop();
      }

      const updated: ChatAnalytics = {
        totalConversations: prev.totalConversations + 1,
        totalMessages: prev.totalMessages + 2,
        todayConversations: prev.todayConversations + 1,
        mostAskedQuestions: topQuestions
      };
      saveLocal('chatAnalytics', updated);
      return updated;
    });
  };

  // Backup & Restore
  const exportWebsiteData = (): string => {
    const bundle = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      siteSettings,
      hero,
      about,
      skills,
      services,
      projects,
      experience,
      certificates,
      gallery,
      stats,
      testimonials,
      navigation,
      socialLinks,
      seo,
      aiSettings,
      aiKnowledgeBase,
      chatAnalytics
    };
    return JSON.stringify(bundle, null, 2);
  };

  const importWebsiteData = async (jsonData: string): Promise<{ success: boolean; message: string }> => {
    try {
      const parsed = JSON.parse(jsonData);
      if (!parsed || typeof parsed !== 'object') {
        return { success: false, message: 'Invalid JSON file format.' };
      }

      if (parsed.siteSettings) {
        setSiteSettings(parsed.siteSettings);
        saveLocal('siteSettings', parsed.siteSettings);
      }
      if (parsed.hero) {
        setHero(parsed.hero);
        saveLocal('hero', parsed.hero);
      }
      if (parsed.about) {
        setAbout(parsed.about);
        saveLocal('about', parsed.about);
      }
      if (Array.isArray(parsed.skills)) {
        setSkills(parsed.skills);
        saveLocal('skills', parsed.skills);
      }
      if (Array.isArray(parsed.services)) {
        setServices(parsed.services);
        saveLocal('services', parsed.services);
      }
      if (Array.isArray(parsed.projects)) {
        setProjects(parsed.projects);
        saveLocal('projects', parsed.projects);
      }
      if (Array.isArray(parsed.experience)) {
        setExperience(parsed.experience);
        saveLocal('experience', parsed.experience);
      }
      if (Array.isArray(parsed.certificates)) {
        setCertificates(parsed.certificates);
        saveLocal('certificates', parsed.certificates);
      }
      if (Array.isArray(parsed.gallery)) {
        setGallery(parsed.gallery);
        saveLocal('gallery', parsed.gallery);
      }
      if (Array.isArray(parsed.stats)) {
        setStats(parsed.stats);
        saveLocal('stats', parsed.stats);
      }
      if (Array.isArray(parsed.testimonials)) {
        setTestimonials(parsed.testimonials);
        saveLocal('testimonials', parsed.testimonials);
      }
      if (Array.isArray(parsed.navigation)) {
        setNavigation(parsed.navigation);
        saveLocal('navigation', parsed.navigation);
      }
      if (Array.isArray(parsed.socialLinks)) {
        setSocialLinks(parsed.socialLinks);
        saveLocal('socialLinks', parsed.socialLinks);
      }
      if (parsed.seo) {
        setSEO(parsed.seo);
        saveLocal('seo', parsed.seo);
      }
      if (parsed.aiSettings) {
        setAISettings(parsed.aiSettings);
        saveLocal('aiSettings', parsed.aiSettings);
      }
      if (Array.isArray(parsed.aiKnowledgeBase)) {
        setAIKnowledgeBase(parsed.aiKnowledgeBase);
        saveLocal('aiKnowledgeBase', parsed.aiKnowledgeBase);
      }

      return { success: true, message: 'Website data restored successfully!' };
    } catch (e: unknown) {
      const err = e as { message?: string };
      return { success: false, message: 'JSON Parse Error: ' + (err.message || 'Corrupted file') };
    }
  };

  const resetToDefault = () => {
    setSiteSettings(defaultSiteSettings);
    setHero(defaultHeroData);
    setAbout(defaultAboutData);
    setSkills(defaultSkills);
    setServices(defaultServices);
    setProjects(defaultProjects);
    setExperience(defaultExperience);
    setCertificates(defaultCertificates);
    setGallery(defaultGallery);
    setStats(defaultStats);
    setTestimonials(defaultTestimonials);
    setNavigation(defaultNavigation);
    setSocialLinks(defaultSocialLinks);
    setSEO(defaultSEO);
    setAISettings(defaultAIChatbotSettings);
    setAIKnowledgeBase(defaultAIKnowledgeBase);
    setChatAnalytics(defaultChatAnalytics);

    saveLocal('siteSettings', defaultSiteSettings);
    saveLocal('hero', defaultHeroData);
    saveLocal('about', defaultAboutData);
    saveLocal('skills', defaultSkills);
    saveLocal('services', defaultServices);
    saveLocal('projects', defaultProjects);
    saveLocal('experience', defaultExperience);
    saveLocal('certificates', defaultCertificates);
    saveLocal('gallery', defaultGallery);
    saveLocal('stats', defaultStats);
    saveLocal('testimonials', defaultTestimonials);
    saveLocal('navigation', defaultNavigation);
    saveLocal('socialLinks', defaultSocialLinks);
    saveLocal('seo', defaultSEO);
    saveLocal('aiSettings', defaultAIChatbotSettings);
    saveLocal('aiKnowledgeBase', defaultAIKnowledgeBase);
    saveLocal('chatAnalytics', defaultChatAnalytics);
  };

  return (
    <DataContext.Provider
      value={{
        siteSettings,
        hero,
        about,
        skills,
        services,
        projects,
        experience,
        certificates,
        gallery,
        media,
        stats,
        testimonials,
        messages,
        navigation,
        socialLinks,
        seo,
        aiSettings,
        aiKnowledgeBase,
        chatAnalytics,
        loading,
        dbConnected,
        updateSiteSettings,
        updateHero,
        updateAbout,
        updateAISettings,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        recordChatInteraction,
        addSkill,
        updateSkill,
        deleteSkill,
        reorderSkills,
        addService,
        updateService,
        deleteService,
        reorderServices,
        addProject,
        updateProject,
        deleteProject,
        reorderProjects,
        addExperience,
        updateExperience,
        deleteExperience,
        reorderExperience,
        addCertificate,
        updateCertificate,
        deleteCertificate,
        reorderCertificates,
        addGalleryItem,
        updateGalleryItem,
        deleteGalleryItem,
        reorderGallery,
        addMediaItem,
        deleteMediaItem,
        addStat,
        updateStat,
        deleteStat,
        reorderStats,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        reorderTestimonials,
        addNavigation,
        updateNavigation,
        deleteNavigation,
        reorderNavigation,
        addSocial,
        updateSocial,
        deleteSocial,
        reorderSocial,
        submitMessage,
        markMessageRead,
        deleteMessage,
        updateSEO,
        exportWebsiteData,
        importWebsiteData,
        resetToDefault
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error('useData must be used within DataProvider');
  return context;
};
