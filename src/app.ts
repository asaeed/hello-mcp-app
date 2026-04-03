import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import {
  registerAppTool,
  registerAppResource,
  RESOURCE_MIME_TYPE,
} from "@modelcontextprotocol/ext-apps/server";
import express from "express";
import cors from "cors";
import fs from "node:fs/promises";
import path from "node:path";
// In-memory invocation log (resets on cold start in serverless)
export const invocations: { time: string; caller: string }[] = [];

const mcpServer = new McpServer({
  name: "hello-mcp-app",
  version: "1.0.0",
});

const resourceUri = "ui://hello-mcp-app/mcp-app.html";

registerAppTool(
  mcpServer,
  "get-time",
  {
    title: "Get Time",
    description: "Returns the current server time and renders it in the App UI.",
    inputSchema: {},
    _meta: { ui: { resourceUri } },
  },
  async (_, extra) => {
    const now = new Date().toISOString();
    const caller = (extra as any)?.requestInfo?.clientInfo?.name ?? "unknown";
    invocations.unshift({ time: now, caller });
    if (invocations.length > 50) invocations.pop();
    return { content: [{ type: "text", text: now }] };
  }
);

registerAppResource(
  mcpServer,
  resourceUri,
  resourceUri,
  { mimeType: RESOURCE_MIME_TYPE },
  async () => {
    const html = await fs.readFile(
      path.join(process.cwd(), "dist", "mcp-app.html"),
      "utf-8"
    );
    return {
      contents: [{ uri: resourceUri, mimeType: RESOURCE_MIME_TYPE, text: html }],
    };
  }
);

const app = express();
app.use(cors());
app.use(express.json());

app.post("/mcp", async (req, res) => {
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });
  res.on("close", () => transport.close());
  await mcpServer.connect(transport);
  await transport.handleRequest(req, res, req.body);
});

// JSON endpoint polled by the React landing page
app.get("/api/history", (_req, res) => {
  res.json(invocations);
});

// Serves the compiled MCP App HTML for the iframe preview on the landing page
app.get("/app", async (_req, res) => {
  const html = await fs.readFile(
    path.join(process.cwd(), "dist", "mcp-app.html"),
    "utf-8"
  ).catch(() => "<p>Run <code>npm run build</code> first.</p>");
  res.setHeader("Content-Type", "text/html");
  res.send(html);
});

// Serve the React landing page SPA (built by vite.landing.config.ts)
app.use(express.static(path.join(process.cwd(), "dist")));
app.get("/{*path}", (_req, res) => {
  res.sendFile(path.join(process.cwd(), "dist", "index.html"));
});

export default app;
