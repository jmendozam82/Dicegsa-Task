'use client';

import { useState, useRef, useTransition, DragEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { uploadDeliverable } from '../../../app/actions/task-actions';

interface FileDropZoneProps {
    taskId: string;
    onSuccess?: () => void;
}

export default function FileDropZone({ taskId, onSuccess }: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleFile = async (file: File) => {
        setError(null);
        setProgress(0);

        // Simulate progress for UX (actual upload via server action)
        const interval = setInterval(() => {
            setProgress((p) => {
                if (p === null || p >= 85) { clearInterval(interval); return p; }
                return p + Math.random() * 15;
            });
        }, 180);

        const formData = new FormData();
        formData.append('task_id', taskId);
        formData.append('file', file);

        startTransition(async () => {
            const result = await uploadDeliverable(formData);
            clearInterval(interval);
            if (result.success) {
                setProgress(100);
                setTimeout(() => {
                    setDone(true);
                    onSuccess?.();
                }, 600);
            } else {
                setProgress(null);
                setError(result.error ?? 'Error al subir el archivo.');
            }
        });
    };

    const onDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const onDragOver = (e: DragEvent<HTMLDivElement>) => { e.preventDefault(); setIsDragging(true); };
    const onDragLeave = () => setIsDragging(false);

    if (done) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-2 text-sm text-[#34C759] font-medium py-2"
            >
                <span className="text-base">✓</span> Entregable enviado correctamente
            </motion.div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {/* Drop zone */}
            <motion.div
                animate={{ borderColor: isDragging ? '#007AFF' : 'rgba(0,0,0,0.1)' }}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onClick={() => inputRef.current?.click()}
                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl py-6 cursor-pointer transition-colors"
                style={{
                    background: isDragging ? 'rgba(0,122,255,0.04)' : 'rgba(245,245,247,0.8)',
                    border: `1.5px dashed ${isDragging ? '#007AFF' : 'rgba(0,0,0,0.12)'}`,
                }}
            >
                <AnimatePresence mode="wait">
                    {progress !== null ? (
                        <motion.div key="progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full px-6">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-gray-500">Subiendo...</span>
                                <span className="text-xs font-medium text-[#007AFF]">{Math.round(progress)}%</span>
                            </div>
                            {/* Thin Apple-style progress bar */}
                            <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ background: '#007AFF' }}
                                    animate={{ width: `${progress}%` }}
                                    transition={{ ease: 'easeOut', duration: 0.3 }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-1.5">
                            <span className="text-2xl">📎</span>
                            <p className="text-xs font-medium text-gray-600">
                                {isDragging ? 'Suelta el archivo aquí' : 'Arrastra un archivo o haz clic'}
                            </p>
                            <p className="text-[11px] text-gray-400">PDF, imágenes, documentos</p>
                        </motion.div>
                    )}
                </AnimatePresence>
                <input
                    ref={inputRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
                />
            </motion.div>

            {/* Error */}
            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xs text-[#FF3B30] bg-[#FF3B30]/8 rounded-xl px-3 py-2"
                >
                    {error}
                </motion.p>
            )}
        </div>
    );
}
