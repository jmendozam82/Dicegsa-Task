'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import CreateTaskModal from './CreateTaskModal';

interface User {
    id: string;
    full_name: string | null;
}

interface MeetingDetailViewProps {
    meeting: any;
    participants: User[];
    profile: any;
}

export default function MeetingDetailView({
    meeting,
    participants,
    profile,
}: MeetingDetailViewProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const isAdmin = profile.role === 'admin';

    return (
        <div className="flex flex-col gap-10">
            {/* Header Content */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#007AFF] text-white flex items-center justify-center text-2xl shadow-lg shadow-blue-200">
                            ✦
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
                            {meeting.title}
                        </h1>
                    </div>
                    <p className="text-gray-500 max-w-2xl leading-relaxed mt-2">
                        {meeting.description || 'Sin descripción adicional.'}
                    </p>
                </div>

                {isAdmin && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsModalOpen(true)}
                        className="px-6 py-3 rounded-2xl bg-[#007AFF] text-white text-sm font-semibold shadow-lg shadow-blue-200 hover:bg-[#0063D6] transition-all flex items-center gap-2"
                    >
                        <span>+ Nueva Tarea</span>
                    </motion.button>
                )}
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Participants Sidebar */}
                <div className="lg:col-span-1">
                    <div
                        className="rounded-3xl p-6"
                        style={{
                            background: 'rgba(255,255,255,0.6)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: '0 4px 24px rgba(0,0,0,0.04)',
                        }}
                    >
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                            Participantes ({participants.length})
                        </h3>
                        <div className="flex flex-col gap-4">
                            {participants.map((user) => (
                                <div key={user.id} className="flex items-center gap-3 group">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500 group-hover:bg-[#007AFF]/10 group-hover:text-[#007AFF] transition-colors">
                                        {user.full_name?.charAt(0) || '?'}
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">
                                        {user.full_name}
                                    </span>
                                </div>
                            ))}
                            {participants.length === 0 && (
                                <p className="text-sm text-gray-400 italic font-medium">
                                    No hay participantes.
                                </p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Main Content Info */}
                <div className="lg:col-span-2">
                    <div
                        className="rounded-[32px] p-8 h-full"
                        style={{
                            background: 'rgba(255,255,255,0.8)',
                            backdropFilter: 'blur(24px)',
                            border: '1px solid rgba(255,255,255,0.8)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
                        }}
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-gray-900 tracking-tight">Información General</h3>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-[#34C759] bg-[#34C759]/10 px-2.5 py-1 rounded-full">
                                Activa
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Creada</p>
                                <p className="text-sm text-gray-800 font-medium">
                                    {new Date(meeting.created_at).toLocaleDateString(undefined, {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Status</p>
                                <p className="text-sm text-gray-800 font-medium">En proceso de seguimiento</p>
                            </div>
                        </div>

                        <div className="mt-12 p-6 rounded-2xl bg-[#007AFF]/5 border border-[#007AFF]/10">
                            <h4 className="text-xs font-bold text-[#007AFF] uppercase tracking-widest mb-2">Nota del Sistema</h4>
                            <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                Todas las tareas asignadas en esta reunión se verán reflejadas en el dashboard de seguimiento global.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task Modal Integration */}
            <CreateTaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                meetingId={meeting.id}
                meetingTitle={meeting.title}
                participants={participants}
            />
        </div>
    );
}
