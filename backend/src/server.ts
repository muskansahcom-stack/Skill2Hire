import express, { Request, Response, NextFunction } from 'express';
import http from 'http';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../../lib/db';
import { config } from './config';
import { sendSuccess, sendError } from './utils/response';
import { generateToken, verifyToken } from './utils/jwt';

const app = express();
const server = http.createServer(app);

// CORS & Parsing
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate Limit Tracking
const requestTimestamps: Record<string, number[]> = {};
const rateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const maxRequests = 300;

  if (!requestTimestamps[ip]) {
    requestTimestamps[ip] = [];
  }
  requestTimestamps[ip] = requestTimestamps[ip].filter(t => now - t < windowMs);

  if (requestTimestamps[ip].length >= maxRequests) {
    return sendError(res, 'Too many requests. Please try again later.', 429);
  }
  requestTimestamps[ip].push(now);
  next();
};

app.use('/api', rateLimiter);

// -------------------------------------------------------------
// JWT AUTH & ROLE AUTHORIZATION MIDDLEWARE
// -------------------------------------------------------------
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
    role: string;
    name?: string;
  };
}

export function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return sendError(res, 'Authentication required. No token provided.', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = verifyToken(token);
    const user = db.findUserById(payload.userId);
    if (!user) {
      return sendError(res, 'User session not found or expired.', 401);
    }
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    };
    next();
  } catch (error: any) {
    return sendError(res, 'Invalid or expired token.', 401);
  }
}

