// Audio Utility for playing customizable MP3 files

export function initAudio() {
  // We can optionally preload the Audio objects here if we want,
  // but creating new Audio instances on play is usually fine and 
  // guarantees we don't hold stale references. 
  // The browser will cache the MP3s.
}

export function play10mSound() {
  const audio = new Audio('/audio/10m.mp3');
  audio.play().catch(e => {
    console.warn('Failed to play T-10m sound. Ensure /static/audio/10m.mp3 exists.', e);
  });
}

export function play5mSound() {
  const audio = new Audio('/audio/5m.mp3');
  audio.play().catch(e => {
    console.warn('Failed to play T-5m sound. Ensure /static/audio/5m.mp3 exists.', e);
  });
}

export function play0mSound() {
  const audio = new Audio('/audio/0m.mp3');
  audio.play().catch(e => {
    console.warn('Failed to play T-0m sound. Ensure /static/audio/0m.mp3 exists.', e);
  });
}
