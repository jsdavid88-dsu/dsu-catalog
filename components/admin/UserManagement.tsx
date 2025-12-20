'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface User {
    uid: string;
    email: string;
    role: 'admin' | 'student' | 'pending';
    createdAt: any;
}

export default function UserManagement() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState<string | null>(null);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const usersSnap = await getDocs(collection(db, 'users'));
            const usersList = usersSnap.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            } as User));

            // Sort: pending first, then by creation date
            usersList.sort((a, b) => {
                if (a.role === 'pending' && b.role !== 'pending') return -1;
                if (a.role !== 'pending' && b.role === 'pending') return 1;
                return 0;
            });

            setUsers(usersList);
        } catch (error) {
            console.error('Error loading users:', error);
            alert('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    const handleRoleChange = async (uid: string, newRole: string) => {
        if (!confirm(`Change user role to ${newRole}?`)) return;

        setUpdating(uid);
        try {
            await updateDoc(doc(db, 'users', uid), {
                role: newRole
            });

            // Update local state
            setUsers(users.map(u =>
                u.uid === uid ? { ...u, role: newRole as any } : u
            ));

            alert('User role updated successfully!');
        } catch (error) {
            console.error('Error updating role:', error);
            alert('Failed to update role: ' + (error as any).message);
        } finally {
            setUpdating(null);
        }
    };

    if (loading) {
        return <div className="p-6 text-center">Loading users...</div>;
    }

    const pendingUsers = users.filter(u => u.role === 'pending');
    const approvedUsers = users.filter(u => u.role !== 'pending');

    return (
        <div className="space-y-6">
            {/* Pending Users */}
            {pendingUsers.length > 0 && (
                <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-yellow-400 mb-4">
                        ⚠️ Pending Approval ({pendingUsers.length})
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-yellow-500/30">
                                    <th className="py-2 px-4">Email</th>
                                    <th className="py-2 px-4">Created</th>
                                    <th className="py-2 px-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingUsers.map((user) => (
                                    <tr key={user.uid} className="border-b border-yellow-500/10">
                                        <td className="py-3 px-4 text-white">{user.email}</td>
                                        <td className="py-3 px-4 text-gray-400 text-sm">
                                            {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                        </td>
                                        <td className="py-3 px-4 text-right space-x-2">
                                            <button
                                                onClick={() => handleRoleChange(user.uid, 'student')}
                                                disabled={updating === user.uid}
                                                className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white text-sm rounded disabled:opacity-50"
                                            >
                                                {updating === user.uid ? 'Updating...' : 'Approve as Student'}
                                            </button>
                                            <button
                                                onClick={() => handleRoleChange(user.uid, 'admin')}
                                                disabled={updating === user.uid}
                                                className="px-3 py-1 bg-purple-600 hover:bg-purple-500 text-white text-sm rounded disabled:opacity-50"
                                            >
                                                {updating === user.uid ? 'Updating...' : 'Approve as Admin'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* All Users */}
            <div className="bg-neutral-800 rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-200 mb-4">
                    All Users ({users.length})
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-neutral-700">
                                <th className="py-2 px-4">Email</th>
                                <th className="py-2 px-4">Role</th>
                                <th className="py-2 px-4">Created</th>
                                <th className="py-2 px-4 text-right">Change Role</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.uid} className="border-b border-neutral-700/50">
                                    <td className="py-3 px-4 text-white">{user.email}</td>
                                    <td className="py-3 px-4">
                                        <span className={`text-xs px-2 py-1 rounded uppercase font-bold ${user.role === 'admin'
                                                ? 'bg-purple-900/50 text-purple-400'
                                                : user.role === 'student'
                                                    ? 'bg-blue-900/50 text-blue-400'
                                                    : 'bg-yellow-900/50 text-yellow-400'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="py-3 px-4 text-gray-400 text-sm">
                                        {user.createdAt?.toDate?.().toLocaleDateString() || 'N/A'}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                        <select
                                            value={user.role}
                                            onChange={(e) => handleRoleChange(user.uid, e.target.value)}
                                            disabled={updating === user.uid}
                                            className="bg-neutral-700 border border-neutral-600 rounded px-2 py-1 text-sm text-white disabled:opacity-50"
                                        >
                                            <option value="pending">Pending</option>
                                            <option value="student">Student</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
