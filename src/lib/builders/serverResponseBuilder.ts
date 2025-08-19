import { RESPONSES, ResponseType } from "@/lib/types/apiResponse";

export class ServerResponseBuilder {
  private message: string;
  private status: number;
  private data?: unknown;
  private pagination?: Record<string, unknown>;

  constructor(responseType: ResponseType, data?: unknown, pagination?: Record<string, unknown>) {
    const responseDetails = RESPONSES[responseType];
    this.message = responseDetails.message;
    this.status = responseDetails.code;
    this.data = data;
    this.pagination = pagination;
  }

  build(): Response {
    const responseBody: Record<string, unknown> = { message: this.message };

    if (this.data) {
      responseBody.data = this.data;
    }

    if (this.pagination) {
      responseBody.pagination = this.pagination;
    }

    return new Response(JSON.stringify(responseBody), {
      status: this.status,
      headers: { "Content-Type": "application/json" }
    });
  }
}
