'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TournamentManagerProps {
  tournaments: any[];
  selectedTournament: any;
  onTournamentChange: (tournament: any) => void;
  onRefresh: () => void;
}

export function TournamentManager({
  tournaments,
  selectedTournament,
  onTournamentChange,
  onRefresh,
}: TournamentManagerProps) {
  const [name, setName] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name || !year) return;

    setLoading(true);
    try {
      const response = await fetch('/api/admin/tournaments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, year: parseInt(year) }),
      });

      if (response.ok) {
        setName('');
        setYear(new Date().getFullYear().toString());
        onRefresh();
      }
    } catch (error) {
      console.error('Error creating tournament:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (tournament: any) => {
    try {
      await fetch(`/api/admin/tournaments/${tournament.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !tournament.isActive }),
      });
      onRefresh();
    } catch (error) {
      console.error('Error updating tournament:', error);
    }
  };

  const handleDuplicate = async (tournament: any) => {
    const newName = prompt(
      `Duplicar torneo "${tournament.name}"\n\nIngresa el nombre para la copia:`,
      `${tournament.name} (Copia)`
    );
    
    if (!newName) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/tournaments/${tournament.id}/duplicate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Torneo duplicado exitosamente!\n\n${data.videosCount} videos copiados`);
        onRefresh();
      } else {
        alert('Error al duplicar el torneo');
      }
    } catch (error) {
      console.error('Error duplicating tournament:', error);
      alert('Error al duplicar el torneo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Create Tournament */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">
          Crear Nuevo Torneo
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Nombre del torneo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <input
            type="number"
            placeholder="Año"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
          />
          <button
            onClick={handleCreate}
            disabled={loading || !name || !year}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-bold py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Creando...' : 'Crear Torneo'}
          </button>
        </div>
      </div>

      {/* Tournament List */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
            Torneos
          </h2>
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Total: {tournaments.length} | 
            Activos: {tournaments.filter(t => t.isActive).length}
          </div>
        </div>
        {tournaments.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8">
            No hay torneos creados. Crea uno arriba.
          </p>
        ) : (
          <div className="space-y-3">
          {tournaments.map((tournament) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`p-4 border rounded-lg ${
                selectedTournament?.id === tournament.id
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">
                      {tournament.name}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Año: {tournament.year} | Videos: {tournament._count.videos} | Partidos: {tournament._count.matches}
                    </p>
                  </div>
                  <button
                    onClick={() => handleToggleActive(tournament)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                      tournament.isActive
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 text-slate-900 dark:text-white'
                    }`}
                  >
                    {tournament.isActive ? 'Activo' : 'Inactivo'}
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onTournamentChange(tournament)}
                    className="flex-1 px-3 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-900 dark:text-white rounded-lg text-sm"
                  >
                    Seleccionar
                  </button>
                  <button
                    onClick={() => handleDuplicate(tournament)}
                    disabled={loading}
                    className="flex-1 px-3 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-400 text-white rounded-lg text-sm transition-colors"
                    title="Duplicar torneo con todos sus videos"
                  >
                    Duplicar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
          </div>
        )}
      </div>
    </div>
  );
}
