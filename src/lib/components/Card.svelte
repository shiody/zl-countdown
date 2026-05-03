<script lang="ts">
  import type { Snippet } from 'svelte';
  
  let { class: className = '', children }: { class?: string, children: Snippet } = $props();
</script>

<div class="bg-white border border-slate-200 rounded-xl overflow-hidden {className}">
  {@render children()}
</div>
