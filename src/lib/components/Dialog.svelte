<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { isOpen = $bindable(false), children }: { isOpen: boolean, children: Snippet } = $props();
</script>

{#if isOpen}
<div class="fixed inset-0 z-50 flex items-center justify-center p-4">
  <!-- Scrim -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div 
    class="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" 
    onclick={() => isOpen = false}
  ></div>
  
  <!-- Dialog surface -->
  <div class="relative bg-white rounded-[28px] shadow-2xl overflow-hidden min-w-[320px] max-w-sm w-full pointer-events-auto transform transition-all border border-slate-100 flex flex-col font-sans">
    {@render children()}
  </div>
</div>
{/if}
