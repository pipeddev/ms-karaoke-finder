export interface HttpReplyLike {
  status(code: number): this;
  send(body: any): void;
  header(name: string, value: string): this;
  headers(headers: Record<string, string>): this;
  type(contentType: string): this;
  code(statusCode: number): this; // Específico de Fastify
  getHeaders(): Record<string, string | string[]>; // Específico de Fastify
  raw: any; // La respuesta HTTP nativa
}
