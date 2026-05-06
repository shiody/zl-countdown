<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { 
    variant = 'filled', 
    icon = false,
    class: className = '', 
    onclick, 
    children 
  }: { 
    variant?: 'filled' | 'tonal' | 'outlined' | 'text', 
    icon?: boolean,
    class?: string, 
    onclick?: (e: MouseEvent) => void,
    children: Snippet 
  } = $props();

  const baseStyles = "inline-flex items-center justify-center rounded-full text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  const sizeStyles = icon ? "w-12 h-12" : "h-10 px-6";
  
  const variants = {
    filled: "bg-cyan-600 text-white hover:bg-cyan-700 shadow-sm focus:ring-cyan-500",
    tonal: "bg-cyan-100 text-cyan-900 hover:bg-cyan-200 focus:ring-cyan-500",
    outlined: "border border-slate-300 text-cyan-700 hover:bg-slate-50 focus:ring-cyan-500",
    text: "text-cyan-700 hover:bg-slate-50 focus:ring-cyan-500" // removed px-4 here, handled by sizeStyles
  };
</script>

<button 
  class="{baseStyles} {sizeStyles} {variants[variant]} {className}"
  onclick={onclick}
>
  {@render children()}
</button>
