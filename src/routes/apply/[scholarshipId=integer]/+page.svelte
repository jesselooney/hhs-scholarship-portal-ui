<script lang="ts">
  export let data;

  import debounce from 'just-debounce-it';
  import buildUri from '../../../utils/buildUri.js';
  import { invalidateAll } from '$app/navigation';
  import { snackbarState } from '../../../stores.js';

  const UPDATE_FAILED_ERROR_MESSAGE =
    'Your application could not be updated due to an unexpected error.';

  $: ({ incompleteApplications, completeApplications, currentApplication, currentScholarship } =
    data);

  $: essay = currentApplication?.essay ?? '';
  let essaySaved = true;

  // TODO Add retry for toggle, create, and delete
  async function toggleCompleted(applicationId: number) {
    try {
      await fetch(buildUri(`applications/${applicationId}`), {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            completed: !currentApplication?.completed
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      invalidateAll();
    } catch (e) {
      snackbarState.set({
        message: UPDATE_FAILED_ERROR_MESSAGE
      });
      throw e;
    }
  }

  async function updateEssay(applicationId: number, newEssay: string) {
    try {
      await fetch(buildUri(`applications/${applicationId}`), {
        method: 'PATCH',
        body: JSON.stringify({
          data: {
            essay: newEssay
          }
        }),
        headers: { 'Content-Type': 'application/json' }
      });
      essaySaved = true;
    } catch (e) {
      snackbarState.set({
        message: UPDATE_FAILED_ERROR_MESSAGE,
        action: {
          title: 'Retry',
          callback: (_) =>
            updateEssay(applicationId, newEssay).then((_) => snackbarState.set(undefined))
        }
      });
      throw e;
    }
  }

  async function createApplication(scholarshipId: number) {
    try {
      await fetch(buildUri('applications'), {
        method: 'POST',
        body: JSON.stringify({ data: { scholarshipId } }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      invalidateAll();
    } catch (e) {
      snackbarState.set({
        message: UPDATE_FAILED_ERROR_MESSAGE
      });
      throw e;
    }
  }

  async function deleteApplication(applicationId: number) {
    try {
      await fetch(buildUri(`applications/${applicationId}`), {
        method: 'DELETE'
      });
      invalidateAll();
    } catch (e) {
      snackbarState.set({
        message: UPDATE_FAILED_ERROR_MESSAGE
      });
      throw e;
    }
  }

  let handleEssayChangedDebounced = debounce((e: any) => {
    updateEssay(currentApplication?.id ?? NaN, e.target.value);
  }, 500);
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
          on:input={(e) => {
            essaySaved = false;
            handleEssayChangedDebounced(e);
          }}
          cols="30"
          rows="10"
        />
        <span class="application__essaySavedIndicator">{essaySaved}</span>
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
