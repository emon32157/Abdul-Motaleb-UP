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
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  writeBatch
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
  isSyncingToFirebase: boolean;

  // Global Configs
  updateSiteSettings: (data: Partial<SiteSettings>) => Promise<void>;
  updateHero: (data: Partial<HeroData>) => Promise<void>;
  updateAbout: (data: Partial<AboutData>) => Promise<void>;

  // AI Assistant & Knowledge
  updateAISettings: (data: Partial<AIChatbotSettings>) => Promise<void>;
  addKnowledgeItem: (item: Omit<AIKnowledgeItem, 'id'>) => Promise<void>;
  updateKnowledgeItem: (id: string, item: Partial<AIKnowledgeItem>) => Promise<void>;
  deleteKnowledgeItem: (id: string) => Promise<void>;
  recordChatInteraction: (question: string) => void;

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

  // Cloud Persistence Sync
  syncAllDataToFirebase: () => Promise<{ success: boolean; message: string; count: number }>;

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
  const [isSyncingToFirebase, setIsSyncingToFirebase] = useState(false);

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

  // Sync with Firestore: Load all website data from Firestore on boot
  useEffect(() => {
    let isMounted = true;

    const loadAllFirestoreData = async () => {
      setLoading(true);
      try {
        // 1. Site Settings
        const settingsSnap = await getDoc(doc(db, 'siteSettings', 'general'));
        if (settingsSnap.exists() && isMounted) {
          const docData = settingsSnap.data() as SiteSettings;
          setSiteSettings(docData);
          saveLocal('siteSettings', docData);
        }

        // 2. Hero
        const heroSnap = await getDoc(doc(db, 'hero', 'main'));
        if (heroSnap.exists() && isMounted) {
          const docData = heroSnap.data() as HeroData;
          setHero(docData);
          saveLocal('hero', docData);
        }

        // 3. About
        const aboutSnap = await getDoc(doc(db, 'about', 'main'));
        if (aboutSnap.exists() && isMounted) {
          const docData = aboutSnap.data() as AboutData;
          setAbout(docData);
          saveLocal('about', docData);
        }

        // 4. Skills
        const skillsSnap = await getDocs(collection(db, 'skills'));
        if (!skillsSnap.empty && isMounted) {
          const items = skillsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as SkillItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setSkills(items);
          saveLocal('skills', items);
        }

        // 5. Services
        const servicesSnap = await getDocs(collection(db, 'services'));
        if (!servicesSnap.empty && isMounted) {
          const items = servicesSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ServiceItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setServices(items);
          saveLocal('services', items);
        }

        // 6. Projects
        const projectsSnap = await getDocs(collection(db, 'projects'));
        if (!projectsSnap.empty && isMounted) {
          const items = projectsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ProjectItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setProjects(items);
          saveLocal('projects', items);
        }

        // 7. Experience
        const experienceSnap = await getDocs(collection(db, 'experience'));
        if (!experienceSnap.empty && isMounted) {
          const items = experienceSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ExperienceItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setExperience(items);
          saveLocal('experience', items);
        }

        // 8. Certificates
        const certsSnap = await getDocs(collection(db, 'certificates'));
        if (!certsSnap.empty && isMounted) {
          const items = certsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as CertificateItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setCertificates(items);
          saveLocal('certificates', items);
        }

        // 9. Gallery
        const gallerySnap = await getDocs(collection(db, 'gallery'));
        if (!gallerySnap.empty && isMounted) {
          const items = gallerySnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as GalleryItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setGallery(items);
          saveLocal('gallery', items);
        }

        // 10. Media
        const mediaSnap = await getDocs(collection(db, 'media'));
        if (!mediaSnap.empty && isMounted) {
          const items = mediaSnap.docs.map((d) => ({ id: d.id, ...d.data() } as MediaItem));
          setMedia(items);
          saveLocal('media', items);
        }

        // 11. Statistics
        const statsSnap = await getDocs(collection(db, 'statistics'));
        if (!statsSnap.empty && isMounted) {
          const items = statsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as StatItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setStats(items);
          saveLocal('stats', items);
        }

        // 12. Testimonials
        const testimonialsSnap = await getDocs(collection(db, 'testimonials'));
        if (!testimonialsSnap.empty && isMounted) {
          const items = testimonialsSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as TestimonialItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setTestimonials(items);
          saveLocal('testimonials', items);
        }

        // 13. Navigation
        const navSnap = await getDocs(collection(db, 'navigation'));
        if (!navSnap.empty && isMounted) {
          const items = navSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as NavigationItem))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setNavigation(items);
          saveLocal('navigation', items);
        }

        // 14. Social Links
        const socialSnap = await getDocs(collection(db, 'socialLinks'));
        if (!socialSnap.empty && isMounted) {
          const items = socialSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as SocialLink))
            .sort((a, b) => (a.order || 0) - (b.order || 0));
          setSocialLinks(items);
          saveLocal('socialLinks', items);
        }

        // 15. Messages
        const messagesSnap = await getDocs(collection(db, 'messages'));
        if (!messagesSnap.empty && isMounted) {
          const items = messagesSnap.docs
            .map((d) => ({ id: d.id, ...d.data() } as ContactMessage))
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          setMessages(items);
          saveLocal('messages', items);
        }

        // 16. SEO
        const seoSnap = await getDoc(doc(db, 'seo', 'meta'));
        if (seoSnap.exists() && isMounted) {
          const docData = seoSnap.data() as SEOData;
          setSEO(docData);
          saveLocal('seo', docData);
        }

        // 17. AI Chatbot Settings
        const aiSettingsSnap = await getDoc(doc(db, 'aiSettings', 'config'));
        if (aiSettingsSnap.exists() && isMounted) {
          const docData = aiSettingsSnap.data() as AIChatbotSettings;
          setAISettings(docData);
          saveLocal('aiSettings', docData);
        }

        // 18. AI Knowledge Base
        const kbSnap = await getDocs(collection(db, 'aiKnowledgeBase'));
        if (!kbSnap.empty && isMounted) {
          const items = kbSnap.docs.map((d) => ({ id: d.id, ...d.data() } as AIKnowledgeItem));
          setAIKnowledgeBase(items);
          saveLocal('aiKnowledgeBase', items);
        }

        if (isMounted) setDbConnected(true);
      } catch (err) {
        console.warn('Firestore initial load notice (fallback to local cache):', err);
        if (isMounted) setDbConnected(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadAllFirestoreData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update Methods with immediate Firestore Persistence
  const updateSiteSettings = async (data: Partial<SiteSettings>) => {
    const updated = { ...siteSettings, ...data };
    setSiteSettings(updated);
    saveLocal('siteSettings', updated);
    try {
      await setDoc(doc(db, 'siteSettings', 'general'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore siteSettings write notice:', e);
    }
  };

  const updateHero = async (data: Partial<HeroData>) => {
    const updated = { ...hero, ...data };
    setHero(updated);
    saveLocal('hero', updated);
    try {
      await setDoc(doc(db, 'hero', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore hero write notice:', e);
    }
  };

  const updateAbout = async (data: Partial<AboutData>) => {
    const updated = { ...about, ...data };
    setAbout(updated);
    saveLocal('about', updated);
    try {
      await setDoc(doc(db, 'about', 'main'), updated, { merge: true });
    } catch (e) {
      console.warn('Firestore about write notice:', e);
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
      console.warn('Firestore skill write notice:', e);
    }
  };

  const updateSkill = async (id: string, item: Partial<SkillItem>) => {
    const updated = skills.map((s) => (s.id === id ? { ...s, ...item } : s));
    setSkills(updated);
    saveLocal('skills', updated);
    try {
      await updateDoc(doc(db, 'skills', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore update skill notice:', e);
    }
  };

  const deleteSkill = async (id: string) => {
    const updated = skills.filter((s) => s.id !== id);
    setSkills(updated);
    saveLocal('skills', updated);
    try {
      await deleteDoc(doc(db, 'skills', id));
    } catch (e) {
      console.warn('Firestore delete skill notice:', e);
    }
  };

  const reorderSkills = async (items: SkillItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSkills(ordered);
    saveLocal('skills', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'skills', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder skills notice:', e);
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
      console.warn('Firestore service write notice:', e);
    }
  };

  const updateService = async (id: string, item: Partial<ServiceItem>) => {
    const updated = services.map((s) => (s.id === id ? { ...s, ...item } : s));
    setServices(updated);
    saveLocal('services', updated);
    try {
      await updateDoc(doc(db, 'services', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore service update notice:', e);
    }
  };

  const deleteService = async (id: string) => {
    const updated = services.filter((s) => s.id !== id);
    setServices(updated);
    saveLocal('services', updated);
    try {
      await deleteDoc(doc(db, 'services', id));
    } catch (e) {
      console.warn('Firestore service delete notice:', e);
    }
  };

  const reorderServices = async (items: ServiceItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setServices(ordered);
    saveLocal('services', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'services', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder services notice:', e);
    }
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
      console.warn('Firestore project write notice:', e);
    }
  };

  const updateProject = async (id: string, item: Partial<ProjectItem>) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, ...item } : p));
    setProjects(updated);
    saveLocal('projects', updated);
    try {
      await updateDoc(doc(db, 'projects', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore project update notice:', e);
    }
  };

  const deleteProject = async (id: string) => {
    const updated = projects.filter((p) => p.id !== id);
    setProjects(updated);
    saveLocal('projects', updated);
    try {
      await deleteDoc(doc(db, 'projects', id));
    } catch (e) {
      console.warn('Firestore project delete notice:', e);
    }
  };

  const reorderProjects = async (items: ProjectItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setProjects(ordered);
    saveLocal('projects', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'projects', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder projects notice:', e);
    }
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
      console.warn('Firestore experience write notice:', e);
    }
  };

  const updateExperience = async (id: string, item: Partial<ExperienceItem>) => {
    const updated = experience.map((e) => (e.id === id ? { ...e, ...item } : e));
    setExperience(updated);
    saveLocal('experience', updated);
    try {
      await updateDoc(doc(db, 'experience', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore experience update notice:', e);
    }
  };

  const deleteExperience = async (id: string) => {
    const updated = experience.filter((e) => e.id !== id);
    setExperience(updated);
    saveLocal('experience', updated);
    try {
      await deleteDoc(doc(db, 'experience', id));
    } catch (e) {
      console.warn('Firestore experience delete notice:', e);
    }
  };

  const reorderExperience = async (items: ExperienceItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setExperience(ordered);
    saveLocal('experience', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'experience', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder experience notice:', e);
    }
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
      console.warn('Firestore certificate write notice:', e);
    }
  };

  const updateCertificate = async (id: string, item: Partial<CertificateItem>) => {
    const updated = certificates.map((c) => (c.id === id ? { ...c, ...item } : c));
    setCertificates(updated);
    saveLocal('certificates', updated);
    try {
      await updateDoc(doc(db, 'certificates', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore certificate update notice:', e);
    }
  };

  const deleteCertificate = async (id: string) => {
    const updated = certificates.filter((c) => c.id !== id);
    setCertificates(updated);
    saveLocal('certificates', updated);
    try {
      await deleteDoc(doc(db, 'certificates', id));
    } catch (e) {
      console.warn('Firestore certificate delete notice:', e);
    }
  };

  const reorderCertificates = async (items: CertificateItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setCertificates(ordered);
    saveLocal('certificates', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'certificates', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder certificates notice:', e);
    }
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
      console.warn('Firestore gallery write notice:', e);
    }
  };

  const updateGalleryItem = async (id: string, item: Partial<GalleryItem>) => {
    const updated = gallery.map((g) => (g.id === id ? { ...g, ...item } : g));
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await updateDoc(doc(db, 'gallery', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore gallery update notice:', e);
    }
  };

  const deleteGalleryItem = async (id: string) => {
    const updated = gallery.filter((g) => g.id !== id);
    setGallery(updated);
    saveLocal('gallery', updated);
    try {
      await deleteDoc(doc(db, 'gallery', id));
    } catch (e) {
      console.warn('Firestore gallery delete notice:', e);
    }
  };

  const reorderGallery = async (items: GalleryItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setGallery(ordered);
    saveLocal('gallery', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'gallery', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder gallery notice:', e);
    }
  };

  // Media
  const addMediaItem = async (item: Omit<MediaItem, 'id'>) => {
    const id = 'med-' + Date.now();
    const newMedia = { ...item, id };
    const updated = [newMedia, ...media];
    setMedia(updated);
    saveLocal('media', updated);
    try {
      await setDoc(doc(db, 'media', id), newMedia);
    } catch (e) {
      console.warn('Firestore media write notice:', e);
    }
  };

  const deleteMediaItem = async (id: string) => {
    const updated = media.filter((m) => m.id !== id);
    setMedia(updated);
    saveLocal('media', updated);
    try {
      await deleteDoc(doc(db, 'media', id));
    } catch (e) {
      console.warn('Firestore media delete notice:', e);
    }
  };

  // Stats
  const addStat = async (item: Omit<StatItem, 'id'>) => {
    const id = 'stat-' + Date.now();
    const newStat = { ...item, id };
    const updated = [...stats, newStat];
    setStats(updated);
    saveLocal('stats', updated);
    try {
      await setDoc(doc(db, 'statistics', id), newStat);
    } catch (e) {
      console.warn('Firestore stat write notice:', e);
    }
  };

  const updateStat = async (id: string, item: Partial<StatItem>) => {
    const updated = stats.map((s) => (s.id === id ? { ...s, ...item } : s));
    setStats(updated);
    saveLocal('stats', updated);
    try {
      await updateDoc(doc(db, 'statistics', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore stat update notice:', e);
    }
  };

  const deleteStat = async (id: string) => {
    const updated = stats.filter((s) => s.id !== id);
    setStats(updated);
    saveLocal('stats', updated);
    try {
      await deleteDoc(doc(db, 'statistics', id));
    } catch (e) {
      console.warn('Firestore stat delete notice:', e);
    }
  };

  const reorderStats = async (items: StatItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setStats(ordered);
    saveLocal('stats', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'statistics', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder stats notice:', e);
    }
  };

  // Testimonials
  const addTestimonial = async (item: Omit<TestimonialItem, 'id'>) => {
    const id = 'test-' + Date.now();
    const newTest = { ...item, id };
    const updated = [...testimonials, newTest];
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    try {
      await setDoc(doc(db, 'testimonials', id), newTest);
    } catch (e) {
      console.warn('Firestore testimonial write notice:', e);
    }
  };

  const updateTestimonial = async (id: string, item: Partial<TestimonialItem>) => {
    const updated = testimonials.map((t) => (t.id === id ? { ...t, ...item } : t));
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    try {
      await updateDoc(doc(db, 'testimonials', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore testimonial update notice:', e);
    }
  };

  const deleteTestimonial = async (id: string) => {
    const updated = testimonials.filter((t) => t.id !== id);
    setTestimonials(updated);
    saveLocal('testimonials', updated);
    try {
      await deleteDoc(doc(db, 'testimonials', id));
    } catch (e) {
      console.warn('Firestore testimonial delete notice:', e);
    }
  };

  const reorderTestimonials = async (items: TestimonialItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setTestimonials(ordered);
    saveLocal('testimonials', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'testimonials', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder testimonials notice:', e);
    }
  };

  // Navigation
  const addNavigation = async (item: Omit<NavigationItem, 'id'>) => {
    const id = 'nav-' + Date.now();
    const newNav = { ...item, id };
    const updated = [...navigation, newNav];
    setNavigation(updated);
    saveLocal('navigation', updated);
    try {
      await setDoc(doc(db, 'navigation', id), newNav);
    } catch (e) {
      console.warn('Firestore navigation write notice:', e);
    }
  };

  const updateNavigation = async (id: string, item: Partial<NavigationItem>) => {
    const updated = navigation.map((n) => (n.id === id ? { ...n, ...item } : n));
    setNavigation(updated);
    saveLocal('navigation', updated);
    try {
      await updateDoc(doc(db, 'navigation', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore navigation update notice:', e);
    }
  };

  const deleteNavigation = async (id: string) => {
    const updated = navigation.filter((n) => n.id !== id);
    setNavigation(updated);
    saveLocal('navigation', updated);
    try {
      await deleteDoc(doc(db, 'navigation', id));
    } catch (e) {
      console.warn('Firestore navigation delete notice:', e);
    }
  };

  const reorderNavigation = async (items: NavigationItem[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setNavigation(ordered);
    saveLocal('navigation', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'navigation', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder navigation notice:', e);
    }
  };

  // Social Links
  const addSocial = async (item: Omit<SocialLink, 'id'>) => {
    const id = 'soc-' + Date.now();
    const newSoc = { ...item, id };
    const updated = [...socialLinks, newSoc];
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
    try {
      await setDoc(doc(db, 'socialLinks', id), newSoc);
    } catch (e) {
      console.warn('Firestore social link write notice:', e);
    }
  };

  const updateSocial = async (id: string, item: Partial<SocialLink>) => {
    const updated = socialLinks.map((s) => (s.id === id ? { ...s, ...item } : s));
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
    try {
      await updateDoc(doc(db, 'socialLinks', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore social link update notice:', e);
    }
  };

  const deleteSocial = async (id: string) => {
    const updated = socialLinks.filter((s) => s.id !== id);
    setSocialLinks(updated);
    saveLocal('socialLinks', updated);
    try {
      await deleteDoc(doc(db, 'socialLinks', id));
    } catch (e) {
      console.warn('Firestore social link delete notice:', e);
    }
  };

  const reorderSocial = async (items: SocialLink[]) => {
    const ordered = items.map((item, idx) => ({ ...item, order: idx + 1 }));
    setSocialLinks(ordered);
    saveLocal('socialLinks', ordered);
    try {
      const batch = writeBatch(db);
      ordered.forEach((item) => {
        batch.update(doc(db, 'socialLinks', item.id), { order: item.order });
      });
      await batch.commit();
    } catch (e) {
      console.warn('Firestore reorder social links notice:', e);
    }
  };

  // Contact Messages
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
      await setDoc(doc(db, 'messages', id), newMsg);
    } catch (e) {
      console.warn('Firestore submit message notice (saved locally):', e);
    }
  };

  const markMessageRead = async (id: string, read: boolean) => {
    const updated = messages.map((m) => (m.id === id ? { ...m, read } : m));
    setMessages(updated);
    saveLocal('messages', updated);
    try {
      await updateDoc(doc(db, 'messages', id), { read });
    } catch (e) {
      console.warn('Firestore update message status notice:', e);
    }
  };

  const deleteMessage = async (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    saveLocal('messages', updated);
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (e) {
      console.warn('Firestore delete message notice:', e);
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
      console.warn('Firestore SEO write notice:', e);
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
      console.warn('Firestore aiSettings write notice:', e);
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
      console.warn('Firestore knowledge item write notice:', e);
    }
  };

  const updateKnowledgeItem = async (id: string, item: Partial<AIKnowledgeItem>) => {
    const updated = aiKnowledgeBase.map((k) => (k.id === id ? { ...k, ...item } : k));
    setAIKnowledgeBase(updated);
    saveLocal('aiKnowledgeBase', updated);
    try {
      await updateDoc(doc(db, 'aiKnowledgeBase', id), item as Record<string, unknown>);
    } catch (e) {
      console.warn('Firestore update knowledge item notice:', e);
    }
  };

  const deleteKnowledgeItem = async (id: string) => {
    const updated = aiKnowledgeBase.filter((k) => k.id !== id);
    setAIKnowledgeBase(updated);
    saveLocal('aiKnowledgeBase', updated);
    try {
      await deleteDoc(doc(db, 'aiKnowledgeBase', id));
    } catch (e) {
      console.warn('Firestore delete knowledge item notice:', e);
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

  // Comprehensive Cloud Sync: Saves ALL structured website data to Firebase Firestore
  const syncAllDataToFirebase = async (): Promise<{ success: boolean; message: string; count: number }> => {
    setIsSyncingToFirebase(true);
    let totalSynced = 0;

    try {
      // 1. Single Documents
      await setDoc(doc(db, 'siteSettings', 'general'), siteSettings, { merge: true });
      totalSynced++;

      await setDoc(doc(db, 'hero', 'main'), hero, { merge: true });
      totalSynced++;

      await setDoc(doc(db, 'about', 'main'), about, { merge: true });
      totalSynced++;

      await setDoc(doc(db, 'seo', 'meta'), seo, { merge: true });
      totalSynced++;

      await setDoc(doc(db, 'aiSettings', 'config'), aiSettings, { merge: true });
      totalSynced++;

      // 2. Collections Batch 1: Skills, Services, Projects, Experience, Certificates
      const batch1 = writeBatch(db);
      skills.forEach((item) => batch1.set(doc(db, 'skills', item.id), item));
      services.forEach((item) => batch1.set(doc(db, 'services', item.id), item));
      projects.forEach((item) => batch1.set(doc(db, 'projects', item.id), item));
      experience.forEach((item) => batch1.set(doc(db, 'experience', item.id), item));
      certificates.forEach((item) => batch1.set(doc(db, 'certificates', item.id), item));
      await batch1.commit();
      totalSynced += skills.length + services.length + projects.length + experience.length + certificates.length;

      // 3. Collections Batch 2: Gallery (URLs and metadata only - no raw image files)
      const batch2 = writeBatch(db);
      gallery.forEach((item) => batch2.set(doc(db, 'gallery', item.id), item));
      media.forEach((item) => batch2.set(doc(db, 'media', item.id), item));
      stats.forEach((item) => batch2.set(doc(db, 'statistics', item.id), item));
      testimonials.forEach((item) => batch2.set(doc(db, 'testimonials', item.id), item));
      navigation.forEach((item) => batch2.set(doc(db, 'navigation', item.id), item));
      socialLinks.forEach((item) => batch2.set(doc(db, 'socialLinks', item.id), item));
      await batch2.commit();
      totalSynced += gallery.length + media.length + stats.length + testimonials.length + navigation.length + socialLinks.length;

      // 4. Collections Batch 3: AI Knowledge Base
      if (aiKnowledgeBase.length > 0) {
        const batch3 = writeBatch(db);
        aiKnowledgeBase.forEach((item) => batch3.set(doc(db, 'aiKnowledgeBase', item.id), item));
        await batch3.commit();
        totalSynced += aiKnowledgeBase.length;
      }

      setDbConnected(true);
      return {
        success: true,
        message: `সকল ডাটা সফলভাবে ফায়ারবেসে ক্লাউডে সংরক্ষিত হয়েছে! মোট ${totalSynced} টি ডকুমেন্ট আপডেট করা হয়েছে।`,
        count: totalSynced
      };
    } catch (e: unknown) {
      const err = e as { message?: string };
      console.warn('Firebase batch sync notice:', err);
      return {
        success: false,
        message: 'ফায়ারবেসে সংরক্ষণে ত্রুটি: ' + (err.message || 'অপ্রত্যাশিত সমস্যা'),
        count: totalSynced
      };
    } finally {
      setIsSyncingToFirebase(false);
    }
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
      media,
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
      if (Array.isArray(parsed.media)) {
        setMedia(parsed.media);
        saveLocal('media', parsed.media);
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

      // Automatically sync imported data to Firebase Firestore
      setTimeout(() => {
        syncAllDataToFirebase();
      }, 500);

      return { success: true, message: 'Website data restored and synced with Firebase successfully!' };
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

    // Sync reset default data to Firebase
    setTimeout(() => {
      syncAllDataToFirebase();
    }, 500);
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
        isSyncingToFirebase,
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
        syncAllDataToFirebase,
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
