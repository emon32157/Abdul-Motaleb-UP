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
  NavigationItem,
  SocialLink,
  SEOData,
  ThemeConfig,
  AIChatbotSettings,
  AIKnowledgeItem,
  ChatAnalytics
} from '../types';

export const defaultSiteSettings: SiteSettings = {
  siteTitle: 'Abdul Motaleb | Personal Portfolio',
  siteSubtitle: 'Cyber Security Expert | Ethical Hacker | Web Developer',
  logoText: 'Abdul Motaleb',
  faviconUrl: 'https://iili.io/Bev2e8G.jpg',
  maintenanceMode: false,
  googleVerification: 'qMBAhBAM1H9LGRBS2XRXJY_ffyNEucSdZW1W_Dbf2Bw',
  googleAnalyticsId: '',
  googleTagManagerId: '',
  footerText: 'Abdul Motaleb - Cyber Security Expert, Ethical Hacker & Web Developer.',
  footerRights: '© 2026 Abdul Motaleb. All Rights Reserved.',
  email: 'motaleb@example.com',
  phone: '+880 1712 345678',
  whatsapp: '+8801712345678',
  location: 'Feni, Bangladesh',
  locationBn: 'ফেনী, বাংলাদেশ',
  cvUrl: '#'
};

export const defaultHeroData: HeroData = {
  badgeText: 'Available for Projects',
  badgeTextBn: 'প্রজেক্টের জন্য উন্মুক্ত',
  greeting: "Hello, I'm",
  greetingBn: 'হ্যালো, আমি',
  name: 'Abdul Motaleb',
  title: 'Cyber Security Expert | Ethical Hacker\nSocial Media Expert | Web Developer',
  titleBn: 'সাইবার সিকিউরিটি এক্সপার্ট | এথিক্যাল হ্যাকার\nসোশ্যাল মিডিয়া এক্সপার্ট | ওয়েব ডেভেলপার',
  description: 'I build secure systems, create modern websites, manage social media and turn ideas into reality.',
  descriptionBn: 'আমি নিরাপদ সিস্টেম তৈরি করি, আধুনিক ওয়েবসাইট ডেভেলপ করি এবং সোশ্যাল মিডিয়া ম্যানেজমেন্টের মাধ্যমে ব্যবসাকে এগিয়ে নিই।',
  hireBtnText: 'Hire Me',
  hireBtnLink: '#contact',
  cvBtnText: 'Download CV',
  cvBtnLink: '#',
  profileImageUrl: 'https://iili.io/Bev2e8G.jpg',
  terminalUser: 'user',
  terminalHost: 'portfolio',
  terminalWhoami: 'Abdul Motaleb',
  terminalProfession: [
    'Cyber Security Expert',
    'Ethical Hacker',
    'Web Developer',
    'Social Media Expert'
  ],
  terminalStatus: 'Available for work',
  terminalQuote: '"Security is not a product, it\'s a process."'
};

export const defaultAboutData: AboutData = {
  name: 'Abdul Motaleb',
  role: 'Cyber Security Expert',
  speciality: 'Ethical Hacking',
  developer: 'Web Development',
  location: 'Bangladesh',
  status: 'Available',
  languages: 'Bangla, English, Arabic',
  terminalFooter: 'Ready for new challenges...',
  bioEn: 'I am a passionate Cyber Security Expert, Ethical Hacker, Social Media Expert and Web Developer. I love to explore new technologies, secure systems, create modern websites and help businesses grow through digital marketing.',
  bioBn: 'আমি একজন নিবেদিতপ্রাণ সাইবার সিকিউরিটি বিশেষজ্ঞ, এথিক্যাল হ্যাকার, সোশ্যাল মিডিয়া এক্সপার্ট ও ওয়েব ডেভেলপার। নতুন প্রযুক্তি আবিষ্কার করা, ডিজিটাল নিরাপত্তা নিশ্চিত করা ও আধুনিক ওয়েব অ্যাপ্লিকেশন তৈরি করাই আমার লক্ষ্য।',
  highlights: [
    'Problem Solver',
    'Quick Learner',
    'Team Player',
    'Always Ready'
  ],
  highlightsBn: [
    'সমস্যা সমাধানে দক্ষ',
    'দ্রুত শিখতে পারদর্শী',
    'টিম প্লেয়ার',
    'সর্বদা প্রস্তুত'
  ]
};

export const defaultNavigation: NavigationItem[] = [
  { id: 'nav-1', title: 'Home', titleBn: 'হোম', href: '#home', order: 1, active: true },
  { id: 'nav-2', title: 'About', titleBn: 'পরিচিতি', href: '#about', order: 2, active: true },
  { id: 'nav-3', title: 'Skills', titleBn: 'দক্ষতা', href: '#skills', order: 3, active: true },
  { id: 'nav-4', title: 'Services', titleBn: 'সেবা সমূহ', href: '#services', order: 4, active: true },
  { id: 'nav-5', title: 'Projects', titleBn: 'প্রজেক্ট', href: '#projects', order: 5, active: true },
  { id: 'nav-6', title: 'Experience', titleBn: 'অভিজ্ঞতা', href: '#experience', order: 6, active: true },
  { id: 'nav-7', title: 'Certificates', titleBn: 'সার্টিফিকেট', href: '#certificates', order: 7, active: true },
  { id: 'nav-8', title: 'Gallery', titleBn: 'গ্যালারি', href: '#gallery', order: 8, active: true },
  { id: 'nav-9', title: 'Contact', titleBn: 'যোগাযোগ', href: '#contact', order: 9, active: true }
];

