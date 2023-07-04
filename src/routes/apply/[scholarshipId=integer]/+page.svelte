<script lang="ts">
  export let data;

  import debounce from 'just-debounce-it';

  $: ({
    incompleteApplications,
    completeApplications,
    currentApplication,
    currentScholarship,
    toggleCompleted,
    updateEssay,
    createApplication,
    deleteApplication
  } = data);

  $: essay = currentApplication?.essay ?? '';
</script>

<section class="applications">
  <h2 class="applications__header">Your Applications</h2>
  <div class="applications__incomplete-applications">
    <h3>incomplete</h3>
    {#if incompleteApplications}
      <ul class="applications__incomplete-applications__list">
        {#each incompleteApplications as application}
          <li
            data-scholarshipId={application.scholarship.id}
            class="applications__incomplete-applications__list__application"
          >
            <a
              class="applications__incomplete-applications__list__application__link"
              data-sveltekit-reload
              href="/apply/{application.scholarship.id}"
            >
              {application.scholarship.name}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="applications__incomplete-applications--loading">loading</p>
    {/if}
  </div>
  <div class="applications__complete-applications">
    <h3>complete</h3>
    {#if completeApplications}
      <ul class="applications__complete-applications__list">
        {#each completeApplications as application}
          <li
            data-scholarshipId={application.scholarship.id}
            class="applications__complete-applications__list__application"
          >
            <a
              class="applications__complete-applications__list__application__link"
              data-sveltekit-reload
              href="/apply/{application.scholarship.id}"
            >
              {application.scholarship.name}
            </a>
          </li>
        {/each}
      </ul>
    {:else}
      <p class="applications__complete-applications--loading">loading</p>
    {/if}
  </div>
</section>

{#if currentScholarship}
  <section class="scholarship-details">
    <h2 class="scholarship-details__scholarship-name">{currentScholarship.name}</h2>
    <p class="scholarship-details__scholarship-description">
      {currentScholarship.description}
    </p>
    <p class="scholarship-details__essay-prompt">Essay prompt: rtsatsartart</p>

    <section class="application">
      {#if currentApplication}
        <label for="application__essay">Essay</label>
        <!--TODO dont allow users to edit applications marked complete-->
        <!--TODO display to user whether latest changes are saved or not-->
        <textarea
          class="application__essay"
          name="application__essay"
          id="application__essay"
          value={essay}
          on:input={debounce((e) => {
            updateEssay(currentApplication?.id ?? NaN, e.target.value);
          }, 500)}
          cols="30"
          rows="10"
        />
        <button on:click={() => toggleCompleted(currentApplication?.id ?? NaN)}>
          {currentApplication.completed ? 'Mark as incomplete' : 'Mark as complete'}
        </button>
        <button on:click={() => deleteApplication(currentApplication?.id ?? NaN)}>
          Delete Application
        </button>
      {:else if currentApplication === null}
        <p class="application--not-started__not-started-notice">
          You have not yet started an application for this scholarship.
        </p>
        <button
          on:click={() => createApplication(currentScholarship?.id ?? NaN)}
          class="application--not-started__start-application">Start your application</button
        >
      {:else}
        <p class="application--loading">Your application is loading.</p>
      {/if}
    </section>
  </section>
{:else}
  <p class="scholarship-details--loading">This scholarship's details are loading.</p>
{/if}
