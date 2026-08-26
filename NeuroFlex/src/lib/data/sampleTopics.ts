import { Topic, UserProgress, UserSettings } from "@/types";

export const sampleTopics: Topic[] = [
  {
    id: "tcp-handshake",
    slug: "tcp-three-way-handshake",
    title: "TCP Three-Way Handshake",
    subtitle: "How two computers establish a synchronized, reliable connection before sending data",
    category: "Computer Science",
    difficulty: "Beginner",
    estimatedMinutes: 5,
    tags: ["Networking", "Protocols", "TCP/IP", "Internet"],
    representations: {
      analogy: {
        title: "The Walkie-Talkie Radio Check",
        simpleExplanation:
          "The TCP Three-Way Handshake is a 3-step conversation two computers have before transmitting information: 1) 'Can you hear me?', 2) 'Yes, I hear you, can you hear me?', and 3) 'Yes, I hear you loud and clear! Let\'s begin.'",
        metaphor:
          "Imagine two hikers communicating across a misty canyon with walkie-talkies. Before reading out important coordinates, they must verify both radios can send AND receive without static.",
        narrative: `Before transferring data over the internet, a Client and Server must ensure both directions of communication are open:

1. **Step 1 (SYN - Synchronize)**: Hiker A presses the button: *"Hey, this is Hiker A starting at signal #100. Do you copy?"* (Client sends SYN with initial sequence number).
2. **Step 2 (SYN-ACK - Synchronize & Acknowledge)**: Hiker B responds: *"Copy that #100! I hear you! This is Hiker B starting my own signal at #300. Do you copy me?"* (Server acknowledges Client #100 and sends its own sequence #300).
3. **Step 3 (ACK - Acknowledge)**: Hiker A confirms: *"Copy that #300! I hear you loud and clear!"* (Client acknowledges Server #300).

Now, both sides know for certain that both transmitters and both receivers work perfectly. Data transmission can proceed with zero ambiguity.`,
        simplerExplanation:
          "Think of saying hello on the phone: You say 'Hello?' (SYN). The other person says 'Hey, I can hear you, can you hear me?' (SYN-ACK). You reply 'Yep, sounds good!' (ACK). Now you start talking.",
        breakdown: [
          {
            conceptTerm: "SYN (Synchronize Packet)",
            analogyEquivalent: "First Check: 'Can you hear me?'",
            explanation: "The client asks the server to establish a connection and agrees on a starting sequence number.",
          },
          {
            conceptTerm: "SYN-ACK (Sync + Acknowledge)",
            analogyEquivalent: "Confirmation + Reverse Check: 'Heard you, can you hear me back?'",
            explanation: "The server acknowledges the client's request and sends its own sequence number back.",
          },
          {
            conceptTerm: "ACK (Acknowledge Packet)",
            analogyEquivalent: "Final Go-Ahead: 'Yes, loud and clear!'",
            explanation: "The client confirms receipt of the server's sequence number. The socket is now ESTABLISHED.",
          },
          {
            conceptTerm: "Sequence Numbers",
            analogyEquivalent: "Numbered Page Slips",
            explanation: "Ensures packets arriving out of order can be reassembled in the exact original sequence.",
          },
        ],
        keyTakeaway:
          "TCP requires three steps because each computer must independently prove it can send AND receive before reliable transmission begins.",
        alternativeAnalogies: [
          {
            title: "The Formal Business Contract Handshake",
            metaphor:
              "Two international business partners signing a reciprocal agreement: Party A sends a signed offer, Party B countersigns and sends their copy back, and Party A confirms receipt of the signed counterpart.",
            narrative:
              "Neither party begins shipping goods until both signatures have been formally exchanged and verified by both sides.",
            breakdown: [
              {
                conceptTerm: "SYN",
                analogyEquivalent: "Party A signs and mails Offer Letter",
                explanation: "Initiates proposal with terms.",
              },
              {
                conceptTerm: "SYN-ACK",
                analogyEquivalent: "Party B signs approval + mails counter-terms",
                explanation: "Confirms Offer A and proposes Server terms.",
              },
              {
                conceptTerm: "ACK",
                analogyEquivalent: "Party A delivers final receipt receipt",
                explanation: "Both parties enter an active binding contract.",
              },
            ],
            keyTakeaway:
              "Mutual verification prevents either side from transmitting data into a dead end.",
          },
        ],
      },
      flowchart: {
        diagramType: "sequence",
        mermaidCode: `sequenceDiagram
    autonumber
    actor Client as 💻 Client (Browser)
    actor Server as 🌐 Server (Host)

    Note over Client,Server: Phase 1: Connection Request
    Client->>Server: 1. SYN (seq = 100, SYN flag = 1)
    Note over Server: State: LISTEN ➔ SYN_RECEIVED

    Note over Client,Server: Phase 2: Acknowledgment & Response
    Server->>Client: 2. SYN-ACK (ack = 101, seq = 300)
    Note over Client: State: SYN_SENT ➔ ESTABLISHED

    Note over Client,Server: Phase 3: Final Handshake Confirmation
    Client->>Server: 3. ACK (ack = 301, seq = 101)
    Note over Server: State: SYN_RECEIVED ➔ ESTABLISHED

    Note over Client,Server: 🚀 Connection Established! Safe Data Transfer Begins`,
        steps: [
          {
            id: "step-1",
            nodeKey: "SYN",
            label: "1. SYN Flag Sent",
            description: "Client sends an initial sequence number (ISN) requesting a connection.",
            phase: "Initiation",
          },
          {
            id: "step-2",
            nodeKey: "SYN-ACK",
            label: "2. SYN-ACK Received",
            description: "Server increments client's seq by 1 and sends its own server ISN.",
            phase: "Mutual Handshake",
          },
          {
            id: "step-3",
            nodeKey: "ACK",
            label: "3. ACK Confirmation",
            description: "Client increments server seq by 1. Both endpoints enter ESTABLISHED state.",
            phase: "Connection Established",
          },
        ],
        coreInsight:
          "Two messages are not enough because the server would never know if the client received its acknowledgment.",
      },
      socratic: {
        questions: [
          {
            id: "tcp-q1",
            question: "Why can't a reliable TCP connection be established in only TWO steps (SYN then SYN-ACK) instead of THREE?",
            context: "Consider what the Server knows vs what the Client knows after Step 2.",
            options: [
              {
                id: "opt-1",
                text: "Because after Step 2, the Server has no confirmation whether the Client successfully received its SYN-ACK response.",
                explanation: "Correct! If the 3rd packet (ACK) is omitted, the server cannot know if its response was lost in transit.",
                isCorrect: true,
              },
              {
                id: "opt-2",
                text: "Because the internet firewall protocol requires odd-numbered packet counts.",
                explanation: "Incorrect. Packet protocols are not governed by odd/even rules.",
                isCorrect: false,
              },
              {
                id: "opt-3",
                text: "Because sequence numbers must always be multiplied by 3 before data transmission.",
                explanation: "Incorrect. Sequence numbers increment by 1 per handshake step.",
                isCorrect: false,
              },
              {
                id: "opt-4",
                text: "Because the client needs a 3rd step to calculate the download file size.",
                explanation: "Incorrect. File sizes are application layer metadata (HTTP headers), not TCP handshake requirements.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "What vulnerability occurs if a malicious actor sends thousands of SYN packets but never sends the final ACK?",
            hint: "Look at what state the server enters after receiving SYN.",
          },
          {
            id: "tcp-q2",
            question: "What happens to the sequence number during each step of the handshake?",
            context: "Observe the numbers in the sequence diagram: 100 -> 101, 300 -> 301.",
            options: [
              {
                id: "q2-opt1",
                text: "Each acknowledgment packet sets ack = (received seq + 1) to confirm the next expected byte.",
                explanation: "Exact! ack = seq + 1 signals: 'I received everything up to seq, now send me seq + 1.'",
                isCorrect: true,
              },
              {
                id: "q2-opt2",
                text: "The sequence number resets to zero at every step.",
                explanation: "Incorrect. Resetting to zero would cause packet collision and lost order.",
                isCorrect: false,
              },
              {
                id: "q2-opt3",
                text: "The sequence number doubles on every hop.",
                explanation: "Incorrect. Sequence numbers increment linearly.",
                isCorrect: false,
              },
              {
                id: "q2-opt4",
                text: "Sequence numbers are randomly regenerated on every packet.",
                explanation: "Incorrect. ISN is random once at the start, then increments predictably.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "Why are Initial Sequence Numbers (ISNs) randomized rather than starting at 0 for every socket?",
            hint: "Think about old delayed packets from previous closed connections.",
          },
        ],
        overallSummary:
          "The three-way handshake guarantees bidirectional reliability through synchronized sequence numbers.",
      },
    },
  },
  {
    id: "binary-search",
    slug: "binary-search",
    title: "Binary Search",
    subtitle: "Logarithmic search algorithm that cuts search space in half with each comparison",
    category: "Computer Science",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    tags: ["Algorithms", "Searching", "Data Structures", "Divide and Conquer"],
    representations: {
      analogy: {
        title: "The Dictionary Page Splitter",
        simpleExplanation:
          "Binary Search is a lightning-fast way to find an item in a sorted list by repeatedly dividing the search area in half. If your target is higher, you discard the bottom half; if lower, you discard the top half.",
        metaphor:
          "Imagine looking for the word 'Neuroscience' in a 1,000-page physical dictionary. You don't flip one page at a time starting from 'A'. You flip straight to the middle (page 500: letter 'M'), notice 'N' comes after 'M', and instantly tear away the first 500 pages.",
        narrative: `Finding an item in an unsorted pile takes $O(N)$ time—you must check every single item one by one.

In a **sorted** list, Binary Search operates in $O(\\log N)$ time:
1. Find the middle element: $\\text{mid} = \\lfloor(\\text{low} + \\text{high}) / 2\\rfloor$.
2. Compare:
   - Is it the target? You're done!
   - Is target smaller? Search only the **left half** (set $\\text{high} = \\text{mid} - 1$).
   - Is target larger? Search only the **right half** (set $\\text{low} = \\text{mid} + 1$).
3. Repeat until found or search interval is exhausted ($\text{low} > \text{high}$).

Even in a list of 1,000,000 items, you find any item in at most **20 comparisons** ($2^{20} > 1,000,000$).`,
        simplerExplanation:
          "Think of guessing a secret number between 1 and 100. If you guess 50 and the host says 'Higher!', you instantly know the answer is between 51 and 100. You eliminated 50 numbers with just one guess!",
        breakdown: [
          {
            conceptTerm: "Pre-condition: Sorted Array",
            analogyEquivalent: "Alphabetized Dictionary",
            explanation: "Binary search strictly requires items to be in ordered sequence to know which half to eliminate.",
          },
          {
            conceptTerm: "Midpoint Calculation",
            analogyEquivalent: "Opening to the Exact Center Page",
            explanation: "mid = low + (high - low)/2 gives the pivot value to compare against.",
          },
          {
            conceptTerm: "Branch Elimination",
            analogyEquivalent: "Discarding half the book",
            explanation: "Halves remaining items in each iteration, giving logarithmic O(log N) efficiency.",
          },
          {
            conceptTerm: "Base Termination (low > high)",
            analogyEquivalent: "Pages run out without finding word",
            explanation: "Target is definitively confirmed absent from the collection.",
          },
        ],
        keyTakeaway:
          "Binary Search achieves exponential speed by throwing away 50% of the remaining search space on every single decision.",
        alternativeAnalogies: [
          {
            title: "The High-Low Number Guessing Game",
            metaphor: "Guessing a secret number from 1 to 100 where the computer only tells you 'Too High' or 'Too Low'.",
            narrative: "Starting at 50, then 75, then 88, then 81—each guess eliminates half of all remaining possibilities in seconds.",
            breakdown: [
              { conceptTerm: "Target", analogyEquivalent: "Secret number", explanation: "Value to match" },
              { conceptTerm: "Comparison", analogyEquivalent: "Too high / too low feedback", explanation: "Directional clue" },
            ],
            keyTakeaway: "Doubling dataset size only adds 1 additional comparison.",
          },
        ],
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart TD
    Start([Start: Sorted Array & Target]) --> Init[Set low = 0, high = N - 1]
    Init --> Check{"Is low <= high?"}
    
    Check -->|No| NotFound([Target Not Found in Array - Return -1])
    Check -->|Yes| Calc[Calculate mid = low + high / 2]
    
    Calc --> Compare{"Compare Array[mid] with Target"}
    
    Compare -->|Array[mid] == Target| Found([🎯 Target Found at Index mid!])
    Compare -->|Array[mid] < Target| GoRight["Target is Greater ➔ Set low = mid + 1"]
    Compare -->|Array[mid] > Target| GoLeft["Target is Smaller ➔ Set high = mid - 1"]
    
    GoRight --> Check
    GoLeft --> Check

    classDef success fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef decision fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef process fill:#0e7490,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef failure fill:#7f1d1d,stroke:#f43f5e,stroke-width:2px,color:#fff;

    class Found success;
    class Check,Compare decision;
    class Init,Calc,GoRight,GoLeft process;
    class NotFound failure;`,
        steps: [
          { id: "s1", nodeKey: "Init", label: "Boundary Initialization", description: "Pointers set to array start (0) and end (N-1).", phase: "Setup" },
          { id: "s2", nodeKey: "Calc", label: "Pivot Midpoint", description: "Inspect center item of current sub-range.", phase: "Inspection" },
          { id: "s3", nodeKey: "Compare", label: "Half Discard", description: "Shrink window to left or right sub-array.", phase: "Elimination" },
        ],
        coreInsight: "A list of 4 billion items requires at most 32 comparisons.",
      },
      socratic: {
        questions: [
          {
            id: "bs-q1",
            question: "What is the prerequisite condition for Binary Search to work correctly?",
            options: [
              {
                id: "bs1-opt1",
                text: "The data collection must be sorted in monotonic (ascending or descending) order.",
                explanation: "Correct! If the data is unsorted, discarding half might throw away the target.",
                isCorrect: true,
              },
              {
                id: "bs1-opt2",
                text: "The total number of elements must always be an exact power of 2.",
                explanation: "Incorrect. Binary search works on arrays of any arbitrary length.",
                isCorrect: false,
              },
              {
                id: "bs1-opt3",
                text: "All elements in the array must be positive integers.",
                explanation: "Incorrect. It works on strings, floats, dates, or any comparable object.",
                isCorrect: false,
              },
              {
                id: "bs1-opt4",
                text: "The array must be stored on an SSD drive.",
                explanation: "Incorrect. Hardware storage medium is irrelevant to the algorithmic logic.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "Why does calculating 'mid = (low + high) / 2' cause integer overflow bugs in languages like Java or C++?",
            hint: "Think about what happens if low + high exceeds 2,147,483,647.",
          },
        ],
        overallSummary: "Binary search replaces linear brute force with logarithmic elimination.",
      },
    },
  },
  {
    id: "neural-networks",
    slug: "neural-networks",
    title: "Neural Networks",
    subtitle: "Layers of interconnected artificial neurons that learn patterns through forward passes and backpropagation",
    category: "Artificial Intelligence",
    difficulty: "Intermediate",
    estimatedMinutes: 7,
    tags: ["AI", "Deep Learning", "Weights", "Backpropagation"],
    representations: {
      analogy: {
        title: "The Recipe Tasting Kitchen",
        simpleExplanation:
          "A neural network is an interconnected computational model inspired by biological brains. Data passes through multiple layers of nodes (neurons), where each connection has a weight (importance) that is tuned automatically to recognize complex patterns.",
        metaphor:
          "Imagine an industrial test kitchen preparing soup: Seasoning chefs (input layer) add ingredients, Sauce master chefs (hidden layers) blend flavors, and Head chefs (output layer) grade the soup. If the soup tastes off (Error/Loss), feedback travels backward so each chef tweaks their spice measurements.",
        narrative: `A Neural Network processes information in two complementary passes:
1. **Forward Propagation**: Input data (pixels, text, numbers) is multiplied by connection **weights**, summed with a **bias**, and passed through an **activation function** (like ReLU) to decide whether to activate the next neuron.
2. **Loss Calculation**: The final prediction is compared against the true target to measure error.
3. **Backward Propagation (Backprop)**: Calculus (chain rule) calculates gradients, and the optimizer (like Adam or SGD) nudges each weight slightly in the direction that minimizes overall loss.`,
        simplerExplanation:
          "Think of tuning a guitar with 1,000 strings. You pluck a string (input), listen to the tone (output), and turn the peg slightly until the sound is harmonious (backpropagation).",
        breakdown: [
          {
            conceptTerm: "Weights (W)",
            analogyEquivalent: "Volume Dial on Each Instrument",
            explanation: "Determines how strongly a signal from one neuron influences the next neuron.",
          },
          {
            conceptTerm: "Activation Function",
            analogyEquivalent: "Light Switch Trigger (Threshold)",
            explanation: "Introduces non-linearity so the network can learn complex curvy decision boundaries.",
          },
          {
            conceptTerm: "Loss Function",
            analogyEquivalent: "Scorecard / Error Margin",
            explanation: "Quantifies how far off the prediction was from the actual ground truth.",
          },
          {
            conceptTerm: "Backpropagation",
            analogyEquivalent: "Chef Feedback Relay",
            explanation: "Calculates which specific weights contributed most to the error and updates them.",
          },
        ],
        keyTakeaway:
          "Neural networks learn not by hardcoded rules, but by iteratively adjusting millions of tiny weights through gradient descent.",
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart LR
    subgraph Inputs ["Input Layer"]
      X1["Feature x₁"]
      X2["Feature x₂"]
    end

    subgraph Hidden ["Hidden Layer (Non-Linear)"]
      H1["Neuron h₁ = σ(W₁·X + b₁)"]
      H2["Neuron h₂ = σ(W₂·X + b₂)"]
    end

    subgraph Output ["Output Layer"]
      Y["Prediction ŷ"]
    end

    subgraph Feedback ["Loss & Backpropagation"]
      Loss["Loss: L(ŷ, y_true)"]
      Grad["Gradient Descent ∇W"]
    end

    X1 --> H1
    X1 --> H2
    X2 --> H1
    X2 --> H2

    H1 --> Y
    H2 --> Y

    Y --> Loss
    Loss --> Grad
    Grad -.->|Update Weights| Hidden

    classDef inp fill:#1e293b,stroke:#94a3b8,stroke-width:2px,color:#fff;
    classDef hid fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef out fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef opt fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff;

    class X1,X2 inp;
    class H1,H2 hid;
    class Y out;
    class Loss,Grad opt;`,
        steps: [
          { id: "s1", nodeKey: "Inputs", label: "Forward Pass", description: "Features flow across weighted synapses through non-linear activations.", phase: "Inference" },
          { id: "s2", nodeKey: "Loss", label: "Error Measurement", description: "Quantifies the discrepancy between prediction and true label.", phase: "Evaluation" },
          { id: "s3", nodeKey: "Grad", label: "Backpropagation", description: "Gradients flow in reverse using the Chain Rule to adjust weights.", phase: "Optimization" },
        ],
        coreInsight: "Non-linear activation functions enable networks to approximate any mathematical function.",
      },
      socratic: {
        questions: [
          {
            id: "nn-q1",
            question: "Why do neural networks require NON-LINEAR activation functions (like ReLU or Sigmoid) between hidden layers?",
            options: [
              {
                id: "nn1-opt1",
                text: "Without non-linear activations, stacking 100 layers collapses mathematically into just a single simple linear regression (matrix multiplication).",
                explanation: "Correct! The composition of multiple linear functions is strictly linear, unable to learn complex non-linear patterns.",
                isCorrect: true,
              },
              {
                id: "nn1-opt2",
                text: "To prevent GPUs from overheating during training runs.",
                explanation: "Incorrect. Activation choice is mathematical, not thermal.",
                isCorrect: false,
              },
              {
                id: "nn1-opt3",
                text: "Because binary computers cannot perform floating-point addition without non-linearity.",
                explanation: "Incorrect. Computers perform linear arithmetic natively.",
                isCorrect: false,
              },
              {
                id: "nn1-opt4",
                text: "To automatically delete corrupted dataset images.",
                explanation: "Incorrect. Activation functions compute neuron outputs, not dataset cleaning.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "What is the 'Vanishing Gradient Problem' and why does ReLU help prevent it compared to Sigmoid?",
            hint: "Look at the derivative of Sigmoid for large inputs vs ReLU derivative (1.0).",
          },
        ],
        overallSummary: "Neural networks combine weighted linear transforms with non-linear activations to model complex real-world data.",
      },
    },
  },
  {
    id: "photosynthesis-reactions",
    slug: "photosynthesis",
    title: "Photosynthesis",
    subtitle: "How plants transform sunlight, water, and carbon dioxide into oxygen and chemical glucose energy",
    category: "Biology & Life Sciences",
    difficulty: "Beginner",
    estimatedMinutes: 6,
    tags: ["Biology", "Chloroplasts", "Calvin Cycle", "Light Reactions"],
    representations: {
      analogy: {
        title: "The Solar-Powered Bakery",
        simpleExplanation:
          "Photosynthesis is the biological process plants use to convert light energy from the sun into chemical sugar (glucose). In the chloroplasts, water and carbon dioxide are converted into glucose fuel, releasing oxygen as a byproduct.",
        metaphor:
          "Imagine a solar-powered bakery: Sunlight powers the electric ovens (Light Reactions), while the bakers mix water from the tap and carbon dioxide from the air to bake fresh loaves of sugar bread (Calvin Cycle).",
        narrative: `Photosynthesis occurs in two synchronized stages inside plant chloroplasts:
1. **Light-Dependent Stage (Thylakoids)**: Sunlight strikes chlorophyll, exciting electrons and splitting water molecules ($H_2O$) to produce Oxygen ($O_2$), generating ATP and NADPH energy batteries.
2. **Light-Independent Stage / Calvin Cycle (Stroma)**: Carbon dioxide ($CO_2$) is captured from the atmosphere and combined with hydrogen using the ATP/NADPH energy produced in Stage 1 to build stable glucose ($C_6H_{12}O_6$).`,
        simplerExplanation:
          "Plants drink water through roots, breathe in carbon dioxide from air, catch sunlight with green leaves, and make sweet glucose food while breathing out fresh oxygen for us!",
        breakdown: [
          { conceptTerm: "Chlorophyll", analogyEquivalent: "Solar Panels on the Roof", explanation: "Green pigment absorbing photons." },
          { conceptTerm: "Light Reactions", analogyEquivalent: "Charging the Kitchen Batteries", explanation: "Converts light into ATP & NADPH." },
          { conceptTerm: "Calvin Cycle", analogyEquivalent: "Baking Loaves of Sugar Bread", explanation: "Uses energy carriers to fix CO2 into glucose." },
        ],
        keyTakeaway:
          "Photosynthesis converts solar electromagnetic radiation into stable chemical bonds that sustain virtually all life on Earth.",
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart TD
    Sun["☀️ Sunlight Energy"] --> PS["Photosystem II & I (Thylakoids)"]
    H2O["💧 Water (H₂O)"] --> PS
    
    PS -->|Photolysis: Water Split| O2["🍃 Oxygen (O₂) Released"]
    PS -->|Produces Energy Carriers| Carriers["🔋 ATP + NADPH Batteries"]
    
    Carriers --> Calvin["🌱 Calvin Cycle (Stroma)"]
    CO2["💨 Carbon Dioxide (CO₂)"] --> Calvin
    
    Calvin --> Glucose["🍞 Glucose Sugar (C₆H₁₂O₆ Energy)"]

    classDef sun fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff;
    classDef light fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef cycle fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef product fill:#14532d,stroke:#34d399,stroke-width:2px,color:#fff;

    class Sun,H2O,CO2 sun;
    class PS,Carriers light;
    class Calvin cycle;
    class O2,Glucose product;`,
        steps: [
          { id: "s1", nodeKey: "PS", label: "Light Absorption & Water Splitting", description: "Thylakoids convert photons into ATP and emit oxygen.", phase: "Light Reactions" },
          { id: "s2", nodeKey: "Calvin", label: "Carbon Fixation", description: "Stroma utilizes ATP/NADPH to bind CO2 into carbohydrates.", phase: "Dark Reactions" },
        ],
        coreInsight: "Water splitting supplies the missing electrons after chlorophyll is energized by light photons.",
      },
      socratic: {
        questions: [
          {
            id: "photo-q1",
            question: "Where does the Oxygen ($O_2$) released during photosynthesis originate from?",
            options: [
              {
                id: "ph1-opt1",
                text: "From the splitting of water molecules ($H_2O$) during the light-dependent reactions.",
                explanation: "Correct! Photolysis cracks H2O into protons, electrons, and O2 exhaust.",
                isCorrect: true,
              },
              {
                id: "ph1-opt2",
                text: "From carbon dioxide ($CO_2$) gas inhaled through leaves.",
                explanation: "Incorrect. The oxygen in CO2 is incorporated into the glucose sugar molecule, not released as free gas.",
                isCorrect: false,
              },
              {
                id: "ph1-opt3",
                text: "From nitrogen compounds inside soil fertilizer.",
                explanation: "Incorrect. Fertilizer provides nitrates for proteins, not photosynthetic oxygen.",
                isCorrect: false,
              },
              {
                id: "ph1-opt4",
                text: "From solar photons transforming directly into gas.",
                explanation: "Incorrect. Photons are pure energy without mass, not chemical elements.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "What would happen to plant glucose synthesis if carbon dioxide was completely removed from the environment?",
            hint: "Check which step requires CO2 in the flowchart.",
          },
        ],
        overallSummary: "Light reactions generate high-energy carriers that drive the enzymatic fixation of carbon into sugars.",
      },
    },
  },
  {
    id: "quantum-entanglement",
    slug: "quantum-entanglement",
    title: "Quantum Entanglement",
    subtitle: "When pairs of quantum particles become deeply correlated such that measuring one instantaneously determines the other",
    category: "Physics & Quantum",
    difficulty: "Advanced",
    estimatedMinutes: 8,
    tags: ["Quantum Mechanics", "Physics", "Qubits", "Bell State"],
    representations: {
      analogy: {
        title: "The Magic Pair of Shoes in Sealed Boxes",
        simpleExplanation:
          "Quantum Entanglement is a phenomenon where two quantum particles become linked so that measuring the state of one (e.g. its spin) instantly reveals the state of the other, no matter how far apart they are in the universe.",
        metaphor:
          "Imagine a factory puts a matching pair of shoes into two identical sealed boxes—one Left shoe, one Right shoe—and sends one box to Tokyo and the other to London. Before opening either box, both exist in a state of unknown potential. The instant you open the box in Tokyo and find a Left shoe, you know with 100% certainty the London box holds the Right shoe.",
        narrative: `Einstein famously called this phenomenon *"spooky action at a distance"*.

When two particles are created in an entangled Bell state $|\\Phi^+\\rangle = \\frac{1}{\\sqrt{2}}(|00\\rangle + |11\\rangle)$:
- Neither particle has a defined spin on its own before measurement.
- The measurement on particle A collapses its wavefunction into state $|0\\rangle$ or $|1\\rangle$.
- Particle B's state collapses synchronously into the matching correlated state, even if separated by light-years.
- Entanglement does **not** allow faster-than-light communication (No-Communication Theorem) because the measurement outcome itself is purely random.`,
        simplerExplanation:
          "Imagine flipping two magical coins on opposite sides of the world. Each coin flips randomly, but whenever Coin A lands on Heads, Coin B always lands on Tails at the exact same split second!",
        breakdown: [
          { conceptTerm: "Entangled State |Ψ⟩", analogyEquivalent: "Sealed Shoe Boxes", explanation: "A single unified mathematical wave function describing both particles." },
          { conceptTerm: "Measurement Collapse", analogyEquivalent: "Opening Box in Tokyo", explanation: "Forces the indeterminate probability cloud into a concrete classical value." },
          { conceptTerm: "Instant Correlation", analogyEquivalent: "Instant knowledge of London box", explanation: "The paired state is immediately fixed without physical signal travel." },
        ],
        keyTakeaway:
          "Entanglement demonstrates that quantum reality is fundamentally non-local: entangled particles behave as a single unified system regardless of spatial distance.",
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart TD
    Source["⚛️ Entangled Photon Source"] -->|Generates Pair| BellState["Entangled Bell State: |ψ⟩ = (|00⟩ + |11⟩) / √2"]
    
    BellState -->|Photon A travels to| Alice["👩 Alice in Tokyo Lab"]
    BellState -->|Photon B travels to| Bob["👨 Bob in London Lab"]
    
    Alice --> MeasureA{"Alice Measures Photon A Spin"}
    MeasureA -->|State Collapses to |0⟩| CollapsedA["Alice observes Spin UP ↑"]
    
    CollapsedA -.->|Instantaneous Non-Local Correlation| CollapsedB["Bob's Photon B collapses to Spin UP ↑"]
    Bob --> MeasureB{"Bob Measures Photon B"}
    MeasureB --> CollapsedB

    classDef quantum fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef lab fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef measure fill:#78350f,stroke:#f59e0b,stroke-width:2px,color:#fff;

    class Source,BellState quantum;
    class Alice,Bob lab;
    class MeasureA,MeasureB,CollapsedA,CollapsedB measure;`,
        steps: [
          { id: "s1", nodeKey: "BellState", label: "Entangled State Creation", description: "Two particles share an inseparable joint quantum state.", phase: "Creation" },
          { id: "s2", nodeKey: "MeasureA", label: "Measurement & Collapse", description: "Alice's observation forces the system wavefunction to collapse.", phase: "Observation" },
        ],
        coreInsight: "Entanglement does not violate Special Relativity because no controllable message signal is transmitted.",
      },
      socratic: {
        questions: [
          {
            id: "qe-q1",
            question: "Why can't Alice use quantum entanglement to send instant Morse code messages to Bob on Mars faster than light?",
            options: [
              {
                id: "qe1-opt1",
                text: "Because Alice cannot choose or force the outcome of her measurement—it is purely random, so Bob only observes random static until Alice sends a classical decoding key.",
                explanation: "Correct! The No-Communication Theorem proves that because quantum measurement outcomes are random, no controllable information travels.",
                isCorrect: true,
              },
              {
                id: "qe1-opt2",
                text: "Because space vacuum slows down quantum entanglement waves.",
                explanation: "Incorrect. Entanglement is instantaneous and does not travel as a physical wave through space.",
                isCorrect: false,
              },
              {
                id: "qe1-opt3",
                text: "Because Mars has a different magnetic field that disables qubits.",
                explanation: "Incorrect. Planetary magnetic fields can be shielded and do not break entanglement principle.",
                isCorrect: false,
              },
              {
                id: "qe1-opt4",
                text: "Because Morse code frequencies are too low for quantum states.",
                explanation: "Incorrect. The constraint is fundamental information theory, not Morse code encoding.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "How does Quantum Key Distribution (QKD) use entanglement to detect eavesdroppers?",
            hint: "What happens to the entangled state if an eavesdropper attempts to measure the photons in flight?",
          },
        ],
        overallSummary: "Quantum entanglement represents non-local correlation without violating causality.",
      },
    },
  },
  {
    id: "stack-data-structure",
    slug: "stack-data-structure",
    title: "Stack Data Structure",
    subtitle: "LIFO (Last-In, First-Out) linear collection supporting constant time push and pop operations",
    category: "Computer Science",
    difficulty: "Beginner",
    estimatedMinutes: 4,
    tags: ["Data Structures", "LIFO", "Memory", "Algorithms"],
    representations: {
      analogy: {
        title: "The Cafeteria Spring-Loaded Plate Dispenser",
        simpleExplanation:
          "A Stack is a Last-In, First-Out (LIFO) data structure. You can only add new items to the very top (Push) and remove items from the very top (Pop). The last item put in is always the first item taken out.",
        metaphor:
          "Imagine a spring-loaded plate dispenser in a buffet cafeteria: When the dishwasher cleans a plate, they place it on top of the pile (Push). When a hungry diner takes a plate, they grab the topmost clean plate (Pop). You cannot grab a plate from the middle without removing the ones on top.",
        narrative: `In computer systems, Stacks are ubiquitous:
- **Browser History**: Pressing 'Back' pops the most recent page you visited.
- **Undo / Redo ($Ctrl+Z$)**: Reverses your most recent action first.
- **Function Call Stack**: Manages active function execution frames in RAM.

Core operations:
- $\\text{push}(x)$: Adds $x$ to top ($O(1)$ constant time).
- $\\text{pop}()$: Removes and returns top item ($O(1)$ constant time).
- $\\text{peek}()$: Views top item without removing it.`,
        simplerExplanation:
          "Think of a Pringles potato chip can: The last chip loaded into the can at the factory is the first chip you eat when you open it!",
        breakdown: [
          { conceptTerm: "Push Operation", analogyEquivalent: "Placing a plate on top of the stack", explanation: "Adds a new element to the top pointer." },
          { conceptTerm: "Pop Operation", analogyEquivalent: "Taking the top plate off", explanation: "Removes and returns the topmost element." },
          { conceptTerm: "Peek / Top", analogyEquivalent: "Looking at the top plate without taking it", explanation: "Inspects value at top without modifying stack." },
          { conceptTerm: "Stack Overflow", analogyEquivalent: "Plates stacked too high, spilling on floor", explanation: "Attempting to push when allocated memory is full." },
        ],
        keyTakeaway:
          "Stacks enforce strict LIFO order, making them ideal for backtracking, parenthesis matching, and undo mechanisms.",
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart TD
    Start([Stack Operations]) --> Push["1. Push Element (e.g. 'Plate C')"]
    Push --> State1["Stack: [Plate C (Top), Plate B, Plate A]"]
    
    State1 --> Peek{"Peek Top Element"}
    Peek --> Inspect["Inspects 'Plate C' without removing"]
    
    Inspect --> Pop["2. Pop Element"]
    Pop --> ReturnTop["Returns 'Plate C' ➔ Stack: [Plate B (New Top), Plate A]"]
    
    ReturnTop --> EmptyCheck{"Is Stack Empty?"}
    EmptyCheck -->|Yes| Underflow["⚠️ Stack Underflow if popped again"]
    EmptyCheck -->|No| Done([Ready for next LIFO Operation])

    classDef stack fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef op fill:#064e3b,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef warn fill:#7f1d1d,stroke:#f43f5e,stroke-width:2px,color:#fff;

    class State1,Inspect,ReturnTop stack;
    class Push,Pop,Peek,EmptyCheck,Done op;
    class Underflow warn;`,
        steps: [
          { id: "s1", nodeKey: "Push", label: "Push Operation", description: "Pushes item onto stack top pointer in O(1) time.", phase: "Insertion" },
          { id: "s2", nodeKey: "Pop", label: "Pop Operation", description: "Pops and frees topmost element in O(1) time.", phase: "Removal" },
        ],
        coreInsight: "All stack operations occur exclusively at the top boundary with O(1) time complexity.",
      },
      socratic: {
        questions: [
          {
            id: "stk-q1",
            question: "If you push elements [A, B, C, D] in order into an empty stack and then execute two pop() operations, which element is currently at the top of the stack?",
            options: [
              {
                id: "stk1-opt1",
                text: "Element B (D and C were popped off, leaving B at top and A at bottom).",
                explanation: "Correct! Push order: [A, B, C, D (top)]. 1st pop removes D. 2nd pop removes C. Remaining top is B.",
                isCorrect: true,
              },
              {
                id: "stk1-opt2",
                text: "Element D",
                explanation: "Incorrect. Element D was the first item removed during the first pop().",
                isCorrect: false,
              },
              {
                id: "stk1-opt3",
                text: "Element A",
                explanation: "Incorrect. Element A is at the bottom of the stack.",
                isCorrect: false,
              },
              {
                id: "stk1-opt4",
                text: "The stack is completely empty.",
                explanation: "Incorrect. 4 items pushed minus 2 popped leaves 2 items in the stack.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: "How can two Stacks be used together to construct a First-In First-Out (FIFO) Queue?",
            hint: "Think about what happens when you pour the contents of one stack upside-down into another.",
          },
        ],
        overallSummary: "LIFO ordering ensures that the most recent context is always resolved first.",
      },
    },
  },
];

/**
 * Dynamic generator that matches curated topics or creates dynamic mock topics for any query.
 */
export function getMockTopic(query: string): Topic {
  const clean = query.trim().toLowerCase();
  
  const found = sampleTopics.find(
    (t) =>
      t.title.toLowerCase().includes(clean) ||
      t.slug.toLowerCase().includes(clean) ||
      clean.includes(t.title.toLowerCase()) ||
      t.tags.some((tag) => clean.includes(tag.toLowerCase()))
  );

  if (found) return found;

  // Generate a dynamic mock topic for arbitrary inputs
  const formattedTitle = query
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return {
    id: `dyn-${Date.now()}`,
    slug: clean.replace(/[^a-z0-9]+/g, "-"),
    title: formattedTitle,
    subtitle: `Adaptive micro-module exploring core mechanics, conceptual intuition, and active recall for ${formattedTitle}`,
    category: "Computer Science",
    difficulty: "Intermediate",
    estimatedMinutes: 5,
    tags: ["Custom Concept", "Adaptive Learning", "STEM"],
    representations: {
      analogy: {
        title: `The Everyday Metaphor for ${formattedTitle}`,
        simpleExplanation: `${formattedTitle} is a fundamental concept that coordinates inputs, processes transformations through structured rules, and produces verified outputs.`,
        metaphor: `Think of ${formattedTitle} like a high-speed express subway transit system where passengers (inputs) board designated train cars, travel along synchronized tracks (logic pathways), and disembark at target terminals (outputs) with zero traffic collisions.`,
        narrative: `When analyzing ${formattedTitle}, break it down into three intuitive steps:
1. **The Entry Condition**: Stimulus or raw parameters enter the system boundary.
2. **The Transformation Engine**: Internal rules and state machines govern how elements interact without bottlenecking.
3. **The Stable Output**: A resolved state or outcome is emitted for downstream consumption.`,
        simplerExplanation: `Imagine a vending machine for ${formattedTitle}: you insert your coin, press your button, gears turn inside, and your exact snack drops down reliably every single time!`,
        breakdown: [
          { conceptTerm: "Core Mechanism", analogyEquivalent: "Subway Dispatcher", explanation: "Coordinates internal execution order." },
          { conceptTerm: "State Transition", analogyEquivalent: "Switching Tracks", explanation: "Changes operational mode based on real-time inputs." },
          { conceptTerm: "Terminal Boundary", analogyEquivalent: "Destination Station", explanation: "The final stable state reached." },
        ],
        keyTakeaway: `${formattedTitle} achieves efficiency by decomposing complex tasks into discrete, predictable transitions.`,
        alternativeAnalogies: [
          {
            title: `The Postal Sorting Office for ${formattedTitle}`,
            metaphor: `A central post office scanning package barcodes and directing them onto the fastest delivery truck.`,
            narrative: `Packages are sorted by zip code and distributed along conveyor belts so nothing is lost in transit.`,
            breakdown: [
              { conceptTerm: "Input", analogyEquivalent: "Incoming Mail Drop", explanation: "Data packets or stimuli" },
              { conceptTerm: "Processing", analogyEquivalent: "Barcode Optical Scanner", explanation: "Rule validation" },
            ],
            keyTakeaway: "Clear categorization eliminates pipeline clutter.",
          },
        ],
      },
      flowchart: {
        diagramType: "flowchart",
        mermaidCode: `flowchart TD
    Start(["1. Input Initiation: ${formattedTitle}"]) --> Validate{"2. Validation & Pre-Check"}
    Validate -->|Valid| Engine["3. Core Transformation Logic"]
    Validate -->|Invalid| Reject(["⚠️ Error Handling & Fallback"])
    
    Engine --> Sub1["4. Process Primary Branch"]
    Engine --> Sub2["4. Process Secondary Branch"]
    
    Sub1 --> Merge["5. Synchronized Convergence"]
    Sub2 --> Merge
    
    Merge --> Verify{"6. Integrity Check"}
    Verify -->|Pass| Result(["🎯 Success: Verified Output"])
    Verify -->|Retry| Engine

    classDef success fill:#065f46,stroke:#10b981,stroke-width:2px,color:#fff;
    classDef decision fill:#1e1b4b,stroke:#818cf8,stroke-width:2px,color:#fff;
    classDef process fill:#0e7490,stroke:#06b6d4,stroke-width:2px,color:#fff;
    classDef failure fill:#7f1d1d,stroke:#f43f5e,stroke-width:2px,color:#fff;

    class Start,Result success;
    class Validate,Verify decision;
    class Engine,Sub1,Sub2,Merge process;
    class Reject failure;`,
        steps: [
          { id: "ds1", nodeKey: "Start", label: "Initialization", description: "Receives initial state and parameters.", phase: "Input" },
          { id: "ds2", nodeKey: "Engine", label: "Core Processing", description: "Executes systematic transformation rules.", phase: "Computation" },
          { id: "ds3", nodeKey: "Result", label: "Resolution", description: "Delivers verified terminal state.", phase: "Output" },
        ],
        coreInsight: `Systematic feedback loops ensure ${formattedTitle} maintains consistency across varied operational conditions.`,
      },
      socratic: {
        questions: [
          {
            id: "dyn-q1",
            question: `What is the fundamental mechanism that enables ${formattedTitle} to operate reliably?`,
            context: `Consider the decision flow from initiation to output in the visual representation.`,
            options: [
              {
                id: "dyn-opt1",
                text: "It enforces clear state transitions and validates conditions at each stage before committing output.",
                explanation: "Correct! Structured validation and modular state management prevent race conditions and unhandled errors.",
                isCorrect: true,
              },
              {
                id: "dyn-opt2",
                text: "It randomly bypasses validation checks whenever traffic volume increases.",
                explanation: "Incorrect. Bypassing validation breaks correctness guarantees.",
                isCorrect: false,
              },
              {
                id: "dyn-opt3",
                text: "It requires all external hardware components to restart simultaneously.",
                explanation: "Incorrect. Modern architectures maintain high availability without full hardware reboots.",
                isCorrect: false,
              },
              {
                id: "dyn-opt4",
                text: "It replaces all mathematical logic with static pre-printed lookup tables.",
                explanation: "Incorrect. Dynamic systems evaluate runtime states rather than relying exclusively on static lists.",
                isCorrect: false,
              },
            ],
            reflectionPrompt: `How would you optimize the convergence step if input load scales by 100x?`,
            hint: `Look at the parallel branches feeding into the convergence node.`,
          },
        ],
        overallSummary: `Mastering ${formattedTitle} requires understanding how inputs propagate across validated transformation stages.`,
      },
    },
  };
}

export const defaultUserProgress: UserProgress = {
  completedTopicIds: ["tcp-handshake", "binary-search"],
  currentStreakDays: 4,
  totalTimeMinutes: 42,
  retentionScorePercentage: 92,
  categoryMastery: {
    "Artificial Intelligence": 88,
    "Computer Science": 94,
    "Biology & Life Sciences": 65,
    "Physics & Quantum": 70,
    "Mathematics": 50,
  },
  recentActivity: [
    {
      topicId: "tcp-handshake",
      topicTitle: "TCP Three-Way Handshake",
      timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(),
      score: 100,
      modeCompleted: "all",
    },
    {
      topicId: "binary-search",
      topicTitle: "Binary Search",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
      score: 95,
      modeCompleted: "socratic",
    },
  ],
};

export const defaultUserSettings: UserSettings = {
  theme: "dark",
  dyslexiaFont: false,
  highContrast: false,
  reducedMotion: false,
  autoPlayFlowcharts: true,
  defaultMode: "all",
  aiProvider: "gemini",
  preferredDifficulty: "Beginner",
};
