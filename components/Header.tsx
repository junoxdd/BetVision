
import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-950/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
            <div className="container mx-auto px-6 py-5 flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="bg-green-500 p-1.5 rounded-lg shadow-lg shadow-green-500/20">
                        <svg className="w-5 h-5 text-slate-950" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                    <h1 className="text-xl font-black text-white tracking-tighter uppercase">
                        BetVision <span className="text-green-500">AI</span>
                    </h1>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="hidden md:flex items-center space-x-2 bg-slate-900 border border-white/5 px-3 py-1.5 rounded-full">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Terminal Live</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
