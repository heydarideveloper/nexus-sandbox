import type { Profile } from './schema';

const CANONICAL = ['resume/resume.tex', 'resume/MOHAMMAD_HEYDARI_Full (1).pdf'];

export const profile: Profile = {
  name: 'Mohammad Heydari',
  headline: 'Senior Full-Stack Engineer & Frontend Team Lead',
  roles: [
    'Senior Full Stack Engineer',
    'Product Builder',
    'AI-Native Engineer',
    'Frontend Team Lead',
    'Automation Engineer',
    'System Architect',
    'Lifelong Learner',
  ],
  location: 'Yerevan, Armenia',
  email: 'm.heydari.developer@gmail.com',
  phone: '+374 55 599434',
  github: 'https://github.com/heydarideveloper',
  githubHandle: 'heydarideveloper',
  linkedin: 'https://www.linkedin.com/in/mohammad-heydari-72391a1a1/',
  linkedinHandle: 'mohammad-heydari',
  summary:
    'Full-Stack Engineer and Tech Lead with over 10 years of experience building and scaling software across FinTech, Blockchain, SaaS, Core Banking, and Telemedicine. Expert in designing high-performance frontend architectures and aligning them with complex backend systems. Experienced in moving products from MVP to high-scale production while focusing on data consistency, system performance, and clear system architecture.',
  identityStatement:
    'I design systems, not screens. I take products from first commit to hundreds of thousands of users, across the boundary between frontend and backend, in domains where correctness is non-negotiable — and I never stop learning.',
  leadershipPhilosophy:
    'Facilitate technical decision-making within the team rather than dictating choices. Define boundaries and guide architecture discovery using structured frameworks (like Six Thinking Hats and Decide).',
  stats: [
    {
      id: 'years',
      label: 'Years Experience',
      value: 10,
      suffix: '+',
      context: 'Junior PHP/Android in 2015 to Senior Full-Stack and Team Lead today.',
      sourceRefs: CANONICAL,
    },
    {
      id: 'users',
      label: 'Users Served',
      value: 540000,
      suffix: '+',
      context: 'Portal.ir SaaS platform where he led React/Next.js architecture.',
      sourceRefs: CANONICAL,
    },
    {
      id: 'websites',
      label: 'Active Websites',
      value: 10000,
      suffix: '+',
      context: 'Multi-tenant sites created and managed on Portal.ir.',
      sourceRefs: CANONICAL,
    },
    {
      id: 'concurrent',
      label: 'Concurrent Sessions',
      value: 7000,
      suffix: '+',
      context: 'Live sessions kept stable on the Pezeshket telemedicine platform.',
      sourceRefs: CANONICAL,
    },
    {
      id: 'doctors',
      label: 'Doctors On Platform',
      value: 5000,
      suffix: '+',
      context: 'Certified medical professionals using Pezeshket daily.',
      sourceRefs: CANONICAL,
    },
    {
      id: 'languages',
      label: 'Languages In VoKaN',
      value: 13,
      suffix: '+',
      context: 'Lazy translation pipelines and FSRS scheduling shipped for 13+ languages.',
      sourceRefs: CANONICAL,
    },
  ],
  sourceRefs: CANONICAL,
};