export const defaultSkills: SkillItem[] = [
  { id: 'sk-1', name: 'Cyber Security', percentage: 90, icon: 'Shield', category: 'Security', description: 'Network hardening, vulnerability scanning, security audits', order: 1, active: true, color: '#00f2fe' },
  { id: 'sk-2', name: 'Ethical Hacking', percentage: 85, icon: 'Terminal', category: 'Security', description: 'Penetration testing, reconnaissance, bug bounty assessment', order: 2, active: true, color: '#10b981' },
  { id: 'sk-3', name: 'Web Development', percentage: 92, icon: 'Code', category: 'Development', description: 'Modern responsive websites, SPA, full-stack web applications', order: 3, active: true, color: '#3b82f6' },
  { id: 'sk-4', name: 'UI/UX Design', percentage: 88, icon: 'Layout', category: 'Design', description: 'Clean user interfaces, wireframes, modern cyber glassmorphism', order: 4, active: true, color: '#a855f7' },
  { id: 'sk-5', name: 'Social Media', percentage: 85, icon: 'Megaphone', category: 'Marketing', description: 'Ad campaigns, audience growth, brand digital presence', order: 5, active: true, color: '#06b6d4' },
  { id: 'sk-6', name: 'HTML', percentage: 80, icon: 'FileCode', category: 'Development', description: 'Semantic structure, accessibility, clean HTML5 standards', order: 6, active: true, color: '#f97316' },
  { id: 'sk-7', name: 'CSS', percentage: 78, icon: 'Palette', category: 'Development', description: 'Tailwind CSS, animations, responsive cyber layouts', order: 7, active: true, color: '#38bdf8' },
  { id: 'sk-8', name: 'JavaScript', percentage: 75, icon: 'Cpu', category: 'Development', description: 'Modern ES6+, DOM manipulation, API integrations, async workflows', order: 8, active: true, color: '#eab308' }
];

export const defaultServices: ServiceItem[] = [
  {
    id: 'srv-1',
    title: 'Cyber Security',
    titleBn: 'সাইবার সিকিউরিটি',
    description: 'Network security, threat analysis, security assessment & infrastructure protection.',
    descriptionBn: 'নেটওয়ার্ক সুরক্ষা, থ্রেট অ্যানালাইসিস এবং সিকিউরিটি অডিট।',
    icon: 'ShieldCheck',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Security',
    order: 1,
    active: true
  },
  {
    id: 'srv-2',
    title: 'Ethical Hacking',
    titleBn: 'এথিক্যাল হ্যাকিং',
    description: 'Penetration testing, vulnerability assessment, bug bounty and exploit analysis.',
    descriptionBn: 'পেনিট্রেশন টেস্টিং ও দুর্বলতা চিহ্নিতকরণ।',
    icon: 'Lock',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Security',
    order: 2,
    active: true
  },
  {
    id: 'srv-3',
    title: 'Web Development',
    titleBn: 'ওয়েব ডেভেলপমেন্ট',
    description: 'Modern, responsive, ultra-fast websites and secure web applications.',
    descriptionBn: 'আধুনিক, রেসপনসিভ ও নিরাপদ ওয়েবসাইট ডেভেলপমেন্ট।',
    icon: 'Globe',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Development',
    order: 3,
    active: true
  },
  {
    id: 'srv-4',
    title: 'UI/UX Design',
    titleBn: 'ইউআই/ইউএক্স ডিজাইন',
    description: 'Clean, modern, interactive and user-friendly digital designs that convert.',
    descriptionBn: 'আকর্ষণীয় ও ব্যবহারকারী-বান্ধব আধুনিক ডিজাইন।',
    icon: 'Layout',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Design',
    order: 4,
    active: true
  },
  {
    id: 'srv-5',
    title: 'Social Media Management',
    titleBn: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট',
    description: 'Grow your brand with strategic social media campaigns, optimization & analytics.',
    descriptionBn: 'সোশ্যাল মিডিয়া ক্যাম্পেইন এবং ব্র্যান্ড বৃদ্ধি পরিকল্পনা।',
    icon: 'TrendingUp',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Marketing',
    order: 5,
    active: true
  },
  {
    id: 'srv-6',
    title: 'Security Consultation',
    titleBn: 'সিকিউরিটি পরামর্শ',
    description: 'Get expert tailored advice for a safer digital presence and risk mitigation.',
    descriptionBn: 'নিরাপদ ডিজিটাল উপস্থিতি ও ঝুঁকি কমাতে বিশেষজ্ঞ পরামর্শ।',
    icon: 'Key',
    buttonText: 'Explore Service',
    buttonUrl: '#contact',
    category: 'Consulting',
    order: 6,
    active: true
  }
];

