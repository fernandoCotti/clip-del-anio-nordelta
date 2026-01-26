'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface VideoManagerProps {
  tournamentId: string;
}

export function VideoManager({ tournamentId }: VideoManagerProps) {
  const [videos, setVideos] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [embedUrl, setEmbedUrl] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchVideos();
  }, [tournamentId]);

  const fetchVideos = async () => {
    try {
      const response = await fetch(`/api/admin/videos?tournamentId=${tournamentId}`);
      if (response.ok) {
        const data = await response.json();
        setVideos(data);
      }
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const handleAdd = async () => {
    if (!title || !embedUrl) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/videos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId, title, embedUrl }),
      });

      if (response.ok) {
        setTitle('');
        setEmbedUrl('');
        fetchVideos();
      }
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (videoId: string) => {
    if (!confirm('¿Estás seguro de eliminar este video?')) return;

    try {
      const response = await fetch(`/api/admin/videos/${videoId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Video */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Agregar Video ({videos.length}/64)
        </h2>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Título del video"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <input
            type="text"
            placeholder="URL de embed (YouTube/Vimeo/Google Drive)"
            value={embedUrl}
            onChange={(e) => setEmbedUrl(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <button
            onClick={handleAdd}
            disabled={loading || !title || !embedUrl || videos.length >= 64}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Agregando...' : 'Agregar Video'}
          </button>
        </div>
      </div>

      {/* Video List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Videos ({videos.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg"
            >
              <h3 className="font-semibold text-slate-900 dark:text-white mb-2">
                {video.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3 truncate">
                {video.embedUrl}
              </p>
              <button
                onClick={() => handleDelete(video.id)}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Eliminar
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
