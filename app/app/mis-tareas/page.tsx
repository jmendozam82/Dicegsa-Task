import { getMyTasks } from '../actions/task-actions';
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

export default async function MisTareasPage() {
    const profile = await getCurrentProfile();
    if (!profile) redirect('/login');

    const tasks = await getMyTasks();
    const grouped = groupByMeeting(tasks);
    const meetingNames = Object.keys(grouped);

    return (
        <main
            className="min-h-screen p-8"
            style={{
                background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
        >
            <div className="max-w-3xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mis Tareas</h1>
                        <p className="text-sm text-gray-500 mt-1">Pendientes agrupados por reunión.</p>
                    </div>
                    <Link
                        href="/"
                        className="text-sm text-[#007AFF] hover:underline underline-offset-2"
                    >
                        ← Inicio
                    </Link>
                </div>

                {/* Tasks */}
                {meetingNames.length === 0 ? (
                    <div
                        className="rounded-3xl flex flex-col items-center justify-center py-20 gap-3"
                        style={{
                            background: 'rgba(255,255,255,0.60)',
                            backdropFilter: 'blur(20px)',
                            border: '1px solid rgba(255,255,255,0.7)',
                            boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
                        }}
                    >
                        <span className="text-4xl">✅</span>
                        <p className="text-gray-500 text-sm">No tienes tareas asignadas.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-8">
                        {meetingNames.map((meeting) => (
                            <section key={meeting}>
                                <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 px-1">
                                    📋 {meeting}
                                </h2>
                                <div className="flex flex-col gap-3">
                                    {grouped[meeting].map((task) => (
                                        <TaskCard key={task.id} task={task} isAdmin={false} />
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}