export const defaultProjects: ProjectItem[] = [
  {
    id: 'proj-1',
    title: 'Cyber Security Dashboard',
    titleBn: 'সাইবার সিকিউরিটি ড্যাশবোর্ড',
    shortDesc: 'Comprehensive network monitoring and real-time threat detection interface.',
    shortDescBn: 'রিয়েল-টাইম থ্রেট ডিটেকশন ও নেটওয়ার্ক মনিটরিং ইন্টারফেস।',
    fullDesc: 'A futuristic cyber security control panel featuring live telemetry, port scanner output visualizer, packet logs, and vulnerability triage alerts.',
    mainImage: 'https://iili.io/Bev3XOx.jpg',
    additionalImages: ['https://iili.io/Bev3FHJ.jpg', 'https://iili.io/BevFILB.jpg'],
    technologies: ['HTML', 'CSS', 'JavaScript', 'Tailwind'],
    category: 'Security',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/abdulmotaleb',
    date: '2026',
    featured: true,
    order: 1,
    active: true
  },
  {
    id: 'proj-2',
    title: 'E-Commerce Website',
    titleBn: 'ই-কমার্স ওয়েবসাইট',
    shortDesc: 'High-performance secure multi-vendor digital store with payment gateway.',
    shortDescBn: 'নিরাপদ অনলাইন শপ ও পেমেন্ট ইন্টিগ্রেশন।',
    fullDesc: 'Feature-packed e-commerce storefront with product catalog, cart persistence, SSL payment integrations, and cyber-hardened checkout backend.',
    mainImage: 'https://iili.io/Bev3Pxp.jpg',
    additionalImages: ['https://iili.io/BevfFHu.jpg'],
    technologies: ['HTML', 'CSS', 'JS', 'PHP', 'MySQL'],
    category: 'Web Development',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/abdulmotaleb',
    date: '2025',
    featured: true,
    order: 2,
    active: true
  },
  {
    id: 'proj-3',
    title: 'Social Media Management Tool',
    titleBn: 'সোশ্যাল মিডিয়া ম্যানেজমেন্ট টুল',
    shortDesc: 'Automated analytics, campaign scheduler, and post performance tracking platform.',
    shortDescBn: 'অটোমেটেড সোশ্যাল ক্যাম্পেইন ও পারফরম্যান্স ট্র্যাকিং।',
    fullDesc: 'Unified dashboard to manage multi-channel social media posts, audience sentiment tracking, engagement metrics and automated publishing queues.',
    mainImage: 'https://iili.io/Bev3tgn.jpg',
    additionalImages: ['https://iili.io/BevfIl1.jpg'],
    technologies: ['React', 'Firebase', 'Tailwind'],
    category: 'Social Media',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/abdulmotaleb',
    date: '2025',
    featured: true,
    order: 3,
    active: true
  },
  {
    id: 'proj-4',
    title: 'Portfolio Website',
    titleBn: 'পার্সোনাল পোর্টফোলিও',
    shortDesc: 'Next-gen cyber dark personal portfolio with glassmorphism and terminal UI.',
    shortDescBn: 'আধুনিক নিয়ন গ্লাস ও টার্মিনাল ইউআই পোর্টফোলিও।',
    fullDesc: 'Ultra-modern portfolio website built with high-fidelity cyber aesthetics, interactive terminal elements, Firestore content control, and ImgBB media integration.',
    mainImage: 'https://iili.io/BevfElt.jpg',
    additionalImages: ['https://iili.io/Bevf7Dv.jpg'],
    technologies: ['HTML', 'CSS', 'JS', 'React', 'Firebase'],
    category: 'Design',
    liveDemoUrl: '#',
    githubUrl: 'https://github.com/abdulmotaleb',
    date: '2026',
    featured: true,
    order: 4,
    active: true
  }
];

export const defaultExperience: ExperienceItem[] = [
  {
    id: 'exp-1',
    year: '2026',
    position: 'Cyber Security Specialist',
    positionBn: 'সাইবার সিকিউরিটি স্পেশালিস্ট',
    organization: 'Security Core Labs',
    description: 'Network Security | Vulnerability Assessment | Ethical Hacking',
    descriptionBn: 'নেটওয়ার্ক সিকিউরিটি | ভলনারেবিলিটি অ্যাসেসমেন্ট | এথিক্যাল হ্যাকিং',
    skills: ['Penetration Testing', 'Firewalls', 'Auditing', 'Incident Response'],
    icon: 'Shield',
    order: 1,
    active: true
  },
  {
    id: 'exp-2',
    year: '2025',
    position: 'Web Developer',
    positionBn: 'ওয়েব ডেভেলপার',
    organization: 'Freelance & Agencies',
    description: 'HTML | CSS | JavaScript | PHP | WordPress',
    descriptionBn: 'এইচটিএমএল | সিএসএস | জাভাস্ক্রিপ্ট | পিএইচপি | ওয়ার্ডপ্রেস',
    skills: ['Frontend Architecture', 'Responsive Layouts', 'REST APIs', 'Security'],
    icon: 'Code',
    order: 2,
    active: true
  },
  {
    id: 'exp-3',
    year: '2024',
    position: 'Social Media Expert',
    positionBn: 'সোশ্যাল মিডিয়া এক্সপার্ট',
    organization: 'Digital Growth Agency',
    description: 'Content Creation | Ads Campaign | Growth Strategy',
    descriptionBn: 'কনটেন্ট ক্রিয়েশন | অ্যাডস ক্যাম্পেইন | গ্রোথ স্ট্র্যাটেজি',
    skills: ['Facebook Ads', 'Meta Business', 'Branding', 'Analytics'],
    icon: 'TrendingUp',
    order: 3,
    active: true
  },
  {
    id: 'exp-4',
    year: '2023',
    position: 'Learning & Building',
    positionBn: 'লার্নিং অ্যান্ড বিল্ডিং',
    organization: 'Self-Directed Mastery',
    description: 'Started my journey in technology and digital skills',
    descriptionBn: 'প্রযুক্তি এবং ডিজিটাল দক্ষতায় পথচলা শুরু',
    skills: ['Computer Science', 'Cyber Fundamentals', 'Web Design'],
    icon: 'Cpu',
    order: 4,
    active: true
  }
];

