let audioCtx: AudioContext | null = null;

export function initAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq: number, type: OscillatorType, duration: number, startTime: number) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTime);
  
  // Envelope
  gain.gain.setValueAtTime(0, audioCtx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(0.3, audioCtx.currentTime + startTime + 0.05);
  gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + startTime + duration);
  
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  
  osc.start(audioCtx.currentTime + startTime);
  osc.stop(audioCtx.currentTime + startTime + duration);
}

// T-10m: Soft double-chime (sine waves, perfect fifth)
export function play10mSound() {
  initAudio();
  playTone(440, 'sine', 0.5, 0); // A4
  playTone(659.25, 'sine', 0.8, 0.4); // E5
}

// T-5m: slightly more urgent triple-chime or ascending chord
export function play5mSound() {
  initAudio();
  playTone(523.25, 'triangle', 0.4, 0); // C5
  playTone(659.25, 'triangle', 0.4, 0.2); // E5
  playTone(783.99, 'triangle', 0.8, 0.4); // G5
}

// T-0: Continuous ringing or strong repeating alarm
export function play0mSound() {
  initAudio();
  // Play a sequence of 4 quick beeps, pause, and repeat twice
  for (let repeat = 0; repeat < 3; repeat++) {
    const offset = repeat * 1.5;
    for (let i = 0; i < 4; i++) {
      playTone(880, 'square', 0.2, offset + i * 0.25); // A5
    }
  }
}
