import { prisma } from '@/lib/prisma';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import { MatchesList } from '@/components/MatchesList';
import { getRoundName } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RoundPage({
  params,
}: {
  params: Promise<{ round: string }>;
}) {
  const { round } = await params;
  const roundNumber = parseInt(round);

  if (isNaN(roundNumber) || roundNumber < 1 || roundNumber > 6) {
    notFound();
  }

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

  // Get all matches for this round
  const matches = await prisma.match.findMany({
    where: {
      tournamentId: tournament.id,
      round: roundNumber,
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

  // If no matches in this round, redirect to rounds overview
  if (matches.length === 0) {
    redirect('/rounds');
  }

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
  const completedCount = matchesWithVotes.filter(m => m.isComplete).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6">
          <Link
            href="/rounds"
            className="inline-flex items-center text-white/80 hover:text-white font-medium transition-colors"
          >
            ← Volver a todas las rondas
          </Link>
        </div>

        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            {tournament.name}
          </h1>
          <p className="text-lg text-white/90 font-medium mb-4">
            {getRoundName(roundNumber)}
          </p>
          <div className="flex justify-center gap-4 text-sm flex-wrap">
            {sessionId && (
              <span className="bg-white/20 backdrop-blur-lg text-white px-3 py-1 rounded-full border border-white/30">
                {votedCount} de {openCount} votados
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-lg text-white px-3 py-1 rounded-full border border-white/30">
              {completedCount} completados
            </span>
            <span className="bg-white/20 backdrop-blur-lg text-white px-3 py-1 rounded-full border border-white/30">
              {matchesWithVotes.length} partidos totales
            </span>
          </div>
        </div>

        <MatchesList matches={matchesWithVotes} />
      </div>
    </div>
  );
}
