import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getDatabase } from 'firebase-admin/database';
import type { App } from 'firebase-admin/app';
import type { database as DatabaseNS } from 'firebase-admin';
import * as fs from 'fs';
import * as path from 'path';

let app: App;
let database: DatabaseNS.Database;

export function initializeFirebaseAdmin() {
  console.log('initializeFirebaseAdmin called');
  console.log('Current working directory:', process.cwd());
  console.log('FIREBASE_ADMIN_KEY_PATH:', process.env.FIREBASE_ADMIN_KEY_PATH);
  
  if (!getApps().length) {
    let serviceAccount;
    const keyPath = process.env.FIREBASE_ADMIN_KEY_PATH;

    if (!keyPath) {
      throw new Error('FIREBASE_ADMIN_KEY_PATH environment variable is not set');
    }

    try {
      const fullPath = path.join(process.cwd(), keyPath);
      console.log('Attempting to read from:', fullPath);
      serviceAccount = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
      console.log('Successfully loaded service account');
    } catch (error) {
      console.error('Error reading Firebase admin key file:', error);
      throw error;
    }

    app = initializeApp({
      credential: cert(serviceAccount),
      databaseURL: process.env.FIREBASE_DATABASE_URL,
    });
  } else {
    app = getApps()[0];
  }
  database = getDatabase(app);
  return database;
}

export function getFirebaseDatabase(): DatabaseNS.Database {
  if (!database) {
    return initializeFirebaseAdmin();
  }
  return database;
}

// Utility: Create a session in Firebase
export async function createFirebaseSession(sessionId: string, sessionData: any) {
  const db = getFirebaseDatabase();
  await db.ref(`active_sessions/${sessionId}`).set({
    ...sessionData,
    createdAt: Date.now(),
  });
}

// Add more helpers as needed...