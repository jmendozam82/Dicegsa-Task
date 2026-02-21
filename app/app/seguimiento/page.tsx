import { getAdminTasks } from '../actions/task-actions';
import { getCurrentProfile } from '../actions/profile-actions';
import TaskCard from '../../ui/components/organisms/TaskCard';
import { redirect } from 'next/navigation';
import { TaskWithDetails } from '../../core/entities/Task';
import Link from 'next/link';

function groupByMeeting(tasks: TaskWithDetails[]): Record<string, TaskWithDetails[]> {
    return tasks.reduce((acc, task) => {
        const key = task.meeting_title ?? 'Sin reunión';
        if (!acc[key]) acc[key] = [];
        acc[key].push(task);
        return acc;
    }, {} as Record<string, TaskWithDetails[]>);
}

export default async function SeguimientoPage() {
    const profile = await getCurrentProfile();
    if (!profile) redirect('/login');
    if (profile.role !== 'admin') redirect('/mis-tareas');

    const tasks = await getAdminTasks();
    const grouped = groupByMeeting(tasks);
    const meetingNames = Object.keys(grouped);

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => t.deliverable_url).length;
    const progressPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <main
            className="min-h-screen p-8"
            style={{
                background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
        >
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Seguimiento</h1>
                        <p className="text-sm text-gray-500 mt-1">Avance de entregables por reunión.</p>
                    </div>
                    <Link href="/" className="text-sm text-[#007AFF] hover:underline underline-offset-2">
                        ← Inicio
                    </Link>
                </div>

                {/* Summary card */}
                {totalTasks > 0 && (
                    <div
                        className="rounded-2xl p-5 mb-8 flex items-center gap-5"
                        style={{
                            background: 'rgba(255,255,255,0.70)',
                            backdropFilter: 'blur(16px)',
                            border: '1px solid rgba(255,255,255,0.6)',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                        }}
                    >
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-gray-700">Progreso general</span>
                                <span className="text-sm font-semibold text-[#007AFF]">{progressPct}%</span>
                            </div>
                            {/* Thin Apple-style global progress bar */}
                            <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{ width: `${progressPct}%`, background: '#34C759' }}
                                />
                            </div>
                        </div>
                        <div className="text-right shrink-0">
                            <p className="text-2xl font-bold text-gray-900">{completedTasks}/{totalTasks}</p>
                            <p className="text-xs text-gray-400">entregables</p>
                        </div>
                    </div>
                )}

                {/* Tasks by meeting */}
                {meetingNames.length === 0 ? (
                    <div
                        className="rounded-3xl flex flex-col items-center justify-center py-20 gap-3"
                        style={{
                            background: 'rgba(255,255,255,0.60)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                        }}
                    >
                        <span className="text-4xl">📭</span>
                        <p className="text-gray-500 text-sm">No has creado tareas todavía.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {meetingNames.map((meeting) => {
                            const meetingTasks = grouped[meeting];
                            const done = meetingTasks.filter(t => t.deliverable_url).length;
                            return (
                                <section key={meeting}>
                                    <div className="flex items-center justify-between mb-4 px-1">
                                        <div className="flex flex-col">
                                            <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                📋 {meeting}
                                            </h2>
                                            <p className="text-[11px] text-gray-400 mt-0.5">
                                                {done} de {meetingTasks.length} tareas completadas
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-bold text-[#007AFF]">
                                                {Math.round((done / meetingTasks.length) * 100)}%
                                            </span>
                                        </div>
                                    </div>

                                    {/* Per-meeting progress bar */}
                                    <div className="w-full h-1 bg-gray-200/50 rounded-full overflow-hidden mb-4 mx-1">
                                        <div
                                            className="h-full bg-[#007AFF] rounded-full transition-all duration-500"
                                            style={{ width: `${(done / meetingTasks.length) * 100}%` }}
                                        />
                                    </div>

                                    <div className="flex flex-col gap-3">
                                        {meetingTasks.map((task) => (
                                            <TaskCard key={task.id} task={task} isAdmin={true} />
                                        ))}
                                    </div>
                                </section>
                            );
                        })}
                    </div>
                )}
            </div>
        </main>
    );
}
