<script lang="ts">
  import Dialog from '$lib/components/Dialog.svelte';
  import Button from '$lib/components/Button.svelte';

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

<Dialog bind:isOpen>
  <!-- Header -->
  <div class="bg-slate-50 p-6 pb-4 flex flex-col justify-center border-b border-slate-200">
    <div class="text-xs text-slate-600 font-medium tracking-wide mb-4">
      {mode === 'hours' ? 'Select hour' : 'Select minute'}
    </div>
    <div class="flex items-center justify-center space-x-2">
      <button 
        class="flex items-center justify-center w-24 h-20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 border {mode === 'hours' ? 'bg-cyan-100 text-cyan-900 border-cyan-200' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}"
        onclick={() => mode = 'hours'}
      >
        <span class="text-5xl font-normal tracking-tighter">{hour.toString().padStart(2, '0')}</span>
      </button>
      <span class="text-4xl text-slate-400 font-light mb-1 opacity-80">:</span>
      <button 
        class="flex items-center justify-center w-24 h-20 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 border {mode === 'minutes' ? 'bg-cyan-100 text-cyan-900 border-cyan-200' : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'}"
        onclick={() => mode = 'minutes'}
      >
        <span class="text-5xl font-normal tracking-tighter">{minute.toString().padStart(2, '0')}</span>
      </button>
      
      <div class="flex flex-col h-20 rounded-xl overflow-hidden border border-slate-300 ml-2 shadow-sm bg-white">
        <button 
          class="flex-1 px-3 text-sm font-medium focus:outline-none transition-colors {period === 'AM' ? 'bg-cyan-100 text-cyan-900' : 'bg-transparent text-slate-600 hover:bg-slate-50'}"
          onclick={() => period = 'AM'}
        >
          AM
        </button>
        <div class="h-[1px] bg-slate-300"></div>
        <button 
          class="flex-1 px-3 text-sm font-medium focus:outline-none transition-colors {period === 'PM' ? 'bg-cyan-100 text-cyan-900' : 'bg-transparent text-slate-600 hover:bg-slate-50'}"
          onclick={() => period = 'PM'}
        >
          PM
        </button>
      </div>
    </div>
  </div>
  
  <!-- Dial -->
  <div class="p-6 flex justify-center items-center select-none bg-white">
    <div 
      bind:this={dialRef}
      role="slider"
      tabindex="0"
      class="relative w-64 h-64 bg-slate-100 rounded-full cursor-pointer touch-none shadow-inner border border-slate-200"
      onpointerdown={onPointerDown}
      onpointermove={onPointerMove}
      onpointerup={onPointerUp}
    >
      <!-- Center dot -->
      <div class="absolute w-2 h-2 bg-cyan-500 rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"></div>
      
      <!-- Hand -->
      <div 
        class="absolute left-1/2 top-1/2 w-0.5 origin-bottom bg-cyan-500 z-10 transition-transform duration-100 ease-out flex flex-col justify-between items-center"
        style="height: 104px; transform: translate(-50%, -100%) rotate({currentAngle}deg);"
      >
        <!-- Hand knob -->
        <div class="w-10 h-10 rounded-full bg-cyan-500 shadow-md -translate-y-5 flex items-center justify-center">
          <div class="w-1 h-1 bg-white rounded-full"></div>
        </div>
      </div>
      
      <!-- Numbers -->
      {#if mode === 'hours'}
        {#each hours as h, i}
          <div 
            class="absolute text-sm font-medium w-10 h-10 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 {hour === h ? 'text-white z-30' : 'text-slate-900 z-20'}"
            style="left: {50 + 40 * Math.sin(i * 30 * Math.PI / 180)}%; top: {50 - 40 * Math.cos(i * 30 * Math.PI / 180)}%; pointer-events: none;"
          >
            {h}
          </div>
        {/each}
      {:else}
        {#each minutes as m, i}
          <div 
            class="absolute text-sm font-medium w-10 h-10 flex items-center justify-center rounded-full -translate-x-1/2 -translate-y-1/2 transition-colors duration-200 {minute === m ? 'text-white z-30' : 'text-slate-900 z-20'}"
            style="left: {50 + 40 * Math.sin(i * 30 * Math.PI / 180)}%; top: {50 - 40 * Math.cos(i * 30 * Math.PI / 180)}%; pointer-events: none;"
          >
            {m.toString().padStart(2, '0')}
          </div>
        {/each}
      {/if}
    </div>
  </div>
  
  <!-- Actions -->
  <div class="flex justify-end items-center p-4 gap-2 bg-white">
    <Button variant="text" onclick={handleCancel}>Cancel</Button>
    <Button variant="text" onclick={handleOk}>OK</Button>
  </div>
</Dialog>
