
import React from 'react';
import { Multipla } from '../types.ts';

interface MultiplaCardProps {
    multipla: Multipla;
}

const StarIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const MultiplaCard: React.FC<MultiplaCardProps> = ({ multipla }) => {
    return (
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 border-2 border-green-500 rounded-xl shadow-2xl shadow-green-500/10 p-6 mb-8">
            <div className="flex items-center mb-4">
                <StarIcon />
                <h2 className="text-2xl font-bold text-slate-50 uppercase tracking-tighter">Múltipla S-Tier</h2>
            </div>
            <p className="text-sm text-slate-300 mb-4 font-medium">{multipla.analysis}</p>
            
            <div className="space-y-3 mb-6">
                {multipla.bets.map((bet, index) => (
                    <div key={index} className="bg-slate-700/50 p-3 rounded-md flex justify-between items-center text-sm border border-slate-600">
                        <div>
                            <p className="font-bold text-white">{bet.suggestion}</p>
                            <p className="text-xs text-slate-400">{bet.teams}</p>
                        </div>
                        <span className="font-bold text-green-400 text-lg">{(bet.odd || 0).toFixed(2)}</span>
                    </div>
                ))}
            </div>

            <div className="border-t-2 border-dashed border-slate-700 pt-4 flex justify-between items-center">
                <span className="text-lg font-semibold text-slate-300">Odd Combinada:</span>
                <span className="text-3xl font-black text-green-400 animate-pulse tracking-tighter">{(multipla.totalOdd || 0).toFixed(2)}</span>
            </div>
        </div>
    );
};

export default MultiplaCard;