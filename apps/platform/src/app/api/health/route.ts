import { scaffoldStatus } from "@gen-z/domain";
import { readEnvironment } from "../../../server/config";

export const dynamic = "force-dynamic";

export function GET() {
  return Response.json(
    { ...scaffoldStatus("platform", readEnvironment()), status: "foundation" },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
