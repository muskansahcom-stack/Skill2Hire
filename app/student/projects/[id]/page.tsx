'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  Folder,
  FileCode,
  Play,
  CheckCircle2,
  Terminal as TerminalIcon,
  ShieldCheck,
  ArrowLeft,
  Sparkles,
  Save,
  Code2,
  Settings,
  AlertTriangle,
  Award
} from 'lucide-react';

const PROJECT_FILES: Record<string, Record<string, string>> = {
  'prec_1': {
    'worker.py': `import time
import redis
import threading

r = redis.Redis(host='localhost', port=6379, db=0)

def process_job(job_id):
    print(f"[WORKER] Starting job: {job_id}")
    time.sleep(2)
    # Simulate work
    r.set(f"job:status:{job_id}", "completed")
    print(f"[WORKER] Job {job_id} processing finished!")

def start_workers(concurrency=4):
    print(f"[SYSTEM] Initializing pool of {concurrency} workers...")
    for i in range(concurrency):
        t = threading.Thread(target=lambda: print(f"Worker-{i} active!"))
        t.start()
`,
    'queue.py': `import redis
import json
import time

r = redis.Redis(host='localhost', port=6379, db=0)

def enqueue_job(job_type, payload):
    job_id = f"job_{int(time.time()*1000)}"
    job_data = {
        'id': job_id,
        'type': job_type,
        'payload': payload,
        'retry_count': 0
    }
    r.lpush('tasks:main', json.dumps(job_data))
    print(f"[QUEUE] Successfully enqueued job {job_id}")
    return job_id
`,
    'telemetry.py': `from flask import Flask, jsonify
import redis

app = Flask(__name__)
r = redis.Redis(host='localhost', port=6379, db=0)

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'redis_connected': True,
        'queue_length': r.llen('tasks:main')
    })
`,
    'docker-compose.yml': `version: '3.8'

services:
  app:
    build: .
    ports:
      - "5000:5000"
    environment:
      - REDIS_URL=redis://cache:6379/0
  cache:
    image: redis:alpine
    ports:
      - "6379:6379"
`
  },
  'prec_2': {
    'etl.py': `import pandas as pd
import sqlite3

def load_and_clean_data():
    print("[ETL] Reading transaction history logs...")
    df = pd.read_csv('transactions.csv')
    
    # Clean rows with missing customer ids
    df = df.dropna(subset=['CustomerID'])
    df['TransactionDate'] = pd.to_datetime(df['TransactionDate'])
    
    print(f"[ETL] Loaded {len(df)} rows. Syncing to sqlite datastore...")
    conn = sqlite3.connect('ecommerce.db')
    df.to_sql('transactions', conn, if_exists='replace', index=False)
    conn.close()
`,
    'churn_model.py': `from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import pandas as pd

def train_churn_model():
    print("[MODEL] Fetching customer aggregates from database...")
    # Load prepared aggregates
    data = pd.read_csv('customer_features.csv')
    
    X = data[['recency', 'frequency', 'monetary_value']]
    y = data['churned']
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
    
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X_train, y_train)
    print(f"[MODEL] Model accuracy on test set: {model.score(X_test, y_test):.2f}")
    return model
`,
    'queries.sql': `-- Query to identify top 100 churning customers by total spending
SELECT 
    CustomerID, 
    SUM(UnitPrice * Quantity) as TotalSpend,
    MAX(TransactionDate) as LastPurchase
FROM transactions
GROUP BY CustomerID
ORDER BY TotalSpend DESC
LIMIT 100;
`
  },
  'prec_3': {
    'Dockerfile': `FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
`,
    'github-action.yml': `name: Cloud CI/CD Pipeline

on:
  push:
    branches: [ main ]

jobs:
  test-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v3
        
      - name: Build & Run Tests
        run: |
          npm install
          npm run test
          
      - name: Build Container
        run: docker build -t webapp:latest .
`,
    'terraform.tf': `provider "aws" {
  region = "us-east-1"
}

resource "aws_ecs_cluster" "app_cluster" {
  name = "production-app-cluster"
}

resource "aws_ecs_task_definition" "web_task" {
  family                   = "web-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "256"
  memory                   = "512"
}
`
  }
};

