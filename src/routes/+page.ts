import { Scholarship } from '../types';
import * as t from 'io-ts';
import type { PageLoad } from './$types';
import fetchAndValidate from '../utils/fetchAndValidate';
import buildUri from '../utils/buildUri';

export const load = (async ({ fetch }) => {
  return {
    scholarships: await fetchAndValidate(fetch, t.array(Scholarship), buildUri('scholarships'))
  };
}) satisfies PageLoad;
