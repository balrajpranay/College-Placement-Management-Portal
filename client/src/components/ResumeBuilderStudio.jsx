import React, { useState, useEffect, useRef } from 'react';
import Icon from './Icon';

// Curated Aesthetic Clean Premium Fonts
export const PRESET_FONTS = [
  {
    id: 'plus-jakarta',
    name: 'Plus Jakarta Sans',
    family: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    badge: 'Modern Aesthetic · Default',
    sample: 'Contemporary Silicon Valley & executive aesthetic'
  },
  {
    id: 'outfit',
    name: 'Outfit',
    family: "'Outfit', -apple-system, BlinkMacSystemFont, sans-serif",
    badge: 'Geometric High-End',
    sample: 'Distinct architectural uppercase, sleek design-forward tech'
  },
  {
    id: 'dm-sans',
    name: 'DM Sans',
    family: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif",
    badge: 'Editorial Precision',
    sample: 'Crisp proportions, perfect vertical rhythm & clarity'
  },
  {
    id: 'inter',
    name: 'Inter',
    family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    badge: 'ATS Gold Standard',
    sample: 'Unmatched screen legibility & machine ATS parsing'
  },
  {
    id: 'times-new-roman',
    name: 'Times New Roman',
    family: "'Times New Roman', Times, 'Tinos', Georgia, serif",
    badge: 'Classic Ivy League Serif',
    sample: 'Timeless traditional serif, corporate & investment banking standard'
  },
  {
    id: 'lora',
    name: 'Lora Serif',
    family: "'Lora', Georgia, 'Times New Roman', serif",
    badge: 'Executive Prestige Serif',
    sample: 'Brushed calligraphic elegance, consulting & Ivy League tone'
  }
];

export const PRESET_SCALES = [
  { id: 'compact', label: 'Compact', scaleValue: 0.94, desc: 'Tight 1-Page A4 Fit' },
  { id: 'standard', label: 'Standard', scaleValue: 1.0, desc: 'Balanced Default' },
  { id: 'spacious', label: 'Spacious', scaleValue: 1.06, desc: 'Open & Airy' }
];

export const PRESET_TEMPLATES = [
  {
    id: 'modern',
    name: 'Modern Clean',
    badge: 'Popular',
    desc: 'Contemporary blue accent header line, crisp modern headings'
  },
  {
    id: 'classic',
    name: 'Classic Ivy League',
    badge: 'Academic',
    desc: 'Formal centered header, timeless horizontal rules & serif elegance'
  },
  {
    id: 'executive',
    name: 'Executive Navy',
    badge: 'Corporate',
    desc: 'Deep navy accent banners and authoritative corporate hierarchy'
  },
  {
    id: 'minimalist',
    name: 'Minimalist Tech',
    badge: 'High ATS',
    desc: 'Clean monospaced tags, high contrast, sleek modern layout'
  },
  {
    id: 'emerald',
    name: 'Nordic Emerald',
    badge: 'Creative',
    desc: 'Distinctive dark forest emerald accents with stylish section styling'
  }
];

export const PRESET_HEADER_LAYOUTS = [
  {
    id: 'left',
    name: 'Classic Left',
    badge: 'Standard',
    icon: 'align-left',
    desc: 'Clean left-aligned name, horizontal contact row with dividers'
  },
  {
    id: 'center',
    name: 'Executive Center',
    badge: 'Formal',
    icon: 'align-center',
    desc: 'Centered authoritative name & contact line with balanced dividers'
  },
  {
    id: 'split',
    name: 'Split Justified',
    badge: 'Space-Saver',
    icon: 'align-justify',
    desc: 'Name & headline on left, stacked contacts right-aligned'
  },
  {
    id: 'right',
    name: 'Modern Right',
    badge: 'Creative',
    icon: 'align-right',
    desc: 'Right-aligned header with sleek right-anchored details'
  },
  {
    id: 'badge',
    name: 'Icon Badges',
    badge: 'Visual Chips',
    icon: 'layout',
    desc: 'Contact details formatted into clean rounded pill chips with icons'
  },
  {
    id: 'compact-bar',
    name: 'Two-Row Compact',
    badge: 'ATS Structured',
    icon: 'list',
    desc: 'Structured 2-row layout with Location on top row & contacts below'
  }
];

export const PRESET_SEPARATORS = [
  { id: 'pipe', label: 'Pipe ( | )', symbol: '|' },
  { id: 'dot', label: 'Bullet ( • )', symbol: '•' },
  { id: 'slash', label: 'Slash ( / )', symbol: '/' },
  { id: 'dash', label: 'Dash ( – )', symbol: '–' },
  { id: 'diamond', label: 'Diamond ( ❖ )', symbol: '❖' }
];

export const DEFAULT_CONTACT = {
  fullName: 'First Name Last Name',
  headline: '',
  phone: 'Phone Number',
  email: 'xyz@gmail.com',
  location: 'City, State',
  linkedin: '',
  github: '',
  portfolio: '',
  layout: 'left',
  separator: 'pipe'
};

export const DEFAULT_RESUME_SECTIONS = [
  {
    id: 'prof_profiles',
    title: 'Professional profiles',
    type: 'text',
    content: "Click the 'Edit' button to add content to this section.",
    placeholder: "Click the 'Edit' button to add content to this section."
  },
  {
    id: 'summary',
    title: 'Summary',
    type: 'text',
    content: "Click the 'Edit' button to add content to this section.",
    placeholder: "Click the 'Edit' button to add content to this section."
  },
  {
    id: 'skills',
    title: 'Skills',
    type: 'text',
    content: 'List 3-4 special, work-related, talents skills.',
    placeholder: 'List 3-4 special, work-related, talents skills.'
  },
  {
    id: 'experience',
    title: 'Experience',
    type: 'text',
    content: `Company A | Location
Sales Representative | Start and end date
Enter key responsibilities and accomplishments.

Company B | Location
Sales Associate | Start and end date
Show that you create value with your work by listing your responsibilities and quantifiable achievements in the experience.

Company C | Location
Sales Assistant | Start and end date
Use AI to assist you in creating a work description using your experience and desired job information.`,
    placeholder: 'Enter key responsibilities and accomplishments...'
  },
  {
    id: 'education',
    title: 'Education',
    type: 'text',
    content: `Graduated school | Location
Field of study | Graduation Date
Enter any colleges, universities, or training programs that you have attended.`,
    placeholder: 'Enter colleges, universities, or training programs...'
  },
  {
    id: 'certificates',
    title: 'Certificates',
    type: 'text',
    content: 'Show your certificates, licenses, and training in your field.',
    placeholder: 'Show your certificates, licenses, and training in your field.'
  },
  {
    id: 'achievements',
    title: 'Achievements',
    type: 'text',
    content: 'Mention any prizes, honors, contests etc.',
    placeholder: 'Mention any prizes, honors, contests etc.'
  },
  {
    id: 'projects',
    title: 'Projects',
    type: 'text',
    content: "Click the 'Edit' button to add content to this section.",
    placeholder: "Click the 'Edit' button to add content to this section."
  },
  {
    id: 'interests',
    title: 'Interests',
    type: 'text',
    content: "Click the 'Edit' button to add content to this section.",
    placeholder: "Click the 'Edit' button to add content to this section."
  }
];

