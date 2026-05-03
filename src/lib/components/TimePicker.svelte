<script lang="ts">
  let { isOpen = $bindable(false), onTimeSelect } = $props();

  let mode = $state<'hours' | 'minutes'>('hours');
  let period = $state<'AM' | 'PM'>('AM');
  let hour = $state(12);
  let minute = $state(0);
  
  let dialRef: HTMLDivElement | undefined = $state();
  let isDragging = $state(false);

  // Initialize time
  $effect(() => {
    if (isOpen) {
      const now = new Date();
      let h = now.getHours();
      period = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      hour = h;
      minute = Math.round(now.getMinutes() / 5) * 5 % 60; // Snap to nearest 5 for initial view
      mode = 'hours';
    }
  });

  const hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const minutes = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  function getAngle(x: number, y: number) {
    if (!dialRef) return 0;
    const rect = dialRef.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    let angle = Math.atan2(y - cy, x - cx) * (180 / Math.PI) + 90;
    if (angle < 0) angle += 360;
    return angle;
  }

  function handleInteraction(clientX: number, clientY: number) {
    const angle = getAngle(clientX, clientY);
    if (mode === 'hours') {
      let h = Math.round(angle / 30);
      if (h === 0) h = 12;
      hour = h;
    } else {
      let m = Math.round(angle / 6);
      if (m === 60) m = 0;
      minute = m;
    }
  }

  function onPointerDown(e: PointerEvent) {
    if (!dialRef) return;
    isDragging = true;
    dialRef.setPointerCapture(e.pointerId);
    handleInteraction(e.clientX, e.clientY);
  }

  function onPointerMove(e: PointerEvent) {
    if (isDragging) {
      handleInteraction(e.clientX, e.clientY);
    }
  }

  function onPointerUp(e: PointerEvent) {
    if (isDragging) {
      isDragging = false;
      if (dialRef) dialRef.releasePointerCapture(e.pointerId);
      if (mode === 'hours') {
        mode = 'minutes';
      }
    }
  }
  
  function handleCancel() {
    isOpen = false;
  }
  
  function handleOk() {
    let finalHour = hour;
    if (period === 'PM' && finalHour < 12) finalHour += 12;
    if (period === 'AM' && finalHour === 12) finalHour = 0;
    
    if (onTimeSelect) {
      onTimeSelect({ hour: finalHour, minute });
    }
    isOpen = false;
  }
  
  let currentAngle = $derived(mode === 'hours' ? hour * 30 : minute * 6);
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm transition-opacity">
  <div class="bg-slate-800 rounded-3xl shadow-2xl max-w-[320px] w-full overflow-hidden flex flex-col font-sans border border-slate-700 pointer-events-auto select-none">
    <!-- Header -->
    <div class="bg-slate-750 p-6 pb-4 flex items-end justify-between border-b border-slate-700 bg-slate-800/50">
      <div class="flex items-baseline space-x-1">
        <button 
          class="text-6xl font-medium tracking-tighter transition-colors focus:outline-none {mode === 'hours' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}"
          onclick={() => mode = 'hours'}
        >
          {hour.toString().padStart(2, '0')}
        </button>
        <span class="text-5xl text-slate-500 font-light mb-1 opacity-50">:</span>
        <button 
          class="text-6xl font-medium tracking-tighter transition-colors focus:outline-none {mode === 'minutes' ? 'text-white' : 'text-slate-500 hover:text-slate-300'}"
          onclick={() => mode = 'minutes'}
        >
          {minute.toString().padStart(2, '0')}
        </button>
      </div>
      
      <div class="flex flex-col rounded-xl overflow-hidden border border-slate-600 ml-4 mb-2 shadow-inner">
        <button 
          class="px-3 py-2 text-sm font-bold focus:outline-none transition-colors {period === 'AM' ? 'bg-cyan-900/60 text-cyan-400' : 'bg-transparent text-slate-400 hover:bg-slate-700'}"
          onclick={() => period = 'AM'}
        >
          AM
        </button>
        <div class="h-px bg-slate-600"></div>
        <button 
          class="px-3 py-2 text-sm font-bold focus:outline-none transition-colors {period === 'PM' ? 'bg-cyan-900/60 text-cyan-400' : 'bg-transparent text-slate-400 hover:bg-slate-700'}"
          onclick={() => period = 'PM'}
        >
          PM
        </button>
      </div>
    </div>
    
    <!-- Dial -->
    <div class="p-6 flex justify-center items-center select-none bg-slate-800">
      <div 
        bind:this={dialRef}
        class="relative w-64 h-64 bg-slate-900 rounded-full cursor-pointer touch-none shadow-[inset_0_4px_12px_rgba(0,0,0,0.5)] border border-slate-700/50"
        onpointerdown={onPointerDown}
        onpointermove={onPointerMove}
        onpointerup={onPointerUp}
      >
        <!-- Center dot -->
        <div class="absolute w-2.5 h-2.5 bg-cyan-400 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></div>
        
        <!-- Hand -->
        <div 
          class="absolute left-1/2 top-1/2 w-[3px] origin-bottom bg-cyan-400 z-10 transition-transform duration-100 ease-out flex flex-col justify-between items-center"
          style="height: 102px; transform: translate(-50%, -100%) rotate({currentAngle}deg);"
        >
          <!-- Hand knob -->
          <div class="w-10 h-10 rounded-full bg-cyan-500/90 shadow-[0_0_15px_rgba(34,211,238,0.4)] border border-cyan-300 backdrop-blur-sm -translate-y-5 flex items-center justify-center">
            <div class="w-1 h-1 bg-white rounded-full opacity-50"></div>
          </div>
        </div>
        
        <!-- Numbers -->
        {#if mode === 'hours'}
          {#each hours as h, i}
            <div 
              class="absolute text-base font-semibold w-10 h-10 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 {hour === h ? 'text-white z-30' : 'text-slate-300 z-20'}"
              style="left: {50 + 40 * Math.sin(i * 30 * Math.PI / 180)}%; top: {50 - 40 * Math.cos(i * 30 * Math.PI / 180)}%; pointer-events: none;"
            >
              {h}
            </div>
          {/each}
        {:else}
          {#each minutes as m, i}
            <div 
              class="absolute text-base font-semibold w-10 h-10 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 {minute === m ? 'text-white z-30' : 'text-slate-300 z-20'}"
              style="left: {50 + 40 * Math.sin(i * 30 * Math.PI / 180)}%; top: {50 - 40 * Math.cos(i * 30 * Math.PI / 180)}%; pointer-events: none;"
            >
              {m.toString().padStart(2, '0')}
            </div>
          {/each}
        {/if}
      </div>
    </div>
    
    <!-- Actions -->
    <div class="flex justify-between items-center p-4 pt-2 bg-slate-800">
      <div class="text-xs text-slate-500 pl-2 font-medium tracking-wide">
        {mode === 'hours' ? 'SELECT HOUR' : 'SELECT MINUTE'}
      </div>
      <div class="flex gap-2">
        <button 
          class="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-700/50 font-semibold tracking-wide transition-colors focus:outline-none text-sm"
          onclick={handleCancel}
        >
          CANCEL
        </button>
        <button 
          class="px-4 py-2 rounded-lg text-cyan-400 hover:text-cyan-300 hover:bg-cyan-900/30 font-semibold tracking-wide transition-colors focus:outline-none text-sm"
          onclick={handleOk}
        >
          OK
        </button>
      </div>
    </div>
  </div>
</div>
{/if}
