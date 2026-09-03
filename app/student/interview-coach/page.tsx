'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Sparkles,
  CheckCircle2,
  Send,
  MessageSquare,
  Award,
  TrendingUp,
  Mic,
  MicOff,
  HelpCircle,
  Clock,
  ArrowRight,
  ShieldCheck,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
  Volume1,
  UserCheck,
  Play,
  RotateCcw,
  Star,
  Activity,
  AlertTriangle,
  Smile,
  Frown,
  Eye,
  Info
} from 'lucide-react';

// Pre-defined role-specific interview questions with Model Answers
const INTERVIEW_ROLE_QUESTIONS = {
  'Software Engineer': [
    {
      id: 'se_q1',
      question: "Welcome! Let's start by introducing yourself. Walk me through your technical stack and a challenging project you built recently.",
      difficulty: 'Easy',
      category: 'Behavioral',
      expectedKeywords: ['React', 'API', 'Database', 'Git', 'Project', 'Refactor'],
      modelAnswer: "I am a Full Stack Developer specializing in React, Node.js, and TypeScript. Recently, I built a secure student placement verification dashboard. One of the main challenges was implementing real-time webcam proctoring with local model weights. I resolved this by hosting face-api shard binaries locally to prevent CORS delays. I structured my codebase cleanly using React hooks, handled database relations in Supabase, and used Git branch workflows for code safety."
    },
    {
      id: 'se_q2',
      question: "Great. Now a technical question: How does the JavaScript runtime event loop handle asynchronous tasks and microtask queues?",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Event Loop', 'Callback', 'Promise', 'Call Stack', 'Microtask', 'Task Queue'],
      modelAnswer: "The JavaScript event loop coordinates task execution. Synchronous code executes first on the Call Stack. When asynchronous processes (like Promises or setTimeout) finish, their callbacks enter queues. Microtasks (like Promise .then() callbacks) enter the Microtask Queue and are executed immediately after the current execution block completes, before any macrotasks or browser repaints. Macrotasks (like setTimeout or fetch callbacks) enter the Task Queue and execute one-by-one in subsequent ticks of the event loop."
    },
    {
      id: 'se_q3',
      question: "If we need to design a system to handle 10,000 requests per second with low database latency, how would you cache data and structure scaling?",
      difficulty: 'Hard',
      category: 'System Design',
      expectedKeywords: ['Redis', 'Cache', 'Scale', 'Load Balancer', 'Horizontal Scaling', 'Read Replica'],
      modelAnswer: "To scale to 10k requests/sec, I would first introduce a Redis caching layer in front of the database to store frequently read objects. Second, I would host our server behind an Nginx load balancer to distribute incoming traffic horizontally across multiple stateless application instances. Finally, to prevent database bottlenecks, I would configure read replicas in our SQL database to offload read-heavy query operations from the master write node."
    },
    {
      id: 'se_q4',
      question: "Tell me about a time you had a technical disagreement with a team member. How did you resolve it to keep the project on track?",
      difficulty: 'Medium',
      category: 'Behavioral',
      expectedKeywords: ['Collaboration', 'Conflict Resolution', 'Communication', 'Compromise', 'Teamwork'],
      modelAnswer: "On a recent project, a team member wanted to use a NoSQL database, whereas I recommended a relational PostgreSQL schema because of our highly structured relations and ACID requirements. To resolve this, I scheduled a collaborative design mapping session. I walked through our domain models and showed how MongoDB would lead to messy document referencing. We agreed to use PostgreSQL, but compromised by caching dynamic session payloads in Redis to keep page loads fast."
    },
    {
      id: 'se_q5',
      question: "Finally, how do you protect web applications against common security vulnerabilities like Cross-Site Scripting (XSS) and SQL Injection?",
      difficulty: 'Medium',
      category: 'Security',
      expectedKeywords: ['SQL Injection', 'XSS', 'Sanitization', 'Validation', 'Parameterized Queries', 'CSP'],
      modelAnswer: "To prevent SQL Injection, I strictly enforce parameterized queries or use database ORMs that sanitize input fields automatically. To prevent Cross-Site Scripting (XSS), I sanitize user HTML inputs using DOMPurify, set HttpOnly flags on session cookies to block access from document scripts, and configure strict Content Security Policy (CSP) headers to control which scripts can run in the client browser."
    }
  ],
  'Frontend Developer': [
    {
      id: 'fe_q1',
      question: "Welcome! Introduce yourself and describe your experience working with React state management libraries and performance optimization.",
      difficulty: 'Easy',
      category: 'Behavioral',
      expectedKeywords: ['Redux', 'Zustand', 'State', 'Performance', 'Memo', 'Lighthouse'],
      modelAnswer: "I am a Frontend Developer specializing in React and Next.js. I have managed state using Redux Toolkit and Zustand, selecting the latter for lightweight, hook-based structures. To optimize performance, I use React.memo, useMemo, and lazy loading. I also audit Web Vitals using Lighthouse to keep Largest Contentful Paint (LCP) under 2.5 seconds."
    },
    {
      id: 'fe_q2',
      question: "Can you explain the differences between CSS Flexbox and CSS Grid, and when you would select one over the other?",
      difficulty: 'Easy',
      category: 'Technical',
      expectedKeywords: ['Flexbox', 'Grid', 'One-dimensional', 'Two-dimensional', 'Rows', 'Columns'],
      modelAnswer: "Flexbox is a one-dimensional layout system designed for laying out items in a single row or column. Grid is a two-dimensional layout system designed for complex layouts with both rows and columns. I use Flexbox for component alignment (like navbars) and Grid for structural page layouts."
    },
    {
      id: 'fe_q3',
      question: "What is critical rendering path optimization, and how do you minimize render-blocking resources?",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Rendering Path', 'Render-blocking', 'Defer', 'Async', 'Minification', 'Critical CSS'],
      modelAnswer: "Critical rendering path optimization involves minimizing the time it takes the browser to paint pixels. I reduce render-blocking by using async or defer tags on non-essential script files, inline critical CSS, bundle size minification via Webpack/Turbopack, and lazy loading offscreen images."
    },
    {
      id: 'fe_q4',
      question: "How does Cross-Origin Resource Sharing (CORS) protect users, and how do you configure it securely?",
      difficulty: 'Medium',
      category: 'Security',
      expectedKeywords: ['CORS', 'Headers', 'Origin', 'Preflight', 'Access-Control-Allow-Origin'],
      modelAnswer: "CORS is a browser security mechanism that restricts resources on a web page from being requested from another domain. To configure it securely, I set specific headers like Access-Control-Allow-Origin to point to only trusted origins rather than using wildcards, and handle preflight OPTIONS requests properly."
    },
    {
      id: 'fe_q5',
      question: "What are the benefits of Server-Side Rendering (SSR) and Static Site Generation (SSG) in Next.js?",
      difficulty: 'Hard',
      category: 'Technical',
      expectedKeywords: ['SSR', 'SSG', 'SEO', 'Static', 'getServerSideProps', 'getStaticProps'],
      modelAnswer: "SSG builds HTML files at build-time, which are cached by CDNs for fast loading. SSR generates HTML on every request, making it ideal for dynamic, user-specific data. Both improve SEO by serving pre-rendered HTML to search bots, and decrease Initial Page Load time."
    }
  ],
  'DevOps Engineer': [
    {
      id: 'do_q1',
      question: "Welcome! Walk me through your experience building CI/CD pipelines and managing cloud resources.",
      difficulty: 'Easy',
      category: 'Behavioral',
      expectedKeywords: ['CI/CD', 'AWS', 'Docker', 'Terraform', 'GitHub Actions', 'Kubernetes'],
      modelAnswer: "I am a DevOps Engineer specializing in infrastructure automation. I design CI/CD pipelines using GitHub Actions and Docker. I manage cloud resources on AWS using Terraform to treat infrastructure as code (IaC), and deploy scalable container microservices inside Kubernetes clusters."
    },
    {
      id: 'do_q2',
      question: "What is the difference between a Docker container and a Virtual Machine, and how do they share resources?",
      difficulty: 'Easy',
      category: 'Technical',
      expectedKeywords: ['Docker', 'Container', 'Virtual Machine', 'Hypervisor', 'Kernel', 'OS'],
      modelAnswer: "A Virtual Machine runs a complete guest OS on top of a hypervisor, consuming high overhead. A Docker container shares the host OS kernel and runs as an isolated user process, making containers much lighter, faster to boot, and highly resource-efficient."
    },
    {
      id: 'do_q3',
      question: "Explain how Terraform manages state, and why locking the state file is important in team environments.",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Terraform', 'State', 'Locking', 'Backend', 'S3', 'DynamoDB'],
      modelAnswer: "Terraform saves the state of your infrastructure in a terraform.tfstate file to map resource configs to real-world infrastructure. In teams, we store state in a remote backend (like AWS S3) and enable state locking (using DynamoDB) to prevent concurrent executions from corrupting the state file."
    },
    {
      id: 'do_q4',
      question: "What is GitOps, and how does it differ from traditional push-based CI/CD workflows?",
      difficulty: 'Hard',
      category: 'Technical',
      expectedKeywords: ['GitOps', 'Pull-based', 'ArgoCD', 'Git', 'Reconciliation', 'Desired State'],
      modelAnswer: "In push-based CI/CD, the pipeline pushes builds to servers. In GitOps, we use pull-based agents (like ArgoCD) that monitor a Git repository containing Kubernetes manifests. The agent continuously pulls changes and reconciles the cluster to match the desired state defined in Git."
    },
    {
      id: 'do_q5',
      question: "How do you set up auto-healing and monitoring for high-availability production clusters?",
      difficulty: 'Medium',
      category: 'System Design',
      expectedKeywords: ['Monitoring', 'Prometheus', 'Grafana', 'Liveness', 'Readiness', 'Auto-scaling'],
      modelAnswer: "I configure Kubernetes liveness and readiness probes to restart unhealthy pods automatically. I monitor system health using Prometheus to collect metrics and Grafana to visualize load. I also set up horizontal pod auto-scaling (HPA) to scale up nodes when CPU usage crosses 70%."
    }
  ],
  'ML Engineer': [
    {
      id: 'ml_q1',
      question: "Welcome! Walk me through your experience building, evaluating, and deploying machine learning models.",
      difficulty: 'Easy',
      category: 'Behavioral',
      expectedKeywords: ['Python', 'PyTorch', 'TensorFlow', 'Training', 'Evaluation', 'Deployment'],
      modelAnswer: "I am an ML Engineer focused on model development and deployment. I build neural network architectures using PyTorch and TensorFlow. I clean datasets, train classifiers, evaluate metrics (like F1-score and ROC-AUC), and package models as API endpoints inside Docker containers."
    },
    {
      id: 'ml_q2',
      question: "What is overfitting, and what regularization techniques do you apply to prevent it?",
      difficulty: 'Easy',
      category: 'Technical',
      expectedKeywords: ['Overfitting', 'Regularization', 'Dropout', 'L1', 'L2', 'Validation'],
      modelAnswer: "Overfitting occurs when a model learns training noise instead of general patterns, scoring high on training but low on validation sets. I prevent it using L1/L2 regularization (weight decay), Dropout layers to disable neurons randomly, early stopping, and data augmentation."
    },
    {
      id: 'ml_q3',
      question: "Explain the self-attention mechanism in Transformer models and why it is superior to RNNs.",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Attention', 'Transformer', 'Self-attention', 'Parallel', 'Sequence', 'RNN'],
      modelAnswer: "RNNs process tokens sequentially, causing bottlenecks and vanishing gradients. The self-attention mechanism in Transformers computes relationships between all words in a sequence simultaneously in parallel. This captures long-range dependencies efficiently and speeds up training."
    },
    {
      id: 'ml_q4',
      question: "How do you track machine learning experiments and ensure reproducibility across model training runs?",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['MLOps', 'MLflow', 'DVC', 'Reproducibility', 'Hyperparameters', 'Dataset'],
      modelAnswer: "I use MLflow to track parameters, metrics, and model artifacts for each run. I track large dataset versions using Data Version Control (DVC) linked to Git. This guarantees reproducibility because any team member can check out the exact dataset version and hyperparameter configs."
    },
    {
      id: 'ml_q5',
      question: "What is model quantization, and why is it crucial for edge devices and browser-based AI?",
      difficulty: 'Hard',
      category: 'Technical',
      expectedKeywords: ['Quantization', 'FP16', 'INT8', 'Precision', 'Latency', 'Compression'],
      modelAnswer: "Model quantization converts weights from high-precision floats (like FP32) to lower-precision values (like INT8). This compresses model file size, reduces memory footprint, and lowers execution latency on edge devices or in browsers with minimal impact on accuracy."
    }
  ],
  'Data Analyst': [
    {
      id: 'da_q1',
      question: "Welcome! Tell me about yourself and your experience working with data cleaning and dashboard reporting tools.",
      difficulty: 'Easy',
      category: 'Behavioral',
      expectedKeywords: ['SQL', 'Excel', 'Python', 'Pandas', 'Tableau', 'PowerBI'],
      modelAnswer: "I am a Data Analyst focused on turning complex raw data into business insights. I am skilled in Python for data munging using Pandas and NumPy, SQL for querying structured warehouses, and Excel/Tableau for visual reporting. Recently, I built a sales tracking dashboard that aggregated transaction records, cleaned missing outliers, and plotted interactive metrics, helping managers spot customer drop-off channels."
    },
    {
      id: 'da_q2',
      question: "How do you handle missing values or outliers in a dataset before starting your exploratory data analysis?",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Imputation', 'Mean', 'Median', 'Outliers', 'Standard Deviation', 'Pandas'],
      modelAnswer: "To handle missing data, I first assess if they are missing at random. If small, I drop them; if large, I apply imputation using the median for skewed distributions, or the mean for normal fields. For outliers, I compute the Interquartile Range (IQR) and standard deviation thresholds. If outliers are verified data entry errors, I remove or clamp them, otherwise, I analyze them separately to make sure they do not distort our core regression models."
    },
    {
      id: 'da_q3',
      question: "Can you explain the difference between a INNER JOIN, LEFT JOIN, and outer joins in SQL, and when you would use each?",
      difficulty: 'Easy',
      category: 'Technical',
      expectedKeywords: ['SQL', 'Inner Join', 'Left Join', 'Null', 'Database', 'Rows'],
      modelAnswer: "An INNER JOIN returns only the rows where there is a matching value in both tables. A LEFT JOIN returns all rows from the left table and any matching rows from the right table, leaving right-side values as NULL if no match exists. An OUTER JOIN returns all rows from both tables, merging where possible and leaving NULL for non-matching rows on either side. I use INNER JOIN for strict relational lookups, and LEFT JOIN when I need to keep the full list intact regardless of relational matches."
    },
    {
      id: 'da_q4',
      question: "Describe a scenario where data insights you found directly impacted a business decision or solved an operational bottleneck.",
      difficulty: 'Medium',
      category: 'Behavioral',
      expectedKeywords: ['Impact', 'Insight', 'Metrics', 'Revenue', 'Optimization', 'Stakeholders'],
      modelAnswer: "While analyzing user onboarding funnels, I noticed that 45% of students dropped off at the contact verification step. By cross-referencing latency logs, I discovered that SMS verification codes were taking over 90 seconds to arrive. I presented these metrics to stakeholders, recommending an immediate migration to WhatsApp OTP APIs. Once implemented, student onboarding conversion rates increased by 22% within two weeks."
    },
    {
      id: 'da_q5',
      question: "What statistical metrics do you use to measure the correlation between multiple numerical variables in a dataset?",
      difficulty: 'Medium',
      category: 'Technical',
      expectedKeywords: ['Correlation', 'Pearson', 'P-value', 'Covariance', 'Significance', 'Scatter Plot'],
      modelAnswer: "To measure numerical correlation, I calculate the Pearson correlation coefficient, which ranges from -1 to +1. I also evaluate the covariance to understand the directional relationship, and compute the P-value to verify statistical significance. Lastly, I plot a Scatter Plot with a trend line to visually verify if the relationship is linear, or if a Spearman rank correlation is required for non-linear monotonic data distributions."
    }
  ]
};

