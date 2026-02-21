'use client';

import { motion } from 'framer-motion';
import { TaskWithDetails, TaskStatus } from '../../../core/entities/Task';
import { updateTaskStatus } from '../../../app/actions/task-actions';
import { useState, useTransition } from 'react';
import FileDropZone from './FileDropZone';

const STATUS_CONFIG: Record<TaskStatus, { label: string; color: string; bg: string }> = {
    todo: { label: 'Pendiente', color: '#8E8E93', bg: '#F2F2F7' },
    in_progress: { label: 'En progreso', color: '#007AFF', bg: '#EBF4FF' },
    done: { label: 'Completado', color: '#34C759', bg: '#EDFBF1' },
};

interface TaskCardProps {
    task: TaskWithDetails;
    isAdmin?: boolean;
}

export default function TaskCard({ task, isAdmin = false }: TaskCardProps) {
    const [expanded, setExpanded] = useState(false);
    const [isPending, startTransition] = useTransition();
    const status = STATUS_CONFIG[task.status];

    const handleStatusChange = (newStatus: TaskStatus) => {
        startTransition(() => { updateTaskStatus(task.id, newStatus); });
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="group relative rounded-2xl overflow-hidden"
            style={{
                background: 'rgba(255,255,255,0.72)',
                backdropFilter: 'blur(16px)',
                border: '1px solid rgba(255,255,255,0.6)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
            }}
        >
            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        {/* Status pill */}
                        <span
                            className="inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-medium mb-2"
                            style={{ color: status.color, background: status.bg }}
                        >
                            {status.label}
                        </span>

                        <h3 className="text-sm font-semibold text-gray-900 leading-snug truncate">{task.title}</h3>
                        {task.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                        )}
                        {task.due_date && (
                            <p className="text-xs text-gray-400 mt-2">
                                📅 {new Date(task.due_date).toLocaleDateString('es-MX', { day: 'numeric', month: 'short' })}
                            </p>
                        )}
                        {isAdmin && task.assigned_user_name && (
                            <p className="text-xs text-gray-400 mt-1">👤 {task.assigned_user_name}</p>
                        )}
                    </div>

                    {/* Hover-only action buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1.5">
                        {task.status !== 'done' && (
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                disabled={isPending}
                                onClick={() => handleStatusChange(task.status === 'todo' ? 'in_progress' : 'done')}
                                className="text-xs text-[#007AFF] font-medium px-2.5 py-1 rounded-xl bg-[#007AFF]/10 hover:bg-[#007AFF]/20 transition-colors whitespace-nowrap disabled:opacity-50"
                            >
                                {task.status === 'todo' ? 'Iniciar' : 'Marcar listo'}
                            </motion.button>
                        )}
                        {/* Upload button for users */}
                        {!isAdmin && task.status !== 'todo' && (
                            <button
                                onClick={() => setExpanded((v) => !v)}
                                className="text-xs text-gray-500 font-medium px-2.5 py-1 rounded-xl bg-gray-100 hover:bg-gray-200 transition-colors whitespace-nowrap"
                            >
                                {expanded ? 'Cerrar' : '📎 Entregar'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Deliverable status */}
                {task.deliverable_url && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-[#34C759]">
                        <span>✓ Entregable subido</span>
                        {isAdmin && (
                            <a
                                href={task.deliverable_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#007AFF] underline underline-offset-2"
                            >
                                Ver archivo
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* File drop zone (expandable) */}
            {expanded && !isAdmin && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 26 }}
                    className="border-t border-gray-100 px-5 pb-5 pt-4"
                >
                    <FileDropZone taskId={task.id} onSuccess={() => setExpanded(false)} />
                </motion.div>
            )}
        </motion.div>
    );
}
