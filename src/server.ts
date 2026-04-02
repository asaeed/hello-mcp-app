// Local dev entrypoint — imports the shared Express app and starts listening.
// For Vercel, see api/index.ts instead.
import app from "./app.js";

app.listen(3001, () => {
  console.log("hello-mcp-app running at http://localhost:3001");
  console.log("  MCP endpoint: http://localhost:3001/mcp");
  console.log("  Browser view: http://localhost:3001/");
});
