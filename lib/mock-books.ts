export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  available: boolean;
  coverSeed: string;
  synopsis: string;
}

export function getBookCoverUrl(
  coverSeed: string,
  width = 300,
  height = 400,
) {
  return `https://picsum.photos/seed/${coverSeed}/${width}/${height}`;
}
