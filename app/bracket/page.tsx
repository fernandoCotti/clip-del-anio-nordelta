import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { BracketView } from '@/components/BracketView';

export default async function BracketPage() {
  const tournament = await prisma.tournament.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!tournament) {
    redirect('/setup');
  }

  // Fetch all matches grouped by round
  const matchesByRound: Record<number, any[]> = {};
  for (let round = 1; round <= 6; round++) {
    const matches = await prisma.match.findMany({
      where: {
        tournamentId: tournament.id,
        round,
      },
      include: {
        videos: {
          include: {
            video: true,
          },
        },
      },
      orderBy: {
        matchNumber: 'asc',
      },
    });
    matchesByRound[round] = matches;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-300 via-indigo-300 to-blue-300 bg-clip-text text-transparent mb-6 text-center drop-shadow-lg">
          {tournament.name} - Bracket
        </h1>
        <BracketView matchesByRound={matchesByRound} />
      </div>
    </div>
  );
}
