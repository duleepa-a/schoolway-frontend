import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createFirebaseSession } from '../src/lib/firebase-admin.ts';

// Load environment variables from .env.local
const __dirname = dirname(fileURLToPath(import.meta.url));
config({ path: join(__dirname, '../.env.local') });

async function main() {
  try {
    await createFirebaseSession('test-session', {
      driver: 'test-driver',
      status: 'TEST',
      note: 'This is a test session from backend',
    });
    console.log('Test session written to Firebase!');
  } catch (err) {
    console.error('Firebase write failed:', err);
  }
}

main();