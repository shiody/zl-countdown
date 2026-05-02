<script lang="ts">
  let targetDateStr = $state("");
  let errorMessage = $state("");
  
  let days = $state("00");
  let hours = $state("00");
  let mins = $state("00");
  let secs = $state("00");
  
  let now = new Date();
  // format for datetime-local: YYYY-MM-DDThh:mm
  let minDate = new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
  
  $effect(() => {
    if (!targetDateStr) {
      days = "00"; hours = "00"; mins = "00"; secs = "00";
      errorMessage = "";
      return;
    }
    
    // Check initially
    const checkTime = () => {
      const target = new Date(targetDateStr).getTime();
      const current = new Date().getTime();
      const diff = target - current;
      
      if (diff <= 0) {
        days = "00"; hours = "00"; mins = "00"; secs = "00";
        errorMessage = "Selected time has already passed!";
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
</script>

<div class="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center font-sans p-4">
  <div class="text-center p-8 sm:p-12 bg-slate-900 rounded-3xl shadow-2xl border border-slate-800 max-w-2xl w-full">
    <h1 class="text-4xl sm:text-5xl font-extrabold mb-4 bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent">
      Countdown
    </h1>
    <p class="text-lg sm:text-xl text-slate-300 mb-8">Ready to build something amazing.</p>
    
    <div class="mb-8 relative z-10">
      <label for="target-date" class="block text-sm font-medium text-slate-400 mb-2">Select Target Time:</label>
      <input 
        type="datetime-local" 
        id="target-date" 
        bind:value={targetDateStr}
        min={minDate}
        class="bg-slate-950 border border-slate-700 text-white text-sm rounded-lg focus:ring-cyan-500 focus:border-cyan-500 block w-full p-2.5 max-w-xs mx-auto text-center"
      />
      {#if errorMessage}
        <p class="text-red-400 text-sm mt-3 animate-pulse">{errorMessage}</p>
      {/if}
    </div>

    <div class="flex flex-wrap gap-3 sm:gap-4 justify-center text-3xl sm:text-4xl font-mono text-cyan-300 font-bold">
      <div class="bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-inner min-w-[80px] sm:min-w-[100px] border border-slate-800">
        {days}<span class="text-xs sm:text-sm block text-slate-500 uppercase mt-2 font-sans tracking-widest font-semibold">Days</span>
      </div>
      <span class="py-4 text-slate-700 hidden sm:block">:</span>
      <div class="bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-inner min-w-[80px] sm:min-w-[100px] border border-slate-800">
        {hours}<span class="text-xs sm:text-sm block text-slate-500 uppercase mt-2 font-sans tracking-widest font-semibold">Hours</span>
      </div>
      <span class="py-4 text-slate-700 hidden sm:block">:</span>
      <div class="bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-inner min-w-[80px] sm:min-w-[100px] border border-slate-800">
        {mins}<span class="text-xs sm:text-sm block text-slate-500 uppercase mt-2 font-sans tracking-widest font-semibold">Mins</span>
      </div>
      <span class="py-4 text-slate-700 hidden sm:block">:</span>
      <div class="bg-slate-950 px-4 py-3 sm:px-6 sm:py-4 rounded-xl shadow-inner min-w-[80px] sm:min-w-[100px] border border-slate-800">
        {secs}<span class="text-xs sm:text-sm block text-slate-500 uppercase mt-2 font-sans tracking-widest font-semibold">Secs</span>
      </div>
    </div>
  </div>
</div>
