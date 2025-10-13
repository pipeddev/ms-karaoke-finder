export class Song {
  constructor(
    public id: string,
    public title: string,
    public artist: string,
    public album?: string,
    public imageUrl?: string,
  ) {}
}
