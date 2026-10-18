import { createServer } from "node:http";
import { environmentSchema, scaffoldStatus } from "@gen-z/domain";

const environment = environmentSchema.parse(process.env.GENZ_ENVIRONMENT ?? "demo");
const port = Number(process.env.WORKER_HEALTH_PORT ?? 4800);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("WORKER_HEALTH_PORT must be an integer between 1 and 65535.");
}

const server = createServer((request, response) => {
  response.setHeader("Content-Type", "application/json");
  response.setHeader("Cache-Control", "no-store");

  if (request.method !== "GET") {
    response.writeHead(405, { Allow: "GET" });
    response.end(JSON.stringify({ code: "METHOD_NOT_ALLOWED" }));
    return;
  }

  if (request.url === "/health") {
    response.end(JSON.stringify({ ...scaffoldStatus("operations", environment), activeHandlers: 0 }));
    return;
  }

  if (request.url === "/ready") {
    response.writeHead(503);
    response.end(JSON.stringify({
      ...scaffoldStatus("operations", environment),
      code: "WORKER_HANDLERS_NOT_CONFIGURED",
    }));
    return;
  }

  response.writeHead(404);
  response.end(JSON.stringify({ code: "NOT_FOUND" }));
});

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});

server.listen(port, "127.0.0.1", () => {
  console.log(JSON.stringify({ service: "operations", environment, port, state: "idle", activeHandlers: 0 }));
});

function shutdown() {
  server.close();
  server.closeIdleConnections();
}

process.once("SIGINT", shutdown);
process.once("SIGTERM", shutdown);
