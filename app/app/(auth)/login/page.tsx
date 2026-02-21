'use client';

import { useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signIn, signUp } from '../../actions/auth-actions';

type Tab = 'login' | 'register';

export default function LoginPage() {
    const [tab, setTab] = useState<Tab>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            const result =
                tab === 'login'
                    ? await signIn(email, password)
                    : await signUp(email, password, fullName);

            if (result && !result.success) {
                setError(result.error ?? 'Error desconocido.');
            }
        });
    };

    return (
        <div className="w-full max-w-sm">
            {/* Logo / Brand */}
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#007AFF] mb-4 shadow-lg shadow-blue-200">
                    <span className="text-white text-2xl">✦</span>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">ZenTask</h1>
                <p className="text-sm text-gray-500 mt-1">Gestión de reuniones y tareas</p>
            </div>

            {/* Card */}
            <div
                className="rounded-3xl p-8 w-full"
                style={{
                    background: 'rgba(255,255,255,0.80)',
                    backdropFilter: 'blur(24px)',
                    WebkitBackdropFilter: 'blur(24px)',
                    border: '1px solid rgba(255,255,255,0.7)',
                    boxShadow: '0 8px 40px rgba(0,0,0,0.08)',
                }}
            >
                {/* Tab switcher */}
                <div className="flex bg-gray-100 rounded-2xl p-1 mb-6">
                    {(['login', 'register'] as Tab[]).map((t) => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => { setTab(t); setError(null); }}
                            className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${tab === t
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {t === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <AnimatePresence mode="wait">
                        {tab === 'register' && (
                            <motion.div
                                key="full-name"
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.18 }}
                                className="overflow-hidden"
                            >
                                <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                                    Nombre completo
                                </label>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Tu nombre"
                                    required={tab === 'register'}
                                    className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="correo@empresa.com"
                            required
                            autoComplete="email"
                            className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                        />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            minLength={6}
                            autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                            className="w-full rounded-2xl border border-gray-200 bg-white/70 px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#007AFF]/40 transition"
                        />
                    </div>

                    {/* Error */}
                    <AnimatePresence>
                        {error && (
                            <motion.p
                                key="error"
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="text-sm text-[#FF3B30] bg-[#FF3B30]/8 rounded-xl px-4 py-2.5"
                            >
                                {error}
                            </motion.p>
                        )}
                    </AnimatePresence>

                    {/* Submit */}
                    <motion.button
                        type="submit"
                        disabled={isPending}
                        whileHover={{ scale: isPending ? 1 : 1.02 }}
                        whileTap={{ scale: isPending ? 1 : 0.97 }}
                        className="mt-1 w-full rounded-2xl bg-[#007AFF] py-3.5 text-sm font-semibold text-white shadow-md shadow-blue-200 hover:bg-[#0063D6] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isPending
                            ? tab === 'login' ? 'Verificando...' : 'Creando cuenta...'
                            : tab === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </motion.button>
                </form>
            </div>
        </div>
    );
}
