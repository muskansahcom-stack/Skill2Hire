'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  PlayCircle,
  CheckCircle2,
  Lock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Code2,
  Download,
  Award,
  Sparkles,
  ArrowRight,
  Clock,
  ExternalLink,
  ShieldCheck,
  GitBranch,
  Layers,
  Cpu,
  AlertTriangle
} from 'lucide-react';
import { COURSE_STUDY_MATERIALS } from '@/lib/courseMaterials';
import { DETAILED_COURSE_NOTES } from '@/lib/detailedLessonNotes';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';
  const courseId = params?.id as string;

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<'video' | 'cheatsheet' | 'diagrams' | 'notes' | 'practice' | 'resources'>('cheatsheet');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // Watch tracking for active lesson
  const [watchedSeconds, setWatchedSeconds] = useState(0);
  const [showAssessmentModal, setShowAssessmentModal] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [assessmentCheckpoint, setAssessmentCheckpoint] = useState(1);
  const [q1Answer, setQ1Answer] = useState<number | null>(null);
  const [q2Answer, setQ2Answer] = useState<number | null>(null);
  const [assessmentSubmitted, setAssessmentSubmitted] = useState(false);
  const [earnedScore, setEarnedScore] = useState(0);
  const [overallAssessmentScore, setOverallAssessmentScore] = useState(0);
  const [associatedAssessment, setAssociatedAssessment] = useState<any>(null);

  // Ref to the YouTube iframe for pause / resume control
  const ytIframeRef = useRef<HTMLIFrameElement>(null);

  // Camera & face-api.js Proctoring states for 10-minute assessments
  const [faceApiLoaded, setFaceApiLoaded] = useState(false);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [headTurnWarnings, setHeadTurnWarnings] = useState(0);
  const [isFaceApiLoading, setIsFaceApiLoading] = useState(true);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [proctoringCooldown, setProctoringCooldown] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  const videoRef = useRef<HTMLVideoElement>(null);
  const [baselineRatio, setBaselineRatio] = useState<number>(1.0);
  const currentRatioRef = useRef<number>(1.0);

  // Helper: send YouTube IFrame API commands via postMessage
  const ytCommand = (cmd: 'playVideo' | 'pauseVideo') => {
    try {
      ytIframeRef.current?.contentWindow?.postMessage(
        JSON.stringify({ event: 'command', func: cmd, args: [] }),
        '*'
      );
    } catch (_) {}
  };

  // Pause YouTube when assessment modal opens; resume when it closes after submission
  useEffect(() => {
    if (showAssessmentModal) {
      // Small delay to ensure iframe is ready
      setTimeout(() => ytCommand('pauseVideo'), 150);
    }
  }, [showAssessmentModal]);

  // Pause YouTube when proctoring warning modal is active
  useEffect(() => {
    if (showWarningModal) {
      setIsVideoPlaying(false);
      setTimeout(() => ytCommand('pauseVideo'), 150);
    }
  }, [showWarningModal]);

  // Load face-api.js script dynamically
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/dist/face-api.js';
    script.async = true;
    script.onload = () => {
      setFaceApiLoaded(true);
    };
    script.onerror = () => {
      console.error('Failed to load face-api script');
      setIsFaceApiLoading(false);
    };
    document.body.appendChild(script);
    return () => {
      try {
        document.body.removeChild(script);
      } catch (_) {}
    };
  }, []);

  // Proactively load face-api models on page load
  useEffect(() => {
    if (!faceApiLoaded) return;
    async function preloadModels() {
      try {
        setIsFaceApiLoading(true);
        // @ts-ignore
        const faceapi = window.faceapi;
        await faceapi.nets.tinyFaceDetector.loadFromUri('/models/');
        await faceapi.nets.faceLandmark68Net.loadFromUri('/models/');
        setIsFaceApiLoading(false);
        console.log("[PROCTOR] Face-API models pre-loaded successfully!");
      } catch (err) {
        console.error('Error pre-loading face-api models:', err);
        setIsFaceApiLoading(false);
      }
    }
    preloadModels();
  }, [faceApiLoaded]);

  // Load models and initialize webcam IMMEDIATELY on page load so it is warm and has no startup delay
  useEffect(() => {
    if (!faceApiLoaded) return;
    
    async function startCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: 320, height: 240, facingMode: 'user' }
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        }
      } catch (cErr) {
        console.error('Webcam permission denied or error:', cErr);
        setCameraError(true);
      }
    }
    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [faceApiLoaded]);

  // Face-tracking detection loop active all the time during course learning
  useEffect(() => {
    if (!cameraActive) return;

    let active = true;
    let consecutiveViolations = 0;
    let consecutiveMissing = 0;

    const handleHeadTurnViolation = () => {
      setHeadTurnWarnings(prev => {
        const nextWarnings = prev + 1;
        if (nextWarnings > 2) {
          active = false;
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
          alert('🚨 Assessment Terminated: Multiple head movement / camera violations detected. Your checkpoint score has been recorded as 0 and you are being redirected to the courses catalog.');
          handleSubmitVideoAssessment(0).then(() => {
            router.push('/courses');
          });
        } else {
          setWarningMessage(`⚠️ Proctoring Alert (${nextWarnings}/2): Keep your head straight. Looking away from the screen / turning your head is strictly prohibited. Warning ${nextWarnings} of 2.`);
          setShowWarningModal(true);
        }
        return nextWarnings;
      });
    };

    async function detectionLoop() {
      // @ts-ignore
      const faceapi = window.faceapi;
      if (!faceapi || !videoRef.current || !active || showWarningModal || proctoringCooldown) {
        if (active) setTimeout(detectionLoop, 100);
        return;
      }

      try {
        const detection = await faceapi.detectSingleFace(
          videoRef.current,
          new faceapi.TinyFaceDetectorOptions()
        ).withFaceLandmarks();

        if (detection) {
          consecutiveMissing = 0;
          const landmarks = detection.landmarks.positions;
          const noseX = landmarks[30].x;
          const leftX = landmarks[0].x;
          const rightX = landmarks[16].x;

          const leftDist = noseX - leftX;
          const rightDist = rightX - noseX;

          if (rightDist > 0 && leftDist > 0) {
            const ratio = leftDist / rightDist;
            currentRatioRef.current = ratio; // Update ref for calibration trigger

            // Dynamic check against calibrated baselineRatio (default 1.0)
            if (ratio < baselineRatio - 0.4 || ratio > baselineRatio + 0.6) {
              consecutiveViolations++;
              if (consecutiveViolations >= 2) {
                handleHeadTurnViolation();
                consecutiveViolations = 0;
              }
            } else {
              consecutiveViolations = 0;
            }
          }
        } else {
          // If face is not detected, do absolutely nothing (no alert, only turn head alerts)
          consecutiveViolations = 0;
          consecutiveMissing = 0;
        }
      } catch (err) {
        console.error('Error in face detection loop:', err);
      }

      if (active) {
        setTimeout(detectionLoop, 100);
      }
    }

    detectionLoop();

    return () => {
      active = false;
    };
  }, [cameraActive, showWarningModal, proctoringCooldown, baselineRatio]);

  // Trigger 10-minute assessment intervals (every 600s, with a fast 45s demo checkpoint for initial interaction)
  useEffect(() => {
    if (!isVideoPlaying || showAssessmentModal || assessmentSubmitted) return;

    const timer = setInterval(() => {
      setWatchedSeconds((prev) => {
        const next = prev + 1;
        // Prompt assessment at 10-minute intervals (600s, 1200s...) or 45s for initial live demo validation
        if ((next === 45 || next % 600 === 0) && !showAssessmentModal && !assessmentSubmitted) {
          setShowAssessmentModal(true);
        }
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentLessonIndex, courseId, showAssessmentModal, assessmentSubmitted, isVideoPlaying]);

  // Reset watch timer when lesson changes
  useEffect(() => {
    setWatchedSeconds(0);
    setIsVideoPlaying(false);
  }, [currentLessonIndex, courseId]);

  // ── Expanded per-course question BANK (8 questions per course) ──────────────
  // Each checkpoint draws 2 UNIQUE questions that have not been asked yet this session.
  const videoQuestionBank: Record<string, Array<{ q: string; options: string[]; correct: number; exp: string }>> = {
    'crs_python': [
      { q: 'What happens during dynamic memory assignment for integer objects in Python?', options: ['Allocated on stack with static size', 'Allocated on heap with reference pointers', 'Cached in CPU L1 register', 'Memory cleared immediately'], correct: 1, exp: 'Python allocates objects in the heap and points identifiers to those memory blocks.' },
      { q: 'Which operator performs floor division without floating-point fractions in Python?', options: ['/', '//', '%', '**'], correct: 1, exp: 'The // operator performs floor division, returning the truncated integer quotient.' },
      { q: 'Which Python keyword is used to define a generator function?', options: ['return', 'yield', 'async', 'lambda'], correct: 1, exp: 'yield suspends the function and returns a value, turning it into a generator.' },
      { q: 'What is the time complexity of appending an element to a Python list?', options: ['O(N)', 'O(log N)', 'O(1) amortized', 'O(N²)'], correct: 2, exp: 'List.append() is O(1) amortized because Python over-allocates buffer space.' },
      { q: 'Which built-in Python function returns the memory address of an object?', options: ['addr()', 'ref()', 'id()', 'mem()'], correct: 2, exp: 'id() returns the unique integer identity (memory address) of an object.' },
      { q: 'In Python, which data type is immutable?', options: ['List', 'Dictionary', 'Set', 'Tuple'], correct: 3, exp: 'Tuples cannot be modified after creation, making them immutable.' },
      { q: 'What does the __init__ method in a Python class represent?', options: ['Destructor', 'Class method', 'Constructor / initializer', 'Static factory'], correct: 2, exp: '__init__ is called when an object is instantiated and initializes its attributes.' },
      { q: 'Which Python module provides cryptographically secure random numbers?', options: ['random', 'math', 'secrets', 'hashlib'], correct: 2, exp: 'The secrets module generates cryptographically strong random numbers suitable for tokens and OTPs.' },
    ],
    'crs_cpp': [
      { q: 'What is the primary purpose of RAII in C++?', options: ['Prevent memory leaks via destructor cleanup', 'Speed up compilation', 'Replace standard templates', 'Enable multi-threading'], correct: 0, exp: 'RAII binds resource lifetime to object lifetime, ensuring automatic cleanup when leaving scope.' },
      { q: 'Which smart pointer provides exclusive ownership with zero overhead?', options: ['std::shared_ptr', 'std::weak_ptr', 'std::unique_ptr', 'void*'], correct: 2, exp: 'std::unique_ptr enforces single-owner semantics without reference-counting overhead.' },
      { q: 'What is the time complexity of std::unordered_map lookup on average?', options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'], correct: 2, exp: 'Hash maps provide O(1) average-case lookups via hash bucket addressing.' },
      { q: 'Which C++11 feature allows you to capture local variables in a closure?', options: ['Functor', 'Lambda expression', 'Template specialization', 'Inline function'], correct: 1, exp: 'Lambda expressions can capture surrounding scope variables by value or reference.' },
      { q: 'What does the "virtual" keyword enable in C++ inheritance?', options: ['Static dispatch', 'Runtime polymorphism via vtable', 'Compile-time templates', 'Memory pooling'], correct: 1, exp: 'virtual functions use a vtable for dynamic dispatch at runtime, enabling polymorphism.' },
      { q: 'Which operator is overloaded to enable stream output (e.g., cout)?', options: ['<<', '>>', '+', '=='], correct: 0, exp: 'The << operator is overloaded on ostream to support std::cout << value syntax.' },
      { q: 'What is the role of the "const" qualifier on a member function?', options: ['Makes the function static', 'Prevents modifying member variables', 'Inlines the function', 'Enables operator overloading'], correct: 1, exp: 'A const member function promises not to modify the object\'s state.' },
      { q: 'Which C++ container provides O(1) push and pop from both ends?', options: ['std::vector', 'std::list', 'std::deque', 'std::set'], correct: 2, exp: 'std::deque (double-ended queue) supports O(1) insertion/deletion at both front and back.' },
    ],
    'crs_sql': [
      { q: 'Which clause filters aggregated grouped results in SQL?', options: ['WHERE', 'HAVING', 'GROUP BY', 'ORDER BY'], correct: 1, exp: 'HAVING filters aggregated groups after GROUP BY; WHERE filters individual rows before grouping.' },
      { q: 'What index type is automatically created on primary keys?', options: ['B-Tree / Clustered Index', 'Bitmap Index', 'Hash Index', 'Full-Text Index'], correct: 0, exp: 'Clustered B-Tree indexes are created on primary keys for O(log N) lookup performance.' },
      { q: 'Which JOIN returns all rows from both tables, matched or not?', options: ['INNER JOIN', 'LEFT JOIN', 'RIGHT JOIN', 'FULL OUTER JOIN'], correct: 3, exp: 'FULL OUTER JOIN returns all rows from both tables, with NULLs where no match exists.' },
      { q: 'What does the DISTINCT keyword do in a SELECT statement?', options: ['Sorts results', 'Removes duplicate rows', 'Filters NULLs', 'Groups rows'], correct: 1, exp: 'DISTINCT eliminates duplicate rows from the result set.' },
      { q: 'Which SQL aggregate function counts non-NULL values in a column?', options: ['SUM()', 'AVG()', 'COUNT(column)', 'MAX()'], correct: 2, exp: 'COUNT(column_name) counts only non-NULL values, unlike COUNT(*) which counts all rows.' },
      { q: 'What is a subquery that references the outer query called?', options: ['Nested query', 'Correlated subquery', 'Derived table', 'CTE'], correct: 1, exp: 'A correlated subquery references columns from the outer query and is re-evaluated per row.' },
      { q: 'Which isolation level prevents dirty reads but allows non-repeatable reads?', options: ['READ UNCOMMITTED', 'READ COMMITTED', 'REPEATABLE READ', 'SERIALIZABLE'], correct: 1, exp: 'READ COMMITTED prevents dirty reads but allows non-repeatable reads between transactions.' },
      { q: 'What does the COALESCE() function return?', options: ['The largest value', 'The first non-NULL value', 'The sum of values', 'A random value'], correct: 1, exp: 'COALESCE() returns the first non-NULL argument from its list of arguments.' },
    ],
    'crs_dsa': [
      { q: 'What is the worst-case time complexity of Binary Search?', options: ['O(N)', 'O(log N)', 'O(1)', 'O(N log N)'], correct: 1, exp: 'Binary Search halves the search space each step, giving O(log N) worst-case time.' },
      { q: 'Which data structure operates in First-In-First-Out (FIFO) order?', options: ['Stack', 'Queue', 'Priority Queue', 'Max Heap'], correct: 1, exp: 'A Queue processes elements in FIFO order — first inserted is first removed.' },
      { q: 'What is the average time complexity of inserting into a Hash Table?', options: ['O(N)', 'O(log N)', 'O(1)', 'O(N²)'], correct: 2, exp: 'Hash Tables achieve O(1) average-case insertion via direct hash-bucket addressing.' },
      { q: 'In a Min Heap, where is the smallest element always located?', options: ['Last leaf node', 'Root node', 'Middle node', 'Random position'], correct: 1, exp: 'In a Min Heap, the root always holds the minimum element by the heap property.' },
      { q: 'Which graph traversal algorithm uses a Queue (BFS)?', options: ['Depth-First Search', 'Breadth-First Search', 'Dijkstra\'s Algorithm', 'Kruskal\'s Algorithm'], correct: 1, exp: 'BFS uses a Queue to explore nodes level by level from the source.' },
      { q: 'What is the space complexity of a recursive DFS on a graph with V vertices and E edges?', options: ['O(1)', 'O(V)', 'O(E)', 'O(V + E)'], correct: 1, exp: 'Recursive DFS uses O(V) call stack space in the worst case (deepest path).' },
      { q: 'Which sorting algorithm has O(N log N) worst-case time complexity?', options: ['Bubble Sort', 'Insertion Sort', 'Merge Sort', 'Quick Sort'], correct: 2, exp: 'Merge Sort always divides and merges in O(N log N) regardless of input order.' },
      { q: 'What distinguishes a Doubly Linked List from a Singly Linked List?', options: ['It uses arrays internally', 'Each node has pointers to both next and previous nodes', 'It supports O(1) random access', 'It is always sorted'], correct: 1, exp: 'A Doubly Linked List stores both next and previous pointers, enabling bidirectional traversal.' },
    ],
    'crs_java': [
      { q: 'What does the "final" keyword on a Java class mean?', options: ['The class is abstract', 'The class cannot be subclassed', 'All methods are static', 'The class is serializable'], correct: 1, exp: 'A final class cannot be extended — it prevents inheritance.' },
      { q: 'Which Java collection maintains insertion order and allows duplicates?', options: ['HashSet', 'TreeSet', 'ArrayList', 'HashMap'], correct: 2, exp: 'ArrayList is an ordered, index-based list that allows duplicate elements.' },
      { q: 'What is the purpose of the "synchronized" keyword in Java?', options: ['Speeds up execution', 'Prevents multiple threads from entering a block simultaneously', 'Marks a method as deprecated', 'Enables reflection'], correct: 1, exp: 'synchronized ensures only one thread executes the block at a time, preventing race conditions.' },
      { q: 'Which interface must a class implement to be usable in a for-each loop?', options: ['Runnable', 'Comparable', 'Iterable', 'Serializable'], correct: 2, exp: 'The Iterable interface provides the iterator() method required for enhanced for-each loops.' },
      { q: 'What does the Java Virtual Machine (JVM) use to manage object lifecycle?', options: ['Manual malloc/free', 'Garbage Collector', 'Stack allocator', 'Reference counter'], correct: 1, exp: 'The JVM\'s Garbage Collector automatically reclaims memory from unreachable objects.' },
      { q: 'Which Java keyword prevents a variable from being modified after initialization?', options: ['static', 'volatile', 'final', 'transient'], correct: 2, exp: 'A final variable can only be assigned once; attempting to reassign it causes a compile error.' },
      { q: 'What is the default value of an uninitialized int field in a Java class?', options: ['null', '-1', '0', 'undefined'], correct: 2, exp: 'Uninitialized numeric fields in Java default to 0 (or 0.0 for floats/doubles).' },
      { q: 'Which Java 8 feature allows passing behavior as a method argument?', options: ['Generics', 'Lambda expressions', 'Annotations', 'Reflection'], correct: 1, exp: 'Lambda expressions implement functional interfaces, enabling behavior to be passed as arguments.' },
    ],
    'crs_git': [
      { q: 'What does "git rebase" do compared to "git merge"?', options: ['Creates a merge commit', 'Rewrites commit history for a linear timeline', 'Deletes remote branches', 'Stashes changes'], correct: 1, exp: 'Rebase replays commits onto a new base, producing a cleaner linear history without merge commits.' },
      { q: 'Which git command saves uncommitted changes temporarily?', options: ['git commit -m', 'git stash', 'git reset', 'git cherry-pick'], correct: 1, exp: 'git stash saves the working directory state so you can switch branches cleanly.' },
      { q: 'What does HEAD refer to in a git repository?', options: ['The first commit', 'The current checked-out commit or branch tip', 'The remote origin', 'The staged area'], correct: 1, exp: 'HEAD points to the currently checked-out commit (or branch tip you\'re working on).' },
      { q: 'Which command creates a new branch and switches to it in one step?', options: ['git branch new-branch', 'git checkout -b new-branch', 'git merge new-branch', 'git pull new-branch'], correct: 1, exp: 'git checkout -b creates and immediately switches to the new branch.' },
      { q: 'What does "git cherry-pick <commit>" do?', options: ['Deletes a commit', 'Applies a specific commit onto the current branch', 'Merges two branches', 'Rebases the entire branch'], correct: 1, exp: 'cherry-pick applies changes from a specific commit onto the current branch.' },
      { q: 'What is the purpose of a .gitignore file?', options: ['Lists collaborators', 'Specifies files and directories Git should not track', 'Defines merge strategies', 'Stores SSH keys'], correct: 1, exp: '.gitignore tells Git which files/directories to exclude from version control.' },
      { q: 'Which git command shows the commit history in a condensed one-line format?', options: ['git log --oneline', 'git status', 'git diff HEAD', 'git show'], correct: 0, exp: 'git log --oneline displays each commit as a single line: short hash + message.' },
      { q: 'What does "git fetch" do differently from "git pull"?', options: ['Pushes local changes', 'Downloads remote changes without merging them', 'Deletes local branches', 'Rebases automatically'], correct: 1, exp: 'git fetch downloads remote updates into remote-tracking branches without modifying your working branch.' },
    ],
    'crs_cloud': [
      { q: 'What does Amazon EC2 primarily provide?', options: ['Object storage', 'Scalable virtual servers in the cloud', 'DNS routing', 'CDN caching'], correct: 1, exp: 'EC2 (Elastic Compute Cloud) provides resizable virtual machines (instances) on AWS.' },
      { q: 'Which AWS service stores objects like images and files with 11 nines of durability?', options: ['EBS', 'RDS', 'S3', 'Glacier'], correct: 2, exp: 'Amazon S3 provides 99.999999999% (11 nines) durability for stored objects.' },
      { q: 'What is the primary purpose of AWS IAM?', options: ['Load balancing', 'Managing user access and permissions', 'Monitoring metrics', 'Database replication'], correct: 1, exp: 'IAM (Identity and Access Management) controls who can access which AWS services and resources.' },
      { q: 'Which AWS service runs code without provisioning servers?', options: ['EC2', 'ECS', 'Lambda', 'Elastic Beanstalk'], correct: 2, exp: 'AWS Lambda is serverless — it runs your code in response to events without managing servers.' },
      { q: 'What does a VPC (Virtual Private Cloud) provide?', options: ['Global CDN', 'Isolated virtual network in the cloud', 'Managed database', 'Email delivery'], correct: 1, exp: 'A VPC gives you a logically isolated section of AWS where you control the network configuration.' },
      { q: 'Which AWS service provides managed relational databases?', options: ['DynamoDB', 'ElastiCache', 'RDS', 'Redshift'], correct: 2, exp: 'RDS (Relational Database Service) manages MySQL, PostgreSQL, Oracle, and other relational databases.' },
      { q: 'What is the primary benefit of Auto Scaling in AWS?', options: ['Reduces latency via CDN', 'Automatically adjusts capacity based on demand', 'Encrypts data at rest', 'Manages DNS records'], correct: 1, exp: 'Auto Scaling adds or removes EC2 instances automatically based on load, optimizing cost and performance.' },
      { q: 'Which model in cloud computing provides the highest level of abstraction?', options: ['IaaS', 'PaaS', 'SaaS', 'FaaS'], correct: 2, exp: 'SaaS (Software as a Service) delivers fully managed applications — the highest abstraction level.' },
    ],
    'crs_oop': [
      { q: 'Which OOP principle hides internal implementation details from outside classes?', options: ['Inheritance', 'Polymorphism', 'Encapsulation', 'Abstraction'], correct: 2, exp: 'Encapsulation bundles data and methods, restricting direct access via access modifiers.' },
      { q: 'What does method overriding enable in OOP?', options: ['Creating new methods in a subclass', 'Changing the behavior of a parent class method in a subclass', 'Hiding member variables', 'Multiple inheritance'], correct: 1, exp: 'Method overriding allows a subclass to provide its own implementation of a parent class method.' },
      { q: 'Which principle states a class should have only one reason to change?', options: ['Open/Closed Principle', 'Liskov Substitution Principle', 'Single Responsibility Principle', 'Dependency Inversion'], correct: 2, exp: 'SRP (Single Responsibility Principle) means each class should have one, and only one, responsibility.' },
      { q: 'What is the Liskov Substitution Principle?', options: ['Subclasses can be used anywhere their parent class is expected', 'Classes should depend on abstractions', 'Modules should be open for extension', 'Interfaces should be segregated'], correct: 0, exp: 'LSP states that objects of a subclass should be replaceable with objects of the parent class.' },
      { q: 'Which design pattern ensures only one instance of a class exists?', options: ['Factory', 'Observer', 'Singleton', 'Strategy'], correct: 2, exp: 'The Singleton pattern restricts instantiation to a single global instance.' },
      { q: 'What is an abstract class in OOP?', options: ['A class with no methods', 'A class that cannot be instantiated and may have abstract methods', 'A class with only static methods', 'A final class'], correct: 1, exp: 'An abstract class cannot be instantiated directly and can define abstract methods for subclasses to implement.' },
      { q: 'Which OOP concept allows a single interface to represent different underlying types?', options: ['Encapsulation', 'Inheritance', 'Polymorphism', 'Composition'], correct: 2, exp: 'Polymorphism allows objects of different types to be treated as objects of a common supertype.' },
      { q: 'What does "composition over inheritance" mean?', options: ['Avoid using classes', 'Prefer building complex behavior by combining objects rather than subclassing', 'Use static methods only', 'Avoid interfaces'], correct: 1, exp: 'Composition builds flexible systems by composing objects with specific behaviors instead of deep inheritance chains.' },
    ],
    'crs_aptitude': [
      { q: 'If A can do a job in 12 days and B in 18 days, how many days to finish together?', options: ['6 days', '7.2 days', '8 days', '9 days'], correct: 1, exp: 'Combined rate = 1/12 + 1/18 = 5/36 per day. Days = 36/5 = 7.2 days.' },
      { q: 'A train 150m long passes a pole in 15 seconds. What is its speed in km/h?', options: ['36 km/h', '54 km/h', '72 km/h', '90 km/h'], correct: 0, exp: 'Speed = 150/15 = 10 m/s = 10 × 3.6 = 36 km/h.' },
      { q: 'What is the probability of getting a head when flipping a fair coin?', options: ['1/4', '1/3', '1/2', '2/3'], correct: 2, exp: 'A fair coin has 2 equally likely outcomes; P(head) = 1/2.' },
      { q: 'In how many ways can 4 people be arranged in a row?', options: ['12', '16', '24', '48'], correct: 2, exp: '4! = 4 × 3 × 2 × 1 = 24 arrangements.' },
      { q: 'If 15% of a number is 45, what is the number?', options: ['200', '250', '300', '350'], correct: 2, exp: 'Number = (45 / 15) × 100 = 300.' },
      { q: 'A shopkeeper sells at 20% profit. If cost is ₹500, what is the selling price?', options: ['₹550', '₹580', '₹600', '₹620'], correct: 2, exp: 'Selling price = 500 + (20% × 500) = 500 + 100 = ₹600.' },
      { q: 'What is the next number in the series: 2, 6, 12, 20, 30, ?', options: ['38', '40', '42', '44'], correct: 2, exp: 'Differences are 4, 6, 8, 10, 12 — so next term = 30 + 12 = 42.' },
      { q: 'If MANGO is coded as 13-1-14-7-15, what is the code for CAT?', options: ['3-1-20', '5-2-22', '3-2-19', '4-1-21'], correct: 0, exp: 'Position in alphabet: C=3, A=1, T=20 → 3-1-20.' },
    ],
    'crs_interview': [
      { q: 'What is the STAR method used for in interviews?', options: ['Salary negotiation', 'Structuring behavioral answers (Situation, Task, Action, Result)', 'System design', 'Code review'], correct: 1, exp: 'STAR helps structure behavioral answers: describe the Situation, Task, Action taken, and Result achieved.' },
      { q: 'Which system design component handles routing requests to multiple servers?', options: ['Database', 'Load Balancer', 'CDN', 'Cache'], correct: 1, exp: 'A Load Balancer distributes incoming traffic across multiple servers to ensure availability and performance.' },
      { q: 'What does Big-O notation measure?', options: ['Memory usage only', 'Code style quality', 'Algorithm efficiency (time/space) as input grows', 'Number of lines of code'], correct: 2, exp: 'Big-O describes how an algorithm\'s time or space requirements scale with input size.' },
      { q: 'In a technical interview, what should you do before writing code?', options: ['Start coding immediately', 'Clarify requirements and discuss approach', 'Ask for the answer', 'Run test cases blindly'], correct: 1, exp: 'Clarifying the problem and discussing your approach shows communication skills and avoids wasted effort.' },
      { q: 'What is a "tell me about yourself" answer best structured as?', options: ['Your childhood story', 'Present-Past-Future: current role, background, goals', 'A list of hobbies', 'Technical certifications only'], correct: 1, exp: 'Present-Past-Future: start with your current role, cover relevant background, then state your goals.' },
      { q: 'What does CAP theorem state about distributed systems?', options: ['You can have all three: Consistency, Availability, Partition Tolerance', 'You can only guarantee two of three: Consistency, Availability, Partition Tolerance', 'Distributed systems are always consistent', 'Partition tolerance is optional'], correct: 1, exp: 'CAP theorem states a distributed system can guarantee at most two of: Consistency, Availability, Partition Tolerance.' },
      { q: 'Which data structure is best for implementing an LRU (Least Recently Used) cache?', options: ['Array', 'Stack', 'HashMap + Doubly Linked List', 'Binary Tree'], correct: 2, exp: 'An LRU cache uses a HashMap for O(1) lookups combined with a Doubly Linked List for O(1) order updates.' },
      { q: 'What is the best way to handle a question you do not know in an interview?', options: ['Guess randomly', 'Stay silent', 'Acknowledge it, reason through what you do know, ask clarifying questions', 'End the interview'], correct: 2, exp: 'Thinking aloud about related concepts shows problem-solving ability even when you don\'t know the exact answer.' },
    ],
  };

  // ── Per-session used-question tracker (resets per lesson, persists across checkpoints) ──
  const [usedQuestionIndices, setUsedQuestionIndices] = useState<number[]>([]);

  // Pick 2 unique questions for this checkpoint based on checkpoint number & used history
  const pickCheckpointQuestions = (bank: typeof videoQuestionBank[string], checkpoint: number) => {
    const totalQ = bank.length;
    const available = Array.from({ length: totalQ }, (_, i) => i).filter(i => !usedQuestionIndices.includes(i));
    // If all used, reset pool (cycle through again)
    const pool = available.length >= 2 ? available : Array.from({ length: totalQ }, (_, i) => i);
    // Deterministic shuffle using checkpoint as seed (so same checkpoint = same pair on re-render)
    const shuffled = [...pool].sort((a, b) => {
      const hashA = (a * 2654435761 + checkpoint * 40503) >>> 0;
      const hashB = (b * 2654435761 + checkpoint * 40503) >>> 0;
      return hashA - hashB;
    });
    return { q1: bank[shuffled[0]], q2: bank[shuffled[1]], indices: [shuffled[0], shuffled[1]] };
  };

  const currentBank = videoQuestionBank[courseId] || videoQuestionBank['crs_python'];
  const { q1: activeQ1, q2: activeQ2, indices: activeIndices } = pickCheckpointQuestions(currentBank, assessmentCheckpoint);
  const activeVideoQuiz = { q1: activeQ1, q2: activeQ2 };

  const handleCalibrateCamera = () => {
    setBaselineRatio(currentRatioRef.current);
    alert(`🎯 Webcam Calibrated! Baseline center ratio set to ${currentRatioRef.current.toFixed(2)}. Tracking thresholds: ${(currentRatioRef.current - 0.4).toFixed(2)} - ${(currentRatioRef.current + 0.6).toFixed(2)}.`);
  };

  const handleSubmitVideoAssessment = async (forcedScore?: number) => {
    const isForced = forcedScore !== undefined;
    if (!isForced && (q1Answer === null || q2Answer === null)) return;
    
    let score = 0;
    if (!isForced) {
      if (q1Answer === activeVideoQuiz.q1.correct) score += 50;
      if (q2Answer === activeVideoQuiz.q2.correct) score += 50;
    } else {
      score = forcedScore;
    }
    
    setEarnedScore(score);
    setAssessmentSubmitted(true);
    setOverallAssessmentScore((prev) => prev + score);

    // Mark these question indices as used so next checkpoint gets fresh questions
    setUsedQuestionIndices((prev) => [...prev, ...activeIndices]);

    // Save assessment checkpoint to database and boost overall student placement readiness
    try {
      await fetch(`/api/courses/${courseId}/lessons/${currentLesson?.id || 'les_1'}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          status: 'in_progress',
          assessmentScore: score,
          checkpoint: assessmentCheckpoint
        })
      });
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    async function loadCoursePlayer() {
      setLoading(true);
      try {
        const res = await fetch(`/api/courses/${courseId}`);
        const data = await res.json();
        if (data.course) {
          setCourse(data.course);
          setModules(data.modules || []);
          setLessons(data.lessons || []);
          if (data.associatedAssessment) {
            setAssociatedAssessment(data.associatedAssessment);
          }

          // Load completed lesson progress
          if (data.progress) {
            const completed = data.progress
              .filter((p: any) => p.status === 'completed')
              .map((p: any) => p.lessonId);
            setCompletedLessonIds(completed);
          }
        }
      } catch (err) {
        console.error('Error loading course player:', err);
      } finally {
        setLoading(false);
      }
    }

    if (courseId) loadCoursePlayer();
  }, [courseId]);

  const currentLesson = lessons[currentLessonIndex] || {
    id: 'les_py_1_1',
    title: 'Python Variables & Memory Allocation',
    durationMinutes: 20,
    videoDuration: '18:42',
    contentMarkdown: '# Python Core Fundamentals\n\nVariables are references to allocated objects in memory...',
    notesMarkdown: '## Summary Notes\n- Dynamic Typing: No type declarations required\n- Mutable vs Immutable Objects\n- Time complexity of operations: O(1) assignments',
    practiceTask: 'Declare three variables representing job name, salary, and score. Print them using formatted strings.',
    checkQuestion: {
      question: 'Which of the following data types in Python is mutable?',
      options: ['Tuple', 'String', 'List', 'Integer'],
      correctIndex: 2,
      explanation: 'Lists can be mutated in-place with .append() or index assignments without changing memory address.'
    }
  };

  const REQUIRED_WATCH_SECONDS = 30;
  const isCurrentCompleted = completedLessonIds.includes(currentLesson?.id);
  const isVideoWatchRequirementMet = isCurrentCompleted || watchedSeconds >= REQUIRED_WATCH_SECONDS;
  const remainingSeconds = Math.max(0, REQUIRED_WATCH_SECONDS - watchedSeconds);

  const handleMarkCompleted = async () => {
    if (!currentLesson) return;
    const isAlreadyCompleted = completedLessonIds.includes(currentLesson.id);

    try {
      await fetch(`/api/courses/${courseId}/lessons/${currentLesson.id}/progress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          status: 'completed',
          lessonId: currentLesson.id
        })
      });

      if (!isAlreadyCompleted) {
        setCompletedLessonIds([...completedLessonIds, currentLesson.id]);
      }

      // Auto advance to next lesson if available
      if (currentLessonIndex < lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
        setSelectedOption(null);
        setQuizFeedback(null);
        setWatchedSeconds(0);
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !currentLesson.checkQuestion) return;
    if (selectedOption === currentLesson.checkQuestion.correctIndex) {
      setQuizFeedback('🎉 Correct! ' + currentLesson.checkQuestion.explanation);
    } else {
      setQuizFeedback('❌ Incorrect. Hint: ' + currentLesson.checkQuestion.explanation);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">Initializing video player and course modules...</p>
        </div>
      </div>
    );
  }

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessonIds.length / lessons.length) * 100)
    : 42;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      
      {/* ========================================================================= */}
      {/* 🌟 1. PLAYER TOP NAVBAR                                                    */}
      {/* ========================================================================= */}
      <header className="h-16 bg-slate-900/90 backdrop-blur border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link
            href={`/courses/${courseId}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </Link>
          <div className="space-y-0.5">
            <h1 className="text-sm sm:text-base font-black text-white line-clamp-1">
              {course?.title || 'Skill2Hire Video Course'}
            </h1>
            <div className="text-[11px] text-cyan-400 font-mono">
              Lesson {currentLessonIndex + 1} of {lessons.length || 1} • {currentLesson?.title}
            </div>
          </div>
        </div>

        {/* Progress & Assessment button */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400">Progress:</span>
            <div className="w-24 h-2 rounded-full bg-slate-800 overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full transition-all" style={{ width: `${progressPercent}%` }} />
            </div>
            <span className="text-xs font-bold text-cyan-400">{progressPercent}%</span>
          </div>

          <Link
            href={`/assessments/${associatedAssessment?.id || 'asm_python'}`}
            className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all"
          >
            <Award className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Take Assessment</span>
            <span className="sm:hidden">Test</span>
          </Link>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🎬 2. MAIN PLAYER BODY & SIDEBAR                                           */}
      {/* ========================================================================= */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 overflow-hidden">
        
        {/* Left 3 Cols: Video Stage & Interactive Tabs */}
        <div className="lg:col-span-3 p-4 sm:p-6 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          
          {/* Video Stage Frame */}
          <div className="rounded-3xl bg-black border border-slate-800 overflow-hidden shadow-2xl relative aspect-video flex items-center justify-center">
            {/* Real embedded YouTube Educational video player matched specifically per course and lesson */}
            {(() => {
              // Video mappings matched per course and lesson ID
              const courseVideoMap: Record<string, string[]> = {
                // Python: Core Syntax, Data Types, Control Flow, Functions, OOP, Interview Practice
                'crs_python': ['kqtD5dpn9C8', 'DWgzHbcastg', 'rfscVS0vtbw', '8DvywoWvM8I', 'Ej_02ICOIgs', 'HGOBQPFzWKo'],
                // C++: Systems, Memory, Pointers, OOP, STL, Performance
                'crs_cpp': ['vLnPwxZdW4Y', '18c3MTX0PK0', '_bYFu9mBnr4', 'i_Iq4_Kd7rc', 'ltKXWn64j18', 'Rub-JSjMhWY'],
                // Java: Core, JVM Internals, OOP, Collections, Multithreading, Enterprise
                'crs_java': ['A74TOX803D0', 'eIrMbAQSU34', 'grEKMHGYyns', 'GoXwIVyNvX0', 'r59xYe3Vyks', 'BGTx91t8q50'],
                // Data Structures & Algorithms: Arrays, Linked Lists, Trees, Graphs, DP, Sorting
                'crs_dsa': ['8hly31xKli0', 'RBSGKlAnoiM', 'BBpAmxU_NQo', 't0Cq6tVNRBA', 'Hdr64lKQ3e4', 'oBt53YbR9Kk'],
                // SQL & Relational Databases: SELECT, JOINs, Group By, Indexes, Normalization, ACID
                'crs_sql': ['HXV3zeRR3h4', '7S_tz1z_5bA', 'p3qvj9hO_Bo', 'ztHopE5Wnpc', 'Cz3WcZlrprg', 'BPHAr4QGGVE'],
                // Git & GitHub: Init, Commit, Branching, Merge, Rebase, PR Reviews, Actions
                'crs_git': ['RGOj5yH7evk', '8JJ101D3knE', 'usSGSF_v1mE', 'DVRQwsm_Z5E', 'R_MwnP1c5o0', 'w3jLJU7DT5E'],
                // OOP & Clean Architecture: SOLID Principles, Factory, Singleton, Observer, Refactoring
                'crs_oop': ['pTB0EiLXUC8', 'v9ejT8FO-7I', 'FLmBqI3IKMA', 'tv-_1er1mWI', 't1UuPz0yqX4', 'tAs9p1bJqJ4'],
                // AWS & Cloud: Cloud Concepts, EC2, S3, IAM, Serverless Lambda, VPC, RDS
                'crs_cloud': ['3hLmDS179YE', 'Ia-UEYYR44s', 'k1RI5locZE4', 'r4YIdn2OH14', '9x_Hwk9LwV4', 'ulprqHHWlng'],
                // Quantitative Aptitude: Time & Work, Speed, Probability, Permutations, Logical Puzzles
                'crs_aptitude': ['s1oXfQ9N3kI', 'Z9dD4Hk1aV8', 'M4v_n0Zz_8g', 'x0FhJm5jYwU', '7u-n48sR0mQ', 'b5oB8yX9bKg'],
                // Technical Interview & System Design: Behavioral, Mock Interviews, Architecture, Resume Defense
                'crs_interview': ['123', 'i0v_7k_Z1zE', 'xpDnVSmNFX0', 'UzLMhqg3_Wc', 'F0l2hL3q97w', 'M7870nbqE8o']
              };

              // Fallback per-course default videos
              const courseDefaults: Record<string, string> = {
                'crs_python': 'kqtD5dpn9C8',
                'crs_cpp': 'vLnPwxZdW4Y',
                'crs_java': 'A74TOX803D0',
                'crs_dsa': '8hly31xKli0',
                'crs_sql': 'HXV3zeRR3h4',
                'crs_git': 'RGOj5yH7evk',
                'crs_oop': 'pTB0EiLXUC8',
                'crs_cloud': '3hLmDS179YE',
                'crs_aptitude': 's1oXfQ9N3kI',
                'crs_interview': 'xpDnVSmNFX0'
              };

              const courseList = courseVideoMap[courseId] || [];
              const lessonIdx = currentLessonIndex % (courseList.length || 1);
              const vidId = courseList[lessonIdx] || courseDefaults[courseId] || 'kqtD5dpn9C8';

              return (
                <iframe
                  ref={ytIframeRef}
                  key={vidId}
                  className="w-full h-full border-0"
                  // enablejsapi=1 enables postMessage pause/resume; controls=0 removes scrubber
                  src={`https://www.youtube-nocookie.com/embed/${vidId}?autoplay=0&controls=0&disablekb=1&rel=0&modestbranding=1&fs=0&enablejsapi=1&wmode=transparent&origin=${typeof window !== 'undefined' ? encodeURIComponent(window.location.origin) : ''}`}
                  title={currentLesson?.title || 'Course Lesson Video'}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                />
              );
            })()}
          </div>

          {/* Custom Video Control & Simulation Telemetry Bar */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => {
                  if (isVideoPlaying) {
                    ytCommand('pauseVideo');
                    setIsVideoPlaying(false);
                  } else {
                    ytCommand('playVideo');
                    setIsVideoPlaying(true);
                  }
                }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 ${
                  isVideoPlaying
                    ? 'bg-amber-600 hover:bg-amber-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isVideoPlaying ? 'Pause Video' : 'Play Video'}
              </button>

              <div className="flex items-center space-x-2">
                <span className={`w-2 h-2 rounded-full ${isVideoPlaying ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`} />
                <span className="text-xs text-slate-300 font-medium">
                  {isVideoPlaying ? 'Playing (Timer Accumulating)' : 'Paused (Timer Frozen)'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-4 text-xs font-mono text-slate-400">
              <div>
                Watched Time: <strong className="text-white">{watchedSeconds}s</strong>
              </div>
              <div className="text-slate-500">|</div>
              <div>
                Next Checkpoint: <strong className="text-cyan-400">{watchedSeconds < 45 ? '45s' : `${Math.ceil(watchedSeconds / 600) * 600}s`}</strong>
              </div>
            </div>
          </div>

          {/* Lesson Navigation Action Bar */}
          <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (currentLessonIndex > 0) {
                    setCurrentLessonIndex(currentLessonIndex - 1);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }
                }}
                disabled={currentLessonIndex === 0}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous Lesson</span>
              </button>

              <button
                onClick={() => {
                  if (currentLessonIndex < lessons.length - 1) {
                    setCurrentLessonIndex(currentLessonIndex + 1);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }
                }}
                disabled={currentLessonIndex === lessons.length - 1}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-colors shadow-md shadow-cyan-500/20"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono hidden sm:block">
              Lesson {currentLessonIndex + 1} of {lessons.length || 1}
            </div>
          </div>

          {/* Interactive Study Materials & Knowledge Hub Tabs */}
          {(() => {
            const courseMaterial = COURSE_STUDY_MATERIALS[courseId] || COURSE_STUDY_MATERIALS['crs_python'];

            return (
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
                  {[
                    { id: 'cheatsheet', label: 'Cheatsheet & Syntax', icon: FileText },
                    { id: 'diagrams', label: 'Flowcharts & Architecture', icon: GitBranch },
                    { id: 'video', label: 'Lesson Notes', icon: BookOpen },
                    { id: 'practice', label: 'Practice Quiz', icon: Code2 },
                    { id: 'resources', label: 'Study Resources', icon: Download }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-3.5 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-colors shrink-0 ${
                          isActive
                            ? 'bg-slate-800 text-cyan-300 border border-slate-700 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        <Icon className="w-3.5 h-3.5" />
                        <span>{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Tab 1: High-Yield Cheatsheet & Key Syntax */}
                {activeTab === 'cheatsheet' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base font-black text-white">{courseMaterial.courseTitle} — Master Cheatsheet</h3>
                        <p className="text-xs text-slate-400">{courseMaterial.cheatsheet.summary}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                        {courseMaterial.category}
                      </span>
                    </div>

                    {/* Key Syntax Code Snippets */}
                    <div className="space-y-4">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">High-Yield Syntax & Idioms</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {courseMaterial.cheatsheet.keySyntax.map((item, idx) => (
                          <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                            <div className="text-xs font-bold text-white flex items-center justify-between">
                              <span>{item.title}</span>
                              <span className="text-[10px] font-mono text-emerald-400">O(N) / Best Practice</span>
                            </div>
                            <pre className="p-3 bg-slate-900/80 rounded-xl font-mono text-xs text-cyan-300 overflow-x-auto">
                              <code>{item.code}</code>
                            </pre>
                            <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Placement Interview Tips */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/40 to-slate-950 border border-amber-500/30 space-y-2">
                      <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Crucial Placement Interview Key Takeaways</span>
                      </h4>
                      <ul className="space-y-1.5 text-xs text-slate-300 list-disc list-inside">
                        {courseMaterial.cheatsheet.placementTips.map((tip, idx) => (
                          <li key={idx} className="leading-relaxed">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Curriculum Mindmap */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Topic Dependency Mindmap</h4>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {courseMaterial.mindmap.map((m, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-mono text-slate-300">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Tab 2: Flowcharts & Architectural Diagrams */}
                {activeTab === 'diagrams' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-base font-black text-white">{courseMaterial.diagram.title}</h3>
                      <p className="text-xs text-slate-400">Visual architectural representation and execution flow model.</p>
                    </div>

                    {/* ASCII Architectural Diagram Frame */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 font-mono text-xs text-cyan-300 overflow-x-auto shadow-xl">
                      <pre className="leading-tight">
                        {courseMaterial.diagram.asciiChart}
                      </pre>
                    </div>

                    {/* Diagram Technical Explanation */}
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Architectural Flow Explanation</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {courseMaterial.diagram.flowExplanation}
                      </p>
                    </div>
                  </div>
                )}

                {/* Tab 3: In-Depth Video Lesson Notes */}
                {activeTab === 'video' && (() => {
                  const courseNotesList = DETAILED_COURSE_NOTES[courseId] || DETAILED_COURSE_NOTES['crs_python'];
                  const noteIdx = currentLessonIndex % (courseNotesList.length || 1);
                  const activeNote = courseNotesList[noteIdx] || courseNotesList[0];

                  return (
                    <div className="space-y-6 text-slate-200">
                      {/* Header with Video Timestamp */}
                      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                        <div>
                          <h3 className="text-base font-black text-white">{activeNote.lessonTitle}</h3>
                          <span className="text-xs text-cyan-400 font-mono flex items-center gap-1.5 pt-0.5">
                            <Clock className="w-3.5 h-3.5" /> Video Timestamp: {activeNote.videoTimestamp}
                          </span>
                        </div>
                        <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          Video Analyzed Notes ✓
                        </span>
                      </div>

                      {/* Core Concepts Bullet Checklist */}
                      <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400">Core Concepts Taught in Video</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {activeNote.coreConcepts.map((concept, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span>{concept}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* In-Depth Theoretical Analysis */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-white">Comprehensive Theory & Architecture</h4>
                        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                          {activeNote.inDepthTheory}
                        </p>
                      </div>

                      {/* Video Code Breakdown */}
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Video Code Implementation & Breakdown</h4>
                        <pre className="p-4 bg-slate-900/90 rounded-xl font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800">
                          <code>{activeNote.codeBreakdown.snippet}</code>
                        </pre>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          💡 <strong>Analysis:</strong> {activeNote.codeBreakdown.explanation}
                        </p>
                      </div>

                      {/* Top Interview Questions Derived from Video */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400">Common Interview Questions from this Video</h4>
                        <div className="space-y-3">
                          {activeNote.interviewQnA.map((item, idx) => (
                            <div key={idx} className="p-4 rounded-2xl bg-slate-950 border border-purple-900/40 space-y-2">
                              <p className="text-xs font-bold text-white flex items-start gap-2">
                                <span className="text-purple-400 font-mono">Q{idx + 1}:</span>
                                <span>{item.question}</span>
                              </p>
                              <p className="text-xs text-slate-300 leading-relaxed pl-6">
                                <strong>Answer:</strong> {item.answer}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Takeaways */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-slate-950 border border-cyan-500/30 space-y-2">
                        <h4 className="text-xs font-black text-cyan-300 uppercase tracking-wider">Crucial Key Takeaways</h4>
                        <ul className="list-disc list-inside text-xs text-slate-300 space-y-1">
                          {activeNote.keyTakeaways.map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })()}

                {/* Tab 4: Practice Check Question */}
                {activeTab === 'practice' && (
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-white">Placement Quick Check</h3>
                    {currentLesson?.checkQuestion ? (
                      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4">
                        <p className="text-xs sm:text-sm font-bold text-white">
                          {currentLesson.checkQuestion.question}
                        </p>

                        <div className="space-y-2">
                          {currentLesson.checkQuestion.options.map((opt: string, idx: number) => (
                            <button
                              key={idx}
                              onClick={() => setSelectedOption(idx)}
                              className={`w-full p-3 rounded-xl text-left text-xs font-semibold border transition-all ${
                                selectedOption === idx
                                  ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
                              }`}
                            >
                              {String.fromCharCode(65 + idx)}. {opt}
                            </button>
                          ))}
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <button
                            onClick={handleQuizSubmit}
                            disabled={selectedOption === null}
                            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-black text-xs transition-colors"
                          >
                            Submit Check Answer
                          </button>
                          {quizFeedback && (
                            <span className="text-xs font-bold text-slate-200">
                              {quizFeedback}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400">No question for this lesson.</p>
                    )}
                  </div>
                )}

                {/* Tab 5: Downloadable Resources */}
                {activeTab === 'resources' && (
                  <div className="space-y-3">
                    <h3 className="text-base font-black text-white">Downloadable Study Materials</h3>
                    <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <div className="space-y-0.5">
                        <div className="text-xs font-black text-white">{courseMaterial.courseTitle} Official Study Guide (PDF)</div>
                        <div className="text-[10px] text-slate-500">Includes complete syntax reference, memory diagrams, and 50+ interview questions</div>
                      </div>
                      <a
                        href={`data:text/plain;charset=utf-8,${encodeURIComponent(`${courseMaterial.courseTitle}\n\n${courseMaterial.cheatsheet.summary}\n\nDIAGRAM:\n${courseMaterial.diagram.asciiChart}`)}`}
                        download={`${courseId}_study_guide.txt`}
                        className="px-3.5 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md transition-colors"
                      >
                        <Download className="w-3.5 h-3.5" /> Download Guide
                      </a>
                    </div>
                  </div>
                )}

              </div>
            );
          })()}
        </div>

        {/* ========================================================================= */}
        {/* 📋 3. RIGHT SIDEBAR: COURSE MODULES & LESSON CHECKLIST                    */}
        {/* ========================================================================= */}
        <div className="p-4 sm:p-6 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 space-y-6 overflow-y-auto max-h-[calc(100vh-4rem)]">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-400">Course Curriculum</h3>
            <p className="text-xs text-slate-500">{lessons.length} lessons • {modules.length || 7} modules</p>
          </div>

          <div className="space-y-4">
            {lessons.map((les: any, idx: number) => {
              const isCurrent = currentLessonIndex === idx;
              const isCompleted = completedLessonIds.includes(les.id);

              return (
                <button
                  key={les.id}
                  onClick={() => {
                    setCurrentLessonIndex(idx);
                    setSelectedOption(null);
                    setQuizFeedback(null);
                  }}
                  className={`w-full p-3.5 rounded-2xl text-left border transition-all flex items-start gap-3 ${
                    isCurrent
                      ? 'bg-slate-800 border-cyan-400 ring-1 ring-cyan-400/30'
                      : isCompleted
                      ? 'bg-slate-950/60 border-slate-800/80 text-slate-400'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="mt-0.5 shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : isCurrent ? (
                      <PlayCircle className="w-4 h-4 text-cyan-400" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-bold text-slate-500">
                        {idx + 1}
                      </div>
                    )}
                  </div>

                  <div className="space-y-0.5">
                    <h4 className={`text-xs font-bold line-clamp-2 ${isCurrent ? 'text-white font-black' : ''}`}>
                      {les.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {les.videoDuration || '15:00'} • Module {Math.floor(idx / 3) + 1}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* End of Course Assessment Banner */}
          <div className="p-5 rounded-2xl bg-gradient-to-br from-purple-950 to-indigo-950 border border-purple-800/60 space-y-3 text-center">
            <Award className="w-7 h-7 text-purple-400 mx-auto" />
            <div className="space-y-1">
              <h4 className="font-black text-xs text-white">Final Skill Verification</h4>
              <p className="text-[10px] text-purple-300">
                Score $\ge 70\%$ to verify this skill on your official Skill Passport.
              </p>
            </div>
            <Link
              href={`/assessments/${associatedAssessment?.id || 'asm_python'}`}
              className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs flex items-center justify-center gap-1 shadow-md shadow-purple-600/25 transition-all"
            >
              <span>Take Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

      {/* ========================================================================= */}
      {/* 🧠 10-MINUTE IN-VIDEO LIVE ASSESSMENT POPUP MODAL                          */}
      {/* ========================================================================= */}
      {showAssessmentModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-200">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-black text-white">
                    10-Minute Video Assessment Checkpoint
                  </h3>
                  <p className="text-[11px] text-cyan-400 font-mono">
                    2 Video-Analyzed Questions • Score boosts your Placement Readiness Score
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold bg-slate-800 text-amber-300 border border-amber-500/30">
                +100 Pts Possible
              </span>
            </div>

            {/* Questions Form */}
            {!assessmentSubmitted ? (
              <div className="space-y-5 text-xs text-slate-200">
                {/* Question 1 */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Question 1 of 2</span>
                  <p className="font-bold text-white text-xs sm:text-sm leading-snug">
                    {activeVideoQuiz.q1.q}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {activeVideoQuiz.q1.options.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setQ1Answer(idx)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                          q1Answer === idx
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Question 2 */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5">
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">Question 2 of 2</span>
                  <p className="font-bold text-white text-xs sm:text-sm leading-snug">
                    {activeVideoQuiz.q2.q}
                  </p>
                  <div className="space-y-1.5 pt-1">
                    {activeVideoQuiz.q2.options.map((opt: string, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => setQ2Answer(idx)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${
                          q2Answer === idx
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold'
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleSubmitVideoAssessment()}
                  disabled={q1Answer === null || q2Answer === null}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all"
                >
                  Submit Assessment & Add Score to Profile
                </button>
              </div>
            ) : (
              /* Success / Result View */
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-base font-black text-white">Checkpoint Completed!</h4>
                  <p className="text-xs text-slate-300">
                    You scored <span className="font-bold text-emerald-400 font-mono text-sm">{earnedScore} / 100</span> on this in-video checkpoint.
                  </p>
                  <p className="text-[11px] text-cyan-400 font-mono pt-1">
                    ✓ Score automatically integrated into your student placement readiness rating!
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAssessmentModal(false);
                    setAssessmentSubmitted(false);
                    setQ1Answer(null);
                    setQ2Answer(null);
                    setAssessmentCheckpoint((prev) => prev + 1);
                    // Resume YouTube video after assessment is completed
                    setTimeout(() => ytCommand('playVideo'), 300);
                  }}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs transition-all shadow-md"
                >
                  Continue Learning Course →
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Floating Camera Proctoring Monitor for course learning session */}
      {faceApiLoaded && (
        <div className="fixed bottom-4 right-4 z-40 bg-slate-950 p-2 rounded-2xl border border-slate-800 shadow-2xl flex flex-col items-center space-y-1 animate-in slide-in-from-bottom-4 duration-300">
          <div className="relative w-36 h-28 rounded-lg overflow-hidden bg-slate-900 border border-slate-800">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover scale-x-[-1]"
            />
            
            {cameraActive && (
              <div className="absolute top-2 left-2 flex items-center space-x-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[8px] font-mono font-bold text-red-500">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                <span>AI LIVE</span>
              </div>
            )}
            
            {isFaceApiLoading && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-2 text-center">
                <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin mb-1" />
                <span className="text-[8px] text-slate-400">Loading AI...</span>
              </div>
            )}

            {cameraError && (
              <div className="absolute inset-0 bg-slate-950/90 flex flex-col items-center justify-center p-2 text-center">
                <AlertTriangle className="w-5 h-5 text-rose-500 mb-1" />
                <span className="text-[8px] text-rose-400">Camera Error</span>
              </div>
            )}
          </div>
          
          <div className="text-[9px] font-mono font-bold text-slate-400 flex items-center gap-2">
            <span>Camera Warns: <span className={headTurnWarnings > 0 ? "text-rose-500 font-extrabold" : "text-emerald-400"}>{headTurnWarnings}/2</span></span>
            <button
              onClick={handleCalibrateCamera}
              className="px-1.5 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[8px] font-sans font-black text-slate-200 hover:text-white transition-colors"
            >
              Calibrate
            </button>
          </div>
        </div>
      )}

      {/* Proctoring Warning Modal */}
      {showWarningModal && (
        <div className="fixed inset-0 z-[60] bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/60 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-center animate-in fade-in zoom-in-95">
            <div className="w-14 h-14 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/40">
              <AlertTriangle className="w-8 h-8 text-rose-400" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-base font-black text-white">AI Proctoring Alert</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                {warningMessage}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-amber-300 font-mono">
              Warnings: {headTurnWarnings} / 2 Max Allowed
            </div>
            <button
              onClick={() => {
                setShowWarningModal(false);
                setProctoringCooldown(true);
                setTimeout(() => setProctoringCooldown(false), 3000);
                if (!showAssessmentModal) {
                  // Resume video if we were watching it
                  setTimeout(() => {
                    ytCommand('playVideo');
                    setIsVideoPlaying(true);
                  }, 150);
                }
              }}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs transition-colors"
            >
              {showAssessmentModal ? "I Understand, Return to Checkpoint" : "I Understand, Return to Lesson"}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
