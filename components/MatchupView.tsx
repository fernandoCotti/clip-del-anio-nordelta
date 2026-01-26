'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { VideoCard } from './VideoCard';
import { VoteButton } from './VoteButton';
import Link from 'next/link';

interface Video {
  id: string;
  title: string;
  embedUrl: string;
}

interface MatchupViewProps {
  matchId: string;
  video1: Video;
  video2: Video;
  hasVoted: boolean;
  userVoteId: string | null;
  video1Votes: number;
  video2Votes: number;
  video1Percentage: number;
  video2Percentage: number;
  sessionId: string;
  round: number;
}

export function MatchupView({
  matchId,
  video1,
  video2,
  hasVoted,
  userVoteId,
  video1Votes,
  video2Votes,
  video1Percentage,
  video2Percentage,
  sessionId,
  round,
}: MatchupViewProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localHasVoted, setLocalHasVoted] = useState(hasVoted);
  const [localUserVoteId, setLocalUserVoteId] = useState(userVoteId);
  const [localVideo1Votes, setLocalVideo1Votes] = useState(video1Votes);
  const [localVideo2Votes, setLocalVideo2Votes] = useState(video2Votes);
  const [localVideo1Percentage, setLocalVideo1Percentage] = useState(video1Percentage);
  const [localVideo2Percentage, setLocalVideo2Percentage] = useState(video2Percentage);
  const [nextMatchId, setNextMatchId] = useState<string | null>(null);
  const [allVoted, setAllVoted] = useState(false);
  const [isLoadingNext, setIsLoadingNext] = useState(false);

  const handleVote = async (videoId: string) => {
    if (localHasVoted || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/vote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          matchId,
          videoId,
          sessionId,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setLocalHasVoted(true);
        setLocalUserVoteId(videoId);
        setLocalVideo1Votes(data.video1Votes);
        setLocalVideo2Votes(data.video2Votes);
        setLocalVideo1Percentage(data.video1Percentage);
        setLocalVideo2Percentage(data.video2Percentage);
        
        // Fetch next match after voting
        await fetchNextMatch();
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Error voting:', errorData);
        alert(`Error al votar: ${errorData.error || 'Error desconocido'}`);
      }
    } catch (error) {
      console.error('Error voting:', error);
      alert('Error de conexión al votar. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fetchNextMatch = async () => {
    setIsLoadingNext(true);
    try {
      const response = await fetch(`/api/matches/next?currentMatchId=${matchId}&round=${round}`);
      if (response.ok) {
        const data = await response.json();
        setNextMatchId(data.nextMatchId);
        setAllVoted(data.allVoted || false);
      } else {
        console.error('Error fetching next match');
      }
    } catch (error) {
      console.error('Error fetching next match:', error);
    } finally {
      setIsLoadingNext(false);
    }
  };

  const handleGoToNext = () => {
    if (nextMatchId) {
      router.push(`/match/${nextMatchId}`);
    }
  };

  // Fetch next match when component mounts if already voted
  useEffect(() => {
    if (hasVoted) {
      fetchNextMatch();
    }
  }, [hasVoted]);

  const video1Selected = localUserVoteId === video1.id;
  const video2Selected = localUserVoteId === video2.id;

  return (
    <div className="max-w-7xl mx-auto relative">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        {/* Video 1 */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative ${video1Selected ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}
        >
          <VideoCard
            video={video1}
            votes={localVideo1Votes}
            percentage={localVideo1Percentage}
            isSelected={video1Selected}
            hasVoted={localHasVoted}
          />
          {!localHasVoted && (
            <VoteButton
              onClick={() => handleVote(video1.id)}
              disabled={isSubmitting}
              label="Votar"
            />
          )}
        </motion.div>

        {/* VS Divider */}
        <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2 h-full pointer-events-none">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: 'spring' }}
            className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-full px-6 py-3 shadow-2xl border-2 border-white/30"
          >
            <span className="text-2xl font-bold text-white drop-shadow-lg">VS</span>
          </motion.div>
        </div>

        {/* Mobile VS */}
        <div className="lg:hidden flex items-center justify-center py-4">
          <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-full px-6 py-2 shadow-xl border-2 border-white/30">
            <span className="text-xl font-bold text-white drop-shadow-lg">VS</span>
          </div>
        </div>

        {/* Video 2 */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative ${video2Selected ? 'ring-4 ring-blue-500 ring-offset-4' : ''}`}
        >
          <VideoCard
            video={video2}
            votes={localVideo2Votes}
            percentage={localVideo2Percentage}
            isSelected={video2Selected}
            hasVoted={localHasVoted}
          />
          {!localHasVoted && (
            <VoteButton
              onClick={() => handleVote(video2.id)}
              disabled={isSubmitting}
              label="Votar"
            />
          )}
        </motion.div>
      </div>

      {localHasVoted && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 text-center space-y-4"
        >
          <p className="text-lg text-white/90 font-medium">
            ¡Gracias por votar! Tu voto ha sido registrado.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {/* Next Match Button - Show if there's a next match */}
            {isLoadingNext ? (
              <div className="text-white/70">Buscando siguiente partido...</div>
            ) : nextMatchId ? (
              <button
                onClick={handleGoToNext}
                className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 hover:from-green-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg border border-white/20"
              >
                Siguiente partido →
              </button>
            ) : allVoted ? (
              <div className="text-white/80 font-medium">
                ¡Has votado en todos los partidos de esta ronda!
              </div>
            ) : null}
            
            {/* Back to rounds button - always show as fallback */}
            <Link
              href={`/rounds/${round}`}
              className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl hover:shadow-2xl hover:scale-105 text-lg border border-white/20"
            >
              Volver a los cruces
            </Link>
          </div>
        </motion.div>
      )}
    </div>
  );
}
