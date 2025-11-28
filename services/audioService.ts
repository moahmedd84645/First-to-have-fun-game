// Simple synthesizer using Web Audio API to avoid external asset dependencies
const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();

export const playSound = (type: 'correct' | 'wrong' | 'click' | 'win') => {
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  if (type === 'correct') {
    // Pleasant chime (Major triad)
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(523.25, now); // C5
    oscillator.frequency.setValueAtTime(659.25, now + 0.1); // E5
    oscillator.frequency.setValueAtTime(783.99, now + 0.2); // G5
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
    oscillator.start(now);
    oscillator.stop(now + 0.6);
  } else if (type === 'wrong') {
    // Low buzzer
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(150, now);
    oscillator.frequency.linearRampToValueAtTime(100, now + 0.3);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
    oscillator.start(now);
    oscillator.stop(now + 0.3);
  } else if (type === 'click') {
    // Short high blip
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, now);
    gainNode.gain.setValueAtTime(0.1, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
    oscillator.start(now);
    oscillator.stop(now + 0.1);
  } else if (type === 'win') {
    // Victory sequence
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(523.25, now);
    oscillator.frequency.setValueAtTime(659.25, now + 0.15);
    oscillator.frequency.setValueAtTime(783.99, now + 0.30);
    oscillator.frequency.setValueAtTime(1046.50, now + 0.45);
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.linearRampToValueAtTime(0, now + 1.5);
    oscillator.start(now);
    oscillator.stop(now + 1.5);
  }
};