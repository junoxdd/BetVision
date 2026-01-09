
import React from 'react';

interface LoadingSpinnerProps {
    step: number;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ step }) => {
    const steps = [
        "Iniciando OCR de alta precisão...",
        "Extraindo dados estatísticos da rede...",
        "Calculando valor esperado de odds...",
        "Finalizando dashboard..."
    ];

    return (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-8">
            <div className="relative flex items-center justify-center">
                <div className="w-24 h-24 border-b-4 border-green-500 rounded-full animate-spin"></div>
                <div className="absolute font-black text-green-500 text-xl tracking-tighter">VISION</div>
            </div>
            
            <div className="space-y-3">
                <p className="text-white text-2xl font-black uppercase tracking-tighter">Processando Inteligência</p>
                <div className="flex flex-col items-center space-y-1">
                    {steps.map((text, i) => (
                        <p key={i} className={`text-sm transition-all duration-500 ${step >= i + 1 ? 'text-green-400 opacity-100 font-bold' : 'text-slate-700 opacity-30'}`}>
                            {step > i + 1 ? '✓ ' : step === i + 1 ? '→ ' : '○ '} {text}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner;