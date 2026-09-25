/**
 * Skill2Hire - Admin Provisioning CLI Script
 * 
 * Usage:
 *   ADMIN_EMAIL=admin@skill2hire.com ADMIN_PASSWORD="your-secure-password" npm run create-admin
 *   OR:
 *   npx tsx scripts/create-admin.ts --email admin@skill2hire.com --password "your-secure-password"
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const SALT = '_s2h_secure_salt_2026';
const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

function hashAdminPassword(password: string): string {
  return crypto.createHash('sha256').update(password + SALT).digest('hex');
}

// Parse args or env variables
function getCredentials() {
  const args = process.argv.slice(2);
  let email = process.env.ADMIN_EMAIL;
  let password = process.env.ADMIN_PASSWORD;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--email' && args[i + 1]) {
      email = args[i + 1];
    }
    if (args[i] === '--password' && args[i + 1]) {
      password = args[i + 1];
    }
  }

  // Load from .env.local if present and not set
  if (!email || !password) {
    const envLocalPath = path.join(process.cwd(), '.env.local');
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, 'utf8');
      const lines = content.split('\n');
      for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('ADMIN_EMAIL=') && !email) {
          email = trimmed.replace('ADMIN_EMAIL=', '').trim().replace(/^["']|["']$/g, '');
        }
        if (trimmed.startsWith('ADMIN_PASSWORD=') && !password) {
          password = trimmed.replace('ADMIN_PASSWORD=', '').trim().replace(/^["']|["']$/g, '');
        }
      }
    }
  }

  return {
    email: email || 'admin@skill2hire.com',
    password: password || 'Admin@Secure2026!'
  };
}

async function main() {
  console.log('\n🔒 Skill2Hire Administrative CLI Provisioner');
  console.log('============================================');

  const { email, password } = getCredentials();

  if (!email || !password) {
    console.error('❌ Error: Both admin email and password are required.');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Error: Admin password must be at least 8 characters long.');
    process.exit(1);
  }

  if (!fs.existsSync(DB_PATH)) {
    console.error(`❌ Error: Database file not found at ${DB_PATH}`);
    process.exit(1);
  }

  const rawData = fs.readFileSync(DB_PATH, 'utf8');
  const db = JSON.parse(rawData);

  if (!Array.isArray(db.users)) {
    db.users = [];
  }

  const cleanEmail = email.trim().toLowerCase();
  const passwordHash = hashAdminPassword(password);

  let existingUser = db.users.find((u: any) => u.email?.toLowerCase() === cleanEmail);

  if (existingUser) {
    console.log(`ℹ️  Found existing account for: ${cleanEmail}`);
    existingUser.role = 'admin';
    existingUser.passwordHash = passwordHash;
    existingUser.updatedAt = new Date().toISOString();
    console.log(`✅ Role confirmed as ADMIN and password hash updated.`);
  } else {
    const newAdmin = {
      id: `u_admin_${Date.now()}`,
      name: 'System Administrator',
      email: cleanEmail,
      phone: '+91 98765 00000',
      role: 'admin',
      passwordHash: passwordHash,
      email_verified: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.users.push(newAdmin);
    console.log(`✅ Created new dedicated ADMIN user: ${cleanEmail} (ID: ${newAdmin.id})`);
  }

  // Record audit log
  if (!Array.isArray(db.adminAuditLogs)) {
    db.adminAuditLogs = [];
  }

  db.adminAuditLogs.unshift({
    id: `log_cli_${Date.now()}`,
    timestamp: new Date().toISOString(),
    action: 'ADMIN_PROVISIONED_VIA_CLI',
    adminEmail: cleanEmail,
    ipAddress: '127.0.0.1 (CLI)',
    details: {
      source: 'CLI_SCRIPT',
      email: cleanEmail
    }
  });

  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

  console.log('============================================');
  console.log('🎉 Administrator successfully provisioned in the backend database!');
  console.log(`   Email:    ${cleanEmail}`);
  console.log(`   Role:     ADMIN`);
  console.log(`   Security: Salted SHA-256 Hash stored (plaintext password never saved)`);
  console.log(`   Login:    /admin/login\n`);
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});
