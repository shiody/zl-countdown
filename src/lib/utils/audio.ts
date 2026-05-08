// Audio Utility for playing customizable MP3 files

export function initAudio() {
  // Preload or initialize user interactions
}

export function play10mSound() {
  const audio = new Audio('/audio/10m.mp3');
  audio.play().catch(e => {
    console.warn('Failed to play T-10m sound. Ensure /static/audio/10m.mp3 exists.', e);
  });
}

export function play5mSound(onEnded?: () => void) {
  const audio = new Audio('/audio/5m.mp3');
  if (onEnded) {
    audio.addEventListener('ended', onEnded);
  }
  audio.play().catch(e => {
    console.warn('Failed to play T-5m sound. Ensure /static/audio/5m.mp3 exists.', e);
    // If it fails to play, still trigger the callback so BGM can start
    if (onEnded) onEnded();
  });
}

export function play0mSound() {
  const audio = new Audio('/audio/0m.mp3');
  audio.play().catch(e => {
    console.warn('Failed to play T-0m sound. Ensure /static/audio/0m.mp3 exists.', e);
  });
}

let bgmAudio: HTMLAudioElement | null = null;

export function startBgm() {
  if (!bgmAudio) {
    bgmAudio = new Audio('/audio/bgm.mp3');
    bgmAudio.loop = true;
    bgmAudio.volume = 0.5; // 50% volume
  }
  bgmAudio.play().catch(e => {
    console.warn('Failed to play BGM. Ensure /static/audio/bgm.mp3 exists.', e);
  });
}

export function stopBgm() {
  if (bgmAudio) {
    bgmAudio.pause();
    bgmAudio.currentTime = 0;
  }
}

export function toggleBgm(): boolean {
  if (!bgmAudio) return false;
  if (bgmAudio.paused) {
    bgmAudio.play().catch(e => console.warn('BGM play failed', e));
    return true;
  } else {
    bgmAudio.pause();
    return false;
  }
}
