import * as t from 'io-ts';

export const Tag = t.type({
  id: t.number,
  name: t.string
});
export type Tag = t.TypeOf<typeof Tag>;

export const Scholarship = t.type({
  id: t.number,
  name: t.string,
  description: t.string,
  tags: t.array(Tag)
});
export type Scholarship = t.TypeOf<typeof Scholarship>;

export const Application = t.type({
  id: t.number,
  essay: t.string,
  completed: t.boolean,
  scholarship: t.type({
    id: t.number,
    name: t.string,
    description: t.string
  })
});
export type Application = t.TypeOf<typeof Application>;