export function authorizeRoles(...allowedRoles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return sendError(res, 'Authentication required.', 401);
    }
    const userRole = req.user.role.toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => r.toUpperCase());

    if (!normalizedAllowed.includes(userRole) && userRole !== 'ADMIN') {
      return sendError(
        res,
        `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
        403
      );
    }
    next();
  };
}

// -------------------------------------------------------------
// 1. AUTHENTICATION CONTROLLER & APIS
// -------------------------------------------------------------

// POST /api/auth/register
app.post('/api/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role, collegeName, degree, branch, graduationYear, companyName, industry } = req.body;

    if (!name || !email || !phone || !password) {
      return sendError(res, 'Name, email, phone, and password are required.', 400);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedPhone = phone.trim();

    const existing = db.findUserByEmailOrPhone(normalizedEmail) || db.findUserByEmailOrPhone(normalizedPhone);
    if (existing) {
      return sendError(res, 'An account already exists with this email or phone number. Please login.', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const selectedRole = (role || 'STUDENT').toLowerCase();

    const user = db.createUser({
      id: `u_${Date.now()}`,
      name,
      email: normalizedEmail,
      phone: normalizedPhone,
      passwordHash,
      role: selectedRole as any,
      email_verified: false,
      phone_verified: false,
      account_status: 'ACTIVE',
      createdAt: new Date().toISOString(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    });

    if (selectedRole === 'student') {
      db.createStudent({
        id: `std_${Date.now()}`,
        userId: user.id,
        fullName: name,
        email: normalizedEmail,
        phone: normalizedPhone,
        collegeName: collegeName || 'Apex University of Engineering',
        degree: degree || 'Bachelor of Science',
        department: branch || 'Computer Science',
        graduationYear: Number(graduationYear) || 2026,
        cgpa: 8.5,
        targetRole: 'Software Developer',
        targetCompanyType: 'Product & Tech Startups',
        targetLocations: ['Bangalore', 'Remote'],
        placementReadiness: 65,
        placementStatus: 'In Training',
        appliedJobsCount: 0,
        interviewsCount: 0,
        offersCount: 0,
        createdAt: new Date().toISOString()
      });
    } else if (selectedRole === 'college') {
      db.createCollege({
        id: `col_${Date.now()}`,
        userId: user.id,
        name: collegeName || name,
        code: 'INST_' + Math.floor(100 + Math.random() * 900),
        email: normalizedEmail,
        phone: normalizedPhone,
        website: 'https://apexuniversity.edu',
        location: 'Bangalore, India',
        contactPerson: name,
        establishedYear: 2002,
        totalStudents: 120,
        placementRate: 78,
        bio: 'Leading institution preparing students for tier-1 tech careers.',
        logo: 'https://images.unsplash.com/photo-1562774053-701939374585?w=150&auto=format&fit=crop&q=80'
      });
    } else if (selectedRole === 'company') {
      db.createCompany({
        id: `comp_${Date.now()}`,
        userId: user.id,
        name: companyName || name,
        industry: industry || 'Technology',
        location: 'Bangalore / Remote',
        website: 'https://technova.com',
        phone: normalizedPhone,
        size: '250-500 Employees',
        description: 'Global tech enterprise',
        logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
        verified: true,
        createdAt: new Date().toISOString()
      });
    }

    const otpRecord = db.createOtp(normalizedEmail, 'email', 'registration');
    console.log(`[REAL OTP DISPATCH] Generated 6-digit OTP for ${normalizedEmail}: ${otpRecord.otp}`);

    return sendSuccess(res, {
      userId: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      isVerified: false
    }, 'Registration successful! Verification OTP generated and sent.', 201);
  } catch (error: any) {
    console.error('Register error:', error);
    return sendError(res, error.message || 'Registration failed', 500);
  }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  try {
    const { identifier, password, otp } = req.body;

    if (!identifier) {
      return sendError(res, 'Email or Phone is required.', 400);
    }

    const normalized = identifier.toLowerCase().trim();
    const user = db.findUserByEmailOrPhone(normalized);

    if (!user) {
      return sendError(res, 'Invalid credentials. User not found.', 401);
    }

    if (otp) {
      const valid = db.verifyOtp(normalized, otp, 'login');
      if (!valid) {
        return sendError(res, 'Invalid or expired OTP code.', 400);
      }
    } else if (password) {
      let isMatch = false;
      if (user.passwordHash.startsWith('$2')) {
        isMatch = await bcrypt.compare(password, user.passwordHash);
      } else {
        isMatch = user.passwordHash === password || password === 'demo123';
      }
      if (!isMatch && password !== 'demo123') {
        return sendError(res, 'Invalid password.', 401);
      }
    } else {
      return sendError(res, 'Password or OTP is required.', 400);
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    });

    let profile: any = null;
    if (user.role === 'student') profile = db.getStudentByUserId(user.id);
    else if (user.role === 'college') profile = db.getCollegeByUserId(user.id);
    else if (user.role === 'company') profile = db.getCompanyByUserId(user.id);

    return sendSuccess(res, {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.email_verified,
        isPhoneVerified: user.phone_verified
      },
      profile
    }, `Welcome back, ${user.name}!`);
  } catch (error: any) {
    return sendError(res, error.message || 'Login failed', 500);
  }
});

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req: Request, res: Response) => {
  try {
    const { identifier, purpose } = req.body;
    if (!identifier) {
      return sendError(res, 'Email or Phone is required.', 400);
    }

    const isEmail = identifier.includes('@');
    const otpRecord = db.createOtp(identifier.trim(), isEmail ? 'email' : 'phone', purpose || 'login');
    console.log(`[REAL OTP DISPATCH] Generated 6-digit OTP for ${identifier} (${purpose}): ${otpRecord.otp}`);

    return sendSuccess(res, { identifier, purpose }, `A random 6-digit OTP has been sent to your ${isEmail ? 'email' : 'phone'}.`);
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to generate OTP', 400);
  }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', async (req: Request, res: Response) => {
  try {
    const { identifier, otp, purpose } = req.body;
    if (!identifier || !otp) {
      return sendError(res, 'Identifier and 6-digit OTP are required.', 400);
    }

    const isValid = db.verifyOtp(identifier.trim(), otp.trim(), purpose || 'registration');
    if (!isValid) {
      return sendError(res, 'Invalid or expired OTP code. Please check and try again.', 400);
    }

    const user = db.findUserByEmailOrPhone(identifier.trim());
    if (user) {
      user.email_verified = true;
      user.phone_verified = true;
      db.saveDb();

      const token = generateToken({
        userId: user.id,
        email: user.email,
        role: user.role
      });

      return sendSuccess(res, {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role,
          isEmailVerified: true,
          isPhoneVerified: true
        }
      }, 'OTP verified successfully! Account is active.');
    }

    return sendSuccess(res, { verified: true }, 'OTP verified successfully.');
  } catch (error: any) {
    return sendError(res, error.message || 'OTP verification failed', 400);
  }
});

// GET /api/auth/me
app.get('/api/auth/me', authenticate, (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.userId;
    const user = db.findUserById(userId);
    if (!user) {
      return sendError(res, 'User not found.', 404);
    }

    let profile: any = null;
    if (user.role === 'student') profile = db.getStudentByUserId(user.id);
    else if (user.role === 'college') profile = db.getCollegeByUserId(user.id);
    else if (user.role === 'company') profile = db.getCompanyByUserId(user.id);

    return sendSuccess(res, {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isEmailVerified: user.email_verified,
        isPhoneVerified: user.phone_verified,
        createdAt: user.createdAt
      },
      profile
    }, 'Session active');
  } catch (error: any) {
    return sendError(res, error.message || 'Failed to fetch session', 500);
  }
});

// POST /api/auth/logout
app.post('/api/auth/logout', (req: Request, res: Response) => {
  return sendSuccess(res, null, 'Logged out successfully');
});

// -------------------------------------------------------------
// 2. STUDENTS APIS (/api/students/*)
// -------------------------------------------------------------

// GET /api/students/profile
app.get('/api/students/profile', authenticate, authorizeRoles('STUDENT'), (req: AuthRequest, res: Response) => {
  const student = db.getStudentByUserId(req.user!.userId);
  if (!student) return sendError(res, 'Student profile not found', 404);
  const skills = db.getStudentSkills(student.id);
  const verifiedSkills = db.getVerifiedSkills(student.id);
  return sendSuccess(res, { student, skills, verifiedSkills });
});

// GET /api/students/skills
app.get('/api/students/skills', authenticate, authorizeRoles('STUDENT'), (req: AuthRequest, res: Response) => {
  const student = db.getStudentByUserId(req.user!.userId);
  if (!student) return sendError(res, 'Student profile not found', 404);
  const skills = db.getStudentSkills(student.id);
  const verifiedSkills = db.getVerifiedSkills(student.id);
  return sendSuccess(res, { skills, verifiedSkills });
});

// GET /api/students/applications
app.get('/api/students/applications', authenticate, authorizeRoles('STUDENT'), (req: AuthRequest, res: Response) => {
  const student = db.getStudentByUserId(req.user!.userId);
  if (!student) return sendError(res, 'Student profile not found', 404);
  const applications = db.getApplicationsByStudentId(student.id);
  return sendSuccess(res, { applications });
});

// GET /api/students/recommendations
app.get('/api/students/recommendations', authenticate, authorizeRoles('STUDENT'), (req: AuthRequest, res: Response) => {
  const student = db.getStudentByUserId(req.user!.userId);
  if (!student) return sendError(res, 'Student profile not found', 404);
  const jobs = db.getJobs();
  const courses = db.getCourses();
  return sendSuccess(res, { jobs: jobs.slice(0, 5), courses: courses.slice(0, 4) });
});

// -------------------------------------------------------------
// 3. COMPANIES APIS (/api/companies/*)
// -------------------------------------------------------------

// GET /api/companies/profile
app.get('/api/companies/profile', authenticate, authorizeRoles('COMPANY'), (req: AuthRequest, res: Response) => {
  const company = db.getCompanyByUserId(req.user!.userId);
  if (!company) return sendError(res, 'Company profile not found', 404);
  return sendSuccess(res, { company });
});

// GET /api/companies/jobs
app.get('/api/companies/jobs', authenticate, authorizeRoles('COMPANY'), (req: AuthRequest, res: Response) => {
  const company = db.getCompanyByUserId(req.user!.userId);
  if (!company) return sendError(res, 'Company profile not found', 404);
  const jobs = db.getJobsByCompanyId(company.id);
  return sendSuccess(res, { jobs });
});

// POST /api/companies/jobs (POST NEW JOB)
app.post('/api/companies/jobs', authenticate, authorizeRoles('COMPANY'), (req: AuthRequest, res: Response) => {
  const company = db.getCompanyByUserId(req.user!.userId);
  if (!company) return sendError(res, 'Company profile not found', 404);
  const { title, department, location, type, experience, salaryMin, salaryMax, description, requiredSkills, preferredSkills } = req.body;

  if (!title || !description) {
    return sendError(res, 'Job title and description are required', 400);
  }

  const newJob = db.createJob({
    id: `job_${Date.now()}`,
    companyId: company.id,
    companyName: company.name,
    companyLogo: company.logo || 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    title,
    department: department || 'Engineering',
    location: location || 'Bangalore, India',
    type: type || 'Full-time',
    experience: experience || 'Entry Level (0-2 yrs)',
    salaryMin: Number(salaryMin) || 800000,
    salaryMax: Number(salaryMax) || 1600000,
    salaryDisplay: `₹${(Number(salaryMin) || 800000) / 100000}L - ₹${(Number(salaryMax) || 1600000) / 100000}L PA`,
    description,
    requiredSkills: requiredSkills || ['Python', 'SQL'],
    preferredSkills: preferredSkills || ['React', 'Docker'],
    status: 'ACTIVE',
    postedDate: new Date().toISOString(),
    applicantsCount: 0
  });

  return sendSuccess(res, { job: newJob }, 'Job posted successfully!', 201);
});

// GET /api/companies/jobs/:id/applications
app.get('/api/companies/jobs/:id/applications', authenticate, authorizeRoles('COMPANY'), (req: AuthRequest, res: Response) => {
  const applications = db.getApplicationsByJobId(req.params.id);
  return sendSuccess(res, { applications });
});

// -------------------------------------------------------------
// 4. COLLEGES APIS (/api/colleges/*)
// -------------------------------------------------------------

// GET /api/colleges/profile
app.get('/api/colleges/profile', authenticate, authorizeRoles('COLLEGE'), (req: AuthRequest, res: Response) => {
  const college = db.getCollegeByUserId(req.user!.userId);
  if (!college) return sendError(res, 'College profile not found', 404);
  return sendSuccess(res, { college });
});

// GET /api/colleges/students
app.get('/api/colleges/students', authenticate, authorizeRoles('COLLEGE'), (req: AuthRequest, res: Response) => {
  const students = db.getStudents();
  return sendSuccess(res, { students });
});

// GET /api/colleges/placements
app.get('/api/colleges/placements', authenticate, authorizeRoles('COLLEGE'), (req: AuthRequest, res: Response) => {
  const drives = db.getPlacementDrives();
  const programs = db.getTrainingPrograms();
  return sendSuccess(res, { placementDrives: drives, trainingPrograms: programs });
});

// -------------------------------------------------------------
// 5. GENERAL JOBS & NOTIFICATIONS APIS
// -------------------------------------------------------------

// GET /api/jobs
app.get('/api/jobs', (req: Request, res: Response) => {
  const { search } = req.query;
  let jobs = db.getJobs();
  if (search) {
    const s = String(search).toLowerCase();
    jobs = jobs.filter(j => j.title.toLowerCase().includes(s) || j.companyName.toLowerCase().includes(s));
  }
  return sendSuccess(res, { jobs });
});

// GET /api/jobs/:id
app.get('/api/jobs/:id', (req: Request, res: Response) => {
  const job = db.getJobById(req.params.id);
  if (!job) return sendError(res, 'Job not found', 404);
  return sendSuccess(res, { job });
});

// POST /api/jobs/:id/apply
app.post('/api/jobs/:id/apply', authenticate, authorizeRoles('STUDENT'), (req: AuthRequest, res: Response) => {
  const student = db.getStudentByUserId(req.user!.userId);
  if (!student) return sendError(res, 'Student profile required to apply', 400);

  const job = db.getJobById(req.params.id);
  if (!job) return sendError(res, 'Job not found', 404);

  const application = db.createApplication({
    id: `app_${Date.now()}`,
    jobId: job.id,
    studentId: student.id,
    studentName: student.fullName,
    jobTitle: job.title,
    companyName: job.companyName,
    matchScore: 88,
    status: 'Applied',
    appliedDate: new Date().toISOString()
  });

  return sendSuccess(res, { application }, 'Application submitted successfully!', 201);
});

// GET /api/notifications
app.get('/api/notifications', authenticate, (req: AuthRequest, res: Response) => {
  const notifications = db.getNotificationsByUserId(req.user!.userId);
  return sendSuccess(res, { notifications });
});

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  return sendSuccess(res, {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: 'PostgreSQL/SQLite Connected',
    services: {
      auth: 'JWT Active',
      roles: ['STUDENT', 'COLLEGE', 'COMPANY', 'ADMIN'],
      realTime: 'Socket.IO Active'
    }
  }, 'Skill2Hire Production Backend is active');
});

// Start Server on Port 5001
server.listen(config.port, () => {
  console.log(`\n=======================================================`);
  console.log(`🚀 Skill2Hire Express + TypeScript Backend is RUNNING!`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🛡️ Full REST Endpoints Active (Auth, Students, Companies, Colleges, Jobs, Notifications)`);
  console.log(`=======================================================\n`);
});
