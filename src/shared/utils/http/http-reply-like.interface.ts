export interface HttpReplyLike {
  statusCode?: number;
  header(name: string, value: string): HttpReplyLike;
  getHeader(name: string): string | string[] | undefined;
  code?(statusCode: number): HttpReplyLike;
  status?(statusCode: number): HttpReplyLike;
}
