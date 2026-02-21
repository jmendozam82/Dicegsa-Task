import { getMyTasks } from '../actions/task-actions';
import { getCurrentProfile } from '../actions/profile-actions';
import { redirect } from 'next/navigation';
import MisTareasView from '../../ui/components/views/MisTareasView';

export const dynamic = 'force-dynamic';

export default async function MisTareasPage() {
    const [profile, tasks] = await Promise.all([
        getCurrentProfile(),
        getMyTasks(),
    ]);

    if (!profile) {
        redirect('/login');
    }

    return (
        <main
            className="min-h-screen flex flex-col items-center p-8 pb-20"
            style={{
                background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
        >
            <MisTareasView tasks={tasks} />
        </main>
    );
}