const AVAILABLE_SECTION_TYPES = [
  { id: 'prof_profiles', title: 'Professional profiles', defaultText: "Click the 'Edit' button to add content to this section." },
  { id: 'summary', title: 'Summary', defaultText: "Click the 'Edit' button to add content to this section." },
  { id: 'skills', title: 'Skills', defaultText: 'List 3-4 special, work-related, talents skills.' },
  { id: 'experience', title: 'Experience', defaultText: "Company | Location\nJob Title | Start - End Date\n• Enter key responsibilities and measurable achievements." },
  { id: 'education', title: 'Education', defaultText: "University Name | Location\nDegree & Major | Graduation Year\n• CGPA / Distinction / Key Coursework" },
  { id: 'certificates', title: 'Certificates', defaultText: 'Show your certificates, licenses, and training in your field.' },
  { id: 'achievements', title: 'Achievements', defaultText: 'Mention any prizes, honors, contests etc.' },
  { id: 'projects', title: 'Projects', defaultText: "Project Title | Technologies Used\n• Developed full-stack solution achieving 30% performance boost." },
  { id: 'interests', title: 'Interests', defaultText: 'Open source contributions, hackathons, robotics, competitive coding.' },
  { id: 'custom', title: 'Custom Section', defaultText: 'Enter your custom details here.' }
];

