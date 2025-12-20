import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './config';

/**
 * Ensures a user document exists in Firestore users collection
 * Creates one with role='pending' if it doesn't exist (requires admin approval)
 * @param uid Firebase Auth user ID
 * @param email User's email address
 * @returns User's role ('admin', 'student', or 'pending')
 */
export async function ensureUserDocument(uid: string, email: string): Promise<string> {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
        // User already exists, return their role
        return userSnap.data()?.role || 'pending';
    }

    // Create new user document with default 'pending' role (awaiting admin approval)
    await setDoc(userRef, {
        email,
        role: 'pending',
        createdAt: serverTimestamp(),
    });

    console.log(`Created new user document for ${email} with role=pending`);
    return 'pending';
}