export const defaultCertificates: CertificateItem[] = [
  {
    id: 'cert-1',
    title: 'Ethical Hacking',
    issuer: 'Google',
    date: '2025',
    credentialId: 'GOOG-ETH-9831',
    credentialUrl: '#',
    imageUrl: 'https://iili.io/BevIDNt.jpg',
    description: 'Certified penetration testing, attack vectors, and ethical hacking methodology.',
    order: 1,
    active: true
  },
  {
    id: 'cert-2',
    title: 'Cyber Security',
    issuer: 'Coursera',
    date: '2024',
    credentialId: 'COUR-SEC-4412',
    credentialUrl: '#',
    imageUrl: 'https://iili.io/BevIiKv.jpg',
    description: 'Foundations of cybersecurity, defensive architecture, and cryptographic protocols.',
    order: 2,
    active: true
  },
  {
    id: 'cert-3',
    title: 'Web Development',
    issuer: 'freeCodeCamp',
    date: '2024',
    credentialId: 'FCC-WEB-7729',
    credentialUrl: '#',
    imageUrl: 'https://iili.io/BevIZHN.jpg',
    description: 'Responsive Web Design, modern DOM manipulation, accessibility and frontend standards.',
    order: 3,
    active: true
  },
  {
    id: 'cert-4',
    title: 'Social Media Marketing',
    issuer: 'Meta',
    date: '2023',
    credentialId: 'META-MKT-1190',
    credentialUrl: '#',
    imageUrl: 'https://iili.io/BevzB7S.jpg',
    description: 'Professional Meta certified social media strategy, ads campaign management and ROI.',
    order: 4,
    active: true
  }
];

