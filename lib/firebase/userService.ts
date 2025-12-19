import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

/**
 * Ensures a user document exists in Firestore users collection
 * Creates one with role='student' if it doesn't exist
 * @param uid Firebase Auth user ID
 * @param email User's email address
 * @returns User's role ('admin' or 'student')
 */
export async function ensureUserDocument(uid: string, email: string): Promise<string> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User already exists, return their role
        return userSnap.data()?.role || 'student';
    }

    // Create new user document with default student role
    await setDoc(userRef, {
        email,
        role: 'student',
        createdAt: serverTimestamp(),
    });

    console.log(`Created new user document for ${email} with role=student`);
    return 'student';
}
