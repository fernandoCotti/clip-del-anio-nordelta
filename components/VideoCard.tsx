'use client';

import { motion } from 'framer-motion';

interface Video {
  id: string;
  title: string;
  embedUrl: string;
}

interface VideoCardProps {
  video: Video;
  votes: number;
  percentage: number;
  isSelected: boolean;
  hasVoted: boolean;
}

export function VideoCard({
  video,
  votes,
  percentage,
  isSelected,
  hasVoted,
}: VideoCardProps) {
  // Extract video ID from embed URL (supports YouTube, Vimeo, and Google Drive)
  const getEmbedUrl = (url: string): string => {
    // Google Drive formats
    if (url.includes('drive.google.com')) {
      // Extract file ID from various Drive URL formats
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
      // If already in preview format, return as is
      if (url.includes('/preview')) {
        return url;
      }
    }
    // YouTube formats
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtube.com/watch?v=')) {
      const id = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    // Vimeo formats
    if (url.includes('vimeo.com/')) {
      const id = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${id}`;
    }
    // Assume it's already an embed URL
    return url;
  };

  return (
    <div className={`bg-white/10 backdrop-blur-lg dark:bg-slate-800/30 rounded-xl shadow-xl overflow-hidden border transition-all ${
      isSelected 
        ? 'border-blue-400 ring-4 ring-blue-400/50 shadow-2xl' 
        : 'border-white/20 hover:border-white/40'
    }`}>
      <div className="relative aspect-video bg-slate-900">
        <iframe
          src={getEmbedUrl(video.embedUrl)}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={video.title}
        />
      </div>
      
      <div className="p-4">
        <h3 className="text-xl font-semibold text-white mb-2 drop-shadow-md">
          {video.title}
        </h3>
        
        {hasVoted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-white/80">
                Votos: {votes}
              </span>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {percentage}%
              </span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full ${
                  isSelected
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                    : 'bg-gradient-to-r from-slate-400 to-slate-500'
                }`}
              />
            </div>
            {isSelected && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-2 text-sm font-medium bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
              >
                ✓ Tu voto
              </motion.p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
