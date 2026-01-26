'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { getRoundName, getRoundSize } from '@/lib/utils';

interface MatchManagerProps {
  tournament: any;
}

export function MatchManager({ tournament }: MatchManagerProps) {
  const [matches, setMatches] = useState<any[]>([]);
  const [currentRound, setCurrentRound] = useState(tournament.currentRound);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMatches();
  }, [tournament.id, currentRound]);

  const fetchMatches = async () => {
    try {
      // Fetch matches for current round
      const response = await fetch(`/api/admin/matches?tournamentId=${tournament.id}&round=${currentRound}`);
      if (response.ok) {
        const data = await response.json();
        setMatches(data);
      }
    } catch (error) {
      console.error('Error fetching matches:', error);
    }
  };

  const handleGenerateRound = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/matches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: tournament.id, round: currentRound }),
      });

      if (response.ok) {
        fetchMatches();
      }
    } catch (error) {
      console.error('Error generating matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleMatch = async (matchId: string, isOpen: boolean) => {
    try {
      await fetch(`/api/admin/matches/${matchId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isOpen }),
      });
      fetchMatches();
    } catch (error) {
      console.error('Error updating match:', error);
    }
  };

  const handleOpenAllMatches = async () => {
    for (const match of matches) {
      if (!match.isOpen && !match.isComplete) {
        await handleToggleMatch(match.id, true);
      }
    }
    fetchMatches();
  };

  const handleCloseAllMatches = async () => {
    for (const match of matches) {
      if (match.isOpen) {
        await handleToggleMatch(match.id, false);
      }
    }
    fetchMatches();
  };

  const handleAdvanceRound = async () => {
    if (!confirm('¿Avanzar a la siguiente ronda? Esto generará los partidos para la próxima ronda.')) return;
    
    setLoading(true);
    try {
      const nextRound = currentRound + 1;
      if (nextRound > 6) {
        alert('El torneo ya está completo');
        return;
      }

      // Generate next round matches
      const response = await fetch('/api/admin/matches/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tournamentId: tournament.id, round: nextRound }),
      });

      if (response.ok) {
        // Update tournament current round
        await fetch(`/api/admin/tournaments/${tournament.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ currentRound: nextRound }),
        });
        
        setCurrentRound(nextRound);
        fetchMatches();
      }
    } catch (error) {
      console.error('Error advancing round:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Round Selector */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            {getRoundName(currentRound)} ({getRoundSize(currentRound)} videos)
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentRound(Math.max(1, currentRound - 1))}
              disabled={currentRound === 1}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg disabled:opacity-50"
            >
              ← Anterior
            </button>
            <button
              onClick={() => setCurrentRound(Math.min(6, currentRound + 1))}
              disabled={currentRound === 6}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg disabled:opacity-50"
            >
              Siguiente →
            </button>
          </div>
        </div>

        {matches.length === 0 && (
          <button
            onClick={handleGenerateRound}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Generando...' : 'Generar Partidos para esta Ronda'}
          </button>
        )}

        {matches.length > 0 && (
          <div className="space-y-2 mt-4">
            <div className="flex gap-2">
              <button
                onClick={handleOpenAllMatches}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Abrir Todos los Partidos
              </button>
              <button
                onClick={handleCloseAllMatches}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
              >
                Cerrar Todos los Partidos
              </button>
            </div>
            {matches.every(m => m.isComplete) && currentRound < 6 && (
              <button
                onClick={handleAdvanceRound}
                disabled={loading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white font-bold py-3 px-4 rounded-lg transition-colors"
              >
                {loading ? 'Avanzando...' : 'Avanzar a la Siguiente Ronda'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Matches List */}
      {matches.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
            Partidos ({matches.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {matches.map((match) => (
              <motion.div
                key={match.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`p-4 border rounded-lg ${
                  match.isOpen
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : match.isComplete
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <div className="mb-2">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Partido #{match.matchNumber}
                  </span>
                </div>
                <div className="mb-3">
                  {match.videos?.map((mv: any, idx: number) => (
                    <div key={mv.id} className="text-sm text-slate-900 dark:text-white">
                      {idx + 1}. {mv.video?.title || 'Video'}
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleMatch(match.id, !match.isOpen)}
                    disabled={match.isComplete}
                    className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      match.isOpen
                        ? 'bg-red-600 hover:bg-red-700 text-white'
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    } disabled:opacity-50`}
                  >
                    {match.isOpen ? 'Cerrar' : 'Abrir'}
                  </button>
                  {match.isComplete && (
                    <span className="flex-1 py-2 px-3 bg-blue-600 text-white rounded-lg text-sm font-medium text-center">
                      ✓ Completado
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
