'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import TaskCard from '../organisms/TaskCard';
import { TaskWithDetails } from '../../../core/entities/Task';

interface MisTareasViewProps {
    tasks: TaskWithDetails[];
}

export default function MisTareasView({ tasks }: MisTareasViewProps) {
    // Group tasks by meeting title
    const groupedTasks = tasks.reduce((acc, task) => {
        const key = task.meeting_title || 'General';
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
    }, {} as Record<string, typeof tasks>);

    const meetingTitles = Object.keys(groupedTasks);

    return (
        <div className="w-full max-w-6xl flex flex-col gap-10">
            {/* Header Section */}
            <div className="flex flex-col gap-2">
                <Link
                    href="/"
                    className="text-xs font-bold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors flex items-center gap-1.5 group mb-4"
                >
                    <span className="group-hover:-translate-x-1 transition-transform">←</span>
                    Dashboard
                </Link>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-[22px] bg-white shadow-xl shadow-gray-200/50 flex items-center justify-center text-3xl">
                        📋
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            Mis Tareas
                        </h1>
                        <p className="text-sm font-medium text-gray-400 mt-1">
                            {tasks.length} {tasks.length === 1 ? 'tarea asignada' : 'tareas asignadas'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Tasks Content */}
            <div className="w-full">
                {tasks.length === 0 ? (
                    <div
                        className="w-full flex flex-col items-center justify-center py-32 rounded-[40px] gap-6"
                        style={{
                            background: 'rgba(255,255,255,0.4)',
                            backdropFilter: 'blur(20px)',
                            border: '1px dashed rgba(0,0,0,0.08)',
                        }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="w-20 h-20 rounded-full bg-white shadow-soft flex items-center justify-center text-4xl"
                        >
                            ✨
                        </motion.div>
                        <div className="flex flex-col items-center gap-2 text-center px-6">
                            <h3 className="text-xl font-bold text-gray-800 tracking-tight">Todo al día</h3>
                            <p className="text-sm text-gray-400 max-w-[280px] font-medium leading-relaxed">
                                No tienes tareas asignadas por ahora. ¡Buen trabajo manteniéndote al corriente!
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-16">
                        {meetingTitles.map((title) => (
                            <section key={title} className="flex flex-col gap-8">
                                <div className="flex items-center gap-4">
                                    <h2 className="text-xs font-bold text-gray-400 uppercase tracking-[0.2em] whitespace-nowrap">
                                        Reunión: {title}
                                    </h2>
                                    <div className="h-px w-full bg-gray-200/60" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {groupedTasks[title].map((task) => (
                                        <TaskCard key={task.id} task={task} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
