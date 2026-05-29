<script lang="ts">
  import Dialog from './Dialog.svelte';
  import Button from './Button.svelte';

  let { isOpen = $bindable(false) }: { isOpen: boolean } = $props();

  function close() {
    isOpen = false;
  }
</script>

<Dialog bind:isOpen>
  <div class="p-8 max-w-sm w-full space-y-6 flex flex-col items-center">
    <div class="w-16 h-16 bg-cyan-100 text-cyan-700 rounded-full flex items-center justify-center mb-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    </div>
    
    <h2 class="text-2xl font-bold text-slate-800 tracking-tight text-center">About</h2>
    
    <div class="text-center text-slate-600 space-y-3">
      <p class="font-medium text-slate-800">Zhen Li Countdown Timer</p>
      <div class="bg-slate-50 p-4 rounded-2xl border border-slate-100">
        <p class="text-sm mb-1">
          Author: <span class="font-semibold text-cyan-700">Rahmad Wahyudi</span>
        </p>
        <p class="text-sm font-medium text-slate-700">
          Zhen Li Communication Dept.
        </p>
      </div>
    </div>

    <div class="w-full pt-4">
      <Button variant="filled" class="w-full" onclick={close}>Close</Button>
    </div>
  </div>
</Dialog>
