'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTask } from '../../../app/actions/task-actions';

interface User {
    id: string;
    full_name: string | null;
}

interface CreateTaskSheetProps {
    meetingId: string;
    meetingTitle: string;
    participants: User[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (taskId: string) => void;
}

export default function CreateTaskSheet({
    meetingId,
    meetingTitle,
    participants,
    isOpen,
    onClose,
    onSuccess,
}: CreateTaskSheetProps) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [assignedTo, setAssignedTo] = useState<string>('');
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);

        if (!assignedTo) {
            setErrorMsg('Por favor selecciona un responsable.');
            return;
        }

        startTransition(async () => {
            const result = await createTask({
                meeting_id: meetingId,
                title,
                description,
                assigned_to: assignedTo,
            });

            if (result.success) {
                setTitle('');
                setDescription('');
                setAssignedTo('');
                if (result.data) onSuccess?.(result.data.id);
                onClose();
            } else {
                setErrorMsg(result.error);
            }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        key="task-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
                    />

                    {/* Sheet panel */}
                    <motion.div
                        key="task-sheet"
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="fixed top-0 right-0 h-full w-full max-w-md z-[70] flex flex-col"
                        style={{
                            background: 'rgba(255,255,255,0.72)',
                            backdropFilter: 'blur(24px)',
                            WebkitBackdropFilter: 'blur(24px)',
                            borderLeft: '1px solid rgba(255,255,255,0.5)',
                            boxShadow: '-8px 0 40px rgba(0,0,0,0.12)',
                        }}
                    >
                        {/* Header */}
                        <div className="flex flex-col px-6 py-5 border-b border-white/40 gap-1">
                            <div className="flex items-center justify-between">
                                <h2 className="text-lg font-semibold text-gray-900">Asignar Tarea</h2>
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-gray-600 transition-colors text-xl leading-none"
                                >
                                    ✕
                                </button>
                            </div>
                            <p className="text-xs text-gray-500 truncate">Reunión: {meetingTitle}</p>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5 px-6 py-6 overflow-y-auto flex-1">
                            {/* Title */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Título de la Tarea <span className="text-[#FF3B30]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej. Enviar presupuesto final"
                                    required
                                    className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                                />
                            </div>

                            {/* Description */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Descripción / Notas
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Detalles específicos sobre la entrega..."
                                    rows={3}
                                    className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition resize-none"
                                />
                            </div>

                            {/* Assignee selection */}
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                                    Asignar a <span className="text-[#FF3B30]">*</span>
                                </label>
                                {participants.length === 0 ? (
                                    <p className="text-sm text-gray-400 italic">No hay participantes en esta reunión.</p>
                                ) : (
                                    <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
                                        {participants.map((user) => {
                                            const isSelected = assignedTo === user.id;
                                            return (
                                                <motion.button
                                                    type="button"
                                                    key={user.id}
                                                    onClick={() => setAssignedTo(user.id)}
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
                                                            <div className="w-1.5 h-1.5 bg-white rounded-full" />
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
                                {isPending ? 'Asignando...' : 'Asignar Tarea'}
                            </motion.button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
