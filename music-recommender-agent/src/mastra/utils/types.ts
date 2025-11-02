export interface ArtistData {
  data: {
    id: number;
    title: string;
    link: string;
    artist: {
      name: string;
    };
  }[];
}
