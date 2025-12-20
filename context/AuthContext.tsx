'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/config';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    userRole: 'admin' | 'student' | 'pending' | null;
    loginAsMock?: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, userRole: null });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [userRole, setUserRole] = useState<'admin' | 'student' | 'pending' | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for mock user in localStorage
        const mockUser = localStorage.getItem('mockUser');
        if (mockUser) {
            setUser({ uid: 'mock-admin', email: 'admin@dsu.ac.kr', emailVerified: true } as User);
            setUserRole('admin');  // Mock user is always admin
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setUser(firebaseUser);

            if (firebaseUser) {
                // Fetch user role from Firestore
                try {
                    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                    if (userDoc.exists()) {
                        setUserRole(userDoc.data()?.role || 'pending');
                    } else {
                        // Default to pending if no role document exists
                        setUserRole('pending');
                    }
                } catch (error) {
                    console.error('Error fetching user role:', error);
                    setUserRole('pending');
                }
            } else {
                setUserRole(null);
            }

            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const loginAsMock = () => {
        localStorage.setItem('mockUser', 'true');
        setUser({ uid: 'mock-admin', email: 'admin@dsu.ac.kr', emailVerified: true } as User);
        setUserRole('admin');
        window.location.href = '/admin';
    };

    return (
        <AuthContext.Provider value={{ user, loading, userRole, loginAsMock }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