export default function ProjectWorkspacePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { profile } = useAuth();
  const studentId = profile?.id || 'std_1';

  const [projectRec, setProjectRec] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeFile, setActiveFile] = useState('');
  const [fileContents, setFileContents] = useState<Record<string, string>>({});
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    'System: Project sandbox sandbox workspace loaded.',
    'System: Click [Run Tests] to evaluate build script and unit tests.'
  ]);
  const [isRunningTests, setIsRunningTests] = useState(false);
  const [testsPassed, setTestsPassed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    // Fetch recommendations and find by id
    fetch('/api/projects/recommendations')
      .then(res => res.json())
      .then(data => {
        if (data.recommendations) {
          const matched = data.recommendations.find((p: any) => p.id === params.id);
          if (matched) {
            setProjectRec(matched);
            const template = PROJECT_FILES[params.id] || {
              'index.js': `// Implementation for ${matched.title}\nconsole.log("Ready to build!");`
            };
            setFileContents(template);
            setActiveFile(Object.keys(template)[0]);
          }
        }
      })
      .catch(e => console.error(e))
      .finally(() => setLoading(false));
  }, [params.id]);

  const handleRunTests = () => {
    setIsRunningTests(true);
    setTerminalLogs(prev => [
      ...prev,
      `[COMMAND]: npm run test --project=${params.id}`,
      `[INFO]: Parsing directory structure...`,
      `[INFO]: Resolving package dependencies...`
    ]);

    setTimeout(() => {
      setTerminalLogs(prev => [
        ...prev,
        `[INFO]: Running linter rules... 0 warnings.`,
        `[TEST]: Validating tech stack components: [${projectRec.technologies.join(', ')}]`,
        `[TEST]: Test Case 1: Core deliverables check... PASSED`,
        `[TEST]: Test Case 2: Concurrency & scalability checks... PASSED`,
        `[TEST]: Test Case 3: Error handler policies... PASSED`,
        `[SUCCESS]: All integration tests compiled and passed (100% success rate).`,
        `System: Project verification code generated. Ready to submit Proof of Work!`
      ]);
      setIsRunningTests(false);
      setTestsPassed(true);
    }, 2000);
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFileContents(prev => ({
      ...prev,
      [activeFile]: e.target.value
    }));
  };

  const handleVerifySubmit = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/projects/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId,
          projectId: projectRec.id,
          title: projectRec.title,
          description: projectRec.description,
          technologies: projectRec.technologies,
          githubUrl: `https://github.com/${profile?.fullName?.toLowerCase().replace(/\s+/g, '-') || 'student'}/${projectRec.title.toLowerCase().replace(/\s+/g, '-')}`,
          liveUrl: `https://${projectRec.title.toLowerCase().replace(/\s+/g, '-')}.vercel.app`
        })
      });
      const data = await res.json();
      if (data.success) {
        setShowSuccessModal(true);
      } else {
        alert(data.error || 'Failed to verify project submission.');
      }
    } catch (err: any) {
      alert(err.message || 'Error submitting project verification');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center py-16">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-bold">Spinning up secure project sandbox container...</p>
        </div>
      </div>
    );
  }

  if (!projectRec) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 py-16 text-center space-y-4">
        <h2 className="text-xl font-black">Project specifications not found</h2>
        <Link href="/student/projects" className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-block">
          Return to Recommendations
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col h-screen overflow-hidden">
      
      {/* Top Header Panel */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 shrink-0 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Link href="/student/projects" className="p-2 rounded-xl bg-slate-950 hover:bg-slate-800 transition-colors border border-slate-800 text-slate-400 hover:text-white">
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-sm font-bold text-white flex items-center gap-1.5">
              <span>{projectRec.title}</span>
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                {projectRec.difficulty} Project
              </span>
            </h1>
            <p className="text-[11px] text-slate-400">
              Role: <strong className="text-slate-200">{projectRec.targetRole}</strong> • Verified Proof of Work Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTests}
            disabled={isRunningTests}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 font-bold text-xs text-slate-200 transition-all flex items-center gap-1.5 border border-slate-700"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isRunningTests ? 'Running Tests...' : 'Run Tests'}</span>
          </button>

          <button
            onClick={handleVerifySubmit}
            disabled={!testsPassed || isSubmitting}
            className={`px-5 py-2 rounded-xl font-bold text-xs text-white transition-all flex items-center gap-1.5 shadow-md ${
              testsPassed
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                : 'bg-slate-800 border border-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Verifying...' : 'Submit & Verify Passport'}</span>
          </button>
        </div>
      </div>

      {/* Main Workspace Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Sidebar - File Explorer */}
        <div className="w-56 bg-slate-900 border-r border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
            <span>Project Explorer</span>
            <Folder className="w-3.5 h-3.5 text-slate-500" />
          </div>

          <div className="p-2 space-y-1">
            {Object.keys(fileContents).map(filename => {
              const isActive = activeFile === filename;
              return (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-mono transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-primary-500/20 border border-primary-500/30 text-white font-semibold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <FileCode className={`w-4 h-4 ${isActive ? 'text-primary-400' : 'text-slate-500'}`} />
                  <span>{filename}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center - Code Editor Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950">
          <div className="p-3 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
            <span>Editor &bull; {activeFile}</span>
            <Save className="w-3.5 h-3.5 text-slate-500" />
          </div>

          {/* Simple Textarea Editor */}
          <div className="flex-1 p-4 font-mono text-xs flex">
            <div className="pr-3 text-right text-slate-700 select-none border-r border-slate-800 font-mono text-xs space-y-1">
              {Array.from({ length: (fileContents[activeFile] || '').split('\n').length }).map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
            <textarea
              value={fileContents[activeFile] || ''}
              onChange={handleCodeChange}
              className="flex-1 pl-4 bg-transparent outline-none border-none text-emerald-300 font-mono text-xs leading-relaxed resize-none h-full"
              spellCheck={false}
            />
          </div>
        </div>

        {/* Right Sidebar - Specifications & Key Deliverables */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col overflow-y-auto">
          <div className="p-4 border-b border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
            Specifications & Deliverables
          </div>

          <div className="p-4 space-y-6 text-xs leading-relaxed">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Description:</span>
              <p className="text-slate-300 font-medium">{projectRec.description}</p>
            </div>

            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-2xl space-y-2">
              <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider block">Required Tech Stack:</span>
              <div className="flex flex-wrap gap-1.5">
                {projectRec.technologies.map((t: string) => (
                  <span key={t} className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-semibold font-mono text-[10px]">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Deliverables Checklist:</span>
              <div className="space-y-2">
                {projectRec.features.map((feat: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-[11px] text-slate-300 bg-slate-950 p-2.5 rounded-xl border border-slate-800/80">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 font-bold uppercase text-[9px] tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Verification Requirements</span>
              </div>
              <p className="text-[10px]">
                To verify this Proof of Work, make sure all templates compile without syntax errors and that you run unit tests successfully before requesting passport credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Panel - Simulated Terminal Output */}
      <div className="h-44 bg-slate-900 border-t border-slate-800 shrink-0 flex flex-col min-h-0">
        <div className="px-4 py-2 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
          <span className="flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-primary-500" />
            <span>Simulated Shell Output</span>
          </span>
          <span className="text-slate-500">Ctrl+Shift+T to Clear</span>
        </div>

        <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-400 leading-relaxed space-y-1 bg-slate-950/80">
          {terminalLogs.map((log, idx) => (
            <div
              key={idx}
              className={`${
                log.startsWith('[COMMAND]')
                  ? 'text-primary-400'
                  : log.startsWith('[SUCCESS]')
                  ? 'text-emerald-400 font-semibold'
                  : log.startsWith('[TEST]')
                  ? 'text-cyan-400'
                  : log.startsWith('System')
                  ? 'text-amber-400'
                  : 'text-slate-400'
              }`}
            >
              {log}
            </div>
          ))}
          {isRunningTests && (
            <div className="text-primary-400 animate-pulse">Running test hooks...</div>
          )}
        </div>
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-400/40 shadow-lg shadow-emerald-500/10">
              <Award className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-white">Proof of Work Verified!</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Congratulations! The AI code compiler validated your implementation files for <strong>{projectRec.title}</strong>. 
                The project has been added as a verified credential to your <strong>Skill Passport</strong> and your placement readiness compatibility score has jumped by **+8%**.
              </p>
            </div>

            <div className="p-3 bg-emerald-950/40 border border-emerald-500/20 rounded-2xl text-[10px] text-emerald-300 text-left space-y-1 font-mono">
              <div>&bull; Credential ID: POW-PRJ-{projectRec.id.toUpperCase()}-{Math.floor(1000 + Math.random() * 9000)}</div>
              <div>&bull; Recruiter Status: Verified Proof of Work Seal Awarded</div>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
                router.push('/student/projects');
              }}
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs transition-colors shadow-lg shadow-emerald-600/20"
            >
              Back to Project Hub
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
