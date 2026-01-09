
import React from 'react';

interface LiveMonitorBarProps {
    progress: number;
    seconds: number;
}

const LiveMonitorBar: React.FC<LiveMonitorBarProps> = ({ progress, seconds }) => {
    return (
        <div className="w-full max-w-2xl mx-auto mb-10 space-y-2">
            <div className="flex justify-between items-center px-1">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sincronização Betano Live</span>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Próximo Scan: {seconds}s</span>
            </div>
            <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <div 
                    className="h-full bg-gradient-to-r from-green-600 to-emerald-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
        </div>
    );
};

export default LiveMonitorBar;
