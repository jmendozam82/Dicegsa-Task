'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskWithDetails, TaskStatus } from '../../../core/entities/Task';
import { updateTaskStatus } from '@/app/actions/task-actions';
import FileDropZone from './FileDropZone';

interface TaskCardProps {
    task: TaskWithDetails;
    isAdmin?: boolean;
}

export default function TaskCard({ task, isAdmin }: TaskCardProps) {
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState<TaskStatus>(task.status);

    const handleStatusChange = (newStatus: TaskStatus) => {
        startTransition(async () => {
            const result = await updateTaskStatus(task.id, newStatus);
            if (result.success) {
                setStatus(newStatus);
            }
        });
    };

    const isDone = status === 'done';

    // Status color mapping
    const statusColors = {
        todo: { bg: 'bg-gray-100', text: 'text-gray-500', label: 'Pendiente' },
        in_progress: { bg: 'bg-[#007AFF]/10', text: 'text-[#007AFF]', label: 'En Progreso' },
        done: { bg: 'bg-[#34C759]/10', text: 'text-[#34C759]', label: 'Completado' },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`w-full flex flex-col p-6 rounded-3xl transition-all duration-300 ${isDone ? 'opacity-75' : ''}`}
            style={{
                background: 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(16px)',
                WebkitBackdropFilter: 'blur(16px)',
                border: isDone ? '1px solid rgba(52,199,89,0.3)' : '1px solid rgba(255,255,255,0.6)',
                boxShadow: isDone
                    ? '0 4px 20px rgba(52,199,89,0.06)'
                    : '0 4px 20px rgba(0,0,0,0.04)',
            }}
        >
            {/* Header: Meeting Title & Status */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex flex-col gap-1 overflow-hidden pr-4">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                        {isAdmin ? (task.assigned_user_name || 'Sin asignar') : (task.meeting_title || 'Reunión sin título')}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900 tracking-tight leading-snug">
                        {task.title}
                    </h3>
                    {isAdmin && (
                        <span className="text-[9px] text-gray-400 font-medium">
                            En: {task.meeting_title || 'Reunión'}
                        </span>
                    )}
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusColors[status].bg} ${statusColors[status].text}`}>
                    {statusColors[status].label}
                </div>
            </div>

            {/* Description */}
            {task.description && (
                <p className="text-sm text-gray-500 mb-6 leading-relaxed line-clamp-2">
                    {task.description}
                </p>
            )}

            {/* Deliverable Drop Zone */}
            <div className="mb-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5 text-gray-400/80">Entregable</p>
                {task.deliverable_url ? (
                    <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#34C759]/5 border border-[#34C759]/10 backdrop-blur-md">
                        <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center text-lg shadow-sm">
                            📄
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-xs font-semibold text-gray-700 truncate">Archivo enviado</span>
                            <a
                                href={task.deliverable_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-[#007AFF] font-bold hover:underline"
                            >
                                Ver documento →
                            </a>
                        </div>
                    </div>
                ) : (
                    isAdmin ? (
                        <p className="text-xs text-gray-400 italic">Sin entrega todavía.</p>
                    ) : (
                        <div className="backdrop-blur-md rounded-2xl overflow-hidden">
                            <FileDropZone
                                taskId={task.id}
                                onSuccess={() => {
                                    setStatus('done');
                                }}
                            />
                        </div>
                    )
                )}
            </div>

            {/* Footer: Date & Actions */}
            <div className="mt-auto pt-4 border-t border-gray-100/50 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Vencimiento</span>
                        <span className="text-xs font-medium text-gray-700" suppressHydrationWarning>
                            {task.due_date ? new Date(task.due_date).toLocaleDateString() : 'Sin fecha'}
                        </span>
                    </div>

                    {task.delivered_at && (
                        <div className="flex flex-col items-end text-right">
                            <span className="text-[10px] font-bold text-[#34C759] uppercase tracking-widest">Entregado el</span>
                            <span className="text-xs font-medium text-gray-700" suppressHydrationWarning>
                                {new Date(task.delivered_at).toLocaleDateString()}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        {/* Status Toggle (Subtle) - Only if NOT admin */}
                        {!isDone && !isAdmin && (
                            <select
                                value={status}
                                onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
                                disabled={isPending}
                                className="bg-gray-50 border-none text-[11px] font-bold text-gray-500 rounded-xl px-3 py-2 outline-none cursor-pointer hover:bg-gray-100 transition-colors"
                            >
                                <option value="todo">Pendiente</option>
                                <option value="in_progress">En Progreso</option>
                            </select>
                        )}

                        {/* Finalizar Button - Only if NOT admin */}
                        {!isDone && !isAdmin && (
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isPending}
                                onClick={() => handleStatusChange('done')}
                                className="bg-[#007AFF] text-white text-[11px] font-bold px-4 py-2 rounded-xl shadow-lg shadow-blue-100/50 hover:bg-[#0063D6] transition-colors"
                            >
                                Completar
                            </motion.button>
                        )}

                        {(isDone || isAdmin) && (
                            <div className="flex items-center gap-1.5 text-[#34C759]">
                                {isDone && <span className="text-xs font-bold uppercase tracking-widest italic">Completada</span>}
                                {isDone && <span className="text-base">✨</span>}
                                {isAdmin && !isDone && (
                                    <span className={`text-[10px] font-bold uppercase tracking-widest ${statusColors[status].text}`}>
                                        {statusColors[status].label}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
