import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read typescript compiled or direct seed generator
console.log('🌱 Generating Skill2Hire seed database...');

const dataDir = path.join(__dirname, '..', 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// We will let Next.js initialize via lib/seedData.ts on initial launch
console.log('✅ Seed environment prepared.');
