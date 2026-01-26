import { prisma } from '@/lib/prisma';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { getRoundName } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export default async function Home() {
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

  // Check if tournament is complete (Final is round 6)
  const finalMatch = await prisma.match.findFirst({
    where: {
      tournamentId: tournament.id,
      round: 6, // Final
      isComplete: true,
    },
  });

  // If tournament is complete, show winner on home page
  if (finalMatch && finalMatch.winnerId) {
    const winnerVideo = await prisma.video.findUnique({
      where: { id: finalMatch.winnerId },
    });

    if (winnerVideo) {
      // Helper function to get embed URL
      const getEmbedUrl = (url: string): string => {
        if (url.includes('drive.google.com')) {
          const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
          if (fileIdMatch) {
            return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
          }
        }
        if (url.includes('youtu.be/')) {
          const id = url.split('youtu.be/')[1].split('?')[0];
          return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('youtube.com/watch?v=')) {
          const id = url.split('v=')[1].split('&')[0];
          return `https://www.youtube.com/embed/${id}`;
        }
        if (url.includes('vimeo.com/')) {
          const id = url.split('vimeo.com/')[1].split('?')[0];
          return `https://player.vimeo.com/video/${id}`;
        }
        if (url.includes('youtube.com/embed/') || url.includes('/preview')) {
          return url;
        }
        return url;
      };

      return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 via-blue-900 to-purple-800 dark:from-slate-900 dark:via-purple-900 dark:to-indigo-900 relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-amber-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl"></div>
          </div>
          
          <div className="container mx-auto px-4 py-12 relative z-10">
            <div className="max-w-5xl mx-auto text-center space-y-8">
              {/* Winner Title */}
              <div className="mb-8">
                <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-300 via-amber-400 via-orange-400 to-yellow-300 bg-clip-text text-transparent animate-gradient">
                  Clip del Año – {tournament.name} {tournament.year}
                </h1>
                <div className="bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 text-white px-8 py-3 rounded-full text-xl font-bold shadow-2xl inline-block transform hover:scale-105 transition-transform">
                  🏆 GANADOR 🏆
                </div>
              </div>

              {/* Winner Video */}
              <div className="bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-2xl shadow-2xl overflow-hidden p-6 border border-white/20">
                <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden mb-6 shadow-xl ring-4 ring-yellow-400/50">
                  <iframe
                    src={getEmbedUrl(winnerVideo.embedUrl)}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title={winnerVideo.title}
                  />
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-white drop-shadow-lg">
                  {winnerVideo.title}
                </h2>
              </div>

              {/* Links */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/bracket"
                  className="inline-block bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Ver Bracket Completo
                </Link>
                <Link
                  href="/rounds"
                  className="inline-block bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-3 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
                >
                  Ver Todas las Rondas
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }

  // Get stats about the tournament
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

  const currentRoundMatches = allMatches.filter(m => m.round === tournament.currentRound);
  const completedMatches = allMatches.filter(m => m.isComplete).length;
  const openMatches = currentRoundMatches.filter(m => m.isOpen).length;

  // Get user's votes if they have a session
  let userVotesCount = 0;
  if (sessionId) {
    userVotesCount = await prisma.vote.count({
      where: {
        sessionId,
        match: {
          tournamentId: tournament.id,
        },
      },
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 via-blue-900 to-indigo-800 dark:from-slate-900 dark:via-indigo-900 dark:to-purple-900 relative overflow-hidden flex items-center justify-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Main Title */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent drop-shadow-lg">
              {tournament.name}
            </h1>
            <p className="text-2xl text-white/90 mb-2 font-semibold drop-shadow-md">
              Torneo de Videos {tournament.year}
            </p>
            <p className="text-lg text-white/70 font-medium">
              Ronda Actual: {getRoundName(tournament.currentRound)}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-xl shadow-xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                {openMatches}
              </div>
              <div className="text-sm text-white/80 font-medium">
                Partidos Abiertos
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-xl shadow-xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
              <div className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">
                {completedMatches}
              </div>
              <div className="text-sm text-white/80 font-medium">
                Partidos Completados
              </div>
            </div>

            {sessionId && (
              <div className="bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-xl shadow-xl p-6 text-center border border-white/20 hover:scale-105 transition-transform">
                <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
                  {userVotesCount}
                </div>
                <div className="text-sm text-white/80 font-medium">
                  Tus Votos
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 gap-4 mb-8">
            <Link
              href="/rounds"
              className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-6 px-8 rounded-xl text-center text-xl transition-all hover:scale-105 shadow-2xl border border-white/20"
            >
              🗳️ Votar Ahora
              <div className="text-sm font-normal mt-2 opacity-90">
                Ver todas las rondas y partidos
              </div>
            </Link>
          </div>

          {/* Bracket Link */}
          <div className="text-center">
            <Link
              href="/bracket"
              className="inline-block bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-700 hover:via-pink-700 hover:to-rose-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 shadow-2xl border border-white/20"
            >
              🏆 Ver Bracket del Torneo
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
