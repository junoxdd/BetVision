
import { useCallback, useRef } from 'react';

// This hook encapsulates the logic for playing a sound notification.
// It uses the Web Audio API to generate a tone, avoiding the need for audio files.
export const useAlertSound = (volume = 0.3) => {
    // useRef is used to hold the AudioContext instance across re-renders
    // without triggering them on change.
    const audioContextRef = useRef<AudioContext | null>(null);

    const playSound = useCallback(() => {
        // Initialize AudioContext only once, on the first play action.
        // This is important because user interaction is required to start an AudioContext.
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        
        const context = audioContextRef.current;
        
        // If the context is suspended (common in modern browsers before user interaction),
        // try to resume it.
        if (context.state === 'suspended') {
            context.resume();
        }

        // Create an oscillator node to generate the sound wave.
        const oscillator = context.createOscillator();
        // Create a gain node to control the volume.
        const gainNode = context.createGain();

        // Connect the oscillator to the gain node, and the gain node to the speakers.
        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        // Configure the sound
        oscillator.type = 'sine'; // A smooth, clean tone
        oscillator.frequency.setValueAtTime(880, context.currentTime); // A5 note, high-pitched but not jarring
        gainNode.gain.setValueAtTime(volume, context.currentTime);

        // Schedule the sound to play now and stop after 0.2 seconds.
        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + 0.2);
    }, [volume]);

    return { playSound };
};
