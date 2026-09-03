export interface StudyMaterial {
  courseId: string;
  courseTitle: string;
  category: string;
  cheatsheet: {
    summary: string;
    keySyntax: { title: string; code: string; desc: string }[];
    placementTips: string[];
  };
  diagram: {
    title: string;
    asciiChart: string;
    flowExplanation: string;
  };
  mindmap: string[];
}

export const COURSE_STUDY_MATERIALS: Record<string, StudyMaterial> = {
  'crs_python': {
    courseId: 'crs_python',
    courseTitle: 'Python for Placement & Core Development',
    category: 'Programming',
    cheatsheet: {
      summary: 'High-yield Python quick reference covering memory management, collections, list comprehensions, and generators.',
      keySyntax: [
        {
          title: 'List & Dict Comprehensions',
          code: 'evens = [x**2 for x in range(20) if x % 2 == 0]\nsquares_map = {x: x**2 for x in range(10)}',
          desc: 'O(N) optimized syntax in CPython byte-compilation.'
        },
        {
          title: 'Generators & Yield (Memory Efficient)',
          code: 'def stream_large_dataset(file_path):\n    for line in open(file_path):\n        yield line.strip()',
          desc: 'Saves RAM with lazy single-item yield iteration.'
        },
        {
          title: 'Lambda & Higher-Order Functions',
          code: 'sorted_data = sorted(students, key=lambda s: s["cgpa"], reverse=True)',
          desc: 'Sorts lists of dicts/objects by custom key comparator in O(N log N).'
        }
      ],
      placementTips: [
        'Python uses Pass-by-Object-Reference. Integers/Strings/Tuples are immutable; Lists/Dicts/Sets are mutable.',
        'GIL (Global Interpreter Lock) restricts multithreading to 1 CPU core for bytecode; use multiprocessing for CPU-bound tasks.'
      ]
    },
    diagram: {
      title: 'Python Memory Allocation Architecture & Garbage Collection',
      asciiChart: `
+-------------------------------------------------------------+
|                      Python Memory Model                    |
+-------------------------------------------------------------+
|  STACK MEMORY (References)        HEAP MEMORY (Objects)      |
|  [ var_a ] ---------------------> [ Integer: 42 ]           |
|  [ var_b ] ---------------------> (Points to same 42 block)  |
|  [ list_1 ] --------------------> [ [Ref0, Ref1, Ref2] ]    |
|                                         |     |     |       |
|                                         v     v     v       |
|                                       "Dev"  100   True     |
+-------------------------------------------------------------+
|  GARBAGE COLLECTOR: Reference Counting (Primary) + Generational |
+-------------------------------------------------------------+`,
      flowExplanation: 'Variables store memory addresses on the stack. Objects exist in the heap. Python utilizes reference counting + cyclic generation sweep to free unreferenced heap objects.'
    },
    mindmap: [
      '1. Variables & Memory (Heap vs Stack, ID, Pass-by-ref)',
      '2. Built-in Data Structures (List, Tuple, Dict, Set)',
      '3. Object Oriented Programming (Encapsulation, Polymorphism, Dunder Methods)',
      '4. Exception Handling & Context Managers (with open)',
      '5. Concurrency & Performance (GIL, Asyncio, Multiprocessing)'
    ]
  },

  'crs_cpp': {
    courseId: 'crs_cpp',
    courseTitle: 'C++ Systems Programming & Memory Mastery',
    category: 'Systems & Performance',
    cheatsheet: {
      summary: 'C++ memory layout, pointer arithmetic, modern smart pointers (C++11/20), and Standard Template Library (STL).',
      keySyntax: [
        {
          title: 'Modern Smart Pointers (RAII)',
          code: '#include <memory>\nstd::unique_ptr<Node> root = std::make_unique<Node>(10);\nstd::shared_ptr<Session> shared = std::make_shared<Session>();',
          desc: 'Automatic deterministic destruction without manual delete.'
        },
        {
          title: 'STL Vector & Fast Iteration',
          code: 'std::vector<int> nums = {3, 1, 4, 1, 5};\nstd::sort(nums.begin(), nums.end());',
          desc: 'Contiguous heap memory with amortized O(1) push_back.'
        }
      ],
      placementTips: [
        'VTABLE & VPTR: Virtual functions add a hidden pointer to classes for dynamic runtime dispatch polymorphism.',
        'Always make base class destructors virtual to prevent partial destruction memory leaks.'
      ]
    },
    diagram: {
      title: 'C++ Program Memory Layout in OS Execution',
      asciiChart: `
+---------------------------------------------------+
|               High Memory Address                 |
+---------------------------------------------------+
|  [ STACK ] -> Local vars, function frames (grows down)|
|      |                                            |
|      v                                            |
|      ^                                            |
|      |                                            |
|  [ HEAP ]  -> Dynamic new/malloc (grows up)       |
+---------------------------------------------------+
|  [ BSS Segment ] -> Uninitialized Global & Static |
+---------------------------------------------------+
|  [ Data Segment ] -> Initialized Global & Static  |
+---------------------------------------------------+
|  [ Text Segment ] -> Machine Instructions (Read-only)|
+---------------------------------------------------+
|               Low Memory Address                  |
+---------------------------------------------------+`,
      flowExplanation: 'Stack manages fast deterministic LIFO local frames, while Heap handles runtime dynamic allocations.'
    },
    mindmap: [
      '1. Pointers, References & Raw Memory',
      '2. RAII & Smart Pointers (unique_ptr, shared_ptr, weak_ptr)',
      '3. Object-Oriented C++ (VTable, VPTR, Multiple Inheritance)',
      '4. Standard Template Library (vector, map, unordered_map, set)',
      '5. Move Semantics & Rvalue References (&&, std::move)'
    ]
  },

  'crs_java': {
    courseId: 'crs_java',
    courseTitle: 'Java Enterprise & JVM Architecture',
    category: 'Backend & Enterprise',
    cheatsheet: {
      summary: 'Java collections framework, JVM execution model, class loaders, and thread concurrency.',
      keySyntax: [
        {
          title: 'Streams API & Lambda Pipelines',
          code: 'List<String> topStudents = students.stream()\n    .filter(s -> s.getCgpa() >= 8.5)\n    .map(Student::getFullName)\n    .collect(Collectors.toList());',
          desc: 'Declarative stream pipeline processing in Java 8+.'
        },
        {
          title: 'Concurrent HashMap',
          code: 'ConcurrentMap<String, UserSession> map = new ConcurrentHashMap<>();\nmap.putIfAbsent("usr_99", session);',
          desc: 'Thread-safe non-blocking bucket locking concurrency.'
        }
      ],
      placementTips: [
        'String Pool: Strings in double quotes are reused in PermGen/Metaspace String Constant Pool.',
        'Equals vs ==: == compares memory references, while .equals() compares semantic content.'
      ]
    },
    diagram: {
      title: 'Java Virtual Machine (JVM) Runtime Data Areas',
      asciiChart: `
+-------------------------------------------------------------------+
|                       JVM Runtime Architecture                    |
+-------------------------------------------------------------------+
|  CLASS LOADER SUBSYSTEM -> Loading -> Linking -> Initialization   |
+-------------------------------------------------------------------+
|  [ METASPACE / METHOD AREA ] : Class Bytecode, Static Vars        |
|  [ HEAP MEMORY ]             : Young Gen (Eden, S0, S1) + Old Gen |
|  ---------------------------------------------------------------  |
|  PER-THREAD:                                                      |
|  [ Java Thread Stack ]  | [ Program Counter (PC) ] | [ Native Stack]|
+-------------------------------------------------------------------+
|  EXECUTION ENGINE: JIT Compiler + Garbage Collector (G1 / ZGC)    |
+-------------------------------------------------------------------+`,
      flowExplanation: 'Bytecode is loaded into Metaspace and executed by the JIT compiler with multi-generation GC heap management.'
    },
    mindmap: [
      '1. Core Java OOP (Encapsulation, Abstraction, Polymorphism)',
      '2. JVM Internals (ClassLoaders, Heap, Metaspace, GC)',
      '3. Collections (ArrayList, HashMap, TreeMap, PriorityQueue)',
      '4. Concurrency (Threads, Synchronized, Executors, Locks)',
      '5. Spring Boot & Microservices Essentials'
    ]
  },

  'crs_dsa': {
    courseId: 'crs_dsa',
    courseTitle: 'Data Structures & Algorithms Masterclass',
    category: 'Computer Science Core',
    cheatsheet: {
      summary: 'Time/Space complexity cheat sheet, array techniques, tree traversals, and dynamic programming patterns.',
      keySyntax: [
        {
          title: 'Two Pointers (Binary Sum)',
          code: 'left, right = 0, len(arr) - 1\nwhile left < right:\n    curr = arr[left] + arr[right]\n    if curr == target: return [left, right]\n    elif curr < target: left += 1\n    else: right -= 1',
          desc: 'Reduces O(N^2) brute-force lookup to linear O(N) on sorted arrays.'
        },
        {
          title: 'Sliding Window (Max Subarray)',
          code: 'window_sum, max_sum = sum(arr[:k]), sum(arr[:k])\nfor i in range(len(arr) - k):\n    window_sum = window_sum - arr[i] + arr[i+k]\n    max_sum = max(max_sum, window_sum)',
          desc: 'O(N) rolling window technique for contiguous arrays.'
        }
      ],
      placementTips: [
        'Graph Traversal: Use BFS for shortest path in unweighted graphs; DFS for backtracking & cycle detection.',
        'DP: Identify Overlapping Subproblems and Optimal Substructure.'
      ]
    },
    diagram: {
      title: 'Algorithm Problem Classification Decision Tree',
      asciiChart: `
+---------------------------------------------------------------+
|             Input Data Structure & Pattern Picker             |
+---------------------------------------------------------------+
|                                                               |
|  Sorted Array / Monotonic? -----> Use Binary Search O(log N)  |
|  Contiguous Subarray / Window? -> Use Sliding Window O(N)     |
|  Pair Sums / Inversions? -------> Use Two Pointers O(N)       |
|  Shortest Path (Unweighted)? ---> Use BFS Queue O(V + E)      |
|  Tree Hierarchy / Exhaustive? --> Use DFS Recursion O(V)      |
|  Choices & Subproblems? --------> Use Dynamic Programming     |
|                                                               |
+---------------------------------------------------------------+`,
      flowExplanation: 'Select algorithm pattern by analyzing input properties: sorting allows binary search; contiguous elements suggest sliding window; tree structures require DFS/BFS.'
    },
    mindmap: [
      '1. Complexity Analysis (Big-O, Master Theorem)',
      '2. Linear Structures (Arrays, Linked Lists, Stacks, Queues)',
      '3. Trees & Heaps (BST, AVL, Segment Tree, Binary Heap)',
      '4. Graphs (BFS, DFS, Dijkstra, TopoSort, Union-Find)',
      '5. Dynamic Programming (0/1 Knapsack, LCS, LIS, Matrix DP)'
    ]
  },

  'crs_sql': {
    courseId: 'crs_sql',
    courseTitle: 'SQL & Database Engineering',
    category: 'Data & Databases',
    cheatsheet: {
      summary: 'Relational query optimization, indexing strategies, ACID transactions, and window functions.',
      keySyntax: [
        {
          title: 'Window Functions (Ranking)',
          code: 'SELECT employee_id, department, salary,\n       DENSE_RANK() OVER (PARTITION BY department ORDER BY salary DESC) as rank_in_dept\nFROM employees;',
          desc: 'Ranks records within partitions without collapsing rows.'
        },
        {
          title: 'Common Table Expressions (CTE)',
          code: 'WITH TopStudents AS (\n    SELECT student_id, AVG(score) as avg_score FROM scores GROUP BY student_id\n)\nSELECT * FROM TopStudents WHERE avg_score >= 85;',
          desc: 'Improves readability and modularity of multi-table joins.'
        }
      ],
      placementTips: [
        'ACID: Atomicity (All or nothing), Consistency (Rules valid), Isolation (Concurrent safety), Durability (Persisted to disk).',
        'Use EXPLAIN ANALYZE to identify sequential full-table scans and add B-Tree compound indexes.'
      ]
    },
    diagram: {
      title: 'SQL Join Venn Diagram & Execution Logic',
      asciiChart: `
+-----------------------------------------------------------------+
|                       SQL JOIN Flowchart                        |
+-----------------------------------------------------------------+
|  INNER JOIN : [ A ] INTERSECT [ B ] -> Only matching keys       |
|  LEFT JOIN  : [ A ] + MATCHED [ B ] -> All left, NULL on right  |
|  RIGHT JOIN : MATCHED [ A ] + [ B ] -> All right, NULL on left  |
|  FULL JOIN  : [ A ] UNION [ B ]     -> All rows from both sides |
|  CROSS JOIN : [ A ] x [ B ]         -> Cartesian Product (M x N)|
+-----------------------------------------------------------------+`,
      flowExplanation: 'Inner join intersects keys; Outer joins preserve left/right datasets with NULL padding for missing foreign relationships.'
    },
    mindmap: [
      '1. Basic Querying (SELECT, WHERE, GROUP BY, HAVING, ORDER BY)',
      '2. Joins & Subqueries (Inner, Outer, CTE, Correlated)',
      '3. Window Functions (ROW_NUMBER, RANK, DENSE_RANK, LEAD/LAG)',
      '4. Indexing & Optimization (B-Tree, Hash, Clustered, EXPLAIN)',
      '5. Transactions & Concurrency (ACID, Isolation Levels, MVCC)'
    ]
  },

  'crs_git': {
    courseId: 'crs_git',
    courseTitle: 'Git & GitHub Collaboration',
    category: 'Developer Tools',
    cheatsheet: {
      summary: 'Git branching models, merge vs rebase, interactive rebasing, merge conflict resolution, and GitHub pull request workflows.',
      keySyntax: [
        {
          title: 'Interactive Rebase & Squash',
          code: 'git checkout feature-branch\ngit rebase -i HEAD~3\n# Mark commits as "squash" to clean history',
          desc: 'Condenses messy commit history into clean semantic patches.'
        },
        {
          title: 'Stashing Work in Progress',
          code: 'git stash save "wip feature"\ngit checkout main && git pull\ngit checkout feature-branch && git stash pop',
          desc: 'Temporarily stashes dirty working tree changes.'
        }
      ],
      placementTips: [
        'Rebase vs Merge: Rebase rewrites history linearly; Merge creates a 2-parent merge commit preserving true branch timeline.',
        'Never rebase commits that have already been pushed to public shared branches.'
      ]
    },
    diagram: {
      title: 'Git 3-Tree Architecture (Working Dir -> Staging -> Repository)',
      asciiChart: `
+---------------------------------------------------------------+
|                      Git Architecture Flow                    |
+---------------------------------------------------------------+
|  [ Working Directory ] --( git add )------> [ Staging Index ] |
|                                                    |          |
|                                            ( git commit )     |
|                                                    v          |
|  [ Remote GitHub Repo ] <--( git push )-- [ Local HEAD Repo ] |
+---------------------------------------------------------------+`,
      flowExplanation: 'Files transition from local working directory into the staging index before being snapshotted permanently into commit history.'
    },
    mindmap: [
      '1. Three-Tree Architecture (Working Tree, Index, HEAD)',
      '2. Branching & Merging (Fast-Forward, 3-Way Merge, Rebase)',
      '3. History Rewriting (rebase -i, commit --amend, reset, revert)',
      '4. Remote Collaboration (push, fetch, pull, upstream, PR)',
      '5. CI/CD & GitHub Actions Automation'
    ]
  },

  'crs_oop': {
    courseId: 'crs_oop',
    courseTitle: 'Object-Oriented Design & Clean Architecture',
    category: 'Software Architecture',
    cheatsheet: {
      summary: 'SOLID principles, Gang of Four design patterns (Factory, Observer, Singleton, Strategy), and scalable software engineering.',
      keySyntax: [
        {
          title: 'Singleton Pattern (Thread-Safe)',
          code: 'class DatabasePool:\n    _instance = None\n    def __new__(cls):\n        if not cls._instance:\n            cls._instance = super().__new__(cls)\n        return cls._instance',
          desc: 'Ensures exactly one global instance exists across application lifetime.'
        },
        {
          title: 'Strategy Pattern',
          code: 'class PaymentContext:\n    def __init__(self, strategy: PaymentStrategy):\n        self._strategy = strategy\n    def pay(self, amount):\n        return self._strategy.execute(amount)',
          desc: 'Swaps interchangeable business algorithms dynamically at runtime.'
        }
      ],
      placementTips: [
        'SOLID Principles: Single Responsibility, Open-Closed, Liskov Substitution, Interface Segregation, Dependency Inversion.',
        'Favor object composition over class inheritance for flexibility.'
      ]
    },
    diagram: {
      title: 'Clean Architecture Layered Dependency Rule',
      asciiChart: `
+---------------------------------------------------------------+
|                      Clean Architecture                       |
+---------------------------------------------------------------+
|  [ Frameworks & Drivers (Web, DB, UI, External APIs) ]        |
|      |                                                        |
|      v                                                        |
|  [ Interface Adapters (Controllers, Gateways, Presenters) ]   |
|      |                                                        |
|      v                                                        |
|  [ Application Business Rules (Use Cases / Services) ]        |
|      |                                                        |
|      v                                                        |
|  [ Enterprise Core Entities (Pure Domain Business Models) ]   |
+---------------------------------------------------------------+`,
      flowExplanation: 'Dependencies point strictly inward. Core enterprise entities have zero awareness of databases, frameworks, or UI layers.'
    },
    mindmap: [
      '1. Core OOP Pillars (Encapsulation, Inheritance, Polymorphism, Abstraction)',
      '2. SOLID Principles Deep-Dive',
      '3. Creational Patterns (Factory, Builder, Singleton)',
      '4. Structural Patterns (Adapter, Decorator, Facade)',
      '5. Behavioral Patterns (Observer, Strategy, Command)'
    ]
  },

  'crs_cloud': {
    courseId: 'crs_cloud',
    courseTitle: 'Cloud Computing & AWS Architecture',
    category: 'Cloud & Infrastructure',
    cheatsheet: {
      summary: 'Amazon Web Services core services: EC2, S3, IAM, VPC, Serverless Lambda, RDS, and scalable high-availability cloud architecture.',
      keySyntax: [
        {
          title: 'AWS CLI S3 Sync',
          code: 'aws s3 sync ./build s3://my-production-bucket --delete --acl public-read',
          desc: 'Synchronizes static assets to S3 object storage.'
        },
        {
          title: 'Serverless Lambda Handler',
          code: 'exports.handler = async (event) => {\n    const body = JSON.parse(event.body);\n    return { statusCode: 200, body: JSON.stringify({ message: "Processed!" }) };\n};',
          desc: 'Stateless on-demand event-driven serverless compute.'
        }
      ],
      placementTips: [
        'Shared Responsibility Model: AWS manages security OF the cloud; the customer manages security IN the cloud (data, IAM, OS patches).',
        'High Availability: Deploy workloads across minimum 2 Availability Zones (AZs) with an Application Load Balancer.'
      ]
    },
    diagram: {
      title: 'Scalable AWS 3-Tier Web Architecture',
      asciiChart: `
+---------------------------------------------------------------+
|                   Scalable AWS Cloud VPC                      |
+---------------------------------------------------------------+
|  [ Route 53 DNS ] -> [ CloudFront CDN ] -> [ Internet Gateway ] |
|                                                    |          |
|  PUBLIC SUBNETS (Multi-AZ):                        v          |
|  [ Application Load Balancer (ALB) ] -----------------------  |
|                                                    |          |
|  PRIVATE SUBNETS (Multi-AZ):                       v          |
|  [ EC2 Auto-Scaling Group / ECS Containers ] ---------------  |
|                                                    |          |
|  DATABASE SUBNETS (Isolated):                      v          |
|  [ Amazon RDS Multi-AZ Primary ] <-> [ Read Replica ]         |
+---------------------------------------------------------------+`,
      flowExplanation: 'Traffic flows through CloudFront and ALB into autoscaling private compute instances, with managed replicated database tiers.'
    },
    mindmap: [
      '1. Cloud Fundamentals & Regions / Availability Zones',
      '2. IAM & Security (Roles, Policies, MFA, Least Privilege)',
      '3. Compute (EC2, Lambda, ECS, Auto Scaling)',
      '4. Networking & VPC (Subnets, Route Tables, NAT Gateway, Security Groups)',
      '5. Databases & Storage (S3, RDS, DynamoDB, CloudFront)'
    ]
  },

  'crs_aptitude': {
    courseId: 'crs_aptitude',
    courseTitle: 'Quantitative Aptitude & Logical Reasoning',
    category: 'Placement Prep',
    cheatsheet: {
      summary: 'Shortcuts and algebraic formulas for campus placement aptitude exams (Time & Work, Speed-Distance, Probability, Permutations).',
      keySyntax: [
        {
          title: 'Time & Work Formula',
          code: 'Work = Efficiency * Time\nIf A takes X days and B takes Y days:\nCombined Time = (X * Y) / (X + Y) days',
          desc: 'Fast calculation for two-worker collaborative problems.'
        },
        {
          title: 'Speed, Time & Distance (Relative Speed)',
          code: 'Opposite Direction: Relative Speed = S1 + S2\nSame Direction: Relative Speed = |S1 - S2|\nConvert km/h to m/s: multiply by 5/18',
          desc: 'Essential for trains, boats, and river velocity problems.'
        }
      ],
      placementTips: [
        'Elimination Technique: Estimate magnitude first; 2 out of 4 options are usually obviously out of bounds.',
        'Percentages: 1/6 = 16.66%, 1/7 = 14.28%, 1/8 = 12.5%, 1/9 = 11.11% (memorize fractions).'
      ]
    },
    diagram: {
      title: 'Aptitude Speed Math Decision Flowchart',
      asciiChart: `
+---------------------------------------------------------------+
|              Campus Placement Quantitative Roadmap            |
+---------------------------------------------------------------+
|  1. ARITHMETIC CORE:                                          |
|     Percentages -> Profit & Loss -> Simple/Compound Interest  |
|                                                               |
|  2. RATES & CAPACITY:                                         |
|     Time & Work -> Pipes & Cisterns -> Time, Speed, Distance  |
|                                                               |
|  3. COUNTING & COMBINATORICS:                                 |
|     Permutations nPr -> Combinations nCr -> Probability       |
|                                                               |
|  4. DATA INTERPRETATION:                                      |
|     Pie Charts -> Bar Graphs -> Tabular Comparison Metrics    |
+---------------------------------------------------------------+`,
      flowExplanation: 'Master percentage ratios first as they form the backbone of profit, interest, speed, and data interpretation problems.'
    },
    mindmap: [
      '1. Number Systems & Divisibility Rules',
      '2. Ratios, Proportions & Percentages',
      '3. Time & Work, Pipes & Cisterns',
      '4. Speed, Distance, Trains & Boats',
      '5. Permutations, Combinations & Probability'
    ]
  },

  'crs_interview': {
    courseId: 'crs_interview',
    courseTitle: 'Technical Interview Preparation & System Design',
    category: 'Career & Interview Prep',
    cheatsheet: {
      summary: 'System design template, STAR behavioral methodology, resume defense strategies, and live coding interview checklists.',
      keySyntax: [
        {
          title: 'STAR Method Template (Behavioral)',
          code: 'S - Situation: Set the scene and context (10% time)\nT - Task: What was required of you? (10% time)\nA - Action: Specific steps YOU took (60% time)\nR - Result: Quantified impact, e.g. +35% latency drop (20% time)',
          desc: 'Standard Amazon / Google behavioral answering framework.'
        },
        {
          title: 'System Design 4-Step Framework',
          code: 'Step 1: Scope Requirements (Functional & Non-Functional)\nStep 2: Capacity Estimation (Traffic, Storage, Bandwidth)\nStep 3: High-Level Architecture (API, DB schema, Services)\nStep 4: Deep Dive & Bottlenecks (Caching, Sharding, Failover)',
          desc: 'Guarantees structured communication during 45-minute interviews.'
        }
      ],
      placementTips: [
        'Think Out Loud: Interviewers evaluate thought process and trade-off analysis more than syntax perfection.',
        'Clarify Constraints: Always ask about scale, edge cases, and expected data volume before coding.'
      ]
    },
    diagram: {
      title: 'High-Level Scalable System Design Architecture Blueprint',
      asciiChart: `
+---------------------------------------------------------------+
|             Modern Scalable System Design Blueprint           |
+---------------------------------------------------------------+
|  [ Client Apps ] -> [ DNS / CDN ] -> [ Load Balancer (Nginx) ] |
|                                             |                 |
|                                             v                 |
|                     [ API Gateway / Microservices ]           |
|                                  |       |                    |
|                +-----------------+       +-----------------+  |
|                v                                           v  |
|  [ In-Memory Cache (Redis) ]              [ Message Queue ]   |
|                |                           (Kafka / RabbitMQ) |
|                v                                   |          |
|  [ Primary Relational / NoSQL DB ]                 v          |
|  (Sharded + Read Replicas)             [ Async Worker Tasks ] |
+---------------------------------------------------------------+`,
      flowExplanation: 'Incoming traffic distributes across load balancers to stateless services, backed by Redis cache and asynchronous message brokers.'
    },
    mindmap: [
      '1. Behavioral Interview Mastery (STAR Method, Leadership Principles)',
      '2. Technical Communication & Live Coding Protocol',
      '3. System Design Framework (Scalability, Latency, Throughput)',
      '4. Data Modeling & API Design (REST, GraphQL, gRPC)',
      '5. Resume Defense & Project Architecture Walkthrough'
    ]
  }
};