export default function InterviewCoachPage() {
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  // State Management
  const [selectedRole, setSelectedRole] = useState<'Software Engineer' | 'Frontend Developer' | 'DevOps Engineer' | 'ML Engineer' | 'Data Analyst'>('Software Engineer');
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  
  // Advanced state trackers
  const [liveSentiment, setLiveSentiment] = useState<'Confident' | 'Analytical' | 'Hesitant' | 'Professional'>('Professional');
  const [showModelAnswerMap, setShowModelAnswerMap] = useState<Record<number, boolean>>({});

  const [answersFeedback, setAnswersFeedback] = useState<Array<{
    question: string;
    answer: string;
    score: number;
    feedback: string;
    keywordsMatched: string[];
    mood: 'Confident' | 'Analytical' | 'Hesitant' | 'Professional';
    modelAnswer: string;
  }>>([]);
  const [isFinished, setIsFinished] = useState(false);

  // Audio recognition & Speech Refs
  const recognitionRef = useRef<any>(null);
  const shouldBeRecordingRef = useRef<boolean>(false);
  const [speechError, setSpeechError] = useState<string>('');

  // Camera settings
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Live Sentiment Analysis parser
  const analyzeSentimentAndMood = (text: string): 'Confident' | 'Analytical' | 'Hesitant' | 'Professional' => {
    const cleanText = text.toLowerCase();
    
    // Count indicators
    const fillers = ['um', 'uh', 'maybe', 'probably', 'sort of', 'i guess', 'just', 'actually'];
    const analyticalWords = ['specifically', 'optimize', 'scalability', 'complexity', 'bottleneck', 'consequently', 'trade-off', 'structure'];
    const confidentWords = ['successfully', 'achieved', 'implemented', 'designed', 'resolved', 'led', 'integrated', 'ensure', 'demonstrated'];

    let fillerCount = 0;
    fillers.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'g');
      fillerCount += (cleanText.match(regex) || []).length;
    });

    let analyticalCount = 0;
    analyticalWords.forEach(word => {
      if (cleanText.includes(word)) analyticalCount++;
    });

    let confidentCount = 0;
    confidentWords.forEach(word => {
      if (cleanText.includes(word)) confidentCount++;
    });

    if (fillerCount > 2) return 'Hesitant';
    if (confidentCount > 2 && confidentCount >= analyticalCount) return 'Confident';
    if (analyticalCount > 1) return 'Analytical';
    return 'Professional';
  };

  // Run sentiment analyzer dynamically as user types or speaks
  useEffect(() => {
    if (userAnswer.trim()) {
      const mood = analyzeSentimentAndMood(userAnswer);
      setLiveSentiment(mood);
    } else {
      setLiveSentiment('Professional');
    }
  }, [userAnswer]);

  // Initialize Speech Recognition API
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = false;
        rec.lang = 'en-US';
        
        rec.onresult = (event: any) => {
          const text = event.results[event.results.length - 1][0].transcript;
          setUserAnswer(prev => prev + (prev ? ' ' : '') + text);
        };

        rec.onerror = (e: any) => {
          console.error('Speech recognition error:', e.error);
          if (e.error === 'not-allowed') {
            setSpeechError('Microphone blocked: Please allow microphone permissions in your browser URL bar.');
            shouldBeRecordingRef.current = false;
            setIsRecording(false);
          } else if (e.error === 'no-speech') {
            console.log('No speech detected.');
          } else if (e.error === 'aborted') {
            console.log('Speech recognition aborted.');
          } else {
            setSpeechError(`Speech Error: ${e.error || 'Check microphone connections.'}`);
            shouldBeRecordingRef.current = false;
            setIsRecording(false);
          }
        };

        rec.onend = () => {
          if (shouldBeRecordingRef.current) {
            try {
              rec.start();
            } catch (err) {
              console.error('Failed to auto-restart speech recognition:', err);
            }
          } else {
            setIsRecording(false);
          }
        };

        recognitionRef.current = rec;
      }
    }
  }, []);

  // Pre-load voices list to guarantee availability in asynchronous browsers
  useEffect(() => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Control browser audio speech text to speech
  const speakQuestion = (text: string) => {
    if (isMuted || typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get all available system voices
    const voices = window.speechSynthesis.getVoices();
    
    // Prioritize natural/premium female English voices
    const preferredFemaleVoices = [
      'google us english', 
      'google uk english female', 
      'microsoft zira', 
      'samantha',
      'veena',
      'karen',
      'moira',
      'tessa',
      'daniel',
      'hazel'
    ];
    
    // Find the first matching English voice from our preferences
    let selectedVoice = null;
    for (const pref of preferredFemaleVoices) {
      selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes(pref) && 
        (v.lang.startsWith('en') || v.lang.startsWith('EN'))
      );
      if (selectedVoice) break;
    }
    
    // If no preferred voice matched, look for any English female voice or en-US voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        (v.lang.startsWith('en') || v.lang.startsWith('EN')) && 
        (v.name.toLowerCase().includes('female') || v.name.toLowerCase().includes('zira') || v.name.toLowerCase().includes('samantha'))
      );
    }

    // Ultimate fallback to first English voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => v.lang.startsWith('en') || v.lang.startsWith('EN'));
    }
    
    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }
    
    // Set professional, crisp interview speech properties
    utterance.rate = 0.95; // Slightly measured rate for clear pronunciation
    utterance.pitch = 1.05; // Friendly, clear pitch
    window.speechSynthesis.speak(utterance);
  };

  // Start webcam feed for mock interface view
  const startCamera = async () => {
    try {
      setCameraError(false);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 320, height: 240 } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setCameraActive(true);
      }
    } catch (err) {
      console.error('Webcam startup failed:', err);
      setCameraError(true);
    }
  };

  // Stop camera feed
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setCameraActive(false);
    }
  };

  // Toggle mic speech recognition
  const handleToggleRecording = () => {
    if (!recognitionRef.current) {
      // Fallback if Speech API is missing
      setIsRecording(!isRecording);
      if (!isRecording) {
        const dummyTexts = {
          'Software Engineer': [
            "Recently, I built a secure student placement dashboard. I structured my codebase cleanly using React hooks, handled database relations in Supabase, and used Git workflows for code safety.",
            "The JavaScript event loop coordinates task execution. Microtasks like Promise .then() callbacks enter the Microtask Queue and execute immediately before macrotasks.",
            "To scale to 10k requests per second, I would configure a Redis caching layer in front of our database and host application clusters behind Nginx load balancers.",
            "I resolved a databases dispute by scheduling a collaborative diagram mapping. We compromised by selecting PostgreSQL, but caching dynamic payloads in Redis.",
            "To prevent XSS, I sanitize user HTML inputs using DOMPurify and configure strict Content Security Policy headers to secure browser execution."
          ],
          'Frontend Developer': [
            "I specialize in React and Next.js, managing states with Redux and Zustand, and optimizing Lighthouse metrics to keep Largest Contentful Paint under 2.5 seconds.",
            "Flexbox is one-dimensional for single rows or columns, while Grid is two-dimensional for complex row and column structural templates.",
            "To speed up critical rendering path, I minify bundles, defer script files, and lazy load offscreen images to avoid blocking paints.",
            "CORS secures users by restricting cross-domain fetches. I configure Access-Control-Allow-Origin headers specifically for trusted origins.",
            "Static Site Generation builds pages at build-time for caching. Server-Side Rendering generates HTML on each request for user-specific dynamic data."
          ],
          'DevOps Engineer': [
            "I design automated CI/CD pipelines with GitHub Actions and Docker containers, managing scalable cloud nodes in AWS.",
            "Docker container processes share the host OS kernel with low overhead, while VMs load full guest operating systems on top of hypervisors.",
            "Terraform stores resource states in remote S3 backend databases and locks execution threads via DynamoDB to prevent state corruptions.",
            "GitOps pulls deployment changes automatically using reconciliation agents like ArgoCD to sync clusters with versioned Git states.",
            "I set up liveness and readiness probes to auto-heal failed pods and scale nodes when CPU load crosses 70% threshold."
          ],
          'ML Engineer': [
            "I build model structures in PyTorch, cleaning dataset tensors, training classification layers, and deploying models inside microservice APIs.",
            "Overfitting occurs when model parameters memorize training data noise. I apply dropout layers and L1/L2 weight decay regularization to resolve it.",
            "Self-attention computes token relationships simultaneously in parallel, which outperforms sequential RNN backpropagation speeds.",
            "I ensure ML reproducibility by tracking hyperparameter variables in MLflow and versioning training data structures with DVC repositories.",
            "Model quantization scales weights down from float32 to int8 to reduce memory footprint and execution latency on web browsers."
          ],
          'Data Analyst': [
            "I am a Data Analyst experienced in Python for data munging using Pandas and NumPy, and using SQL for database lookups and Tableau for dashboards.",
            "To handle missing data, I apply imputation using the median for skewed distributions, and calculate standard deviation to filter outliers.",
            "An INNER JOIN returns matching rows from both tables. A LEFT JOIN returns all rows from the left table and matching rows from the right table.",
            "I noticed drop-offs at the contact step because verification SMS latency was high. I recommended migrating to WhatsApp OTP, increasing conversions by 22%.",
            "I calculate Pearson correlation coefficients from -1 to +1, evaluate covariance, verify P-values, and plot scatter plots to trace trend lines."
          ]
        };
        const list = dummyTexts[selectedRole as keyof typeof dummyTexts];
        const dummyText = list[currentQuestionIndex] || list[0];
        setUserAnswer(prev => prev + (prev ? ' ' : '') + dummyText);
      }
      return;
    }

    if (isRecording) {
      shouldBeRecordingRef.current = false;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setSpeechError('');
      shouldBeRecordingRef.current = true;
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  // Start the interview
  const handleStartInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setAnswersFeedback([]);
    setIsFinished(false);
    setUserAnswer('');
    setShowModelAnswerMap({});
    startCamera();
    
    // Speak first question
    const qList = INTERVIEW_ROLE_QUESTIONS[selectedRole];
    setTimeout(() => {
      speakQuestion(qList[0].question);
    }, 500);
  };

  // Submit Answer & evaluate response
  const handleSubmitAnswer = () => {
    if (!userAnswer.trim()) return;
    setEvaluating(true);

    const qList = INTERVIEW_ROLE_QUESTIONS[selectedRole];
    const currentQ = qList[currentQuestionIndex];
    
    // Run sentiment mood analyzer
    const responseMood = analyzeSentimentAndMood(userAnswer);

    // Heuristic scorer
    const keywords = currentQ.expectedKeywords;
    const lowerAnswer = userAnswer.toLowerCase();
    const matched = keywords.filter(k => lowerAnswer.includes(k.toLowerCase()));
    
    // Base scores
    const keywordScore = Math.round((matched.length / keywords.length) * 60) + 30; // base 30, up to 90
    const lengthScore = Math.min(10, Math.round(userAnswer.split(' ').length / 5)); // up to 10 points
    const finalScore = Math.min(100, keywordScore + lengthScore);

    let feedbackText = '';
    if (finalScore >= 80) {
      feedbackText = `Excellent answer. You articulated key concepts such as ${matched.slice(0, 3).join(', ')}. Strong structure and vocabulary.`;
    } else if (finalScore >= 55) {
      feedbackText = `Good response, but could be improved. You mentioned ${matched.join(', ') || 'some terms'} but missed discussing details like ${keywords.filter(k => !matched.includes(k)).slice(0, 2).join(' or ')}.`;
    } else {
      feedbackText = `Answer needs development. Be sure to explain core definitions. Try to include keywords like: ${keywords.slice(0, 3).join(', ')}.`;
    }

    const feedbackObject = {
      question: currentQ.question,
      answer: userAnswer,
      score: finalScore,
      feedback: feedbackText,
      keywordsMatched: matched,
      mood: responseMood,
      modelAnswer: currentQ.modelAnswer
    };

    setAnswersFeedback(prev => [...prev, feedbackObject]);
    setUserAnswer('');
    setEvaluating(false);

    // Next question trigger
    const nextIdx = currentQuestionIndex + 1;
    if (nextIdx < qList.length) {
      setCurrentQuestionIndex(nextIdx);
      setTimeout(() => {
        speakQuestion(qList[nextIdx].question);
      }, 600);
    } else {
      // Completed interview
      setIsFinished(true);
      shouldBeRecordingRef.current = false;
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
      setIsRecording(false);
      stopCamera();
      window.speechSynthesis.cancel();
    }
  };

  // Reset interview
  const handleReset = () => {
    setInterviewStarted(false);
    setCurrentQuestionIndex(0);
    setAnswersFeedback([]);
    setIsFinished(false);
    setUserAnswer('');
    setShowModelAnswerMap({});
    shouldBeRecordingRef.current = false;
    try {
      recognitionRef.current?.stop();
    } catch (e) {}
    setIsRecording(false);
    stopCamera();
  };

  // Toggle model answer view
  const toggleModelAnswer = (idx: number) => {
    setShowModelAnswerMap(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // Compute final statistics
  const getOverallReadinessScore = () => {
    if (answersFeedback.length === 0) return 0;
    const total = answersFeedback.reduce((sum, item) => sum + item.score, 0);
    return Math.round(total / answersFeedback.length);
  };

  // Count mood occurrences
  const getMoodDistribution = () => {
    const counts = { Confident: 0, Analytical: 0, Hesitant: 0, Professional: 0 };
    answersFeedback.forEach(item => {
      counts[item.mood] = (counts[item.mood] || 0) + 1;
    });
    return counts;
  };

  // Get primary mood descriptor
  const getPrimaryInterviewMood = () => {
    const dist = getMoodDistribution();
    let maxMood: keyof typeof dist = 'Professional';
    let maxCount = 0;
    Object.entries(dist).forEach(([mood, count]) => {
      if (count > maxCount) {
        maxCount = count;
        maxMood = mood as keyof typeof dist;
      }
    });
    return maxMood;
  };

  return (
    <ProtectedRoute allowedRoles={['student']}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Nav Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-purple-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
                <span>AI Placement Readiness Feature</span>
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">AI Microphone Mock Interview</h1>
              <p className="text-xs text-slate-500">Practice live technical interviews using your webcam and mic. Evaluated in real-time by AI.</p>
            </div>
            
            <Link
              href="/student/dashboard"
              className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shrink-0"
            >
              ← Dashboard
            </Link>
          </div>

          {!interviewStarted && !isFinished ? (
            /* ========================================================================= */
            /* 📋 SETUP WINDOW VIEW                                                      */
            /* ========================================================================= */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-2xl mx-auto space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center mx-auto text-purple-600 border border-purple-100 shadow-sm">
                  <UserCheck className="w-8 h-8" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Configure Your Mock Interview</h2>
                <p className="text-xs text-slate-500">Select your target career path to calibrate the AI interviewer\'s query pool.</p>
              </div>

              {/* Role Select options */}
              <div className="space-y-3">
                <label className="text-xs font-black text-slate-700 uppercase tracking-wider block">Target Role:</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { id: 'Software Engineer', label: 'Software Engineer', desc: 'React, System Design, SQL, JS Event Loop, Security' },
                    { id: 'Frontend Developer', label: 'Frontend Developer', desc: 'CSS Grid/Flexbox, SSR/SSG, CORS, Performance' },
                    { id: 'DevOps Engineer', label: 'DevOps Engineer', desc: 'CI/CD Pipelines, Docker, Kubernetes, Terraform' },
                    { id: 'ML Engineer', label: 'ML Engineer', desc: 'Overfitting, Attention, Quantization, PyTorch' },
                    { id: 'Data Analyst', label: 'Data Analyst', desc: 'SQL Joins, Pandas cleaning, Correlation metrics' }
                  ].map((role) => (
                    <button
                      key={role.id}
                      onClick={() => setSelectedRole(role.id as any)}
                      className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                        selectedRole === role.id
                          ? 'bg-purple-50/50 border-purple-500 shadow-md ring-2 ring-purple-500/10'
                          : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                      }`}
                    >
                      <span className="font-extrabold text-sm text-slate-900 block mb-1">{role.label}</span>
                      <span className="text-[10px] text-slate-500 leading-snug">{role.desc}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Hardware Requirements Notice */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs text-slate-600">
                <span className="font-bold text-slate-800 flex items-center gap-1">
                  <Activity className="w-3.5 h-3.5 text-purple-600 animate-pulse" /> Live Hardware Setup Requirements:
                </span>
                <ul className="list-disc list-inside space-y-1 text-slate-500 pl-1 text-[11px]">
                  <li>Allows notebook microphone access for voice transcription.</li>
                  <li>Opens a small floating web camera preview to simulate visual interview presence.</li>
                  <li>Enable audio output to hear the AI Interviewer speak questions.</li>
                </ul>
              </div>

              <button
                onClick={handleStartInterview}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm shadow-xl shadow-purple-600/20 transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" /> Start Live AI Interview Session
              </button>
            </div>

          ) : interviewStarted && !isFinished ? (
            /* ========================================================================= */
            /* 🎙️ ACTIVE INTERVIEW SESSION                                                */
            /* ========================================================================= */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Panel: Webcam & Interview Status (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* Simulated Webcam view container */}
                <div className="bg-slate-950 rounded-3xl p-3 border border-slate-800 shadow-2xl relative overflow-hidden flex flex-col justify-between aspect-video lg:aspect-auto lg:h-[260px]">
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="absolute inset-0 w-full h-full object-cover scale-x-[-1] opacity-90"
                  />

                  {/* Badges Overlay */}
                  <div className="relative z-10 flex justify-between items-start w-full">
                    <span className="px-2.5 py-1 rounded-lg bg-red-600/90 text-white text-[9px] font-mono font-black flex items-center gap-1 shadow-lg">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> MOCK SESSION ACTIVE
                    </span>
                    
                    <button
                      onClick={() => (cameraActive ? stopCamera() : startCamera())}
                      className="p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-300 hover:text-white"
                      title={cameraActive ? 'Turn Camera Off' : 'Turn Camera On'}
                    >
                      {cameraActive ? <Video className="w-3.5 h-3.5" /> : <VideoOff className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                  </div>

                  {!cameraActive && (
                    <div className="absolute inset-0 bg-slate-900 flex flex-col items-center justify-center text-center p-4">
                      <VideoOff className="w-8 h-8 text-slate-600 mb-2" />
                      <span className="text-xs text-slate-400 font-bold">Webcam Feed Paused</span>
                      <button
                        onClick={startCamera}
                        className="mt-2 px-3 py-1 rounded bg-purple-600 text-[10px] text-white font-bold"
                      >
                        Enable Camera
                      </button>
                    </div>
                  )}

                  {/* Watermark overlay */}
                  <div className="relative z-10 text-[9px] font-mono text-slate-400 bg-slate-950/80 px-2 py-0.5 rounded self-start">
                    Student ID: {studentId}
                  </div>
                </div>

                {/* Live Sentiment & Mood Monitor */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-2">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Live Sentiment Analysis</h3>
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-purple-50/50 border border-purple-100">
                    <Smile className={`w-5 h-5 ${liveSentiment === 'Confident' ? 'text-emerald-500' : liveSentiment === 'Analytical' ? 'text-cyan-500' : liveSentiment === 'Hesitant' ? 'text-amber-500' : 'text-slate-500'}`} />
                    <div>
                      <span className="text-[10px] text-slate-400 block font-bold">Response Emotional Tone:</span>
                      <span className="text-xs font-black text-slate-800">{liveSentiment} Mood</span>
                    </div>
                  </div>
                  <span className="text-[9px] text-slate-400 block leading-tight">Mood updates dynamically based on vocabulary selection, confidence keywords, and usage of voice filler words.</span>
                </div>

                {/* Session telemetry indicators */}
                <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3.5">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Interview Progress</h3>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-slate-500 font-bold">
                      <span>Questions Answered:</span>
                      <span className="text-purple-600 font-black">{currentQuestionIndex + 1} / 5</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-purple-600 rounded-full transition-all duration-300"
                        style={{ width: `${((currentQuestionIndex + 1) / 5) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-bold">Target Path:</span>
                    <span className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 font-bold text-[10px]">
                      {selectedRole}
                    </span>
                  </div>
                </div>

              </div>

              {/* Right Panel: Active Question & Audio Answer Interface (8 Cols) */}
              <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col justify-between min-h-[400px] space-y-6">
                
                {/* Question Block */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                    <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-700 font-black text-[10px] uppercase tracking-wider">
                      Question {currentQuestionIndex + 1} of 5
                    </span>
                    
                    <button
                      onClick={() => {
                        setIsMuted(!isMuted);
                        if (!isMuted) window.speechSynthesis.cancel();
                      }}
                      className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-slate-700 font-bold"
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-rose-500" /> : <Volume2 className="w-3.5 h-3.5 text-purple-600" />}
                      <span>{isMuted ? 'Muted' : 'Sound On'}</span>
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">AI Interviewer:</span>
                      <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-relaxed">
                        {INTERVIEW_ROLE_QUESTIONS[selectedRole][currentQuestionIndex].question}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Answer recording interface */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                    <label className="font-black text-slate-700 uppercase tracking-wider block">Your Spoken Response:</label>
                    
                    <button
                      onClick={handleToggleRecording}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
                        isRecording
                          ? 'bg-rose-100 hover:bg-rose-200 text-rose-700 animate-pulse border border-rose-200'
                          : 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-100'
                      }`}
                    >
                      {isRecording ? <Mic className="w-3.5 h-3.5 text-rose-600 animate-pulse" /> : <MicOff className="w-3.5 h-3.5 text-purple-500" />}
                      <span>{isRecording ? 'Listening (Speak Now)' : 'Click to Speak response'}</span>
                    </button>
                  </div>

                  {speechError && (
                    <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-[10px] text-rose-600 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span>{speechError}</span>
                    </div>
                  )}

                  <textarea
                    rows={6}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Describe your technical logic, architecture parameters, and business trade-offs aloud or type it directly..."
                    className="w-full p-4 text-xs bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:ring-2 focus:ring-purple-500 focus:outline-none leading-relaxed font-sans"
                  />
                </div>

                {/* Submissions action triggers */}
                <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    Cancel Session
                  </button>

                  <button
                    onClick={handleSubmitAnswer}
                    disabled={evaluating || !userAnswer.trim()}
                    className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-45 text-white font-black text-xs transition-colors flex items-center gap-2 shadow-lg shadow-purple-600/25"
                  >
                    {evaluating ? (
                      <>
                        <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" /> Evaluating...
                      </>
                    ) : (
                      <>
                        <span>Submit Answer</span> <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>

              </div>

            </div>

          ) : (
            /* ========================================================================= */
            /* 📊 FINAL EVALUATION SCORECARD                                             */
            /* ========================================================================= */
            <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-4xl mx-auto space-y-6">
              
              {/* Scorecard Header */}
              <div className="text-center border-b border-slate-100 pb-6 space-y-2">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                  <Award className="w-7 h-7" />
                </div>
                <h2 className="text-lg font-black text-slate-900">Placement Mock Interview Results</h2>
                <p className="text-xs text-slate-500">Aggregate scorecard compiled based on terms accuracy and communication relevance.</p>
              </div>

              {/* Total Aggregate Score widget & Sentiment Tone metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <div className="text-center space-y-1.5">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Overall score</span>
                  <div className="text-4xl font-black font-mono text-purple-600">{getOverallReadinessScore()}%</div>
                  
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-purple-100 text-purple-700 text-[10px] font-bold">
                    <Smile className="w-3 h-3 text-purple-600" />
                    <span>Primary Mood: {getPrimaryInterviewMood()}</span>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3 text-xs text-slate-600 border-t md:border-t-0 md:border-l border-slate-200/80 pt-4 md:pt-0 md:pl-6 leading-relaxed">
                  <span className="font-bold text-slate-800 block">AI Technical Recruiter Summary:</span>
                  <p className="text-slate-500 text-[11px]">
                    {getOverallReadinessScore() >= 75
                      ? `Outstanding performance. Your communication sentiment was mapped as primarily "${getPrimaryInterviewMood()}". Your technical vocabulary matched standard production workflows. You showed strong understanding of key database schemas, application components, and scale requirements.`
                      : `Good attempt. Your communication sentiment was mapped as primarily "${getPrimaryInterviewMood()}". Your baseline terminology shows familiarity, but you can strengthen your feedback answers by explicitly discussing edge cases, memory implications, or caching mechanisms.`}
                  </p>
                </div>
              </div>

              {/* Detailed Breakdown for each question */}
              <div className="space-y-4">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Question-by-Question Review</h3>
                
                <div className="space-y-4">
                  {answersFeedback.map((feedback, idx) => {
                    const isModelAnswerVisible = !!showModelAnswerMap[idx];
                    return (
                      <div key={idx} className="p-5 rounded-2xl border border-slate-200 space-y-3.5">
                        
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <div className="flex flex-wrap gap-1.5 items-center">
                              <span className="text-[9px] font-black text-purple-600 uppercase">Question {idx + 1} Review</span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 text-[8px] font-bold">
                                Tone: {feedback.mood}
                              </span>
                            </div>
                            <span className="font-bold text-slate-900 text-xs sm:text-sm block leading-snug">{feedback.question}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => toggleModelAnswer(idx)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-[9px] text-slate-600 font-bold transition-colors flex items-center gap-1"
                              title="Toggle best possible reply answer"
                            >
                              <Eye className="w-3 h-3" /> {isModelAnswerVisible ? 'Hide Best Reply' : 'Show Best Reply'}
                            </button>
                            
                            <span className={`px-2 py-0.5 rounded font-mono font-black text-[11px] ${
                              feedback.score >= 80
                                ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                                : feedback.score >= 60
                                ? 'bg-amber-50 text-amber-600 border border-amber-100'
                                : 'bg-rose-50 text-rose-600 border border-rose-100'
                            }`}>
                              {feedback.score}%
                            </span>
                          </div>
                        </div>

                        {/* Speech Transcript */}
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] font-mono text-slate-500 leading-normal">
                          <span className="text-[9px] font-black text-slate-400 block mb-1">Your Speech Answer:</span>
                          <p className="italic text-slate-700">"{feedback.answer}"</p>
                        </div>

                        {/* Model Answer (Best Reply) Expandable Container */}
                        {isModelAnswerVisible && (
                          <div className="p-3.5 rounded-xl bg-purple-50/40 border border-purple-100 text-[11px] leading-relaxed space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                            <span className="font-black text-purple-800 flex items-center gap-1 text-[9px] uppercase tracking-wider">
                              <Sparkles className="w-3.5 h-3.5 text-purple-600" /> Best Possible Reply (Ideal Model Answer):
                            </span>
                            <p className="text-slate-700 font-sans font-semibold">{feedback.modelAnswer}</p>
                          </div>
                        )}

                        <div className="space-y-2 text-xs">
                          {feedback.keywordsMatched.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="text-[9px] text-slate-400 font-bold mr-1">Matched Keywords:</span>
                              {feedback.keywordsMatched.map(k => (
                                <span key={k} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 text-[9px] font-bold">
                                  {k}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="text-slate-600 text-[11px]">
                            <span className="font-bold text-slate-800 block">Evaluation Feedback:</span>
                            <p className="leading-relaxed text-slate-500">{feedback.feedback}</p>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  onClick={handleReset}
                  className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Start New Interview
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </ProtectedRoute>
  );
}
