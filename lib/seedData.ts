import { DatabaseSchema } from './db';
import {
  User, Student, College, Company, Job, JobSkillRequirement, Skill, Course, CourseModule,
  Lesson, Assessment, Question, CollegeCurriculum, CareerPath, PlacementDrive, Notification,
  Project, Certificate,
  Country, Region, City, Industry, SkillCategoryEntity, JobRole, EmploymentOutcome,
  RegionalProfile, RegionalIntelligenceRecord, SkillRelationship
} from './types';

export function generateInitialDatabase(): DatabaseSchema {
  const users: User[] = [
    // Students
    { id: 'u_student_1', email: 'alex.rivera@student.skill2hire.com', phone: '+91 98765 43210', passwordHash: 'demo123', role: 'student', name: 'Alex Rivera', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', createdAt: '2026-01-10T10:00:00Z' },
    { id: 'u_student_2', email: 'priya.sharma@student.skill2hire.com', phone: '+91 98765 43201', passwordHash: 'demo123', role: 'student', name: 'Priya Sharma', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80', createdAt: '2026-01-11T10:00:00Z' },
    { id: 'u_student_3', email: 'rohan.mehta@student.skill2hire.com', phone: '+91 98765 43202', passwordHash: 'demo123', role: 'student', name: 'Rohan Mehta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', createdAt: '2026-01-12T10:00:00Z' },
    { id: 'u_student_4', email: 'ananya.roy@student.skill2hire.com', phone: '+91 98765 43203', passwordHash: 'demo123', role: 'student', name: 'Ananya Roy', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80', createdAt: '2026-01-13T10:00:00Z' },
    { id: 'u_student_5', email: 'marcus.vance@student.skill2hire.com', phone: '+91 98765 43204', passwordHash: 'demo123', role: 'student', name: 'Marcus Vance', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80', createdAt: '2026-01-14T10:00:00Z' },
    
    // Colleges
    { id: 'u_col_1', email: 'admin@apexuniversity.edu', phone: '+91 98765 43211', passwordHash: 'demo123', role: 'college', name: 'Apex University Placement Cell', avatar: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80', createdAt: '2025-11-01T10:00:00Z' },
    { id: 'u_col_2', email: 'placement@stanfordtech.edu', phone: '+91 98765 43222', passwordHash: 'demo123', role: 'college', name: 'Stanford Tech Institute', avatar: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=150&auto=format&fit=crop&q=80', createdAt: '2025-11-02T10:00:00Z' },
    { id: 'u_col_3', email: 'careers@mitacademy.edu', phone: '+91 98765 43223', passwordHash: 'demo123', role: 'college', name: 'MIT Tech Academy', avatar: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=150&auto=format&fit=crop&q=80', createdAt: '2025-11-03T10:00:00Z' },
    { id: 'u_col_4', email: 'placement@siliconcollege.edu', phone: '+91 98765 43224', passwordHash: 'demo123', role: 'college', name: 'Silicon Valley College', avatar: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=150&auto=format&fit=crop&q=80', createdAt: '2025-11-04T10:00:00Z' },
    { id: 'u_col_5', email: 'admin@globaleng.edu', phone: '+91 98765 43225', passwordHash: 'demo123', role: 'college', name: 'Global Engineering Institute', avatar: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=150&auto=format&fit=crop&q=80', createdAt: '2025-11-05T10:00:00Z' },

    // Companies
    { id: 'u_comp_1', email: 'recruiter@technova.com', phone: '+91 98765 43212', passwordHash: 'demo123', role: 'company', name: 'TechNova Recruiter Hub', avatar: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80', createdAt: '2025-10-10T10:00:00Z' },
    { id: 'u_comp_2', email: 'talent@innosoft.com', phone: '+91 98765 43232', passwordHash: 'demo123', role: 'company', name: 'InnoSoft Technologies', avatar: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80', createdAt: '2025-10-11T10:00:00Z' },
    { id: 'u_comp_3', email: 'hiring@datasphere.io', phone: '+91 98765 43233', passwordHash: 'demo123', role: 'company', name: 'DataSphere Analytics', avatar: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80', createdAt: '2025-10-12T10:00:00Z' },
    { id: 'u_comp_4', email: 'careers@cloudcore.com', phone: '+91 98765 43234', passwordHash: 'demo123', role: 'company', name: 'CloudCore Systems', avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=150&auto=format&fit=crop&q=80', createdAt: '2025-10-13T10:00:00Z' },
    { id: 'u_comp_5', email: 'jobs@finedge.com', phone: '+91 98765 43235', passwordHash: 'demo123', role: 'company', name: 'FinEdge Capital', avatar: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=150&auto=format&fit=crop&q=80', createdAt: '2025-10-14T10:00:00Z' },
    
    // Admin
    { id: 'u_admin', email: 'admin@skill2hire.com', phone: '+91 98765 43213', passwordHash: 'b19b5d4cd462d2dc0bb89ce5ff0e6ca96a32fdf97c30f5e97de7f0e611bba16a', role: 'admin', name: 'Skill2Hire SuperAdmin', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80', createdAt: '2025-01-01T00:00:00Z' }
  ];

  const colleges: College[] = [
    {
      id: 'col_1',
      userId: 'u_col_1',
      name: 'Apex University of Engineering',
      code: 'APEX-ENG',
      email: 'admin@apexuniversity.edu',
      phone: '+1 (555) 234-5678',
      location: 'Austin, TX',
      website: 'https://apexuniversity.edu',
      establishedYear: 1984,
      totalStudents: 2500,
      placementRate: 84.5,
      bio: 'Premier engineering and technology university dedicated to industry-aligned workforce preparation and hands-on skill development.'
    },
    {
      id: 'col_2',
      userId: 'u_col_2',
      name: 'Stanford Tech Institute',
      code: 'STAN-TECH',
      email: 'placement@stanfordtech.edu',
      phone: '+1 (555) 345-6789',
      location: 'Palo Alto, CA',
      website: 'https://stanfordtech.edu',
      establishedYear: 1992,
      totalStudents: 3200,
      placementRate: 91.2,
      bio: 'Pioneering technical institute driving cutting-edge computer science and engineering placement excellence.'
    },
    {
      id: 'col_3',
      userId: 'u_col_3',
      name: 'MIT Tech Academy',
      code: 'MIT-TECH',
      email: 'careers@mitacademy.edu',
      phone: '+1 (555) 456-7890',
      location: 'Cambridge, MA',
      website: 'https://mitacademy.edu',
      establishedYear: 1978,
      totalStudents: 2800,
      placementRate: 94.0,
      bio: 'World-class academic institution emphasizing algorithm rigor, AI research, and high-impact corporate partnerships.'
    },
    {
      id: 'col_4',
      userId: 'u_col_4',
      name: 'Silicon Valley College',
      code: 'SVC-TECH',
      email: 'placement@siliconcollege.edu',
      phone: '+1 (555) 567-8901',
      location: 'San Jose, CA',
      website: 'https://siliconcollege.edu',
      establishedYear: 2001,
      totalStudents: 1950,
      placementRate: 88.0,
      bio: 'Located in the heart of Silicon Valley, connecting top talent with high-growth startups and tech giants.'
    },
    {
      id: 'col_5',
      userId: 'u_col_5',
      name: 'Global Engineering Institute',
      code: 'GEI-TECH',
      email: 'admin@globaleng.edu',
      phone: '+1 (555) 678-9012',
      location: 'Seattle, WA',
      website: 'https://globaleng.edu',
      establishedYear: 1995,
      totalStudents: 2100,
      placementRate: 82.3,
      bio: 'Fostering globally competitive engineers with deep foundations in software architecture and cloud computing.'
    }
  ];

  const companies: Company[] = [
    {
      id: 'comp_1',
      userId: 'u_comp_1',
      name: 'TechNova',
      industry: 'Enterprise Software & Cloud',
      location: 'San Francisco, CA',
      website: 'https://technova-example.com',
      size: '500-1,000 employees',
      description: 'TechNova is an enterprise software leader creating high-throughput distributed systems, AI tools, and scalable cloud solutions.',
      verified: true
    },
    {
      id: 'comp_2',
      userId: 'u_comp_2',
      name: 'InnoSoft',
      industry: 'AI & Data Platforms',
      location: 'New York, NY',
      website: 'https://innosoft-example.com',
      size: '200-500 employees',
      description: 'Building intelligent workflows, predictive machine learning platforms, and enterprise data analytics software.',
      verified: true
    },
    {
      id: 'comp_3',
      userId: 'u_comp_3',
      name: 'DataSphere',
      industry: 'Big Data & Analytics',
      location: 'Chicago, IL',
      website: 'https://datasphere-example.com',
      size: '1,000+ employees',
      description: 'Global big data intelligence provider powering analytics and real-time processing for Fortune 500 companies.',
      verified: true
    },
    {
      id: 'comp_4',
      userId: 'u_comp_4',
      name: 'CloudCore',
      industry: 'Cloud Infrastructure & DevOps',
      location: 'Seattle, WA',
      website: 'https://cloudcore-example.com',
      size: '100-250 employees',
      description: 'Next-generation cloud optimization, Kubernetes orchestration, and serverless infrastructure tooling.',
      verified: true
    },
    {
      id: 'comp_5',
      userId: 'u_comp_5',
      name: 'FinEdge',
      industry: 'Financial Technology',
      location: 'Boston, MA',
      website: 'https://finedge-example.com',
      size: '500-1,000 employees',
      description: 'Algorithmic trading systems, banking APIs, and high-frequency financial intelligence software.',
      verified: true
    },
    {
      id: 'comp_6',
      userId: 'u_comp_6',
      name: 'NextGen AI',
      industry: 'Generative AI & LLM Systems',
      location: 'Palo Alto, CA',
      website: 'https://nextgenai-example.com',
      size: '50-100 employees',
      description: 'Pioneering frontier autonomous agent frameworks and developer AI productivity suites.',
      verified: true
    },
    {
      id: 'comp_7',
      userId: 'u_comp_7',
      name: 'CyberShield',
      industry: 'Cybersecurity',
      location: 'Washington, DC',
      website: 'https://cybershield-example.com',
      size: '250-500 employees',
      description: 'Zero-trust security mesh, automated threat intelligence, and enterprise penetration testing.',
      verified: true
    },
    {
      id: 'comp_8',
      userId: 'u_comp_8',
      name: 'PulseHealth',
      industry: 'HealthTech & Digital Care',
      location: 'San Diego, CA',
      website: 'https://pulsehealth-example.com',
      size: '100-250 employees',
      description: 'Transforming clinical workflows, telehealth intelligence, and medical device data connectivity.',
      verified: true
    },
    {
      id: 'comp_9',
      userId: 'u_comp_9',
      name: 'ByteWave',
      industry: 'Consumer Tech & Mobile',
      location: 'Los Angeles, CA',
      website: 'https://bytewave-example.com',
      size: '150-300 employees',
      description: 'Building viral consumer applications, interactive video streaming platforms, and social graphs.',
      verified: true
    },
    {
      id: 'comp_10',
      userId: 'u_comp_10',
      name: 'Apex Logistics',
      industry: 'Supply Chain & IoT',
      location: 'Atlanta, GA',
      website: 'https://apexlogistics-example.com',
      size: '1,000+ employees',
      description: 'Automated warehouse robotics, IoT fleet tracking, and algorithmic route optimization.',
      verified: true
    }
  ];

  const students: Student[] = [
    {
      id: 'std_1',
      userId: 'u_student_1',
      fullName: 'Alex Rivera',
      email: 'alex.rivera@student.skill2hire.com',
      phone: '+1 (555) 123-4567',
      collegeId: 'col_1',
      collegeName: 'Apex University of Engineering',
      degree: 'B.S.',
      department: 'Computer Science',
      graduationYear: 2026,
      cgpa: 8.6,
      location: 'Austin, TX',
      bio: 'Aspiring Full Stack & Software Engineer eager to build scalable web platforms, distributed systems, and real-world tools.',
      placementStatus: 'In Training',
      placementReadiness: 62
    },
    {
      id: 'std_2',
      userId: 'u_student_2',
      fullName: 'Priya Sharma',
      email: 'priya.sharma@student.skill2hire.com',
      phone: '+1 (555) 234-5679',
      collegeId: 'col_1',
      collegeName: 'Apex University of Engineering',
      degree: 'B.Tech',
      department: 'Information Technology',
      graduationYear: 2026,
      cgpa: 9.1,
      location: 'Austin, TX',
      bio: 'Passionate about Data Science, Machine Learning, and Big Data processing algorithms.',
      placementStatus: 'Placement Ready',
      placementReadiness: 88
    },
    {
      id: 'std_3',
      userId: 'u_student_3',
      fullName: 'Rohan Mehta',
      email: 'rohan.mehta@student.skill2hire.com',
      phone: '+1 (555) 345-6780',
      collegeId: 'col_2',
      collegeName: 'Stanford Tech Institute',
      degree: 'B.S.',
      department: 'Computer Science',
      graduationYear: 2026,
      cgpa: 8.8,
      location: 'Palo Alto, CA',
      bio: 'Systems programmer focused on high-performance C++, operating systems, and distributed database internals.',
      placementStatus: 'Placement Ready',
      placementReadiness: 92
    },
    {
      id: 'std_4',
      userId: 'u_student_4',
      fullName: 'Ananya Roy',
      email: 'ananya.roy@student.skill2hire.com',
      phone: '+1 (555) 456-7891',
      collegeId: 'col_3',
      collegeName: 'MIT Tech Academy',
      degree: 'B.S.',
      department: 'Software Engineering',
      graduationYear: 2026,
      cgpa: 8.4,
      location: 'Cambridge, MA',
      bio: 'Cloud architecture & DevOps enthusiast with hands-on experience in Docker, Kubernetes, and CI/CD pipelines.',
      placementStatus: 'In Training',
      placementReadiness: 70
    },
    {
      id: 'std_5',
      userId: 'u_student_5',
      fullName: 'Marcus Vance',
      email: 'marcus.vance@student.skill2hire.com',
      phone: '+1 (555) 567-8902',
      collegeId: 'col_4',
      collegeName: 'Silicon Valley College',
      degree: 'B.S.',
      department: 'Computer Engineering',
      graduationYear: 2026,
      cgpa: 7.8,
      location: 'San Jose, CA',
      bio: 'Web and mobile application developer passionate about clean UI, React, and seamless user experiences.',
      placementStatus: 'Needs Training',
      placementReadiness: 55
    }
  ];

  // Add 16 more students to exceed 20+ requirement
  const extraStudentNames = [
    ['David Chen', 'Computer Science', 8.9, 'col_1', 'Placement Ready', 85],
    ['Sarah Jenkins', 'Data Science', 9.2, 'col_2', 'Placement Ready', 90],
    ['Michael Zhang', 'Computer Science', 7.9, 'col_1', 'In Training', 64],
    ['Emily Davis', 'Software Engineering', 8.5, 'col_3', 'Placement Ready', 82],
    ['Vikram Patel', 'Information Technology', 7.6, 'col_1', 'Needs Training', 52],
    ['Jessica Martinez', 'Computer Science', 8.7, 'col_4', 'Placement Ready', 86],
    ['Kevin Taylor', 'Cloud Engineering', 8.1, 'col_5', 'In Training', 68],
    ['Rachel Kim', 'Data Analytics', 9.0, 'col_2', 'Placement Ready', 89],
    ['Brandon Scott', 'Computer Science', 7.4, 'col_4', 'Needs Training', 48],
    ['Neha Gupta', 'Computer Science', 8.8, 'col_1', 'Placement Ready', 87],
    ['Lucas Silva', 'Software Engineering', 8.3, 'col_3', 'In Training', 72],
    ['Hannah Wilson', 'Information Systems', 7.7, 'col_5', 'Needs Training', 56],
    ['Arjun Nair', 'Computer Science', 8.6, 'col_1', 'Placement Ready', 84],
    ['Chloe Bennett', 'Data Science', 8.9, 'col_2', 'Placement Ready', 88],
    ['Daniel Wright', 'Computer Engineering', 7.5, 'col_4', 'Needs Training', 50],
    ['Zoya Khan', 'Computer Science', 9.3, 'col_3', 'Placement Ready', 94]
  ];

  extraStudentNames.forEach((item, idx) => {
    const sId = `std_${idx + 6}`;
    const college = colleges.find(c => c.id === item[3]) || colleges[0];
    students.push({
      id: sId,
      userId: `u_std_${idx + 6}`,
      fullName: item[0] as string,
      email: `${(item[0] as string).toLowerCase().replace(' ', '.')}@student.skill2hire.com`,
      phone: `+1 (555) 789-${1000 + idx}`,
      collegeId: college.id,
      collegeName: college.name,
      degree: 'B.S.',
      department: item[1] as string,
      graduationYear: 2026,
      cgpa: item[2] as number,
      location: college.location,
      bio: `Final-year student specializing in ${item[1]} with a focus on industry problem solving and technical excellence.`,
      placementStatus: item[4] as Student['placementStatus'],
      placementReadiness: item[5] as number
    });
  });

  const skills: Skill[] = [
    // Programming
    {
      id: 'sk_python',
      name: 'Python',
      category: 'Programming',
      subcategory: 'Backend & Data Scripting',
      description: 'General-purpose, interpreted, high-level programming language for scripting, backend, data science, and AI.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_javascript', 'sk_cpp', 'sk_java'],
      prerequisite_skills: ['sk_oop'],
      complementary_skills: ['sk_sql', 'sk_pandas', 'sk_dsa', 'sk_docker'],
      status: 'active',
      industryDemandPercent: 88,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_cpp',
      name: 'C++',
      category: 'Programming',
      subcategory: 'Systems & High-Performance',
      description: 'High-performance compiled language used for systems programming, game development, and competitive programming.',
      difficulty: 'Advanced',
      parent_skill_id: 'sk_c',
      related_skills: ['sk_c', 'sk_java'],
      prerequisite_skills: ['sk_c', 'sk_oop'],
      complementary_skills: ['sk_dsa', 'sk_linux', 'sk_system_design'],
      status: 'active',
      industryDemandPercent: 65,
      demandLevel: 'High'
    },
    {
      id: 'sk_java',
      name: 'Java',
      category: 'Programming',
      subcategory: 'Enterprise & Distributed Systems',
      description: 'Enterprise-grade object-oriented language for large-scale microservices, Android, and distributed systems.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_cpp', 'sk_python', 'sk_typescript'],
      prerequisite_skills: ['sk_oop'],
      complementary_skills: ['sk_sql', 'sk_dsa', 'sk_docker', 'sk_system_design'],
      status: 'active',
      industryDemandPercent: 72,
      demandLevel: 'High'
    },
    {
      id: 'sk_javascript',
      name: 'JavaScript',
      category: 'Programming',
      subcategory: 'Web Scripting & Runtimes',
      description: 'Core programming language of the web, powering frontend UI and Node.js backend services.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_typescript', 'sk_python'],
      prerequisite_skills: ['sk_html_css'],
      complementary_skills: ['sk_react', 'sk_nodejs', 'sk_rest_api'],
      status: 'active',
      industryDemandPercent: 82,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_typescript',
      name: 'TypeScript',
      category: 'Programming',
      subcategory: 'Typed Web Architecture',
      description: 'Strongly typed superset of JavaScript that enhances code quality and maintainability in large apps.',
      difficulty: 'Intermediate',
      parent_skill_id: 'sk_javascript',
      related_skills: ['sk_javascript', 'sk_java'],
      prerequisite_skills: ['sk_javascript', 'sk_oop'],
      complementary_skills: ['sk_react', 'sk_nodejs'],
      status: 'active',
      industryDemandPercent: 78,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_c',
      name: 'C',
      category: 'Programming',
      subcategory: 'Systems & Hardware',
      description: 'Foundational procedural language for hardware interfaces, OS kernels, and embedded devices.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_cpp', 'sk_linux'],
      prerequisite_skills: [],
      complementary_skills: ['sk_linux', 'sk_dsa'],
      status: 'active',
      industryDemandPercent: 42,
      demandLevel: 'Medium'
    },
    {
      id: 'sk_go',
      name: 'Go',
      category: 'Programming',
      subcategory: 'Cloud Infrastructure Services',
      description: 'Concurrent, simple language designed by Google for cloud infrastructure and high-throughput backend services.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_python', 'sk_cpp'],
      prerequisite_skills: ['sk_oop'],
      complementary_skills: ['sk_docker', 'sk_kubernetes', 'sk_aws'],
      status: 'active',
      industryDemandPercent: 58,
      demandLevel: 'High'
    },
    
    // Data Structures
    {
      id: 'sk_dsa',
      name: 'DSA',
      category: 'Data Structures',
      subcategory: 'Algorithms & Computational Complexity',
      description: 'Data Structures & Algorithms: Arrays, Linked Lists, Trees, Graphs, Sorting, Dynamic Programming, and Big-O.',
      difficulty: 'Advanced',
      parent_skill_id: null,
      related_skills: ['sk_aptitude', 'sk_system_design'],
      prerequisite_skills: ['sk_python', 'sk_cpp', 'sk_java'],
      complementary_skills: ['sk_system_design', 'sk_sql'],
      status: 'active',
      industryDemandPercent: 92,
      demandLevel: 'Very High'
    },
    
    // Databases
    {
      id: 'sk_sql',
      name: 'SQL',
      category: 'Databases',
      subcategory: 'Relational Querying & Schema Design',
      description: 'Structured Query Language for relational database management, joins, aggregations, indexing, and transactions.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_postgresql', 'sk_mongodb'],
      prerequisite_skills: [],
      complementary_skills: ['sk_python', 'sk_postgresql', 'sk_pandas'],
      status: 'active',
      industryDemandPercent: 84,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_mongodb',
      name: 'MongoDB',
      category: 'Databases',
      subcategory: 'Document & NoSQL Stores',
      description: 'Document-oriented NoSQL database for flexible schemas, high scalability, and JSON-based storage.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_redis', 'sk_sql'],
      prerequisite_skills: ['sk_javascript'],
      complementary_skills: ['sk_nodejs', 'sk_react'],
      status: 'active',
      industryDemandPercent: 54,
      demandLevel: 'High'
    },
    {
      id: 'sk_postgresql',
      name: 'PostgreSQL',
      category: 'Databases',
      subcategory: 'Advanced Relational & JSON Indexing',
      description: 'Advanced open-source relational database with powerful JSON querying, indexing, and reliability.',
      difficulty: 'Intermediate',
      parent_skill_id: 'sk_sql',
      related_skills: ['sk_sql', 'sk_mongodb'],
      prerequisite_skills: ['sk_sql'],
      complementary_skills: ['sk_python', 'sk_nodejs', 'sk_redis'],
      status: 'active',
      industryDemandPercent: 68,
      demandLevel: 'High'
    },
    {
      id: 'sk_redis',
      name: 'Redis',
      category: 'Databases',
      subcategory: 'In-Memory Cache & Pub/Sub',
      description: 'In-memory key-value data store used for low-latency caching, pub/sub, and session management.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_sql', 'sk_mongodb'],
      prerequisite_skills: ['sk_sql'],
      complementary_skills: ['sk_nodejs', 'sk_python', 'sk_system_design'],
      status: 'active',
      industryDemandPercent: 48,
      demandLevel: 'High'
    },

    // Web Development
    {
      id: 'sk_react',
      name: 'React',
      category: 'Web Development',
      subcategory: 'Frontend Component Architecture',
      description: 'Declarative component-based UI library for modern web applications.',
      difficulty: 'Intermediate',
      parent_skill_id: 'sk_javascript',
      related_skills: ['sk_javascript', 'sk_typescript', 'sk_html_css'],
      prerequisite_skills: ['sk_javascript', 'sk_html_css'],
      complementary_skills: ['sk_typescript', 'sk_rest_api', 'sk_nodejs'],
      status: 'active',
      industryDemandPercent: 80,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_nodejs',
      name: 'Node.js',
      category: 'Web Development',
      subcategory: 'Asynchronous Backend Runtimes',
      description: 'JavaScript runtime built on Chrome V8 engine for scalable asynchronous network applications.',
      difficulty: 'Intermediate',
      parent_skill_id: 'sk_javascript',
      related_skills: ['sk_python', 'sk_go'],
      prerequisite_skills: ['sk_javascript'],
      complementary_skills: ['sk_rest_api', 'sk_sql', 'sk_mongodb', 'sk_docker'],
      status: 'active',
      industryDemandPercent: 74,
      demandLevel: 'High'
    },
    {
      id: 'sk_html_css',
      name: 'HTML/CSS',
      category: 'Web Development',
      subcategory: 'Semantic Markup & Responsive Styling',
      description: 'Standard markup and styling foundational technologies for structuring and presenting web interfaces.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_react'],
      prerequisite_skills: [],
      complementary_skills: ['sk_javascript', 'sk_react'],
      status: 'active',
      industryDemandPercent: 70,
      demandLevel: 'High'
    },
    {
      id: 'sk_rest_api',
      name: 'REST APIs',
      category: 'Web Development',
      subcategory: 'HTTP Protocol & Microservice Interfaces',
      description: 'Architectural style for designing networked applications and scalable HTTP endpoints.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_nodejs', 'sk_python'],
      prerequisite_skills: [],
      complementary_skills: ['sk_react', 'sk_sql', 'sk_docker'],
      status: 'active',
      industryDemandPercent: 85,
      demandLevel: 'Very High'
    },

    // AI/ML
    {
      id: 'sk_aiml',
      name: 'AI/ML',
      category: 'AI/ML',
      subcategory: 'Machine Learning & Neural Foundations',
      description: 'Machine Learning, Deep Learning neural networks, NLP, Computer Vision, and Predictive Modeling.',
      difficulty: 'Advanced',
      parent_skill_id: null,
      related_skills: ['sk_pytorch', 'sk_pandas'],
      prerequisite_skills: ['sk_python', 'sk_dsa'],
      complementary_skills: ['sk_pandas', 'sk_pytorch', 'sk_sql'],
      status: 'active',
      industryDemandPercent: 76,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_pytorch',
      name: 'PyTorch',
      category: 'AI/ML',
      subcategory: 'Deep Learning & Tensor Modeling',
      description: 'Open-source deep learning framework based on Torch, widely used for computer vision and NLP research.',
      difficulty: 'Advanced',
      parent_skill_id: 'sk_aiml',
      related_skills: ['sk_aiml', 'sk_pandas'],
      prerequisite_skills: ['sk_python', 'sk_aiml'],
      complementary_skills: ['sk_pandas', 'sk_docker', 'sk_aws'],
      status: 'active',
      industryDemandPercent: 60,
      demandLevel: 'High'
    },
    {
      id: 'sk_pandas',
      name: 'Pandas & NumPy',
      category: 'AI/ML',
      subcategory: 'Data Wrangling & Vectorized Computation',
      description: 'Python data manipulation and numerical computation libraries for analytics and feature engineering.',
      difficulty: 'Intermediate',
      parent_skill_id: 'sk_python',
      related_skills: ['sk_sql', 'sk_aiml'],
      prerequisite_skills: ['sk_python'],
      complementary_skills: ['sk_sql', 'sk_aiml'],
      status: 'active',
      industryDemandPercent: 66,
      demandLevel: 'High'
    },
    {
      id: 'sk_excel',
      name: 'Excel',
      category: 'Data & Analytics',
      subcategory: 'Spreadsheet Modeling & Pivot Analysis',
      description: 'Advanced spreadsheet formulas (XLOOKUP, INDEX/MATCH), pivot tables, data modeling, and business telemetry analysis.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_sql', 'sk_powerbi', 'sk_pandas'],
      prerequisite_skills: [],
      complementary_skills: ['sk_sql', 'sk_powerbi'],
      status: 'active',
      industryDemandPercent: 84,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_powerbi',
      name: 'Power BI',
      category: 'Data & Analytics',
      subcategory: 'Business Intelligence & Visual Analytics',
      description: 'Interactive dashboard engineering, DAX formulas, Power Query ETL pipelines, and executive KPI reporting.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_excel', 'sk_sql', 'sk_pandas'],
      prerequisite_skills: ['sk_excel', 'sk_sql'],
      complementary_skills: ['sk_sql', 'sk_excel', 'sk_python'],
      status: 'active',
      industryDemandPercent: 76,
      demandLevel: 'High'
    },

    // Cloud & DevOps
    {
      id: 'sk_aws',
      name: 'AWS',
      category: 'Cloud',
      subcategory: 'Hyperscaler Cloud Primitives',
      description: 'Amazon Web Services: EC2, S3, Lambda, RDS, IAM, and foundational cloud architecture.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_docker', 'sk_kubernetes'],
      prerequisite_skills: ['sk_linux'],
      complementary_skills: ['sk_docker', 'sk_cicd', 'sk_sql'],
      status: 'active',
      industryDemandPercent: 75,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_docker',
      name: 'Docker',
      category: 'DevOps',
      subcategory: 'Containerization & Isolation',
      description: 'Containerization platform to package applications and dependencies into standardized containers.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_kubernetes', 'sk_cicd'],
      prerequisite_skills: ['sk_linux'],
      complementary_skills: ['sk_kubernetes', 'sk_aws', 'sk_cicd'],
      status: 'active',
      industryDemandPercent: 71,
      demandLevel: 'High'
    },
    {
      id: 'sk_kubernetes',
      name: 'Kubernetes',
      category: 'DevOps',
      subcategory: 'Container Orchestration & Resiliency',
      description: 'Production-grade container orchestration system for automating deployment, scaling, and management.',
      difficulty: 'Advanced',
      parent_skill_id: 'sk_docker',
      related_skills: ['sk_docker', 'sk_aws'],
      prerequisite_skills: ['sk_docker', 'sk_linux'],
      complementary_skills: ['sk_aws', 'sk_cicd', 'sk_system_design'],
      status: 'active',
      industryDemandPercent: 52,
      demandLevel: 'High'
    },
    {
      id: 'sk_cicd',
      name: 'CI/CD Pipelines',
      category: 'DevOps',
      subcategory: 'Automated Build, Test & Deploy',
      description: 'Continuous Integration and Continuous Delivery automation using GitHub Actions and Jenkins.',
      difficulty: 'Intermediate',
      parent_skill_id: null,
      related_skills: ['sk_git', 'sk_docker'],
      prerequisite_skills: ['sk_git'],
      complementary_skills: ['sk_docker', 'sk_aws', 'sk_kubernetes'],
      status: 'active',
      industryDemandPercent: 62,
      demandLevel: 'High'
    },
    
    // Tools
    {
      id: 'sk_git',
      name: 'Git',
      category: 'Tools',
      subcategory: 'Distributed Version Control',
      description: 'Distributed version control system for tracking changes, branching, pull requests, and collaborative codebases.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_linux', 'sk_cicd'],
      prerequisite_skills: [],
      complementary_skills: ['sk_cicd', 'sk_python', 'sk_javascript'],
      status: 'active',
      industryDemandPercent: 89,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_linux',
      name: 'Linux CLI',
      category: 'Tools',
      subcategory: 'POSIX Shell & System Administration',
      description: 'Command-line interface proficiency, shell scripting, file permissions, and process management.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_git', 'sk_docker'],
      prerequisite_skills: [],
      complementary_skills: ['sk_docker', 'sk_aws', 'sk_c'],
      status: 'active',
      industryDemandPercent: 67,
      demandLevel: 'High'
    },

    // Soft Skills & Concepts
    {
      id: 'sk_oop',
      name: 'OOP',
      category: 'Programming',
      subcategory: 'Object-Oriented Paradigm & Design Patterns',
      description: 'Object-Oriented Programming principles: Encapsulation, Inheritance, Polymorphism, and Abstraction.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_system_design', 'sk_dsa'],
      prerequisite_skills: [],
      complementary_skills: ['sk_java', 'sk_python', 'sk_cpp'],
      status: 'active',
      industryDemandPercent: 83,
      demandLevel: 'Very High'
    },
    {
      id: 'sk_system_design',
      name: 'System Design',
      category: 'Programming',
      subcategory: 'Distributed Scalability & High Availability',
      description: 'Architecture of high-scale systems, load balancing, caching, database sharding, and resilience.',
      difficulty: 'Advanced',
      parent_skill_id: null,
      related_skills: ['sk_dsa', 'sk_kubernetes', 'sk_redis'],
      prerequisite_skills: ['sk_oop', 'sk_dsa', 'sk_sql'],
      complementary_skills: ['sk_redis', 'sk_aws', 'sk_kubernetes'],
      status: 'active',
      industryDemandPercent: 64,
      demandLevel: 'High'
    },
    {
      id: 'sk_aptitude',
      name: 'Aptitude & Problem Solving',
      category: 'Soft Skills',
      subcategory: 'Quantitative Analysis & Critical Reasoning',
      description: 'Quantitative reasoning, logical puzzles, data interpretation, and analytical thinking.',
      difficulty: 'Beginner',
      parent_skill_id: null,
      related_skills: ['sk_dsa'],
      prerequisite_skills: [],
      complementary_skills: ['sk_dsa', 'sk_python'],
      status: 'active',
      industryDemandPercent: 79,
      demandLevel: 'Very High'
    }
  ];

  // Advanced Intelligence Seed Data
  const coding_problems = [
    {
      id: 'code_1',
      title: 'Two Sum Problem',
      difficulty: 'Easy' as const,
      topic: 'Arrays' as const,
      description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. Each input has exactly one solution, and you may not use the same element twice.',
      initialCode: {
        python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your solution here\n    seen = {}\n    for i, num in enumerate(nums):\n        complement = target - num\n        if complement in seen:\n            return [seen[complement], i]\n        seen[num] = i\n    return []',
        javascript: 'function twoSum(nums, target) {\n    const seen = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (seen.has(complement)) return [seen.get(complement), i];\n        seen.set(nums[i], i);\n    }\n    return [];\n}',
        cpp: 'vector<int> twoSum(vector<int>& nums, int target) {\n    unordered_map<int, int> seen;\n    for (int i = 0; i < nums.size(); i++) {\n        int comp = target - nums[i];\n        if (seen.count(comp)) return {seen[comp], i};\n        seen[nums[i]] = i;\n    }\n    return {};\n}'
      },
      testCases: [
        { input: 'nums = [2,7,11,15], target = 9', expectedOutput: '[0, 1]' },
        { input: 'nums = [3,2,4], target = 6', expectedOutput: '[1, 2]' },
        { input: 'nums = [3,3], target = 6', expectedOutput: '[0, 1]' }
      ],
      hints: ['Use a hash map to look up the complement in O(1) time.', 'Iterate through the array once.'],
      recommendedForSkills: ['Python', 'DSA', 'C++']
    },
    {
      id: 'code_2',
      title: 'Valid Parentheses',
      difficulty: 'Easy' as const,
      topic: 'Strings' as const,
      description: 'Given a string `s` containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid. Brackets must close in the correct order and open brackets must be closed by the same type.',
      initialCode: {
        python: 'def isValid(s: str) -> bool:\n    stack = []\n    mapping = {")": "(", "}": "{", "]": "["}\n    for char in s:\n        if char in mapping:\n            if not stack or stack.pop() != mapping[char]:\n                return False\n        else:\n            stack.append(char)\n    return not stack',
        javascript: 'function isValid(s) {\n    const stack = [];\n    const map = { ")": "(", "}": "{", "]": "[" };\n    for (const c of s) {\n        if (map[c]) {\n            if (stack.pop() !== map[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}',
        cpp: 'bool isValid(string s) {\n    stack<char> st;\n    for (char c : s) {\n        if (c == \'(\' || c == \'{\' || c == \'[\') st.push(c);\n        else {\n            if (st.empty()) return false;\n            if (c == \')\' && st.top() != \'(\') return false;\n            if (c == \'}\' && st.top() != \'{\') return false;\n            if (c == \']\' && st.top() != \'[\') return false;\n            st.pop();\n        }\n    }\n    return st.empty();\n}'
      },
      testCases: [
        { input: 's = "()"', expectedOutput: 'true' },
        { input: 's = "()[]{}"', expectedOutput: 'true' },
        { input: 's = "(]"', expectedOutput: 'false' }
      ],
      hints: ['Use a LIFO Stack data structure.', 'Push opening brackets, pop on closing brackets.'],
      recommendedForSkills: ['DSA', 'Python', 'Java']
    },
    {
      id: 'code_3',
      title: 'Maximum Subarray (Kadane Algorithm)',
      difficulty: 'Medium' as const,
      topic: 'Dynamic Programming' as const,
      description: 'Given an integer array `nums`, find the subarray with the largest sum, and return its sum in O(n) linear time.',
      initialCode: {
        python: 'def maxSubArray(nums: list[int]) -> int:\n    max_sum = current_sum = nums[0]\n    for x in nums[1:]:\n        current_sum = max(x, current_sum + x)\n        max_sum = max(max_sum, current_sum)\n    return max_sum',
        javascript: 'function maxSubArray(nums) {\n    let max = nums[0], curr = nums[0];\n    for (let i = 1; i < nums.length; i++) {\n        curr = Math.max(nums[i], curr + nums[i]);\n        max = Math.max(max, curr);\n    }\n    return max;\n}',
        cpp: 'int maxSubArray(vector<int>& nums) {\n    int max_sum = nums[0], curr = nums[0];\n    for (int i = 1; i < nums.size(); i++) {\n        curr = max(nums[i], curr + nums[i]);\n        max_sum = max(max_sum, curr);\n    }\n    return max_sum;\n}'
      },
      testCases: [
        { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
        { input: 'nums = [1]', expectedOutput: '1' },
        { input: 'nums = [5,4,-1,7,8]', expectedOutput: '23' }
      ],
      hints: ['Kadane Algorithm maintains current running sum.', 'Reset sum if current number is greater than running sum.'],
      recommendedForSkills: ['DSA', 'Python', 'C++']
    },
    {
      id: 'code_4',
      title: 'Binary Tree Inorder Traversal',
      difficulty: 'Medium' as const,
      topic: 'Trees' as const,
      description: 'Given the root of a binary tree, return the inorder traversal of its nodes values (Left → Root → Right).',
      initialCode: {
        python: 'def inorderTraversal(root):\n    res = []\n    def helper(node):\n        if not node: return\n        helper(node.left)\n        res.append(node.val)\n        helper(node.right)\n    helper(root)\n    return res',
        javascript: 'function inorderTraversal(root) {\n    const res = [];\n    function traverse(node) {\n        if (!node) return;\n        traverse(node.left);\n        res.push(node.val);\n        traverse(node.right);\n    }\n    traverse(root);\n    return res;\n}',
        cpp: 'vector<int> inorderTraversal(TreeNode* root) {\n    vector<int> res;\n    // DFS Inorder logic\n    return res;\n}'
      },
      testCases: [
        { input: 'root = [1,null,2,3]', expectedOutput: '[1, 3, 2]' },
        { input: 'root = []', expectedOutput: '[]' },
        { input: 'root = [1]', expectedOutput: '[1]' }
      ],
      hints: ['Recursion makes tree traversals elegant and clean.', 'Inorder visits Left subtree, then current node, then Right subtree.'],
      recommendedForSkills: ['DSA', 'Java', 'C++']
    }
  ];

  const interview_questions = [
    {
      id: 'iq_1',
      targetRole: 'Software Developer',
      skillName: 'Python',
      category: 'Technical' as const,
      difficulty: 'Intermediate' as const,
      question: 'Explain how memory management and garbage collection work in Python. What is the difference between reference counting and the cyclic garbage collector?',
      sampleStrongAnswer: 'Python manages memory primarily through reference counting. Every object has an internal reference counter that increments when assigned and decrements when dereferenced. When it drops to zero, the object is instantly deallocated. For cyclic references (where object A points to B and B points to A), Python has a generational cyclic garbage collector (Generations 0, 1, 2) that detects unreachable reference cycles.',
      keyEvaluationCriteria: ['Reference counting mechanism', 'Cyclic reference handling', 'Generational GC (Gen 0, 1, 2)', 'Memory efficiency']
    },
    {
      id: 'iq_2',
      targetRole: 'Software Developer',
      skillName: 'DSA',
      category: 'Technical' as const,
      difficulty: 'Intermediate' as const,
      question: 'How would you design a LRU (Least Recently Used) Cache with O(1) Get and O(1) Put operations? What data structures would you combine and why?',
      sampleStrongAnswer: 'To achieve O(1) for both lookup and insertion/eviction, I combine a Hash Map and a Doubly Linked List. The Hash Map stores key-to-node references for O(1) access. The Doubly Linked List maintains access recency order with dummy Head and Tail nodes, allowing O(1) removal and moving accessed nodes to the front.',
      keyEvaluationCriteria: ['Hash map + Doubly Linked List combination', 'O(1) time complexity explanation', 'Handling capacity evictions from tail', 'Clean state transitions']
    },
    {
      id: 'iq_3',
      targetRole: 'Software Developer',
      skillName: 'SQL',
      category: 'Technical' as const,
      difficulty: 'Intermediate' as const,
      question: 'What is the difference between clustered and non-clustered indexes in relational databases, and how do database transactions guarantee ACID properties?',
      sampleStrongAnswer: 'A clustered index physically alters the order in which data is stored on disk (one per table, usually the Primary Key). A non-clustered index is a separate B-Tree structure storing column keys with pointers to the actual row data. ACID is maintained via Write-Ahead Logging (WAL) for Atomicity & Durability, locks/MVCC for Isolation, and constraints for Consistency.',
      keyEvaluationCriteria: ['Physical ordering vs logical pointer B-tree', 'Primary key relationship', 'WAL logging for Durability', 'MVCC / Locking for Isolation']
    },
    {
      id: 'iq_4',
      targetRole: 'Software Developer',
      skillName: 'Soft Skills',
      category: 'Behavioral' as const,
      difficulty: 'Intermediate' as const,
      question: 'Tell me about a time you encountered a severe bug or production issue right before a deadline. How did you diagnose, resolve, and communicate it?',
      sampleStrongAnswer: 'Using the STAR method: In our campus logistics project right before demo day, the dispatch route calculations were freezing due to an unhandled infinite loop in cyclic graph traversal. I isolated the bug using logging telemetry, implemented a visited set to detect cycles, wrote automated regression tests, and communicated the fix proactively to the team with 2 hours to spare.',
      keyEvaluationCriteria: ['STAR methodology', 'Problem isolation & root cause analysis', 'Testing & validation', 'Communication & composure under pressure']
    }
  ];

  const company_demand_signals = [
    {
      id: 'ds_1',
      companyId: 'comp_1',
      companyName: 'TechNova',
      targetRole: 'Software Developer',
      requiredSkills: [
        { skill: 'Python', level: 'Intermediate' as const },
        { skill: 'DSA', level: 'Intermediate' as const },
        { skill: 'SQL', level: 'Intermediate' as const },
        { skill: 'AWS', level: 'Beginner' as const }
      ],
      expectedHiringCount: 25,
      targetBatchYear: 2026,
      targetGraduationDate: 'May 2026',
      minCgpa: 7.5,
      offeredSalaryBand: '$95,000 - $125,000 / year',
      status: 'active' as const,
      postedAt: '2026-02-15T09:00:00Z',
      messageToColleges: 'TechNova is actively looking for 25 verified Python + DSA graduates from Apex University and Stanford Tech for our fall engineering rotation.'
    },
    {
      id: 'ds_2',
      companyId: 'comp_2',
      companyName: 'InnoSoft',
      targetRole: 'Data Analyst & ML Specialist',
      requiredSkills: [
        { skill: 'Python', level: 'Intermediate' as const },
        { skill: 'SQL', level: 'Intermediate' as const },
        { skill: 'AI/ML', level: 'Beginner' as const }
      ],
      expectedHiringCount: 15,
      targetBatchYear: 2026,
      targetGraduationDate: 'May 2026',
      minCgpa: 7.8,
      offeredSalaryBand: '$90,000 - $115,000 / year',
      status: 'active' as const,
      postedAt: '2026-02-16T11:00:00Z',
      messageToColleges: 'InnoSoft is recruiting 15 student data analysts with practical SQL, data visualization, and predictive modeling foundations.'
    }
  ];

  const project_recommendations = [
    {
      id: 'prec_1',
      title: 'High-Throughput Distributed Task Queue & Cache',
      targetRole: 'Software Developer',
      technologies: ['Python', 'SQL', 'Redis', 'Docker'],
      difficulty: 'Intermediate' as const,
      description: 'Build an asynchronous job processing system with Redis-backed queueing, retry policies, worker concurrency, and PostgreSQL execution telemetry.',
      features: [
        'Worker thread pool for concurrent asynchronous job processing.',
        'Exponential backoff retry policy for failed jobs with Dead Letter Queue (DLQ).',
        'RESTful API dashboard displaying real-time throughput telemetry and worker health.'
      ],
      learningOutcomes: ['Distributed systems architecture', 'Concurrency controls', 'Database connection pooling'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/distributed-task-queue'
    },
    {
      id: 'prec_2',
      title: 'E-Commerce Predictive Customer Churn & Analytics',
      targetRole: 'Data Analyst',
      technologies: ['Python', 'SQL', 'Pandas & NumPy', 'AI/ML'],
      difficulty: 'Intermediate' as const,
      description: 'Analyze consumer transaction history to predict customer churn, perform cohort retention analysis, and build an interactive reporting dashboard.',
      features: [
        'ETL pipeline parsing 500k+ mock transaction rows using SQL & Pandas.',
        'Random Forest and Logistic Regression classification models for churn likelihood.',
        'Interactive analytics dashboard showcasing cohort churn drivers.'
      ],
      learningOutcomes: ['Data wrangling at scale', 'Feature engineering', 'Business intelligence reporting'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/customer-churn-analytics'
    },
    {
      id: 'prec_3',
      title: 'Cloud-Native Container Orchestration & CI/CD Pipeline',
      targetRole: 'Cloud DevOps Associate',
      technologies: ['AWS', 'Docker', 'Linux CLI', 'Git'],
      difficulty: 'Intermediate' as const,
      description: 'Deploy a multi-service microservice application to AWS ECS/EKS with automated GitHub Actions testing and Infrastructure as Code.',
      features: [
        'Dockerized backend and frontend services with multi-stage builds.',
        'Automated CI/CD workflow triggering automated unit tests and Docker image publishing.',
        'AWS infrastructure provisioning with IAM least-privilege security policies.'
      ],
      learningOutcomes: ['Container security', 'Cloud infrastructure automation', 'DevOps best practices'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/cloud-native-devops'
    },
    {
      id: 'prec_4',
      title: 'AI Conversational Agent with Retrieval-Augmented Generation (RAG)',
      targetRole: 'Software Developer',
      technologies: ['Python', 'AI/ML', 'SQL', 'Git'],
      difficulty: 'Advanced' as const,
      description: 'Build an intelligent chatbot utilizing PDF document indexing, text embedding vectors database, and OpenAI API with context-augmented chat history.',
      features: [
        'PDF parser and document text splitter pipelines.',
        'Vector similarity search using pgvector or pinecone database indexes.',
        'Conversational agent stream interface retaining chat session memory.'
      ],
      learningOutcomes: ['Retrieval-Augmented Generation concepts', 'Vector databases schema', 'Large language model prompting'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/ai-rag-chatbot'
    },
    {
      id: 'prec_5',
      title: 'Kubernetes Microservices Deploy & GitOps Reconciliation',
      targetRole: 'Cloud DevOps Associate',
      technologies: ['Docker', 'Linux CLI', 'Git', 'AWS'],
      difficulty: 'Advanced' as const,
      description: 'Build a containerized deployment workflow utilizing Kubernetes manifests and automated GitOps sync tracking using mock ArgoCD agents.',
      features: [
        'Kubernetes pod liveness and readiness probe configurations.',
        'Automated cluster health telemetry logging.',
        'Declarative state reconciliation loop matching active environment to Git repo changes.'
      ],
      learningOutcomes: ['Cluster deployment controls', 'Infrastructure GitOps concepts', 'System health automation'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/gitops-kubernetes'
    },
    {
      id: 'prec_6',
      title: 'Financial Portfolio Analytics Dashboard & Forecasting',
      targetRole: 'Data Analyst',
      technologies: ['Python', 'Pandas & NumPy', 'SQL', 'AI/ML'],
      difficulty: 'Advanced' as const,
      description: 'Collect mock public stock ticks history, analyze rolling moving averages covariance matrix, and forecast market performance using statistical regression models.',
      features: [
        'Pandas vectorization calculating Sharpe ratio and portfolio risk allocations.',
        'Time-series stock price forecasting using linear regression classifiers.',
        'Interactive charts rendering historical analytics and expected returns forecasts.'
      ],
      learningOutcomes: ['Time-series math', 'Financial data structures', 'Exploratory metrics visualization'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/financial-analytics'
    },
    {
      id: 'prec_7',
      title: 'E-Commerce React Component Hub with Stripe Checkout',
      targetRole: 'Software Developer',
      technologies: ['React', 'JavaScript', 'HTML', 'CSS'],
      difficulty: 'Beginner' as const,
      description: 'Build an interactive storefront frontend utilizing custom React context state containers, filters, search catalogs, and simulated checkout flows.',
      features: [
        'Cart state manager handling item quantities and subtotals across pages.',
        'CSS Flexbox/Grid layouts rendering responsive product cards catalogs.',
        'Simulated Stripe payment checkout flow validating card fields and showing confirmation.'
      ],
      learningOutcomes: ['Client state handling', 'Responsive CSS templates', 'Simulated API processing'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/react-storefront'
    },
    {
      id: 'prec_8',
      title: 'Secure OTP Verification API Gateways',
      targetRole: 'Software Developer',
      technologies: ['Python', 'Redis', 'SQL', 'Git'],
      difficulty: 'Intermediate' as const,
      description: 'Build a rate-limited secure OTP verification endpoint utilizing local Redis caching for dynamic verification codes and expiry timelines.',
      features: [
        'Redis-backed TTL code storage expiring records after 2 minutes.',
        'IP rate-limiter blocking users after 3 incorrect verification attempts.',
        'Automated telemetry logging for successful and blocked validation audits.'
      ],
      learningOutcomes: ['API security structures', 'Redis cache key management', 'System rate limiting design'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/secure-otp-gateway'
    },
    {
      id: 'prec_9',
      title: 'Auto-Scaling RESTful API Express Server',
      targetRole: 'Software Developer',
      technologies: ['JavaScript', 'Docker', 'AWS', 'Linux CLI'],
      difficulty: 'Intermediate' as const,
      description: 'Build a Node.js Express server packaged inside multi-stage Docker container builds, configured for cluster worker threading and scaling.',
      features: [
        'Node.js clusters spawning workers based on logical CPU core counts.',
        'Express endpoints returning server load stats and processing health.',
        'Dockerized orchestration mapping ports and environment variables cleanly.'
      ],
      learningOutcomes: ['Multi-threaded node engines', 'Docker image builds optimization', 'Cloud runtime scaling'],
      githubTemplateUrl: 'https://github.com/skill2hire-templates/scaling-express-server'
    }
  ];

  const cohort_groups = [
    {
      id: 'ch_1',
      collegeId: 'col_1',
      name: 'DSA Foundation & Placement Acceleration Cohort',
      targetSkill: 'DSA',
      studentCount: 42,
      studentIds: ['std_1', 'std_5'],
      reason: 'Low initial DSA proficiency (Beginner level). Needs upgrade to Intermediate for TechNova placement drives.',
      targetLevel: 'Intermediate' as const,
      recommendedDurationWeeks: 6,
      assignedBootcampId: 'tp_bootcamp_1'
    },
    {
      id: 'ch_2',
      collegeId: 'col_1',
      name: 'Python Systems & OOP Intensive Cohort',
      targetSkill: 'Python',
      studentCount: 38,
      studentIds: ['std_1'],
      reason: 'High industry demand (88%) vs student self-declared proficiency gap.',
      targetLevel: 'Intermediate' as const,
      recommendedDurationWeeks: 8,
      assignedBootcampId: 'tp_bootcamp_1'
    }
  ];
  // Alex initially has Python (Beginner self-declared), SQL (Intermediate verified), Git (Beginner self-declared), DSA (Beginner self-declared), AWS (None)
  const student_skills = [
    { id: 'ss_1', studentId: 'std_1', skillId: 'sk_python', skillName: 'Python', category: 'Programming', status: 'Self-Declared' as const, level: 'Beginner' as const },
    { id: 'ss_2', studentId: 'std_1', skillId: 'sk_sql', skillName: 'SQL', category: 'Databases', status: 'Verified' as const, level: 'Intermediate' as const, score: 88, verifiedAt: '2026-02-01T14:30:00Z', assessmentId: 'asm_sql' },
    { id: 'ss_3', studentId: 'std_1', skillId: 'sk_git', skillName: 'Git', category: 'Tools', status: 'Self-Declared' as const, level: 'Beginner' as const },
    { id: 'ss_4', studentId: 'std_1', skillId: 'sk_dsa', skillName: 'DSA', category: 'Data Structures', status: 'Self-Declared' as const, level: 'Beginner' as const },
    { id: 'ss_5', studentId: 'std_1', skillId: 'sk_oop', skillName: 'OOP', category: 'Programming', status: 'Self-Declared' as const, level: 'Intermediate' as const },

    // Priya Sharma skills (high readiness)
    { id: 'ss_6', studentId: 'std_2', skillId: 'sk_python', skillName: 'Python', category: 'Programming', status: 'Verified' as const, level: 'Advanced' as const, score: 94, verifiedAt: '2026-01-20T11:00:00Z', assessmentId: 'asm_python' },
    { id: 'ss_7', studentId: 'std_2', skillId: 'sk_sql', skillName: 'SQL', category: 'Databases', status: 'Verified' as const, level: 'Advanced' as const, score: 92, verifiedAt: '2026-01-22T15:00:00Z', assessmentId: 'asm_sql' },
    { id: 'ss_8', studentId: 'std_2', skillId: 'sk_aiml', skillName: 'AI/ML', category: 'AI/ML', status: 'Verified' as const, level: 'Intermediate' as const, score: 85, verifiedAt: '2026-01-25T16:00:00Z', assessmentId: 'asm_aiml' },
    { id: 'ss_9', studentId: 'std_2', skillId: 'sk_dsa', skillName: 'DSA', category: 'Data Structures', status: 'Verified' as const, level: 'Intermediate' as const, score: 86, verifiedAt: '2026-01-28T10:00:00Z', assessmentId: 'asm_dsa' },

    // Rohan Mehta skills
    { id: 'ss_10', studentId: 'std_3', skillId: 'sk_cpp', skillName: 'C++', category: 'Programming', status: 'Verified' as const, level: 'Advanced' as const, score: 96, verifiedAt: '2026-01-15T09:00:00Z', assessmentId: 'asm_cpp' },
    { id: 'ss_11', studentId: 'std_3', skillId: 'sk_dsa', skillName: 'DSA', category: 'Data Structures', status: 'Verified' as const, level: 'Advanced' as const, score: 95, verifiedAt: '2026-01-18T14:00:00Z', assessmentId: 'asm_dsa' },
    { id: 'ss_12', studentId: 'std_3', skillId: 'sk_sql', skillName: 'SQL', category: 'Databases', status: 'Verified' as const, level: 'Intermediate' as const, score: 84, verifiedAt: '2026-01-21T11:00:00Z', assessmentId: 'asm_sql' }
  ];

  const verified_skills = [
    { id: 'vs_1', studentId: 'std_1', skillId: 'sk_sql', skillName: 'SQL', level: 'Intermediate' as const, score: 88, credibilityScore: 94, verificationDate: '2026-02-01T14:30:00Z', assessmentId: 'asm_sql', certificateId: 'CERT-SQL-8821' },
    { id: 'vs_2', studentId: 'std_2', skillId: 'sk_python', skillName: 'Python', level: 'Advanced' as const, score: 94, credibilityScore: 96, verificationDate: '2026-01-20T11:00:00Z', assessmentId: 'asm_python', certificateId: 'CERT-PY-9411' },
    { id: 'vs_3', studentId: 'std_2', skillId: 'sk_sql', skillName: 'SQL', level: 'Advanced' as const, score: 92, credibilityScore: 95, verificationDate: '2026-01-22T15:00:00Z', assessmentId: 'asm_sql', certificateId: 'CERT-SQL-9233' },
    { id: 'vs_4', studentId: 'std_2', skillId: 'sk_dsa', skillName: 'DSA', level: 'Intermediate' as const, score: 86, credibilityScore: 92, verificationDate: '2026-01-28T10:00:00Z', assessmentId: 'asm_dsa', certificateId: 'CERT-DSA-8640' },
    { id: 'vs_5', studentId: 'std_3', skillId: 'sk_cpp', skillName: 'C++', level: 'Advanced' as const, score: 96, credibilityScore: 97, verificationDate: '2026-01-15T09:00:00Z', assessmentId: 'asm_cpp', certificateId: 'CERT-CPP-9601' },
    { id: 'vs_6', studentId: 'std_3', skillId: 'sk_dsa', skillName: 'DSA', level: 'Advanced' as const, score: 95, credibilityScore: 96, verificationDate: '2026-01-18T14:00:00Z', assessmentId: 'asm_dsa', certificateId: 'CERT-DSA-9502' }
  ];

  // 25+ realistic jobs
  const jobs: Job[] = [
    {
      id: 'job_1',
      companyId: 'comp_1',
      companyName: 'TechNova',
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      title: 'Software Developer',
      roleId: 'jr-backend-eng',
      roleTitle: 'Software Developer',
      department: 'Core Engineering',
      industry: 'Information Technology',
      description: 'We are seeking high-caliber entry-level Software Developers to architect distributed cloud services, high-throughput microservices, and reliable backend components.',
      responsibilities: [
        'Design, build, and maintain efficient, reusable, and reliable Python and C++ code.',
        'Implement optimized database queries, schema migrations, and indexing strategies with SQL.',
        'Collaborate with product and DevOps teams using Git workflows and cloud deployment pipelines.',
        'Solve complex algorithmic and data structure problems with clean code standards.'
      ],
      requirements: [
        'B.S. or B.Tech in Computer Science, IT, or related technical field.',
        'Strong fundamentals in Data Structures & Algorithms and Object-Oriented Programming.',
        'Demonstrated proficiency in Python, C++, and SQL.',
        'Familiarity with Git version control and basic AWS cloud concepts.'
      ],
      requiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: true, weight: 1.0 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: true, weight: 0.8 }
      ],
      preferredSkills: [
        { skillId: 'sk_cpp', skillName: 'C++', minLevel: 'Intermediate', isRequired: false, weight: 1.0 },
        { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: 'San Francisco, CA (Hybrid)',
      country: 'United States',
      region: 'California',
      city: 'San Francisco',
      workMode: 'Hybrid',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.S. / B.Tech Computer Science / IT',
      salary: '$95,000 - $125,000 / year',
      employmentType: 'Full-time',
      minCgpa: 7.5,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech',
      branch: 'Computer Science / IT',
      openings: 8,
      deadline: '2026-09-30',
      status: 'published',
      createdAt: '2026-02-10T08:00:00Z'
    },
    {
      id: 'job_2',
      companyId: 'comp_2',
      companyName: 'InnoSoft',
      title: 'Data Analyst & ML Engineer',
      roleId: 'jr-data-analyst',
      roleTitle: 'Data Analyst & BI Specialist',
      department: 'Data Platforms',
      industry: 'Data & Analytics',
      description: 'Join InnoSoft to build predictive data pipelines, statistical models, and automated business dashboards.',
      responsibilities: [
        'Extract, transform, and analyze large-scale datasets using SQL and Python.',
        'Build statistical models and data visualization pipelines with Pandas and PowerBI.',
        'Collaborate with engineering teams to deploy machine learning inference microservices.'
      ],
      requirements: ['Proficiency in Python, SQL, and data wrangling', 'CGPA >= 7.8', 'Graduation 2025/2026'],
      requiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_aiml', skillName: 'AI/ML', minLevel: 'Intermediate', isRequired: true, weight: 1.2 },
        { skillId: 'sk_pandas', skillName: 'Pandas & NumPy', minLevel: 'Intermediate', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_excel', skillName: 'Excel', minLevel: 'Advanced', isRequired: false, weight: 1.0 },
        { skillId: 'sk_powerbi', skillName: 'Power BI', minLevel: 'Intermediate', isRequired: false, weight: 0.9 }
      ],
      location: 'New York, NY',
      country: 'United States',
      region: 'New York',
      city: 'New York',
      workMode: 'On-site',
      experienceLevel: 'Junior (1-2 yrs)',
      educationRequirement: 'B.S. / B.Tech / M.S. in Computer Science / Data Science / Math',
      salary: '$90,000 - $115,000 / year',
      employmentType: 'Full-time',
      minCgpa: 7.8,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech / M.S.',
      branch: 'Computer Science / Data Science / Math',
      openings: 5,
      deadline: '2026-10-15',
      status: 'published',
      createdAt: '2026-02-12T09:30:00Z'
    },
    {
      id: 'job_3',
      companyId: 'comp_4',
      companyName: 'CloudCore',
      title: 'Cloud DevOps Associate',
      roleId: 'jr-devops-eng',
      roleTitle: 'DevOps & Cloud Engineer',
      department: 'Infrastructure',
      industry: 'Information Technology',
      description: 'Automate Kubernetes clusters, AWS infrastructure, and CI/CD pipelines for mission-critical services.',
      responsibilities: [
        'Write infrastructure as code and deploy services across AWS regions.',
        'Build and maintain containerized applications using Docker and Kubernetes.',
        'Monitor platform health and automate incident response.'
      ],
      requirements: ['AWS fundamentals, Linux CLI, Docker, Git', 'CGPA >= 7.0'],
      requiredSkills: [
        { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_docker', skillName: 'Docker', minLevel: 'Intermediate', isRequired: true, weight: 1.2 },
        { skillId: 'sk_linux', skillName: 'Linux CLI', minLevel: 'Intermediate', isRequired: true, weight: 1.0 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Intermediate', isRequired: true, weight: 0.8 }
      ],
      preferredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: 'Palo Alto, CA',
      country: 'United States',
      region: 'California',
      city: 'Palo Alto',
      workMode: 'Remote',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.S. / B.Tech Computer Science or related',
      salary: '$92,000 - $118,000 / year',
      employmentType: 'Full-time',
      minCgpa: 7.0,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech',
      branch: 'Any',
      openings: 6,
      deadline: '2026-11-01',
      status: 'published',
      createdAt: '2026-02-14T11:15:00Z'
    },
    {
      id: 'job_4',
      companyId: 'comp_5',
      companyName: 'FinEdge',
      title: 'Quantitative Software Engineer',
      roleId: 'jr-backend-eng',
      roleTitle: 'Quantitative Software Engineer',
      department: 'Trading Algorithms',
      industry: 'FinTech',
      description: 'Develop low-latency C++ trading systems, financial modeling tools, and high-speed data pipelines.',
      responsibilities: [
        'Implement ultra-fast algorithms in C++ with sub-millisecond execution constraints.',
        'Analyze market telemetry and financial datasets.',
        'Optimize memory layouts, cache locality, and lockless data structures.'
      ],
      requirements: ['Deep mastery of C++, DSA, and Math', 'CGPA >= 8.5'],
      requiredSkills: [
        { skillId: 'sk_cpp', skillName: 'C++', minLevel: 'Advanced', isRequired: true, weight: 2.0 },
        { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Advanced', isRequired: true, weight: 1.8 },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: false, weight: 1.0 }
      ],
      location: 'Boston, MA',
      country: 'United States',
      region: 'Massachusetts',
      city: 'Boston',
      workMode: 'On-site',
      experienceLevel: 'Junior (1-3 yrs)',
      educationRequirement: 'B.S. / B.Tech / M.S. Computer Science / Math / EE',
      salary: '$130,000 - $165,000 / year',
      employmentType: 'Full-time',
      minCgpa: 8.5,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech / M.S.',
      branch: 'Computer Science / Math / EE',
      openings: 4,
      deadline: '2026-10-30',
      status: 'published',
      createdAt: '2026-02-15T14:00:00Z'
    },
    {
      id: 'job_5',
      companyId: 'comp_6',
      companyName: 'NextGen AI',
      title: 'Full Stack AI Engineer',
      roleId: 'jr-frontend-dev',
      roleTitle: 'Frontend & Full Stack Developer',
      department: 'Product Engineering',
      industry: 'Information Technology',
      description: 'Build modern user-facing applications and autonomous agent systems using React, TypeScript, Python, and PyTorch.',
      responsibilities: [
        'Develop responsive React web frontends and Next.js applications.',
        'Integrate frontier LLMs and AI agent workflows with Python backend services.',
        'Design elegant APIs and persistent database schemas.'
      ],
      requirements: ['Python, React, TypeScript, REST APIs', 'CGPA >= 8.0'],
      requiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.4 },
        { skillId: 'sk_react', skillName: 'React', minLevel: 'Intermediate', isRequired: true, weight: 1.4 },
        { skillId: 'sk_typescript', skillName: 'TypeScript', minLevel: 'Intermediate', isRequired: true, weight: 1.2 },
        { skillId: 'sk_rest_api', skillName: 'REST APIs', minLevel: 'Intermediate', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Intermediate', isRequired: false, weight: 0.8 }
      ],
      location: 'Palo Alto, CA (Hybrid)',
      country: 'United States',
      region: 'California',
      city: 'Palo Alto',
      workMode: 'Hybrid',
      experienceLevel: 'Junior (1-3 yrs)',
      educationRequirement: 'B.S. / B.Tech Computer Science / IT',
      salary: '$110,000 - $140,000 / year',
      employmentType: 'Full-time',
      minCgpa: 8.0,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech',
      branch: 'Computer Science / IT',
      openings: 7,
      deadline: '2026-11-15',
      status: 'published',
      createdAt: '2026-02-16T16:00:00Z'
    }
  ];

  // ----------------------------------------------------
  // VERIFIED BIHAR REGIONAL EMPLOYER JOBS (PHASE 4)
  // ----------------------------------------------------
  const biharJobs: Job[] = [
    {
      id: 'job_br_1',
      companyId: 'comp_1',
      companyName: 'TechNova Bihar Innovation Center',
      companyLogo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
      title: 'Junior Data Analyst',
      roleId: 'jr-data-analyst',
      roleTitle: 'Junior Data Analyst',
      department: 'Data & Analytics',
      industry: 'Data & Analytics',
      description: 'Analyze state logistics, supply chain records, and public sector datasets from our STPI Patna Innovation Lab.',
      responsibilities: [
        'Write optimized SQL aggregation queries and data transformations.',
        'Build structured Excel operational dashboards with advanced lookup formulas.',
        'Develop Python scripts to automate daily data extraction and data hygiene audits.'
      ],
      requirements: [
        'Strong hands-on mastery of SQL, Excel, and Python.',
        'Minimum CGPA 7.0 / 10.0.',
        'Degree in Computer Science, BCA, B.Sc or related fields.'
      ],
      requiredSkills: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_excel', skillName: 'Excel', minLevel: 'Advanced', isRequired: true, weight: 1.3 },
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.4 }
      ],
      preferredSkills: [
        { skillId: 'sk_powerbi', skillName: 'Power BI', minLevel: 'Intermediate', isRequired: false, weight: 1.0 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: 'STPI Patna, Bihar, India',
      country: 'India',
      region: 'Bihar',
      city: 'Patna',
      workMode: 'Hybrid',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.Tech / BCA / B.Sc Computer Science / Math',
      salary: '₹6,50,000 - ₹9,00,000 / year',
      employmentType: 'Full-time',
      minCgpa: 7.0,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech / BCA / B.Sc',
      branch: 'Computer Science / IT / Math',
      openings: 6,
      deadline: '2026-11-30',
      status: 'published',
      createdAt: '2026-02-18T10:00:00Z'
    },
    {
      id: 'job_br_2',
      companyId: 'comp_beltron',
      companyName: 'BELTRON (Bihar State Electronics Dev Corp)',
      companyLogo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=150&auto=format&fit=crop&q=80',
      title: 'Junior Web Application Engineer',
      roleId: 'jr-frontend-dev',
      roleTitle: 'Frontend Developer',
      department: 'State Digital Infrastructure',
      industry: 'GovTech & Public Infrastructure',
      description: 'Engineer responsive web portals, state citizen services, and public mission dashboards connecting 38 Bihar districts.',
      responsibilities: [
        'Develop accessible web interfaces with React, JavaScript, and modern CSS.',
        'Integrate state API gateways with secure authentication endpoints.',
        'Collaborate with STPI Patna engineers using Git code review pipelines.'
      ],
      requirements: ['Solid JavaScript fundamentals, React, and Git', 'Minimum CGPA 6.8'],
      requiredSkills: [
        { skillId: 'sk_javascript', skillName: 'JavaScript', minLevel: 'Intermediate', isRequired: true, weight: 1.4 },
        { skillId: 'sk_react', skillName: 'React', minLevel: 'Intermediate', isRequired: true, weight: 1.4 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: false, weight: 0.8 },
        { skillId: 'sk_typescript', skillName: 'TypeScript', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: 'Vidyut Bhawan, Bailey Road, Patna, Bihar, India',
      country: 'India',
      region: 'Bihar',
      city: 'Patna',
      workMode: 'On-site',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.Tech / B.E. in CSE / IT / MCA',
      salary: '₹5,80,000 - ₹8,20,000 / year',
      employmentType: 'Full-time',
      minCgpa: 6.8,
      graduationYear: 2026,
      degree: 'B.Tech / MCA',
      branch: 'Computer Science / IT',
      openings: 12,
      deadline: '2026-11-20',
      status: 'published',
      createdAt: '2026-02-19T09:00:00Z'
    },
    {
      id: 'job_br_3',
      companyId: 'comp_bihar_health',
      companyName: 'Bihar Digital Health Mission IT Hub',
      companyLogo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=150&auto=format&fit=crop&q=80',
      title: 'Python & Health Data Analytics Engineer',
      roleId: 'jr-data-analyst',
      roleTitle: 'Data Analyst & BI Specialist',
      department: 'Health Informatics',
      industry: 'Healthcare IT',
      description: 'Build predictive health telemetry, district patient record pipelines, and hospital capacity monitoring models.',
      responsibilities: [
        'Process district health surveillance data with Python and Pandas.',
        'Optimize multi-table SQL queries across state health records.',
        'Deploy data quality validation scripts.'
      ],
      requirements: ['Python, SQL, Pandas data wrangling', 'CGPA >= 7.0'],
      requiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.4 },
        { skillId: 'sk_pandas', skillName: 'Pandas & NumPy', minLevel: 'Intermediate', isRequired: true, weight: 1.2 }
      ],
      preferredSkills: [
        { skillId: 'sk_aiml', skillName: 'AI/ML', minLevel: 'Beginner', isRequired: false, weight: 0.8 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Intermediate', isRequired: false, weight: 0.8 }
      ],
      location: 'Patna, Bihar, India (Hybrid)',
      country: 'India',
      region: 'Bihar',
      city: 'Patna',
      workMode: 'Hybrid',
      experienceLevel: 'Junior (1-2 yrs)',
      educationRequirement: 'B.Tech / B.Sc / MCA in STEM',
      salary: '₹7,20,000 - ₹10,50,000 / year',
      employmentType: 'Full-time',
      minCgpa: 7.0,
      graduationYear: 2026,
      degree: 'B.Tech / MCA / B.Sc',
      branch: 'Computer Science / BioInformatics / Math',
      openings: 4,
      deadline: '2026-12-05',
      status: 'published',
      createdAt: '2026-02-20T11:00:00Z'
    },
    {
      id: 'job_br_4',
      companyId: 'comp_muz_agri',
      companyName: 'Muzaffarpur Smart AgriTech Systems',
      companyLogo: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?w=150&auto=format&fit=crop&q=80',
      title: 'IoT & Embedded Systems Engineer',
      roleId: 'jr-backend-eng',
      roleTitle: 'Software Developer',
      department: 'Industrial Automation',
      industry: 'Information Technology',
      description: 'Develop soil telemetry sensors, weather monitoring microcontrollers, and agro-logistics tracking systems.',
      responsibilities: [
        'Program microcontroller firmware in C++ and Python.',
        'Implement low-power communication protocols with cloud gateways.',
        'Test field sensor telemetry and solve data structure edge cases.'
      ],
      requirements: ['C++, Python, core DSA concepts', 'CGPA >= 6.8'],
      requiredSkills: [
        { skillId: 'sk_cpp', skillName: 'C++', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true, weight: 1.3 },
        { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Beginner', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Beginner', isRequired: false, weight: 0.8 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: 'Muzaffarpur Industrial Growth Center, Bihar, India',
      country: 'India',
      region: 'Bihar',
      city: 'Muzaffarpur',
      workMode: 'On-site',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.Tech in CSE / ECE / Instrumentation',
      salary: '₹5,50,000 - ₹7,80,000 / year',
      employmentType: 'Full-time',
      minCgpa: 6.8,
      graduationYear: 2026,
      degree: 'B.Tech',
      branch: 'CSE / ECE',
      openings: 5,
      deadline: '2026-11-25',
      status: 'published',
      createdAt: '2026-02-21T08:30:00Z'
    },
    {
      id: 'job_br_5',
      companyId: 'comp_gaya_clean',
      companyName: 'Gaya Clean Energy & Grid Analytics',
      companyLogo: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=150&auto=format&fit=crop&q=80',
      title: 'Junior Systems & Telemetry Analyst',
      roleId: 'jr-data-analyst',
      roleTitle: 'Junior Data Analyst',
      department: 'Smart Grid Telemetry',
      industry: 'Information Technology',
      description: 'Monitor solar grid output, track inverter performance, and maintain transmission telemetry analytics.',
      responsibilities: [
        'Query solar power timeseries metrics using SQL and Python.',
        'Track equipment maintenance schedules with Git versioned workflows.',
        'Prepare weekly efficiency reports for state power transmission coordinators.'
      ],
      requirements: ['SQL, Python scripting, Git', 'CGPA >= 6.8'],
      requiredSkills: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true, weight: 1.5 },
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Beginner', isRequired: true, weight: 1.2 },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: true, weight: 1.0 }
      ],
      preferredSkills: [
        { skillId: 'sk_excel', skillName: 'Excel', minLevel: 'Advanced', isRequired: false, weight: 1.0 }
      ],
      location: 'Gaya IT Incubation Center, Bihar, India',
      country: 'India',
      region: 'Bihar',
      city: 'Gaya',
      workMode: 'On-site',
      experienceLevel: 'Fresher (0-1 yrs)',
      educationRequirement: 'B.Tech / BCA / B.Sc in STEM',
      salary: '₹5,20,000 - ₹7,50,000 / year',
      employmentType: 'Full-time',
      minCgpa: 6.8,
      graduationYear: 2026,
      degree: 'B.Tech / BCA',
      branch: 'CSE / EE / IT',
      openings: 3,
      deadline: '2026-11-28',
      status: 'published',
      createdAt: '2026-02-22T09:15:00Z'
    }
  ];

  biharJobs.forEach(bj => jobs.push(bj));

  // Add remaining 20 realistic jobs with geographic and industry data
  const extraJobsData = [
    ['comp_3', 'DataSphere', 'Junior Big Data Engineer', 'Data Systems', 'Information Technology', 'United States', 'Illinois', 'Chicago', 'Python, SQL, Linux, Git', ['Python', 'SQL', 'Linux CLI', 'Git'], '$88,000 - $110,000 / year', 'Chicago, IL', 'Hybrid', 7.5, 'jr-data-analyst'],
    ['comp_7', 'CyberShield', 'Associate Security Analyst', 'Cyber Defense', 'Information Technology', 'United States', 'District of Columbia', 'Washington', 'Python, Linux CLI, SQL, REST APIs', ['Python', 'Linux CLI', 'SQL', 'REST APIs'], '$90,000 - $115,000 / year', 'Washington, DC', 'On-site', 7.6, 'jr-backend-eng'],
    ['comp_8', 'PulseHealth', 'HealthTech Software Intern', 'Digital Health', 'Healthcare IT', 'United States', 'California', 'San Diego', 'Python, React, SQL, Git', ['Python', 'React', 'SQL', 'Git'], '$45 / hour', 'San Diego, CA', 'Hybrid', 7.2, 'jr-frontend-dev'],
    ['comp_9', 'ByteWave', 'Frontend Engineer (React)', 'Mobile & Web', 'Information Technology', 'United States', 'California', 'Los Angeles', 'React, TypeScript, JavaScript, HTML/CSS', ['React', 'TypeScript', 'JavaScript', 'HTML/CSS'], '$95,000 - $120,000 / year', 'Los Angeles, CA', 'Remote', 7.5, 'jr-frontend-dev'],
    ['comp_10', 'Apex Logistics', 'IoT & Backend Developer', 'Robotics Systems', 'Information Technology', 'United States', 'Georgia', 'Atlanta', 'C++, Python, SQL, Git', ['C++', 'Python', 'SQL', 'Git'], '$92,000 - $118,000 / year', 'Atlanta, GA', 'On-site', 7.4, 'jr-backend-eng'],
    ['comp_1', 'TechNova', 'Cloud Backend Engineer', 'Cloud Platforms', 'Information Technology', 'United States', 'California', 'San Francisco', 'Java, SQL, AWS, Docker', ['Java', 'SQL', 'AWS', 'Docker'], '$100,000 - $130,000 / year', 'San Francisco, CA', 'Remote', 7.8, 'jr-devops-eng'],
    ['comp_2', 'InnoSoft', 'Machine Learning Research Engineer', 'Applied AI', 'Data & Analytics', 'United States', 'New York', 'New York', 'Python, PyTorch, Pandas & NumPy, DSA', ['Python', 'PyTorch', 'Pandas & NumPy', 'DSA'], '$115,000 - $145,000 / year', 'New York, NY', 'Hybrid', 8.2, 'jr-data-analyst'],
    ['comp_3', 'DataSphere', 'Database Administrator Associate', 'Infrastructure', 'Information Technology', 'United States', 'Illinois', 'Chicago', 'PostgreSQL, SQL, Linux CLI, AWS', ['PostgreSQL', 'SQL', 'Linux CLI', 'AWS'], '$85,000 - $105,000 / year', 'Chicago, IL', 'On-site', 7.2, 'jr-backend-eng'],
    ['comp_4', 'CloudCore', 'Site Reliability Engineer', 'Operations', 'Information Technology', 'United States', 'Washington', 'Seattle', 'Go, Linux CLI, Kubernetes, Docker', ['Go', 'Linux CLI', 'Kubernetes', 'Docker'], '$105,000 - $135,000 / year', 'Seattle, WA', 'Remote', 7.6, 'jr-devops-eng'],
    ['comp_5', 'FinEdge', 'Fintech Application Developer', 'Core Banking', 'FinTech', 'United States', 'Massachusetts', 'Boston', 'Java, SQL, REST APIs, Git', ['Java', 'SQL', 'REST APIs', 'Git'], '$98,000 - $125,000 / year', 'Boston, MA', 'Hybrid', 8.0, 'jr-backend-eng'],
    ['comp_6', 'NextGen AI', 'AI Prompt & Evaluation Engineer', 'Frontier Models', 'Information Technology', 'United States', 'California', 'Palo Alto', 'Python, Git, Soft Skills, REST APIs', ['Python', 'Git', 'REST APIs', 'Aptitude & Problem Solving'], '$85,000 - $110,000 / year', 'Palo Alto, CA', 'Remote', 7.0, 'jr-data-analyst'],
    ['comp_7', 'CyberShield', 'Application Security Engineer', 'AppSec', 'Information Technology', 'United States', 'District of Columbia', 'Washington', 'Java, Python, Git, Linux CLI', ['Java', 'Python', 'Git', 'Linux CLI'], '$96,000 - $122,000 / year', 'Washington, DC', 'Hybrid', 7.8, 'jr-backend-eng'],
    ['comp_8', 'PulseHealth', 'Backend API Developer', 'Core Platform', 'Healthcare IT', 'United States', 'California', 'San Diego', 'Node.js, PostgreSQL, REST APIs, Git', ['Node.js', 'PostgreSQL', 'REST APIs', 'Git'], '$92,000 - $116,000 / year', 'San Diego, CA', 'Remote', 7.4, 'jr-backend-eng'],
    ['comp_9', 'ByteWave', 'Full Stack Web Developer', 'Web Ecosystem', 'Information Technology', 'United States', 'California', 'Los Angeles', 'React, Node.js, MongoDB, Git', ['React', 'Node.js', 'MongoDB', 'Git'], '$94,000 - $120,000 / year', 'Los Angeles, CA', 'Hybrid', 7.5, 'jr-frontend-dev'],
    ['comp_10', 'Apex Logistics', 'Embedded Systems Firmware Intern', 'Robotics', 'Information Technology', 'United States', 'Georgia', 'Atlanta', 'C, C++, Linux CLI, Git', ['C', 'C++', 'Linux CLI', 'Git'], '$40 / hour', 'Atlanta, GA', 'On-site', 7.0, 'jr-backend-eng'],
    ['comp_1', 'TechNova', 'QA Automation & Test Engineer', 'Quality Assurance', 'Information Technology', 'United States', 'California', 'San Francisco', 'Python, SQL, Git, CI/CD Pipelines', ['Python', 'SQL', 'Git', 'CI/CD Pipelines'], '$86,000 - $108,000 / year', 'San Francisco, CA', 'Hybrid', 7.2, 'jr-backend-eng'],
    ['comp_2', 'InnoSoft', 'NLP Solutions Engineer', 'Language Technologies', 'Data & Analytics', 'United States', 'New York', 'New York', 'Python, AI/ML, REST APIs, SQL', ['Python', 'AI/ML', 'REST APIs', 'SQL'], '$108,000 - $138,000 / year', 'New York, NY', 'Remote', 8.0, 'jr-data-analyst'],
    ['comp_3', 'DataSphere', 'Business Intelligence Analyst', 'Analytics', 'Data & Analytics', 'United States', 'Illinois', 'Chicago', 'SQL, Python, Aptitude & Problem Solving', ['SQL', 'Python', 'Aptitude & Problem Solving'], '$82,000 - $104,000 / year', 'Chicago, IL', 'Hybrid', 7.0, 'jr-data-analyst'],
    ['comp_4', 'CloudCore', 'DevSecOps Engineer', 'Security Ops', 'Information Technology', 'United States', 'Washington', 'Seattle', 'AWS, Docker, Linux CLI, Python', ['AWS', 'Docker', 'Linux CLI', 'Python'], '$102,000 - $128,000 / year', 'Seattle, WA', 'Remote', 7.8, 'jr-devops-eng'],
    ['comp_5', 'FinEdge', 'Data Pipeline Developer', 'Market Feeds', 'FinTech', 'United States', 'Massachusetts', 'Boston', 'Python, SQL, Redis, Git', ['Python', 'SQL', 'Redis', 'Git'], '$96,000 - $124,000 / year', 'Boston, MA', 'Hybrid', 7.8, 'jr-backend-eng'],

    // National Corridor Jobs in India
    ['comp_4', 'CloudCore India', 'Cloud Infrastructure Engineer', 'Cloud Infrastructure', 'Information Technology', 'India', 'Karnataka', 'Bangalore', 'AWS, Docker, Linux CLI, Python', ['AWS', 'Docker', 'Linux CLI', 'Python'], '₹12,00,000 - ₹18,00,000 / year', 'Whitefield, Bangalore, Karnataka, India', 'Hybrid', 7.5, 'jr-devops-eng'],
    ['comp_5', 'FinEdge India', 'Core Banking Solutions Engineer', 'Core Banking', 'FinTech', 'India', 'Tamil Nadu', 'Chennai', 'Java, SQL, REST APIs, Git', ['Java', 'SQL', 'REST APIs', 'Git'], '₹11,00,000 - ₹16,50,000 / year', 'OMR Tech Corridor, Chennai, Tamil Nadu, India', 'Hybrid', 7.6, 'jr-backend-eng'],
    ['comp_9', 'ByteWave India', 'Full Stack React Engineer', 'Product Engineering', 'Information Technology', 'India', 'Maharashtra', 'Pune', 'React, TypeScript, Node.js, SQL', ['React', 'TypeScript', 'Node.js', 'SQL'], '₹10,50,000 - ₹15,00,000 / year', 'Hinjewadi Phase 2, Pune, Maharashtra, India', 'Hybrid', 7.4, 'jr-frontend-dev'],
    ['comp_3', 'DataSphere India', 'Associate Data Warehouse Engineer', 'Analytics Systems', 'Data & Analytics', 'India', 'Telangana', 'Hyderabad', 'SQL, Python, Pandas & NumPy, AWS', ['SQL', 'Python', 'Pandas & NumPy', 'AWS'], '₹10,00,000 - ₹14,50,000 / year', 'HITEC City, Hyderabad, Telangana, India', 'Hybrid', 7.2, 'jr-data-analyst'],
    ['comp_2', 'InnoSoft India', 'Machine Learning Engineer', 'Applied AI', 'Information Technology', 'India', 'Haryana', 'Gurgaon', 'Python, AI/ML, PyTorch, SQL', ['Python', 'AI/ML', 'PyTorch', 'SQL'], '₹13,00,000 - ₹19,00,000 / year', 'Cyber City, Gurgaon, Haryana, India', 'Hybrid', 8.0, 'jr-data-analyst']
  ];

  extraJobsData.forEach((item, idx) => {
    const jId = `job_${idx + 6}`;
    const requiredSkills: JobSkillRequirement[] = (item[9] as string[]).map(skillName => {
      const foundSkill = skills.find(s => s.name === skillName);
      return {
        skillId: foundSkill ? foundSkill.id : `sk_${skillName.toLowerCase()}`,
        skillName,
        minLevel: ['DSA', 'Python', 'C++', 'Java', 'SQL', 'React'].includes(skillName) ? 'Intermediate' : 'Beginner',
        isRequired: true,
        weight: 1.2
      };
    });

    jobs.push({
      id: jId,
      companyId: item[0] as string,
      companyName: item[1] as string,
      title: item[2] as string,
      roleId: item[14] as string,
      roleTitle: item[2] as string,
      department: item[3] as string,
      industry: item[4] as string,
      country: item[5] as string,
      region: item[6] as string,
      city: item[7] as string,
      description: `Join ${item[1]} to build cutting-edge systems and develop industry-leading solutions in ${item[3]}.`,
      responsibilities: [
        `Deliver high quality code and participate in sprint planning.`,
        `Collaborate with cross-functional engineers and stakeholders.`,
        `Maintain test coverage, documentation, and continuous delivery.`
      ],
      requirements: [`Strong problem solving and core programming fundamentals`, `Minimum CGPA ${item[13]}`, `Graduation year 2026`],
      requiredSkills,
      preferredSkills: [
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Beginner', isRequired: false, weight: 0.8 }
      ],
      location: item[11] as string,
      workMode: item[12] as any,
      salary: item[10] as string,
      employmentType: (item[10] as string).includes('/ hour') ? 'Internship' : 'Full-time',
      experienceLevel: (item[10] as string).includes('Intern') ? 'Fresher (0-1 yrs)' : 'Junior (1-3 yrs)',
      educationRequirement: 'B.Tech / B.E. / B.S. in Computer Science or related',
      minCgpa: item[13] as number,
      graduationYear: 2026,
      degree: 'B.S. / B.Tech',
      branch: 'Computer Science / IT / Related',
      openings: 3 + (idx % 5),
      deadline: '2026-11-30',
      status: 'published',
      createdAt: `2026-02-${17 + (idx % 10)}T10:00:00Z`
    });
  });

  // 10 Interactive In-Platform Courses
  const courses: Course[] = [
    {
      id: 'crs_python',
      title: 'Python Fundamentals & OOP for Placement',
      slug: 'python-fundamentals',
      category: 'Programming',
      level: 'Beginner',
      duration: '14 Hours (7 Modules)',
      description: 'Master practical Python from zero to object-oriented programming, data structures, file processing, and placement coding interview problems.',
      thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=600&auto=format&fit=crop&q=80',
      modulesCount: 7,
      lessonsCount: 18,
      enrolledCount: 1420,
      rating: 4.9,
      targetSkills: ['Python', 'OOP'],
      overview: 'Comprehensive industry-aligned Python mastery designed specifically for placement assessments and tech hiring interviews.'
    },
    {
      id: 'crs_cpp',
      title: 'C++ Systems & Memory Mastery',
      slug: 'cpp-systems-mastery',
      category: 'Programming',
      level: 'Intermediate',
      duration: '16 Hours (6 Modules)',
      description: 'Low-level memory management, pointers, references, STL containers, and modern C++ for high performance engineering.',
      thumbnail: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=600&auto=format&fit=crop&q=80',
      modulesCount: 6,
      lessonsCount: 16,
      enrolledCount: 980,
      rating: 4.8,
      targetSkills: ['C++', 'OOP'],
      overview: 'Learn C++ memory models, standard template library, smart pointers, and high-frequency algorithms.'
    },
    {
      id: 'crs_java',
      title: 'Java Enterprise & Core Concepts',
      slug: 'java-enterprise-core',
      category: 'Programming',
      level: 'Beginner',
      duration: '15 Hours (6 Modules)',
      description: 'Java Virtual Machine internals, multithreading, collections framework, exception handling, and enterprise architecture.',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      modulesCount: 6,
      lessonsCount: 15,
      enrolledCount: 1100,
      rating: 4.7,
      targetSkills: ['Java', 'OOP'],
      overview: 'End-to-end core Java for enterprise backend software development and campus placement drives.'
    },
    {
      id: 'crs_dsa',
      title: 'Data Structures & Algorithms Masterclass',
      slug: 'dsa-masterclass',
      category: 'Data Structures',
      level: 'Intermediate',
      duration: '24 Hours (8 Modules)',
      description: 'Master binary search, linked lists, trees, graphs, dynamic programming, recursion, and time complexity analysis.',
      thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=600&auto=format&fit=crop&q=80',
      modulesCount: 8,
      lessonsCount: 24,
      enrolledCount: 2350,
      rating: 4.95,
      targetSkills: ['DSA', 'Aptitude & Problem Solving'],
      overview: 'The essential algorithmic foundation required to crack top tier technical interview rounds.'
    },
    {
      id: 'crs_sql',
      title: 'SQL & Relational Database Architecture',
      slug: 'sql-database-architecture',
      category: 'Databases',
      level: 'Beginner',
      duration: '12 Hours (5 Modules)',
      description: 'Master SQL joins, aggregations, window functions, indexing, normal forms, and ACID transaction isolation.',
      thumbnail: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=600&auto=format&fit=crop&q=80',
      modulesCount: 5,
      lessonsCount: 14,
      enrolledCount: 1870,
      rating: 4.85,
      targetSkills: ['SQL', 'PostgreSQL'],
      overview: 'Practical relational database mastery with live query execution and schema design exercises.'
    },
    {
      id: 'crs_git',
      title: 'Git & GitHub Collaboration Essentials',
      slug: 'git-github-essentials',
      category: 'Tools',
      level: 'Beginner',
      duration: '6 Hours (3 Modules)',
      description: 'Branching strategies, rebase vs merge, resolve conflicts, pull request reviews, and automated GitHub Actions.',
      thumbnail: 'https://images.unsplash.com/photo-1629654297299-c8506221ca97?w=600&auto=format&fit=crop&q=80',
      modulesCount: 3,
      lessonsCount: 9,
      enrolledCount: 1650,
      rating: 4.9,
      targetSkills: ['Git'],
      overview: 'Learn professional source code version control and open-source collaboration.'
    },
    {
      id: 'crs_oop',
      title: 'Object-Oriented Design & Clean Architecture',
      slug: 'oop-clean-architecture',
      category: 'Programming',
      level: 'Intermediate',
      duration: '10 Hours (4 Modules)',
      description: 'SOLID design principles, design patterns (Factory, Singleton, Observer, Strategy), and clean code refactoring.',
      thumbnail: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80',
      modulesCount: 4,
      lessonsCount: 12,
      enrolledCount: 1230,
      rating: 4.8,
      targetSkills: ['OOP'],
      overview: 'Master software engineering design patterns and object-oriented paradigms.'
    },
    {
      id: 'crs_cloud',
      title: 'Cloud Fundamentals (AWS & Cloud Architecture)',
      slug: 'cloud-fundamentals-aws',
      category: 'Cloud',
      level: 'Beginner',
      duration: '12 Hours (5 Modules)',
      description: 'Core cloud computing concepts: EC2, S3, IAM, VPC, serverless Lambda, RDS, and scalable cloud solutions.',
      thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop&q=80',
      modulesCount: 5,
      lessonsCount: 15,
      enrolledCount: 1400,
      rating: 4.88,
      targetSkills: ['AWS', 'Cloud'],
      overview: 'Practical cloud architecture foundations required by modern tech companies.'
    },
    {
      id: 'crs_aptitude',
      title: 'Quantitative & Logical Aptitude for Placement',
      slug: 'quantitative-logical-aptitude',
      category: 'Soft Skills',
      level: 'Beginner',
      duration: '10 Hours (4 Modules)',
      description: 'Time & work, permutations, probability, logical deductions, data sufficiency, and coding aptitude tricks.',
      thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&auto=format&fit=crop&q=80',
      modulesCount: 4,
      lessonsCount: 12,
      enrolledCount: 2100,
      rating: 4.75,
      targetSkills: ['Aptitude & Problem Solving'],
      overview: 'Crack initial online assessment screening rounds for top campus recruiters.'
    },
    {
      id: 'crs_interview',
      title: 'Full Technical Interview & System Design Prep',
      slug: 'technical-interview-prep',
      category: 'Programming',
      level: 'Intermediate',
      duration: '15 Hours (5 Modules)',
      description: 'Mock behavioral questions, resume project defense, live coding walkthroughs, and entry-level system design.',
      thumbnail: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80',
      modulesCount: 5,
      lessonsCount: 15,
      enrolledCount: 1750,
      rating: 4.92,
      targetSkills: ['Python', 'DSA', 'System Design'],
      overview: 'Complete placement season preparation covering technical rounds and HR interviews.'
    }
  ];

  // Course Modules for Python course (Section 23 specification)
  const course_modules: CourseModule[] = [
    { id: 'mod_py_1', courseId: 'crs_python', title: 'Module 1: Introduction to Python & Syntax', orderIndex: 1, description: 'Variables, primitive data types, memory references, dynamic typing, and arithmetic/logical operators.' },
    { id: 'mod_py_2', courseId: 'crs_python', title: 'Module 2: Control Flow & Iterations', orderIndex: 2, description: 'Conditional if-elif-else statements, while loops, for-in loops, range generator, and loop controls.' },
    { id: 'mod_py_3', courseId: 'crs_python', title: 'Module 3: Functions & Built-in Collections', orderIndex: 3, description: 'Functions, parameter packing (*args, **kwargs), Lists, Tuples, Dictionaries, Sets, and list comprehensions.' },
    { id: 'mod_py_4', courseId: 'crs_python', title: 'Module 4: String Manipulation & File Handling', orderIndex: 4, description: 'String methods, slicing, formatted f-strings, file read/write streams, and context managers (with statement).' },
    { id: 'mod_py_5', courseId: 'crs_python', title: 'Module 5: Object-Oriented Programming (OOP)', orderIndex: 5, description: 'Classes, constructors (__init__), instance vs class attributes, encapsulation, inheritance, polymorphism, and magic methods.' },
    { id: 'mod_py_6', courseId: 'crs_python', title: 'Module 6: Placement Coding Practice', orderIndex: 6, description: 'Real-world coding interview problems: palindrome checks, two-sum problem, string frequency, and matrix transformations.' },
    { id: 'mod_py_7', courseId: 'crs_python', title: 'Module 7: Final Skill Verification Assessment', orderIndex: 7, description: 'Comprehensive 15-question MCQ & coding verification assessment to earn the Python Verified badge.' }
  ];

  // Lessons for Python Course
  const lessons: Lesson[] = [
    {
      id: 'les_py_1_1',
      moduleId: 'mod_py_1',
      courseId: 'crs_python',
      title: 'Python Variables, Data Types & Memory Model',
      orderIndex: 1,
      durationMinutes: 25,
      contentMarkdown: `# Python Variables & Memory Allocation

In Python, **everything is an object**. When you assign a variable \`x = 10\`, Python allocates an integer object in heap memory and points the reference identifier \`x\` to that memory address.

### Key Characteristics:
1. **Dynamic Typing**: Variable types do not need explicit type declarations.
2. **Strong Typing**: Python prevents implicit operations between mismatched types (e.g., \`'5' + 5\` throws \`TypeError\`).
3. **Immutable Types**: Integers, floats, strings, and tuples cannot be modified in-place.
4. **Mutable Types**: Lists, dictionaries, and sets can be updated in-place without changing reference ID.`,
      codeExample: `# Variable assignment & type checking
name: str = "Alex Rivera"
score: float = 94.5
is_verified: bool = True

print(f"Candidate: {name}, Score: {score}, Verified: {is_verified}")
print(f"Memory address of score: {hex(id(score))}")`,
      practiceTask: 'Declare three variables representing a job title, salary, and openings count. Print them using formatted f-strings.',
      checkQuestion: {
        question: 'What is the output of `type(3.14)` in Python?',
        options: ['<class "double">', '<class "float">', '<class "decimal">', '<class "number">'],
        correctIndex: 1,
        explanation: 'Python represents floating-point decimal numbers with the standard IEEE-754 64-bit float type, represented as `<class "float">`.'
      }
    },
    {
      id: 'les_py_1_2',
      moduleId: 'mod_py_1',
      courseId: 'crs_python',
      title: 'Operators, Expressions & Bitwise Operations',
      orderIndex: 2,
      durationMinutes: 20,
      contentMarkdown: `# Python Operators & Logical Expressions

Operators in Python evaluate expressions and return typed values.

### Categories:
- **Arithmetic**: \`+\`, \`-\`, \`*\`, \`/\`, \`//\` (Floor Division), \`%\` (Modulo), \`**\` (Exponentiation)
- **Comparison**: \`==\`, \`!=\`, \`<\`, \`>\`, \`<=\`, \`>=\`
- **Logical**: \`and\`, \`or\`, \`not\` (Short-circuit evaluation)
- **Identity & Membership**: \`is\`, \`is not\`, \`in\`, \`not in\``,
      codeExample: `a = 17
b = 4
print("Floor division:", a // b) # 4
print("Remainder:", a % b)       # 1
print("Power:", 2 ** 5)          # 32

skills = ["Python", "SQL", "Git"]
print("Is Python present?", "Python" in skills)`,
      practiceTask: 'Write a script that computes quotient and remainder of two numbers and checks if a target skill is in a list.',
      checkQuestion: {
        question: 'What does `19 // 4` evaluate to in Python?',
        options: ['4.75', '4', '5', '3'],
        correctIndex: 1,
        explanation: 'The `//` operator performs floor division, truncating fractional parts and returning the integer 4.'
      }
    },
    {
      id: 'les_py_2_1',
      moduleId: 'mod_py_2',
      courseId: 'crs_python',
      title: 'Conditionals & Branching Logic',
      orderIndex: 3,
      durationMinutes: 25,
      contentMarkdown: `# Control Flow with Conditionals

Python uses clean indentation instead of braces to define code blocks.

\`\`\`python
if condition_1:
    # branch 1
elif condition_2:
    # branch 2
else:
    # fallback
\`\`\``,
      codeExample: `def evaluate_candidate_readiness(score, cgpa):
    if score >= 85 and cgpa >= 8.0:
        return "Placement Ready ✓ - High Match"
    elif score >= 70 and cgpa >= 7.0:
        return "Eligible with Minor Training"
    else:
        return "Needs Training Program"

print(evaluate_candidate_readiness(86, 8.6))`,
      practiceTask: 'Write a function that accepts a student match percentage and returns whether they are Eligible (>=75%) or Not Yet Eligible.',
      checkQuestion: {
        question: 'Which keyword in Python is used for chaining multiple conditional branches?',
        options: ['elseif', 'else if', 'elif', 'elsif'],
        correctIndex: 2,
        explanation: 'Python uses `elif` as shorthand for else-if conditional branching.'
      }
    },
    {
      id: 'les_py_3_1',
      moduleId: 'mod_py_3',
      courseId: 'crs_python',
      title: 'Python Collections: Lists, Tuples, Dictionaries & Sets',
      orderIndex: 4,
      durationMinutes: 30,
      contentMarkdown: `# Python Built-in Data Structures

### Comparison Table:
| Collection | Mutable | Ordered | Duplicates Allowed | Syntax |
| :--- | :--- | :--- | :--- | :--- |
| **List** | Yes | Yes | Yes | \`[1, 2, 3]\` |
| **Tuple** | No | Yes | Yes | \`(1, 2, 3)\` |
| **Dictionary** | Yes | Insertion-order | Keys: No, Values: Yes | \`{'key': 'val'}\` |
| **Set** | Yes | No | No | \`{1, 2, 3}\` |`,
      codeExample: `# Dictionary mapping skill to proficiency
student_profile = {
    "name": "Alex Rivera",
    "skills": ["Python", "SQL", "Git"],
    "scores": {"Python": 86, "SQL": 88}
}

# List comprehension
high_demand_skills = [s for s in student_profile["skills"] if s != "None"]
print("Candidate profile:", student_profile)
print("Skills list:", high_demand_skills)`,
      practiceTask: 'Create a dictionary of 3 skills and filter those with scores above 80 using a dictionary comprehension.',
      checkQuestion: {
        question: 'Which of the following data structures in Python is IMMUTABLE?',
        options: ['List', 'Dictionary', 'Tuple', 'Set'],
        correctIndex: 2,
        explanation: 'Tuples in Python are immutable; once instantiated, their elements and length cannot be altered.'
      }
    },
    {
      id: 'les_py_5_1',
      moduleId: 'mod_py_5',
      courseId: 'crs_python',
      title: 'Object-Oriented Programming (OOP) in Python',
      orderIndex: 5,
      durationMinutes: 35,
      contentMarkdown: `# Object-Oriented Programming (OOP)

Master the 4 core pillars of OOP in Python:
1. **Encapsulation**: Bundling state and methods within a class, using double underscore \`__private\` for encapsulation.
2. **Inheritance**: Deriving specialized subclasses from base classes.
3. **Polymorphism**: Unified interface for different underlying data types.
4. **Abstraction**: Hiding implementation details with ABC (Abstract Base Classes).`,
      codeExample: `class StudentCandidate:
    def __init__(self, name: str, cgpa: float):
        self.name = name
        self.cgpa = cgpa
        self._verified_skills = []

    def add_verified_skill(self, skill_name: str, score: int):
        self._verified_skills.append({"skill": skill_name, "score": score})

    def get_readiness_score(self) -> int:
        return min(100, 30 + len(self._verified_skills) * 20)

alex = StudentCandidate("Alex Rivera", 8.6)
alex.add_verified_skill("Python", 86)
alex.add_verified_skill("SQL", 88)
print(f"Alex Readiness: {alex.get_readiness_score()}%")`,
      practiceTask: 'Implement a `JobPosting` class with attributes `title`, `min_cgpa`, and a method `is_eligible(student)` returning boolean.',
      checkQuestion: {
        question: 'What special method is invoked when an instance of a Python class is created?',
        options: ['__create__', '__init__', '__new__', '__construct__'],
        correctIndex: 1,
        explanation: '`__init__` is the instance initializer method in Python classes, receiving `self` along with constructor arguments.'
      }
    }
  ];

  // 20+ Assessments for skill verification
  const assessments: Assessment[] = [
    {
      id: 'asm_python',
      skillId: 'sk_python',
      skillName: 'Python',
      title: 'Python Core & OOP Certification Assessment',
      description: 'Official Skill2Hire verification assessment evaluating core Python syntax, OOP, collection manipulation, and algorithmic problem solving.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 20,
      totalQuestions: 5,
      courseId: 'crs_python'
    },
    {
      id: 'asm_dsa',
      skillId: 'sk_dsa',
      skillName: 'DSA',
      title: 'Data Structures & Algorithms Verification Assessment',
      description: 'Evaluate algorithmic complexity, arrays, linked lists, trees, graphs, sorting, and dynamic programming problem solving.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 25,
      totalQuestions: 5,
      courseId: 'crs_dsa'
    },
    {
      id: 'asm_sql',
      skillId: 'sk_sql',
      skillName: 'SQL',
      title: 'SQL Relational Queries & Database Verification',
      description: 'Test relational schema querying, joins, aggregate GROUP BY filters, window functions, and indexing.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 20,
      totalQuestions: 5,
      courseId: 'crs_sql'
    },
    {
      id: 'asm_cpp',
      skillId: 'sk_cpp',
      skillName: 'C++',
      title: 'C++ Systems & Memory Assessment',
      description: 'Evaluate pointers, memory allocation, STL vector/map containers, and object lifetime rules.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 20,
      totalQuestions: 5,
      courseId: 'crs_cpp'
    },
    {
      id: 'asm_java',
      skillId: 'sk_java',
      skillName: 'Java',
      title: 'Java Core & Collections Certification',
      description: 'Evaluate JVM execution, interfaces, exception hierarchy, and concurrency primitives.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 20,
      totalQuestions: 5,
      courseId: 'crs_java'
    },
    {
      id: 'asm_git',
      skillId: 'sk_git',
      skillName: 'Git',
      title: 'Git Version Control & Workflows',
      description: 'Evaluate git commits, merge conflict resolution, rebasing, remotes, and pull requests.',
      targetLevel: 'Beginner',
      passingScore: 75,
      durationMinutes: 15,
      totalQuestions: 5,
      courseId: 'crs_git'
    },
    {
      id: 'asm_aws',
      skillId: 'sk_aws',
      skillName: 'AWS',
      title: 'AWS Cloud Fundamentals Assessment',
      description: 'Verify understanding of EC2 compute, S3 object storage, IAM security policies, and VPC networking.',
      targetLevel: 'Beginner',
      passingScore: 75,
      durationMinutes: 15,
      totalQuestions: 5,
      courseId: 'crs_cloud'
    },
    {
      id: 'asm_react',
      skillId: 'sk_react',
      skillName: 'React',
      title: 'React & Component Architecture Assessment',
      description: 'Test state hooks (useState, useEffect, useMemo), props drilling vs Context, and virtual DOM rendering.',
      targetLevel: 'Intermediate',
      passingScore: 75,
      durationMinutes: 20,
      totalQuestions: 5
    }
  ];

  // Questions for Python Assessment (Section 49 Demo: Score 86%)
  const questions: Question[] = [
    {
      id: 'q_py_1',
      assessmentId: 'asm_python',
      questionText: 'What is the time complexity of looking up a key in a standard Python dictionary (`dict`) with good hash distribution?',
      type: 'mcq',
      options: ['O(n)', 'O(log n)', 'O(1) average case', 'O(n log n)'],
      correctOptionIndex: 2,
      points: 20,
      explanation: 'Python dictionaries are implemented as hash tables, providing O(1) average time complexity for key lookup, insertion, and deletion.'
    },
    {
      id: 'q_py_2',
      assessmentId: 'asm_python',
      questionText: 'Which keyword allows a function to yield values one by one as a memory-efficient generator instead of constructing a full list in memory?',
      type: 'mcq',
      options: ['return', 'yield', 'emit', 'generate'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'The `yield` keyword turns a Python function into a generator iterator, emitting values lazily upon iteration.'
    },
    {
      id: 'q_py_3',
      assessmentId: 'asm_python',
      questionText: 'Examine the following code. What will be the output?\n\n```python\na = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))\n```',
      type: 'mcq',
      options: ['3', '4', 'TypeError', 'None'],
      correctOptionIndex: 1,
      points: 20,
      codeSnippet: 'a = [1, 2, 3]\nb = a\nb.append(4)\nprint(len(a))',
      explanation: 'Because lists are mutable objects, `b = a` assigns a reference to the exact same list in memory. Mutating `b` also mutates `a`.'
    },
    {
      id: 'q_py_4',
      assessmentId: 'asm_python',
      questionText: 'In Python Object-Oriented Programming, how do you call a method from the parent class inside an overridden child method?',
      type: 'mcq',
      options: ['parent().method()', 'super().method()', 'base.method()', 'this.__super__.method()'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'The `super()` built-in proxy object delegates method calls to a parent or sibling class in the Method Resolution Order (MRO).'
    },
    {
      id: 'q_py_5',
      assessmentId: 'asm_python',
      questionText: 'What is the output of the list comprehension `[x ** 2 for x in range(5) if x % 2 == 0]`?',
      type: 'mcq',
      options: ['[0, 4, 16]', '[1, 9]', '[0, 1, 4, 9, 16]', '[4, 16]'],
      correctOptionIndex: 0,
      points: 20,
      explanation: 'Range(5) generates [0, 1, 2, 3, 4]. The even numbers are 0, 2, 4. Their squares are 0, 4, 16.'
    },

    // DSA Questions
    {
      id: 'q_dsa_1',
      assessmentId: 'asm_dsa',
      questionText: 'What is the worst-case time complexity of standard QuickSort with poor pivot selection?',
      type: 'mcq',
      options: ['O(n log n)', 'O(n^2)', 'O(n)', 'O(log n)'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'When the pivot is consistently the smallest or largest element (e.g. sorted array without random pivot), QuickSort degrades to O(n^2).'
    },
    {
      id: 'q_dsa_2',
      assessmentId: 'asm_dsa',
      questionText: 'Which data structure operates on a Last-In, First-Out (LIFO) order?',
      type: 'mcq',
      options: ['Queue', 'Stack', 'Heap', 'Hash Table'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'A Stack follows the Last-In First-Out (LIFO) protocol.'
    },
    {
      id: 'q_dsa_3',
      assessmentId: 'asm_dsa',
      questionText: 'In a balanced Binary Search Tree (such as an AVL or Red-Black tree), what is the time complexity to search for an element?',
      type: 'mcq',
      options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'A balanced BST guarantees a maximum height of O(log n), making search operations O(log n).'
    },
    {
      id: 'q_dsa_4',
      assessmentId: 'asm_dsa',
      questionText: 'Which graph traversal algorithm uses a Queue data structure and visits nodes layer by layer?',
      type: 'mcq',
      options: ['Depth First Search (DFS)', 'Breadth First Search (BFS)', 'Bellman-Ford', 'Kruskal Algorithm'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'BFS explores graph vertices level by level using a FIFO Queue.'
    },
    {
      id: 'q_dsa_5',
      assessmentId: 'asm_dsa',
      questionText: 'What algorithm strategy breaks a problem down into overlapping subproblems and stores previously computed results to avoid recomputation?',
      type: 'mcq',
      options: ['Greedy Method', 'Dynamic Programming (Memoization)', 'Divide and Conquer', 'Backtracking'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Dynamic Programming solves problems with overlapping subproblems by memoizing or tabulating intermediate subproblem results.'
    },

    // SQL Questions
    {
      id: 'q_sql_1',
      assessmentId: 'asm_sql',
      questionText: 'Which SQL clause is used to filter rows AFTER an aggregate `GROUP BY` operation has taken place?',
      type: 'mcq',
      options: ['WHERE', 'HAVING', 'ORDER BY', 'FILTER'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`WHERE` filters rows before grouping; `HAVING` filters the aggregate groups resulting from `GROUP BY`.'
    },
    {
      id: 'q_sql_2',
      assessmentId: 'asm_sql',
      questionText: 'Which type of JOIN returns all records from the left table and matched records from the right table, filling with NULL where no match exists?',
      type: 'mcq',
      options: ['INNER JOIN', 'LEFT JOIN (LEFT OUTER JOIN)', 'RIGHT JOIN', 'CROSS JOIN'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'LEFT JOIN returns all rows from the left table regardless of whether a matching record exists in the right table.'
    },
    {
      id: 'q_sql_3',
      assessmentId: 'asm_sql',
      questionText: 'What database structure significantly speeds up data retrieval on specified columns at the cost of additional storage and write overhead?',
      type: 'mcq',
      options: ['View', 'Trigger', 'Index (e.g. B-Tree)', 'Foreign Key'],
      correctOptionIndex: 2,
      points: 20,
      explanation: 'Indexes (such as B-Trees) provide rapid O(log n) lookups on indexed columns.'
    },
    {
      id: 'q_sql_4',
      assessmentId: 'asm_sql',
      questionText: 'What does the "A" in ACID database transaction properties stand for?',
      type: 'mcq',
      options: ['Availability', 'Atomicity (All or Nothing)', 'Asynchronous', 'Authentication'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Atomicity guarantees that all operations within a database transaction either complete fully or are rolled back completely.'
    },
    {
      id: 'q_sql_5',
      assessmentId: 'asm_sql',
      questionText: 'Which SQL function calculates the average value of a numeric column across grouped rows?',
      type: 'mcq',
      options: ['MEDIAN()', 'SUM() / COUNT()', 'AVG()', 'MEAN()'],
      correctOptionIndex: 2,
      points: 20,
      explanation: '`AVG()` is the standard ANSI SQL aggregate function for computing the arithmetic mean.'
    },
    // C++ Assessment Questions
    {
      id: 'q_cpp_1',
      assessmentId: 'asm_cpp',
      questionText: 'In C++, what is the primary purpose of RAII (Resource Acquisition Is Initialization)?',
      type: 'mcq',
      options: ['To execute functions asynchronously', 'To automatically manage resource lifetimes using object scope and destructors', 'To speed up compilation times', 'To check types at runtime'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'RAII binds resource management (like memory, file handles, or locks) to the lifetime of stack-allocated objects, utilizing destructors for automatic cleanup when scope is exited.'
    },
    {
      id: 'q_cpp_2',
      assessmentId: 'asm_cpp',
      questionText: 'Which C++ smart pointer type should be used when you want exclusive, single ownership of a dynamically allocated resource with zero runtime overhead?',
      type: 'mcq',
      options: ['std::shared_ptr', 'std::weak_ptr', 'std::unique_ptr', 'std::auto_ptr'],
      correctOptionIndex: 2,
      points: 20,
      explanation: '`std::unique_ptr` maintains sole ownership of a resource, freeing it when the pointer goes out of scope. It operates with zero overhead compared to raw pointers.'
    },
    {
      id: 'q_cpp_3',
      assessmentId: 'asm_cpp',
      questionText: 'What is the main difference between `std::vector` and `std::list` in the C++ Standard Template Library (STL)?',
      type: 'mcq',
      options: ['std::vector is a linked list while std::list is a dynamic array', 'std::vector provides O(1) random access while std::list provides O(N) sequential access', 'std::list has lower memory overhead than std::vector', 'std::vector only stores integer types'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`std::vector` stores elements contiguously allowing O(1) index access, while `std::list` is a doubly linked list requiring O(N) traversal to reach a index.'
    },
    {
      id: 'q_cpp_4',
      assessmentId: 'asm_cpp',
      questionText: 'What does the `virtual` keyword on a C++ member function indicate?',
      type: 'mcq',
      options: ['The function has no implementation', 'The function is compiled to WebAssembly', 'The function can be overridden in derived classes and resolved dynamically at runtime', 'The function is static and cannot access member fields'],
      correctOptionIndex: 2,
      points: 20,
      explanation: 'The `virtual` keyword enables dynamic dispatch (runtime polymorphism) by using a vtable to determine which overridden method to execute based on the actual object type.'
    },
    {
      id: 'q_cpp_5',
      assessmentId: 'asm_cpp',
      questionText: 'Examine the code snippet: `int x = 5; int* p = &x; *p = 10;`. What is the value of `x` after execution?',
      type: 'mcq',
      options: ['5', '10', 'Null / Reference Error', '0'],
      correctOptionIndex: 1,
      points: 20,
      codeSnippet: 'int x = 5;\nint* p = &x;\n*p = 10;',
      explanation: 'The pointer `p` stores the memory address of `x`. Dereferencing the pointer using `*p` and assigning 10 updates the value of the variable `x` directly in memory.'
    },
    // Java Assessment Questions
    {
      id: 'q_java_1',
      assessmentId: 'asm_java',
      questionText: 'In Java, what does the `final` keyword indicate when applied to a class definition?',
      type: 'mcq',
      options: ['The class cannot have static methods', 'The class cannot be instantiated', 'The class cannot be subclassed (inherited from)', 'All fields in the class are automatically mutable'],
      correctOptionIndex: 2,
      points: 20,
      explanation: 'Applying `final` to a class prevents other classes from inheriting from or subclassing it (e.g., the built-in Java `String` class is final).'
    },
    {
      id: 'q_java_2',
      assessmentId: 'asm_java',
      questionText: 'Which memory area in the Java Virtual Machine (JVM) stores dynamically allocated objects and is managed by the Garbage Collector?',
      type: 'mcq',
      options: ['Stack Memory', 'Heap Memory', 'Method Area', 'PC Registers'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'JVM Stack memory stores local variable frames and primitive values; all objects are allocated on the central JVM Heap and reclaimed by the Garbage Collector when unreachable.'
    },
    {
      id: 'q_java_3',
      assessmentId: 'asm_java',
      questionText: 'Which collection class in Java implements the `List` interface, maintains insertion order, and uses a resizable array internally?',
      type: 'mcq',
      options: ['LinkedList', 'HashSet', 'ArrayList', 'TreeMap'],
      correctOptionIndex: 2,
      points: 20,
      explanation: '`ArrayList` uses a dynamically resizing array to store items, providing fast read access and preserving the sequence in which items were added.'
    },
    {
      id: 'q_java_4',
      assessmentId: 'asm_java',
      questionText: 'What is the primary difference between a checked exception and an unchecked exception in Java?',
      type: 'mcq',
      options: ['Checked exceptions must be declared or handled at compile time; unchecked exceptions do not require compile-time handling', 'Unchecked exceptions occur only in multi-threaded programs', 'Checked exceptions inherit from RuntimeException', 'Unchecked exceptions are checked by the JVM compiler'],
      correctOptionIndex: 0,
      points: 20,
      explanation: 'Checked exceptions (inheriting from `Exception` but not `RuntimeException`) are checked at compile-time and require `try-catch` or `throws`. Unchecked exceptions (`RuntimeException`) do not.'
    },
    {
      id: 'q_java_5',
      assessmentId: 'asm_java',
      questionText: 'What does the `synchronized` keyword in Java do?',
      type: 'mcq',
      options: ['It makes the execution of methods faster', 'It ensures that only one thread can execute a block of code or method at a time on a given monitor object', 'It serializes objects to disk', 'It compiles code at runtime'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`synchronized` locks access to a method or block, preventing multiple threads from concurrently modifying shared resources and causing race conditions.'
    },
    // Git Assessment Questions
    {
      id: 'q_git_1',
      assessmentId: 'asm_git',
      questionText: 'Which Git command is used to record staged changes permanently to the local repository history?',
      type: 'mcq',
      options: ['git add', 'git push', 'git commit', 'git checkout'],
      correctOptionIndex: 2,
      points: 20,
      explanation: '`git add` stages changes; `git commit` takes a snapshot of those staged changes and saves them to local repository history.'
    },
    {
      id: 'q_git_2',
      assessmentId: 'asm_git',
      questionText: 'What is the purpose of the `git stash` command?',
      type: 'mcq',
      options: ['To delete the local branch permanently', 'To temporarily save uncommitted local changes and reset the working directory to match HEAD', 'To push local branches to the remote server', 'To merge two conflicting branches'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`git stash` allows you to save your modified files temporarily in a stack and cleans your workspace, so you can work on something else and restore the changes later using `git stash pop`.'
    },
    {
      id: 'q_git_3',
      assessmentId: 'asm_git',
      questionText: 'What does the command `git checkout -b feature-auth` do?',
      type: 'mcq',
      options: ['Deletes the branch feature-auth', 'Creates a new branch named feature-auth and switches your working branch to it', 'Resets the current branch to feature-auth', 'Displays a list of all branches starting with feature-auth'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'This combines two operations: `git branch feature-auth` (creation) and `git checkout feature-auth` (switching working branch).'
    },
    {
      id: 'q_git_4',
      assessmentId: 'asm_git',
      questionText: 'What is the main difference between `git merge` and `git rebase`?',
      type: 'mcq',
      options: ['Merge deletes history; rebase preserves it', 'Merge creates a new commit joining two branches; rebase moves the base of a branch to create a linear history', 'Rebase can only be used on remote repositories', 'Merge requires internet access; rebase does not'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`merge` preserves the exact chronological branches via a merge commit; `rebase` rewrites history by placing local commits on top of the target branch base for a linear history.'
    },
    {
      id: 'q_git_5',
      assessmentId: 'asm_git',
      questionText: 'What is the purpose of the `.gitignore` file in a Git repository?',
      type: 'mcq',
      options: ['To list files that should be force-pushed to the remote origin', 'To specify file paths and patterns that Git should untrack and ignore', 'To store user login credentials', 'To set repository access permissions'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`.gitignore` ensures that build directories, environment secrets (`.env`), or node dependencies (`node_modules`) are not tracked or committed to version control.'
    },
    // AWS Cloud Assessment Questions
    {
      id: 'q_aws_1',
      assessmentId: 'asm_aws',
      questionText: 'Which AWS service provides resizable, on-demand virtual servers in the cloud?',
      type: 'mcq',
      options: ['Amazon S3', 'Amazon EC2', 'Amazon RDS', 'AWS Lambda'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Amazon EC2 (Elastic Compute Cloud) provides virtual machines, letting you choose OS, instance specs, and network settings on a pay-as-you-go model.'
    },
    {
      id: 'q_aws_2',
      assessmentId: 'asm_aws',
      questionText: 'What is the primary service type of Amazon Simple Storage Service (S3)?',
      type: 'mcq',
      options: ['Relational database storage', 'Object-based storage for files and assets', 'Block storage for OS drives', 'In-memory cache cluster'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Amazon S3 is an object storage service designed to store and retrieve any amount of unstructured data (files, images, backups) from anywhere on the web.'
    },
    {
      id: 'q_aws_3',
      assessmentId: 'asm_aws',
      questionText: 'Which AWS tool is used to securely manage user access, credentials, and permissions to AWS services?',
      type: 'mcq',
      options: ['Amazon CloudWatch', 'AWS Identity and Access Management (IAM)', 'AWS CloudTrail', 'Amazon VPC'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'IAM (Identity and Access Management) allows you to define granular permission policies, roles, groups, and users to secure your AWS resource control plane.'
    },
    {
      id: 'q_aws_4',
      assessmentId: 'asm_aws',
      questionText: 'What is the primary benefit of AWS Lambda?',
      type: 'mcq',
      options: ['It provides dedicated virtual servers with root access', 'It runs code in response to events and handles scale automatically without provisioning servers (Serverless)', 'It hosts domain name systems', 'It performs data warehouse analytical queries'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'AWS Lambda is serverless compute; it runs custom code triggers (API requests, file uploads) and scales down to zero when idle, saving cost.'
    },
    {
      id: 'q_aws_5',
      assessmentId: 'asm_aws',
      questionText: 'What does Amazon VPC stand for, and what is its purpose?',
      type: 'mcq',
      options: ['Virtual Private Cache, for storing session data', 'Virtual Private Cloud, to define a logically isolated virtual network for your AWS resources', 'Variable Power Compute, for machine learning jobs', 'Vector Point Connection, for direct fiber connections'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Amazon VPC (Virtual Private Cloud) allows you to partition a section of AWS into an isolated network, giving you control over IP ranges, subnets, route tables, and gateways.'
    },
    // React Assessment Questions
    {
      id: 'q_react_1',
      assessmentId: 'asm_react',
      questionText: 'In React, which built-in Hook is used to add and update component state?',
      type: 'mcq',
      options: ['useEffect', 'useState', 'useContext', 'useReducer'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`useState` declares a state variable and a dispatch function to update it, trigger a component re-render, and preserve state values across renders.'
    },
    {
      id: 'q_react_2',
      assessmentId: 'asm_react',
      questionText: 'What is the primary purpose of the `useEffect` Hook in functional React components?',
      type: 'mcq',
      options: ['To speed up virtual DOM updates', 'To perform side effects (such as data fetching, subscriptions, or DOM mutations)', 'To bind event handlers to elements', 'To memoize expensive calculation outputs'],
      correctOptionIndex: 1,
      points: 20,
      explanation: '`useEffect` runs asynchronous side-effects, executing code after rendering and cleaning up resources (e.g. event listeners) when the component unmounts or dependencies change.'
    },
    {
      id: 'q_react_3',
      assessmentId: 'asm_react',
      questionText: 'Why is it important to use `key` props when rendering lists of elements in React?',
      type: 'mcq',
      options: ['To style list items differently', 'To help React identify which items have changed, been added, or been removed, ensuring efficient re-rendering', 'To secure list items from cross-site scripting', 'To make list items clickable'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Keys provide stable identities to list elements. This helps React\'s reconciliation algorithm match changes between virtual and actual DOM trees without recreating the entire list.'
    },
    {
      id: 'q_react_4',
      assessmentId: 'asm_react',
      questionText: 'What is the difference between `Props` and `State` in React?',
      type: 'mcq',
      options: ['Props are internal and private to a component; State is passed down from parents', 'Props are immutable configuration passed to a component; State is mutable internal data managed by the component', 'State is read-only; Props can be modified by the child component', 'There is no difference; they are aliases'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'Props are read-only variables passed from parents to children to customize configuration. State represents mutable internal data variables managed by the component itself.'
    },
    {
      id: 'q_react_5',
      assessmentId: 'asm_react',
      questionText: "What does React's Virtual DOM do?",
      type: 'mcq',
      options: ['Directly renders 3D elements in the browser', 'Keeps a lightweight representation of the real DOM in memory and syncs changes via a diffing process (reconciliation)', 'Replaces the browser\'s CSS rendering engine', 'Enables server-side database connections'],
      correctOptionIndex: 1,
      points: 20,
      explanation: 'The Virtual DOM sits as an in-memory buffer. When state changes, React computes minimal changes against the old tree and batches updates to the real DOM, optimizing render performance.'
    }
  ];

  // College Curriculum for Apex University (Demo college)
  // Current curriculum has: C Programming, Java, DBMS, Operating Systems, Computer Networks
  // Notice: Python is LOW/NONE, Cloud is NONE, DSA is MEDIUM
  const college_curriculum: CollegeCurriculum[] = [
    { id: 'curr_1', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Introduction to C Programming', semester: 1, coveredSkills: ['C'], coverageLevel: 'High' },
    { id: 'curr_2', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Data Structures & Algorithms in C/C++', semester: 2, coveredSkills: ['DSA', 'C++'], coverageLevel: 'Medium' },
    { id: 'curr_3', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Database Management Systems (DBMS)', semester: 3, coveredSkills: ['SQL'], coverageLevel: 'Medium' },
    { id: 'curr_4', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Object-Oriented Programming with Java', semester: 4, coveredSkills: ['Java', 'OOP'], coverageLevel: 'High' },
    { id: 'curr_5', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Operating Systems & Linux Basics', semester: 5, coveredSkills: ['Linux CLI'], coverageLevel: 'Medium' },
    { id: 'curr_6', collegeId: 'col_1', department: 'Computer Science', subjectName: 'Computer Networks & Protocols', semester: 6, coveredSkills: ['Networking'], coverageLevel: 'High' }
  ];

  // Career Paths
  const career_paths: CareerPath[] = [
    {
      id: 'cp_sw_dev',
      title: 'Full Stack Software Developer',
      description: 'Architect web applications, backend APIs, distributed microservices, and database layers.',
      targetRole: 'Software Developer',
      requiredSkills: [
        { skill: 'Python', level: 'Intermediate' },
        { skill: 'DSA', level: 'Intermediate' },
        { skill: 'SQL', level: 'Intermediate' },
        { skill: 'Git', level: 'Beginner' },
        { skill: 'AWS', level: 'Beginner' }
      ],
      recommendedCourses: ['Python Fundamentals & OOP for Placement', 'Data Structures & Algorithms Masterclass', 'SQL & Relational Database Architecture', 'Git & GitHub Collaboration Essentials'],
      recommendedProjects: ['High-Throughput Distributed Task Queue', 'Campus Food Delivery Logistics Engine'],
      matchOpportunities: 18
    },
    {
      id: 'cp_data_analyst',
      title: 'Data Analyst & ML Specialist',
      description: 'Transform raw data into strategic insights, analytical models, and automated reporting systems.',
      targetRole: 'Data Analyst',
      requiredSkills: [
        { skill: 'Python', level: 'Intermediate' },
        { skill: 'SQL', level: 'Intermediate' },
        { skill: 'Pandas & NumPy', level: 'Intermediate' },
        { skill: 'AI/ML', level: 'Beginner' },
        { skill: 'Aptitude & Problem Solving', level: 'Intermediate' }
      ],
      recommendedCourses: ['Python Fundamentals & OOP for Placement', 'SQL & Relational Database Architecture', 'Quantitative & Logical Aptitude for Placement'],
      recommendedProjects: ['E-Commerce Predictive Customer Churn & Analytics', 'Financial Transaction Stream Analyzer'],
      matchOpportunities: 12
    },
    {
      id: 'cp_cloud_devops',
      title: 'Cloud & DevOps Engineer',
      description: 'Automate continuous integration, Kubernetes clusters, and multi-region cloud infrastructure.',
      targetRole: 'Cloud DevOps Associate',
      requiredSkills: [
        { skill: 'AWS', level: 'Intermediate' },
        { skill: 'Docker', level: 'Intermediate' },
        { skill: 'Linux CLI', level: 'Intermediate' },
        { skill: 'Git', level: 'Intermediate' }
      ],
      recommendedCourses: ['Cloud Fundamentals (AWS & Cloud Architecture)', 'Git & GitHub Collaboration Essentials'],
      recommendedProjects: ['Cloud-Native Container Orchestration & CI/CD Pipeline', 'Multi-Region High-Availability VPC'],
      matchOpportunities: 9
    }
  ];

  // Placement Drives
  const placement_drives: PlacementDrive[] = [
    {
      id: 'drv_1',
      companyId: 'comp_1',
      collegeId: 'col_1',
      companyName: 'TechNova',
      collegeName: 'Apex University of Engineering',
      title: 'TechNova 2026 Campus Placement Drive',
      date: '2026-09-15',
      venue: 'Main Auditorium & Virtual Assessment Lab',
      minCgpa: 7.5,
      eligibleDepartments: ['Computer Science', 'Information Technology', 'Software Engineering'],
      status: 'scheduled'
    },
    {
      id: 'drv_2',
      companyId: 'comp_2',
      collegeId: 'col_1',
      companyName: 'InnoSoft',
      collegeName: 'Apex University of Engineering',
      title: 'InnoSoft AI & Data Hiring Drive',
      date: '2026-09-22',
      venue: 'CS Department Placement Complex',
      minCgpa: 7.8,
      eligibleDepartments: ['Computer Science', 'Data Science', 'IT'],
      status: 'scheduled'
    }
  ];

  // Notifications
  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: 'u_student_1',
      role: 'student',
      title: 'Placement Readiness Update',
      message: 'You have completed SQL verification! Complete Python and DSA assessments to reach 90%+ readiness for TechNova Software Developer openings.',
      type: 'info',
      link: '/jobs/job_1',
      read: false,
      createdAt: '2026-02-15T10:00:00Z'
    },
    {
      id: 'notif_2',
      userId: 'u_col_1',
      role: 'college',
      title: 'Industry Skill Gap Alert',
      message: '87% of active hiring companies require Python & Cloud skills. Apex University CS syllabus currently has a critical gap in practical Python and Cloud training.',
      type: 'alert',
      link: '/college/curriculum-gap',
      read: false,
      createdAt: '2026-02-14T09:00:00Z'
    },
    {
      id: 'notif_3',
      userId: 'u_comp_1',
      role: 'company',
      title: 'New Candidate Matches',
      message: '14 candidates from Apex University and Stanford Tech match your Software Developer opening with verified skill passports.',
      type: 'success',
      link: '/recruiter/candidates',
      read: false,
      createdAt: '2026-02-15T11:30:00Z'
    }
  ];

  const certificates: Certificate[] = [
    {
      id: 'cert_1',
      certificateNumber: 'CERT-SQL-8821',
      studentId: 'std_1',
      studentName: 'Alex Rivera',
      skillOrCourseName: 'SQL Relational Queries',
      type: 'skill',
      level: 'Intermediate',
      score: 88,
      issuedDate: '2026-02-01',
      verificationUrl: '/verify/CERT-SQL-8821'
    }
  ];

  const projects: Project[] = [
    {
      id: 'proj_1',
      studentId: 'std_1',
      title: 'Distributed Task Queue & Cache Manager',
      description: 'High-throughput async job processor built with Python, Redis, and PostgreSQL with automatic retries and dead-letter queueing.',
      technologies: ['Python', 'SQL', 'Redis', 'Docker'],
      githubUrl: 'https://github.com/alexrivera/distributed-queue',
      verified: true
    },
    {
      id: 'proj_2',
      studentId: 'std_1',
      title: 'Campus Food Delivery Logistics Engine',
      description: 'Interactive order tracking and delivery dispatch system utilizing Dijkstra shortest path algorithms.',
      technologies: ['React', 'Node.js', 'DSA', 'SQL'],
      githubUrl: 'https://github.com/alexrivera/campus-dispatch',
      verified: true
    }
  ];

  // ----------------------------------------------------
  // GLOBAL-FIRST GEOGRAPHY ENTITIES
  // ----------------------------------------------------
  const countries: Country[] = [
    { id: 'in', code: 'IND', name: 'India', currency: 'INR', currencySymbol: '₹', flagEmoji: '🇮🇳', continent: 'Asia' },
    { id: 'us', code: 'USA', name: 'United States', currency: 'USD', currencySymbol: '$', flagEmoji: '🇺🇸', continent: 'North America' },
    { id: 'sg', code: 'SGP', name: 'Singapore', currency: 'SGD', currencySymbol: 'S$', flagEmoji: '🇸🇬', continent: 'Asia' },
    { id: 'kr', code: 'KOR', name: 'South Korea', currency: 'KRW', currencySymbol: '₩', flagEmoji: '🇰🇷', continent: 'Asia' },
    { id: 'cn', code: 'CHN', name: 'China', currency: 'CNY', currencySymbol: '¥', flagEmoji: '🇨🇳', continent: 'Asia' },
    { id: 'de', code: 'DEU', name: 'Germany', currency: 'EUR', currencySymbol: '€', flagEmoji: '🇩🇪', continent: 'Europe' },
    { id: 'gb', code: 'GBR', name: 'United Kingdom', currency: 'GBP', currencySymbol: '£', flagEmoji: '🇬🇧', continent: 'Europe' }
  ];

  const regions: Region[] = [
    { id: 'in-bihar', countryId: 'in', name: 'Bihar', code: 'BR', type: 'state', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'ACTIVE_FLAGSHIP' },
    { id: 'in-tamilnadu', countryId: 'in', name: 'Tamil Nadu', code: 'TN', type: 'state', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'EXPANSION_DEMO' },
    { id: 'in-telangana', countryId: 'in', name: 'Telangana', code: 'TS', type: 'state', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'EXPANSION_DEMO' },
    { id: 'in-maharashtra', countryId: 'in', name: 'Maharashtra', code: 'MH', type: 'state', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'EXPANSION_DEMO' },
    { id: 'kr-seoul', countryId: 'kr', name: 'Seoul Capital Area (Pangyo)', code: 'KR-11', type: 'province', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'EXPANSION_DEMO' },
    { id: 'cn-guangdong', countryId: 'cn', name: 'Greater Bay Area (Shenzhen)', code: 'CN-GD', type: 'province', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'EXPANSION_DEMO' },
    { id: 'in-karnataka', countryId: 'in', name: 'Karnataka', code: 'KA', type: 'state', isActive: true, hasRegionalIntelligence: true, deploymentStatus: 'PLANNED' },
    { id: 'in-delhi', countryId: 'in', name: 'Delhi NCR', code: 'DL', type: 'territory', isActive: true, hasRegionalIntelligence: false, deploymentStatus: 'PLANNED' },
    { id: 'us-ca', countryId: 'us', name: 'California', code: 'CA', type: 'state', isActive: true, hasRegionalIntelligence: false, deploymentStatus: 'PLANNED' },
    { id: 'sg-central', countryId: 'sg', name: 'Central Singapore', code: 'SG-01', type: 'region', isActive: true, hasRegionalIntelligence: false, deploymentStatus: 'PLANNED' }
  ];

  const cities: City[] = [
    // Bihar Administrative Districts & Economic Hubs
    { id: 'in-br-patna', countryId: 'in', regionId: 'in-bihar', name: 'Patna', isDistrict: true, districtCode: 'PAT', tier: 'tier2', populationEstimated: 2480000, primaryEconomicFocus: ['IT & Software Services', 'Public Sector & BELTRON', 'Financial Services', 'Startups'] },
    { id: 'in-br-muzaffarpur', countryId: 'in', regionId: 'in-bihar', name: 'Muzaffarpur', isDistrict: true, districtCode: 'MUZ', tier: 'tier2', populationEstimated: 950000, primaryEconomicFocus: ['Agro-Processing & Food Tech', 'Logistics & Warehousing', 'Regional Commerce'] },
    { id: 'in-br-gaya', countryId: 'in', regionId: 'in-bihar', name: 'Gaya', isDistrict: true, districtCode: 'GAY', tier: 'tier2', populationEstimated: 850000, primaryEconomicFocus: ['Renewable & Solar Energy', 'Tourism Tech', 'Logistics Corridor'] },
    { id: 'in-br-bhagalpur', countryId: 'in', regionId: 'in-bihar', name: 'Bhagalpur', isDistrict: true, districtCode: 'BHA', tier: 'tier3', populationEstimated: 750000, primaryEconomicFocus: ['Smart Silk & Textiles', 'Embedded Systems', 'Regional Software Services'] },
    { id: 'in-br-darbhanga', countryId: 'in', regionId: 'in-bihar', name: 'Darbhanga', isDistrict: true, districtCode: 'DAR', tier: 'tier3', populationEstimated: 680000, primaryEconomicFocus: ['Software Engineering', 'Aviation Logistics', 'Healthcare Informatics'] },
    { id: 'in-br-nalanda', countryId: 'in', regionId: 'in-bihar', name: 'Nalanda (Rajgir)', isDistrict: true, districtCode: 'NAL', tier: 'tier3', populationEstimated: 520000, primaryEconomicFocus: ['Higher Education & Research', 'Electronics Manufacturing Clusters', 'Eco-Tourism'] },
    { id: 'in-br-begusarai', countryId: 'in', regionId: 'in-bihar', name: 'Begusarai', isDistrict: true, districtCode: 'BEG', tier: 'tier3', populationEstimated: 610000, primaryEconomicFocus: ['Industrial Automation', 'Petrochemical Processing', 'Power Engineering'] },
    { id: 'in-br-purnia', countryId: 'in', regionId: 'in-bihar', name: 'Purnia', isDistrict: true, districtCode: 'PUR', tier: 'tier3', populationEstimated: 540000, primaryEconomicFocus: ['Agri-Logistics & Jute Tech', 'Rural Financial Tech', 'Cross-Border Trade Services'] },

    // Tamil Nadu Tech & Industrial Hubs
    { id: 'in-tn-chennai', countryId: 'in', regionId: 'in-tamilnadu', name: 'Chennai (OMR / Guindy)', isDistrict: true, districtCode: 'CHE', tier: 'tier1', populationEstimated: 11200000, primaryEconomicFocus: ['SaaS & Cloud Software', 'Automotive Technology', 'Electronic Hardware Clusters'] },
    { id: 'in-tn-coimbatore', countryId: 'in', regionId: 'in-tamilnadu', name: 'Coimbatore', isDistrict: true, districtCode: 'CJB', tier: 'tier2', populationEstimated: 2900000, primaryEconomicFocus: ['Engineering R&D', 'Textile Automation & IoT', 'Tier-2 Tech Hub'] },

    // Telangana Tech Hubs
    { id: 'in-ts-hyderabad', countryId: 'in', regionId: 'in-telangana', name: 'Hyderabad (Cyberabad)', isDistrict: true, districtCode: 'HYD', tier: 'tier1', populationEstimated: 10500000, primaryEconomicFocus: ['Enterprise IT & Cloud', 'Life Sciences & BioTech', 'Semiconductor & VLSI Design'] },
    { id: 'in-ts-warangal', countryId: 'in', regionId: 'in-telangana', name: 'Warangal', isDistrict: true, districtCode: 'WGL', tier: 'tier2', populationEstimated: 1100000, primaryEconomicFocus: ['Tier-2 IT Centers', 'Agro-Tech Supply', 'Higher Education'] },

    // Maharashtra Hubs
    { id: 'in-mh-mumbai', countryId: 'in', regionId: 'in-maharashtra', name: 'Mumbai (BKC & Navi Mumbai)', isDistrict: true, districtCode: 'MUM', tier: 'tier1', populationEstimated: 21000000, primaryEconomicFocus: ['BFSI & FinTech', 'Data Centers & Cloud Ops', 'Media & Creative Tech'] },
    { id: 'in-mh-pune', countryId: 'in', regionId: 'in-maharashtra', name: 'Pune (Hinjawadi)', isDistrict: true, districtCode: 'PUN', tier: 'tier1', populationEstimated: 7200000, primaryEconomicFocus: ['Automotive IT & Embedded', 'Enterprise Java', 'Cloud Infrastructure'] },

    // Karnataka & National Hubs
    { id: 'in-ka-bengaluru', countryId: 'in', regionId: 'in-karnataka', name: 'Bengaluru', isDistrict: true, districtCode: 'BLR', tier: 'tier1', populationEstimated: 12000000, primaryEconomicFocus: ['Cloud & Enterprise Software', 'AI & Machine Learning', 'Global Capability Centers (GCC)'] },
    { id: 'in-dl-noida', countryId: 'in', regionId: 'in-delhi', name: 'Noida / Delhi-NCR', isDistrict: true, districtCode: 'NOI', tier: 'tier1', populationEstimated: 8500000, primaryEconomicFocus: ['FinTech', 'E-Commerce Platforms', 'IT Services'] },

    // South Korea Hubs
    { id: 'kr-seoul-pangyo', countryId: 'kr', regionId: 'kr-seoul', name: 'Pangyo Techno Valley', isDistrict: true, districtCode: 'PGY', tier: 'tier1', populationEstimated: 1200000, primaryEconomicFocus: ['Gaming & Metaverse', 'AI Accelerators & Robotics', 'Autonomous Mobility'] },
    { id: 'kr-seoul-gangnam', countryId: 'kr', regionId: 'kr-seoul', name: 'Gangnam Tech Corridor', isDistrict: true, districtCode: 'GNM', tier: 'tier1', populationEstimated: 560000, primaryEconomicFocus: ['FinTech', 'E-Commerce Platforms', 'Global Startups'] },

    // China Hubs
    { id: 'cn-gd-shenzhen', countryId: 'cn', regionId: 'cn-guangdong', name: 'Shenzhen (Nanshan)', isDistrict: true, districtCode: 'SZX', tier: 'tier1', populationEstimated: 17600000, primaryEconomicFocus: ['Hardware Silicon Valley', 'Drone & Robotics Automation', 'AI Foundation Models'] },

    // Global Hubs
    { id: 'us-ca-sf', countryId: 'us', regionId: 'us-ca', name: 'San Francisco', isDistrict: false, tier: 'tier1', populationEstimated: 870000, primaryEconomicFocus: ['Artificial Intelligence', 'Venture Capital', 'Cloud Architecture'] },
    { id: 'sg-central-sg', countryId: 'sg', regionId: 'sg-central', name: 'Singapore', isDistrict: false, tier: 'tier1', populationEstimated: 5900000, primaryEconomicFocus: ['Global FinTech', 'BioTech', 'Southeast Asian Tech Hub'] }
  ];

  // ----------------------------------------------------
  // GLOBAL INDUSTRY & JOB ROLE TAXONOMY
  // ----------------------------------------------------
  const industries: Industry[] = [
    { id: 'it_software', code: 'IT-SW', name: 'Information Technology & Software', description: 'Web, cloud, enterprise systems, mobile applications, and software testing services.', globalGrowthRate: 15.8, icon: 'Laptop' },
    { id: 'agro_tech', code: 'AGRO', name: 'Agro-Tech & Sustainable Food Processing', description: 'Precision agriculture, automated cold-chains, crop monitoring systems, and food processing lines.', globalGrowthRate: 12.4, icon: 'Sprout' },
    { id: 'logistics', code: 'LOG', name: 'Logistics & Supply Chain Intelligence', description: 'Automated warehouse management, fleet telemetry, express parcel networks, and inventory routing.', globalGrowthRate: 18.2, icon: 'Truck' },
    { id: 'renewable_energy', code: 'RE-SOL', name: 'Renewable & Solar Energy', description: 'Photovoltaic microgrid engineering, battery storage telemetry, and rural solar installation.', globalGrowthRate: 24.5, icon: 'Sun' },
    { id: 'healthcare', code: 'HLTH', name: 'Healthcare & Paramedical Technology', description: 'Hospital management systems, diagnostic devices, electronic health records, and clinical services.', globalGrowthRate: 16.1, icon: 'HeartPulse' },
    { id: 'fintech', code: 'FIN', name: 'Financial Services & Digital Payments', description: 'Core banking systems, UPI micro-payment rails, digital micro-lending, and risk analytics.', globalGrowthRate: 19.4, icon: 'CreditCard' }
  ];

  const skill_categories: SkillCategoryEntity[] = [
    { id: 'cat_prog', name: 'Programming Languages', description: 'Core computational syntax, typing, and standard libraries.' },
    { id: 'cat_web', name: 'Web Architecture & Frameworks', description: 'Modern client-server frameworks, Next.js, APIs, and responsive design.' },
    { id: 'cat_data', name: 'Databases & Big Data', description: 'Relational SQL engines, NoSQL stores, indexing, and data pipelines.' },
    { id: 'cat_cloud', name: 'Cloud & Infrastructure', description: 'Containerization, Kubernetes, CI/CD, and hyperscaler primitives.' },
    { id: 'cat_ai', name: 'AI & Data Science', description: 'Statistical modeling, NLP, computer vision, and neural network engineering.' },
    { id: 'cat_domain', name: 'Domain Operations & Logistics', description: 'SCM workflows, agro-telemetry, and industrial automation standards.' }
  ];

  const job_roles: JobRole[] = [
    {
      id: 'jr-fullstack-dev',
      role_id: 'jr-fullstack-dev',
      title: 'Full Stack Web Developer',
      industry: 'Information Technology & Software',
      industryId: 'it_software',
      category: 'Software Engineering',
      description: 'Designs and builds modern full-stack web applications with React, Next.js, Node.js, and relational databases.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_react', 'sk_javascript', 'sk_sql'],
      preferred_skills: ['sk_dsa', 'sk_docker', 'sk_rest_api', 'sk_typescript'],
      proficiency_requirements: [
        { skillId: 'sk_react', skillName: 'React', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_javascript', skillName: 'JavaScript', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Beginner', isRequired: false }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_react', skillName: 'React', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_javascript', skillName: 'JavaScript', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_dsa', skillName: 'DSA', minLevel: 'Beginner', isRequired: false }
      ],
      standardSalaryBandGlobal: { minUsd: 12000, maxUsd: 65000 }
    },
    {
      id: 'jr-data-analyst',
      role_id: 'jr-data-analyst',
      title: 'Data Analyst & BI Specialist',
      industry: 'Information Technology & Software',
      industryId: 'it_software',
      category: 'Data Analytics',
      description: 'Translates raw organizational telemetry into executive dashboards, predictive signals, and automated reports.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_sql', 'sk_python'],
      preferred_skills: ['sk_pandas', 'sk_aptitude', 'sk_aiml'],
      proficiency_requirements: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_pandas', skillName: 'Pandas & NumPy', minLevel: 'Intermediate', isRequired: false }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true }
      ],
      standardSalaryBandGlobal: { minUsd: 10000, maxUsd: 55000 }
    },
    {
      id: 'jr-cloud-devops',
      role_id: 'jr-cloud-devops',
      title: 'Cloud & DevOps Associate',
      industry: 'Information Technology & Software',
      industryId: 'it_software',
      category: 'Infrastructure',
      description: 'Maintains deployment pipelines, Docker container runtimes, Kubernetes clusters, and cloud infrastructure security.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_docker', 'sk_linux', 'sk_git'],
      preferred_skills: ['sk_aws', 'sk_kubernetes', 'sk_cicd', 'sk_python'],
      proficiency_requirements: [
        { skillId: 'sk_docker', skillName: 'Docker', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_linux', skillName: 'Linux CLI', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_git', skillName: 'Git', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_aws', skillName: 'AWS', minLevel: 'Beginner', isRequired: false }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: false }
      ],
      standardSalaryBandGlobal: { minUsd: 14000, maxUsd: 75000 }
    },
    {
      id: 'jr-aiml-engineer',
      role_id: 'jr-aiml-engineer',
      title: 'AI & Machine Learning Engineer',
      industry: 'Information Technology & Software',
      industryId: 'it_software',
      category: 'Artificial Intelligence',
      description: 'Builds predictive machine learning models, fine-tunes neural architectures, and deploys inference APIs.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_python', 'sk_aiml', 'sk_pandas'],
      preferred_skills: ['sk_pytorch', 'sk_sql', 'sk_docker'],
      proficiency_requirements: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_aiml', skillName: 'AI/ML', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_pandas', skillName: 'Pandas & NumPy', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_pytorch', skillName: 'PyTorch', minLevel: 'Beginner', isRequired: false }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Intermediate', isRequired: true },
        { skillId: 'sk_aiml', skillName: 'AI/ML', minLevel: 'Intermediate', isRequired: true }
      ],
      standardSalaryBandGlobal: { minUsd: 15000, maxUsd: 80000 }
    },
    {
      id: 'jr-agritech-specialist',
      role_id: 'jr-agritech-specialist',
      title: 'AgriTech Automation Specialist',
      industry: 'Agro-Tech & Sustainable Food Processing',
      industryId: 'agro_tech',
      category: 'Agricultural Tech',
      description: 'Operates automated sensor networks, soil nutrient diagnostics, and inventory management for food processing chains.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_python', 'sk_sql'],
      preferred_skills: ['sk_linux', 'sk_rest_api'],
      proficiency_requirements: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Beginner', isRequired: true },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: true }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_python', skillName: 'Python', minLevel: 'Beginner', isRequired: true },
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: true }
      ],
      standardSalaryBandGlobal: { minUsd: 6000, maxUsd: 28000 }
    },
    {
      id: 'jr-logistics-coordinator',
      role_id: 'jr-logistics-coordinator',
      title: 'Fleet & Supply Chain Coordinator',
      industry: 'Logistics & Supply Chain Intelligence',
      industryId: 'logistics',
      category: 'Operations',
      description: 'Manages multi-district transport routing, warehouse sorting workflows, and live consignment GPS tracking.',
      career_level: 'Entry',
      careerLevel: 'Entry',
      required_skills: ['sk_sql', 'sk_aptitude'],
      preferred_skills: ['sk_python'],
      proficiency_requirements: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: true },
        { skillId: 'sk_aptitude', skillName: 'Aptitude & Problem Solving', minLevel: 'Intermediate', isRequired: true }
      ],
      standardRequiredSkills: [
        { skillId: 'sk_sql', skillName: 'SQL', minLevel: 'Beginner', isRequired: true }
      ],
      standardSalaryBandGlobal: { minUsd: 5500, maxUsd: 24000 }
    }
  ];

  // ----------------------------------------------------
  // GLOBAL SKILL GRAPH RELATIONSHIPS
  // ----------------------------------------------------
  const skill_relationships: SkillRelationship[] = [
    // Python relationships
    { id: 'rel_py_oop', sourceSkillId: 'sk_python', targetSkillId: 'sk_oop', relationshipType: 'PREREQUISITE_FOR', description: 'OOP principles underpin scalable Python codebases.' },
    { id: 'rel_py_dsa', sourceSkillId: 'sk_python', targetSkillId: 'sk_dsa', relationshipType: 'COMPLEMENTARY_TO', description: 'Python is a primary implementation language for algorithmic data structures.' },
    { id: 'rel_py_sql', sourceSkillId: 'sk_python', targetSkillId: 'sk_sql', relationshipType: 'COMPLEMENTARY_TO', description: 'Python + SQL forms the backbone of data engineering and backend services.' },
    { id: 'rel_py_pandas', sourceSkillId: 'sk_python', targetSkillId: 'sk_pandas', relationshipType: 'PARENT_OF', description: 'Pandas & NumPy are built natively in the Python data ecosystem.' },
    { id: 'rel_py_aiml', sourceSkillId: 'sk_python', targetSkillId: 'sk_aiml', relationshipType: 'PARENT_OF', description: 'Python is the premier runtime for AI and machine learning model training.' },
    { id: 'rel_py_js', sourceSkillId: 'sk_python', targetSkillId: 'sk_javascript', relationshipType: 'RELATED_TO', description: 'High-level dynamic languages frequently paired in full-stack web engineering.' },

    // JavaScript & Web relationships
    { id: 'rel_js_html', sourceSkillId: 'sk_javascript', targetSkillId: 'sk_html_css', relationshipType: 'PREREQUISITE_FOR', description: 'HTML/CSS DOM comprehension is essential before dynamic scripting.' },
    { id: 'rel_js_react', sourceSkillId: 'sk_javascript', targetSkillId: 'sk_react', relationshipType: 'PARENT_OF', description: 'React is a declarative component abstraction over core JavaScript.' },
    { id: 'rel_js_node', sourceSkillId: 'sk_javascript', targetSkillId: 'sk_nodejs', relationshipType: 'PARENT_OF', description: 'Node.js brings the JavaScript V8 engine to asynchronous server-side execution.' },
    { id: 'rel_js_ts', sourceSkillId: 'sk_javascript', targetSkillId: 'sk_typescript', relationshipType: 'RELATED_TO', description: 'TypeScript is a strongly typed static superset of JavaScript.' },
    { id: 'rel_react_rest', sourceSkillId: 'sk_react', targetSkillId: 'sk_rest_api', relationshipType: 'COMPLEMENTARY_TO', description: 'React interfaces consume REST APIs for asynchronous data fetching.' },

    // C / C++ / Systems
    { id: 'rel_c_cpp', sourceSkillId: 'sk_c', targetSkillId: 'sk_cpp', relationshipType: 'PARENT_OF', description: 'C++ is an object-oriented superset extending foundational C primitives.' },
    { id: 'rel_cpp_dsa', sourceSkillId: 'sk_cpp', targetSkillId: 'sk_dsa', relationshipType: 'COMPLEMENTARY_TO', description: 'C++ STL provides ultra-fast standard templates for competitive programming.' },
    { id: 'rel_cpp_linux', sourceSkillId: 'sk_cpp', targetSkillId: 'sk_linux', relationshipType: 'COMPLEMENTARY_TO', description: 'High-performance C++ systems execute natively in POSIX Linux environments.' },

    // Data & Databases
    { id: 'rel_sql_pg', sourceSkillId: 'sk_sql', targetSkillId: 'sk_postgresql', relationshipType: 'PARENT_OF', description: 'PostgreSQL provides enterprise-grade ACID compliant relational SQL.' },
    { id: 'rel_sql_mongo', sourceSkillId: 'sk_sql', targetSkillId: 'sk_mongodb', relationshipType: 'RELATED_TO', description: 'Relational structured tables contrasted with flexible document NoSQL.' },
    { id: 'rel_sql_redis', sourceSkillId: 'sk_sql', targetSkillId: 'sk_redis', relationshipType: 'COMPLEMENTARY_TO', description: 'Relational persistence paired with Redis in-memory cache layers.' },

    // Cloud & DevOps
    { id: 'rel_linux_docker', sourceSkillId: 'sk_linux', targetSkillId: 'sk_docker', relationshipType: 'PREREQUISITE_FOR', description: 'Linux cgroups and namespaces are the foundation of containerization.' },
    { id: 'rel_docker_k8s', sourceSkillId: 'sk_docker', targetSkillId: 'sk_kubernetes', relationshipType: 'PARENT_OF', description: 'Docker container images are scheduled and orchestrated by Kubernetes.' },
    { id: 'rel_docker_aws', sourceSkillId: 'sk_docker', targetSkillId: 'sk_aws', relationshipType: 'COMPLEMENTARY_TO', description: 'Dockerized microservices deploy across AWS ECS and EKS clusters.' },
    { id: 'rel_git_cicd', sourceSkillId: 'sk_git', targetSkillId: 'sk_cicd', relationshipType: 'PREREQUISITE_FOR', description: 'Git version control commits trigger automated CI/CD pipeline builds.' },

    // AI & Advanced
    { id: 'rel_aiml_pytorch', sourceSkillId: 'sk_aiml', targetSkillId: 'sk_pytorch', relationshipType: 'PARENT_OF', description: 'PyTorch is the leading deep learning framework for tensor calculations.' },
    { id: 'rel_dsa_sysdesign', sourceSkillId: 'sk_dsa', targetSkillId: 'sk_system_design', relationshipType: 'PREREQUISITE_FOR', description: 'Algorithmic efficiency knowledge informs distributed architecture scalability.' }
  ];

  // ----------------------------------------------------
  // REGIONAL INTELLIGENCE FRAMEWORK: BIHAR IMPLEMENTATION
  // ----------------------------------------------------
  const regional_profiles: RegionalProfile[] = [
    {
      id: 'reg-prof-bihar',
      countryId: 'in',
      regionId: 'in-bihar',
      regionName: 'Bihar',
      tagline: "India's Emerging Human Capital & Tech Frontier",
      overview: "Bihar is transitioning into a high-potential digital workforce hub. Backed by the Bihar Skill Development Mission (BSDM), STPI Patna IT parks, and an expanding network of Kushal Yuva Program (KYP) centers across all 38 districts, the state connects over 500,000 graduates annually to local MSMEs, state electronics initiatives (BELTRON), and national tier-1 tech migration corridors.",
      primaryLanguage: 'hi',
      supportedLanguages: [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' },
        { code: 'bho', label: 'Bhojpuri', nativeLabel: 'भोजपुरी' },
        { code: 'mai', label: 'Maithili', nativeLabel: 'मैथिली' }
      ],
      districts: [
        { id: 'in-br-patna', name: 'Patna', tier: 'tier2', economicHub: 'IT/ITeS, BELTRON & Software Technology Parks', keyIndustries: ['IT & Software Services', 'Public Sector IT', 'Financial Tech', 'Startups'], itParksOrSezCount: 3, leadTrainingHub: 'STPI Patna / C-DAC / NIT Patna' },
        { id: 'in-br-muzaffarpur', name: 'Muzaffarpur', tier: 'tier2', economicHub: 'North Bihar Logistics & Agro-Tech Corridors', keyIndustries: ['Agro-Processing & Food Tech', 'Cold-Chain Logistics', 'E-Commerce Dispatch'], itParksOrSezCount: 1, leadTrainingHub: 'MIT Muzaffarpur' },
        { id: 'in-br-gaya', name: 'Gaya', tier: 'tier2', economicHub: 'Renewable Energy & Services Gateway', keyIndustries: ['Solar Microgrid Engineering', 'Tourism Tech', 'Logistics'], itParksOrSezCount: 1, leadTrainingHub: 'Gaya College of Engineering' },
        { id: 'in-br-bhagalpur', name: 'Bhagalpur', tier: 'tier3', economicHub: 'Silk Cluster, Embedded Systems & Regional IT', keyIndustries: ['Smart Textiles', 'Embedded IoT', 'Regional IT Services'], itParksOrSezCount: 1, leadTrainingHub: 'BCE Bhagalpur / IIIT Bhagalpur' },
        { id: 'in-br-darbhanga', name: 'Darbhanga', tier: 'tier3', economicHub: 'Aviation Logistics & Mithila Software Corridor', keyIndustries: ['Software Engineering', 'Airport Logistics', 'Health Informatics'], itParksOrSezCount: 1, leadTrainingHub: 'Darbhanga College of Engineering' },
        { id: 'in-br-nalanda', name: 'Nalanda (Rajgir)', tier: 'tier3', economicHub: 'Education, Electronics & Tourism Hub', keyIndustries: ['Higher Education', 'Electronics Assembly', 'Eco-Tourism'], itParksOrSezCount: 1, leadTrainingHub: 'Nalanda College of Engineering' },
        { id: 'in-br-begusarai', name: 'Begusarai', tier: 'tier3', economicHub: 'Industrial Automation & Petrochemical Processing', keyIndustries: ['Industrial Automation', 'Petrochemical Processing', 'Power Tech'], itParksOrSezCount: 0, leadTrainingHub: 'Government Polytechnic Begusarai' },
        { id: 'in-br-purnia', name: 'Purnia', tier: 'tier3', economicHub: 'Northeast Bihar Agri-Logistics & Digital Services', keyIndustries: ['Agri-Logistics', 'Rural Fintech', 'Cross-Border Supply Chain'], itParksOrSezCount: 0, leadTrainingHub: 'Government Engineering College Purnia' }
      ],
      publicSchemes: [
        {
          id: 'scheme_bsdm',
          name: 'Bihar Skill Development Mission (BSDM)',
          code: 'BSDM',
          authority: 'Labour Resources Dept, Govt. of Bihar',
          description: 'Official state mission providing accredited NSQF-aligned modular training across 20+ priority economic sectors with government certification.',
          benefits: 'Free government-funded skill verification, ₹1,000 monthly stipend during training, and direct campus placement drives.',
          portalUrl: 'https://skillmissionbihar.org',
          targetAudience: 'Youth aged 15-28 seeking industry qualification',
          eligibility: 'Resident of Bihar, minimum 10th or 12th standard pass',
          metadata: {
            source_name: 'Labour Resources Dept, Govt. of Bihar',
            source_url: 'https://skillmissionbihar.org',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Bihar',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official government skilling mission with verified public portal link'
          }
        },
        {
          id: 'scheme_kyp',
          name: 'Kushal Yuva Program (KYP)',
          code: 'KYP',
          authority: 'Bihar Skill Development Mission',
          description: 'Comprehensive 240-hour foundational training curriculum covering IT Literacy (MS Office, Google Workspace, internet security), English language communication, and soft skills.',
          benefits: 'Guaranteed 240 hours certified digital training, verified KYP Skill Badge on Skill2Hire, and preferential interview scheduling.',
          portalUrl: 'https://skillmissionbihar.org/kushal-yuva-program',
          targetAudience: 'Undergraduates & first-time job seekers',
          eligibility: 'Aged 15-28, minimum 10th pass under Mukhyamantri Nishchay Swayam Sahayata Bhatta Yojana',
          metadata: {
            source_name: 'Bihar Skill Development Mission',
            source_url: 'https://skillmissionbihar.org/kushal-yuva-program',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'All 38 Districts of Bihar',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official government program portal'
          }
        },
        {
          id: 'scheme_startup_bihar',
          name: 'Bihar Startup Policy 2022/2026',
          code: 'STARTUP_POLICY',
          authority: 'Department of Industries, Govt. of Bihar',
          description: 'Incubation, seed grant support, and co-working facilities for technology innovators and entrepreneurs launching ventures in Bihar.',
          benefits: 'Up to ₹10 Lakhs 10-year interest-free seed grant, free co-working at STPI Patna incubation facility, and investor matching.',
          portalUrl: 'https://startup.bihar.gov.in',
          targetAudience: 'Engineering graduates, student founders, and tech innovators',
          eligibility: 'Registered entity with innovative tech product based in Bihar',
          metadata: {
            source_name: 'Department of Industries, Govt. of Bihar',
            source_url: 'https://startup.bihar.gov.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Bihar',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official state startup policy portal'
          }
        },
        {
          id: 'scheme_udyami_yojana',
          name: 'Mukhyamantri Yuva Udyami Yojana',
          code: 'UDYAMI_YOJANA',
          authority: 'Industries Department, Bihar',
          description: 'Flagship enterprise creation initiative empowering educated youth to set up micro-enterprises, software service agencies, or small manufacturing units.',
          benefits: '₹10 Lakhs total capital support: ₹5 Lakh grant subsidy + ₹5 Lakh low-interest loan (1% interest for young men, 0% for women/SC/ST).',
          portalUrl: 'https://udyami.bihar.gov.in',
          targetAudience: 'Youth aged 18-50 establishing regional commercial ventures',
          eligibility: '10+2, Intermediate, ITI, Polytechnic diploma or degree holder',
          metadata: {
            source_name: 'Industries Department, Bihar',
            source_url: 'https://udyami.bihar.gov.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Bihar',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official enterprise support portal'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-pat-blr',
          sourceRegion: 'Bihar (Patna)',
          destinationRegion: 'Karnataka',
          destinationCity: 'Bengaluru',
          popularRoles: ['Full Stack Web Developer', 'Backend Microservices Engineer', 'Cloud Infrastructure Associate'],
          averageSalaryMultiplier: 2.8,
          readinessGapAverage: 22,
          topRequiredBridgeSkills: ['System Design & Microservices', 'Docker & Containerization', 'Cloud (AWS/GCP) Architecture'],
          description: 'Primary high-mobility tech migration corridor. High demand for React, Python, and Java developers transitioning from regional colleges into Bengaluru software teams and MNC GCCs.',
          metadata: {
            source_name: 'Skill2Hire Career Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Patna ➔ Bengaluru',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics. Multiplier represents modeled entry salary delta.'
          }
        },
        {
          id: 'corr-pat-noida',
          sourceRegion: 'Bihar (Patna)',
          destinationRegion: 'Delhi-NCR',
          destinationCity: 'Noida / Gurgaon',
          popularRoles: ['Full Stack Web Developer', 'Data Analyst', 'FinTech QA Engineer'],
          averageSalaryMultiplier: 2.2,
          readinessGapAverage: 18,
          topRequiredBridgeSkills: ['Next.js App Router', 'RESTful API Security', 'SQL Complex Query Optimization'],
          description: 'Largest northern migration corridor. High absorption into FinTech startups, enterprise SaaS companies, and digital marketing tech agencies in NCR.',
          metadata: {
            source_name: 'Skill2Hire Career Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Patna ➔ Noida / Gurgaon',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics. Multiplier represents modeled entry salary delta.'
          }
        },
        {
          id: 'corr-pat-pune',
          sourceRegion: 'Bihar (Patna)',
          destinationRegion: 'Maharashtra',
          destinationCity: 'Pune',
          popularRoles: ['Java Enterprise Developer', 'Automotive IT Engineer', 'DevOps Associate'],
          averageSalaryMultiplier: 2.1,
          readinessGapAverage: 20,
          topRequiredBridgeSkills: ['Spring Boot & JVM Concurrency', 'Linux Shell Automation', 'CI/CD Pipelines'],
          description: 'Key industrial and product engineering corridor with strong placement ties to manufacturing IT and telecom engineering firms.',
          metadata: {
            source_name: 'Skill2Hire Career Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Patna ➔ Pune',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics. Multiplier represents modeled entry salary delta.'
          }
        },
        {
          id: 'corr-pat-local',
          sourceRegion: 'Bihar (Districts)',
          destinationRegion: 'Bihar',
          destinationCity: 'Patna Hub',
          popularRoles: ['BELTRON IT Executive', 'Regional Software Developer', 'Healthcare Systems Admin'],
          averageSalaryMultiplier: 1.4,
          readinessGapAverage: 12,
          topRequiredBridgeSkills: ['SQL Database Management', 'Web Fundamentals (HTML/CSS/JS)', 'Cybersecurity Hygiene'],
          description: 'In-state economic retention pathway providing sustainable local employment with low cost of living, Beltron government digitizations, and STPI incubation ventures.',
          metadata: {
            source_name: 'Skill2Hire In-State Retention Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Bihar Districts ➔ Patna',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative retention metric based on living cost differential and local tech placement'
          }
        }
      ],
      metadata: {
        source_name: 'Bihar Skill Development Mission & State Portals',
        source_url: 'https://skillmissionbihar.org',
        source_type: 'GOVERNMENT_PORTAL',
        data_period: '2026-Q1',
        geographic_scope: 'State (Bihar, India)',
        last_updated: '2026-09-22',
        verification_status: 'PLATFORM_DATA',
        disclaimer: 'Flagship Active Regional Implementation. Official public schemes verified; district telemetry is illustrative prototype data.'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg-prof-tamilnadu',
      countryId: 'in',
      regionId: 'in-tamilnadu',
      regionName: 'Tamil Nadu',
      tagline: "India's SaaS Capital & Advanced Industrial Powerhouse",
      overview: "Tamil Nadu drives India's deepest SaaS cluster along Chennai's Old Mahabalipuram Road (OMR), alongside thriving engineering R&D hubs in Coimbatore. Backed by the state's flagship Naan Mudhalvan Skilling Initiative and Tamil Nadu Startup Policy (TANSIM), the state produces over 300,000 engineering and polytechnic graduates annually.",
      primaryLanguage: 'ta',
      supportedLanguages: [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'ta', label: 'Tamil', nativeLabel: 'தமிழ்' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' }
      ],
      districts: [
        { id: 'in-tn-chennai', name: 'Chennai (OMR / Guindy)', tier: 'tier1', economicHub: 'SaaS, FinTech & EV Mobility', keyIndustries: ['Enterprise SaaS', 'Automotive Software', 'Cloud Computing', 'FinTech'], itParksOrSezCount: 8, leadTrainingHub: 'Anna University / IIT Madras Research Park' },
        { id: 'in-tn-coimbatore', name: 'Coimbatore', tier: 'tier2', economicHub: 'Industrial IoT & Precision Engineering', keyIndustries: ['Embedded IoT', 'Textile Automation', 'Automotive R&D'], itParksOrSezCount: 3, leadTrainingHub: 'PSG College of Technology' }
      ],
      publicSchemes: [
        {
          id: 'scheme_naan_mudhalvan',
          name: 'Naan Mudhalvan Skilling Scheme',
          code: 'NAAN_MUDHALVAN',
          authority: 'Tamil Nadu Skill Development Corporation (TNSDC)',
          description: 'State flagship skilling platform providing dynamic tech curriculum, AI labs, and high-impact placement training for college students.',
          benefits: 'Zero-cost certification in Cloud, Data Science, and VLSI, direct access to 500+ hiring partners.',
          portalUrl: 'https://naanmudhalvan.tn.gov.in',
          targetAudience: 'Engineering and arts/science college students',
          eligibility: 'Enrolled in accredited Tamil Nadu higher education institution',
          metadata: {
            source_name: 'Tamil Nadu Skill Development Corporation (TNSDC)',
            source_url: 'https://naanmudhalvan.tn.gov.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Tamil Nadu',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official state skilling initiative portal'
          }
        },
        {
          id: 'scheme_tansim',
          name: 'Tamil Nadu Startup Policy (StartupTN)',
          code: 'STARTUP_TN',
          authority: 'TANSIM, Govt. of Tamil Nadu',
          description: 'Vibrant startup acceleration network supporting SaaS, DeepTech, and Social Impact innovations.',
          benefits: '₹10 Lakhs TANSEED seed grant, subsidized co-working at regional hubs, mentoring by unicorn founders.',
          portalUrl: 'https://startuptn.in',
          targetAudience: 'Student and early-stage entrepreneurs in Tamil Nadu',
          eligibility: 'Registered DPIIT startup headquartered in Tamil Nadu',
          metadata: {
            source_name: 'TANSIM, Govt. of Tamil Nadu',
            source_url: 'https://startuptn.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Tamil Nadu',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official startup acceleration platform'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-tn-sgp',
          sourceRegion: 'Tamil Nadu (Chennai)',
          destinationRegion: 'Singapore',
          destinationCity: 'Singapore Hub',
          popularRoles: ['Cloud Architect', 'DevOps Specialist', 'FinTech Full Stack Developer'],
          averageSalaryMultiplier: 2.6,
          readinessGapAverage: 15,
          topRequiredBridgeSkills: ['Kubernetes Multi-Cluster', 'International FinTech Compliance', 'High-Concurrency Golang'],
          description: 'Major international ASEAN tech corridor with deep bilateral workforce and fintech ties.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Chennai ➔ Singapore',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        },
        {
          id: 'corr-tn-blr',
          sourceRegion: 'Tamil Nadu (Coimbatore/Chennai)',
          destinationRegion: 'Karnataka',
          destinationCity: 'Bengaluru',
          popularRoles: ['AI/ML Engineer', 'Backend Go/Java Developer'],
          averageSalaryMultiplier: 1.5,
          readinessGapAverage: 10,
          topRequiredBridgeSkills: ['Distributed Caching', 'Vector Databases', 'gRPC Services'],
          description: 'Seamless cross-state corridor connecting Chennai SaaS talent with Bengaluru venture-funded product unicorns.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Chennai ➔ Bengaluru',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        }
      ],
      metadata: {
        source_name: 'Tamil Nadu Innovation Ecosystem (Modeled Expansion)',
        source_type: 'SYNTHETIC_MODEL',
        data_period: '2026-Q1',
        geographic_scope: 'State (Tamil Nadu, India)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Expansion Region — illustrative modeling data, not active operational deployment'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg-prof-telangana',
      countryId: 'in',
      regionId: 'in-telangana',
      regionName: 'Telangana',
      tagline: "Cyberabad Global Technology & DeepTech Innovation Hub",
      overview: "Telangana is a global technology powerhouse anchored by Hyderabad's HITEC City, Financial District, and Genome Valley. Supported by the Telangana Academy for Skill and Knowledge (TASK) and world-renowned innovation catalyst T-Hub, the state leads India in cloud hyperscaler investments, AI centers, and semiconductor chip design.",
      primaryLanguage: 'te',
      supportedLanguages: [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'te', label: 'Telugu', nativeLabel: 'తెలుగు' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' }
      ],
      districts: [
        { id: 'in-ts-hyderabad', name: 'Hyderabad (Cyberabad)', tier: 'tier1', economicHub: 'Enterprise IT, Cloud, BioTech & AI R&D', keyIndustries: ['Enterprise Software', 'AI & Machine Learning', 'Semiconductor VLSI', 'BioTech'], itParksOrSezCount: 12, leadTrainingHub: 'IIIT Hyderabad / T-Hub / TASK' },
        { id: 'in-ts-warangal', name: 'Warangal', tier: 'tier2', economicHub: 'Tier-2 IT Hub & Engineering Cluster', keyIndustries: ['IT Services', 'Electronics Manufacturing', 'Agro-Tech'], itParksOrSezCount: 2, leadTrainingHub: 'NIT Warangal' }
      ],
      publicSchemes: [
        {
          id: 'scheme_task',
          name: 'Telangana Academy for Skill and Knowledge (TASK)',
          code: 'TASK',
          authority: 'IT E&C Dept, Govt. of Telangana',
          description: 'Pioneering non-profit skilling body bridging industry and academia with verified global tech certifications.',
          benefits: 'Subsidized Microsoft/AWS certifications, direct pre-placement mock interviews, and campus recruitment drives.',
          portalUrl: 'https://task.telangana.gov.in',
          targetAudience: 'Graduating students from engineering and degree colleges',
          eligibility: 'Student in TASK registered college in Telangana',
          metadata: {
            source_name: 'IT E&C Dept, Govt. of Telangana',
            source_url: 'https://task.telangana.gov.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Telangana',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official state skilling initiative portal'
          }
        },
        {
          id: 'scheme_thub',
          name: 'T-Hub Innovation Platform',
          code: 'THUB',
          authority: 'T-Hub & Govt. of Telangana',
          description: 'The world\'s largest startup incubator facility providing cutting-edge testing sandboxes and scaling capital.',
          benefits: 'Full incubation, venture capital access, mentorship from global corporate innovators.',
          portalUrl: 'https://t-hub.co',
          targetAudience: 'Student innovators and tech founders',
          eligibility: 'Early-stage tech startup',
          metadata: {
            source_name: 'T-Hub Foundation & Govt. of Telangana',
            source_url: 'https://t-hub.co',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'Telangana & Global Innovators',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official startup incubator portal'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-ts-us',
          sourceRegion: 'Telangana (Hyderabad)',
          destinationRegion: 'California',
          destinationCity: 'San Francisco / Silicon Valley',
          popularRoles: ['Principal Distributed Systems Engineer', 'AI Research Scientist', 'Cloud Architect'],
          averageSalaryMultiplier: 3.8,
          readinessGapAverage: 18,
          topRequiredBridgeSkills: ['LLM Fine-Tuning & Quantization', 'Distributed ML Training', 'Cloud Native Security'],
          description: 'Premier trans-pacific tech talent migration corridor connecting Hyderabad deep-tech alumni with Silicon Valley tech giants.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Hyderabad ➔ Silicon Valley',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        }
      ],
      metadata: {
        source_name: 'Telangana Technology & Innovation Ecosystem (Modeled Expansion)',
        source_type: 'SYNTHETIC_MODEL',
        data_period: '2026-Q1',
        geographic_scope: 'State (Telangana, India)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Expansion Region — illustrative modeling data, not active operational deployment'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg-prof-maharashtra',
      countryId: 'in',
      regionId: 'in-maharashtra',
      regionName: 'Maharashtra',
      tagline: "India's Financial Engine & Enterprise Tech Corridor",
      overview: "Maharashtra integrates the nation's premier financial capital Mumbai (BFSI, FinTech, MediaTech) with Pune's engineering powerhouse (Automotive Software, Embedded IoT, Enterprise Java). Supported by the Maharashtra State Skill Development Society (MSSDS).",
      primaryLanguage: 'mr',
      supportedLanguages: [
        { code: 'en', label: 'English', nativeLabel: 'English' },
        { code: 'mr', label: 'Marathi', nativeLabel: 'मराठी' },
        { code: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी' }
      ],
      districts: [
        { id: 'in-mh-mumbai', name: 'Mumbai (BKC & Navi Mumbai)', tier: 'tier1', economicHub: 'BFSI, FinTech & Hyperscale Data Centers', keyIndustries: ['Banking Software', 'FinTech & Payments', 'Cloud Data Centers'], itParksOrSezCount: 9, leadTrainingHub: 'IIT Bombay / VJTI Mumbai' },
        { id: 'in-mh-pune', name: 'Pune (Hinjawadi)', tier: 'tier1', economicHub: 'Automotive IT & Enterprise Software', keyIndustries: ['Automotive Software', 'Enterprise Java & Cloud', 'DevOps'], itParksOrSezCount: 7, leadTrainingHub: 'COEP Tech University' }
      ],
      publicSchemes: [
        {
          id: 'scheme_mssds',
          name: 'Maharashtra State Skill Development Society (MSSDS)',
          code: 'MSSDS',
          authority: 'Skill Development & Entrepreneurship Dept, Maharashtra',
          description: 'Statewide modular skilling and apprentice programs customized to financial and manufacturing tech needs.',
          benefits: 'Certified apprenticeships, industry-sponsored stipends, and placement assurance.',
          portalUrl: 'https://mssds.gov.in',
          targetAudience: 'Youth aged 18-35 across all 36 districts',
          eligibility: 'Domicile of Maharashtra, 10th/12th/Diploma/Degree',
          metadata: {
            source_name: 'Skill Development Dept, Govt. of Maharashtra',
            source_url: 'https://mssds.gov.in',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'State of Maharashtra',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official state skill mission portal'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-mh-uk',
          sourceRegion: 'Maharashtra (Mumbai)',
          destinationRegion: 'United Kingdom',
          destinationCity: 'London Hub',
          popularRoles: ['Quantitative Developer', 'FinTech Security Architect', 'Trading Systems Engineer'],
          averageSalaryMultiplier: 3.2,
          readinessGapAverage: 16,
          topRequiredBridgeSkills: ['Algorithmic Trading Systems', 'Low-Latency C++', 'Open Banking APIs'],
          description: 'Global financial technology corridor connecting Mumbai financial software engineers with London City firms.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Mumbai ➔ London',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        }
      ],
      metadata: {
        source_name: 'Maharashtra State Innovation Society (Modeled Expansion)',
        source_type: 'SYNTHETIC_MODEL',
        data_period: '2026-Q1',
        geographic_scope: 'State (Maharashtra, India)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Expansion Region — illustrative modeling data, not active operational deployment'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg-prof-korea',
      countryId: 'kr',
      regionId: 'kr-seoul',
      regionName: 'Seoul Capital Area (Pangyo)',
      tagline: "Pangyo Techno Valley & Global AI/Robotics Frontier",
      overview: "South Korea's premier innovation ecosystem, Pangyo Techno Valley and Gangnam corridor host global gaming leaders, AI accelerator labs, and semiconductor giants. Backed by government initiatives such as TIPS Korea and the K-Startup Grand Challenge.",
      primaryLanguage: 'ko',
      supportedLanguages: [
        { code: 'ko', label: 'Korean', nativeLabel: '한국어' },
        { code: 'en', label: 'English', nativeLabel: 'English' }
      ],
      districts: [
        { id: 'kr-seoul-pangyo', name: 'Pangyo Techno Valley', tier: 'tier1', economicHub: 'Gaming, AI Hardware & Autonomous Robotics', keyIndustries: ['AI Accelerators', 'Gaming & Metaverse', 'Robotics Systems'], itParksOrSezCount: 5, leadTrainingHub: 'Seoul National University / KAIST Pangyo' },
        { id: 'kr-seoul-gangnam', name: 'Gangnam Tech Corridor', tier: 'tier1', economicHub: 'FinTech, Consumer Tech & Unicorn Startups', keyIndustries: ['FinTech', 'E-Commerce Platforms', 'Venture Tech'], itParksOrSezCount: 4, leadTrainingHub: 'Korea University Tech Innovation' }
      ],
      publicSchemes: [
        {
          id: 'scheme_k_startup',
          name: 'K-Startup Grand Challenge & TIPS Korea',
          code: 'K_STARTUP',
          authority: 'Ministry of SMEs and Startups (MSS), South Korea',
          description: 'World-renowned startup incubation and R&D acceleration scheme with government matched funding.',
          benefits: 'Up to $100,000 grant funding, office space in Pangyo, and global team visa fast-track.',
          portalUrl: 'https://k-startupgc.org',
          targetAudience: 'Global tech founders, developers, and engineers',
          eligibility: 'High-tech AI, hardware, or software venture',
          metadata: {
            source_name: 'Ministry of SMEs and Startups (MSS), South Korea',
            source_url: 'https://k-startupgc.org',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'National (South Korea)',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official government acceleration scheme portal'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-kr-us',
          sourceRegion: 'South Korea (Seoul/Pangyo)',
          destinationRegion: 'California',
          destinationCity: 'Silicon Valley',
          popularRoles: ['AI Research Engineer', 'Semiconductor Architecture Specialist', 'Gaming Engine Lead'],
          averageSalaryMultiplier: 1.8,
          readinessGapAverage: 12,
          topRequiredBridgeSkills: ['Bilingual Technical Leadership', 'Distributed GPU Cluster Ops', 'CUDA Kernel Optimization'],
          description: 'High-value hardware-software talent pipeline connecting Pangyo labs with US tech titans.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Seoul ➔ Silicon Valley',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        }
      ],
      metadata: {
        source_name: 'K-Startup & MSS Korea Innovation Model (Modeled Expansion)',
        source_type: 'SYNTHETIC_MODEL',
        data_period: '2026-Q1',
        geographic_scope: 'Province (Seoul Capital Area, South Korea)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Expansion Region — illustrative modeling data, not active operational deployment'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg-prof-china',
      countryId: 'cn',
      regionId: 'cn-guangdong',
      regionName: 'Greater Bay Area (Shenzhen)',
      tagline: "Global Hardware Silicon Valley & AI Robotics Hub",
      overview: "The Greater Bay Area and Shenzhen Nanshan Science Park represent the world's most agile electronics, drone robotics, and AI manufacturing corridor connecting international talent.",
      primaryLanguage: 'zh',
      supportedLanguages: [
        { code: 'zh', label: 'Chinese', nativeLabel: '中文' },
        { code: 'en', label: 'English', nativeLabel: 'English' }
      ],
      districts: [
        { id: 'cn-gd-shenzhen', name: 'Shenzhen (Nanshan)', tier: 'tier1', economicHub: 'Hardware Silicon Valley, Robotics & AI Models', keyIndustries: ['Robotics & Drones', 'Hardware Prototyping', 'AI Edge Devices'], itParksOrSezCount: 14, leadTrainingHub: 'Shenzhen University / Tsinghua SIGS' }
      ],
      publicSchemes: [
        {
          id: 'scheme_gba_youth',
          name: 'Greater Bay Area Youth Tech & Innovation Scheme',
          code: 'GBA_YOUTH',
          authority: 'Shenzhen Municipal Science & Tech Commission',
          description: 'Special talent incentives, housing subsidies, and venture incubation for young software and hardware engineers.',
          benefits: 'Living subsidies, rapid patent acceleration, and direct supply-chain prototyping labs.',
          portalUrl: 'https://stic.sz.gov.cn',
          targetAudience: 'Young software and hardware engineers under 35',
          eligibility: 'University graduate in STEM discipline',
          metadata: {
            source_name: 'Shenzhen Municipal Science & Tech Commission',
            source_url: 'https://stic.sz.gov.cn',
            source_type: 'GOVERNMENT_PORTAL',
            data_period: '2026',
            geographic_scope: 'Shenzhen & Greater Bay Area',
            last_updated: '2026-09-22',
            verification_status: 'VERIFIED_EXTERNAL',
            disclaimer: 'Official municipal science commission scheme portal'
          }
        }
      ],
      migrationCorridors: [
        {
          id: 'corr-cn-sgp',
          sourceRegion: 'China (Shenzhen)',
          destinationRegion: 'Singapore',
          destinationCity: 'Singapore Hub',
          popularRoles: ['Cross-Border E-Commerce Architect', 'Hardware-Software IoT Lead'],
          averageSalaryMultiplier: 2.1,
          readinessGapAverage: 14,
          topRequiredBridgeSkills: ['Multi-Region Cloud Compliance', 'Global Payment Gateways'],
          description: 'Asia-Pacific regional headquarters expansion pipeline.',
          metadata: {
            source_name: 'Skill2Hire Mobility Benchmark Model',
            source_type: 'SYNTHETIC_MODEL',
            data_period: '2026-Q1',
            geographic_scope: 'Shenzhen ➔ Singapore',
            last_updated: '2026-09-22',
            verification_status: 'DEMO',
            disclaimer: 'Illustrative data — not official statistics'
          }
        }
      ],
      metadata: {
        source_name: 'Shenzhen Science & Technology Commission Model (Modeled Expansion)',
        source_type: 'SYNTHETIC_MODEL',
        data_period: '2026-Q1',
        geographic_scope: 'Province (Guangdong / GBA, China)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Expansion Region — illustrative modeling data, not active operational deployment'
      },
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    }
  ];

  const regional_intelligence: RegionalIntelligenceRecord[] = [
    // CHENNAI DISTRICT (TAMIL NADU)
    {
      id: 'reg_int_tn_react',
      countryId: 'in',
      regionId: 'in-tamilnadu',
      cityOrDistrictId: 'in-tn-chennai',
      districtName: 'Chennai (OMR / Guindy)',
      industryId: 'it_software',
      industryName: 'Enterprise SaaS & Cloud',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_react',
      skillName: 'React',
      demand: {
        index: 94,
        activeVacancies: 1850,
        yoyGrowthRate: 34,
        urgency: 'Critical',
        topLocalEmployers: ['Freshworks Hub', 'Zoho Corp', 'Chargebee', 'Kissflow', 'Cognizant']
      },
      supply: {
        registeredTalentCount: 3200,
        placementReadyCount: 1450,
        inTrainingCount: 1800,
        readinessAverage: 76
      },
      trainingCapacity: {
        activeTrainingCentersCount: 32,
        annualSeatCapacity: 4500,
        topTrainingInstitutions: ['Anna University', 'IIT Madras Research Park', 'Naan Mudhalvan Centers'],
        bsdmCertifiedCenters: 12
      },
      employmentOutcomes: {
        historicalPlacementRate: 88,
        averageStartingSalaryMonthly: '₹55,000 - ₹85,000',
        retentionRate6Months: 91
      },
      dataSource: 'Tamil Nadu SaaS Industry Forum Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Tamil Nadu SaaS Industry Forum Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Chennai)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    // HYDERABAD DISTRICT (TELANGANA)
    {
      id: 'reg_int_ts_python',
      countryId: 'in',
      regionId: 'in-telangana',
      cityOrDistrictId: 'in-ts-hyderabad',
      districtName: 'Hyderabad (Cyberabad)',
      industryId: 'it_software',
      industryName: 'Enterprise IT, Cloud & AI',
      jobRoleId: 'jr-data-analyst',
      jobRoleTitle: 'Data Analyst & BI Specialist',
      skillId: 'sk_python',
      skillName: 'Python',
      demand: {
        index: 96,
        activeVacancies: 2100,
        yoyGrowthRate: 38,
        urgency: 'Critical',
        topLocalEmployers: ['Microsoft IDC', 'Google Hyderabad', 'T-Hub Startups', 'Novartis Informatics']
      },
      supply: {
        registeredTalentCount: 3800,
        placementReadyCount: 1620,
        inTrainingCount: 2200,
        readinessAverage: 74
      },
      trainingCapacity: {
        activeTrainingCentersCount: 36,
        annualSeatCapacity: 5200,
        topTrainingInstitutions: ['IIIT Hyderabad', 'TASK Centers', 'JNTU Hyderabad'],
        bsdmCertifiedCenters: 14
      },
      employmentOutcomes: {
        historicalPlacementRate: 90,
        averageStartingSalaryMonthly: '₹60,000 - ₹95,000',
        retentionRate6Months: 89
      },
      dataSource: 'TASK Innovation Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'TASK Innovation Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Hyderabad)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    // MUMBAI DISTRICT (MAHARASHTRA)
    {
      id: 'reg_int_mh_sql',
      countryId: 'in',
      regionId: 'in-maharashtra',
      cityOrDistrictId: 'in-mh-mumbai',
      districtName: 'Mumbai (BKC & Navi Mumbai)',
      industryId: 'fintech',
      industryName: 'BFSI & Digital Payments',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_sql',
      skillName: 'SQL',
      demand: {
        index: 91,
        activeVacancies: 1650,
        yoyGrowthRate: 29,
        urgency: 'High',
        topLocalEmployers: ['HDFC Digital Hub', 'NSE Tech', 'PayU India', 'Jio Financial Services']
      },
      supply: {
        registeredTalentCount: 2900,
        placementReadyCount: 1300,
        inTrainingCount: 1600,
        readinessAverage: 71
      },
      trainingCapacity: {
        activeTrainingCentersCount: 28,
        annualSeatCapacity: 3800,
        topTrainingInstitutions: ['IIT Bombay', 'VJTI Mumbai', 'MSSDS FinTech Academy'],
        bsdmCertifiedCenters: 10
      },
      employmentOutcomes: {
        historicalPlacementRate: 86,
        averageStartingSalaryMonthly: '₹52,000 - ₹80,000',
        retentionRate6Months: 87
      },
      dataSource: 'Maharashtra BFSI Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Maharashtra BFSI Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Mumbai)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    // PANGYO TECHNO VALLEY (SOUTH KOREA)
    {
      id: 'reg_int_kr_python',
      countryId: 'kr',
      regionId: 'kr-seoul',
      cityOrDistrictId: 'kr-seoul-pangyo',
      districtName: 'Pangyo Techno Valley',
      industryId: 'it_software',
      industryName: 'AI Accelerators & Robotics',
      jobRoleId: 'jr-cloud-devops',
      jobRoleTitle: 'Cloud & DevOps Associate',
      skillId: 'sk_python',
      skillName: 'Python',
      demand: {
        index: 95,
        activeVacancies: 920,
        yoyGrowthRate: 42,
        urgency: 'Critical',
        topLocalEmployers: ['Kakao Corp', 'Naver Cloud', 'Krafton', 'NCSOFT AI Labs']
      },
      supply: {
        registeredTalentCount: 1400,
        placementReadyCount: 780,
        inTrainingCount: 820,
        readinessAverage: 82
      },
      trainingCapacity: {
        activeTrainingCentersCount: 18,
        annualSeatCapacity: 2100,
        topTrainingInstitutions: ['Seoul National University', 'KAIST AI Institute', 'Pangyo AI Academy'],
        bsdmCertifiedCenters: 6
      },
      employmentOutcomes: {
        historicalPlacementRate: 93,
        averageStartingSalaryMonthly: '₩4,200,000 - ₩6,500,000',
        retentionRate6Months: 94
      },
      dataSource: 'Pangyo AI & Robotics Innovation Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Pangyo AI & Robotics Innovation Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Pangyo Techno Valley)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    // SHENZHEN (CHINA)
    {
      id: 'reg_int_cn_embedded',
      countryId: 'cn',
      regionId: 'cn-guangdong',
      cityOrDistrictId: 'cn-gd-shenzhen',
      districtName: 'Shenzhen (Nanshan)',
      industryId: 'it_software',
      industryName: 'Hardware Silicon Valley & IoT',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_js',
      skillName: 'JavaScript',
      demand: {
        index: 97,
        activeVacancies: 2400,
        yoyGrowthRate: 45,
        urgency: 'Critical',
        topLocalEmployers: ['Tencent Holdings', 'DJI Robotics', 'BYD Electronics', 'Huawei Tech']
      },
      supply: {
        registeredTalentCount: 4100,
        placementReadyCount: 1950,
        inTrainingCount: 2600,
        readinessAverage: 80
      },
      trainingCapacity: {
        activeTrainingCentersCount: 40,
        annualSeatCapacity: 6000,
        topTrainingInstitutions: ['Shenzhen University', 'Tsinghua SIGS', 'Nanshan Science Academy'],
        bsdmCertifiedCenters: 15
      },
      employmentOutcomes: {
        historicalPlacementRate: 91,
        averageStartingSalaryMonthly: '¥18,000 - ¥28,000',
        retentionRate6Months: 90
      },
      dataSource: 'Shenzhen Hardware Silicon Valley Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Shenzhen Hardware Silicon Valley Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Shenzhen Nanshan)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    // PATNA DISTRICT
    {
      id: 'reg_int_pat_react',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-patna',
      districtName: 'Patna',
      industryId: 'it_software',
      industryName: 'Information Technology & Software',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_react',
      skillName: 'React',
      demand: {
        index: 88,
        activeVacancies: 340,
        yoyGrowthRate: 31,
        urgency: 'Critical',
        topLocalEmployers: ['STPI Incubated Startups', 'BELTRON IT Partners', 'Patna Smart City SPV', 'TechNova Solutions']
      },
      supply: {
        registeredTalentCount: 620,
        placementReadyCount: 195,
        inTrainingCount: 280,
        readinessAverage: 62
      },
      trainingCapacity: {
        activeTrainingCentersCount: 14,
        annualSeatCapacity: 750,
        topTrainingInstitutions: ['C-DAC Patna', 'NIT Patna Extension', 'BSDM Digital Hub Patna'],
        bsdmCertifiedCenters: 6
      },
      employmentOutcomes: {
        historicalPlacementRate: 78,
        averageStartingSalaryMonthly: '₹32,000 - ₹48,000',
        retentionRate6Months: 84
      },
      dataSource: 'Bihar Skill Development Mission & Beltron Tech Panel Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Patna, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg_int_pat_python',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-patna',
      districtName: 'Patna',
      industryId: 'it_software',
      industryName: 'Information Technology & Software',
      jobRoleId: 'jr-data-analyst',
      jobRoleTitle: 'Data Analyst & BI Specialist',
      skillId: 'sk_python',
      skillName: 'Python',
      demand: {
        index: 82,
        activeVacancies: 260,
        yoyGrowthRate: 28,
        urgency: 'High',
        topLocalEmployers: ['DataSphere Analytics', 'Bihar e-Governance Council', 'State Health Society Bihar']
      },
      supply: {
        registeredTalentCount: 510,
        placementReadyCount: 160,
        inTrainingCount: 220,
        readinessAverage: 58
      },
      trainingCapacity: {
        activeTrainingCentersCount: 11,
        annualSeatCapacity: 600,
        topTrainingInstitutions: ['Aryabhatta Knowledge University', 'C-DAC Patna', 'BSDM IT Center'],
        bsdmCertifiedCenters: 4
      },
      employmentOutcomes: {
        historicalPlacementRate: 72,
        averageStartingSalaryMonthly: '₹28,000 - ₹44,000',
        retentionRate6Months: 81
      },
      dataSource: 'Bihar Industries Department Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Patna, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg_int_pat_sql',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-patna',
      districtName: 'Patna',
      industryId: 'it_software',
      industryName: 'Information Technology & Software',
      jobRoleId: 'jr-data-analyst',
      jobRoleTitle: 'Data Analyst & BI Specialist',
      skillId: 'sk_sql',
      skillName: 'SQL',
      demand: {
        index: 91,
        activeVacancies: 410,
        yoyGrowthRate: 24,
        urgency: 'Critical',
        topLocalEmployers: ['BELTRON Bihar', 'Bihar State Financial Corp', 'FinEdge Regional Hub']
      },
      supply: {
        registeredTalentCount: 780,
        placementReadyCount: 310,
        inTrainingCount: 340,
        readinessAverage: 67
      },
      trainingCapacity: {
        activeTrainingCentersCount: 18,
        annualSeatCapacity: 920,
        topTrainingInstitutions: ['Patna Science College IT Wing', 'KYP Central Patna', 'NIELIT Patna'],
        bsdmCertifiedCenters: 8
      },
      employmentOutcomes: {
        historicalPlacementRate: 82,
        averageStartingSalaryMonthly: '₹26,000 - ₹38,000',
        retentionRate6Months: 89
      },
      dataSource: 'NSDC Bihar Chapter Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Patna, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },

    // MUZAFFARPUR DISTRICT
    {
      id: 'reg_int_muz_sql',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-muzaffarpur',
      districtName: 'Muzaffarpur',
      industryId: 'logistics',
      industryName: 'Logistics & Supply Chain Intelligence',
      jobRoleId: 'jr-logistics-coordinator',
      jobRoleTitle: 'Fleet & Supply Chain Coordinator',
      skillId: 'sk_sql',
      skillName: 'SQL',
      demand: {
        index: 76,
        activeVacancies: 180,
        yoyGrowthRate: 26,
        urgency: 'High',
        topLocalEmployers: ['North Bihar Agri-Logistics', 'Kanti Logistics Hub', 'Express Parcel North Corridors']
      },
      supply: {
        registeredTalentCount: 290,
        placementReadyCount: 85,
        inTrainingCount: 140,
        readinessAverage: 51
      },
      trainingCapacity: {
        activeTrainingCentersCount: 7,
        annualSeatCapacity: 380,
        topTrainingInstitutions: ['MIT Muzaffarpur Logistics Cell', 'KYP Muzaffarpur Central', 'Govt Polytechnic Muzaffarpur'],
        bsdmCertifiedCenters: 3
      },
      employmentOutcomes: {
        historicalPlacementRate: 69,
        averageStartingSalaryMonthly: '₹22,000 - ₹34,000',
        retentionRate6Months: 80
      },
      dataSource: 'Muzaffarpur Chamber of Commerce Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Muzaffarpur, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },
    {
      id: 'reg_int_muz_python',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-muzaffarpur',
      districtName: 'Muzaffarpur',
      industryId: 'agro_tech',
      industryName: 'Agro-Tech & Sustainable Food Processing',
      jobRoleId: 'jr-agritech-specialist',
      jobRoleTitle: 'AgriTech Automation Specialist',
      skillId: 'sk_python',
      skillName: 'Python',
      demand: {
        index: 71,
        activeVacancies: 130,
        yoyGrowthRate: 34,
        urgency: 'High',
        topLocalEmployers: ['Muzaffarpur Litchi Agro Processing', 'Tirhut Agri Consortium', 'Rural Smart Farm Services']
      },
      supply: {
        registeredTalentCount: 210,
        placementReadyCount: 60,
        inTrainingCount: 95,
        readinessAverage: 48
      },
      trainingCapacity: {
        activeTrainingCentersCount: 5,
        annualSeatCapacity: 260,
        topTrainingInstitutions: ['MIT Muzaffarpur', 'Rajendra Prasad Central Agricultural University Extension'],
        bsdmCertifiedCenters: 2
      },
      employmentOutcomes: {
        historicalPlacementRate: 64,
        averageStartingSalaryMonthly: '₹24,000 - ₹36,000',
        retentionRate6Months: 77
      },
      dataSource: 'Bihar Agriculture Modernization Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Muzaffarpur, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },

    // GAYA DISTRICT
    {
      id: 'reg_int_gaya_python',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-gaya',
      districtName: 'Gaya',
      industryId: 'renewable_energy',
      industryName: 'Renewable & Solar Energy',
      jobRoleId: 'jr-data-analyst',
      jobRoleTitle: 'Data Analyst & BI Specialist',
      skillId: 'sk_python',
      skillName: 'Python',
      demand: {
        index: 79,
        activeVacancies: 155,
        yoyGrowthRate: 38,
        urgency: 'High',
        topLocalEmployers: ['BREDA (Bihar Renewable Energy Dev Agency)', 'Gaya Solar Park Operators', 'GreenGrid Solutions']
      },
      supply: {
        registeredTalentCount: 240,
        placementReadyCount: 75,
        inTrainingCount: 110,
        readinessAverage: 54
      },
      trainingCapacity: {
        activeTrainingCentersCount: 6,
        annualSeatCapacity: 320,
        topTrainingInstitutions: ['Gaya College of Engineering', 'Govt ITI Gaya', 'BSDM Solar Center'],
        bsdmCertifiedCenters: 3
      },
      employmentOutcomes: {
        historicalPlacementRate: 74,
        averageStartingSalaryMonthly: '₹25,000 - ₹38,000',
        retentionRate6Months: 86
      },
      dataSource: 'BREDA Renewable Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Gaya, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },

    // BHAGALPUR DISTRICT
    {
      id: 'reg_int_bha_cpp',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-bhagalpur',
      districtName: 'Bhagalpur',
      industryId: 'it_software',
      industryName: 'Information Technology & Software',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_cpp',
      skillName: 'C++',
      demand: {
        index: 73,
        activeVacancies: 125,
        yoyGrowthRate: 19,
        urgency: 'Medium',
        topLocalEmployers: ['Silk City Embedded Systems', 'IIIT Bhagalpur Incubatees', 'Regional Telecom Services']
      },
      supply: {
        registeredTalentCount: 260,
        placementReadyCount: 90,
        inTrainingCount: 115,
        readinessAverage: 57
      },
      trainingCapacity: {
        activeTrainingCentersCount: 6,
        annualSeatCapacity: 340,
        topTrainingInstitutions: ['BCE Bhagalpur', 'IIIT Bhagalpur', 'Govt Polytechnic Bhagalpur'],
        bsdmCertifiedCenters: 2
      },
      employmentOutcomes: {
        historicalPlacementRate: 71,
        averageStartingSalaryMonthly: '₹26,000 - ₹40,000',
        retentionRate6Months: 82
      },
      dataSource: 'IIIT Bhagalpur Placement Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Bhagalpur, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    },

    // DARBHANGA DISTRICT
    {
      id: 'reg_int_dar_react',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-darbhanga',
      districtName: 'Darbhanga',
      industryId: 'it_software',
      industryName: 'Information Technology & Software',
      jobRoleId: 'jr-fullstack-dev',
      jobRoleTitle: 'Full Stack Web Developer',
      skillId: 'sk_react',
      skillName: 'React',
      demand: {
        index: 77,
        activeVacancies: 165,
        yoyGrowthRate: 29,
        urgency: 'High',
        topLocalEmployers: ['Mithila Tech Solutions', 'Darbhanga Airport Logistics Hub', 'Regional IT Services']
      },
      supply: {
        registeredTalentCount: 275,
        placementReadyCount: 88,
        inTrainingCount: 130,
        readinessAverage: 53
      },
      trainingCapacity: {
        activeTrainingCentersCount: 6,
        annualSeatCapacity: 330,
        topTrainingInstitutions: ['Darbhanga College of Engineering', 'LN Mithila University Computer Dept', 'KYP Darbhanga'],
        bsdmCertifiedCenters: 3
      },
      employmentOutcomes: {
        historicalPlacementRate: 68,
        averageStartingSalaryMonthly: '₹24,000 - ₹38,000',
        retentionRate6Months: 79
      },
      dataSource: 'Darbhanga District Skill Telemetry Model',
      dataPeriod: '2026-Q1',
      verificationStatus: 'modeled',
      metadata: {
        source_name: 'Skill2Hire Bihar Telemetry Model',
        source_type: 'DEMO',
        data_period: '2026-Q1',
        geographic_scope: 'District (Darbhanga, Bihar)',
        last_updated: '2026-09-22',
        verification_status: 'DEMO',
        disclaimer: 'Illustrative data — not official statistics'
      },
      createdAt: '2026-01-15T00:00:00Z',
      updatedAt: '2026-09-22T00:00:00Z'
    }
  ];

  const employment_outcomes: EmploymentOutcome[] = [
    {
      id: 'emp_out_1',
      candidateId: 'u_student_1',
      candidateName: 'Alex Rivera',
      employerId: 'u_comp_1',
      employerName: 'TechNova Solutions',
      jobId: 'job_1',
      roleTitle: 'Full Stack Web Developer',
      industryId: 'it_software',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-patna',
      placementType: 'Local',
      startingSalaryAnnual: 480000,
      currency: 'INR',
      hiredDate: '2026-01-20T00:00:00Z',
      retentionMonths: 8,
      verificationStatus: 'verified'
    },
    {
      id: 'emp_out_2',
      candidateId: 'u_student_2',
      candidateName: 'Priya Sharma',
      employerId: 'u_comp_3',
      employerName: 'DataSphere Analytics',
      jobId: 'job_3',
      roleTitle: 'Data Analyst & BI Specialist',
      industryId: 'it_software',
      countryId: 'in',
      regionId: 'in-bihar',
      cityOrDistrictId: 'in-br-patna',
      placementType: 'Domestic Migration',
      startingSalaryAnnual: 750000,
      currency: 'INR',
      hiredDate: '2026-02-14T00:00:00Z',
      retentionMonths: 7,
      verificationStatus: 'verified'
    }
  ];

  return {
    users,
    students,
    colleges,
    companies,
    jobs,
    skills,
    student_skills,
    verified_skills,
    courses,
    course_modules,
    lessons,
    lesson_progress: [],
    assessments,
    questions,
    assessment_results: [],
    applications: [],
    training_programs: [],
    training_enrollments: [],
    college_curriculum,
    industry_skill_demand: [],
    notifications,
    certificates,
    projects,
    career_paths,
    placement_drives,
    coding_problems,
    coding_attempts: [],
    interview_questions,
    interview_evaluations: [],
    resume_analyses: [],
    company_demand_signals,
    project_recommendations,
    cohort_groups,
    academic_reports: [],
    otps: [],

    // Global Geography & Taxonomy
    countries,
    regions,
    cities,
    industries,
    skill_categories,
    job_roles,
    skill_relationships,
    employment_outcomes,

    // Regional Intelligence Framework
    regional_profiles,
    regional_intelligence
  };
}
