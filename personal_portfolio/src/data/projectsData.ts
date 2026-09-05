export interface Project {
  id: string;
  number: string;
  title: string;
  type: 'PERSONAL PROJECT' | 'OFFICE PROJECT';
  status: 'Completed' | 'Live Project' | 'Currently Working';
  platform?: string;
  description: string;
  imageUrl?: string;
  technology: string[];
  githubUrl?: string;
  liveUrl?: string;
  hasScreenshots?: boolean;
  problemStatement?: string;
  solutionStatement?: string;
  myContribution?: string[];
  keyFeatures?: string[];
}

export const PROJECTS_DATA: Project[] = [
  {
    id: '001',
    number: 'PROJECT 001',
    title: 'Landing Page for a Marketing Campaign',
    type: 'PERSONAL PROJECT',
    status: 'Completed',
    platform: 'Web',
    description: 'A responsive marketing campaign landing page focused on visual presentation, user engagement, responsive design, and conversion-oriented content.',
    imageUrl: "/projects/LandingPage/L2.png",
    technology: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Tailwind CSS'],
    githubUrl: 'https://github.com/A-PRASATHARUMUGAM',
    problemStatement: 'Marketing campaigns frequently struggle with high drop-off rates due to non-responsive layouts, poor loading speeds, and unoptimized visual hierarchies.',
    solutionStatement: 'Engineered a lightweight, modular React landing page structured around high-contrast typography and subtle micro-interactions to maximize engagement.',
    myContribution: [
      'Architected end-to-end component hierarchy in React and Tailwind CSS.',
      'Implemented responsive visual presentation layouts optimized across mobile and desktop viewpoints.',
      'Configured interactive UI states to drive user conversion paths.'
    ],
    keyFeatures: [
      'Conversion-Optimized Layout Strategy',
      'Ultra-Fast Load Performance & Lightweight Bundling',
      'Fully Responsive Cross-Browser Layout'
    ]
  },
  {
    id: '002',
    number: 'PROJECT 002',
    title: 'PhonePe Settlement Tracker',
    type: 'OFFICE PROJECT',
    status: 'Live Project',
    platform: 'Web',
    description: 'A settlement tracking application developed to simplify the monitoring and management of PhonePe transaction settlement information.',
    technology: ['React', 'TypeScript', 'Node.js', 'Express.js', 'MySQL'],
    hasScreenshots: true,
    problemStatement: 'Manual reconciliation and cross-referencing of daily PhonePe payment gateway settlements were error-prone and time-consuming.',
    solutionStatement: 'Designed a centralized tracking dashboard that parses, aggregates, and reports real-time transaction settlements via automated backend pipelines.',
    myContribution: [
      'Developed core front-end telemetry components with React and TypeScript.',
      'Constructed RESTful backend endpoints in Express.js for aggregate transaction queries.',
      'Optimized MySQL schema and indexing for real-time reporting speeds.'
    ],
    keyFeatures: [
      'Automated Settlement Reconciliation Dashboard',
      'Real-Time Transaction Status Tracking',
      'Role-Based Data Filtering & Analytical Views'
    ]
  },
  {
    id: '003',
    number: 'PROJECT 003',
    title: 'First Aid Website',
    type: 'PERSONAL PROJECT',
    status: 'Completed',
    platform: 'Web',
    description: 'A web-based first-aid information platform designed to provide accessible emergency and first-aid guidance through a simple and responsive interface.',
    technology: ['HTML5', 'CSS3', 'JavaScript', 'React'],
    githubUrl: 'https://github.com/A-PRASATHARUMUGAM',
    problemStatement: 'Critical first-aid protocols are often difficult to navigate rapidly during real-time emergency situations due to bloated web pages.',
    solutionStatement: 'Built an ultra-minimalist, low-latency guide application prioritizing instant searchability and high-contrast emergency procedural cards.',
    myContribution: [
      'Designed emergency-focused UI/UX interaction hierarchy.',
      'Built fast client-side rendering views using React and clean state management.',
      'Implemented offline-first accessibility optimizations.'
    ],
    keyFeatures: [
      'Instant Diagnostic Emergency Decision Trees',
      'Zero-Latency Responsive Layout',
      'High-Contrast Medical Protocol Guides'
    ]
  },
  {
    id: '004',
    number: 'PROJECT 004',
    title: 'Election Communication Project',
    type: 'OFFICE PROJECT',
    status: 'Live Project',
    platform: 'Web',
    description: 'A communication-focused web application/project developed for managing and delivering structured election-related communication and information.',
    technology: ['React', 'Node.js', 'Express.js', 'MySQL'],
    hasScreenshots: true,
    problemStatement: 'Delivering structured, time-sensitive election communications across decentralized teams without centralized audit trails leads to data fragmentation.',
    solutionStatement: 'Engineered a secure multi-channel dispatch and logging hub that enables structured message formatting and live transmission status tracking.',
    myContribution: [
      'Architected the React dynamic message template component pipeline.',
      'Implemented MySQL transaction logging for audited dispatch operations.',
      'Created granular real-time broadcast status views.'
    ],
    keyFeatures: [
      'Structured Broadcast Management Infrastructure',
      'Audited Dispatch Logs & Delivery Monitoring',
      'Role-Restricted Administrative Controls'
    ]
  },
  {
    id: '005',
    number: 'PROJECT 005',
    title: 'Crowdfunding Platform',
    type: 'PERSONAL PROJECT',
    status: 'Completed',
    platform: 'Web',
    description: 'A crowdfunding platform concept focused on presenting campaigns, managing project information, and creating a structured user experience for fundraising.',
    technology: ['React', 'Node.js', 'Express.js', 'MySQL'],
    githubUrl: 'https://github.com/A-PRASATHARUMUGAM',
    problemStatement: 'Conceptual campaign creators lack simple, cohesive platforms to publish structured project metadata and track fundraising milestones cleanly.',
    solutionStatement: 'Created a full-stack crowdfunding system complete with campaign builder tools, goal progression indicators, and backer contribution trackers.',
    myContribution: [
      'Engineered backend API endpoints for campaign creation, updating, and querying.',
      'Developed reactive state structures for real-time progress calculations.',
      'Formulated MySQL normalized schemas for users, campaigns, and pledges.'
    ],
    keyFeatures: [
      'Campaign Metadata Management Interface',
      'Real-Time Dynamic Goal Progression Bars',
      'Structured Backer Directory & Analytics'
    ]
  },
  {
    id: '006',
    number: 'PROJECT 006',
    title: 'Rotary PortAI Management Project',
    type: 'OFFICE PROJECT',
    status: 'Currently Working',
    platform: 'Web',
    description: 'A web application designed to modernize and streamline the Rotary Minutes of Meeting workflow, transforming a traditionally manual process into a structured digital workflow.',
    technology: ['React', 'TypeScript', 'Node.js', 'Express.js', 'Prisma', 'MySQL'],
    hasScreenshots: true,
    problemStatement: 'Traditional, non-standardized Rotary Minutes of Meeting (MoM) collection led to administrative delays, lost action items, and manual PDF generation overhead.',
    solutionStatement: 'Developing an end-to-end digital workflow hub that unifies attendance, agenda planning, live minute capture, validation loops, and automated PDF delivery.',
    myContribution: [
      'Lead full-stack developer engineering the multi-stage digital MoM validation pipeline.',
      'Designed Prisma ORM data schemas for complex relational entities (Meetings, Actions, Decisions).',
      'Constructed automated PDF generation server hooks with dynamic preview rendering.'
    ],
    keyFeatures: [
      'Automated PDF Generation, Live Preview, and Signing Workflows',
      'Integrated Agenda, Attendance, Discussions, and Action Items Hub',
      'Granular Role-Based Access Control (RBAC) & Secure Storage'
    ]
  }
];