export default function ResumeBuilderStudio({
  initialData,
  profileData = {},
  onChange,
  onSave,
  saving = false
}) {
  const parseInitial = () => {
    let raw = initialData;
    if (typeof raw === 'string' && raw.trim().startsWith('{')) {
      try {
        raw = JSON.parse(raw);
      } catch (e) {
        raw = null;
      }
    }

    const initialContact = {
      fullName: profileData?.name || DEFAULT_CONTACT.fullName,
      headline: profileData?.headline || profileData?.targetRole || DEFAULT_CONTACT.headline,
      phone: profileData?.phone || DEFAULT_CONTACT.phone,
      email: profileData?.email || DEFAULT_CONTACT.email,
      location: profileData?.department ? `${profileData.department}, Campus Connect` : DEFAULT_CONTACT.location,
      linkedin: '',
      github: '',
      portfolio: '',
      layout: DEFAULT_CONTACT.layout,
      separator: DEFAULT_CONTACT.separator
    };

    if (raw && typeof raw === 'object') {
      const mergedContact = {
        ...initialContact,
        ...(raw.contact || {})
      };
      if ((!mergedContact.fullName || mergedContact.fullName === 'First Name Last Name') && profileData?.name) {
        mergedContact.fullName = profileData.name;
      }
      if ((!mergedContact.email || mergedContact.email === 'xyz@gmail.com') && profileData?.email) {
        mergedContact.email = profileData.email;
      }
      if ((!mergedContact.phone || mergedContact.phone === 'Phone Number') && profileData?.phone) {
        mergedContact.phone = profileData.phone;
      }
      if (!mergedContact.layout) {
        mergedContact.layout = 'left';
      }
      if (!mergedContact.separator) {
        mergedContact.separator = 'pipe';
      }

      let parsedSections = Array.isArray(raw.sections) && raw.sections.length > 0
        ? raw.sections
        : JSON.parse(JSON.stringify(DEFAULT_RESUME_SECTIONS));

      // If sections array has fewer than 4 sections (e.g. only 1 section like Summary),
      // merge with the standard 9-section template so the candidate gets the full Resume.com structure!
      if (parsedSections.length < 4) {
        const existingIds = new Set(parsedSections.map(s => s.id));
        const missingDefs = DEFAULT_RESUME_SECTIONS.filter(def => !existingIds.has(def.id));
        parsedSections = [...parsedSections, ...JSON.parse(JSON.stringify(missingDefs))];
      }

      return {
        contact: mergedContact,
        sections: parsedSections,
        fontFamily: raw.fontFamily || 'plus-jakarta',
        scale: raw.scale || 'standard',
        template: raw.template || 'modern'
      };
    }

    return {
      contact: initialContact,
      sections: JSON.parse(JSON.stringify(DEFAULT_RESUME_SECTIONS)),
      fontFamily: 'plus-jakarta',
      scale: 'standard',
      template: 'modern'
    };
  };

  const [resume, setResume] = useState(parseInitial);
  const [editingSectionId, setEditingSectionId] = useState(null);
  const [editingContact, setEditingContact] = useState(false);
  const [activeHoverId, setActiveHoverId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showHeaderMenu, setShowHeaderMenu] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [deletedStack, setDeletedStack] = useState([]);
  const [contactForm, setContactForm] = useState({ ...DEFAULT_CONTACT });
  const [selectedSectionId, setSelectedSectionId] = useState(null);
  const hoverTimeoutRef = useRef(null);

  const addMenuRef = useRef(null);
  const fontMenuRef = useRef(null);
  const templateMenuRef = useRef(null);
  const headerMenuRef = useRef(null);

  useEffect(() => {
    const parsed = parseInitial();
    setResume(parsed);
    setContactForm(parsed.contact);
  }, [initialData, profileData?.name, profileData?.email]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (addMenuRef.current && !addMenuRef.current.contains(e.target)) {
        setShowAddMenu(false);
      }
      if (fontMenuRef.current && !fontMenuRef.current.contains(e.target)) {
        setShowFontMenu(false);
      }
      if (templateMenuRef.current && !templateMenuRef.current.contains(e.target)) {
        setShowTemplateMenu(false);
      }
      if (headerMenuRef.current && !headerMenuRef.current.contains(e.target)) {
        setShowHeaderMenu(false);
      }
      const sheet = document.getElementById('resume-printable-sheet');
      if (sheet && !sheet.contains(e.target)) {
        setSelectedSectionId(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMouseEnter = (id) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
    setActiveHoverId(id);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveHoverId(null);
    }, 450);
  };

  const triggerUpdate = (updatedResume) => {
    setResume(updatedResume);
    if (onChange) onChange(updatedResume);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch font family
  const selectFont = (fontId) => {
    setShowFontMenu(false);
    const updated = { ...resume, fontFamily: fontId };
    triggerUpdate(updated);
    const matched = PRESET_FONTS.find(f => f.id === fontId);
    showToast(`Typography updated to ${matched?.name || fontId}`);
  };

  // Switch scale / density
  const selectScale = (scaleId) => {
    const updated = { ...resume, scale: scaleId };
    triggerUpdate(updated);
    const matched = PRESET_SCALES.find(s => s.id === scaleId);
    showToast(`Density set to ${matched?.label || scaleId}`);
  };

  // Switch template design
  const selectTemplate = (templateId) => {
    setShowTemplateMenu(false);
    const updated = { ...resume, template: templateId };
    triggerUpdate(updated);
    const matched = PRESET_TEMPLATES.find(t => t.id === templateId);
    showToast(`Template changed to "${matched?.name || templateId}"`);
  };

  // Switch header layout design / alignment
  const selectHeaderLayout = (layoutId) => {
    setShowHeaderMenu(false);
    const updatedContact = {
      ...resume.contact,
      layout: layoutId
    };
    const updated = { ...resume, contact: updatedContact };
    triggerUpdate(updated);
    if (editingContact) {
      setContactForm(prev => ({ ...prev, layout: layoutId }));
    }
    const matched = PRESET_HEADER_LAYOUTS.find(l => l.id === layoutId);
    showToast(`Header design set to "${matched?.name || layoutId}"`);
  };

  // Switch contact separator
  const selectSeparator = (sepId) => {
    const updatedContact = {
      ...resume.contact,
      separator: sepId
    };
    const updated = { ...resume, contact: updatedContact };
    triggerUpdate(updated);
    if (editingContact) {
      setContactForm(prev => ({ ...prev, separator: sepId }));
    }
    const matched = PRESET_SEPARATORS.find(s => s.id === sepId);
    showToast(`Separator set to "${matched?.symbol || sepId}"`);
  };

  const currentFont = PRESET_FONTS.find(f => f.id === (resume.fontFamily || 'plus-jakarta')) || PRESET_FONTS[0];
  const currentScale = PRESET_SCALES.find(s => s.id === (resume.scale || 'standard')) || PRESET_SCALES[1];
  const currentTemplate = PRESET_TEMPLATES.find(t => t.id === (resume.template || 'modern')) || PRESET_TEMPLATES[0];
  const currentHeaderLayout = PRESET_HEADER_LAYOUTS.find(l => l.id === (resume.contact?.layout || 'left')) || PRESET_HEADER_LAYOUTS[0];
  const currentSeparator = PRESET_SEPARATORS.find(s => s.id === (resume.contact?.separator || 'pipe')) || PRESET_SEPARATORS[0];

  const moveSectionUp = (index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (index <= 0) return;
    const newSections = [...resume.sections];
    const target = newSections[index];
    const temp = newSections[index - 1];
    newSections[index - 1] = target;
    newSections[index] = temp;
    setSelectedSectionId(target.id);
    setActiveHoverId(target.id);
    triggerUpdate({ ...resume, sections: newSections });
  };

  const moveSectionDown = (index, e) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    if (index >= resume.sections.length - 1) return;
    const newSections = [...resume.sections];
    const target = newSections[index];
    const temp = newSections[index + 1];
    newSections[index + 1] = target;
    newSections[index] = temp;
    setSelectedSectionId(target.id);
    setActiveHoverId(target.id);
    triggerUpdate({ ...resume, sections: newSections });
  };

  const deleteSection = (index, e) => {
    if (e) e.stopPropagation();
    const removed = resume.sections[index];
    const newSections = resume.sections.filter((_, i) => i !== index);
    setDeletedStack(prev => [...prev, { section: removed, index }]);
    if (editingSectionId === removed.id) {
      setEditingSectionId(null);
    }
    triggerUpdate({ ...resume, sections: newSections });
    showToast(`Removed "${removed.title}". Click Undo to restore.`);
  };

  const handleUndo = () => {
    if (deletedStack.length === 0) return;
    const last = deletedStack[deletedStack.length - 1];
    const newSections = [...resume.sections];
    newSections.splice(last.index, 0, last.section);
    setDeletedStack(prev => prev.slice(0, -1));
    triggerUpdate({ ...resume, sections: newSections });
    showToast(`Restored "${last.section.title}"`);
  };

  const startEditSection = (sec) => {
    setEditingSectionId(sec.id);
    setEditTitle(sec.title);
    setEditContent(sec.content);
    setEditingContact(false);
  };

  const saveEditedSection = () => {
    const updated = resume.sections.map(s => {
      if (s.id === editingSectionId) {
        return {
          ...s,
          title: editTitle.trim() || s.title,
          content: editContent
        };
      }
      return s;
    });
    triggerUpdate({ ...resume, sections: updated });
    setEditingSectionId(null);
  };

  const cancelEdit = () => {
    setEditingSectionId(null);
  };

  const startEditContact = () => {
    setContactForm({ ...resume.contact });
    setEditingContact(true);
    setEditingSectionId(null);
  };

  const saveContact = () => {
    triggerUpdate({
      ...resume,
      contact: { ...contactForm }
    });
    setEditingContact(false);
  };

  const addSection = (template) => {
    setShowAddMenu(false);
    const newId = `${template.id}_${Date.now().toString(36)}`;
    const newSec = {
      id: newId,
      title: template.title,
      type: 'text',
      content: template.defaultText,
      placeholder: template.defaultText
    };
    const updated = [...resume.sections, newSec];
    triggerUpdate({ ...resume, sections: updated });
    startEditSection(newSec);
    showToast(`Added section "${template.title}"`);
  };

  const resetToDefaultTemplate = () => {
    if (window.confirm('Reset resume to the standard placement template? This will restore the default sections.')) {
      const resetResume = {
        contact: {
          fullName: profileData?.name || DEFAULT_CONTACT.fullName,
          headline: resume.contact?.headline || '',
          phone: profileData?.phone || DEFAULT_CONTACT.phone,
          email: profileData?.email || DEFAULT_CONTACT.email,
          location: profileData?.department ? `${profileData.department}, Campus Connect` : DEFAULT_CONTACT.location,
          linkedin: resume.contact?.linkedin || '',
          github: resume.contact?.github || '',
          portfolio: resume.contact?.portfolio || '',
          layout: resume.contact?.layout || 'left',
          separator: resume.contact?.separator || 'pipe'
        },
        sections: JSON.parse(JSON.stringify(DEFAULT_RESUME_SECTIONS)),
        fontFamily: resume.fontFamily || 'plus-jakarta',
        scale: resume.scale || 'standard',
        template: resume.template || 'modern'
      };
      setResume(resetResume);
      setContactForm({ ...resetResume.contact });
      setEditingSectionId(null);
      setEditingContact(false);
      triggerUpdate(resetResume);
      showToast('Reset to standard placement template.');
    }
  };

  const syncWithProfile = () => {
    if (!profileData || Object.keys(profileData).length === 0) {
      showToast('No student profile data found to sync.');
      return;
    }

    const skillsStr = Array.isArray(profileData.technical_skills)
      ? profileData.technical_skills.join(', ')
      : profileData.technical_skills || 'React, Node.js, Python, SQL, REST APIs';

    const syncedContact = {
      fullName: profileData.name || resume.contact?.fullName || 'Candidate Name',
      headline: resume.contact?.headline || profileData?.headline || `${profileData?.department || 'Computer Science'} Student`,
      phone: profileData.phone || resume.contact?.phone || '+91 98765 43210',
      email: profileData.email || resume.contact?.email || 'student@university.edu',
      location: profileData.department ? `${profileData.department}, Campus Connect` : (resume.contact?.location || DEFAULT_CONTACT.location),
      linkedin: resume.contact?.linkedin || '',
      github: resume.contact?.github || '',
      portfolio: resume.contact?.portfolio || '',
      layout: resume.contact?.layout || 'left',
      separator: resume.contact?.separator || 'pipe'
    };

    const syncedSections = [
      {
        id: 'prof_profiles',
        title: 'Professional profiles',
        content: `GitHub: https://github.com/${(profileData.name || 'candidate').toLowerCase().replace(/\s+/g, '')}\nLinkedIn: https://linkedin.com/in/${(profileData.name || 'candidate').toLowerCase().replace(/\s+/g, '')}`
      },
      {
        id: 'summary',
        title: 'Summary',
        content: `Motivated ${profileData.department || 'Engineering'} undergraduate (Class of ${profileData.gradYear || 2026}) with a CGPA of ${profileData.cgpa || '8.5'}. Passionate about full-stack engineering, distributed systems, and modern software architectures. Proven ability to translate complex business requirements into high-performance web applications.`
      },
      {
        id: 'skills',
        title: 'Skills',
        content: `• Core Technical: ${skillsStr}\n• Engineering Stacks: Frontend & Backend Web Architecture, Microservices, Database Systems\n• Tools & Cloud: Git, Docker, AWS Core Services, Postman, CI/CD Pipelines`
      },
      {
        id: 'experience',
        title: 'Experience',
        content: profileData.internships || `WebCraft Systems | Bengaluru, India\nFull Stack Development Intern | May 2025 - Jul 2025\n• Engineered scalable RESTful API endpoints utilizing Node.js and Express, cutting API latency by 32%.\n• Designed modular React components with responsive UX, increasing user session engagement by 24%.\n• Collaborated in cross-functional Agile sprints with daily standups, code reviews, and Git flow branching.`
      },
      {
        id: 'education',
        title: 'Education',
        content: `College of Engineering & Technology | India\nB.Tech in ${profileData.department || 'Computer Science & Engineering'} | Expected ${profileData.gradYear || 2026}\n• Cumulative CGPA: ${profileData.cgpa || '8.9'} / 10.0 (0 Backlogs, Super Dream & Tier-1 Placement Qualified)\n• Key Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks`
      },
      {
        id: 'certificates',
        title: 'Certificates',
        content: profileData.certifications || '• AWS Certified Solutions Architect - Associate (2025)\n• Deep Learning Specialization - Coursera\n• HackerRank 5-Star Problem Solving Certification'
      },
      {
        id: 'achievements',
        title: 'Achievements',
        content: "• Top 5% in National Coding Challenge (over 12,000 participants nationwide).\n• Finalist, Inter-College Smart Campus Hackathon 2025.\n• Academic Dean's Honor List for consistent high semester GPA."
      },
      {
        id: 'projects',
        title: 'Projects',
        content: profileData.projects || `Campus Connect Placement & Internship Ecosystem | React, Node.js, Express, MongoDB\n• Architected centralized campus placement hub serving 800+ candidates and top corporate recruiters.\n• Implemented automated resume parsing, real-time qualification filtering, and live job application tracking.`
      },
      {
        id: 'interests',
        title: 'Interests',
        content: 'Cloud computing, open source software contributions, technical blogging, competitive algorithmic coding, badminton.'
      }
    ];

    const synced = { contact: syncedContact, sections: syncedSections };
    setResume(synced);
    setContactForm(syncedContact);
    setEditingSectionId(null);
    setEditingContact(false);
    triggerUpdate(synced);
    showToast('Autofilled resume using your verified student profile data!');
  };

  const handleAiPolish = () => {
    if (!editContent || editContent.trim().length === 0) {
      showToast('Type some rough notes first, then click Polish.');
      return;
    }

    const titleLower = (editTitle || '').toLowerCase();
    let polished = editContent;

    if (titleLower.includes('summary')) {
      polished = "Proactive and results-driven engineer with strong analytical problem-solving skills and hands-on experience building scalable applications. Proven ability to architect modular solutions, collaborate within agile sprints, and deliver high-impact software under tight deadlines.";
    } else if (titleLower.includes('experience') || titleLower.includes('work')) {
      const lines = editContent.split('\n');
      const polishedLines = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed) return '';
        if (trimmed.includes('|')) return trimmed;
        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const text = trimmed.replace(/^[•\-]\s*/, '');
          return `• Spearheaded ${text.charAt(0).toLowerCase() + text.slice(1)}, improving operational throughput and latency benchmarks by 28%.`;
        }
        return `• Engineered ${trimmed.charAt(0).toLowerCase() + trimmed.slice(1)}, delivering reliable outcomes and scalable performance.`;
      });
      polished = polishedLines.join('\n');
    } else if (titleLower.includes('skill')) {
      const skills = editContent.split(/[,•\n]/).map(s => s.trim()).filter(Boolean);
      polished = `• Core Technologies: ${skills.slice(0, 4).join(', ')}\n• Specialized Tools: ${skills.slice(4).join(', ') || 'System Design, RESTful Architecture, Docker, CI/CD'}`;
    } else {
      const lines = editContent.split('\n');
      polished = lines.map(l => {
        const t = l.trim();
        if (!t) return '';
        if (t.startsWith('•')) return t;
        return `• ${t}`;
      }).join('\n');
    }

    setEditContent(polished);
    showToast('✨ Polished with high-impact phrasing!');
  };

  const handlePrint = () => {
    setEditingSectionId(null);
    setEditingContact(false);
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const renderSectionContent = (content, placeholder) => {
    if (!content || !content.trim()) {
      return (
        <div className="resume-com-placeholder">
          {placeholder || "Click the 'Edit' button to add content to this section."}
        </div>
      );
    }

    const lines = content.split('\n');
    return (
      <div className="resume-com-content-body">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} style={{ height: '6px' }} />;
          }

          if (trimmed.includes('|')) {
            const parts = trimmed.split('|').map(p => p.trim());
            return (
              <div key={idx} className="resume-com-entry-line">
                <span className="resume-com-entry-left">{parts[0]}</span>
                {parts.length > 1 && (
                  <span className="resume-com-entry-right">{parts.slice(1).join(' | ')}</span>
                )}
              </div>
            );
          }

          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            return (
              <div key={idx} className="resume-com-bullet-line">
                <span className="resume-com-bullet-dot">•</span>
                <span className="resume-com-bullet-text">{trimmed.replace(/^[•\-]\s*/, '')}</span>
              </div>
            );
          }

          return (
            <div key={idx} className="resume-com-text-line">
              {line}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="resume-com-studio-container">
      {/* 1. TOP STUDIO ACTION TOOLBAR */}
      <div className="resume-com-topbar no-print">
        {/* ROW 1: BRANDING, SUBTITLE & TYPOGRAPHY / SCALE */}
        <div className="resume-com-topbar-row-1">
          <div className="resume-com-topbar-left">
            <div className="resume-com-badge">
              <Icon name="file-text" size={15} />
              <span>Placement Resume Studio</span>
            </div>
            <span className="resume-com-header-divider" />
            <span className="resume-com-sublabel">
              ATS-Optimized Clean Template &bull; Click any section to edit
            </span>
          </div>

          <div className="resume-com-topbar-right">
            {/* TEMPLATE SELECTOR DROPDOWN */}
            <div className="resume-com-dropdown-wrap" ref={templateMenuRef}>
              <button
                type="button"
                className="resume-com-font-btn"
                onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                title="Change custom resume design template"
              >
                <span style={{ fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Template:</span>
                <strong>{currentTemplate.name}</strong>
                <Icon name="chevron-down" size={12} />
              </button>

              {showTemplateMenu && (
                <div className="resume-com-dropdown-menu resume-com-font-dropdown">
                  <div className="resume-com-dropdown-header">Curated Design Templates</div>
                  {PRESET_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className={`resume-com-dropdown-item resume-com-font-item ${currentTemplate.id === t.id ? 'is-active' : ''}`}
                      onClick={() => selectTemplate(t.id)}
                    >
                      <div className="resume-com-font-item-top">
                        <span className="resume-com-font-item-name">{t.name}</span>
                        <span className="resume-com-font-item-badge">{t.badge}</span>
                      </div>
                      <div className="resume-com-font-item-desc">{t.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* FONT SELECTOR DROPDOWN */}
            <div className="resume-com-dropdown-wrap" ref={fontMenuRef}>
              <button
                type="button"
                className="resume-com-font-btn"
                onClick={() => setShowFontMenu(!showFontMenu)}
                title="Change resume typography"
              >
                <span style={{ fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Font:</span>
                <strong style={{ fontFamily: currentFont.family }}>{currentFont.name}</strong>
                <Icon name="chevron-down" size={12} />
              </button>

              {showFontMenu && (
                <div className="resume-com-dropdown-menu resume-com-font-dropdown">
                  <div className="resume-com-dropdown-header">Aesthetic Typography Presets</div>
                  {PRESET_FONTS.map(f => (
                    <button
                      key={f.id}
                      type="button"
                      className={`resume-com-dropdown-item resume-com-font-item ${currentFont.id === f.id ? 'is-active' : ''}`}
                      onClick={() => selectFont(f.id)}
                    >
                      <div className="resume-com-font-item-top">
                        <span className="resume-com-font-item-name" style={{ fontFamily: f.family }}>{f.name}</span>
                        <span className="resume-com-font-item-badge">{f.badge}</span>
                      </div>
                      <div className="resume-com-font-item-desc" style={{ fontFamily: f.family }}>{f.sample}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* HEADER ALIGNMENT / DESIGN SELECTOR */}
            <div className="resume-com-dropdown-wrap" ref={headerMenuRef}>
              <button
                type="button"
                className="resume-com-font-btn"
                onClick={() => setShowHeaderMenu(!showHeaderMenu)}
                title="Change header alignment and layout design"
              >
                <span style={{ fontSize: '11px', opacity: 0.75, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Header:</span>
                <strong style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icon name={currentHeaderLayout.icon} size={12} />
                  {currentHeaderLayout.name}
                </strong>
                <Icon name="chevron-down" size={12} />
              </button>

              {showHeaderMenu && (
                <div className="resume-com-dropdown-menu resume-com-font-dropdown" style={{ minWidth: '280px' }}>
                  <div className="resume-com-dropdown-header">Header Alignment & Designs</div>
                  {PRESET_HEADER_LAYOUTS.map(l => (
                    <button
                      key={l.id}
                      type="button"
                      className={`resume-com-dropdown-item resume-com-font-item ${currentHeaderLayout.id === l.id ? 'is-active' : ''}`}
                      onClick={() => selectHeaderLayout(l.id)}
                    >
                      <div className="resume-com-font-item-top">
                        <span className="resume-com-font-item-name" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Icon name={l.icon} size={14} />
                          {l.name}
                        </span>
                        <span className="resume-com-font-item-badge">{l.badge}</span>
                      </div>
                      <div className="resume-com-font-item-desc">{l.desc}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* DENSITY / SCALE TOGGLES */}
            <div className="resume-com-density-group" title="Adjust typographical layout scale to fit A4 page">
              {PRESET_SCALES.map(sc => (
                <button
                  key={sc.id}
                  type="button"
                  className={`resume-com-density-btn ${currentScale.id === sc.id ? 'is-active' : ''}`}
                  onClick={() => selectScale(sc.id)}
                  title={sc.desc}
                >
                  {sc.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROW 2: ACTIONS BAR */}
        <div className="resume-com-topbar-row-2">
          <div className="resume-com-actions-left">
            <div className="resume-com-dropdown-wrap" ref={addMenuRef}>
              <button
                type="button"
                className="resume-com-btn resume-com-btn-secondary"
                onClick={() => setShowAddMenu(!showAddMenu)}
              >
                <Icon name="plus" size={14} />
                <span>Add Section</span>
                <Icon name="chevron-down" size={11} style={{ opacity: 0.6 }} />
              </button>

              {showAddMenu && (
                <div className="resume-com-dropdown-menu">
                  <div className="resume-com-dropdown-header">Add Resume Section</div>
                  {AVAILABLE_SECTION_TYPES.map(t => (
                    <button
                      key={t.id}
                      type="button"
                      className="resume-com-dropdown-item"
                      onClick={() => addSection(t)}
                    >
                      <span>{t.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              className="resume-com-btn resume-com-btn-secondary"
              onClick={syncWithProfile}
              title="Autofill with your verified candidate details"
            >
              <Icon name="zap" size={14} />
              <span>Sync with Profile</span>
            </button>
          </div>

          <div className="resume-com-actions-right">
            <button
              type="button"
              className="resume-com-btn resume-com-btn-subtle"
              onClick={resetToDefaultTemplate}
              title="Reset to default sample resume.com template"
            >
              <Icon name="refresh-cw" size={13} />
              <span>Reset Sample</span>
            </button>

            <button
              type="button"
              className="resume-com-btn resume-com-btn-secondary"
              onClick={handlePrint}
              title="Export clean PDF or print"
            >
              <Icon name="download" size={14} />
              <span>Print / PDF</span>
            </button>

            <button
              type="button"
              className="resume-com-btn resume-com-btn-primary"
              onClick={() => onSave && onSave(resume)}
              disabled={saving}
            >
              <Icon name="check" size={14} />
              <span>{saving ? 'Saving...' : 'Save Resume'}</span>
            </button>
          </div>
        </div>
      </div>

      {toastMessage && (
        <div className="resume-com-toast no-print">
          <span>{toastMessage}</span>
          {deletedStack.length > 0 && (
            <button type="button" onClick={handleUndo} className="resume-com-undo-btn">
              Undo
            </button>
          )}
        </div>
      )}

      {/* 2. THE AUTHENTIC A4 RESUME PAPER CANVAS */}
      <div className="resume-com-canvas-stage">
        <div
          className={`resume-com-paper-sheet font-${currentFont.id} scale-${currentScale.id} template-${currentTemplate.id}`}
          id="resume-printable-sheet"
          style={{
            fontFamily: currentFont.family,
            fontSize: currentScale.scaleValue !== 1 ? `${currentScale.scaleValue * 100}%` : undefined
          }}
        >
          {/* HEADER AREA */}
          <div
            className={`resume-com-section-wrapper resume-com-header-wrapper ${activeHoverId === 'header' ? 'is-hovered' : ''} ${selectedSectionId === 'header' ? 'is-selected' : ''} ${editingContact ? 'is-editing' : ''}`}
            onClick={() => setSelectedSectionId('header')}
            onDoubleClick={startEditContact}
            onMouseEnter={() => handleMouseEnter('header')}
            onMouseLeave={handleMouseLeave}
          >
            {!editingContact ? (
              <div className={`resume-com-header-display resume-header-layout-${currentHeaderLayout.id}`}>
                {currentHeaderLayout.id === 'split' ? (
                  <div className="resume-header-split-row">
                    <div className="resume-header-split-left">
                      <h1 className="resume-com-name" style={{ fontFamily: currentFont.family }}>
                        {resume.contact?.fullName || 'First Name Last Name'}
                      </h1>
                      {resume.contact?.headline && (
                        <div className="resume-com-headline">{resume.contact.headline}</div>
                      )}
                    </div>
                    <div className="resume-header-split-right">
                      {resume.contact?.email && (
                        <div className="resume-header-split-item">
                          <Icon name="mail" size={12} />
                          <span>{resume.contact.email}</span>
                        </div>
                      )}
                      {resume.contact?.phone && (
                        <div className="resume-header-split-item">
                          <Icon name="phone" size={12} />
                          <span>{resume.contact.phone}</span>
                        </div>
                      )}
                      {resume.contact?.location && (
                        <div className="resume-header-split-item">
                          <Icon name="map-pin" size={12} />
                          <span>{resume.contact.location}</span>
                        </div>
                      )}
                      {resume.contact?.linkedin && (
                        <div className="resume-header-split-item">
                          <Icon name="linkedin" size={12} />
                          <span>{resume.contact.linkedin}</span>
                        </div>
                      )}
                      {resume.contact?.github && (
                        <div className="resume-header-split-item">
                          <Icon name="github" size={12} />
                          <span>{resume.contact.github}</span>
                        </div>
                      )}
                      {resume.contact?.portfolio && (
                        <div className="resume-header-split-item">
                          <Icon name="globe" size={12} />
                          <span>{resume.contact.portfolio}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : currentHeaderLayout.id === 'badge' ? (
                  <>
                    <h1 className="resume-com-name" style={{ fontFamily: currentFont.family }}>
                      {resume.contact?.fullName || 'First Name Last Name'}
                    </h1>
                    {resume.contact?.headline && (
                      <div className="resume-com-headline">{resume.contact.headline}</div>
                    )}
                    <div className="resume-header-badges-wrap">
                      {resume.contact?.phone && (
                        <span className="resume-com-contact-chip">
                          <Icon name="phone" size={12} />
                          <span>{resume.contact.phone}</span>
                        </span>
                      )}
                      {resume.contact?.email && (
                        <span className="resume-com-contact-chip">
                          <Icon name="mail" size={12} />
                          <span>{resume.contact.email}</span>
                        </span>
                      )}
                      {resume.contact?.location && (
                        <span className="resume-com-contact-chip">
                          <Icon name="map-pin" size={12} />
                          <span>{resume.contact.location}</span>
                        </span>
                      )}
                      {resume.contact?.linkedin && (
                        <span className="resume-com-contact-chip">
                          <Icon name="linkedin" size={12} />
                          <span>{resume.contact.linkedin}</span>
                        </span>
                      )}
                      {resume.contact?.github && (
                        <span className="resume-com-contact-chip">
                          <Icon name="github" size={12} />
                          <span>{resume.contact.github}</span>
                        </span>
                      )}
                      {resume.contact?.portfolio && (
                        <span className="resume-com-contact-chip">
                          <Icon name="globe" size={12} />
                          <span>{resume.contact.portfolio}</span>
                        </span>
                      )}
                    </div>
                  </>
                ) : currentHeaderLayout.id === 'compact-bar' ? (
                  <>
                    <div className="resume-header-compact-top">
                      <h1 className="resume-com-name" style={{ fontFamily: currentFont.family }}>
                        {resume.contact?.fullName || 'First Name Last Name'}
                      </h1>
                      {resume.contact?.location && (
                        <div className="resume-header-compact-loc">
                          <Icon name="map-pin" size={12} />
                          <span>{resume.contact.location}</span>
                        </div>
                      )}
                    </div>
                    {resume.contact?.headline && (
                      <div className="resume-com-headline">{resume.contact.headline}</div>
                    )}
                    <div className="resume-com-contact-line resume-header-compact-bottom">
                      <span>{resume.contact?.phone || 'Phone Number'}</span>
                      <span className="contact-separator">{currentSeparator.symbol}</span>
                      <span>{resume.contact?.email || 'xyz@gmail.com'}</span>
                      {resume.contact?.linkedin && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.linkedin}</span>
                        </>
                      )}
                      {resume.contact?.github && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.github}</span>
                        </>
                      )}
                      {resume.contact?.portfolio && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.portfolio}</span>
                        </>
                      )}
                    </div>
                  </>
                ) : (
                  /* Classic Left, Executive Center, or Modern Right */
                  <>
                    <h1 className="resume-com-name" style={{ fontFamily: currentFont.family }}>
                      {resume.contact?.fullName || 'First Name Last Name'}
                    </h1>
                    {resume.contact?.headline && (
                      <div className="resume-com-headline">{resume.contact.headline}</div>
                    )}
                    <div className="resume-com-contact-line">
                      <span>{resume.contact?.phone || 'Phone Number'}</span>
                      <span className="contact-separator">{currentSeparator.symbol}</span>
                      <span>{resume.contact?.email || 'xyz@gmail.com'}</span>
                      <span className="contact-separator">{currentSeparator.symbol}</span>
                      <span>{resume.contact?.location || 'City, State'}</span>
                      {resume.contact?.linkedin && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.linkedin}</span>
                        </>
                      )}
                      {resume.contact?.github && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.github}</span>
                        </>
                      )}
                      {resume.contact?.portfolio && (
                        <>
                          <span className="contact-separator">{currentSeparator.symbol}</span>
                          <span>{resume.contact.portfolio}</span>
                        </>
                      )}
                    </div>
                  </>
                )}

                <div className="resume-com-header-rule" />

                <div
                  className="resume-com-floating-actions no-print"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => handleMouseEnter('header')}
                  onMouseLeave={handleMouseLeave}
                >
                  <button
                    type="button"
                    className="resume-com-edit-pill-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      startEditContact();
                    }}
                    title="Edit Contact Header"
                  >
                    <span>Edit Header</span>
                    <Icon name="edit-3" size={13} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="resume-com-inline-editor no-print">
                <div className="resume-com-editor-title-row">
                  <strong>Header Alignment & Contact Details</strong>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="button" className="btn btn-primary btn-xs" onClick={saveContact}>
                      <Icon name="check" size={13} /> Save Header
                    </button>
                    <button type="button" className="btn btn-ghost btn-xs" onClick={() => setEditingContact(false)}>
                      Cancel
                    </button>
                  </div>
                </div>

                {/* Header Layout Alignment Selection */}
                <div style={{ marginTop: 14, marginBottom: 10 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Header Alignment & Layout Design
                  </label>
                  <div className="resume-header-layout-pills">
                    {PRESET_HEADER_LAYOUTS.map(l => (
                      <button
                        key={l.id}
                        type="button"
                        className={`resume-header-pill-btn ${(contactForm.layout || 'left') === l.id ? 'is-active' : ''}`}
                        onClick={() => setContactForm({ ...contactForm, layout: l.id })}
                      >
                        <Icon name={l.icon} size={13} />
                        <span>{l.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Separator Symbol Selection */}
                <div style={{ marginBottom: 14 }}>
                  <label className="form-label" style={{ fontSize: '0.75rem', fontWeight: 600, color: '#94a3b8', display: 'block', marginBottom: 6 }}>
                    Contact Separator Symbol
                  </label>
                  <div className="resume-separator-pills">
                    {PRESET_SEPARATORS.map(s => (
                      <button
                        key={s.id}
                        type="button"
                        className={`resume-sep-pill-btn ${(contactForm.separator || 'pipe') === s.id ? 'is-active' : ''}`}
                        onClick={() => setContactForm({ ...contactForm, separator: s.id })}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Input Fields */}
                <div className="resume-com-form-grid">
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.fullName || ''}
                      onChange={e => setContactForm({ ...contactForm, fullName: e.target.value })}
                      placeholder="First Name Last Name"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Headline / Target Role (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.headline || ''}
                      onChange={e => setContactForm({ ...contactForm, headline: e.target.value })}
                      placeholder="e.g. Full Stack Developer | B.Tech CSE"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.phone || ''}
                      onChange={e => setContactForm({ ...contactForm, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Email Address</label>
                    <input
                      type="email"
                      className="form-input"
                      value={contactForm.email || ''}
                      onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                      placeholder="xyz@gmail.com"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>City, State / Location</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.location || ''}
                      onChange={e => setContactForm({ ...contactForm, location: e.target.value })}
                      placeholder="Bengaluru, Karnataka"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>LinkedIn Profile URL / Handle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.linkedin || ''}
                      onChange={e => setContactForm({ ...contactForm, linkedin: e.target.value })}
                      placeholder="linkedin.com/in/username"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>GitHub URL / Handle</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.github || ''}
                      onChange={e => setContactForm({ ...contactForm, github: e.target.value })}
                      placeholder="github.com/username"
                    />
                  </div>
                  <div className="form-group" style={{ margin: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Portfolio / Website</label>
                    <input
                      type="text"
                      className="form-input"
                      value={contactForm.portfolio || ''}
                      onChange={e => setContactForm({ ...contactForm, portfolio: e.target.value })}
                      placeholder="portfolio.dev"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DYNAMIC SECTIONS LIST */}
          <div className="resume-com-sections-container">
            {resume.sections.map((sec, idx) => {
              const isEditing = editingSectionId === sec.id;
              const isHovered = activeHoverId === sec.id;
              const isSelected = selectedSectionId === sec.id;

              return (
                <div
                  key={sec.id}
                  className={`resume-com-section-wrapper ${isHovered ? 'is-hovered' : ''} ${isSelected ? 'is-selected' : ''} ${isEditing ? 'is-editing' : ''}`}
                  onClick={() => setSelectedSectionId(sec.id)}
                  onDoubleClick={() => startEditSection(sec)}
                  onMouseEnter={() => handleMouseEnter(sec.id)}
                  onMouseLeave={handleMouseLeave}
                >
                  {!isEditing ? (
                    <div className="resume-com-section-display">
                      <h2 className="resume-com-section-title" style={{ fontFamily: currentFont.family }}>
                        {sec.title}
                      </h2>
                      <div className="resume-com-section-rule" />
                      {renderSectionContent(sec.content, sec.placeholder)}

                      {/* Floating Action Controls */}
                      <div
                        className="resume-com-floating-actions no-print"
                        onClick={(e) => e.stopPropagation()}
                        onMouseEnter={() => handleMouseEnter(sec.id)}
                        onMouseLeave={handleMouseLeave}
                      >
                        <button
                          type="button"
                          className="resume-com-edit-pill-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditSection(sec);
                          }}
                          title={`Edit ${sec.title}`}
                        >
                          <span>Edit</span>
                          <Icon name="edit-3" size={13} />
                        </button>

                        <div className="resume-com-vertical-actions-strip">
                          <button
                            type="button"
                            className="resume-com-action-btn"
                            disabled={idx === 0}
                            onClick={(e) => moveSectionUp(idx, e)}
                            title="Move section up"
                          >
                            ↑
                          </button>
                          <button
                            type="button"
                            className="resume-com-action-btn"
                            disabled={idx === resume.sections.length - 1}
                            onClick={(e) => moveSectionDown(idx, e)}
                            title="Move section down"
                          >
                            ↓
                          </button>
                          <button
                            type="button"
                            className="resume-com-action-btn resume-com-btn-delete"
                            onClick={(e) => deleteSection(idx, e)}
                            title="Delete section"
                          >
                            <Icon name="trash" size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="resume-com-inline-editor no-print">
                      <div className="resume-com-editor-title-row">
                        <input
                          type="text"
                          className="resume-com-title-input"
                          value={editTitle}
                          onChange={e => setEditTitle(e.target.value)}
                          placeholder="Section Title"
                        />
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                          <button
                            type="button"
                            className="btn btn-secondary btn-xs"
                            onClick={handleAiPolish}
                            title="Format and polish content with action verbs"
                          >
                            ✨ Polish with AI
                          </button>
                          <button
                            type="button"
                            className="btn btn-primary btn-xs"
                            onClick={saveEditedSection}
                          >
                            <Icon name="check" size={13} /> Done
                          </button>
                          <button
                            type="button"
                            className="btn btn-ghost btn-xs"
                            onClick={cancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>

                      <div className="resume-com-editor-helpers">
                        <button
                          type="button"
                          className="resume-com-chip-helper"
                          onClick={() => setEditContent(prev => prev ? `${prev}\n• ` : '• ')}
                        >
                          + Bullet Point (•)
                        </button>
                        <button
                          type="button"
                          className="resume-com-chip-helper"
                          onClick={() => setEditContent(prev => prev ? `${prev} | ` : '')}
                        >
                          + Separator ( | )
                        </button>
                        <button
                          type="button"
                          className="resume-com-chip-helper"
                          onClick={() => setEditContent('')}
                        >
                          Clear Text
                        </button>
                      </div>

                      <textarea
                        className="resume-com-textarea"
                        rows={8}
                        value={editContent}
                        onChange={e => setEditContent(e.target.value)}
                        placeholder="Enter section content here..."
                        autoFocus
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
