<script lang="ts">
  import TimePicker from '$lib/components/TimePicker.svelte';
  import Button from '$lib/components/Button.svelte';
  import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';
  import { initAudio, play10mSound, play5mSound, play0mSound, startBgm, stopBgm, toggleBgm } from '$lib/utils/audio';

  let showTimePicker = $state(false);
  let targetTime = $state<{ hour: number, minute: number } | null>(null);
  let targetDate = $state<Date | null>(null);
  let errorMessage = $state("");
  
  let isPaused = $state(false);
  let pausedAt = $state<Date | null>(null);
  let totalDuration = $state(1); // avoid div by 0
  
  let hours = $state("00");
  let mins = $state("00");
  let secs = $state("00");
  let progress = $state(0);
  
  let hasPlayed10m = $state(false);
  let hasPlayed5m = $state(false);
  let hasPlayed0m = $state(false);
  let isBgmPlaying = $state(false);
  let isFullscreen = $state(false);
  
  $effect(() => {
    const handleFsChange = () => {
      isFullscreen = !!document.fullscreenElement;
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  });
  
  $effect(() => {
    if (!targetDate) {
      hours = "00"; mins = "00"; secs = "00"; progress = 0;
      return;
    }
    
    if (isPaused) return;
    
    const tick = () => {
      const now = new Date().getTime();
      const timeRemaining = targetDate!.getTime() - now;
      
      const tenMinutesMs = 10 * 60 * 1000;
      const fiveMinutesMs = 5 * 60 * 1000;
      
      if (timeRemaining <= tenMinutesMs && timeRemaining > fiveMinutesMs && !hasPlayed10m) {
        play10mSound();
        hasPlayed10m = true;
      }
      
      if (timeRemaining <= fiveMinutesMs && timeRemaining > 0 && !hasPlayed5m) {
        hasPlayed5m = true;
        play5mSound(() => {
          startBgm();
          isBgmPlaying = true;
        });
      }
      
      if (timeRemaining <= 0) {
        if (!hasPlayed0m) {
          play0mSound();
          hasPlayed0m = true;
        }
        hours = "00"; mins = "00"; secs = "00"; progress = 100;
        targetDate = null; // Finished
        return;
      }
      
      const h = Math.floor(timeRemaining / (1000 * 60 * 60));
      const m = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((timeRemaining % (1000 * 60)) / 1000);
      
      hours = h.toString().padStart(2, '0');
      mins = m.toString().padStart(2, '0');
      secs = s.toString().padStart(2, '0');
      
      progress = 100 - Math.max(0, Math.min(100, (timeRemaining / totalDuration) * 100));
    };
    
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  });

  function handleTimeSelect(t: { hour: number, minute: number }) {
    targetTime = t;
    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), t.hour, t.minute, 0, 0);
    
    if (target.getTime() <= now.getTime()) {
      errorMessage = "Selected time has already passed today!";
      targetDate = null;
    } else {
      errorMessage = "";
      targetDate = target;
      totalDuration = target.getTime() - now.getTime();
      isPaused = false;
      pausedAt = null;
      
      // If duration is already less than 10m/5m, don't instantly fire sounds
      hasPlayed10m = totalDuration <= 10 * 60 * 1000;
      hasPlayed5m = totalDuration <= 5 * 60 * 1000;
      hasPlayed0m = false;
      
      initAudio();
    }
  }

  function togglePause() {
    if (!targetDate) return;
    if (isPaused) {
      // Resume
      const pausedDuration = new Date().getTime() - pausedAt!.getTime();
      targetDate = new Date(targetDate.getTime() + pausedDuration);
      pausedAt = null;
      isPaused = false;
    } else {
      // Pause
      pausedAt = new Date();
      isPaused = true;
    }
  }

  function handleBgmToggle() {
    isBgmPlaying = toggleBgm();
  }

  function handleStop() {
    targetDate = null;
    targetTime = null;
    isPaused = false;
    errorMessage = "";
    stopBgm();
    isBgmPlaying = false;
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.warn(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  function handleRestart() {
    if (targetTime) {
      handleTimeSelect(targetTime);
    }
  }
</script>

<!-- Ambient Background -->
<div class="fixed inset-0 z-0 bg-[url('/images/bg.jpg')] bg-cover bg-center">
  <div class="absolute inset-0 bg-white/40 backdrop-blur-xl"></div>
</div>

<div class="min-h-screen text-slate-900 flex flex-col font-sans relative z-10">
  
  <!-- Top Bar -->
  <header class="w-full p-8 flex justify-between items-center">
    <div class="text-xl font-bold tracking-tight text-slate-800">Zhen Li Seventh-day Adventist Church</div>
    <div class="flex items-center space-x-2 text-slate-700">
      <button class="p-2 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none" onclick={toggleFullscreen} aria-label="Toggle Fullscreen">
        {#if isFullscreen}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14h-5v5h5v-5zm0-10h-5v5h5v-5zm10 10h-5v5h5v-5zm0-10h-5v5h5v-5z" />
          </svg>
        {:else}
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        {/if}
      </button>
      <button class="p-2 hover:bg-slate-200/50 rounded-full transition-colors focus:outline-none" aria-label="Settings">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </button>
    </div>
  </header>

  <!-- Center Timer Area -->
  <main class="flex-1 flex flex-col items-center justify-center p-4">
    {#if errorMessage}
      <div class="absolute top-24 bg-rose-100 text-rose-700 px-6 py-2 rounded-full font-medium shadow-sm">
        {errorMessage}
      </div>
    {/if}
    
    <div class="text-xs uppercase tracking-[0.3em] font-semibold text-slate-600 mb-8">
      Diskusi Sekolah Sabat
    </div>
    
    <div class="flex items-baseline justify-center text-[10rem] sm:text-[12rem] font-light leading-none tracking-tighter text-slate-900 tabular-nums">
      <span>{hours}</span>
      <span class="text-6xl sm:text-8xl mx-2 sm:mx-6 pb-4 sm:pb-8 opacity-80 font-normal">:</span>
      <span>{mins}</span>
      <span class="text-6xl sm:text-8xl mx-2 sm:mx-6 pb-4 sm:pb-8 opacity-80 font-normal">:</span>
      <span>{secs}</span>
    </div>
    
    <div class="flex justify-between w-[500px] max-w-full px-12 mt-4 text-xs font-medium text-slate-500 tracking-[0.2em]">
      <span class="w-24 text-center">H</span>
      <span class="w-24 text-center">M</span>
      <span class="w-24 text-center">S</span>
    </div>
    
    <div class="w-[300px] mt-12 opacity-80">
      <ProgressIndicator variant="linear" value={targetDate ? progress : 0} strokeWidth={4} />
    </div>
  </main>

  <!-- Bottom Control Bar -->
  <div class="w-full pb-20 flex justify-center mt-auto">
    <div class="bg-white/60 backdrop-blur-md shadow-lg border border-white/50 rounded-full p-2 flex items-center space-x-2">
      <!-- Set Time Button -->
      <Button variant="text" class="text-slate-700 hover:bg-slate-200/50 h-12 px-6" onclick={() => showTimePicker = true}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        SET TIME
      </Button>
      
      <!-- Divider -->
      <div class="w-px h-8 bg-slate-300 mx-2"></div>
      
      <!-- Restart -->
      <Button variant="text" icon={true} class="text-slate-600 hover:bg-slate-200/50" onclick={handleRestart}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
        </svg>
      </Button>
      
      <!-- Pause / Resume -->
      <Button variant="filled" class="bg-slate-900 text-white hover:bg-slate-800 h-12 px-8 min-w-[120px]" onclick={togglePause}>
        {#if isPaused || !targetDate}
          <!-- Play Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
          </svg>
          {targetDate ? 'Resume' : 'Start'}
        {:else}
          <!-- Pause Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Pause
        {/if}
      </Button>
      
      <!-- BGM Toggle -->
      <Button variant="text" icon={true} class="text-slate-600 hover:bg-slate-200/50" onclick={handleBgmToggle} aria-label="Toggle Background Music">
        {#if isBgmPlaying}
          <!-- Music Note icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        {:else}
          <!-- Music Note Off icon -->
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            <line x1="4" y1="4" x2="20" y2="20" stroke-width="2" stroke-linecap="round" />
          </svg>
        {/if}
      </Button>
      
      <!-- Stop -->
      <Button variant="text" icon={true} class="text-slate-600 hover:bg-slate-200/50" onclick={handleStop}>
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10h6v4H9z" />
        </svg>
      </Button>
    </div>
  </div>

  <!-- Footer -->
  <footer class="absolute bottom-6 w-full text-center text-xs font-semibold text-slate-800 drop-shadow-md z-10 flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
    <span>Made with <span class="text-rose-600 text-sm">♥</span> by Zhen Li Communication Department</span>
  </footer>
</div>

<TimePicker bind:isOpen={showTimePicker} onTimeSelect={handleTimeSelect} />
