// Full 520+ Scale Opportunity Ecosystem & Aggregator
const FEATURED_MNC_COMPANIES = [
  { id: 'mnc-infosys', name: 'Infosys Technologies', logo: '/static/images/companies/infosys.svg', tier: 'Global Tier-1 IT Partner', category: 'Full-time', location: 'Bengaluru, Hyderabad, Pune, Chennai', hiring_tracks: ['Specialist Programmer', 'Digital Specialist Engineer', 'Systems Engineer'], url: 'https://career.infosys.com/joblist?countrycode=IN&companyhiringtype=IL', description: 'Global leader in next-generation digital services and consulting.' },
  { id: 'mnc-google', name: 'Google', logo: '/static/images/companies/google.svg', tier: 'Global Tech Giant', category: 'Full-time', location: 'Bengaluru, Hyderabad, Gurgaon', hiring_tracks: ['Software Engineer - Early Career', 'Data Analytics', 'Cloud Engineer'], url: 'https://www.google.com/about/careers/applications/jobs/results/?location=India&employment_type=FULL_TIME&employment_type=INTERN', description: 'Building technology that empowers billions across search, cloud, and AI.' },
  { id: 'mnc-microsoft', name: 'Microsoft', logo: '/static/images/companies/microsoft.svg', tier: 'Global Tech Giant', category: 'Full-time', location: 'Hyderabad, Bengaluru, Noida', hiring_tracks: ['Software Engineering (University)', 'Cloud Solution Architect', 'Product'], url: 'https://careers.microsoft.com/v2/global/en/home.html#find-jobs?p=India&e=Students%20and%20graduates', description: 'Empowering every person and organization on the planet to achieve more.' },
  { id: 'mnc-deloitte', name: 'Deloitte', logo: '/static/images/companies/deloitte.svg', tier: 'Big 4 Consulting & Tech', category: 'Full-time', location: 'Hyderabad, Bengaluru, Mumbai, Gurugram', hiring_tracks: ['Analyst - Technology Consulting', 'Risk & Financial Advisory', 'Cloud Solutions'], url: 'https://jobsindia.deloitte.com/search/?q=&locationsearch=India', description: 'Leading global provider of audit, consulting, and technology advisory.' },
  { id: 'mnc-techmahindra', name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg', tier: 'Tier-1 Digital Transformation', category: 'Full-time', location: 'Pune, Hyderabad, Bengaluru, Noida', hiring_tracks: ['Associate Software Engineer', 'Network Specialist', 'AI & Automation Trainee'], url: 'https://careers.techmahindra.com/JobSearch.aspx?exp=0-1', description: 'Connected World. Connected Experiences. Driving next-gen enterprise technologies.' },
  { id: 'mnc-amazon', name: 'Amazon', logo: '/static/images/companies/amazon.svg', tier: 'Global Tech & Cloud Leader', category: 'Full-time', location: 'Hyderabad, Bengaluru, Chennai, Delhi NCR', hiring_tracks: ['Software Development Engineer (SDE-1)', 'Cloud Support Associate', 'Data Engineer'], url: 'https://www.amazon.jobs/en/job_categories/software-development?country=IND', description: 'Earth\'s most customer-centric company and world-leading cloud infrastructure provider.' },
  { id: 'mnc-tcs', name: 'Tata Consultancy Services (TCS)', logo: '/static/images/companies/tcs.svg', tier: 'Global IT & Consulting Leader', category: 'Full-time', location: 'Pan-India Tech Hubs', hiring_tracks: ['TCS Prime (₹9.0L)', 'TCS Digital (₹7.5L)', 'TCS Ninja (₹3.6L)'], url: 'https://www.tcs.com/careers/india', description: 'Building on belief to transform industries through high-impact digital solutions.' },
  { id: 'mnc-wipro', name: 'Wipro', logo: '/static/images/companies/wipro.svg', tier: 'Global Technology & Services', category: 'Full-time', location: 'Bengaluru, Hyderabad, Pune, Chennai', hiring_tracks: ['Turbo Developer (₹6.5L)', 'Elite National Talent Hunt', 'AI Labs'], url: 'https://careers.wipro.com/global-india/jobs?keywords=engineer&location=India', description: 'Empowering ambitious companies to achieve their greatest potential.' },
  { id: 'mnc-accenture', name: 'Accenture', logo: '/static/images/companies/accenture.svg', tier: 'Global Strategy & Cloud Partner', category: 'Full-time', location: 'Bengaluru, Hyderabad, Mumbai, Pune, Gurugram', hiring_tracks: ['Associate Software Engineer (ASE)', 'Advanced App Engineering Analyst'], url: 'https://www.accenture.com/in-en/careers/jobsearch?jk=&sb=1&vw=0&is_ugc=0&ct=India', description: 'Delivering 360-degree value by helping clients transform operations.' },
  { id: 'mnc-capgemini', name: 'Capgemini', logo: '/static/images/companies/capgemini.svg', tier: 'Global IT & Engineering Services', category: 'Full-time', location: 'Bengaluru, Hyderabad, Mumbai, Pune, Noida', hiring_tracks: ['Analyst & Software Engineer', 'Cloud & Cybersecurity Specialist'], url: 'https://www.capgemini.com/in-en/careers/job-search/?country_code=in-en&profession=Engineering', description: 'Unleashing human energy through technology for an inclusive future.' },
  { id: 'mnc-ibm', name: 'IBM', logo: '/static/images/companies/ibm.svg', tier: 'Global Cognitive & Hybrid Cloud', category: 'Full-time', location: 'Bengaluru, Kochi, Hyderabad, Gurugram', hiring_tracks: ['Associate System Engineer', 'Cloud Developer', 'AI/ML Specialist'], url: 'https://www.ibm.com/careers/in-en/search?field_keyword_08%5B0%5D=Entry%20Level', description: 'Leading innovation in hybrid cloud, AI, and quantum computing.' },
  { id: 'mnc-pmi', name: 'PM Internship Scheme', logo: '/static/images/companies/pmi.svg', tier: 'National Initiative (Govt of India)', category: 'Internship', location: 'Pan-India', hiring_tracks: ['Top 500 Enterprise Tracks', 'Technology & Manufacturing', 'BFSI & Operations'], url: 'https://pminternship.mca.gov.in/candidate-registration/', description: 'National 1-year corporate internship program by the Ministry of Corporate Affairs.' }
];

// Generate distinct full-time and internship datasets (520 total)
function generateComprehensiveJobs() {
  const jobs = [];

  // 1. Placements / Full-Time Pool (33 distinct enterprise companies)
  const companiesPoolPlacements = [
    { name: 'AccioJob Placement Network', logo: '/static/images/companies/acciojob.svg', source: 'AccioJob Placements', url: 'https://placement.acciojob.com/placements/' },
    { name: 'AICTE National Placement Portal', logo: '/static/images/companies/aicte.svg', source: 'AICTE Placement Portal', url: 'https://placement.aicte-india.org/' },
    { name: 'SJCE Placements Consortium', logo: '/static/images/companies/sjce.svg', source: 'SJCE Placements', url: 'https://sjceplacements.org/current-drives/' },
    { name: 'NMAMIT Campus Placements', logo: '/static/images/companies/nmamit.svg', source: 'NMAMIT Placements', url: 'https://placement.nmamit.in/' },
    { name: 'Naukri Verified Campus Network', logo: '/static/images/companies/naukri.svg', source: 'Naukri.com', url: 'https://www.naukri.com/fresher-jobs-in-india?experience=0' },
    { name: 'Infosys Technologies', logo: '/static/images/companies/infosys.svg', source: 'Campus Hiring Partner', url: 'https://career.infosys.com/joblist?countrycode=IN&companyhiringtype=IL' },
    { name: 'Tata Consultancy Services (TCS)', logo: '/static/images/companies/tcs.svg', source: 'Campus Hiring Partner', url: 'https://www.tcs.com/careers/india' },
    { name: 'Wipro Technologies', logo: '/static/images/companies/wipro.svg', source: 'Campus Hiring Partner', url: 'https://careers.wipro.com/global-india/jobs?keywords=engineer&location=India' },
    { name: 'Zoho Corporation', logo: '/static/images/companies/zoho.svg', source: 'Campus Hiring Partner', url: 'https://www.zoho.com/careers/' },
    { name: 'Razorpay Software', logo: '/static/images/companies/razorpay.svg', source: 'AccioJob Placements', url: 'https://razorpay.com/jobs/' },
    { name: 'PhonePe Payments', logo: '/static/images/companies/phonepe.svg', source: 'AccioJob Placements', url: 'https://www.phonepe.com/careers/job-openings/' },
    { name: 'Swiggy Engineering', logo: '/static/images/companies/swiggy.svg', source: 'Naukri.com', url: 'https://careers.swiggy.com/jobs' },
    { name: 'Zomato Tech Labs', logo: '/static/images/companies/zomato.svg', source: 'Naukri.com', url: 'https://www.zomato.com/careers' },
    { name: 'Cred Tech Labs', logo: '/static/images/companies/cred.svg', source: 'AccioJob Placements', url: 'https://cred.club/careers' },
    { name: 'Juspay Technologies', logo: '/static/images/companies/juspay.svg', source: 'SJCE Placements', url: 'https://juspay.in/careers' },
    { name: 'Paytm Core Engineering', logo: '/static/images/companies/paytm.svg', source: 'AICTE Placement Portal', url: 'https://paytm.com/careers/' },
    { name: 'Meesho Marketplace', logo: '/static/images/companies/meesho.svg', source: 'Naukri.com', url: 'https://www.meesho.io/careers' },
    { name: 'Groww Financial Tech', logo: '/static/images/companies/groww.svg', source: 'AccioJob Placements', url: 'https://groww.in/careers' },
    { name: 'Zerodha Technology', logo: '/static/images/companies/zerodha.svg', source: 'SJCE Placements', url: 'https://zerodha.com/careers/' },
    { name: 'Postman API Platform', logo: '/static/images/companies/postman.svg', source: 'AccioJob Placements', url: 'https://www.postman.com/careers/' },
    { name: 'Cisco Systems India', logo: '/static/images/companies/cisco.svg', source: 'Campus Hiring Partner', url: 'https://jobs.cisco.com/' },
    { name: 'Oracle India Development', logo: '/static/images/companies/oracle.svg', source: 'Campus Hiring Partner', url: 'https://www.oracle.com/careers/' },
    { name: 'SAP Labs India', logo: '/static/images/companies/sap.svg', source: 'Campus Hiring Partner', url: 'https://jobs.sap.com/' },
    { name: 'Adobe Systems India', logo: '/static/images/companies/adobe.svg', source: 'Campus Hiring Partner', url: 'https://adobe.com/careers' },
    { name: 'Intel Corporation India', logo: '/static/images/companies/intel.svg', source: 'Campus Hiring Partner', url: 'https://jobs.intel.com/' },
    { name: 'AMD India R&D', logo: '/static/images/companies/amd.svg', source: 'Campus Hiring Partner', url: 'https://careers.amd.com/' },
    { name: 'Qualcomm Technologies', logo: '/static/images/companies/qualcomm.svg', source: 'Campus Hiring Partner', url: 'https://qualcomm.com/careers' },
    { name: 'Persistent Systems', logo: '/static/images/companies/persistent.svg', source: 'NMAMIT Placements', url: 'https://www.persistent.com/careers/' },
    { name: 'L&T Technology Services', logo: '/static/images/companies/ltts.svg', source: 'AICTE Placement Portal', url: 'https://www.ltts.com/careers' },
    { name: 'HCLTech Software', logo: '/static/images/companies/hcltech.svg', source: 'Campus Hiring Partner', url: 'https://www.hcltech.com/careers' },
    { name: 'Cognizant Technology Solutions', logo: '/static/images/companies/cognizant.svg', source: 'Campus Hiring Partner', url: 'https://careers.cognizant.com/' },
    { name: 'Tech Mahindra', logo: '/static/images/companies/techmahindra.svg', source: 'Campus Hiring Partner', url: 'https://careers.techmahindra.com/' },
    { name: 'LTIMindtree', logo: '/static/images/companies/ltimindtree.svg', source: 'SJCE Placements', url: 'https://www.ltimindtree.com/careers/' }
  ];

  const rolesPoolPlacements = [
    { title: 'Graduate Software Development Engineer (SDE-1)', category: 'Software Engineering', salary: '₹8.0 - ₹18.0 LPA', tags: ['DSA', 'Java', 'Python', 'React'] },
    { title: 'Specialist Programmer & Systems Engineer', category: 'Software Engineering', salary: '₹9.5 - ₹14.0 LPA', tags: ['Java', 'Spring Boot', 'Microservices'] },
    { title: 'TCS Digital / Prime Graduate Developer', category: 'Software Engineering', salary: '₹9.0 - ₹11.5 LPA', tags: ['Python', 'Machine Learning', 'Cloud'] },
    { title: 'National Graduate Engineer Trainee (GET)', category: 'Software Engineering', salary: '₹6.5 - ₹12.0 LPA', tags: ['C++', 'Data Structures', 'Algorithms'] },
    { title: 'Associate Cloud & DevOps Systems Engineer', category: 'Cloud & DevOps', salary: '₹8.0 - ₹15.0 LPA', tags: ['AWS', 'Docker', 'Kubernetes', 'Linux'] },
    { title: 'Junior Backend Developer (Python / Go)', category: 'Software Engineering', salary: '₹7.0 - ₹11.0 LPA', tags: ['Python', 'FastAPI', 'PostgreSQL'] },
    { title: 'Associate Data Engineer & Analytics Trainee', category: 'Data & AI', salary: '₹7.5 - ₹12.5 LPA', tags: ['SQL', 'Python', 'Data Pipelines', 'Spark'] },
    { title: 'Full Stack Web Developer (Node / React)', category: 'Software Engineering', salary: '₹8.5 - ₹16.0 LPA', tags: ['React', 'TypeScript', 'Node.js'] },
    { title: 'Cybersecurity & Infrastructure Analyst', category: 'Cloud & DevOps', salary: '₹7.0 - ₹10.5 LPA', tags: ['Networking', 'Security', 'Linux'] },
    { title: 'Frontend Application Engineer (React/Next)', category: 'Software Engineering', salary: '₹8.0 - ₹14.0 LPA', tags: ['React', 'Next.js', 'CSS3', 'JavaScript'] },
    { title: 'AI & LLM Platform Solutions Engineer', category: 'Data & AI', salary: '₹10.0 - ₹20.0 LPA', tags: ['PyTorch', 'HuggingFace', 'Python'] },
    { title: 'Embedded Firmware & IoT Systems Engineer', category: 'Software Engineering', salary: '₹7.5 - ₹13.0 LPA', tags: ['C/C++', 'RTOS', 'Microcontrollers'] },
    { title: 'Site Reliability & Cloud Security Engineer', category: 'Cloud & DevOps', salary: '₹8.5 - ₹15.5 LPA', tags: ['Terraform', 'Prometheus', 'GCP'] }
  ];

  const locationsPool = [
    { location: 'Bengaluru, Karnataka', mode: 'Hybrid' },
    { location: 'Hyderabad, Telangana', mode: 'Hybrid' },
    { location: 'Pune, Maharashtra', mode: 'Onsite' },
    { location: 'Gurgaon / Noida, Delhi NCR', mode: 'Hybrid' },
    { location: 'Chennai, Tamil Nadu', mode: 'Onsite' },
    { location: 'Mumbai, Maharashtra', mode: 'Hybrid' },
    { location: 'Mysuru, Karnataka', mode: 'Onsite' },
    { location: 'Nitte / Mangaluru, Karnataka', mode: 'Onsite' },
    { location: 'Kochi, Kerala', mode: 'Hybrid' },
    { location: 'Remote, India', mode: 'Remote' }
  ];

  for (let i = 0; i < 260; i++) {
    const comp = companiesPoolPlacements[i % companiesPoolPlacements.length];
    const role = rolesPoolPlacements[i % rolesPoolPlacements.length];
    const loc = locationsPool[i % locationsPool.length];

    const titleText = i < rolesPoolPlacements.length ? role.title : `${role.title} (Track #${i + 1})`;

    jobs.push({
      id: `plc-${i + 1}`,
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
      url: comp.url,
      application_url: comp.url,
      posted_at: '2026-08-28',
      description: `Official full-time graduate recruitment opportunity with ${comp.name}. Open for B.Tech, B.E., M.Tech, and MCA candidates.`
    });
  }

  // 2. Internships & PM Scheme Pool (27 distinct organizations)
  const pmSchemePool = [
    { name: 'Tata Consultancy Services (PM Internship Scheme)', logo: '/static/images/companies/tcs.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Larsen & Toubro (PM Internship Scheme)', logo: '/static/images/companies/ltts.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Reliance Industries (PM Internship Scheme)', logo: '/static/images/companies/reliance.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Tata Motors (PM Internship Scheme)', logo: '/static/images/companies/tatamotors.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'HDFC Bank Tech Labs (PM Internship Scheme)', logo: '/static/images/companies/hdfc.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Mahindra & Mahindra (PM Internship Scheme)', logo: '/static/images/companies/mahindra.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Adani Group Innovation Labs (PM Internship Scheme)', logo: '/static/images/companies/adani.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Maruti Suzuki India (PM Internship Scheme)', logo: '/static/images/companies/maruti.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'NTPC Energy & Automation (PM Internship Scheme)', logo: '/static/images/companies/ntpc.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'ONGC Digital Technologies (PM Internship Scheme)', logo: '/static/images/companies/ongc.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'State Bank of India Tech Labs (PM Scheme)', logo: '/static/images/companies/sbi.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Hindustan Unilever Innovation (PM Scheme)', logo: '/static/images/companies/hul.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'Coal India Digital Trainee (PM Scheme)', logo: '/static/images/companies/coalindia.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'BHEL Engineering (PM Scheme)', logo: '/static/images/companies/bhel.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' },
    { name: 'GAIL Energy Systems (PM Scheme)', logo: '/static/images/companies/gail.svg', url: 'https://pminternship.mca.gov.in/candidate-registration/' }
  ];

  const regionalInternshipPool = [
    { name: 'AICTE National Internship Portal (Hyderabad Hub)', logo: '/static/images/companies/aicte.svg', source: 'AICTE Internship Portal', url: 'https://internship.aicte-india.org/' },
    { name: 'Internshala Verified Tech Partner', logo: '/static/images/companies/ishala.svg', source: 'Internshala', url: 'https://internshala.com/' },
    { name: 'Indeed Tech Opportunities', logo: '/static/images/companies/indeed.svg', source: 'Indeed', url: 'https://in.indeed.com/' },
    { name: 'LinkedIn Regional Network (Hyderabad)', logo: '/static/images/companies/linkedin.svg', source: 'LinkedIn', url: 'https://www.linkedin.com/' },
    { name: 'Wipro AI Labs', logo: '/static/images/companies/wipro.svg', source: 'Campus Hiring Partner', url: 'https://careers.wipro.com/' },
    { name: 'Infosys Springboard Labs', logo: '/static/images/companies/infosys.svg', source: 'Campus Hiring Partner', url: 'https://career.infosys.com/' },
    { name: 'Zoho Creator Tech Internships', logo: '/static/images/companies/zoho.svg', source: 'Campus Hiring Partner', url: 'https://www.zoho.com/' },
    { name: 'Swiggy Product Analytics Intern', logo: '/static/images/companies/swiggy.svg', source: 'Internshala', url: 'https://careers.swiggy.com/' },
    { name: 'Razorpay Frontend Developer Intern', logo: '/static/images/companies/razorpay.svg', source: 'LinkedIn', url: 'https://razorpay.com/' },
    { name: 'Google University Internships', logo: '/static/images/companies/google.svg', source: 'Campus Hiring Partner', url: 'https://google.com/careers' },
    { name: 'Microsoft University Internships', logo: '/static/images/companies/microsoft.svg', source: 'Campus Hiring Partner', url: 'https://microsoft.com/careers' },
    { name: 'Amazon Student Intern Programs', logo: '/static/images/companies/amazon.svg', source: 'Campus Hiring Partner', url: 'https://amazon.jobs/' }
  ];

  const rolesPoolInternships = [
    { title: 'Data Engineering & Analytics Intern', category: 'Data & AI', salary: '₹5,000/mo + ₹6,000 Grant', tags: ['PM Scheme', 'Python', 'SQL', 'Data Pipelines'] },
    { title: 'Cloud Infrastructure & DevOps Intern', category: 'Cloud & DevOps', salary: '₹5,000/mo + ₹6,000 Grant', tags: ['PM Scheme', 'Linux', 'AWS', 'Docker'] },
    { title: 'Smart Cities & IoT Software Intern', category: 'Software Engineering', salary: '₹15,000 - ₹20,000/mo', tags: ['AICTE', 'IoT', 'Embedded', 'Python'] },
    { title: 'Full Stack Web Development Intern', category: 'Software Engineering', salary: '₹18,000 - ₹25,000/mo', tags: ['React', 'Node.js', 'REST APIs'] },
    { title: 'AI & Machine Learning Research Intern', category: 'Data & AI', salary: '₹25,000 - ₹35,000/mo', tags: ['PyTorch', 'LLMs', 'NLP'] },
    { title: 'Frontend & React Native Intern', category: 'Software Engineering', salary: '₹20,000 - ₹30,000/mo', tags: ['React Native', 'TypeScript', 'UI/UX'] },
    { title: 'Backend Services & Microservices Intern', category: 'Software Engineering', salary: '₹22,000 - ₹32,000/mo', tags: ['Python', 'FastAPI', 'MongoDB'] },
    { title: 'Enterprise QA Automation Intern', category: 'Software Engineering', salary: '₹15,000 - ₹22,000/mo', tags: ['Selenium', 'Python', 'Jest'] },
    { title: 'Generative AI & Prompt Engineering Intern', category: 'Data & AI', salary: '₹28,000 - ₹40,000/mo', tags: ['LLMs', 'RAG', 'LangChain'] },
    { title: 'Cybersecurity Threat Analysis Intern', category: 'Cloud & DevOps', salary: '₹20,000 - ₹28,000/mo', tags: ['Wireshark', 'SOC', 'Linux'] }
  ];

  for (let i = 0; i < 260; i++) {
    let compName, compLogo, compSource, compUrl, jType;

    if (i % 2 === 0) {
      const p = pmSchemePool[(Math.floor(i / 2)) % pmSchemePool.length];
      compName = p.name;
      compLogo = p.logo;
      compSource = 'PM Internship Scheme';
      compUrl = p.url;
      jType = 'PM Internship Scheme';
    } else {
      const r = regionalInternshipPool[(Math.floor(i / 2)) % regionalInternshipPool.length];
      compName = r.name;
      compLogo = r.logo;
      compSource = r.source;
      compUrl = r.url;
      jType = 'Internship';
    }

    const role = rolesPoolInternships[i % rolesPoolInternships.length];
    const loc = locationsPool[i % locationsPool.length];
    const titleText = i < rolesPoolInternships.length ? role.title : `${role.title} (Batch #${i + 1})`;

    jobs.push({
      id: `int-${i + 1}`,
      title: titleText,
      company: compName,
      company_name: compName,
      logo: compLogo,
      location: loc.location,
      work_mode: loc.mode,
      job_type: jType,
      salary: role.salary,
      experience: 'Fresher / College Student',
      category: role.category,
      tags: [...role.tags, compSource.split(' ')[0]],
      source: compSource,
      url: compUrl,
      application_url: compUrl,
      posted_at: '2026-08-28',
      description: `Hands-on structured internship opportunity with ${compName}. Mentorship, live project exposure, and pre-placement evaluation.`
    });
  }

  return jobs;
}

const ALL_JOBS = generateComprehensiveJobs();

// GET /api/jobs (Filter by job_type, search query, work mode, category, pagination)
exports.getJobs = async (req, res) => {
  const { q, category, work_mode, job_type, experience, source, page = 1, limit = 12 } = req.query;

  let filtered = [...ALL_JOBS];

  // 1. Strict Category / Job Type Filter
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

  // 2. Search Query Filter
  if (q) {
    const queryStr = q.toLowerCase();
    filtered = filtered.filter(j => 
      j.title.toLowerCase().includes(queryStr) || 
      (j.company && j.company.toLowerCase().includes(queryStr)) ||
      (j.company_name && j.company_name.toLowerCase().includes(queryStr)) ||
      (j.location && j.location.toLowerCase().includes(queryStr)) ||
      (j.tags && j.tags.some(t => t.toLowerCase().includes(queryStr)))
    );
  }

  // 3. Work Mode Filter
  if (work_mode) {
    filtered = filtered.filter(j => j.work_mode.toLowerCase() === work_mode.toLowerCase());
  }

  // 4. Category Filter
  if (category) {
    filtered = filtered.filter(j => j.category.toLowerCase() === category.toLowerCase());
  }

  // 5. Source Filter
  if (source) {
    filtered = filtered.filter(j => j.source.toLowerCase().includes(source.toLowerCase()));
  }

  const totalMatching = filtered.length;
  const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  const totalPages = Math.max(1, Math.ceil(totalMatching / perPage));
  const pageNum = Math.min(totalPages, Math.max(1, parseInt(page, 10) || 1));
  const startIndex = (pageNum - 1) * perPage;
  const paginatedJobs = filtered.slice(startIndex, startIndex + perPage);

  // Global counts across entire dataset
  const totalAllCount = ALL_JOBS.length;
  const totalPlacementsCount = ALL_JOBS.filter(j => j.job_type === 'Full-time').length;
  const totalInternshipsCount = ALL_JOBS.filter(j => j.job_type === 'Internship' || j.job_type === 'PM Internship Scheme').length;

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

// Helper to resolve any opportunity by ID across ALL_JOBS (520 scale dataset) and FEATURED_MNC_COMPANIES
function findOpportunityById(jobId) {
  if (!jobId) return null;

  // 1. Check generated 520 full-time & internship jobs (plc-1..260, int-1..260)
  const standardJob = ALL_JOBS.find(j => j.id === jobId);
  if (standardJob) return standardJob;

  // 2. Check Tier-1 Corporate Partners (mnc-*) with alias resolution
  const mnc = FEATURED_MNC_COMPANIES.find(c =>
    c.id === jobId ||
    (c.id === 'mnc-microsoft' && jobId === 'mnc-msft') ||
    (c.id === 'mnc-infosys' && jobId === 'mnc-infy') ||
    (c.id === 'mnc-techmahindra' && jobId === 'mnc-tm')
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
      description: mnc.description,
      hiring_tracks: mnc.hiring_tracks,
      tier: mnc.tier
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
      redirectUrl: job.url || job.application_url
    }
  });
};

// GET /api/jobs/skill-up (Returns the 28 curated student skill-up opportunities)
exports.getSkillUpOpportunities = async (req, res) => {
  const skillUpData = require('../data/skillUpData');
  const { q, category, status } = req.query;

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
