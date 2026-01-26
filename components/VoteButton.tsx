'use client';

import { motion } from 'framer-motion';

interface VoteButtonProps {
  onClick: () => void;
  disabled: boolean;
  label: string;
}

export function VoteButton({ onClick, disabled, label }: VoteButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      disabled={disabled}
      className={`w-full mt-4 font-bold py-4 px-6 rounded-xl shadow-xl transition-all border ${
        disabled
          ? 'bg-slate-500/50 cursor-not-allowed text-white/50 border-white/10'
          : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white border-white/30 hover:shadow-2xl'
      }`}
    >
      {disabled ? 'Votando...' : label}
    </motion.button>
  );
}
