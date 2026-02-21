'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createTask } from '@/app/actions/task-actions';

interface User {
    id: string;
    full_name: string | null;
}

interface CreateTaskModalProps {
    meetingId: string;
    meetingTitle: string;
    participants: User[];
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: (taskId: string) => void;
}

export default function CreateTaskModal({
    meetingId,
    meetingTitle,
    participants,
    isOpen,
    onClose,
    onSuccess,
}: CreateTaskModalProps) {
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
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-lg rounded-[32px] overflow-hidden shadow-2xl"
                        style={{
                            background: 'rgba(255,255,255,0.85)',
                            backdropFilter: 'blur(32px)',
                            WebkitBackdropFilter: 'blur(32px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                        }}
                    >
                        {/* Header */}
                        <div className="px-8 py-6 border-b border-gray-100/50 flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 tracking-tight">Nueva Tarea</h2>
                                <p className="text-xs text-gray-500 mt-0.5 truncate max-w-[300px]">
                                    {meetingTitle}
                                </p>
                            </div>
                            <button
                                onClick={onClose}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100/50 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                    Título <span className="text-[#FF3B30]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ej. Revisar documento técnico"
                                    required
                                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                    Descripción
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Instrucciones detalladas..."
                                    rows={3}
                                    className="w-full rounded-2xl border border-gray-200 bg-white/50 px-5 py-3.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                                    Responsable <span className="text-[#FF3B30]">*</span>
                                </label>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-1 custom-scrollbar">
                                    {participants.map((user) => {
                                        const isSelected = assignedTo === user.id;
                                        return (
                                            <button
                                                type="button"
                                                key={user.id}
                                                onClick={() => setAssignedTo(user.id)}
                                                className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-sm text-left transition-all border ${isSelected
                                                    ? 'bg-[#007AFF] border-[#007AFF] text-white shadow-lg shadow-blue-200'
                                                    : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-white' : 'bg-[#007AFF]/20'}`} />
                                                <span className="truncate">{user.full_name ?? 'Usuario'}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Error */}
                            {errorMsg && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="p-4 rounded-2xl bg-[#FF3B30]/10 text-[#FF3B30] text-sm font-medium"
                                >
                                    {errorMsg}
                                </motion.div>
                            )}

                            {/* Footer / Submit */}
                            <div className="flex items-center gap-3 mt-2">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="flex-1 py-4 text-sm font-semibold text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    Cancelar
                                </button>
                                <motion.button
                                    type="submit"
                                    disabled={isPending}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex-[2] py-4 rounded-2xl bg-[#007AFF] text-white text-sm font-semibold shadow-xl shadow-blue-200 hover:bg-[#0063D6] transition-colors disabled:opacity-50"
                                >
                                    {isPending ? 'Asignando...' : 'Asignar Tarea'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