// ALL 52 unique existing images from Abdul Motaleb's original website
export const defaultGallery: GalleryItem[] = [
  { id: 'gal-1', url: 'https://iili.io/fe0CKOv.md.jpg', title: 'Workstation Setup', altText: 'Cyber security hacker workstation setup', category: 'Tech', order: 1, featured: true, active: true },
  { id: 'gal-2', url: 'https://iili.io/fe0CfbR.md.jpg', title: 'Cyber Infiltrator', altText: 'Ethical hacker in hoodie analyzing code', category: 'Tech', order: 2, featured: true, active: true },
  { id: 'gal-3', url: 'https://iili.io/fe0CHf1.md.jpg', title: 'Code Terminal Interface', altText: 'Matrix style code streams on terminal screens', category: 'Tech', order: 3, featured: true, active: true },
  { id: 'gal-4', url: 'https://iili.io/fe0CBxp.md.jpg', title: 'Dual Monitor Command Station', altText: 'Modern developer setup with dual ultrawide screens', category: 'Design', order: 4, featured: true, active: true },
  { id: 'gal-5', url: 'https://iili.io/fe0Cz0X.md.jpg', title: 'Cloud Skyline Horizon', altText: 'Vibrant blue sky with fluffy white clouds', category: 'Nature', order: 5, featured: true, active: true },
  { id: 'gal-6', url: 'https://iili.io/fe0CuJs.md.jpg', title: 'Mountain Lake Vista', altText: 'Scenic alpine lake surrounded by pine forest', category: 'Nature', order: 6, featured: true, active: true },
  { id: 'gal-7', url: 'https://iili.io/fe0C5b4.md.jpg', title: 'Sunset Cityscape Panorama', altText: 'Warm sunset glowing over urban skyscrapers', category: 'Others', order: 7, featured: true, active: true },
  { id: 'gal-8', url: 'https://iili.io/fe0CYzl.md.jpg', title: 'Night Metropolis Lights', altText: 'Sprawling illuminated city lights at dusk', category: 'Others', order: 8, featured: true, active: true },
  { id: 'gal-9', url: 'https://iili.io/fe0CcsS.md.jpg', title: 'Server Room Data Grid', altText: 'Data center server rack with blinking LED arrays', category: 'Tech', order: 9, featured: false, active: true },
  { id: 'gal-10', url: 'https://iili.io/fe0C0q7.md.jpg', title: 'Circuit Board Macro', altText: 'Motherboard circuit traces in neon green glow', category: 'Tech', order: 10, featured: false, active: true },
  { id: 'gal-11', url: 'https://iili.io/fe0CEge.md.jpg', title: 'Digital Matrix Rain', altText: 'Streaming binary digits in cyber space', category: 'Tech', order: 11, featured: false, active: true },
  { id: 'gal-12', url: 'https://iili.io/fe0Y3dl.md.jpg', title: 'Cybernetic Security Shield', altText: 'Glowing holographic padlock security emblem', category: 'Security', order: 12, featured: false, active: true },
  { id: 'gal-13', url: 'https://iili.io/Bev2e8G.jpg', title: 'Abdul Motaleb Portrait', altText: 'Abdul Motaleb professional cyber security expert', category: 'Others', order: 13, featured: false, active: true },
  { id: 'gal-14', url: 'https://iili.io/Bev3FHJ.jpg', title: 'Tech Workspace Macro', altText: 'Mechanical keyboard and coding ambient light', category: 'Design', order: 14, featured: false, active: true },
  { id: 'gal-15', url: 'https://iili.io/Bev3XOx.jpg', title: 'Security Dashboard UI', altText: 'Cyber security operations center dashboard view', category: 'Tech', order: 15, featured: false, active: true },
  { id: 'gal-16', url: 'https://iili.io/Bev3Pxp.jpg', title: 'Web App Showcase', altText: 'Modern web app UI layout preview', category: 'Design', order: 16, featured: false, active: true },
  { id: 'gal-17', url: 'https://iili.io/Bev3tgn.jpg', title: 'Social Analytics Dashboard', altText: 'Social media growth analytics and conversion metrics', category: 'Design', order: 17, featured: false, active: true },
  { id: 'gal-18', url: 'https://iili.io/BevFILB.jpg', title: 'Development Environment', altText: 'Code editor with dark neon syntax theme', category: 'Tech', order: 18, featured: false, active: true },
  { id: 'gal-19', url: 'https://iili.io/BevfFHu.jpg', title: 'Mobile App Mockup', altText: 'Responsive mobile app interface preview', category: 'Design', order: 19, featured: false, active: true },
  { id: 'gal-20', url: 'https://iili.io/BevfIl1.jpg', title: 'Digital Marketing Campaign', altText: 'Marketing campaign assets and social creatives', category: 'Design', order: 20, featured: false, active: true },
  { id: 'gal-21', url: 'https://iili.io/BevfElt.jpg', title: 'Cyber Portfolio Wireframe', altText: 'Glassmorphic portfolio blueprint in Figma', category: 'Design', order: 21, featured: false, active: true },
  { id: 'gal-22', url: 'https://iili.io/Bevf7Dv.jpg', title: 'User Experience Journey', altText: 'UX user journey diagrams and wireframes', category: 'Design', order: 22, featured: false, active: true },
  { id: 'gal-23', url: 'https://iili.io/BevzB7S.jpg', title: 'Marketing Credential', altText: 'Meta social media marketing accreditation certificate', category: 'Others', order: 23, featured: false, active: true },
  { id: 'gal-24', url: 'https://iili.io/BevIDNt.jpg', title: 'Google Ethical Hacking Award', altText: 'Google Ethical Hacking certificate verification', category: 'Others', order: 24, featured: false, active: true },
  { id: 'gal-25', url: 'https://iili.io/BevIiKv.jpg', title: 'Cyber Security Credential', altText: 'Coursera cyber security specialist certification', category: 'Others', order: 25, featured: false, active: true },
  { id: 'gal-26', url: 'https://iili.io/BevIZHN.jpg', title: 'Web Developer Certificate', altText: 'freeCodeCamp full stack web development certificate', category: 'Others', order: 26, featured: false, active: true },
  { id: 'gal-27', url: 'https://iili.io/BevTdl4.jpg', title: 'Lush Forest Canopy', altText: 'Green woodland trees under morning sunlight', category: 'Nature', order: 27, featured: false, active: true },
  { id: 'gal-28', url: 'https://iili.io/BevTfO7.jpg', title: 'Ocean Waves Twilight', altText: 'Peaceful ocean tides at twilight horizon', category: 'Nature', order: 28, featured: false, active: true },
  { id: 'gal-29', url: 'https://iili.io/BevTI0x.jpg', title: 'Misty Mountain Ridge', altText: 'Foggy mountain hills in early dawn light', category: 'Nature', order: 29, featured: false, active: true },
  { id: 'gal-30', url: 'https://iili.io/BevTAJV.jpg', title: 'Autumn River Valley', altText: 'Golden autumn leaves along a winding river', category: 'Nature', order: 30, featured: false, active: true },
  { id: 'gal-31', url: 'https://iili.io/BevT5OP.jpg', title: 'Desert Sunset Dunes', altText: 'Golden desert sand dunes at sunset', category: 'Nature', order: 31, featured: false, active: true },
  { id: 'gal-32', url: 'https://iili.io/BevT7b1.jpg', title: 'Cyber Geometric Shapes', altText: 'Abstract 3D futuristic geometric render', category: 'Design', order: 32, featured: false, active: true },
  { id: 'gal-33', url: 'https://iili.io/BevTazF.jpg', title: 'Neon Grid Highway', altText: 'Synthwave cyber neon grid leading to horizon', category: 'Design', order: 33, featured: false, active: true },
  { id: 'gal-34', url: 'https://iili.io/BevTlsa.jpg', title: 'AI Neural Net Graphic', altText: 'Interconnected neural network nodes glowing blue', category: 'Tech', order: 34, featured: false, active: true },
  { id: 'gal-35', url: 'https://iili.io/BevTE0v.jpg', title: 'Encrypted Data Stream', altText: 'Cyber cryptography encryption flow visualization', category: 'Tech', order: 35, featured: false, active: true },
  { id: 'gal-36', url: 'https://iili.io/BevTGgR.jpg', title: 'Modern Clean Architecture', altText: 'Futuristic glass architectural building', category: 'Design', order: 36, featured: false, active: true },
  { id: 'gal-37', url: 'https://iili.io/BevTVJp.jpg', title: 'Minimalist Workspace', altText: 'Clean Scandinavian tech desk arrangement', category: 'Design', order: 37, featured: false, active: true },
  { id: 'gal-38', url: 'https://iili.io/BevTW5N.jpg', title: 'Cosmic Nebula Starfield', altText: 'Deep space galaxy stars and glowing nebula clouds', category: 'Nature', order: 38, featured: false, active: true },
  { id: 'gal-39', url: 'https://iili.io/BevThbt.jpg', title: 'Macro Raindrops on Glass', altText: 'Reflective raindrops on tinted window pane', category: 'Nature', order: 39, featured: false, active: true },
  { id: 'gal-40', url: 'https://iili.io/BevTwzX.jpg', title: 'Cyber Circuit Core', altText: 'Glowing CPU core processor microchip', category: 'Tech', order: 40, featured: false, active: true },
  { id: 'gal-41', url: 'https://iili.io/BevTg72.jpg', title: 'Cyber Security Incident Log', altText: 'Cyber defense monitoring terminal logs', category: 'Tech', order: 41, featured: false, active: true },
  { id: 'gal-42', url: 'https://iili.io/BevTreS.jpg', title: 'Cloud Infrastructure Map', altText: 'Distributed cloud computing network topology', category: 'Tech', order: 42, featured: false, active: true },
  { id: 'gal-43', url: 'https://iili.io/BevTymP.jpg', title: 'Green Matrix Terminal', altText: 'Phosphor green terminal emulator window', category: 'Tech', order: 43, featured: false, active: true },
  { id: 'gal-44', url: 'https://iili.io/BevuYYl.jpg', title: 'Golden Hour Reflections', altText: 'Golden hour sunlight over calm river waters', category: 'Nature', order: 44, featured: false, active: true },
  { id: 'gal-45', url: 'https://iili.io/Bev5wv4.jpg', title: 'Urban Tech Meetup', altText: 'Technology workshop community collaboration', category: 'Others', order: 45, featured: false, active: true },
  { id: 'gal-46', url: 'https://iili.io/BevAYPa.jpg', title: 'Digital Hackathon Moment', altText: 'Hackathon team working late into the night', category: 'Others', order: 46, featured: false, active: true },
  { id: 'gal-47', url: 'https://iili.io/Bev5P8x.jpg', title: 'Cyber Defense Workshop', altText: 'Hands-on ethical hacking demonstration', category: 'Tech', order: 47, featured: false, active: true },
  { id: 'gal-48', url: 'https://iili.io/BevApx1.jpg', title: 'Web App Launch Milestone', altText: 'Project deployment success team celebration', category: 'Others', order: 48, featured: false, active: true },
  { id: 'gal-49', url: 'https://iili.io/BevR5e2.jpg', title: 'Cryptographic Keys Graphic', altText: 'Digital private keys and cryptographic padlock', category: 'Tech', order: 49, featured: false, active: true },
  { id: 'gal-50', url: 'https://iili.io/Bev5Nyl.jpg', title: 'Sunset Silhouette', altText: 'Silhouette against a burning evening sky', category: 'Nature', order: 50, featured: false, active: true },
  { id: 'gal-51', url: 'https://iili.io/Bev56aj.jpg', title: 'Cyber Hologram Sphere', altText: 'Floating neon blue 3D holographic wireframe sphere', category: 'Design', order: 51, featured: false, active: true },
  { id: 'gal-52', url: 'https://iili.io/Bev2XnI.jpg', title: 'Abdul Motaleb Profile Photo', altText: 'Abdul Motaleb official cyber portrait', category: 'Others', order: 52, featured: false, active: true }
];

