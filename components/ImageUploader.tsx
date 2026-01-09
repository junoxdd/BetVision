
import React, { useState, useCallback } from 'react';

interface ImageUploaderProps {
    onImageSelect: (base64: string | null) => void;
    disabled: boolean;
}

const UploadIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
    </svg>
);


const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect, disabled }) => {
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isDragging, setIsDragging] = useState<boolean>(false);

    const handleFile = (file: File) => {
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const MAX_DIMENSION = 1024;
                    let { width, height } = img;

                    if (width > height) {
                        if (width > MAX_DIMENSION) {
                            height *= MAX_DIMENSION / width;
                            width = MAX_DIMENSION;
                        }
                    } else {
                        if (height > MAX_DIMENSION) {
                            width *= MAX_DIMENSION / height;
                            height = MAX_DIMENSION;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.drawImage(img, 0, 0, width, height);
                        // Convert to JPEG for better compression of screenshots and specify quality
                        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
                        setImagePreview(dataUrl);
                        onImageSelect(dataUrl);
                    }
                };
                img.src = e.target?.result as string;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (disabled) return;
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, [disabled]);

    const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) setIsDragging(true);
    }, [disabled]);

    const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleClear = () => {
        setImagePreview(null);
        onImageSelect(null);
    };

    if (imagePreview) {
        return (
            <div className="relative">
                <img src={imagePreview} alt="Pré-visualização da print" className="w-full h-auto max-h-64 object-contain rounded-md border-2 border-green-500" />
                <button 
                    onClick={handleClear} 
                    disabled={disabled}
                    className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-7 w-7 flex items-center justify-center hover:bg-red-700 disabled:bg-slate-600">&times;
                </button>
            </div>
        );
    }

    return (
        <div 
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            className={`w-full h-32 bg-slate-900 border-2 border-dashed rounded-md flex flex-col items-center justify-center transition-colors ${isDragging ? 'border-green-500 bg-slate-800' : 'border-slate-600'} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
        >
            <input 
                type="file" 
                id="file-upload"
                className="hidden" 
                accept="image/*" 
                onChange={handleChange}
                disabled={disabled}
            />
            <label htmlFor="file-upload" className={`flex flex-col items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <UploadIcon />
                <p className="text-slate-400 text-sm mt-2">Arraste uma print aqui, ou <span className="font-semibold text-green-400">clique para selecionar</span>.</p>
            </label>
        </div>
    );
};

export default ImageUploader;