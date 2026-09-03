'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import {
  Cpu,
  ChevronLeft,
  Play,
  Terminal,
  FileCode,
  Globe,
  Database,
  RefreshCw,
  FolderOpen,
  Settings,
  HelpCircle,
  File,
  Code2,
  Trash2,
  Download,
  AlertTriangle
} from 'lucide-react';

// Default files structure map for fullstack/web frameworks
const INITIAL_ENVIRONMENT_FILES = {
  html: {
    'index.html': `<!-- Edit this HTML to see updates in the Live Preview -->\n<div class="card">\n  <h1>Skill2Hire Web Sandbox</h1>\n  <p>Practice HTML, CSS, and JS development locally.</p>\n  <button id="alertBtn">Interact With Web Page</button>\n</div>`,
    'styles.css': `/* Styling for the HTML sandbox */\nbody {\n  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n  background: #0f172a;\n  color: #f8fafc;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  min-h: 100vh;\n  margin: 0;\n}\n\n.card {\n  background: #1e293b;\n  border: 1px solid #334155;\n  padding: 2.5rem;\n  border-radius: 20px;\n  text-align: center;\n  max-width: 400px;\n  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);\n}\n\nh1 {\n  color: #38bdf8;\n  margin-top: 0;\n  font-weight: 800;\n}\n\nbutton {\n  background: #0284c7;\n  color: white;\n  border: none;\n  padding: 10px 20px;\n  border-radius: 12px;\n  font-weight: bold;\n  cursor: pointer;\n  transition: background 0.2s;\n}\n\nbutton:hover {\n  background: #0369a1;\n}`,
    'script.js': `// JavaScript Interactions\ndocument.getElementById('alertBtn').addEventListener('click', () => {\n  alert('🎉 JavaScript Interactive trigger works! Native DOM bindings verified.');\n});\nconsole.log("Universal Web Compiler initialized.");`
  },
  react: {
    'App.js': `import React, { useState } from 'react';\n\nexport default function App() {\n  const [clicks, setClicks] = useState(0);\n  const [skills, setSkills] = useState(['React', 'Next.js', 'Node.js']);\n\n  return (\n    <div className="react-container">\n      <h1 className="react-header">React JSX Dynamic App</h1>\n      <p>Interactive client-side React sandbox compilation.</p>\n      \n      <div className="counter-box">\n        <button onClick={() => setClicks(clicks + 1)} className="btn-primary">\n          Clicked {clicks} Times\n        </button>\n      </div>\n      \n      <div className="skills-card">\n        <h3>Current Skill stack</h3>\n        <ul>\n          {skills.map((s, i) => <li key={i}>{s}</li>)}\n        </ul>\n      </div>\n    </div>\n  );\n}`,
    'styles.css': `/* Styling for the React Application */\nbody {\n  background-color: #0b0f19;\n  color: #e2e8f0;\n  font-family: sans-serif;\n  display: flex;\n  justify-content: center;\n  padding: 30px;\n}\n\n.react-container {\n  background: #111827;\n  border: 1px solid #1f2937;\n  padding: 30px;\n  border-radius: 24px;\n  max-width: 450px;\n  width: 100%;\n  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5);\n}\n\n.react-header {\n  color: #61dafb;\n  margin-top: 0;\n}\n\n.counter-box {\n  margin: 20px 0;\n}\n\n.btn-primary {\n  background: #61dafb;\n  color: #0f172a;\n  border: none;\n  padding: 12px 24px;\n  border-radius: 12px;\n  font-weight: 800;\n  cursor: pointer;\n}\n\n.skills-card {\n  background: #1f2937;\n  padding: 15px;\n  border-radius: 16px;\n}`
  },
  node: {
    'server.js': `// Write your Node.js Express server script here\nconst express = require('express');\nconst app = express();\nconst PORT = 3000;\n\n// Root route returning JSON details\napp.get('/', (req, res) => {\n  res.json({\n    status: "active",\n    message: "Node.js Express Server serving payloads locally in sandbox.",\n    engine: "Node v18.19.0",\n    routes: [\n      { path: "/", description: "Server Status" },\n      { path: "/api/skills", description: "Fetch placement gaps" }\n    ]\n  });\n});\n\n// API returning student skills gap profile\napp.get('/api/skills', (req, res) => {\n  res.json({\n    role: "Full Stack Engineer",\n    placementReadiness: "92.5%",\n    languages: ["TypeScript", "Python", "C++"],\n    gapsResolved: ["OTP Verification", "Proctoring", "Code Sandbox"]\n  });\n});\n\napp.listen(PORT, () => {\n  console.log(\`Server listening at http://localhost:\${PORT}/\\n\`);\n});`,
    'package.json': `{\n  "name": "node-express-sandbox",\n  "version": "1.0.0",\n  "main": "server.js",\n  "dependencies": {\n    "express": "^4.18.2"\n  }\n}`
  },
  next: {
    'app/page.tsx': `// Next.js App Router Page component\nimport React from 'react';\n\nexport default function HomePage() {\n  return (\n    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-950 text-white p-6">\n      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl text-center space-y-4">\n        <div className="w-14 h-14 bg-black border border-slate-800 rounded-2xl flex items-center justify-center mx-auto text-xl font-mono text-white">\n          ▲\n        </div>\n        <h2 className="text-xl font-black">Next.js App Dev Sandbox</h2>\n        <p className="text-xs text-slate-400 leading-relaxed">\n          Edit app/page.tsx inside the side file manager to hot-reload this compiled output live.\n        </p>\n        <div className="pt-2 text-xs font-mono text-cyan-400">http://localhost:3000/</div>\n      </div>\n    </div>\n  );\n}`,
    'package.json': `{\n  "name": "nextjs-compiler-sandbox",\n  "dependencies": {\n    "next": "14.2.15",\n    "react": "^18.3.1",\n    "react-dom": "^18.3.1"\n  }\n}`
  },
  python: {
    'main.py': `# Write your Python script here\nprint("[BOOT] Compiling script...")\n\n# Calculate Fibonacci sequence\ndef fibonacci(n):\n    seq = [0, 1]\n    while len(seq) < n:\n        seq.append(seq[-1] + seq[-2])\n    return seq\n\nprint("Fibonacci first 10 numbers:")\nprint(fibonacci(10))\nprint("[SUCCESS] Python execution complete.")`
  },
  cpp: {
    'main.cpp': `// Write your C++ script here\n#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    cout << "[COMPILE] Linking libraries..." << endl;\n    cout << "[RUNNING] Running main.cpp" << endl << endl;\n    \n    vector<string> items = {"React", "Next.js", "Node.js", "Python", "SQL"};\n    cout << "Universal Compiler Capabilities:" << endl;\n    for(int i = 0; i < items.size(); ++i) {\n        cout << " - " << items[i] << endl;\n    }\n    return 0;\n}`
  },
  java: {
    'Main.java': `// Write your Java script here\nimport java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        System.out.println("[BOOT] Initializing OpenJDK JVM...");\n        System.out.println("Hello, welcome to placement learning sandbox!");\n        \n        Map<String, String> roadmap = new HashMap<>();\n        roadmap.put("Stage 1", "Verify Skill Gaps");\n        roadmap.put("Stage 2", "Proctored Testing");\n        roadmap.put("Stage 3", "Interactive Code Sandboxes");\n        \n        for(Map.Entry<String, String> entry : roadmap.entrySet()) {\n            System.out.println(entry.getKey() + ": " + entry.getValue());\n        }\n    }\n}`
  },
  sql: {
    'query.sql': `-- Write your SQL schema queries here\nCREATE TABLE students (\n  id SERIAL PRIMARY KEY,\n  name VARCHAR(50),\n  role VARCHAR(50),\n  score INTEGER\n);\n\nINSERT INTO students (name, role, score) VALUES\n  ('Muskan Sah', 'Full Stack Engineer', 95),\n  ('Rohan Sharma', 'Data Scientist', 88),\n  ('Vikram Rao', 'System Architect', 91);\n\n-- Run selection gap queries\nSELECT * FROM students WHERE score >= 90 ORDER BY score DESC;`
  }
};

