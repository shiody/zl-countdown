<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { 
    variant = 'filled', 
    class: className = '', 
    onclick, 
    children 
  }: { 
    variant?: 'filled' | 'tonal' | 'outlined' | 'text', 
    class?: string, 
    onclick?: (e: MouseEvent) => void,
    children: Snippet 
  } = $props();

  const baseStyles = "inline-flex items-center justify-center h-10 px-6 rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    filled: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm focus:ring-cyan-500",
    tonal: "bg-cyan-100 text-cyan-900 hover:bg-cyan-200 focus:ring-cyan-500",
    outlined: "border border-slate-300 text-cyan-700 hover:bg-slate-50 focus:ring-cyan-500",
    text: "text-cyan-700 hover:bg-slate-50 px-4 focus:ring-cyan-500"
  };
</script>

<button 
  class="{baseStyles} {variants[variant]} {className}"
  onclick={onclick}
>
  {@render children()}
</button>