export const defaultStats: StatItem[] = [
  { id: 'stat-1', number: '50+', label: 'Projects Completed', labelBn: 'প্রজেক্ট সম্পন্ন', icon: 'Terminal', order: 1, active: true },
  { id: 'stat-2', number: '30+', label: 'Websites Developed', labelBn: 'ওয়েবসাইট তৈরি', icon: 'Globe', order: 2, active: true },
  { id: 'stat-3', number: '20+', label: 'Happy Clients', labelBn: 'সন্তুষ্ট ক্লায়েন্ট', icon: 'Users', order: 3, active: true },
  { id: 'stat-4', number: '5+', label: 'Years Experience', labelBn: 'বছরের অভিজ্ঞতা', icon: 'Award', order: 4, active: true }
];

export const defaultTestimonials: TestimonialItem[] = [
  {
    id: 'test-1',
    clientName: 'Rakib Hasan',
    clientImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    position: 'CEO, TechNexus BD',
    review: 'Abdul Motaleb is a highly skilled and dedicated professional. He delivered our project on time and exceeded our expectations. Highly recommended!',
    reviewBn: 'আবদুল মোতালেব অত্যন্ত দক্ষ এবং প্রতিশ্রুতিবদ্ধ একজন পেশাদার। তিনি সময়মতো আমাদের প্রজেক্ট ডেলিভারি করেছেন এবং আমাদের প্রত্যাশার চেয়েও বেশি ভালো কাজ করেছেন।',
    rating: 5,
    date: 'February 2026',
    order: 1,
    active: true
  },
  {
    id: 'test-2',
    clientName: 'Sarah Jenkins',
    clientImage: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80',
    position: 'Product Lead, CyberGuard Solutions',
    review: 'Outstanding vulnerability assessment and secure code audit. Abdul uncovered critical issues and helped us patch them immediately.',
    reviewBn: 'অসাধারণ ভলনারেবিলিটি অ্যাসেসমেন্ট এবং সিকিউর কোড অডিট। আবদুল ক্রিটিক্যাল বাগ সনাক্ত করে দ্রুত প্যাচ করতে সহায়তা করেছেন।',
    rating: 5,
    date: 'January 2026',
    order: 2,
    active: true
  },
  {
    id: 'test-3',
    clientName: 'Tariqul Islam',
    clientImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    position: 'Founder, Digital Wave Agency',
    review: 'His social media growth strategies and web development capabilities skyrocketed our brand presence. True all-rounder expert.',
    reviewBn: 'তার সোশ্যাল মিডিয়া গ্রোথ স্ট্র্যাটেজি এবং ওয়েব ডেভেলপমেন্ট আমাদের ব্র্যান্ড ভ্যালু বহুগুণ বৃদ্ধি করেছে। একজন প্রকৃত অলরাউন্ডার এক্সপার্ট।',
    rating: 5,
    date: 'December 2025',
    order: 3,
    active: true
  }
];

