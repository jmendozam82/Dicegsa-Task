'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createMeeting } from '../../../app/actions/meeting-actions';

interface User {
    id: string;
    full_name: string | null;
}

interface CreateMeetingSheetProps {
    activeUsers: User[];
    onSuccess?: (meetingId: string) => void;
}

export default function CreateMeetingSheet({
    activeUsers,
    onSuccess,
}: CreateMeetingSheetProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const toggleUser = (userId: string) => {
        setSelectedUsers((prev) =>
            prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        startTransition(async () => {
            const result = await createMeeting({
                title,
                description,
                participant_ids: selectedUsers,
            });

            if (result.success) {
                setIsOpen(false);
                setTitle('');
                setDescription('');
                setSelectedUsers([]);
                onSuccess?.(result.data.id);
            } else {
                setErrorMsg(result.error);
            }
        });
    };

    return (
        <>
            {/* Trigger Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-5 py-2.5 rounded-2xl bg-[#007AFF] text-white text-sm font-medium shadow-lg hover:bg-[#0063D6] transition-colors"
            >
                + Nueva Reunión
            </motion.button>

            {/* Backdrop + Sheet */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            key="backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        />

                        {/* Sheet panel */}
                        <motion.div
                            key="sheet"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            className="fixed top-0 right-0 h-full w-full max-w-md z-50 flex flex-col"
                            style={{
                                background: 'rgba(255,255,255,0.72)',
                                backdropFilter: 'blur(24px)',
                                WebkitBackdropFilter: 'blur(24px)',
                                borderLeft: '1px solid rgba(255,255,255,0.5)',
                                boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
                            }}
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-5 border-b border-white/40">
                                <h2 className="text-lg font-semibold text-gray-900">Nueva Reunión</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                                    aria-label="Cerrar"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6 overflow-y-auto flex-1">
                                {/* Title */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Título <span className="text-[#FF3B30]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Ej. Revisión de avances Q1"
                                        required
                                        className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                                    />
                                </div>

                                {/* Description */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Descripción
                                    </label>
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Agenda, objetivos, contexto..."
                                        rows={3}
                                        className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition resize-none"
                                    />
                                </div>

                                {/* Participant selection */}
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                        Participantes
                                    </label>
                                    {activeUsers.length === 0 ? (
                                        <p className="text-sm text-gray-400 italic">No hay usuarios disponibles.</p>
                                    ) : (
                                        <div className="flex flex-col gap-2 max-h-52 overflow-y-auto pr-1">
                                            {activeUsers.map((user) => {
                                                const isSelected = selectedUsers.includes(user.id);
                                                return (
                                                    <motion.button
                                                        type="button"
                                                        key={user.id}
                                                        onClick={() => toggleUser(user.id)}
                                                        whileHover={{ scale: 1.01 }}
                                                        whileTap={{ scale: 0.99 }}
                                                        className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-left transition-all border ${isSelected
                                                                ? 'bg-[#007AFF]/10 border-[#007AFF]/40 text-[#007AFF]'
                                                                : 'bg-white/60 border-gray-200 text-gray-700 hover:border-gray-300'
                                                            }`}
                                                    >
                                                        <div
                                                            className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${isSelected ? 'bg-[#007AFF] border-[#007AFF]' : 'border-gray-300'
                                                                }`}
                                                        >
                                                            {isSelected && (
                                                                <svg className="w-2.5 h-2.5 text-white" viewBox="0 0 10 10" fill="none">
                                                                    <path d="M2 5l2.5 2.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        <span>{user.full_name ?? 'Usuario sin nombre'}</span>
                                                    </motion.button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>

                                {/* Error */}
                                {errorMsg && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-sm text-[#FF3B30] bg-[#FF3B30]/10 rounded-xl px-4 py-2.5"
                                    >
                                        {errorMsg}
                                    </motion.p>
                                )}

                                {/* Submit */}
                                <motion.button
                                    type="submit"
                                    disabled={isPending}
                                    whileHover={{ scale: isPending ? 1 : 1.02 }}
                                    whileTap={{ scale: isPending ? 1 : 0.98 }}
                                    className="mt-auto w-full rounded-2xl bg-[#007AFF] py-3.5 text-sm font-semibold text-white shadow-md hover:bg-[#0063D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    {isPending ? 'Creando...' : 'Crear Reunión'}
                                </motion.button>
                            </form>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
