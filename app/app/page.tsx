import { getActiveUsers } from './actions/meeting-actions';
import CreateMeetingSheet from '../ui/components/organisms/CreateMeetingSheet';

export default async function Home() {
  const activeUsers = await getActiveUsers();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{
        background: 'linear-gradient(135deg, #F5F5F7 0%, #E8EDF5 100%)',
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
      }}
    >
      {/* Header */}
      <div className="w-full max-w-4xl mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Reuniones</h1>
          <p className="text-sm text-gray-500 mt-1">Gestiona tus reuniones y participantes.</p>
        </div>
        <CreateMeetingSheet activeUsers={activeUsers} />
      </div>

      {/* Empty state */}
      <div
        className="w-full max-w-4xl rounded-3xl flex flex-col items-center justify-center py-24 gap-4"
        style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.7)',
          boxShadow: '0 4px 40px rgba(0,0,0,0.06)',
        }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#007AFF]/10 flex items-center justify-center text-3xl">
          📋
        </div>
        <p className="text-gray-500 text-sm">No hay reuniones todavía. ¡Crea la primera!</p>
      </div>
    </main>
  );
}
