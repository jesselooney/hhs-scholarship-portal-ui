import type { PageLoad } from './$types';
import * as t from 'io-ts';
import fetchAndValidate from '../../../utils/fetchAndValidate';
import { error } from '@sveltejs/kit';
import { invalidateAll } from '$app/navigation';
import buildUri from '../../../utils/buildUri';
import { Application, Scholarship } from '../../../types';

export const load = (async ({ fetch, params }) => {
  const applications = await fetchAndValidate(
    fetch,
    t.array(Application),
    buildUri('applications')
  );

  const currentScholarship = await fetchAndValidate(
    fetch,
    Scholarship,
    buildUri(`scholarships/${params.scholarshipId}`)
  );

  const completeApplications = applications?.filter((a) => a.completed);
  const incompleteApplications = applications?.filter((a) => !a.completed);

  const apparentApplications = applications?.filter(
    (a) => a.scholarship.id === Number.parseInt(params.scholarshipId)
  );
  let currentApplication: Application | null | undefined = undefined;
  if (apparentApplications) {
    // If `apparentApplications` is the empty list, this student has not applied and `currentApplication` is `null`.
    if (apparentApplications.length === 0) currentApplication = null;
    // If `apparentApplications` has exactly one element, that element is the `currentApplication`.
    if (apparentApplications.length === 1) currentApplication = apparentApplications[0];
    // Otherwise, the data is still loading or something has gone wrong, so we don't know what the `currentApplication` is and thus it is `undefined`.
  }

  // TODO do something other than just `.catch`-ing?
  async function toggleCompleted(applicationId: number) {
    await fetch(buildUri(`applications/${applicationId}`), {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          completed: !currentApplication?.completed
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    })
      .then(invalidateAll)
      .catch();
  }

  async function updateEssay(applicationId: number, newEssay: string) {
    await fetch(buildUri(`applications/${applicationId}`), {
      method: 'PATCH',
      body: JSON.stringify({
        data: {
          essay: newEssay
        }
      }),
      headers: { 'Content-Type': 'application/json' }
    }).catch();
  }

  async function createApplication(scholarshipId: number) {
    await fetch(buildUri('applications'), {
      method: 'POST',
      body: JSON.stringify({ data: { scholarshipId } }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(invalidateAll)
      .catch();
  }

  async function deleteApplication(applicationId: number) {
    await fetch(buildUri(`applications/${applicationId}`), {
      method: 'DELETE'
    })
      .then(invalidateAll)
      .catch();
  }

  return {
    completeApplications,
    incompleteApplications,
    currentApplication,
    currentScholarship,
    toggleCompleted,
    updateEssay,
    createApplication,
    deleteApplication
  };
}) satisfies PageLoad;
