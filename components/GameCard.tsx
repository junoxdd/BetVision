
import React from 'react';
import { Game } from '../types.ts';

interface GameCardProps {
    game: Game;
}

const VerifiedBadge = ({ isLive }: { isLive: boolean }) => (
    <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full border border-white/10 ${isLive ? 'bg-red-500/10' : 'bg-emerald-500/10'}`}>
        <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`}></div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${isLive ? 'text-red-500' : 'text-emerald-500'}`}>
            {isLive ? 'LIVE REAL' : 'DADO VERIFICADO'}
        </span>
    </div>
);

const GameCard: React.FC<GameCardProps> = ({ game }) => {
    const isLive = game.status === 'live';

    return (
        <div className={`relative bg-[#0f172a] border ${isLive ? 'border-red-500/20' : 'border-slate-800'} rounded-[32px] shadow-2xl p-6 flex flex-col justify-between transition-all duration-500 hover:scale-[1.02] hover:border-green-500/50 group`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none overflow-hidden rounded-[32px]">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-green-500 via-transparent to-transparent"></div>
            </div>

            <div className="relative z-10">
                <div className="flex justify-between items-center mb-6">
                    <VerifiedBadge isLive={isLive} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-900/50 px-2 py-1 rounded-md">{game.league}</span>
                </div>

                <div className="flex justify-between items-center mb-10 gap-3">
                    <div className="flex-1 text-right">
                        <p className="text-base font-black text-white uppercase tracking-tighter truncate leading-none">{game.teamA}</p>
                    </div>
                    
                    {isLive ? (
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-white/5 shadow-inner">
                                <span className="text-2xl font-black text-white tabular-nums tracking-tighter">{game.scoreA} : {game.scoreB}</span>
                            </div>
                            <span className="text-[10px] font-black text-red-500 mt-2 uppercase tracking-widest">{game.minute}'</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-900 px-4 py-2 rounded-2xl border border-white/5">
                                <span className="text-lg font-black text-slate-300 tracking-tighter uppercase">{game.startTime || 'Hoje'}</span>
                            </div>
                            <span className="text-[9px] font-black text-slate-600 mt-2 uppercase tracking-widest">Kick-off</span>
                        </div>
                    )}

                    <div className="flex-1 text-left">
                        <p className="text-base font-black text-white uppercase tracking-tighter truncate leading-none">{game.teamB}</p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-slate-950/50 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center space-x-2 mb-2">
                            <svg className="w-3.5 h-3.5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Extração Verídica</span>
                        </div>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-medium">
                            {game.aiSuggestion.h2h_summary}
                        </p>
                    </div>

                    <div className="p-1 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/10">
                        <div className="bg-slate-950/80 rounded-[14px] p-4">
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Sugestão BetVision</span>
                                <div className={`px-2 py-0.5 rounded text-[8px] font-black ${game.aiSuggestion.confidence === 'S' ? 'bg-yellow-500 text-black' : 'bg-slate-800 text-slate-400'}`}>
                                    {game.aiSuggestion.confidence}-TIER
                                </div>
                            </div>
                            <p className="text-lg font-black text-white tracking-tighter mb-1 uppercase">{game.aiSuggestion.suggestion}</p>
                            <p className="text-[11px] text-slate-500 font-medium leading-snug italic">"{game.aiSuggestion.analysis}"</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative z-10 mt-6 pt-6 border-t border-white/5 flex justify-between items-center">
                <div className="flex flex-wrap gap-2">
                    {game.aiSuggestion.source_links?.slice(0, 1).map((link, i) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" 
                           className="flex items-center space-x-1 text-[9px] font-black bg-slate-900 hover:bg-slate-800 text-sky-400 border border-white/5 px-3 py-1.5 rounded-xl transition-all uppercase tracking-tighter">
                            <svg className="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                            <span>Link da Fonte</span>
                        </a>
                    ))}
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">Odd Confirmada</span>
                    <span className="text-3xl font-black text-green-400 tracking-tighter leading-none">{(game.currentOdd || 1.85).toFixed(2)}</span>
                </div>
            </div>
        </div>
    );
};

export default GameCard;