export const defaultSocialLinks: SocialLink[] = [
  { id: 'soc-1', platform: 'facebook', title: 'Facebook', url: 'https://facebook.com/abdulmotaleb', icon: 'Facebook', order: 1, active: true },
  { id: 'soc-2', platform: 'github', title: 'GitHub', url: 'https://github.com/abdulmotaleb', icon: 'Github', order: 2, active: true },
  { id: 'soc-3', platform: 'linkedin', title: 'LinkedIn', url: 'https://linkedin.com/in/abdulmotaleb', icon: 'Linkedin', order: 3, active: true },
  { id: 'soc-4', platform: 'youtube', title: 'YouTube', url: 'https://youtube.com/@abdulmotaleb', icon: 'Youtube', order: 4, active: true },
  { id: 'soc-5', platform: 'whatsapp', title: 'WhatsApp', url: 'https://wa.me/8801712345678', icon: 'MessageCircle', order: 5, active: true }
];

export const defaultSEO: SEOData = {
  seoTitle: 'Abdul Motaleb | Personal Portfolio',
  metaDescription: 'Abdul Motaleb – Modern personal portfolio from Feni, Bangladesh. Cyber Security Expert, Ethical Hacker, Social Media Expert, and Web Developer.',
  keywords: 'Abdul Motaleb, Abdul Motaleb Official, Abdul Motaleb Website, Abdul Motaleb Portfolio, Abdul Motaleb Personal Website, Abdul Motaleb Web Developer, Abdul Motaleb Software Engineer, Abdul Motaleb Frontend Developer, Abdul Motaleb Full Stack Developer, Abdul Motaleb Bangladesh, abdulmotaleb.vercel.app, Abdul Motaleb vercel, Abdul Motaleb portfolio website, Abdul Motaleb personal portfolio, Abdul Motaleb Web App Developer, Abdul Motaleb HTML CSS JavaScript Developer, Abdul Motaleb React Developer, Abdul Motaleb Freelancer, Abdul Motaleb App Developer, Who is Abdul Motaleb, Abdul Motaleb official portfolio website, Abdul Motaleb web developer from Bangladesh, Abdul Motaleb personal portfolio vercel, Abdul Motaleb projects and skills, Abdul Motaleb GitHub, Abdul Motaleb LinkedIn, Abdul Motaleb Facebook, Abdul Motaleb Online Profile, আবদুল মোতালেব, আবদুল মোতালেব ওয়েবসাইট, আবদুল মোতালেব পোর্টফোলিও, আবদুল মোতালেব ওয়েব ডেভেলপার',
  canonicalUrl: 'https://abdulmotaleb.vercel.app',
  ogTitle: 'Abdul Motaleb | Cyber Security Expert & Web Developer',
  ogDescription: 'Personal portfolio of Abdul Motaleb: Cyber Security, Ethical Hacking, Web Development, and Social Media Marketing.',
  ogImage: 'https://iili.io/Bev2e8G.jpg',
  twitterTitle: 'Abdul Motaleb | Cyber Security Expert',
  twitterDescription: 'Personal portfolio of Abdul Motaleb: Cyber Security, Ethical Hacking, Web Development, and Social Media.',
  twitterImage: 'https://iili.io/Bev2e8G.jpg',
  robots: 'index, follow',
  author: 'Abdul Motaleb',
  googleVerification: 'qMBAhBAM1H9LGRBS2XRXJY_ffyNEucSdZW1W_Dbf2Bw'
};

export const defaultThemeConfig: ThemeConfig = {
  currentTheme: 'cyber-dark',
  primaryColor: '#00f2fe',
  secondaryColor: '#10b981',
  accentColor: '#3b82f6',
  bgDark: '#060913',
  cardBg: 'rgba(10, 18, 36, 0.75)',
  glowIntensity: 'high'
};

