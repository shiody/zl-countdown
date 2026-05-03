<script lang="ts">
  let { value = undefined, size = 40, strokeWidth = 4, class: className = '' }: { value?: number, size?: number, strokeWidth?: number, class?: string } = $props();
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = $derived(value !== undefined ? circumference - (value / 100) * circumference : 0);
</script>

<div class="relative inline-flex {className}" style="width: {size}px; height: {size}px;">
  {#if value === undefined}
    <!-- Indeterminate -->
    <svg class="animate-spin text-cyan-600 w-full h-full" viewBox="0 0 {size} {size}">
      <circle 
        class="opacity-25" 
        cx="{size/2}" cy="{size/2}" r="{radius}" 
        stroke="currentColor" stroke-width="{strokeWidth}" fill="none"
      ></circle>
      <circle 
        class="opacity-75" 
        cx="{size/2}" cy="{size/2}" r="{radius}" 
        stroke="currentColor" stroke-width="{strokeWidth}" fill="none" 
        stroke-dasharray="{circumference * 0.7} {circumference * 0.3}"
        stroke-linecap="round"
      ></circle>
    </svg>
  {:else}
    <!-- Determinate -->
    <svg class="text-cyan-600 w-full h-full -rotate-90 transition-all duration-300 ease-out" viewBox="0 0 {size} {size}">
      <circle 
        class="text-slate-200" 
        cx="{size/2}" cy="{size/2}" r="{radius}" 
        stroke="currentColor" stroke-width="{strokeWidth}" fill="none"
      ></circle>
      <circle 
        class="text-cyan-600 transition-all duration-300 ease-out" 
        cx="{size/2}" cy="{size/2}" r="{radius}" 
        stroke="currentColor" stroke-width="{strokeWidth}" fill="none" 
        stroke-dasharray="{circumference}" 
        stroke-dashoffset="{strokeDashoffset}"
        stroke-linecap="round"
      ></circle>
    </svg>
  {/if}
</div>
