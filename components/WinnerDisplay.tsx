'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface Video {
  id: string;
  title: string;
  embedUrl: string;
  tournament: {
    name: string;
    year: number;
  };
}

interface WinnerDisplayProps {
  video: Video;
  tournamentName: string;
}

export function WinnerDisplay({ video, tournamentName }: WinnerDisplayProps) {
  const [showConfetti, setShowConfetti] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: 1920, height: 1080 });

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    
    if (typeof window !== 'undefined') {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight });
      };
      window.addEventListener('resize', handleResize);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleResize);
      };
    }
    
    return () => clearTimeout(timer);
  }, []);

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
    return url;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              initial={{
                x: Math.random() * windowSize.width,
                y: -20,
                opacity: 1,
              }}
              animate={{
                y: windowSize.height + 20,
                x: Math.random() * windowSize.width,
                opacity: [1, 1, 0],
              }}
              transition={{
                duration: Math.random() * 2 + 2,
                delay: Math.random() * 0.5,
                ease: 'easeOut',
              }}
            />
          ))}
        </div>
      )}

      <div className="max-w-5xl w-full text-center space-y-8">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, type: 'spring' }}
        >
          <motion.h1
            className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 bg-clip-text text-transparent"
            animate={{
              textShadow: [
                '0 0 20px rgba(251, 191, 36, 0.5)',
                '0 0 40px rgba(251, 191, 36, 0.8)',
                '0 0 20px rgba(251, 191, 36, 0.5)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Clip del Año
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-2xl md:text-4xl font-semibold text-slate-700 dark:text-slate-300"
          >
            {tournamentName}
          </motion.p>
        </motion.div>

        {/* Winner Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 200 }}
          className="inline-block"
        >
          <div className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white px-8 py-3 rounded-full text-xl font-bold shadow-lg">
            🏆 GANADOR 🏆
          </div>
        </motion.div>

        {/* Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="relative"
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 30px rgba(251, 191, 36, 0.3)',
                '0 0 60px rgba(251, 191, 36, 0.6)',
                '0 0 30px rgba(251, 191, 36, 0.3)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden p-4 md:p-6"
          >
            <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden">
              <iframe
                src={getEmbedUrl(video.embedUrl)}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              />
            </div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="text-2xl md:text-4xl font-bold text-slate-900 dark:text-white mt-6"
            >
              {video.title}
            </motion.h2>
          </motion.div>
        </motion.div>

        {/* Celebration Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-lg md:text-xl text-slate-600 dark:text-slate-400"
        >
          ¡Felicitaciones al ganador!
        </motion.p>
      </div>
    </div>
  );
}
