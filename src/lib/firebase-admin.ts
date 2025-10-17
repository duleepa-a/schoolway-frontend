import { initializeApp, cert, getApps, App } from 'firebase-admin/app';
import { getDatabase, Database } from 'firebase-admin/database';

let app: App;
let database: Database;

export function initializeFirebaseAdmin() {
  if (getApps().length === 0) {
    try {

      const serviceAccount = JSON.parse(
        process.env.FIREBASE_ADMIN_KEY || '{}'
      );

      console.log('🔑 Firebase Service Account:',serviceAccount)
      
      app = initializeApp({
        credential: cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });

      // Option 2: Using individual environment variables
      /*
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
        databaseURL: process.env.FIREBASE_DATABASE_URL,
      });
      */

      console.log('✅ Firebase Admin initialized');
    } catch (error) {
      console.error('❌ Firebase Admin initialization error:', error);
      throw error;
    }
  } else {
    app = getApps()[0];
  }

  database = getDatabase(app);
  return database;
}

// Helper to get database instance
export function getFirebaseDatabase(): Database {
  if (!database) {
    return initializeFirebaseAdmin();
  }
  return database;
}

// Utility functions for session management
export async function createFirebaseSession(sessionId: string, sessionData: any) {
  const db = getFirebaseDatabase();
  await db.ref(`active_sessions/${sessionId}`).set({
    ...sessionData,
    createdAt: Date.now(),
  });
}

export async function updateSessionLocation(
  sessionId: string, 
  location: { latitude: number; longitude: number; timestamp: number }
) {
  const db = getFirebaseDatabase();
  await db.ref(`active_sessions/${sessionId}/currentLocation`).set(location);
}

export async function updateStudentStatus(
  sessionId: string,
  childId: string,
  status: 'pending' | 'picked_up' | 'dropped_off',
  timestamp: number
) {
  const db = getFirebaseDatabase();
  await db.ref(`active_sessions/${sessionId}/students/${childId}`).update({
    status,
    [`${status === 'picked_up' ? 'pickedUpAt' : 'droppedOffAt'}`]: timestamp,
  });
}

export async function deleteFirebaseSession(sessionId: string) {
  const db = getFirebaseDatabase();
  await db.ref(`active_sessions/${sessionId}`).remove();
}

export async function getFirebaseSession(sessionId: string) {
  const db = getFirebaseDatabase();
  const snapshot = await db.ref(`active_sessions/${sessionId}`).once('value');
  return snapshot.val();
}