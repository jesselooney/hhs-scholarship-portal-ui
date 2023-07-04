<script lang="ts">
  import Search from 'svelte-search';
  import Fuse from 'fuse.js';

  export let data;

  const fuse = new Fuse(data?.scholarships ?? [], {
    keys: ['name', 'description', 'tags']
  });

  let searchString = '';

  $: scholarships =
    searchString === ''
      ? data?.scholarships ?? [] // Show all scholarships (sorted alphapetically by API server) if search is empty
      : fuse.search(searchString).map((result) => result.item);
</script>

<!-- FIXME pressing enter submits page as form or something -->
<Search bind:value={searchString} hideLabel placeholder="Search Scholarships..." />

<ul>
  <!--FIXME display 'loading' message while awaiting data-->
  <!--Check if the data loaded without error-->
  {#if data?.scholarships}
    {#each scholarships as scholarship}
      <li class="scholarship">
        <a class="scholarship__name" href="/apply/{scholarship.id}">{scholarship.name}</a>
        <ul class="scholarship__tags">
          {#each scholarship.tags as tag}
            <li class="scholarship__tags__tag">{tag.name}</li>
          {/each}
        </ul>
        <p class="scholarship__description">{scholarship.description}</p>
      </li>
    {/each}
  {:else}
    <!-- FIXME better error message -->
    <p>Failed to load scholarships</p>
  {/if}
</ul>