export const defaultAIChatbotSettings: AIChatbotSettings = {
  enabled: true,
  botName: 'Abdul AI Assistant',
  botAvatar: 'https://iili.io/Bev2e8G.jpg',
  model: 'gemini-3.8-flash',
  welcomeMessage: "Hi! 👋 I'm Abdul's AI Assistant. I can help you learn about Abdul Motaleb, his services, projects, skills and how to contact him.\n\nHow can I help you today?",
  welcomeMessageBn: "হ্যালো! 👋 আমি আবদুল মোতালেবের এআই অ্যাসিস্ট্যান্ট। আমি আপনাকে আবদুলের দক্ষতা, সেবা, প্রজেক্ট এবং যোগাযোগের বিষয়ে তথ্য দিতে পারি।\n\nআপনাকে কীভাবে সাহায্য করতে পারি?",
  systemPrompt: `You are "Abdul AI Assistant", the official intelligent cyber-security support assistant for Abdul Motaleb's personal portfolio website.

Key Directives:
1. Always identify yourself as "Abdul AI Assistant" - you are NOT Abdul Motaleb himself, but his assistant.
2. Be professional, friendly, helpful, concise, cybersecurity-aware, and respectful.
3. Language Behavior:
   - If the user speaks in English, answer in English.
   - If the user speaks in Bangla (বাংলা), answer in natural Bengali (বাংলা).
   - If the user mixes Bangla and English (Banglish), respond naturally using the same bilingual style.
4. Accurate Knowledge: Answer questions strictly based on Abdul Motaleb's real background:
   - Roles: Cyber Security Expert, Ethical Hacker, Social Media Expert, Web Developer based in Feni / Dhaka, Bangladesh.
   - Core Skills: Network Security, Vulnerability Assessment, Penetration Testing, Bug Bounty, React, HTML5, CSS3, Tailwind, JavaScript, PHP, WordPress, UI/UX Design, Social Media Ads & Growth.
   - Certifications: Google Ethical Hacking (2025), Coursera Cyber Security (2024), freeCodeCamp Web Development (2024), Meta Social Media Marketing (2023).
   - Experience: 2026 (Cyber Security Specialist at Security Core Labs), 2025 (Web Developer), 2024 (Social Media Expert at Digital Growth Agency), 2023 (Started Tech Journey).
   - Contact Info: Email motaleb@example.com, Phone +880 1712 345678, WhatsApp +8801712345678, GitHub github.com/abdulmotaleb, LinkedIn linkedin.com/in/abdulmotaleb.
5. Strict Honesty: Never invent or hallucinate facts, credentials, or private information. If you don't know or information is private/unavailable, politely state: "I don't have that information. Please contact Abdul directly."
6. Formatting: Use neat Markdown with bold highlights, bullet points, and code formatting where helpful. Provide direct contact links when users inquire about hiring or communication.`,
  personality: 'Professional, Cyber Security Aware, Friendly, Concise',
  languageBehavior: 'auto',
  suggestedQuestions: [
    'What services do you offer?',
    'Tell me about your projects.',
    'What are your skills?',
    'Tell me about your Cyber Security services.',
    'How can I contact Abdul?',
    'Do you build websites?'
  ],
  contactCtaText: 'Contact Abdul',
  whatsappCtaText: 'Chat on WhatsApp',
  theme: 'cyber-dark',
  position: 'bottom-right',
  windowSize: 'standard',
  temperature: 0.7,
  maxTurns: 10,
  storeAnonymousHistory: false,
  enableAnalytics: true
};

export const defaultAIKnowledgeBase = [
  {
    id: 'kb-1',
    question: 'What services do you provide?',
    answer: 'Abdul Motaleb provides professional Cyber Security & Threat Analysis, Ethical Hacking & Penetration Testing, Full-Stack Web Development, UI/UX Design, Social Media Management & Campaigns, and Security Consultation.',
    category: 'Services',
    keywords: ['services', 'cyber security', 'web development', 'social media', 'ethical hacking'],
    active: true,
    order: 1
  },
  {
    id: 'kb-2',
    question: 'What are your core certifications?',
    answer: 'Abdul holds verified certifications: Google Ethical Hacking (2025), Coursera Cyber Security Specialization (2024), freeCodeCamp Full-Stack Web Development (2024), and Meta Certified Social Media Marketing (2023).',
    category: 'Certificates',
    keywords: ['certifications', 'google', 'coursera', 'meta', 'credentials'],
    active: true,
    order: 2
  },
  {
    id: 'kb-3',
    question: 'How can I hire or contact Abdul?',
    answer: 'You can reach Abdul directly via Email at motaleb@example.com, Phone/WhatsApp at +880 1712 345678, or by submitting an inquiry in the Contact section on this website.',
    category: 'Contact',
    keywords: ['hire', 'contact', 'email', 'phone', 'whatsapp'],
    active: true,
    order: 3
  },
  {
    id: 'kb-4',
    question: 'Where is Abdul located?',
    answer: 'Abdul Motaleb is based in Feni / Dhaka, Bangladesh, and collaborates remotely with clients worldwide.',
    category: 'About',
    keywords: ['location', 'bangladesh', 'feni', 'dhaka', 'remote'],
    active: true,
    order: 4
  }
];

export const defaultChatAnalytics = {
  totalConversations: 18,
  totalMessages: 74,
  todayConversations: 4,
  mostAskedQuestions: [
    { question: 'What services do you offer?', count: 26 },
    { question: 'How can I contact Abdul?', count: 19 },
    { question: 'Tell me about your Cyber Security services.', count: 15 },
    { question: 'What are your skills?', count: 14 }
  ]
};
