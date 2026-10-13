import { handleDocumentRequest } from "@/lib/template-document-request";

export async function POST(request: Request) {
  return handleDocumentRequest(request, "warranty");
}
