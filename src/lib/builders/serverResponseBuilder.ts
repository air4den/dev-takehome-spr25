import { RESPONSES, ResponseType } from "@/lib/types/apiResponse";

export class ServerResponseBuilder {
  private message: string;
  private status: number;
  private data?: any;
  private pagination?: any;

  constructor(responseType: ResponseType, data?: any, pagination?: any) {
    const responseDetails = RESPONSES[responseType];
    this.message = responseDetails.message;
    this.status = responseDetails.code;
    this.data = data;
    this.pagination = pagination;
  }

  build(): Response {
    const responseBody: any = { message: this.message };

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
