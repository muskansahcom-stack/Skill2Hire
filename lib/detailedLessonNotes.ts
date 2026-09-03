export interface DetailedLessonNote {
  lessonTitle: string;
  videoTimestamp: string;
  coreConcepts: string[];
  inDepthTheory: string;
  codeBreakdown: { snippet: string; explanation: string };
  interviewQnA: { question: string; answer: string }[];
  keyTakeaways: string[];
}

export const DETAILED_COURSE_NOTES: Record<string, DetailedLessonNote[]> = {
  'crs_python': [
    {
      lessonTitle: 'Python Variables & Memory Allocation',
      videoTimestamp: '00:00 - 15:30',
      coreConcepts: [
        'Dynamic Typing & Pass-by-Object-Reference model',
        'Stack pointer references vs Heap object allocation',
        'Small Integer Caching (-5 to 256) and String Interning',
        'Reference Counting & Tracing Garbage Collector'
      ],
      inDepthTheory: `In Python, variables do not store raw primitive values in static stack frames like in C/C++. Instead, every variable is a named reference (pointer) pointing to a dynamically allocated PyObject on the heap.

When you execute \`x = 100\`, Python allocates an integer object \`100\` on the heap with type metadata and reference count \`1\`. If you subsequently assign \`y = x\`, no new memory is allocated; \`y\` simply points to the identical PyObject block, incrementing its reference count to 2.

Python optimizes performance using Small Integer Caching (-5 to 256) where these integers are pre-allocated at interpreter boot time and reused across all scopes.`,
      codeBreakdown: {
        snippet: `a = 256
b = 256
print(a is b)  # True (Shared heap memory address via caching)

x = 1000
y = 1000
print(x is y)  # False (Distinct heap allocations outside cached range)
print(x == y)  # True (Value equality check)`,
        explanation: 'The "is" keyword compares raw memory IDs (id(a) == id(b)), while "==" invokes the __eq__ dunder method to compare values.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between mutable and immutable types in Python?',
          answer: 'Immutable objects (int, float, str, tuple, frozenset) cannot be modified after creation; any modification spawns a new object. Mutable objects (list, dict, set) can be mutated in-place without altering their heap memory address.'
        },
        {
          question: 'How does Python handle memory management and avoid memory leaks?',
          answer: 'Python utilizes two complementary mechanisms: 1) Reference Counting for immediate deallocation when ref count drops to 0, and 2) Generational Garbage Collector (Generations 0, 1, 2) to detect and resolve isolated reference cycles.'
        }
      ],
      keyTakeaways: [
        'Understand is vs == identity checking',
        'Never use mutable default arguments in functions (e.g., def fn(lst=[]) is a shared singleton)'
      ]
    },
    {
      lessonTitle: 'Data Types, Operators & Control Flow',
      videoTimestamp: '15:31 - 32:45',
      coreConcepts: [
        'Floor Division (//), Modulo (%), and Exponentiation (**)',
        'Short-circuit evaluation in logical operators (and / or)',
        'Truth Value Testing & Falsy objects (None, 0, empty sequences)',
        'Walrus Operator (:=) for in-line assignment expressions'
      ],
      inDepthTheory: `Python evaluates conditional branches using short-circuit boolean logic. In an expression \`A and B\`, if \`A\` evaluates to False, Python immediately halts evaluation and returns \`A\` without evaluating \`B\`.

The walrus operator \`:=\` introduced in Python 3.8 allows variable binding within conditional statements, significantly reducing redundant computation in loops and regex matching.`,
      codeBreakdown: {
        snippet: `# Walrus operator inside while loop
while (data := input("Enter command: ")) != "exit":
    print(f"Executing: {data.upper()}")`,
        explanation: 'Assigns user input to data and checks the condition in a single atomic expression.'
      },
      interviewQnA: [
        {
          question: 'How does Python evaluate boolean short-circuiting in dict.get fallback?',
          answer: 'In "res = cache.get(key) or fetch_from_db()", if the key exists in cache and returns a truthy value, fetch_from_db() is never executed, saving expensive database network queries.'
        }
      ],
      keyTakeaways: [
        'Prefer collections.defaultdict over manual key checks in dictionaries',
        'Use enumerate() instead of range(len(arr)) for idiomatic index-value iteration'
      ]
    },
    {
      lessonTitle: 'Object-Oriented Programming (OOP) in Python',
      videoTimestamp: '32:46 - 55:10',
      coreConcepts: [
        'Classes, __init__, and self instance binding',
        'Dunder (Magic) methods: __repr__, __str__, __len__, __call__',
        'Multiple Inheritance and Method Resolution Order (MRO / C3 Linearization)',
        'Encapsulation using property decorators (@property, @setter)'
      ],
      inDepthTheory: `Python OOP utilizes dynamic dispatch through attribute lookup. Every class instance contains a \`__dict__\` mapping instance variables. When invoking a method, Python looks up the class namespace and passes the caller object as the implicit first argument \`self\`.

Python supports multiple inheritance via the C3 Linearization algorithm to determine Method Resolution Order (MRO), accessible via \`ClassName.__mro__\`, preventing the diamond problem.`,
      codeBreakdown: {
        snippet: `class Student:
    def __init__(self, name: str, cgpa: float):
        self.name = name
        self._cgpa = cgpa  # Protected convention

    @property
    def cgpa(self):
        return self._cgpa

    @cgpa.setter
    def cgpa(self, value):
        if not (0.0 <= value <= 10.0):
            raise ValueError("CGPA must be between 0.0 and 10.0")
        self._cgpa = value`,
        explanation: 'Encapsulates data validation using pythonic getter and setter property decorators.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between @staticmethod, @classmethod, and regular instance methods?',
          answer: 'Instance methods receive self (the instance); @classmethod receives cls (the class object itself, ideal for factory constructors); @staticmethod receives no implicit arguments and acts as a plain namespace-bound utility function.'
        }
      ],
      keyTakeaways: [
        'Use @dataclass for boilerplate-free model definitions',
        'Override __repr__ for informative debugging output'
      ]
    }
  ],

  'crs_cpp': [
    {
      lessonTitle: 'C++ Memory Hierarchy & Pointer Mechanics',
      videoTimestamp: '00:00 - 22:15',
      coreConcepts: [
        'Stack vs Heap performance & Cache line locality',
        'Pointer arithmetic & Reference aliasing',
        'Memory leaks, Double free, and Dangling pointers',
        'Smart Pointers (unique_ptr, shared_ptr, weak_ptr) and RAII'
      ],
      inDepthTheory: `C++ gives developers direct access to raw memory through pointer manipulation. The Stack allocates fast LIFO memory via the CPU ESP/RSP register. The Heap handles dynamic runtime requests via the OS allocator (brk/mmap), which has fragmentation and locking overhead.

Modern C++ (C++11 through C++20) mandates RAII (Resource Acquisition Is Initialization). Resources must be encapsulated in object wrappers whose destructors automatically release memory when leaving execution scope.`,
      codeBreakdown: {
        snippet: `#include <iostream>
#include <memory>

struct Node {
    int val;
    std::unique_ptr<Node> next;
    Node(int v) : val(v), next(nullptr) {}
};

int main() {
    auto head = std::make_unique<Node>(10);
    head->next = std::make_unique<Node>(20);
    // Automatically deallocated in reverse order without manual delete!
    return 0;
}`,
        explanation: 'std::make_unique allocates Node on heap and guarantees zero memory leaks even if exceptions occur.'
      },
      interviewQnA: [
        {
          question: 'How does std::shared_ptr manage thread-safe reference counting?',
          answer: 'std::shared_ptr maintains a separate Heap Control Block containing an atomic reference count and atomic weak count. Incrementing and decrementing the count is thread-safe using hardware atomic instructions.'
        },
        {
          question: 'What is the purpose of std::weak_ptr?',
          answer: 'std::weak_ptr breaks circular references in shared_ptr graphs (e.g. doubly-linked lists or parent-child nodes) by observing an object without incrementing its strong reference count.'
        }
      ],
      keyTakeaways: [
        'Never call raw new and delete in modern C++',
        'Pass large structures by const reference (const Type&) to avoid expensive deep copies'
      ]
    }
  ],

  'crs_java': [
    {
      lessonTitle: 'Java Memory Model, JVM & Garbage Collection',
      videoTimestamp: '00:00 - 24:30',
      coreConcepts: [
        'JVM Architecture: Metaspace, Heap, Thread Stacks, and PC Registers',
        'Generational Garbage Collection: Young Gen (Eden, S0, S1) & Old Gen',
        'JIT (Just-In-Time) Compiler & HotSpot execution profiling',
        'String Pool optimization in Metaspace'
      ],
      inDepthTheory: `Java bytecode (.class) executes on the Java Virtual Machine. When an object is instantiated with \`new\`, it is allocated into the Eden space of Young Generation Heap.

Short-lived objects are quickly collected during Minor GC sweeps using copy collectors into Survivor spaces (S0/S1). Objects surviving multiple GC cycles (threshold aging) are promoted into Old (Tenured) Generation.

The HotSpot JIT compiler monitors method call frequency and compiles frequently executed bytecode loops into native x86/ARM machine code at runtime.`,
      codeBreakdown: {
        snippet: `String s1 = "Placement";         // Reused from String Constant Pool
String s2 = "Placement";         // Points to identical memory in Pool
String s3 = new String("Placement"); // Forced explicit heap allocation

System.out.println(s1 == s2);      // true (same reference in pool)
System.out.println(s1 == s3);      // false (different heap references)
System.out.println(s1.equals(s3)); // true (value equality comparison)`,
        explanation: 'String pooling saves heap memory by sharing immutable string literals.'
      },
      interviewQnA: [
        {
          question: 'Why is String immutable in Java?',
          answer: '1) Security (Strings are used in network connections and DB URLs), 2) Thread safety (can be shared across threads without synchronization), and 3) Caching (HashCode is pre-calculated and cached for instant HashMap lookups).'
        }
      ],
      keyTakeaways: [
        'Always override both equals() and hashCode() together in domain classes',
        'Use StringBuilder for string concatenation in loops to avoid allocating thousands of intermediate String objects'
      ]
    }
  ],

  'crs_dsa': [
    {
      lessonTitle: 'Algorithmic Complexity & Advanced Problem Solving',
      videoTimestamp: '00:00 - 30:00',
      coreConcepts: [
        'Asymptotic Analysis: Big-O (Worst), Big-Omega (Best), Big-Theta (Average)',
        'Two Pointers & Sliding Window techniques on linear arrays',
        'Tree Traversals: In-order, Pre-order, Post-order, and Level-Order BFS',
        'Dynamic Programming: Memoization (Top-down) vs Tabulation (Bottom-up)'
      ],
      inDepthTheory: `Data structure selection directly dictates algorithmic efficiency. In interview problem-solving:
1. When searching sorted contiguous arrays, use Binary Search to achieve logarithmic O(log N) time.
2. In graph connectivity or shortest path in unweighted graphs, use BFS with a Queue in O(V + E) time.
3. For optimization problems with overlapping subproblems, identify the state transition relation:
   DP[i] = min(DP[i-1], DP[i-k]) + Cost[i]`,
      codeBreakdown: {
        snippet: `# Top-Down Dynamic Programming (Memoization)
def fib_memo(n, memo={}):
    if n in memo: return memo[n]
    if n <= 1: return n
    memo[n] = fib_memo(n - 1, memo) + fib_memo(n - 2, memo)
    return memo[n]

# Transforms exponential O(2^N) recursion into linear O(N) time!`,
        explanation: 'Stores computed subproblem answers in a hash map to avoid redundant recursive branches.'
      },
      interviewQnA: [
        {
          question: 'How do HashTables handle hash collisions, and what is worst-case lookup time?',
          answer: 'Hash collisions are resolved via Separate Chaining (Linked Lists / Red-Black Trees in Java 8+) or Open Addressing (Linear Probing). Average lookup is O(1); worst-case when all keys collide into the same bucket is O(N) or O(log N).'
        }
      ],
      keyTakeaways: [
        'Master the 14 core LeetCode coding patterns',
        'Always state Time and Space complexity before writing code in live interviews'
      ]
    }
  ],

  'crs_sql': [
    {
      lessonTitle: 'Relational Database Engineering & Query Optimization',
      videoTimestamp: '00:00 - 28:00',
      coreConcepts: [
        'B-Tree vs Clustered Indexing mechanics',
        'ACID properties and Transaction Isolation Levels',
        'Window Functions (ROW_NUMBER, DENSE_RANK, LEAD, LAG)',
        'Query Execution Plans & EXPLAIN ANALYZE tuning'
      ],
      inDepthTheory: `Relational databases use B-Tree indexes to perform O(log N) binary traversals over disk blocks. A clustered index determines the physical order of data rows on disk (usually Primary Key).

Secondary non-clustered indexes contain the indexed column values and a pointer to the clustered index key.

ACID guarantees transaction safety under high concurrent loads:
- Read Uncommitted (Dirty reads possible)
- Read Committed (Default in Postgres)
- Repeatable Read (Default in MySQL InnoDB via MVCC)
- Serializable (Strictest lock-based isolation)`,
      codeBreakdown: {
        snippet: `-- High-performance window query to find top 2 highest paid employees per department
WITH RankedSalaries AS (
    SELECT 
        emp_id, 
        dept_id, 
        salary,
        DENSE_RANK() OVER (PARTITION BY dept_id ORDER BY salary DESC) as rank_num
    FROM employees
)
SELECT * FROM RankedSalaries WHERE rank_num <= 2;`,
        explanation: 'Partitions data by department and assigns dense ranking without collapsing individual records.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between WHERE and HAVING in SQL?',
          answer: 'WHERE filters individual row records before grouping and aggregation occur. HAVING filters grouped summary rows after the GROUP BY clause has executed.'
        }
      ],
      keyTakeaways: [
        'Avoid SELECT * in production queries to minimize I/O and network serialization',
        'Use composite indexes matching the leftmost prefix query filter sequence'
      ]
    }
  ],

  'crs_cloud': [
    {
      lessonTitle: 'AWS Cloud Architecture & High-Availability Systems',
      videoTimestamp: '00:00 - 25:00',
      coreConcepts: [
        'AWS Global Infrastructure: Regions, Availability Zones, Edge Locations',
        'VPC Networking: CIDR blocks, Public/Private Subnets, NAT Gateways, Route Tables',
        'Compute & Autoscaling: EC2, Elastic Load Balancing (ALB), AWS Lambda',
        'Storage tiers: S3 Object Storage, EBS Block Storage, EFS Network Storage'
      ],
      inDepthTheory: `High availability on AWS requires decoupling application tiers and eliminating Single Points of Failure (SPOF).

A robust cloud deployment spans across at least 2 Availability Zones inside a VPC. Traffic hits Amazon Route 53 (DNS) with latency-based routing, passes through CloudFront edge caches, and enters an Application Load Balancer in public subnets.

The ALB routes HTTP/HTTPS requests to Auto Scaling Groups of stateless EC2 or containerized ECS tasks in private subnets with zero direct internet access.`,
      codeBreakdown: {
        snippet: `# Terraform AWS VPC Infrastructure as Code snippet
resource "aws_subnet" "private_subnet" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
  tags = { Name = "Production-Private-Subnet" }
}`,
        explanation: 'Declares an isolated private subnet for backend microservices.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between Security Groups and Network ACLs in AWS VPC?',
          answer: 'Security Groups operate at the instance/ENI level and are stateful (inbound return traffic automatically allowed). NACLs operate at the subnet boundary and are stateless (explicit inbound and outbound rules required).'
        }
      ],
      keyTakeaways: [
        'Apply Principle of Least Privilege in IAM Policies',
        'Use S3 Intelligent-Tiering to automatically optimize object storage costs'
      ]
    }
  ],

  'crs_git': [
    {
      lessonTitle: 'Git Distributed Version Control & Team Workflows',
      videoTimestamp: '00:00 - 20:00',
      coreConcepts: [
        'Git Object Model: Blobs, Trees, Commits, and Annotated Tags',
        'Branching Models: Feature Branch Workflow, GitFlow, Trunk-Based Development',
        'Merge vs Rebase trade-offs and Conflict Resolution',
        'Interactive Rebase (git rebase -i) and Commit Squashing'
      ],
      inDepthTheory: `Git is a content-addressable distributed version control system. Every file is hashed using SHA-1/SHA-256 into a Blob object. Directory trees are represented by Tree objects, and commits point to a top-level Tree object along with metadata and parent commit hashes.

When creating a branch with \`git branch feature\`, Git merely creates a 41-byte pointer reference file pointing to a commit hash in \`.git/refs/heads/\`, making branch creation $O(1)$ instantaneous.`,
      codeBreakdown: {
        snippet: `# Clean up commit history before pull request review
git checkout feature-branch
git fetch origin main
git rebase origin/main
# Fix conflicts if any, then:
git add . && git rebase --continue
git push --force-with-lease origin feature-branch`,
        explanation: 'Rebases branch linearly onto latest main and safely pushes using --force-with-lease to avoid overwriting teammate commits.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between git reset --soft, --mixed, and --hard?',
          answer: '--soft moves HEAD to target commit leaving changes in Staging Index; --mixed (default) resets HEAD and un-stages files into Working Directory; --hard wipes out all unstaged and uncommitted changes permanently.'
        }
      ],
      keyTakeaways: [
        'Use git stash for quick context switches',
        'Always write descriptive commit messages in imperative present tense'
      ]
    }
  ],

  'crs_oop': [
    {
      lessonTitle: 'SOLID Principles & GoF Design Patterns',
      videoTimestamp: '00:00 - 26:00',
      coreConcepts: [
        'Single Responsibility & Open-Closed Principles',
        'Liskov Substitution & Interface Segregation',
        'Dependency Inversion via Inversion of Control (IoC) containers',
        'Creational (Factory/Singleton), Structural (Adapter/Decorator), Behavioral (Strategy/Observer)'
      ],
      inDepthTheory: `Software maintainability depends on loose coupling and high cohesion. The SOLID principles ensure extensible codebases:
- Single Responsibility: A class should have only one reason to change.
- Open-Closed: Software entities should be open for extension, but closed for modification.
- Liskov Substitution: Derived classes must be substitutable for their base classes without breaking program correctness.
- Interface Segregation: Clients should not be forced to depend on interfaces they do not use.
- Dependency Inversion: High-level modules should not depend on low-level modules; both should depend on abstractions.`,
      codeBreakdown: {
        snippet: `// Strategy Pattern in TypeScript
interface PaymentStrategy {
  process(amount: number): boolean;
}

class StripePayment implements PaymentStrategy {
  process(amount: number) { console.log(\`Charged $\${amount} via Stripe\`); return true; }
}

class PayPalPayment implements PaymentStrategy {
  process(amount: number) { console.log(\`Charged $\${amount} via PayPal\`); return true; }
}

class CheckoutService {
  constructor(private strategy: PaymentStrategy) {}
  execute(amount: number) { return this.strategy.process(amount); }
}`,
        explanation: 'Enables swapping payment processors at runtime without altering core checkout business logic.'
      },
      interviewQnA: [
        {
          question: 'What is the difference between Factory Method and Abstract Factory patterns?',
          answer: 'Factory Method uses inheritance and subclasses to create a single product. Abstract Factory uses object composition to produce entire families of related or dependent products without specifying concrete classes.'
        }
      ],
      keyTakeaways: [
        'Favor composition over inheritance to prevent fragile base class hierarchies',
        'Keep domain entities decoupled from UI and database frameworks'
      ]
    }
  ],

  'crs_aptitude': [
    {
      lessonTitle: 'Quantitative Aptitude Shortcuts & Placement Speed Math',
      videoTimestamp: '00:00 - 22:00',
      coreConcepts: [
        'Percentage to Fraction Fast Conversions (1/7 = 14.28%, 1/8 = 12.5%, 1/12 = 8.33%)',
        'Time & Work LCM method for multi-worker pipelines',
        'Time, Speed & Distance: Relative Speed in Trains, Boats & Streams',
        'Permutations (Arrangements) vs Combinations (Selections) & Probability'
      ],
      inDepthTheory: `Campus placement quantitative tests evaluate speed, pattern recognition, and numerical agility.

The LCM Method for Time & Work:
If Worker A completes a job in 12 days and Worker B in 15 days:
1. Find LCM of (12, 15) = 60 Units (Total Work).
2. Efficiency of A = 60 / 12 = 5 units/day.
3. Efficiency of B = 60 / 15 = 4 units/day.
4. Combined Efficiency = 5 + 4 = 9 units/day.
5. Total Time = 60 / 9 = 6.67 days. This avoids fractional additions!`,
      codeBreakdown: {
        snippet: `# Fast Relative Speed calculation for trains crossing
# Train 1: Length L1 = 150m, Speed S1 = 54 km/h (15 m/s)
# Train 2: Length L2 = 120m, Speed S2 = 36 km/h (10 m/s)
# Crossing in opposite directions:
total_distance = 150 + 120  # 270 meters
relative_speed = 15 + 10    # 25 m/s
time_taken = total_distance / relative_speed # 10.8 seconds`,
        explanation: 'Converts km/h to m/s by multiplying with 5/18 and computes collision crossing time.'
      },
      interviewQnA: [
        {
          question: 'How do you calculate compound interest quickly without long polynomial calculations?',
          answer: 'Use the successive percentage formula: Effective 2-Year Rate = a + b + (ab / 100). For 10% per year, 2 years = 10 + 10 + (100 / 100) = 21%.'
        }
      ],
      keyTakeaways: [
        'Memorize squares up to 30 and cubes up to 15',
        'Use digit-sum and divisibility rules (7, 11, 13) to eliminate choices in seconds'
      ]
    }
  ],

  'crs_interview': [
    {
      lessonTitle: 'System Design Framework & Behavioral Interview Mastery',
      videoTimestamp: '00:00 - 35:00',
      coreConcepts: [
        'The 4-Step System Design Interview Framework',
        'CAP Theorem: Consistency, Availability, Partition Tolerance',
        'Horizontal vs Vertical Scaling, Caching Strategies (Write-Through vs Write-Back)',
        'Behavioral STAR Method: Situation, Task, Action, Result'
      ],
      inDepthTheory: `System Design interviews test your ability to design scalable, fault-tolerant distributed web platforms.

The 4-Step Framework:
1. Requirements Clarification (5 mins): Estimate daily active users (DAU), read/write ratio, latency SLAs, non-functional availability targets.
2. Capacity & Back-of-the-envelope estimations (5 mins): QPS, storage requirements for 5 years, bandwidth ingestion.
3. High-Level Architecture (15 mins): API gateway, load balancers, application microservices, database schema, caching tier.
4. Deep Dive & Bottlenecks (15 mins): Database sharding keys, cache eviction policies (LRU), single points of failure, rate limiters.`,
      codeBreakdown: {
        snippet: `// Rate Limiter Token Bucket Algorithm in Redis Lua Script
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local current = tonumber(redis.call('get', key) or "0")

if current + 1 > limit then
    return 0 -- Rejected (Rate limit exceeded)
else
    redis.call("INCRBY", key, 1)
    redis.call("EXPIRE", key, 60)
    return 1 -- Allowed
end`,
        explanation: 'Atomic Redis rate limiter preventing API abuse and DDoS attacks.'
      },
      interviewQnA: [
        {
          question: 'According to the CAP theorem, why can a distributed system not guarantee both Consistency and Availability under Network Partition?',
          answer: 'In the presence of a network partition (network split between nodes), the system must choose between returning potentially stale data (Availability) or refusing to answer/erroring out until nodes synchronize (Consistency).'
        }
      ],
      keyTakeaways: [
        'Structure answers using the STAR method for behavioral questions',
        'Always discuss trade-offs (Latency vs Consistency, Cost vs Redundancy)'
      ]
    }
  ]
};