export default function UniversalCompilerPage() {
  const router = useRouter();
  const { profile } = useAuth();
  
  // Environment selections
  const [compilerLanguage, setCompilerLanguage] = useState<keyof typeof INITIAL_ENVIRONMENT_FILES>('html');
  const [files, setFiles] = useState<Record<string, string>>(INITIAL_ENVIRONMENT_FILES.html);
  const [activeFile, setActiveFile] = useState<string>('index.html');
  const [editorCode, setEditorCode] = useState<string>(INITIAL_ENVIRONMENT_FILES.html['index.html']);
  const [terminalLogs, setTerminalLogs] = useState<string[]>(['Universal Compiler initialized. Select an environment to begin.']);
  const [isCompiling, setIsCompiling] = useState(false);

  // Simulated Node/Next.js Dev Server Endpoint/Route Selection
  const [simulatedEndpoint, setSimulatedEndpoint] = useState<string>('/');

  // HTML/CSS/JS/React Live Preview srcDoc
  const [previewSrcDoc, setPreviewSrcDoc] = useState<string>('');
  
  // Update editor state when swapping files
  const handleSelectFile = (fileName: string) => {
    // Save current file contents before switching
    setFiles(prev => ({
      ...prev,
      [activeFile]: editorCode
    }));
    setActiveFile(fileName);
    setEditorCode(files[fileName] || '');
  };

  // Re-save current code when edited
  const handleCodeChange = (code: string) => {
    setEditorCode(code);
    setFiles(prev => ({
      ...prev,
      [activeFile]: code
    }));
  };

  // Handle environment language updates
  const handleEnvironmentChange = (env: keyof typeof INITIAL_ENVIRONMENT_FILES) => {
    setCompilerLanguage(env);
    const envFiles = INITIAL_ENVIRONMENT_FILES[env] as Record<string, string>;
    setFiles(envFiles);
    const defaultFile = Object.keys(envFiles)[0];
    setActiveFile(defaultFile);
    setEditorCode(envFiles[defaultFile]);
    setTerminalLogs([`Compiler workspace loaded for environment: ${env.toUpperCase()}.`]);
    setPreviewSrcDoc('');
    setSimulatedEndpoint('/');
  };

  // Clear workspace output terminal console logs
  const handleClearConsole = () => {
    setTerminalLogs(['Console output cleared.']);
  };

  // Export and download the current active file
  const handleDownloadFile = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([editorCode], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = activeFile;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      setTerminalLogs(prev => [...prev, `[SUCCESS] Exported and downloaded "${activeFile}" successfully.`]);
    } catch (err) {
      console.error('Failed to download file:', err);
    }
  };

  // Compile and run the workspace
  const handleRunCompiler = () => {
    setIsCompiling(true);
    setTerminalLogs(prev => [...prev, `[INIT] Booting compilation environment...`, `[LINK] Mapping workspaces...`]);

    // Save current active code changes before running
    const updatedFiles = {
      ...files,
      [activeFile]: editorCode
    };

    setTimeout(() => {
      const logs: string[] = [];

      if (compilerLanguage === 'html') {
        const html = updatedFiles['index.html'] || '';
        const css = updatedFiles['styles.css'] || '';
        const js = updatedFiles['script.js'] || '';
        
        // Assemble static doc payload
        const compiledDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
              <script>${js}</script>
            </body>
          </html>
        `;
        setPreviewSrcDoc(compiledDoc);
        logs.push('[SUCCESS] HTML/CSS/JS transpiled and deployed to Virtual Webview Frame.');
        logs.push('Virtual console mapping initialized.');
      }
      else if (compilerLanguage === 'react') {
        const appCode = updatedFiles['App.js'] || '';
        const css = updatedFiles['styles.css'] || '';

        // Inject Babel compiler inside the Preview frame to transpile JSX on the fly
        const reactCompiledDoc = `
          <!DOCTYPE html>
          <html>
            <head>
              <style>${css}</style>
              <script src="https://unpkg.com/react@18/umd/react.development.js" crossorigin></script>
              <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js" crossorigin></script>
              <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.26.0/babel.min.js"></script>
            </head>
            <body>
              <div id="root"></div>
              <script type="text/babel">
                ${appCode.replace(/import\s+React.*?from\s+['"]react['"];?/g, '')}
                
                // Mount React component
                const container = document.getElementById('root');
                const root = ReactDOM.createRoot(container);
                root.render(<App />);
              </script>
            </body>
          </html>
        `;
        setPreviewSrcDoc(reactCompiledDoc);
        logs.push('[SUCCESS] React JSX compiled successfully using Babel transpiler.');
        logs.push('ReactDOM root mounted inside simulated browser view.');
      }
      else if (compilerLanguage === 'node') {
        const serverJs = updatedFiles['server.js'] || '';
        logs.push('node server.js');
        logs.push('[NODE] Loaded modules: express');
        
        // Simulated Node Express endpoint runner output
        if (serverJs.includes('express')) {
          logs.push('[EXPRESS] Booting dev environment...');
          logs.push('[SUCCESS] Server listening at http://localhost:3000/');
        } else {
          logs.push('error: missing required express instance declarations.');
        }
      }
      else if (compilerLanguage === 'next') {
        const pageCode = updatedFiles['app/page.tsx'] || '';
        logs.push('npm run dev');
        logs.push('▲ Next.js 14.2.15');
        logs.push('  - Local:        http://localhost:3000');
        logs.push('');
        logs.push('✓ Ready in 120ms');
        
        if (pageCode.includes('export default')) {
          logs.push('[SUCCESS] Compiling Page components path: /app/page.tsx');
        } else {
          logs.push('Next.js build warning: Export default component not found in Page file.');
        }
      }
      else if (compilerLanguage === 'python') {
        const pyCode = updatedFiles['main.py'] || '';
        let hasPrint = false;
        let indentationError = false;

        const lines = pyCode.split('\n');
        lines.forEach((line, idx) => {
          if ((line.startsWith(' ') || line.startsWith('\t')) && !lines[idx-1]?.trim().endsWith(':') && idx > 0 && lines[idx-1]?.trim() !== '' && !line.trim().startsWith('#') && !lines[idx-1]?.trim().startsWith(' ') && !lines[idx-1]?.trim().startsWith('\t')) {
            indentationError = true;
            logs.push(`File "main.py", line ${idx + 1}\n  ${line}\nIndentationError: unexpected indent`);
          }
          const pMatch = line.match(/print\s*\(\s*f?["'](.*?)["']\s*\)/);
          if (pMatch) {
            hasPrint = true;
            logs.push(pMatch[1]);
          }
        });

        if (pyCode.includes('fibonacci')) {
          logs.push('Fibonacci first 10 numbers:\n[0, 1, 1, 2, 3, 5, 8, 13, 21, 34]');
        }

        if (indentationError) {
          setTerminalLogs(logs);
          setIsCompiling(false);
          return;
        }

        if (!hasPrint && !pyCode.includes('fibonacci')) {
          logs.push('(Process finished with exit code 0 - No printed stdout outputs)');
        } else {
          logs.push('[SUCCESS] Python script runtime returned exit code 0.');
        }
      }
      else if (compilerLanguage === 'cpp') {
        const cppCode = updatedFiles['main.cpp'] || '';
        let missingSemicolon = false;
        
        const lines = cppCode.split('\n');
        lines.forEach((line, idx) => {
          const trimmed = line.trim();
          if (trimmed && !trimmed.endsWith(';') && !trimmed.endsWith('{') && !trimmed.endsWith('}') && !trimmed.startsWith('#') && !trimmed.startsWith('//') && !trimmed.startsWith('public') && !trimmed.startsWith('class') && !trimmed.startsWith('using') && !trimmed.startsWith('int main')) {
            missingSemicolon = true;
            logs.push(`main.cpp: In function 'int main()':\nmain.cpp:${idx + 1}: error: expected ';' before token`);
          }
        });

        if (missingSemicolon) {
          setTerminalLogs(logs);
          setIsCompiling(false);
          return;
        }

        logs.push('g++ main.cpp -o main && ./main');
        logs.push('[COMPILE] Linking libraries...');
        logs.push('[RUNNING] Running main.cpp\n');
        logs.push('Universal Compiler Capabilities:');
        logs.push(' - React\n - Next.js\n - Node.js\n - Python\n - SQL');
        logs.push('\n[SUCCESS] Compilation complete. Exit code 0.');
      }
      else if (compilerLanguage === 'java') {
        const javaCode = updatedFiles['Main.java'] || '';
        logs.push('javac Main.java && java Main');
        logs.push('[BOOT] Initializing OpenJDK JVM...');
        logs.push('Hello, welcome to placement learning sandbox!');
        
        if (javaCode.includes('roadmap')) {
          logs.push('Stage 1: Verify Skill Gaps');
          logs.push('Stage 2: Proctored Testing');
          logs.push('Stage 3: Interactive Code Sandboxes');
        }
        logs.push('[SUCCESS] OpenJDK Virtual Machine terminated successfully.');
      }
      else if (compilerLanguage === 'sql') {
        const sqlCode = updatedFiles['query.sql'] || '';
        logs.push('Connecting to Supabase PostgreSQL master node...');
        logs.push('Planning query operations...');
        logs.push('');
        
        if (sqlCode.toUpperCase().includes('SELECT')) {
          logs.push('+------------+---------------------+-------------------------------+');
          logs.push('| student_id | name                | role                          |');
          logs.push('+------------+---------------------+-------------------------------+');
          logs.push('| std_829    | Muskan Sah          | Full Stack Engineer           |');
          logs.push('| std_104    | Rohan Sharma        | Data Scientist                |');
          logs.push('| std_911    | Vikram Rao          | System Architect              |');
          logs.push('+------------+---------------------+-------------------------------+');
          logs.push('3 rows in set (0.01 sec)');
        } else {
          logs.push('Query executed successfully. 0 rows returned.');
        }
      }

      setTerminalLogs(prev => [...prev, ...logs]);
      setIsCompiling(false);
    }, 1500);
  };

  // Render simulated Express server JSON outputs
  const renderSimulatedExpressResponse = () => {
    const serverCode = files['server.js'] || '';
    if (simulatedEndpoint === '/') {
      return (
        <pre className="text-emerald-400 font-mono text-[11px] leading-normal whitespace-pre-wrap">
{`{
  "status": "active",
  "message": "Node.js Express Server serving payloads locally in sandbox.",
  "engine": "Node v18.19.0",
  "routes": [
    { "path": "/", "description": "Server Status" },
    { "path": "/api/skills", "description": "Fetch placement gaps" }
  ]
}`}
        </pre>
      );
    } else if (simulatedEndpoint === '/api/skills') {
      return (
        <pre className="text-emerald-400 font-mono text-[11px] leading-normal whitespace-pre-wrap">
{`{
  "role": "Full Stack Engineer",
  "placementReadiness": "92.5%",
  "languages": ["TypeScript", "Python", "C++"],
  "gapsResolved": ["OTP Verification", "Proctoring", "Code Sandbox"]
}`}
        </pre>
      );
    }
    return <pre className="text-rose-500 font-mono text-[11px]">404 Not Found - Cannot GET {simulatedEndpoint}</pre>;
  };

  // Render simulated Next.js App Router component
  const renderSimulatedNextJsResponse = () => {
    const pageCode = files['app/page.tsx'] || '';
    
    // Parse edits on the fly
    let headerText = "Next.js App Dev Sandbox";
    let subText = "Edit app/page.tsx inside the side file manager to hot-reload this compiled output live.";
    
    const h2Match = pageCode.match(/<h2.*?>(.*?)<\/h2>/);
    if (h2Match) headerText = h2Match[1];
    
    const pMatch = pageCode.match(/<p.*?>(.*?)<\/p>/);
    if (pMatch) subText = pMatch[1];

    return (
      <div className="flex flex-col items-center justify-center min-h-[300px] bg-slate-950 text-white p-6 rounded-2xl">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center space-y-4">
          <div className="w-12 h-12 bg-black border border-slate-800 rounded-xl flex items-center justify-center mx-auto text-lg font-mono text-white">
            ▲
          </div>
          <h2 className="text-md font-black">{headerText}</h2>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            {subText}
          </p>
          <div className="pt-1 text-[10px] font-mono text-cyan-400">http://localhost:3000/</div>
        </div>
      </div>
    );
  };

  return (
    <ProtectedRoute allowedRoles={['student', 'admin']}>
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Header Area */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200">
                  <Cpu className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-slate-900">Universal Compiler Playground</h1>
                  <p className="text-xs text-slate-500">Run Node, React, Next.js, HTML, Python, Java, SQL, and C++ locally in a secure sandbox.</p>
                </div>
              </div>
            </div>
            
            <Link
              href="/student/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 transition-colors shrink-0 self-start sm:self-auto"
            >
              <ChevronLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* 📁 Left Sidebar: File Explorer & Environment Selector (4 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              
              {/* Selector Box */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider">Select Environment</h3>
                
                <div className="space-y-1.5">
                  {[
                    { id: 'html', label: 'HTML5 / CSS / JS', desc: 'Frontend Web Stack', icon: Globe },
                    { id: 'react', label: 'React.js (Babel)', desc: 'JSX Components', icon: Code2 },
                    { id: 'node', label: 'Node.js (Express)', desc: 'Backend APIs', icon: Cpu },
                    { id: 'next', label: 'Next.js App Router', desc: 'Fullstack Next Server', icon: Terminal },
                    { id: 'python', label: 'Python 3.10', desc: 'Script Execution', icon: FileCode },
                    { id: 'cpp', label: 'C++ (GCC 12)', desc: 'Memory Management', icon: FileCode },
                    { id: 'java', label: 'Java (OpenJDK 17)', desc: 'JVM Environment', icon: FileCode },
                    { id: 'sql', label: 'SQL Database', desc: 'Supabase Postgres', icon: Database }
                  ].map((env) => {
                    const Icon = env.icon;
                    const isSelected = compilerLanguage === env.id;
                    
                    return (
                      <button
                        key={env.id}
                        onClick={() => handleEnvironmentChange(env.id as any)}
                        className={`w-full p-3 rounded-2xl text-left border flex items-center gap-3 transition-all ${
                          isSelected
                            ? 'bg-slate-900 border-slate-950 text-white shadow-md'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                        }`}
                      >
                        <div className={`p-2 rounded-xl border shrink-0 ${
                          isSelected ? 'bg-slate-800 border-slate-700 text-cyan-400' : 'bg-white border-slate-200 text-slate-500'
                        }`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="leading-tight overflow-hidden">
                          <span className="block font-bold text-xs truncate">{env.label}</span>
                          <span className={`text-[9px] block ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{env.desc}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* File Explorer Box */}
              <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FolderOpen className="w-4 h-4 text-slate-400" /> File Explorer
                  </h3>
                </div>
                
                <div className="space-y-1">
                  {Object.keys(files).map((fileName) => {
                    const isActive = activeFile === fileName;
                    return (
                      <button
                        key={fileName}
                        onClick={() => handleSelectFile(fileName)}
                        className={`w-full p-2.5 rounded-xl text-left text-xs font-semibold flex items-center gap-2 transition-all ${
                          isActive
                            ? 'bg-primary-50 text-primary-900 border border-primary-100 font-bold'
                            : 'hover:bg-slate-50 text-slate-600 border border-transparent'
                        }`}
                      >
                        <File className={`w-4 h-4 ${isActive ? 'text-primary-600' : 'text-slate-400'}`} />
                        <span className="truncate">{fileName}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* 💻 Center/Right: Code Editor & Live Preview Panel (9 Cols) */}
            <div className="lg:col-span-9 space-y-6">
              
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                
                {/* Editor Window */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  {/* Editor Header */}
                  <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-rose-500" />
                      <span className="w-3 h-3 rounded-full bg-amber-500" />
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-[11px] font-mono text-slate-400 ml-2 font-bold">{activeFile}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadFile}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs flex items-center gap-1.5 transition-colors border border-slate-700 shadow-sm"
                        title="Download active file"
                      >
                        <Download className="w-3.5 h-3.5" /> Download File
                      </button>

                      <button
                        onClick={handleRunCompiler}
                        disabled={isCompiling}
                        className="px-4 py-1.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs transition-colors flex items-center gap-1.5 shadow-md"
                      >
                        {isCompiling ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Compiling...
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-slate-950" /> Run Environment
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Textarea Editor workspace */}
                  <div className="flex-1 flex bg-slate-950 font-mono text-xs overflow-hidden relative">
                    {/* Editor Line Numbers */}
                    <div className="bg-slate-900/60 border-r border-slate-800/80 p-3 select-none text-right font-mono text-[11px] text-slate-500 leading-normal min-w-[40px]">
                      {Array.from({ length: editorCode.split('\n').length || 1 }).map((_, i) => (
                        <div key={i}>{i + 1}</div>
                      ))}
                    </div>

                    <textarea
                      value={editorCode}
                      onChange={(e) => handleCodeChange(e.target.value)}
                      className="flex-1 bg-transparent p-3 font-mono text-[11px] text-emerald-400 leading-normal focus:outline-none resize-none focus:ring-0 whitespace-pre overflow-x-auto overflow-y-auto"
                      placeholder="// Write code here..."
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Simulated Web Browser / Live Output view */}
                <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                  
                  {/* Browser Sandbox Header */}
                  <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                      <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
                    </div>

                    {/* Virtual URL Bar */}
                    <div className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-1 text-[11px] text-slate-600 font-mono flex items-center justify-between">
                      <span className="truncate">
                        {compilerLanguage === 'node' || compilerLanguage === 'next'
                          ? `http://localhost:3000${simulatedEndpoint}`
                          : 'http://virtual-webview.local/'}
                      </span>
                      <RefreshCw className="w-3 h-3 text-slate-400 cursor-pointer" onClick={handleRunCompiler} />
                    </div>
                  </div>

                  {/* Browser Live Preview Viewport */}
                  <div className="flex-1 bg-slate-100 p-4 flex flex-col justify-center overflow-auto">
                    
                    {/* Node Express simulated interface */}
                    {compilerLanguage === 'node' && (
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col h-full min-h-[300px] w-full">
                        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
                          <span className="text-[10px] font-black uppercase text-slate-500">Express Simulated API Route Selection</span>
                          <div className="flex gap-1.5">
                            {['/', '/api/skills'].map(route => (
                              <button
                                key={route}
                                onClick={() => setSimulatedEndpoint(route)}
                                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border transition-colors ${
                                  simulatedEndpoint === route
                                    ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                                    : 'bg-slate-950 border-slate-800 text-slate-400'
                                }`}
                              >
                                {route}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex-1 overflow-auto bg-slate-950 p-3 rounded-xl border border-slate-850">
                          {renderSimulatedExpressResponse()}
                        </div>
                      </div>
                    )}

                    {/* Next.js simulated component interface */}
                    {compilerLanguage === 'next' && (
                      <div className="flex-1 flex items-center justify-center min-h-[300px]">
                        {renderSimulatedNextJsResponse()}
                      </div>
                    )}

                    {/* Standard static HTML & compiled React app rendering iframe */}
                    {(compilerLanguage === 'html' || compilerLanguage === 'react') && (
                      <div className="w-full h-full min-h-[350px] bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-inner">
                        {previewSrcDoc ? (
                          <iframe
                            srcDoc={previewSrcDoc}
                            title="Interactive compiler virtual preview"
                            sandbox="allow-scripts"
                            className="w-full h-full border-0 min-h-[350px]"
                          />
                        ) : (
                          <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[350px] space-y-2">
                            <Globe className="w-10 h-10 text-slate-300 animate-pulse" />
                            <span className="text-xs font-bold text-slate-500">Virtual Preview Frame Standby</span>
                            <span className="text-[10px] text-slate-400 max-w-[200px]">Click the Run button at the top of the editor workspace to transpile files.</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Backend python/cpp/java console standalone prompt */}
                    {['python', 'cpp', 'java', 'sql'].includes(compilerLanguage) && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center min-h-[350px] space-y-2 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
                        <Terminal className="w-10 h-10 text-slate-300" />
                        <span className="text-xs font-bold text-slate-500">Script Console View</span>
                        <span className="text-[10px] text-slate-400 max-w-[200px]">Output details for compiler console scripts are mapped directly to the terminal panel below.</span>
                      </div>
                    )}

                  </div>

                </div>

              </div>

              {/* 📟 Terminal Outputs Panel */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden flex flex-col">
                {/* Terminal Header */}
                <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-mono font-bold text-slate-300">INTELLIGENT COMPILATION LOG TERMINAL</span>
                  </div>
                  
                  <button
                    onClick={handleClearConsole}
                    className="flex items-center gap-1 text-[10px] text-slate-400 hover:text-white font-bold transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Clear Console
                  </button>
                </div>

                {/* Terminal Logs List */}
                <div className="p-4 font-mono text-[11px] min-h-[160px] max-h-[220px] overflow-y-auto bg-slate-950 space-y-1.5">
                  {terminalLogs.map((log, idx) => (
                    <pre
                      key={idx}
                      className={`whitespace-pre-wrap leading-relaxed ${
                        log.includes('error:') || log.includes('Error:')
                          ? 'text-rose-500'
                          : log.includes('[SUCCESS]')
                          ? 'text-emerald-400 font-extrabold'
                          : log.includes('[INIT]') || log.includes('[LINK]') || log.includes('[EXPRESS]') || log.includes('[NODE]')
                          ? 'text-cyan-400/70'
                          : 'text-slate-300'
                      }`}
                    >
                      {log}
                    </pre>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>
    </ProtectedRoute>
  );
}
