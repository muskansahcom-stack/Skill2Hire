-- ==============================================================================
-- 🚀 1-CLICK ALL-IN-ONE SUPABASE SCHEMA, RLS ENFORCEMENT & POLICY SETUP
-- Project: https://ggxqoqzjciuweruahbkm.supabase.co
-- ==============================================================================

-- STEP 1: CREATE ALL TABLES EXPLICITLY IN THE 'public' SCHEMA
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    phone TEXT,
    "passwordHash" TEXT,
    role TEXT,
    "isEmailVerified" BOOLEAN DEFAULT false,
    "isPhoneVerified" BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'ACTIVE',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.students (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    "fullName" TEXT,
    email TEXT,
    phone TEXT,
    "collegeId" TEXT,
    "collegeName" TEXT,
    degree TEXT,
    department TEXT,
    "graduationYear" INT,
    cgpa NUMERIC(4,2),
    location TEXT,
    "placementReadiness" INT,
    "placementStatus" TEXT,
    "careerGoal" TEXT,
    "resumeUrl" TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.colleges (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    name TEXT,
    code TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    website TEXT,
    "establishedYear" INT,
    "totalStudents" INT,
    "placementRate" INT,
    bio TEXT,
    logo TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.companies (
    id TEXT PRIMARY KEY,
    "userId" TEXT,
    name TEXT,
    industry TEXT,
    location TEXT,
    website TEXT,
    phone TEXT,
    size TEXT,
    description TEXT,
    logo TEXT,
    verified BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.jobs (
    id TEXT PRIMARY KEY,
    "companyId" TEXT,
    title TEXT,
    description TEXT,
    location TEXT,
    "jobType" TEXT,
    "experienceRequired" TEXT,
    "salaryMin" NUMERIC,
    "salaryMax" NUMERIC,
    "applicationDeadline" TIMESTAMPTZ,
    status TEXT DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ DEFAULT NOW(),
    "updatedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.applications (
    id TEXT PRIMARY KEY,
    "jobId" TEXT,
    "studentId" TEXT,
    status TEXT DEFAULT 'APPLIED',
    "readinessScore" INT,
    "appliedAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.otps (
    id TEXT PRIMARY KEY,
    identifier TEXT NOT NULL,
    type TEXT NOT NULL,
    purpose TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMPTZ NOT NULL,
    attempts INT DEFAULT 0,
    "maxAttempts" INT DEFAULT 5,
    "resendAvailableAt" TIMESTAMPTZ NOT NULL,
    verified BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.skills (
    id TEXT PRIMARY KEY,
    name TEXT,
    category TEXT,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT,
    description TEXT,
    instructor TEXT,
    category TEXT,
    duration TEXT,
    level TEXT,
    "lessonsCount" INT DEFAULT 5,
    rating NUMERIC(3,1) DEFAULT 4.8,
    "isPublished" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.assessments (
    id TEXT PRIMARY KEY,
    title TEXT,
    "courseId" TEXT,
    "skillName" TEXT,
    "totalQuestions" INT DEFAULT 10,
    "passingScore" INT DEFAULT 75,
    "durationMinutes" INT DEFAULT 20,
    "createdAt" TIMESTAMPTZ DEFAULT NOW()
);

-- STEP 2: FORCE ENABLE ROW LEVEL SECURITY (RLS) ON ALL 10 TABLES
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.otps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- STEP 3: DROP ALL OLD POLICIES
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname, tablename FROM pg_policies WHERE schemaname = 'public') LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', r.policyname, r.tablename);
    END LOOP;
END $$;

-- STEP 4: CREATE PERMISSIVE RLS POLICIES FOR FULL APP FUNCTIONALITY
CREATE POLICY "Allow all on users" ON public.users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on students" ON public.students FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on colleges" ON public.colleges FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on companies" ON public.companies FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on jobs" ON public.jobs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on applications" ON public.applications FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on otps" ON public.otps FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on skills" ON public.skills FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on courses" ON public.courses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on assessments" ON public.assessments FOR ALL USING (true) WITH CHECK (true);
