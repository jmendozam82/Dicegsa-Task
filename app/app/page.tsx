import { getCurrentProfile } from './actions/profile-actions';
import { getActiveUsers } from './actions/meeting-actions';
import { signOut } from './actions/auth-actions';
import CreateMeetingSheet from '../ui/components/organisms/CreateMeetingSheet';
import Image from 'next/image';

export default async function Home() {
  const [profile, activeUsers] = await Promise.all([
    getCurrentProfile(),
    getActiveUsers(),
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

      {/* Empty state / Meetings list placeholder */}
      <div
        className="w-full max-w-4xl rounded-3xl flex flex-col items-center justify-center py-24 gap-4"
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
    </main>
  );
}
