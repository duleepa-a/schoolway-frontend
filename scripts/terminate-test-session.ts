import { deleteFirebaseSession } from '../src/lib/firebase-admin';

async function terminateTestSession() {
  try {
    await deleteFirebaseSession('test-session');
    console.log('✅ Test session terminated!');
  } catch (error) {
    console.error('❌ Failed to terminate test session:', error);
  }
}

terminateTestSession();
