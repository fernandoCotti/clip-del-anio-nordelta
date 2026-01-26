import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { MatchupView } from '@/components/MatchupView';
import { getRoundName } from '@/lib/utils';
import { cookies } from 'next/headers';

async function getSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get('sessionId')?.value;
  
  // If no session ID exists, generate one (it will be set by the vote API when user votes)
  if (!sessionId) {
    sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
  }
  
  return sessionId;
}

export default async function MatchPage({
  params,
}: {
  params: Promise<{ matchId: string }>;
}) {
  const { matchId } = await params;
  const sessionId = await getSessionId();

  const match = await prisma.match.findUnique({
    where: { id: matchId },
    include: {
      tournament: true,
      videos: {
        include: {
          video: true,
        },
        orderBy: {
          position: 'asc',
        },
      },
      votes: {
        where: {
          sessionId,
        },
      },
    },
  });

  if (!match || !match.isOpen) {
    notFound();
  }

  if (match.videos.length !== 2) {
    notFound();
  }

  const userVote = match.votes[0];
  const hasVoted = !!userVote;

  // Get vote counts
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
  const video1Votes = voteCounts.find(v => v.videoId === match.videos[0].videoId)?._count.videoId || 0;
  const video2Votes = voteCounts.find(v => v.videoId === match.videos[1].videoId)?._count.videoId || 0;
  const video1Percentage = totalVotes > 0 ? Math.round((video1Votes / totalVotes) * 100) : 0;
  const video2Percentage = totalVotes > 0 ? Math.round((video2Votes / totalVotes) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 dark:from-slate-900 dark:via-blue-900 dark:to-indigo-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent mb-2 drop-shadow-lg">
            {match.tournament.name}
          </h1>
          <p className="text-lg text-white/80 font-medium">
            {getRoundName(match.round)}
          </p>
        </div>

        <MatchupView
          matchId={match.id}
          video1={match.videos[0].video}
          video2={match.videos[1].video}
          hasVoted={hasVoted}
          userVoteId={userVote?.videoId || null}
          video1Votes={video1Votes}
          video2Votes={video2Votes}
          video1Percentage={video1Percentage}
          video2Percentage={video2Percentage}
          sessionId={sessionId}
          round={match.round}
        />
      </div>
    </div>
  );
}
