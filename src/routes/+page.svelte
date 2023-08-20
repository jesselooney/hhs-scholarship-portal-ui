<script lang="ts">
  import Search from 'svelte-search';
  import MultiSelect, { type Option } from 'svelte-multiselect';
  import Fuse from 'fuse.js';
  import type { Scholarship } from '../types.js';
  import type { PageData } from './$types';

  export let data: PageData;
  // TODO consider what behavior should REALLY be when
  // either of these properties is undefined at runtime.
  // TODO sort alphabetically??
  let allScholarships = data.scholarships ?? [];
  let allTags = data.tags ?? [];

  let tagOptions = allTags.map((tag) => tag.name);
  let selectedTags: string[] = [];
  let searchString = '';

  const fuse = new Fuse(allScholarships, {
    keys: ['name', 'description', 'tags.name']
  });

  function computeShownScholarships(searchString: string, selectedTags: string[]): Scholarship[] {
    let shownScholarships: Scholarship[] = allScholarships;

    if (searchString !== '') {
      shownScholarships = fuse.search(searchString).map((result) => result.item);
    }

    if (selectedTags.length !== 0) {
      shownScholarships = shownScholarships.filter((scholarship) => {
        const tags: string[] = scholarship.tags.map((tag) => tag.name);
        for (const tag of tags) {
          if (selectedTags.includes(tag)) return true;
        }
        return false;
      });
    }

    return shownScholarships;
  }

  $: shownScholarships = computeShownScholarships(searchString, selectedTags);
</script>

{#if data.scholarships && data.tags}
  <Search bind:value={searchString} hideLabel placeholder="Search Scholarships..." />
  <MultiSelect bind:selected={selectedTags} options={tagOptions} />

  <ul>
    <!--FIXME display 'loading' message while awaiting data-->
    <!--Check if the data loaded without error-->
    {#each shownScholarships as scholarship}
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
  </ul>
{:else}
  <!-- FIXME better error message -->
  <!-- FIXME maybe disable ssr so we dont have to deal with all this -->
  <p>Failed to load data</p>
{/if}
