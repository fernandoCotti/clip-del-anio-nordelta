import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getRoundName } from '@/lib/utils';

export default async function RoundsPage() {
  // Find active tournament
  const tournament = await prisma.tournament.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!tournament) {
    redirect('/setup');
  }

  // Get all rounds that have matches
  const allMatches = await prisma.match.findMany({
    where: {
      tournamentId: tournament.id,
    },
    select: {
      round: true,
      isComplete: true,
      isOpen: true,
    },
  });

  // Group by round
  const roundsData: Record<number, { total: number; completed: number; open: number }> = {};
  
  allMatches.forEach((match) => {
    if (!roundsData[match.round]) {
      roundsData[match.round] = { total: 0, completed: 0, open: 0 };
    }
    roundsData[match.round].total += 1;
    if (match.isComplete) roundsData[match.round].completed += 1;
    if (match.isOpen) roundsData[match.round].open += 1;
  });

  const rounds = Object.keys(roundsData)
    .map(Number)
    .sort((a, b) => a - b);

  // Find the latest round with open matches (this will be the "Actual" round)
  // If tournament is complete (no open matches), don't show "Actual" tag
  let latestRoundWithOpenMatches: number | null = null;
  for (let i = rounds.length - 1; i >= 0; i--) {
    const round = rounds[i];
    if (roundsData[round].open > 0) {
      latestRoundWithOpenMatches = round;
      break;
    }
  }

  // Only set currentRound if there are open matches, otherwise null (no "Actual" tag)
  const currentRound = latestRoundWithOpenMatches ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            {tournament.name} - Todas las Rondas
          </h1>
          <p className="text-lg text-white/80 font-medium">
            Historial completo del torneo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rounds.map((round) => {
            const data = roundsData[round];
            const isCurrent = round === currentRound;
            
            return (
              <Link
                key={round}
                href={`/rounds/${round}`}
                className={`block p-6 rounded-xl shadow-xl transition-all hover:scale-105 border ${
                  isCurrent
                    ? 'bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white ring-4 ring-blue-300/50 border-white/30'
                    : 'bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 text-white border-white/20 hover:bg-white/20 hover:shadow-2xl'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">
                    {getRoundName(round)}
                  </h2>
                  {isCurrent && (
                    <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                      Actual
                    </span>
                  )}
                </div>
                
                  <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className={isCurrent ? 'text-white/80' : 'text-white/70'}>
                      Total de partidos:
                    </span>
                    <span className="font-semibold text-white">{data.total}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className={isCurrent ? 'text-white/80' : 'text-white/70'}>
                      Completados:
                    </span>
                    <span className="font-semibold text-white">{data.completed}</span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-white/20">
                  <div className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-white/80'}`}>
                    Ver partidos →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
