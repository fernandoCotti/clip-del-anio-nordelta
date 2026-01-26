'use client';

import { useState, useEffect } from 'react';
import { TournamentManager } from './TournamentManager';
import { VideoManager } from './VideoManager';
import { MatchManager } from './MatchManager';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'tournament' | 'videos' | 'matches'>('tournament');
  const [tournament, setTournament] = useState<any>(null);
  const [tournaments, setTournaments] = useState<any[]>([]);

  useEffect(() => {
    fetchTournaments();
  }, []);

  const fetchTournaments = async () => {
    try {
      const response = await fetch('/api/admin/tournaments');
      if (response.ok) {
        const data = await response.json();
        setTournaments(data);
        const active = data.find((t: any) => t.isActive);
        if (active) {
          setTournament(active);
        } else if (data.length > 0) {
          setTournament(data[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching tournaments:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">
          Panel de Administración
        </h1>

        {/* Tabs */}
        <div className="mb-6 border-b border-slate-200 dark:border-slate-700">
          <nav className="flex space-x-8">
            {(['tournament', 'videos', 'matches'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:text-slate-400 dark:hover:text-slate-300'
                }`}
              >
                {tab === 'tournament' && 'Torneo'}
                {tab === 'videos' && 'Videos'}
                {tab === 'matches' && 'Partidos'}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        {activeTab === 'tournament' && (
          <TournamentManager
            tournaments={tournaments}
            selectedTournament={tournament}
            onTournamentChange={setTournament}
            onRefresh={fetchTournaments}
          />
        )}
        {activeTab === 'videos' && tournament && (
          <VideoManager tournamentId={tournament.id} />
        )}
        {activeTab === 'matches' && tournament && (
          <MatchManager tournament={tournament} />
        )}
      </div>
    </div>
  );
}
