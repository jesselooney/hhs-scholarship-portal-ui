<script lang="ts">
  import { snackbarState } from '../stores';
</script>

<nav>
  <a href="/">Home</a>
  <a href="/biographics">My Data</a>
</nav>

<main><slot /></main>

{#if $snackbarState}
  <div class="snackbar">
    <span class="snackbar__message">{$snackbarState.message}</span>
    {#if $snackbarState.action}
      <button on:click={$snackbarState.action.callback} class="snackbar__action-button">
        {$snackbarState.action.title}
      </button>
    {/if}
    <button
      on:click={(_) => snackbarState.set(undefined)}
      class="snackbar__clear-snackbar-button">Clear</button
    >
  </div>
{/if}
