import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SetupPage() {
  const tournaments = await prisma.tournament.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: {
        select: {
          videos: true,
        },
      },
    },
  });

  const activeTournament = tournaments.find(t => t.isActive);

  if (activeTournament && activeTournament._count.videos >= 64) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">
          Configuración del Torneo
        </h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          Para comenzar, necesitas configurar el torneo y agregar videos.
        </p>

        {tournaments.length === 0 ? (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              No hay torneos creados. Por favor, accede al panel de administración para crear uno.
            </p>
            <Link
              href="/admin/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ir al Panel de Administración
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-slate-700 dark:text-slate-300">
              Hay {tournaments.length} torneo(s) creado(s), pero ninguno está activo o no tiene suficientes videos.
            </p>
            <div className="space-y-2">
              {tournaments.map((tournament) => (
                <div
                  key={tournament.id}
                  className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
                >
                  <h3 className="font-semibold text-slate-900 dark:text-white">
                    {tournament.name} ({tournament.year})
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Videos: {tournament._count.videos}/64 | Estado: {tournament.isActive ? 'Activo' : 'Inactivo'}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/admin/login"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Ir al Panel de Administración
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
