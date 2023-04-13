import type { Scholarship, Tag } from '../types';
import * as t from 'io-ts';
import { isRight } from 'fp-ts/Either';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const response = await fetch(
    'http://localhost:1337/api/scholarships?populate[0]=tags&sort[0]=name&pagination[pageSize]=100'
  )
    .then((r) => r.json())
    .catch(() => null);

  const decoded = APIScholarships.decode(response);

  // FIXME is returning null the best way to handle these errors
  return {
    scholarships: isRight(decoded) ? toScholarships(decoded.right) : null
  };
}) satisfies PageLoad;

// BUG: what happens if there is pagination??????????? pageSize=100 should fix...

const APITags = t.type({
  data: t.array(
    t.type({
      id: t.number,
      attributes: t.type({
        name: t.string
      })
    })
  )
});
type APITags = t.TypeOf<typeof APITags>;

const APIScholarships = t.type({
  data: t.array(
    t.type({
      id: t.number,
      attributes: t.type({
        name: t.string,
        description: t.string,
        tags: APITags
      })
    })
  )
});
type APIScholarships = t.TypeOf<typeof APIScholarships>;

function toScholarships(apiScholarships: APIScholarships): Scholarship[] {
  return apiScholarships.data.map((s) => ({
    id: s.id,
    name: s.attributes.name,
    description: s.attributes.description,
    tags: toTags(s.attributes.tags)
  }));
}

function toTags(apiTags: APITags): Tag[] {
  return apiTags.data.map((t) => ({ id: t.id, name: t.attributes.name }));
}
