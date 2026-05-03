<script lang="ts">
  import TimePicker from '$lib/components/TimePicker.svelte';

  let showTimePicker = $state(false);
  let targetTime = $state<{ hour: number, minute: number } | null>(null);
  let errorMessage = $state("");
  
  let days = $state("00");
  let hours = $state("00");
  let mins = $state("00");
  let secs = $state("00");
  
  $effect(() => {
    if (!targetTime) {
      days = "00"; hours = "00"; mins = "00"; secs = "00";
      errorMessage = "";
      return;
    }
    
    // Check initially
    const checkTime = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetTime!.hour, targetTime!.minute, 0, 0);
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        days = "00"; hours = "00"; mins = "00"; secs = "00";
        errorMessage = "Selected time has already passed today!";
        return false;
      } else {
        errorMessage = "";
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        days = d.toString().padStart(2, '0');
        hours = h.toString().padStart(2, '0');
        mins = m.toString().padStart(2, '0');
        secs = s.toString().padStart(2, '0');
        return true;
      }
    };

    if (!checkTime()) return;

    let interval = setInterval(() => {
      if (!checkTime()) {
        clearInterval(interval);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  });
  
  function formatTime(t: { hour: number, minute: number } | null) {
    if (!t) return "Select Time";
    let h = t.hour % 12 || 12;
    let m = t.minute.toString().padStart(2, '0');
    let p = t.hour >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${p}`;
  }
</script>

<div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
  <!-- Dynamic background glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-900/20 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="text-center p-8 sm:p-12 bg-slate-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-800 max-w-2xl w-full z-10 relative">
    <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
      Countdown
    </h1>
    <p class="text-lg sm:text-xl text-slate-400 mb-10 font-light">Set your target for today.</p>
    
    <div class="mb-12">
      <button 
        onclick={() => showTimePicker = true}
        class="bg-slate-800 hover:bg-slate-750 border border-slate-600 hover:border-cyan-500/50 text-white text-xl sm:text-2xl font-mono py-4 px-8 rounded-2xl transition-all shadow-lg hover:shadow-cyan-900/20 flex items-center justify-center mx-auto min-w-[200px] group"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-3 text-cyan-400 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {formatTime(targetTime)}
      </button>
      {#if errorMessage}
        <p class="text-rose-400 text-sm mt-4 animate-pulse font-medium bg-rose-500/10 inline-block px-4 py-1.5 rounded-full">{errorMessage}</p>
      {/if}
    </div>

    <div class="flex flex-wrap gap-3 sm:gap-4 justify-center text-3xl sm:text-4xl font-mono text-white font-bold">
      <div class="bg-slate-950/50 px-4 py-3 sm:px-6 sm:py-5 rounded-2xl shadow-inner min-w-[80px] sm:min-w-[110px] border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {days}<span class="text-xs sm:text-sm block text-cyan-500 uppercase mt-2 font-sans tracking-widest font-semibold">Days</span>
      </div>
      <span class="py-5 text-slate-600 hidden sm:block">:</span>
      <div class="bg-slate-950/50 px-4 py-3 sm:px-6 sm:py-5 rounded-2xl shadow-inner min-w-[80px] sm:min-w-[110px] border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {hours}<span class="text-xs sm:text-sm block text-cyan-500 uppercase mt-2 font-sans tracking-widest font-semibold">Hours</span>
      </div>
      <span class="py-5 text-slate-600 hidden sm:block">:</span>
      <div class="bg-slate-950/50 px-4 py-3 sm:px-6 sm:py-5 rounded-2xl shadow-inner min-w-[80px] sm:min-w-[110px] border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {mins}<span class="text-xs sm:text-sm block text-cyan-500 uppercase mt-2 font-sans tracking-widest font-semibold">Mins</span>
      </div>
      <span class="py-5 text-slate-600 hidden sm:block">:</span>
      <div class="bg-slate-950/50 px-4 py-3 sm:px-6 sm:py-5 rounded-2xl shadow-inner min-w-[80px] sm:min-w-[110px] border border-slate-800 backdrop-blur-sm relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        {secs}<span class="text-xs sm:text-sm block text-cyan-500 uppercase mt-2 font-sans tracking-widest font-semibold">Secs</span>
      </div>
    </div>
  </div>
</div>

<TimePicker bind:isOpen={showTimePicker} onTimeSelect={(time: { hour: number, minute: number }) => targetTime = time} />
