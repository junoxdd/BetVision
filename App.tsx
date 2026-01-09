
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Game, Multipla } from './types.ts';
import { processInputData } from './services/aiService.ts';
import Header from './components/Header.tsx';
import GameCard from './components/GameCard.tsx';
import MultiplaCard from './components/MultiplaCard.tsx';
import LoadingSpinner from './components/LoadingSpinner.tsx';
import ErrorAlert from './components/ErrorAlert.tsx';
import ImageUploader from './components/ImageUploader.tsx';
import LiveMonitorBar from './components/LiveMonitorBar.tsx';
import { useAlertSound } from './hooks/useAlertSound.ts';

const App: React.FC = () => {
    const [activeMode, setActiveMode] = useState<'live' | 'pre-live'>('live');
    const [games, setGames] = useState<Game[]>([]);
    const [multipla, setMultipla] = useState<Multipla | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [loadStep, setLoadStep] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    
    const [isLiveMonitor, setIsLiveMonitor] = useState<boolean>(false);
    const [secondsToNextSync, setSecondsToNextSync] = useState<number>(60);
    const timerRef = useRef<number | null>(null);
    const { playSound } = useAlertSound();

    const handleAction = useCallback(async (typeOverride?: 'auto-live' | 'auto-pre-live' | 'image') => {
        const mode = typeOverride || (activeMode === 'live' ? 'auto-live' : 'auto-pre-live');
        
        setIsLoading(true);
        setError(null);
        setLoadStep(1);
        setGames([]); // Limpa para garantir que não exibimos dados velhos

        try {
            const result = await processInputData({ 
                type: mode as any, 
                value: mode === 'image' ? (selectedImage || '') : 'AUTO_TRIGGER' 
            });
            
            setLoadStep(2);
            
            if (!result.games || result.games.length === 0) {
                throw new Error("Busca real concluída: Não há jogos confirmados no momento para esta categoria.");
            }

            const validatedGames: Game[] = result.games.map(rg => {
                const analysis = result.analyses.find(a => a.id === rg.id);
                return {
                    ...rg,
                    aiSuggestion: {
                        suggestion: analysis?.suggestion || "Análise indisponível.",
                        analysis: analysis?.analysis || "Aguardando confirmação de dados secundários.",
                        confidence: (analysis?.confidence || 'B') as 'S' | 'A' | 'B',
                        source_links: (analysis as any)?.sources || [],
                        h2h_summary: analysis?.h2h_summary || "Dados históricos em busca...",
                        team_form: analysis?.team_form || { teamA: [], teamB: [] }
                    }
                };
            });

            setGames(validatedGames);
            if (validatedGames.some(g => g.aiSuggestion.confidence === 'S')) playSound();

            if (validatedGames.length >= 2) {
                const topBets = validatedGames.slice(0, 3);
                setMultipla({
                    id: Date.now().toString(),
                    bets: topBets.map(g => ({ 
                        gameId: g.id, 
                        teams: `${g.teamA} v ${g.teamB}`, 
                        suggestion: g.aiSuggestion.suggestion, 
                        odd: g.currentOdd 
                    })),
                    totalOdd: parseFloat(topBets.reduce((acc, g) => acc * g.currentOdd, 1).toFixed(2)),
                    analysis: `Múltipla ${activeMode.toUpperCase()} baseada em Grounding de busca real.`
                });
            }
            setLoadStep(3);
        } catch (err: any) {
            setError(err.message || "Erro de integridade de dados.");
            setGames([]);
            setMultipla(null);
        } finally {
            setIsLoading(false);
            setLoadStep(0);
        }
    }, [activeMode, selectedImage, playSound]);

    useEffect(() => {
        if (activeMode === 'live' && isLiveMonitor && !isLoading) {
            timerRef.current = window.setInterval(() => {
                setSecondsToNextSync(prev => {
                    if (prev <= 1) {
                        handleAction('auto-live');
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [isLiveMonitor, isLoading, activeMode, handleAction]);

    const switchMode = (mode: 'live' | 'pre-live') => {
        setActiveMode(mode);
        setIsLiveMonitor(false);
        setGames([]);
        setMultipla(null);
        setError(null);
        setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-green-500/30">
            <Header />
            <main className="container mx-auto p-4 md:p-8 max-w-6xl">
                
                <div className="flex justify-center mb-10">
                    <div className="bg-slate-900/50 p-2 rounded-[24px] border border-white/5 flex gap-2">
                        <button 
                            onClick={() => switchMode('live')}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-[18px] transition-all duration-500 ${activeMode === 'live' ? 'bg-red-600 text-white font-black shadow-lg shadow-red-600/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${activeMode === 'live' ? 'bg-white animate-pulse' : 'bg-red-900'}`}></div>
                            <span className="text-xs uppercase tracking-widest font-black">Ao Vivo</span>
                        </button>
                        <button 
                            onClick={() => switchMode('pre-live')}
                            className={`flex items-center space-x-3 px-8 py-4 rounded-[18px] transition-all duration-500 ${activeMode === 'pre-live' ? 'bg-green-600 text-white font-black shadow-lg shadow-green-600/20' : 'text-slate-500 hover:text-white'}`}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className="text-xs uppercase tracking-widest font-black">Próximos Jogos</span>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-12">
                    {activeMode === 'live' ? (
                        <div className="w-full flex flex-col items-center">
                            <button 
                                onClick={() => {
                                    const next = !isLiveMonitor;
                                    setIsLiveMonitor(next);
                                    if (next) handleAction('auto-live');
                                }}
                                className={`px-10 py-5 rounded-[22px] border-2 transition-all duration-500 flex items-center space-x-4 ${isLiveMonitor ? 'border-red-600 bg-red-600/5 text-red-500 shadow-xl shadow-red-600/10' : 'border-slate-800 bg-slate-900/50 text-slate-500'}`}
                            >
                                <span className="font-black text-xs uppercase tracking-[0.2em]">{isLiveMonitor ? 'Scanner Ativo' : 'Ativar Scanner Real-Time'}</span>
                            </button>
                            {isLiveMonitor && <div className="mt-6 w-full max-w-md"><LiveMonitorBar progress={(60 - secondsToNextSync) / 60 * 100} seconds={secondsToNextSync} /></div>}
                        </div>
                    ) : (
                        <div className="w-full max-w-2xl">
                             <div className="bg-slate-900/30 border border-white/5 rounded-[32px] p-8 text-center">
                                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">Sugestões de Valor</h3>
                                <p className="text-slate-500 text-xs font-medium mb-8">Utilizando Google Search para validar escalações e odds reais</p>
                                <button
                                    onClick={() => handleAction('auto-pre-live')}
                                    disabled={isLoading}
                                    className="w-full bg-green-500 text-slate-950 font-black py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 text-sm uppercase tracking-widest hover:bg-green-400"
                                >
                                    {isLoading ? 'Verificando com Google Search...' : 'Atualizar Próximos Jogos'}
                                </button>
                             </div>
                        </div>
                    )}
                </div>

                <div className="max-w-xl mx-auto mb-16">
                    <div className="bg-slate-950 border border-white/5 p-6 rounded-[28px]">
                        <span className="block mb-4 text-[10px] font-black text-slate-600 uppercase tracking-widest text-center">Validação via Print (Betano)</span>
                        <ImageUploader 
                            onImageSelect={(base64) => {
                                setSelectedImage(base64);
                                if (base64) handleAction('image');
                            }} 
                            disabled={isLoading} 
                        />
                    </div>
                </div>

                {isLoading ? (
                    <LoadingSpinner step={loadStep} />
                ) : (
                    <div className="space-y-16 pb-32">
                        {error && <div className="max-w-xl mx-auto"><ErrorAlert message={error} /></div>}
                        {!error && games.length === 0 && !isLoading && (
                            <div className="text-center py-20">
                                <p className="text-slate-600 font-black uppercase tracking-widest text-sm italic">Inicie uma busca para ver dados reais verificados.</p>
                            </div>
                        )}
                        {multipla && <div className="max-w-2xl mx-auto"><MultiplaCard multipla={multipla} /></div>}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {games.map(game => <GameCard key={game.id} game={game} />)}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
