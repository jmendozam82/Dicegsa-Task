'use client';

import { useState, useEffect, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllUsers, updateUserStatus } from '../../actions/profile-actions';
import { Profile } from '../../../core/entities/Profile';
import Image from 'next/image';
import Link from 'next/link';

export default function UserDirectoryPage() {
    const [users, setUsers] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        const result = await getAllUsers();
        if (result.success) {
            setUsers(result.data ?? []);
        } else {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleToggleStatus = (userId: string, currentActive: boolean) => {
        startTransition(async () => {
            const result = await updateUserStatus(userId, !currentActive);
            if (result.success) {
                setUsers(prev => prev.map(u => u.id === userId ? { ...u, active: !currentActive } : u));
            } else {
                alert(result.error);
            }
        });
    };

    return (
        <main
            className="min-h-screen p-8"
            style={{
                background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
        >
            <div className="max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Directorio de Usuarios</h1>
                        <p className="text-sm text-gray-500 mt-1">Gestiona el acceso de los miembros del equipo.</p>
                    </div>
                    <Link href="/" className="text-sm text-[#007AFF] hover:underline underline-offset-2">
                        ← Inicio
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin h-6 w-6 border-2 border-[#007AFF] border-t-transparent rounded-full" />
                    </div>
                ) : (
                    <div
                        className="rounded-3xl overflow-hidden shadow-sm"
                        style={{
                            background: 'rgba(255,255,255,0.70)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                        }}
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-gray-100/50">
                                        <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Usuario</th>
                                        <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Rol</th>
                                        <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-4 text-[11px] font-semibold text-gray-400 uppercase tracking-wider text-right">Acceso</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100/50">
                                    <AnimatePresence>
                                        {users.map((user) => (
                                            <motion.tr
                                                key={user.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                className="group hover:bg-white/40 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        {user.avatar_url ? (
                                                            <Image src={user.avatar_url} alt="" width={32} height={32} className="rounded-full overflow-hidden" />
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-full bg-[#007AFF]/10 text-[#007AFF] flex items-center justify-center text-xs font-bold">
                                                                {user.full_name?.charAt(0) ?? '?'}
                                                            </div>
                                                        )}
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                                                            <p className="text-[11px] text-gray-400">{user.id.slice(0, 8)}...</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${user.role === 'admin' ? 'bg-[#007AFF]/10 text-[#007AFF]' : 'bg-gray-100 text-gray-500'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className={`w-1.5 h-1.5 rounded-full ${user.active ? 'bg-[#34C759]' : 'bg-[#FF3B30]'}`} />
                                                        <span className="text-xs text-gray-600">{user.active ? 'Activo' : 'Desactivado'}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleToggleStatus(user.id, user.active)}
                                                        className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${user.active ? 'bg-[#34C759]' : 'bg-gray-200'
                                                            }`}
                                                    >
                                                        <span
                                                            aria-hidden="true"
                                                            className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${user.active ? 'translate-x-4' : 'translate-x-0'
                                                                }`}
                                                        />
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
