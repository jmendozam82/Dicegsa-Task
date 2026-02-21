import { getCurrentProfile } from './actions/profile-actions';
import { getActiveUsers, getMeetings } from './actions/meeting-actions';
import { signOut } from './actions/auth-actions';
import CreateMeetingSheet from '../ui/components/organisms/CreateMeetingSheet';
import MeetingCard from '../ui/components/organisms/MeetingCard';
import Image from 'next/image';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const [profile, activeUsers, meetings] = await Promise.all([
    getCurrentProfile(),
    getActiveUsers(),
    getMeetings(),
  ]);

  return (
    <main
      className="min-h-screen flex flex-col items-center p-8"
      style={{
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Topbar */}
      <div className="w-full max-w-4xl mb-10 flex items-center justify-between">
        {/* Left: title */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reuniones</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus reuniones y participantes.</p>
        </div>

        {/* Right: profile + actions */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 mr-2">
            <Link href="/mis-tareas" className="text-xs font-bold text-[#007AFF] bg-blue-50/50 px-3 py-1.5 rounded-xl hover:bg-[#007AFF] hover:text-white transition-all flex items-center gap-1.5">
              <span>📋</span> Mis Tareas
            </Link>
            {profile?.role === 'admin' && (
              <>
                <Link href="/admin/users" className="text-xs font-medium text-gray-500 hover:text-[#007AFF] px-2 py-1 transition-colors">
                  Usuarios
                </Link>
                <Link href="/seguimiento" className="text-xs font-medium text-gray-500 hover:text-[#007AFF] px-2 py-1 transition-colors">
                  Seguimiento
                </Link>
              </>
            )}
          </div>

          {profile?.role === 'admin' && (
            <CreateMeetingSheet activeUsers={activeUsers} />
          )}

          {/* Profile badge */}
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-2xl"
            style={{
              background: 'rgba(255,255,255,0.75)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.6)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
            }}
          >
            {profile?.avatar_url ? (
              <Image
                src={profile.avatar_url}
                alt="Avatar"
                width={30}
                height={30}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-[#007AFF] flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                {profile?.full_name?.charAt(0)?.toUpperCase() ?? '?'}
              </div>
            )}
            <span className="text-sm text-gray-800 font-medium max-w-[120px] truncate">
              {profile?.full_name ?? 'Usuario'}
            </span>
            {profile?.role === 'admin' && (
              <span className="text-[10px] font-semibold uppercase tracking-wide text-[#007AFF] bg-[#007AFF]/10 px-1.5 py-0.5 rounded-md">
                Admin
              </span>
            )}
          </div>

          {/* Sign out */}
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-gray-500 hover:text-[#FF3B30] transition-colors px-2 py-1 rounded-xl hover:bg-[#FF3B30]/8"
            >
              Salir
            </button>
          </form>
        </div>
      </div>

      {/* Meetings List */}
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {meetings.length === 0 ? (
          <div
            className="w-full rounded-3xl flex flex-col items-center justify-center py-24 gap-4"
            style={{
              background: 'rgba(255,255,255,0.60)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.7)',
              boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
            }}
          >
            <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-3xl">
              📋
            </div>
            <p className="text-gray-500 text-sm">No hay reuniones todavía.</p>
            {profile?.role !== 'admin' && (
              <p className="text-xs text-gray-400">Las reuniones asignadas a ti aparecerán aquí.</p>
            )}
            {profile?.role === 'admin' && (
              <p className="text-xs text-gray-400">¡Crea la primera usando el botón &quot;+ Nueva Reunión&quot;!</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {meetings.map((meeting) => (
              <Link key={meeting.id} href={`/meetings/${meeting.id}`} className="block">
                <MeetingCard
                  meeting={meeting}
                  isAdmin={profile?.role === 'admin'}
                />
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
