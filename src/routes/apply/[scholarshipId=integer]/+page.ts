import type { PageLoad } from './$types';
import * as t from 'io-ts';
import fetchAndValidate from '../../../utils/fetchAndValidate';
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

  return {
    completeApplications,
    incompleteApplications,
    currentApplication,
    currentScholarship
  };
}) satisfies PageLoad;
