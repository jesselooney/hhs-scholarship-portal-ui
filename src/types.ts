export type Scholarship = {
  id: number;
  name: string;
  description: string;
  tags: Tag[];
};

export type Tag = {
  id: number;
  name: string;
};
