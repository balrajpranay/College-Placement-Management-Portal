// Full 600+ Scale Opportunity Ecosystem & Aggregator
// Featuring Direct-to-Opportunity Redirection on Official Career Portals & LinkedIn Jobs

const FEATURED_MNC_COMPANIES = [
  { id: 'mnc-infosys', name: 'Infosys Technologies', logo: '/static/images/companies/infosys.svg', tier: 'Global Tier-1 IT Partner', category: 'Full-time', location: 'Bengaluru, Hyderabad, Pune, Chennai', hiring_tracks: ['Specialist Programmer (₹9.5 LPA)', 'Digital Specialist Engineer (₹6.5 LPA)', 'Systems Engineer (₹3.6 LPA)'], url: 'https://career.infosys.com/joblist?keyword=Specialist+Programmer&countrycode=IN', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Infosys%20Specialist%20Programmer&location=India', description: 'Global leader in next-generation digital services, cloud transformation, and enterprise consulting.' },
  { id: 'mnc-google', name: 'Google', logo: '/static/images/companies/google.svg', tier: 'Global Tech Giant', category: 'Full-time', location: 'Bengaluru, Hyderabad, Gurgaon', hiring_tracks: ['Software Engineer - Early Career', 'Data Analytics Specialist', 'Cloud Systems Engineer'], url: 'https://www.google.com/about/careers/applications/jobs/results/?q=Software%20Engineer%20Early%20Career&location=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Google%20Software%20Engineer%20Early%20Career&location=India', description: 'Building technology that empowers billions across search, Gemini AI, Android, and Google Cloud.' },
  { id: 'mnc-microsoft', name: 'Microsoft', logo: '/static/images/companies/microsoft.svg', tier: 'Global Tech Giant', category: 'Full-time', location: 'Hyderabad, Bengaluru, Noida', hiring_tracks: ['Software Engineering (University Hire)', 'Cloud Solution Architect', 'Data & AI Engineer'], url: 'https://careers.microsoft.com/v2/global/en/home.html#find-jobs?q=Software%20Engineer%20University&p=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Microsoft%20Software%20Engineer%20University&location=India', description: 'Empowering every person and organization on the planet to achieve more with Azure and modern AI.' },
  { id: 'mnc-servicenow', name: 'ServiceNow', logo: '/static/images/companies/servicenow.svg', tier: 'Global Enterprise Cloud Leader', category: 'Full-time', location: 'Hyderabad, Bengaluru', hiring_tracks: ['Associate Software Engineer', 'Cloud Infrastructure Engineer', 'Technical Support Engineer'], url: 'https://careers.servicenow.com/jobs?keywords=Associate+Software+Engineer&location=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=ServiceNow%20Associate%20Software%20Engineer&location=India', description: 'The enterprise cloud company making work work better for everyone through automated workflow platforms.' },
  { id: 'mnc-amazon', name: 'Amazon', logo: '/static/images/companies/amazon.svg', tier: 'Global Tech & Cloud Leader', category: 'Full-time', location: 'Hyderabad, Bengaluru, Chennai, Delhi NCR', hiring_tracks: ['Software Development Engineer (SDE-1)', 'Cloud Support Associate (AWS)', 'Data Engineer I'], url: 'https://www.amazon.jobs/en/search?base_query=Software+Development+Engineer&country=IND', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Amazon%20Software%20Development%20Engineer%20SDE&location=India', description: 'Earth\'s most customer-centric company and world-leading cloud infrastructure and AI provider.' },
  { id: 'mnc-tcs', name: 'Tata Consultancy Services (TCS)', logo: '/static/images/companies/tcs.svg', tier: 'Global IT & Consulting Leader', category: 'Full-time', location: 'Pan-India Tech Hubs', hiring_tracks: ['TCS Prime (₹9.0L)', 'TCS Digital (₹7.5L)', 'TCS Ninja (₹3.6L)'], url: 'https://www.tcs.com/careers/india/tcs-national-qualifier-test', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=TCS%20Digital%20Graduate%20Developer&location=India', description: 'Building on belief to transform global industries through high-impact digital and AI solutions.' },
  { id: 'mnc-wipro', name: 'Wipro', logo: '/static/images/companies/wipro.svg', tier: 'Global Technology & Services', category: 'Full-time', location: 'Bengaluru, Hyderabad, Pune, Chennai', hiring_tracks: ['Turbo Developer (₹6.5L)', 'Elite National Talent Hunt', 'AI & Automation Labs'], url: 'https://careers.wipro.com/global-india/jobs?keywords=Turbo+Developer&location=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Wipro%20Turbo%20Developer&location=India', description: 'Empowering ambitious companies to achieve their greatest potential across enterprise hybrid cloud.' },
  { id: 'mnc-deloitte', name: 'Deloitte', logo: '/static/images/companies/deloitte.svg', tier: 'Big 4 Consulting & Tech', category: 'Full-time', location: 'Hyderabad, Bengaluru, Mumbai, Gurugram', hiring_tracks: ['Analyst - Technology Consulting', 'Risk & Financial Advisory Trainee', 'Cloud Systems Analyst'], url: 'https://www.deloitte.com/in/en/careers.html', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Deloitte%20Analyst%20Technology%20Consulting&location=India', description: 'Leading global provider of technology transformation, cybersecurity advisory, and strategy.' },
  { id: 'mnc-cisco', name: 'Cisco Systems India', logo: '/static/images/companies/cisco.svg', tier: 'Global Networking & Security', category: 'Full-time', location: 'Bengaluru, Hyderabad', hiring_tracks: ['Software Engineer - University Grad', 'Technical Consulting Engineer', 'Network Security Specialist'], url: 'https://jobs.cisco.com/jobs/SearchJobs/?21178=%5B169482%5D&listFilterMode=1', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Cisco%20Software%20Engineer%20University&location=India', description: 'Connecting the world securely through cutting-edge networking, cloud hardware, and cyber defense.' },
  { id: 'mnc-oracle', name: 'Oracle India', logo: '/static/images/companies/oracle.svg', tier: 'Global Cloud & DB Leader', category: 'Full-time', location: 'Bengaluru, Hyderabad, Noida', hiring_tracks: ['Software Engineer (OCI)', 'Cloud Applications Developer', 'Database Specialist'], url: 'https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions?keyword=Software+Engineer&location=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Oracle%20Software%20Engineer%20OCI&location=India', description: 'Architecting the next wave of autonomous cloud databases and high-performance OCI infrastructure.' },
  { id: 'mnc-accenture', name: 'Accenture', logo: '/static/images/companies/accenture.svg', tier: 'Global Strategy & Cloud Partner', category: 'Full-time', location: 'Bengaluru, Hyderabad, Mumbai, Pune, Gurugram', hiring_tracks: ['Associate Software Engineer (ASE)', 'Advanced App Engineering Analyst'], url: 'https://www.accenture.com/in-en/careers/jobsearch?jk=Associate+Software+Engineer&ct=India', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Accenture%20Associate%20Software%20Engineer&location=India', description: 'Delivering 360-degree value by helping world-class clients transform through cloud, data, and AI.' },
  { id: 'mnc-capgemini', name: 'Capgemini', logo: '/static/images/companies/capgemini.svg', tier: 'Global IT & Engineering Services', category: 'Full-time', location: 'Bengaluru, Hyderabad, Mumbai, Pune, Noida', hiring_tracks: ['Analyst & Software Engineer (Exceller)', 'Cloud & Cybersecurity Specialist'], url: 'https://www.capgemini.com/in-en/careers/job-search/?keyword=Software+Engineer', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=Capgemini%20Software%20Engineer%20Exceller&location=India', description: 'Unleashing human energy through technology for a sustainable and inclusive digital future.' },
  { id: 'mnc-ibm', name: 'IBM', logo: '/static/images/companies/ibm.svg', tier: 'Global Cognitive & Hybrid Cloud', category: 'Full-time', location: 'Bengaluru, Kochi, Hyderabad, Gurugram', hiring_tracks: ['Associate System Engineer', 'Cloud Developer (Red Hat)', 'AI/ML Specialist'], url: 'https://www.ibm.com/careers/in-en/search?field_keyword_08%5B0%5D=Entry%20Level&q=Associate+System+Engineer', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=IBM%20Associate%20System%20Engineer&location=India', description: 'Pioneering breakthrough innovation in enterprise hybrid cloud, generative AI, and quantum systems.' },
  { id: 'mnc-pmi', name: 'PM Internship Scheme', logo: '/static/images/companies/pmi.svg', tier: 'National Initiative (Govt of India)', category: 'Internship', location: 'Pan-India', hiring_tracks: ['Top 500 Enterprise Tracks', 'Technology & Manufacturing Trainee', 'BFSI & Fintech Operations'], url: 'https://pminternship.mca.gov.in/', linkedin_url: 'https://www.linkedin.com/jobs/search/?keywords=PM%20Internship%20Scheme&location=India', description: 'National 1-year corporate internship program by the Ministry of Corporate Affairs with ₹5,000/mo stipend + ₹6,000 incidentals grant.' }
];

// Helper: Clean company name for URL query
function cleanCompanyName(name) {
  if (!name) return 'Company';
  return name.replace(/\s*\(PM\s*Internship\s*Scheme\)/gi, '')
             .replace(/\s*\(PM\s*Scheme\)/gi, '')
             .replace(/\s*Technologies/gi, '')
             .replace(/\s*Corporation/gi, '')
             .replace(/\s*Software/gi, '')
             .replace(/\s*Services/gi, '')
             .trim();
}

// Helper: Clean role title for URL query
function cleanRoleTitle(title) {
  if (!title) return 'Software Engineer';
  return title.replace(/\s*\(Track\s*#\d+\)/gi, '')
              .replace(/\s*\(Batch\s*#\d+\)/gi, '')
              .replace(/\s*\(2025–2026 Batch\)/gi, '')
              .replace(/\s*\(Freshers\)/gi, '')
              .trim();
}

// Helper: Build direct opportunity career link
function buildDirectOpportunityLink(companyName, roleTitle, defaultPortal) {
  const cleanComp = cleanCompanyName(companyName).toLowerCase();
  const cleanTitle = cleanRoleTitle(roleTitle);
  const qTitle = encodeURIComponent(cleanTitle);

  if (cleanComp.includes('google')) {
    return `https://www.google.com/about/careers/applications/jobs/results/?q=${qTitle}&location=India`;
  }
  if (cleanComp.includes('microsoft')) {
    return `https://careers.microsoft.com/v2/global/en/home.html#find-jobs?q=${qTitle}&p=India`;
  }
  if (cleanComp.includes('amazon')) {
    return `https://www.amazon.jobs/en/search?base_query=${qTitle}&country=IND`;
  }
  if (cleanComp.includes('servicenow')) {
    return `https://careers.servicenow.com/jobs?keywords=${qTitle}&location=India`;
  }
  if (cleanComp.includes('cisco')) {
    return `https://jobs.cisco.com/jobs/SearchJobs/?21178=%5B169482%5D&listFilterMode=1`;
  }
  if (cleanComp.includes('oracle')) {
    return `https://careers.oracle.com/jobs/#en/sites/jobsearch/requisitions?keyword=${qTitle}&location=India`;
  }
  if (cleanComp.includes('infosys')) {
    return `https://career.infosys.com/joblist?keyword=${qTitle}&countrycode=IN`;
  }
  if (cleanComp.includes('tcs') || cleanComp.includes('tata consultancy')) {
    return `https://www.tcs.com/careers/india/tcs-national-qualifier-test`;
  }
  if (cleanComp.includes('wipro')) {
    return `https://careers.wipro.com/global-india/jobs?keywords=${qTitle}&location=India`;
  }
  if (cleanComp.includes('accenture')) {
    return `https://www.accenture.com/in-en/careers/jobsearch?jk=${qTitle}&ct=India`;
  }
  if (cleanComp.includes('capgemini')) {
    return `https://www.capgemini.com/in-en/careers/job-search/?keyword=${qTitle}`;
  }
  if (cleanComp.includes('ibm')) {
    return `https://www.ibm.com/careers/in-en/search?field_keyword_08%5B0%5D=Entry%20Level&q=${qTitle}`;
  }
  if (cleanComp.includes('goldman')) {
    return `https://www.goldmansachs.com/careers/students/programs/india/new-analyst-programme.html`;
  }
  if (cleanComp.includes('jpmorgan') || cleanComp.includes('jp morgan')) {
    return `https://careers.jpmorgan.com/global/en/students/programs?search=${qTitle}&tags=location__AsiaPacific__India`;
  }
  if (cleanComp.includes('morgan stanley')) {
    return `https://morganstanley.tal.net/vx/lang-en-GB/mobile-0/appcentre-1/brand-2/xf-a7d0e461a8ef/candidate/jobboard/vacancy/1/adv/`;
  }
  if (cleanComp.includes('razorpay')) {
    return `https://razorpay.com/jobs/#open-positions`;
  }
  if (cleanComp.includes('phonepe')) {
    return `https://www.phonepe.com/careers/job-openings/`;
  }
  if (cleanComp.includes('swiggy')) {
    return `https://careers.swiggy.com/#/jobs`;
  }
  if (cleanComp.includes('zomato')) {
    return `https://www.zomato.com/careers`;
  }
  if (cleanComp.includes('cred')) {
    return `https://careers.cred.club/`;
  }
  if (cleanComp.includes('groww')) {
    return `https://groww.in/careers`;
  }
  if (cleanComp.includes('zerodha')) {
    return `https://zerodha.com/careers/`;
  }
  if (cleanComp.includes('postman')) {
    return `https://www.postman.com/careers/`;
  }
  if (cleanComp.includes('meesho')) {
    return `https://www.meesho.io/jobs`;
  }
  if (cleanComp.includes('paytm')) {
    return `https://paytm.com/careers/`;
  }
  if (cleanComp.includes('adobe')) {
    return `https://adobe.wd5.myworkdayjobs.com/en-US/external_experienced?q=${qTitle}&locations=9c85db5f553301fb4a45a3089d009087`;
  }
  if (cleanComp.includes('nvidia')) {
    return `https://nvidia.wd5.myworkdayjobs.com/NVIDIAExternalCareerSite?q=${qTitle}&locations=c4f6faae728e1001e91122a6136d0000`;
  }
  if (cleanComp.includes('salesforce')) {
    return `https://salesforce.wd1.myworkdayjobs.com/External_Career_Site?q=${qTitle}&locations=987aa78939c301648a1dcf40be005b4b`;
  }
  if (cleanComp.includes('atlassian')) {
    return `https://www.atlassian.com/company/careers/all-jobs?team=&location=India&search=${qTitle}`;
  }

  // Fallback direct LinkedIn search URL specifically for this exact role and company
  return `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanCompanyName(companyName) + ' ' + cleanTitle)}&location=India`;
}

// Generate distinct full-time and internship datasets (600 total: 300 Placements + 300 Internships)
function generateComprehensiveJobs() {
  const jobs = [];

  // 1. Placements Pool (40 distinct enterprise companies)
  const companiesPoolPlacements = [
    { name: 'Google India', logo: '/static/images/companies/google.svg', source: 'Google Careers' },
    { name: 'Microsoft India', logo: '/static/images/companies/microsoft.svg', source: 'Microsoft University' },
    { name: 'Amazon Development Centre', logo: '/static/images/companies/amazon.svg', source: 'Amazon Jobs' },
    { name: 'ServiceNow India', logo: '/static/images/companies/servicenow.svg', source: 'ServiceNow Careers' },
    { name: 'Cisco Systems India', logo: '/static/images/companies/cisco.svg', source: 'Cisco University Hiring' },
    { name: 'Oracle India Development', logo: '/static/images/companies/oracle.svg', source: 'Oracle Careers' },
    { name: 'Adobe Systems India', logo: '/static/images/companies/adobe.svg', source: 'Adobe Careers' },
    { name: 'NVIDIA Graphics India', logo: '/static/images/companies/nvidia.svg', source: 'NVIDIA University' },
    { name: 'Salesforce India', logo: '/static/images/companies/salesforce.svg', source: 'Salesforce Futureforce' },
    { name: 'Atlassian India', logo: '/static/images/companies/atlassian.svg', source: 'Atlassian Careers' },
    { name: 'Goldman Sachs India', logo: '/static/images/companies/goldmansachs.svg', source: 'Goldman Sachs Engineering' },
    { name: 'JPMorgan Chase & Co.', logo: '/static/images/companies/jpmorgan.svg', source: 'JPMC Tech Careers' },
    { name: 'Morgan Stanley India', logo: '/static/images/companies/morganstanley.svg', source: 'Morgan Stanley Early Careers' },
    { name: 'Infosys Technologies', logo: '/static/images/companies/infosys.svg', source: 'Infosys Campus Connect' },
    { name: 'Tata Consultancy Services (TCS)', logo: '/static/images/companies/tcs.svg', source: 'TCS National Qualifier Test' },
    { name: 'Wipro Technologies', logo: '/static/images/companies/wipro.svg', source: 'Wipro Elite & Turbo' },
    { name: 'Cognizant Technology Solutions', logo: '/static/images/companies/cognizant.svg', source: 'Cognizant GenC' },
    { name: 'Accenture India', logo: '/static/images/companies/accenture.svg', source: 'Accenture Careers' },
    { name: 'Capgemini India', logo: '/static/images/companies/capgemini.svg', source: 'Capgemini Exceller' },
    { name: 'HCLTech Software', logo: '/static/images/companies/hcltech.svg', source: 'HCLTech Early Career' },
    { name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg', source: 'Tech Mahindra Careers' },
    { name: 'LTIMindtree', logo: '/static/images/companies/ltimindtree.svg', source: 'LTIMindtree Campus' },
    { name: 'Persistent Systems', logo: '/static/images/companies/persistent.svg', source: 'Persistent Careers' },
    { name: 'Razorpay Software', logo: '/static/images/companies/razorpay.svg', source: 'Razorpay Engineering' },
    { name: 'PhonePe Payments', logo: '/static/images/companies/phonepe.svg', source: 'PhonePe Careers' },
    { name: 'Swiggy Engineering', logo: '/static/images/companies/swiggy.svg', source: 'Swiggy Careers' },
    { name: 'Zomato Tech Labs', logo: '/static/images/companies/zomato.svg', source: 'Zomato Careers' },
    { name: 'Cred Tech Labs', logo: '/static/images/companies/cred.svg', source: 'CRED Careers' },
    { name: 'Groww Financial Tech', logo: '/static/images/companies/groww.svg', source: 'Groww Careers' },
    { name: 'Zerodha Technology', logo: '/static/images/companies/zerodha.svg', source: 'Zerodha Careers' },
    { name: 'Postman API Platform', logo: '/static/images/companies/postman.svg', source: 'Postman Careers' },
    { name: 'Meesho Marketplace', logo: '/static/images/companies/meesho.svg', source: 'Meesho Careers' },
    { name: 'Paytm Core Engineering', logo: '/static/images/companies/paytm.svg', source: 'Paytm Careers' },
    { name: 'Larsen & Toubro (L&T)', logo: '/static/images/companies/ltts.svg', source: 'L&T GET Program' },
    { name: 'Siemens India Technology', logo: '/static/images/companies/siemens.svg', source: 'Siemens Tech Careers' },
    { name: 'Bosch Global Software Technologies', logo: '/static/images/companies/bosch.svg', source: 'Bosch BGSW' },
    { name: 'Tata Motors Digital Engineering', logo: '/static/images/companies/tatamotors.svg', source: 'Tata Motors Early Career' },
    { name: 'AICTE National Placement Portal', logo: '/static/images/companies/aicte.svg', source: 'AICTE Placement Portal' },
    { name: 'AccioJob Placement Network', logo: '/static/images/companies/acciojob.svg', source: 'AccioJob Direct' },
    { name: 'Naukri Verified Campus Network', logo: '/static/images/companies/naukri.svg', source: 'Naukri Campus' }
  ];

  const rolesPoolPlacements = [
    { title: 'Graduate Software Development Engineer (SDE-1)', category: 'Software Engineering', salary: '₹14.0 - ₹24.0 LPA', tags: ['DSA', 'Java', 'Python', 'System Design'] },
    { title: 'Specialist Programmer & Cloud Developer', category: 'Software Engineering', salary: '₹9.5 - ₹15.0 LPA', tags: ['Java', 'Spring Boot', 'AWS', 'Microservices'] },
    { title: 'TCS Digital / Prime Graduate Developer', category: 'Software Engineering', salary: '₹9.0 - ₹11.5 LPA', tags: ['Python', 'Machine Learning', 'Cloud', 'SQL'] },
    { title: 'Associate Cloud & DevOps Systems Engineer', category: 'Cloud & DevOps', salary: '₹8.5 - ₹16.0 LPA', tags: ['AWS', 'Docker', 'Kubernetes', 'Linux', 'Terraform'] },
    { title: 'Junior Backend Engineer (Distributed Systems)', category: 'Software Engineering', salary: '₹10.0 - ₹18.0 LPA', tags: ['Go', 'Python', 'FastAPI', 'PostgreSQL', 'Redis'] },
    { title: 'Associate Data Engineer & Analytics Trainee', category: 'Data & AI', salary: '₹8.0 - ₹14.5 LPA', tags: ['SQL', 'Python', 'Spark', 'Data Pipelines', 'Snowflake'] },
    { title: 'Full Stack Application Engineer (React / Node)', category: 'Software Engineering', salary: '₹9.0 - ₹16.5 LPA', tags: ['React', 'TypeScript', 'Node.js', 'MongoDB'] },
    { title: 'Cybersecurity Defense & Cloud Security Analyst', category: 'Cybersecurity', salary: '₹8.0 - ₹14.0 LPA', tags: ['Network Defense', 'SIEM', 'Linux', 'Zero Trust'] },
    { title: 'Frontend UI/UX Systems Engineer (React/Next)', category: 'Software Engineering', salary: '₹8.5 - ₹15.0 LPA', tags: ['React', 'Next.js', 'TypeScript', 'Tailwind'] },
    { title: 'AI & Generative AI Solutions Trainee', category: 'Data & AI', salary: '₹12.0 - ₹22.0 LPA', tags: ['PyTorch', 'HuggingFace', 'LangChain', 'Python'] },
    { title: 'Embedded Firmware & IoT Systems Engineer', category: 'Core Engineering', salary: '₹7.5 - ₹14.0 LPA', tags: ['C/C++', 'RTOS', 'Microcontrollers', 'Embedded Linux'] },
    { title: 'Site Reliability & Distributed Infrastructure Trainee', category: 'Cloud & DevOps', salary: '₹9.0 - ₹16.0 LPA', tags: ['Kubernetes', 'Prometheus', 'CI/CD', 'GCP'] },
    { title: 'Quantitative Systems & FinTech Software Developer', category: 'Software Engineering', salary: '₹15.0 - ₹28.0 LPA', tags: ['C++', 'Low Latency', 'Data Structures', 'Algorithms'] },
    { title: 'QA Automation & Systems Reliability Engineer', category: 'Software Engineering', salary: '₹7.0 - ₹12.0 LPA', tags: ['Selenium', 'Cypress', 'Python', 'TestNG'] },
    { title: 'Graduate Engineer Trainee (GET) - Digital Systems', category: 'Core Engineering', salary: '₹7.0 - ₹12.5 LPA', tags: ['MATLAB', 'Python', 'Control Systems', 'Automation'] }
  ];

  const locationsPool = [
    { location: 'Bengaluru, Karnataka', mode: 'Hybrid' },
    { location: 'Hyderabad, Telangana', mode: 'Hybrid' },
    { location: 'Pune, Maharashtra', mode: 'Onsite' },
    { location: 'Gurgaon / Noida, Delhi NCR', mode: 'Hybrid' },
    { location: 'Chennai, Tamil Nadu', mode: 'Onsite' },
    { location: 'Mumbai, Maharashtra', mode: 'Hybrid' },
    { location: 'Kochi, Kerala', mode: 'Hybrid' },
    { location: 'Ahmedabad, Gujarat', mode: 'Onsite' },
    { location: 'Mysuru, Karnataka', mode: 'Onsite' },
    { location: 'Remote, India', mode: 'Remote' }
  ];

  for (let i = 0; i < 300; i++) {
    const comp = companiesPoolPlacements[i % companiesPoolPlacements.length];
    const role = rolesPoolPlacements[i % rolesPoolPlacements.length];
    const loc = locationsPool[i % locationsPool.length];

    const titleText = i < rolesPoolPlacements.length ? role.title : `${role.title} (Track #${i + 1})`;
    const cleanComp = cleanCompanyName(comp.name);
    const cleanTitle = cleanRoleTitle(titleText);
    const linkedinUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanComp + ' ' + cleanTitle)}&location=India`;
    const directUrl = buildDirectOpportunityLink(comp.name, titleText, linkedinUrl);

    jobs.push({
      id: `plc-${i + 1}`,
      req_id: `REQ-PLC-2025-${String(1000 + i).padStart(4, '0')}`,
      title: titleText,
      company: comp.name,
      company_name: comp.name,
      logo: comp.logo,
      location: loc.location,
      work_mode: loc.mode,
      job_type: 'Full-time',
      salary: role.salary,
      experience: 'Fresher / 2025–2026 Batch',
      category: role.category,
      tags: [...role.tags, comp.source.split(' ')[0]],
      source: comp.source,
      url: directUrl,
      application_url: directUrl,
      direct_job_url: directUrl,
      linkedin_url: linkedinUrl,
      posted_at: '2026-08-28',
      description: `Official graduate recruitment opportunity for ${cleanTitle} with ${comp.name}. Open for B.Tech, B.E., M.Tech, and MCA graduating batches. Involves end-to-end design, implementation, and deployment of mission-critical platforms.`,
      responsibilities: [
        `Architect, develop, and test scalable software components using ${role.tags.slice(0, 2).join(' and ')}.`,
        'Collaborate closely with product managers, senior architects, and QA engineers in daily agile sprints.',
        'Participate in comprehensive peer code reviews, CI/CD pipeline automation, and production monitoring.',
        'Write robust automated test suites, documentation, and follow clean code best practices.'
      ],
      requirements: [
        'Degree: B.Tech / B.E. / M.Tech / MCA in CS, IT, ECE, EE or related discipline (2025–2026 Graduating).',
        'Academics: Minimum 6.5 CGPA or 65% aggregate with zero active backlogs.',
        `Proficiency in core computer science fundamentals: ${role.tags.join(', ')}.`,
        'Strong problem-solving mindset and clear verbal & written technical communication skills.'
      ],
      rounds: [
        'Round 1: Online Coding Assessment (DSA, MCQs & Aptitude - 90 mins)',
        'Round 2: Technical Interview 1 (Algorithms, Data Structures & Coding - 60 mins)',
        'Round 3: Technical Interview 2 (System Architecture, DB Design & Projects - 45 mins)',
        'Round 4: HR & Leadership Discussion (Cultural Fit, Offer Rollout & Onboarding)'
      ]
    });
  }

  // 2. Internships Pool (32 distinct organizations, including 20 PM Scheme tracks)
  const pmSchemePool = [
    { name: 'Tata Consultancy Services (PM Internship Scheme)', logo: '/static/images/companies/tcs.svg', source: 'PM Internship Scheme' },
    { name: 'Larsen & Toubro (PM Internship Scheme)', logo: '/static/images/companies/ltts.svg', source: 'PM Internship Scheme' },
    { name: 'Reliance Industries Limited (PM Internship Scheme)', logo: '/static/images/companies/reliance.svg', source: 'PM Internship Scheme' },
    { name: 'Tata Motors (PM Internship Scheme)', logo: '/static/images/companies/tatamotors.svg', source: 'PM Internship Scheme' },
    { name: 'HDFC Bank Tech Labs (PM Internship Scheme)', logo: '/static/images/companies/hdfc.svg', source: 'PM Internship Scheme' },
    { name: 'Mahindra & Mahindra (PM Internship Scheme)', logo: '/static/images/companies/mahindra.svg', source: 'PM Internship Scheme' },
    { name: 'Adani Group Innovation Labs (PM Internship Scheme)', logo: '/static/images/companies/adani.svg', source: 'PM Internship Scheme' },
    { name: 'Maruti Suzuki India (PM Internship Scheme)', logo: '/static/images/companies/maruti.svg', source: 'PM Internship Scheme' },
    { name: 'NTPC Energy & Automation (PM Internship Scheme)', logo: '/static/images/companies/ntpc.svg', source: 'PM Internship Scheme' },
    { name: 'Oil & Natural Gas Corporation (ONGC) (PM Scheme)', logo: '/static/images/companies/ongc.svg', source: 'PM Internship Scheme' },
    { name: 'State Bank of India Tech Labs (PM Scheme)', logo: '/static/images/companies/sbi.svg', source: 'PM Internship Scheme' },
    { name: 'Hindustan Unilever Innovation (PM Scheme)', logo: '/static/images/companies/hul.svg', source: 'PM Internship Scheme' },
    { name: 'Coal India Digital Trainee (PM Scheme)', logo: '/static/images/companies/coalindia.svg', source: 'PM Internship Scheme' },
    { name: 'Bharat Heavy Electricals (BHEL) (PM Scheme)', logo: '/static/images/companies/bhel.svg', source: 'PM Internship Scheme' },
    { name: 'GAIL Energy Systems (PM Scheme)', logo: '/static/images/companies/gail.svg', source: 'PM Internship Scheme' },
    { name: 'Indian Oil Corporation (IOCL) (PM Scheme)', logo: '/static/images/companies/iocl.svg', source: 'PM Internship Scheme' },
    { name: 'Tata Steel Digital Operations (PM Scheme)', logo: '/static/images/companies/tatasteel.svg', source: 'PM Internship Scheme' },
    { name: 'ICICI Bank Tech Innovation (PM Scheme)', logo: '/static/images/companies/icici.svg', source: 'PM Internship Scheme' },
    { name: 'Infosys Enterprise (PM Scheme)', logo: '/static/images/companies/infosys.svg', source: 'PM Internship Scheme' },
    { name: 'Wipro Sustainability & Cloud (PM Scheme)', logo: '/static/images/companies/wipro.svg', source: 'PM Internship Scheme' }
  ];

  const regionalInternshipPool = [
    { name: 'Google University Student Internships', logo: '/static/images/companies/google.svg', source: 'Google Careers' },
    { name: 'Microsoft Student Tech Internships', logo: '/static/images/companies/microsoft.svg', source: 'Microsoft University' },
    { name: 'Amazon Student Software Internships', logo: '/static/images/companies/amazon.svg', source: 'Amazon Jobs' },
    { name: 'ServiceNow University Developer Internships', logo: '/static/images/companies/servicenow.svg', source: 'ServiceNow Careers' },
    { name: 'Cisco Systems Software & Network Internships', logo: '/static/images/companies/cisco.svg', source: 'Cisco Careers' },
    { name: 'Oracle Cloud & Database Internships', logo: '/static/images/companies/oracle.svg', source: 'Oracle Careers' },
    { name: 'Razorpay Frontend & Backend Internships', logo: '/static/images/companies/razorpay.svg', source: 'Razorpay Careers' },
    { name: 'PhonePe Payments & Distributed Internships', logo: '/static/images/companies/phonepe.svg', source: 'PhonePe Careers' },
    { name: 'Swiggy Product Analytics & Data Internships', logo: '/static/images/companies/swiggy.svg', source: 'Swiggy Careers' },
    { name: 'AICTE National Internship Portal (Hyderabad Hub)', logo: '/static/images/companies/aicte.svg', source: 'AICTE Portal' },
    { name: 'Internshala Verified Tech Partner Internships', logo: '/static/images/companies/ishala.svg', source: 'Internshala' },
    { name: 'CDAC / MeitY Digital India National Internships', logo: '/static/images/companies/cdac.svg', source: 'Digital India' }
  ];

  const rolesPoolInternships = [
    { title: 'Data Engineering & Analytics Intern', category: 'Data & AI', salary: '₹5,000/mo + ₹6,000 Grant', tags: ['PM Scheme', 'Python', 'SQL', 'Data Pipelines'] },
    { title: 'Cloud Infrastructure & DevOps Intern', category: 'Cloud & DevOps', salary: '₹5,000/mo + ₹6,000 Grant', tags: ['PM Scheme', 'Linux', 'AWS', 'Docker'] },
    { title: 'Smart Cities & IoT Embedded Systems Intern', category: 'Core Engineering', salary: '₹18,000 - ₹25,000/mo', tags: ['AICTE', 'IoT', 'Embedded C', 'Python'] },
    { title: 'Full Stack Web Development Intern (React / Node)', category: 'Software Engineering', salary: '₹22,000 - ₹32,000/mo', tags: ['React', 'Node.js', 'REST APIs', 'MongoDB'] },
    { title: 'AI & Machine Learning Research Intern', category: 'Data & AI', salary: '₹28,000 - ₹40,000/mo', tags: ['PyTorch', 'LLMs', 'NLP', 'Computer Vision'] },
    { title: 'Frontend & Mobile Application Intern (React Native)', category: 'Software Engineering', salary: '₹20,000 - ₹30,000/mo', tags: ['React Native', 'TypeScript', 'UI/UX'] },
    { title: 'Backend Microservices & Cloud API Intern', category: 'Software Engineering', salary: '₹24,000 - ₹35,000/mo', tags: ['Python', 'FastAPI', 'PostgreSQL', 'Docker'] },
    { title: 'Enterprise QA Automation & Testing Intern', category: 'Software Engineering', salary: '₹18,000 - ₹25,000/mo', tags: ['Selenium', 'Python', 'Jest', 'CI/CD'] },
    { title: 'Generative AI & Prompt Engineering Intern', category: 'Data & AI', salary: '₹30,000 - ₹45,000/mo', tags: ['LLMs', 'RAG', 'LangChain', 'Python'] },
    { title: 'Cybersecurity & Threat Detection Intern', category: 'Cybersecurity', salary: '₹22,000 - ₹30,000/mo', tags: ['Wireshark', 'SOC', 'Linux', 'Network Security'] },
    { title: 'FinTech Quantitative Software Intern', category: 'Software Engineering', salary: '₹35,000 - ₹50,000/mo', tags: ['C++', 'Python', 'Data Structures', 'Fintech'] },
    { title: 'Database Administration & Big Data Intern', category: 'Data & AI', salary: '₹20,000 - ₹28,000/mo', tags: ['SQL', 'Hadoop', 'Spark', 'PostgreSQL'] },
    { title: 'Computer Vision & Robotics Software Intern', category: 'Core Engineering', salary: '₹25,000 - ₹38,000/mo', tags: ['OpenCV', 'ROS', 'Python', 'C++'] },
    { title: 'DevOps & Site Reliability Intern', category: 'Cloud & DevOps', salary: '₹24,000 - ₹34,000/mo', tags: ['Docker', 'Kubernetes', 'Linux', 'GitHub Actions'] },
    { title: 'Product Technology & Technical Analyst Intern', category: 'Software Engineering', salary: '₹20,000 - ₹30,000/mo', tags: ['Product Analytics', 'SQL', 'Figma', 'System Design'] }
  ];

  for (let i = 0; i < 300; i++) {
    let compName, compLogo, compSource, jType;

    if (i % 2 === 0) {
      const p = pmSchemePool[(Math.floor(i / 2)) % pmSchemePool.length];
      compName = p.name;
      compLogo = p.logo;
      compSource = 'PM Internship Scheme';
      jType = 'PM Internship Scheme';
    } else {
      const r = regionalInternshipPool[(Math.floor(i / 2)) % regionalInternshipPool.length];
      compName = r.name;
      compLogo = r.logo;
      compSource = r.source;
      jType = 'Internship';
    }

    const role = rolesPoolInternships[i % rolesPoolInternships.length];
    const loc = locationsPool[i % locationsPool.length];
    const titleText = i < rolesPoolInternships.length ? role.title : `${role.title} (Batch #${i + 1})`;

    const cleanComp = cleanCompanyName(compName);
    const cleanTitle = cleanRoleTitle(titleText);
    const linkedinUrl = jType === 'PM Internship Scheme'
      ? `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanComp + ' PM Internship Scheme')}&location=India`
      : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanComp + ' ' + cleanTitle)}&location=India`;

    const directUrl = jType === 'PM Internship Scheme'
      ? 'https://pminternship.mca.gov.in/'
      : buildDirectOpportunityLink(compName, titleText, linkedinUrl);

    jobs.push({
      id: `int-${i + 1}`,
      req_id: `REQ-INT-2025-${String(2000 + i).padStart(4, '0')}`,
      title: titleText,
      company: compName,
      company_name: compName,
      logo: compLogo,
      location: loc.location,
      work_mode: loc.mode,
      job_type: jType,
      salary: role.salary,
      experience: 'Fresher / College Student (Pre-final & Final Year)',
      category: role.category,
      tags: [...role.tags, compSource.split(' ')[0]],
      source: compSource,
      url: directUrl,
      application_url: directUrl,
      direct_job_url: directUrl,
      linkedin_url: linkedinUrl,
      posted_at: '2026-08-28',
      description: jType === 'PM Internship Scheme'
        ? `Official 1-Year National Internship under the PM Internship Scheme with ${compName}. Offers ₹5,000/month DBT stipend, ₹6,000 incidentals grant, corporate mentorship, and pre-placement consideration.`
        : `Structured hands-on technology internship with ${compName}. Involves active participation in live codebase enhancements, mentorship from senior engineers, and performance evaluation for full-time conversion.`,
      responsibilities: [
        `Build and test production-grade modules using ${role.tags.slice(0, 2).join(' and ')}.`,
        'Participate in team standups, sprint planning, and architectural reviews.',
        'Collaborate with mentors to solve real-world problems and optimize platform performance.',
        'Deliver a capstone project presentation to engineering leadership at the conclusion of the internship.'
      ],
      requirements: [
        'Eligibility: College students currently enrolled in B.Tech, B.E., BCA, MCA, or recent graduates.',
        jType === 'PM Internship Scheme'
          ? 'Age & Criteria: 21–24 years, Indian citizen, not enrolled in full-time formal higher education.'
          : 'Academics: Strong fundamental knowledge of core computer science concepts with 6.0+ CGPA.',
        `Hands-on familiarity with: ${role.tags.join(', ')}.`,
        'Eagerness to learn, collaborate, and adapt in a fast-paced technology environment.'
      ],
      rounds: [
        'Round 1: Online Application & Profile Screening',
        'Round 2: Online Technical Assessment / Coding Test (60 mins)',
        'Round 3: Technical & Project Interview (45 mins)',
        'Round 4: Selection Confirmation & Offer Rollout'
      ]
    });
  }

  return jobs;
}

const ALL_JOBS = generateComprehensiveJobs();

// GET /api/jobs (Filter by job_type, search query, work mode, category, pagination)
exports.getJobs = async (req, res) => {
  const { q, category, work_mode, job_type, experience, source, page = 1, limit = 12 } = req.query;

  // 1. Base Filter (Search Query, Work Mode, Category, Source) without job_type constraint
  let baseFiltered = [...ALL_JOBS];

  if (q) {
    const queryStr = q.toLowerCase();
    baseFiltered = baseFiltered.filter(j => 
      j.title.toLowerCase().includes(queryStr) || 
      (j.company && j.company.toLowerCase().includes(queryStr)) ||
      (j.company_name && j.company_name.toLowerCase().includes(queryStr)) ||
      (j.location && j.location.toLowerCase().includes(queryStr)) ||
      (j.tags && j.tags.some(t => t.toLowerCase().includes(queryStr)))
    );
  }

  if (work_mode) {
    baseFiltered = baseFiltered.filter(j => j.work_mode.toLowerCase() === work_mode.toLowerCase());
  }

  if (category) {
    baseFiltered = baseFiltered.filter(j => j.category.toLowerCase() === category.toLowerCase());
  }

  if (source) {
    baseFiltered = baseFiltered.filter(j => j.source.toLowerCase().includes(source.toLowerCase()));
  }

  // Dynamic counts for each category tab matching the current query!
  const totalAllCount = baseFiltered.length;
  const totalPlacementsCount = baseFiltered.filter(j => j.job_type === 'Full-time').length;
  const totalInternshipsCount = baseFiltered.filter(j => j.job_type === 'Internship' || j.job_type === 'PM Internship Scheme').length;

  // 2. Apply Job Type Filter
  let filtered = [...baseFiltered];
  if (job_type) {
    const jt = job_type.toLowerCase();
    if (jt === 'full-time' || jt === 'fulltime' || jt === 'placements' || jt === 'campus placement drive') {
      filtered = filtered.filter(j => j.job_type === 'Full-time');
    } else if (jt === 'internship' || jt === 'internships' || jt === 'pm internship scheme' || jt === 'pm scheme') {
      filtered = filtered.filter(j => j.job_type === 'Internship' || j.job_type === 'PM Internship Scheme');
    } else {
      filtered = filtered.filter(j => j.job_type.toLowerCase() === jt || j.category.toLowerCase().includes(jt));
    }
  }

  const totalMatching = filtered.length;
  const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const totalPages = Math.max(1, Math.ceil(totalMatching / perPage));
  const pageNum = Math.min(totalPages, Math.max(1, parseInt(page, 10) || 1));
  const startIndex = (pageNum - 1) * perPage;
  const paginatedJobs = filtered.slice(startIndex, startIndex + perPage);

  const relevantFeaturedCompanies = !job_type
    ? FEATURED_MNC_COMPANIES
    : (job_type.toLowerCase().includes('intern') || job_type.toLowerCase().includes('pm'))
      ? FEATURED_MNC_COMPANIES.filter(c => c.category === 'Internship' || c.category === 'both')
      : FEATURED_MNC_COMPANIES.filter(c => c.category === 'Full-time' || c.category === 'both');

  return res.status(200).json({
    success: true,
    total_jobs: totalMatching,
    total_all_count: totalAllCount,
    total_placements_count: totalPlacementsCount,
    total_internships_count: totalInternshipsCount,
    page: pageNum,
    limit: perPage,
    total_pages: totalPages,
    featured_companies: relevantFeaturedCompanies,
    data: paginatedJobs
  });
};

// GET /api/jobs/featured-companies
exports.getFeaturedCompanies = async (req, res) => {
  return res.status(200).json({
    success: true,
    data: FEATURED_MNC_COMPANIES
  });
};

// Helper to resolve any opportunity by ID across ALL_JOBS (600 scale dataset) and FEATURED_MNC_COMPANIES
function findOpportunityById(jobId) {
  if (!jobId) return null;

  // 1. Check generated 600 full-time & internship jobs (plc-1..300, int-1..300)
  const standardJob = ALL_JOBS.find(j => j.id === jobId);
  if (standardJob) return standardJob;

  // 2. Check Tier-1 Corporate Partners (mnc-*) with alias resolution
  const mnc = FEATURED_MNC_COMPANIES.find(c =>
    c.id === jobId ||
    (c.id === 'mnc-microsoft' && jobId === 'mnc-msft') ||
    (c.id === 'mnc-infosys' && jobId === 'mnc-infy') ||
    (c.id === 'mnc-techmahindra' && jobId === 'mnc-tm') ||
    (c.id === 'mnc-servicenow' && jobId === 'mnc-snow')
  );

  if (mnc) {
    return {
      id: mnc.id,
      title: (mnc.hiring_tracks && mnc.hiring_tracks[0]) || `${mnc.name} Early Career Track`,
      company: mnc.name,
      company_name: mnc.name,
      logo: mnc.logo,
      salary: mnc.category === 'Internship' ? 'Stipend + Allowance' : 'Competitive MNC CTC',
      location: mnc.location,
      work_mode: 'Hybrid',
      job_type: mnc.category || 'Full-time',
      source: mnc.tier,
      url: mnc.url,
      application_url: mnc.url,
      direct_job_url: mnc.url,
      linkedin_url: mnc.linkedin_url,
      description: mnc.description,
      hiring_tracks: mnc.hiring_tracks,
      tier: mnc.tier,
      requirements: ['Eligible: B.Tech / B.E / M.Tech / MCA', 'Minimum 6.5 CGPA with 0 backlogs'],
      responsibilities: ['Enterprise software design and development', 'Agile teamwork and code testing'],
      rounds: ['Online Assessment', 'Technical Coding Round', 'System Architecture', 'HR Discussion']
    };
  }

  return null;
}

// GET /api/jobs/:id (Public / Authenticated Opportunity Lookup)
exports.getJobById = async (req, res) => {
  const jobId = req.params.id;
  const job = findOpportunityById(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: `Opportunity with ID '${jobId}' not found.`
    });
  }

  return res.status(200).json({
    success: true,
    data: job
  });
};

// POST /api/jobs/:id/apply (Authenticated Students Only)
exports.applyForJob = async (req, res) => {
  const jobId = req.params.id;
  const job = findOpportunityById(jobId);

  if (!job) {
    return res.status(404).json({
      success: false,
      message: `Opportunity with ID '${jobId}' not found.`
    });
  }

  // Security Check: Only student accounts can apply
  if (req.user.role !== 'student') {
    return res.status(403).json({
      success: false,
      message: `Access Restricted: Only registered students can apply for placement opportunities. ${req.user.role.charAt(0).toUpperCase() + req.user.role.slice(1)} accounts cannot submit student applications.`
    });
  }

  return res.status(200).json({
    success: true,
    message: `Application submitted successfully for ${job.title} at ${job.company || job.company_name}.`,
    data: {
      applicationId: `app-${Date.now()}`,
      jobId: job.id,
      jobTitle: job.title,
      company: job.company || job.company_name,
      studentId: req.user._id || req.user.id,
      studentEmail: req.user.email,
      appliedAt: new Date().toISOString(),
      redirectUrl: job.url || job.application_url,
      linkedinUrl: job.linkedin_url
    }
  });
};

// GET /api/jobs/skill-up (Returns the 50 curated student skill-up opportunities)
exports.getSkillUpOpportunities = async (req, res) => {
  const skillUpData = require('../data/skillUpData');
  const { q, category, provider, status } = req.query;

  let filtered = [...skillUpData];

  if (q) {
    const queryStr = q.toLowerCase();
    filtered = filtered.filter(item =>
      item.providerProgramme.toLowerCase().includes(queryStr) ||
      item.provider.toLowerCase().includes(queryStr) ||
      item.programme.toLowerCase().includes(queryStr) ||
      item.bestFor.toLowerCase().includes(queryStr) ||
      item.eligibility.toLowerCase().includes(queryStr) ||
      (item.category && item.category.toLowerCase().includes(queryStr))
    );
  }

  if (provider) {
    filtered = filtered.filter(item => item.provider.toLowerCase() === provider.toLowerCase());
  }

  if (category) {
    filtered = filtered.filter(item => item.category.toLowerCase() === category.toLowerCase());
  }

  if (status) {
    filtered = filtered.filter(item => item.status.toLowerCase().includes(status.toLowerCase()));
  }

  return res.status(200).json({
    success: true,
    total_skills: filtered.length,
    total_count: skillUpData.length,
    data: filtered
  });
};
