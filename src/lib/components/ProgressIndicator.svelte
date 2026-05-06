<script lang="ts">
  let { 
    variant = 'circular',
    value = undefined, 
    size = 40, 
    strokeWidth = 4, 
    class: className = '' 
  }: { 
    variant?: 'circular' | 'linear',
    value?: number, 
    size?: number, 
    strokeWidth?: number, 
    class?: string 
  } = $props();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = $derived(value !== undefined ? circumference - (value / 100) * circumference : 0);
</script>

{#if variant === 'circular'}
  <div class="relative inline-flex {className}" style="width: {size}px; height: {size}px;">
    {#if value === undefined}
      <!-- Indeterminate -->
      <svg class="animate-spin text-cyan-600 w-full h-full" viewBox="0 0 {size} {size}">
        <circle class="opacity-25" cx="{size/2}" cy="{size/2}" r="{radius}" stroke="currentColor" stroke-width="{strokeWidth}" fill="none"></circle>
        <circle class="opacity-75" cx="{size/2}" cy="{size/2}" r="{radius}" stroke="currentColor" stroke-width="{strokeWidth}" fill="none" stroke-dasharray="{circumference * 0.7} {circumference * 0.3}" stroke-linecap="round"></circle>
      </svg>
    {:else}
      <!-- Determinate -->
      <svg class="text-cyan-600 w-full h-full -rotate-90 transition-all duration-300 ease-out" viewBox="0 0 {size} {size}">
        <circle class="text-slate-200" cx="{size/2}" cy="{size/2}" r="{radius}" stroke="currentColor" stroke-width="{strokeWidth}" fill="none"></circle>
        <circle class="text-cyan-600 transition-all duration-300 ease-out" cx="{size/2}" cy="{size/2}" r="{radius}" stroke="currentColor" stroke-width="{strokeWidth}" fill="none" stroke-dasharray="{circumference}" stroke-dashoffset="{strokeDashoffset}" stroke-linecap="round"></circle>
      </svg>
    {/if}
  </div>
{:else}
  <!-- Linear -->
  <div class="w-full bg-slate-200 rounded-full overflow-hidden {className}" style="height: {strokeWidth}px;">
    {#if value === undefined}
      <div class="h-full bg-slate-800 rounded-full w-1/3 animate-[translateX_1.5s_infinite_ease-in-out]"></div>
    {:else}
      <div class="h-full bg-slate-800 rounded-full transition-all duration-300 ease-out" style="width: {value}%;"></div>
    {/if}
  </div>
{/if}

<style>
  @keyframes translateX {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(300%); }
  }
</style>
