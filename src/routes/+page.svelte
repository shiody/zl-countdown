<script lang="ts">
  import TimePicker from '$lib/components/TimePicker.svelte';
  import Button from '$lib/components/Button.svelte';
  import Card from '$lib/components/Card.svelte';
  import ProgressIndicator from '$lib/components/ProgressIndicator.svelte';

  let showTimePicker = $state(false);
  let targetTime = $state<{ hour: number, minute: number } | null>(null);
  let errorMessage = $state("");
  let isChecking = $state(false); // For showing progress indicator briefly
  
  let hours = $state("00");
  let mins = $state("00");
  let secs = $state("00");
  
  $effect(() => {
    if (!targetTime) {
      hours = "00"; mins = "00"; secs = "00";
      errorMessage = "";
      return;
    }
    
    // Check initially
    const checkTime = () => {
      const now = new Date();
      const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), targetTime!.hour, targetTime!.minute, 0, 0);
      const diff = target.getTime() - now.getTime();
      
      if (diff <= 0) {
        hours = "00"; mins = "00"; secs = "00";
        errorMessage = "Selected time has already passed today!";
        return false;
      } else {
        errorMessage = "";
        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);
        
        hours = h.toString().padStart(2, '0');
        mins = m.toString().padStart(2, '0');
        secs = s.toString().padStart(2, '0');
        return true;
      }
    };

    isChecking = true;
    setTimeout(() => {
      isChecking = false;
      if (!checkTime()) return;

      let interval = setInterval(() => {
        if (!checkTime()) {
          clearInterval(interval);
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }, 400); // Simulate brief loading
  });
  
  function formatTime(t: { hour: number, minute: number } | null) {
    if (!t) return "Select Target Time";
    let h = t.hour % 12 || 12;
    let m = t.minute.toString().padStart(2, '0');
    let p = t.hour >= 12 ? 'PM' : 'AM';
    return `${h}:${m} ${p}`;
  }
</script>

<div class="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center font-sans p-4 relative overflow-hidden">
  <!-- Dynamic background glow -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-400/20 rounded-full blur-[120px] pointer-events-none"></div>

  <div class="max-w-xl w-full z-10 relative flex flex-col items-center">
    <h1 class="text-4xl sm:text-5xl font-medium mb-10 text-slate-900">
      Countdown Focus
    </h1>
    
    <Card class="w-full p-8 sm:p-12 flex flex-col items-center shadow-lg bg-white/80 backdrop-blur-md">
      <div class="mb-10 w-full flex flex-col items-center">
        <Button 
          variant={targetTime ? 'tonal' : 'filled'} 
          onclick={() => showTimePicker = true}
          class="min-w-[200px] h-14 text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {formatTime(targetTime)}
        </Button>
        {#if errorMessage}
          <p class="text-rose-600 text-sm mt-4 font-medium">{errorMessage}</p>
        {/if}
      </div>

      {#if isChecking}
        <div class="h-[120px] flex items-center justify-center">
          <ProgressIndicator size={48} />
        </div>
      {:else}
        <div class="flex gap-4 sm:gap-6 justify-center text-4xl sm:text-6xl font-normal text-cyan-700 tracking-tight">
          <div class="flex flex-col items-center w-20 sm:w-24 bg-slate-50/80 rounded-2xl py-4 border border-slate-200">
            {hours}
            <span class="text-xs sm:text-sm text-slate-500 uppercase mt-3 font-medium tracking-widest text-center">Hours</span>
          </div>
          <span class="py-6 text-slate-400 font-light">:</span>
          <div class="flex flex-col items-center w-20 sm:w-24 bg-slate-50/80 rounded-2xl py-4 border border-slate-200">
            {mins}
            <span class="text-xs sm:text-sm text-slate-500 uppercase mt-3 font-medium tracking-widest text-center">Mins</span>
          </div>
          <span class="py-6 text-slate-400 font-light">:</span>
          <div class="flex flex-col items-center w-20 sm:w-24 bg-slate-50/80 rounded-2xl py-4 border border-slate-200">
            {secs}
            <span class="text-xs sm:text-sm text-slate-500 uppercase mt-3 font-medium tracking-widest text-center">Secs</span>
          </div>
        </div>
      {/if}
    </Card>
  </div>
</div>

<TimePicker bind:isOpen={showTimePicker} onTimeSelect={(time: { hour: number, minute: number }) => targetTime = time} />
