import "server-only";
import { environmentSchema } from "@gen-z/domain";

export function readEnvironment() {
  return environmentSchema.parse(process.env.GENZ_ENVIRONMENT ?? "demo");
}
