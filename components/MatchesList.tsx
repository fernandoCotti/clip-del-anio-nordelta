'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  embedUrl: string;
}

interface MatchVideo {
  id: string;
  videoId: string;
  video: Video;
  position: number;
}

interface Match {
  id: string;
  matchNumber: number;
  isOpen: boolean;
  isComplete: boolean;
  winnerId: string | null;
  videos: MatchVideo[];
  userVote: { videoId: string } | null;
  totalVotes: number;
  video1Votes: number;
  video2Votes: number;
}

interface MatchesListProps {
  matches: Match[];
}

export function MatchesList({ matches }: MatchesListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {matches.map((match, index) => {
        const video1 = match.videos[0]?.video;
        const video2 = match.videos[1]?.video;
        const userVotedFor = match.userVote?.videoId;
        const hasVoted = !!userVotedFor;

        return (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-xl shadow-xl overflow-hidden border transition-all hover:scale-105 ${
              hasVoted
                ? 'border-green-400/50 ring-2 ring-green-400/30'
                : match.isOpen
                ? 'border-blue-400/50 ring-2 ring-blue-400/30'
                : 'border-white/20'
            }`}
          >
            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-white/70">
                  Partido #{match.matchNumber}
                </span>
                {hasVoted ? (
                  <span className="text-xs bg-green-500/30 backdrop-blur-lg text-green-200 px-2 py-1 rounded-full border border-green-400/30">
                    ✓ Votado
                  </span>
                ) : match.isOpen ? (
                  <span className="text-xs bg-blue-500/30 backdrop-blur-lg text-blue-200 px-2 py-1 rounded-full border border-blue-400/30">
                    Abierto
                  </span>
                ) : (
                  <span className="text-xs bg-white/10 backdrop-blur-lg text-white/60 px-2 py-1 rounded-full border border-white/20">
                    Cerrado
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {/* Video 1 */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    userVotedFor === video1?.id
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 ring-2 ring-blue-400/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate flex-1">
                      {video1?.title || 'Video 1'}
                    </span>
                    {hasVoted && (
                      <span className="text-xs text-white/70 ml-2">
                        {match.video1Votes} votos
                      </span>
                    )}
                  </div>
                  {userVotedFor === video1?.id && (
                    <span className="text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                      ← Tu voto
                    </span>
                  )}
                </div>

                {/* VS */}
                <div className="text-center text-xs text-white/60 font-bold">
                  VS
                </div>

                {/* Video 2 */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    userVotedFor === video2?.id
                      ? 'bg-gradient-to-r from-blue-500/30 to-purple-500/30 border-blue-400/50 ring-2 ring-blue-400/30'
                      : 'bg-white/5 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-white truncate flex-1">
                      {video2?.title || 'Video 2'}
                    </span>
                    {hasVoted && (
                      <span className="text-xs text-white/70 ml-2">
                        {match.video2Votes} votos
                      </span>
                    )}
                  </div>
                  {userVotedFor === video2?.id && (
                    <span className="text-xs bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent font-medium">
                      ← Tu voto
                    </span>
                  )}
                </div>
              </div>

              {/* Action button */}
              {match.isOpen && !hasVoted && (
                <Link
                  href={`/match/${match.id}`}
                  className="mt-4 block w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-center font-bold py-2 px-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:scale-105 border border-white/20"
                >
                  Votar
                </Link>
              )}

              {match.isOpen && hasVoted && (
                <Link
                  href={`/match/${match.id}`}
                  className="mt-4 block w-full bg-white/10 backdrop-blur-lg hover:bg-white/20 text-white text-center font-bold py-2 px-4 rounded-xl transition-all border border-white/20 hover:scale-105"
                >
                  Ver partido
                </Link>
              )}

              {!match.isOpen && (
                <div className="mt-4 text-center text-sm text-white/60">
                  Votación cerrada
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
