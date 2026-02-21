import { getMeetingDetail, getParticipants } from '../../actions/meeting-actions';
import { getCurrentProfile } from '../../actions/profile-actions';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import MeetingDetailView from '@/ui/components/organisms/MeetingDetailView';

export const dynamic = 'force-dynamic';

interface MeetingPageProps {
    params: Promise<{ id: string }>;
}

export default async function MeetingPage({ params }: MeetingPageProps) {
    const { id } = await params;
    const [profile, meeting, participants] = await Promise.all([
        getCurrentProfile(),
        getMeetingDetail(id),
        getParticipants(id),
    ]);

    if (!meeting) {
        notFound();
    }

    if (!profile) {
        redirect('/login');
    }

    return (
        <main
            className="min-h-screen p-8 flex flex-col items-center"
            style={{
                background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            }}
        >
            <div className="w-full max-w-4xl">
                {/* Back button */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors mb-8 group"
                >
                    <span className="text-lg group-hover:-translate-x-1 transition-transform">←</span>
                    Volver al Dashboard
                </Link>

                <MeetingDetailView
                    meeting={meeting}
                    participants={participants}
                    profile={profile}
                />
            </div>
        </main>
    );
}
