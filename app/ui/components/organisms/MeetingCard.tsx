'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import CreateTaskSheet from './CreateTaskSheet';

interface MeetingCardProps {
    meeting: any; // Using any due to the joined structure from repository
    isAdmin?: boolean;
}

export default function MeetingCard({ meeting, isAdmin }: MeetingCardProps) {
    const [isTaskSheetOpen, setIsTaskSheetOpen] = useState(false);

    // Map participants from the joined structure
    const participants = (meeting.meeting_participants || []).map((p: any) => ({
        id: p.user_id,
        full_name: p.profiles?.full_name || 'Desconocido'
    }));

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="w-full flex flex-col p-6 rounded-3xl transition-all duration-200"
                style={{
                    background: 'rgba(255,255,255,0.75)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255,255,255,0.6)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                }}
            >
                <div className="flex items-start justify-between">
                    <div className="flex flex-col gap-1">
                        <h3 className="text-lg font-semibold text-gray-900 tracking-tight">
                            {meeting.title}
                        </h3>
                        {meeting.description && (
                            <p className="text-sm text-gray-500 line-clamp-2">
                                {meeting.description}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-[#007AFF]/10 text-xl">
                        📅
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100/50 flex flex-col gap-4">
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-400 uppercase tracking-widest">
                        <span suppressHydrationWarning>Creada el {new Date(meeting.created_at).toLocaleDateString()}</span>
                        <span className="text-[#007AFF]">Ver detalles →</span>
                    </div>
                </div>
            </motion.div>
        </>
    );
}
