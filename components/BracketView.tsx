'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { getRoundName } from '@/lib/utils';
import Link from 'next/link';

interface BracketViewProps {
  matchesByRound: Record<number, any[]>;
}

// Helper function to get embed URL (similar to VideoCard)
function getEmbedUrl(embedUrl: string): string {
  if (!embedUrl) return '';
  
  // YouTube
  if (embedUrl.includes('youtube.com') || embedUrl.includes('youtu.be')) {
    const youtubeId = embedUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/)?.[1];
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}`;
    }
  }
  
  // Vimeo
  if (embedUrl.includes('vimeo.com')) {
    const vimeoId = embedUrl.match(/(?:vimeo\.com\/)(\d+)/)?.[1];
    if (vimeoId) {
      return `https://player.vimeo.com/video/${vimeoId}`;
    }
  }
  
  // Google Drive
  if (embedUrl.includes('drive.google.com')) {
    const fileIdMatch = embedUrl.match(/\/d\/([a-zA-Z0-9_-]+)/) || embedUrl.match(/id=([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
    }
  }
  
  // If already an embed URL, return as is
  if (embedUrl.includes('/embed/') || embedUrl.includes('/preview')) {
    return embedUrl;
  }
  
  return embedUrl;
}

export function BracketView({ matchesByRound }: BracketViewProps) {
  const rounds = [1, 2, 3, 4, 5, 6]; // Tournament ends at round 6 (Final)
  const [expandedRounds, setExpandedRounds] = useState<Set<number>>(new Set());
  const [previewVideo, setPreviewVideo] = useState<{ url: string; title: string } | null>(null);
  
  const INITIAL_MATCHES_TO_SHOW = 4;
  
  const toggleRound = (round: number) => {
    const newExpanded = new Set(expandedRounds);
    if (newExpanded.has(round)) {
      newExpanded.delete(round);
    } else {
      newExpanded.add(round);
    }
    setExpandedRounds(newExpanded);
  };

  return (
    <div className="overflow-x-auto pb-8">
      <div className="relative min-w-max">
        {/* Bracket Container */}
        <div className="flex gap-8 lg:gap-12 xl:gap-16 p-6">
          {rounds.map((round, roundIndex) => {
            const matches = matchesByRound[round] || [];
            if (matches.length === 0 && roundIndex === 0) return null;

            const isLastRound = roundIndex === rounds.length - 1;
            const nextRound = rounds[roundIndex + 1];
            const nextMatches = matchesByRound[nextRound] || [];

            return (
              <div key={round} className="flex flex-col relative">
                {/* Round Header */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: roundIndex * 0.1 }}
                  className="mb-6 text-center"
                >
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">
                    {getRoundName(round)}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {matches.length} partido{matches.length !== 1 ? 's' : ''}
                  </div>
                </motion.div>

                {/* Matches */}
                <div className="flex flex-col gap-2 min-w-[280px] max-h-[80vh] overflow-y-auto">
                  {matches.length > 0 ? (
                    (() => {
                      const isExpanded = expandedRounds.has(round);
                      const matchesToShow = isExpanded ? matches : matches.slice(0, INITIAL_MATCHES_TO_SHOW);
                      const hasMore = matches.length > INITIAL_MATCHES_TO_SHOW;
                      
                      return (
                        <>
                          {matchesToShow.map((match, matchIndex) => {
                      const video1 = match.videos?.find((mv: any) => mv.position === 0)?.video;
                      const video2 = match.videos?.find((mv: any) => mv.position === 1)?.video;
                      const winner = match.winnerId
                        ? match.videos?.find((mv: any) => mv.videoId === match.winnerId)?.video
                        : null;

                      return (
                        <div key={match.id} className="relative group">
                          {/* Connecting Lines to Next Round */}
                          {!isLastRound && (
                            <>
                              {/* Horizontal line to next round */}
                              <div className="absolute right-0 top-1/2 w-8 lg:w-12 xl:w-16 h-0.5 bg-slate-300 dark:bg-slate-600 z-0 transform -translate-y-1/2" />
                              {/* Vertical connector for pairs of matches */}
                              {matchIndex % 2 === 0 && matches[matchIndex + 1] && (
                                <div 
                                  className="absolute right-8 lg:right-12 xl:right-16 top-1/2 w-0.5 bg-slate-300 dark:bg-slate-600 z-0"
                                  style={{ 
                                    height: 'calc(100% + 0.5rem)',
                                    transform: 'translateY(-50%)'
                                  }} 
                                />
                              )}
                            </>
                          )}

                          {/* Match Card */}
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: roundIndex * 0.1 + matchIndex * 0.05 }}
                            className={`relative z-10 rounded-lg border-2 shadow-md transition-all ${
                              match.isComplete
                                ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/20'
                                : match.isOpen
                                ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20'
                                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                            }`}
                          >
                            <div className="p-3">
                              {/* Match Number */}
                              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 text-center">
                                #{match.matchNumber}
                              </div>

                              {/* Video 1 */}
                              <div
                                className={`mb-1 p-2 rounded text-sm transition-all ${
                                  winner?.id === video1?.id
                                    ? 'bg-green-200 dark:bg-green-800/50 font-bold text-green-800 dark:text-green-200'
                                    : match.winnerId && match.winnerId !== video1?.id
                                    ? 'opacity-50 text-slate-500 dark:text-slate-400'
                                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate flex-1">
                                    {video1?.title || 'TBD'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {video1?.embedUrl && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewVideo({ url: getEmbedUrl(video1.embedUrl), title: video1.title });
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
                                        title="Vista previa"
                                      >
                                        ▶
                                      </button>
                                    )}
                                    {winner?.id === video1?.id && (
                                      <span className="text-green-600 dark:text-green-400">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* VS Divider */}
                              <div className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 my-1">
                                VS
                              </div>

                              {/* Video 2 */}
                              <div
                                className={`p-2 rounded text-sm transition-all ${
                                  winner?.id === video2?.id
                                    ? 'bg-green-200 dark:bg-green-800/50 font-bold text-green-800 dark:text-green-200'
                                    : match.winnerId && match.winnerId !== video2?.id
                                    ? 'opacity-50 text-slate-500 dark:text-slate-400'
                                    : 'bg-slate-100 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100'
                                }`}
                              >
                                <div className="flex items-center justify-between gap-2">
                                  <span className="truncate flex-1">
                                    {video2?.title || 'TBD'}
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {video2?.embedUrl && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setPreviewVideo({ url: getEmbedUrl(video2.embedUrl), title: video2.title });
                                        }}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-xs"
                                        title="Vista previa"
                                      >
                                        ▶
                                      </button>
                                    )}
                                    {winner?.id === video2?.id && (
                                      <span className="text-green-600 dark:text-green-400">
                                        ✓
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Status Badge */}
                              <div className="mt-2 text-center">
                                {match.isComplete ? (
                                  <span className="inline-block text-xs bg-green-500 text-white px-2 py-1 rounded-full">
                                    Completado
                                  </span>
                                ) : match.isOpen ? (
                                  <Link
                                    href={`/match/${match.id}`}
                                    className="inline-block text-xs bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded-full transition-colors"
                                  >
                                    Votar
                                  </Link>
                                ) : (
                                  <span className="inline-block text-xs bg-slate-300 dark:bg-slate-600 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-full">
                                    Cerrado
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </div>
                      );
                    })}
                    {hasMore && (
                      <button
                        onClick={() => toggleRound(round)}
                        className="mt-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
                      >
                        {isExpanded ? 'Ver menos' : `Ver más cruces (${matches.length - INITIAL_MATCHES_TO_SHOW} más)`}
                      </button>
                    )}
                        </>
                      );
                    })()
                  ) : (
                    <div className="text-center text-slate-400 dark:text-slate-500 py-8 text-sm">
                      Sin partidos
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Video Preview Modal */}
      {previewVideo && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewVideo(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                {previewVideo.title}
              </h3>
              <button
                onClick={() => setPreviewVideo(null)}
                className="text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-2xl"
              >
                ×
              </button>
            </div>
            <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
              <iframe
                src={previewVideo.url}
                className="absolute top-0 left-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
