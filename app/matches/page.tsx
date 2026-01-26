import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { MatchesList } from '@/components/MatchesList';
import { getRoundName } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function MatchesPage() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get('sessionId')?.value;

  // Find active tournament
  const tournament = await prisma.tournament.findFirst({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  if (!tournament) {
    redirect('/setup');
  }

  // Get all matches for current round
  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournament.id,
      round: tournament.currentRound,
    },
    include: {
      videos: {
        include: {
          video: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
      votes: sessionId ? {
        where: {
          sessionId,
        },
      } : false,
    },
    orderBy: {
      matchNumber: 'asc',
    },
  });

  // Calculate vote counts for each match
  const matchesWithVotes = await Promise.all(
    matches.map(async (match) => {
      const voteCounts = await prisma.vote.groupBy({
        by: ['videoId'],
        where: {
          matchId: match.id,
        },
        _count: {
          videoId: true,
        },
      });

      const totalVotes = voteCounts.reduce((sum, v) => sum + v._count.videoId, 0);
      const video1Votes = match.videos[0] 
        ? voteCounts.find(v => v.videoId === match.videos[0].videoId)?._count.videoId || 0 
        : 0;
      const video2Votes = match.videos[1] 
        ? voteCounts.find(v => v.videoId === match.videos[1].videoId)?._count.videoId || 0 
        : 0;

      return {
        ...match,
        userVote: match.votes && match.votes.length > 0 ? match.votes[0] : null,
        totalVotes,
        video1Votes,
        video2Votes,
      };
    })
  );

  const votedCount = matchesWithVotes.filter(m => m.userVote).length;
  const openCount = matchesWithVotes.filter(m => m.isOpen).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            {tournament.name}
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-4">
            {getRoundName(tournament.currentRound)}
          </p>
          <div className="flex justify-center gap-4 text-sm">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full">
              {votedCount} de {openCount} votados
            </span>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full">
              {matchesWithVotes.length} partidos totales
            </span>
          </div>
        </div>

        <MatchesList matches={matchesWithVotes} />
      </div>
    </div>
  );
}
