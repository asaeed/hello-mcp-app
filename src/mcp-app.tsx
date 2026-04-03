// APP (UI) — React component, runs inside the host's sandboxed iframe.
// Compiled by Vite into a single self-contained HTML blob (dist/mcp-app.html).
import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@modelcontextprotocol/ext-apps";

const app = new App({ name: "Hello MCP App", version: "1.0.0" });

function McpApp() {
  const [time, setTime] = useState<string>("waiting...");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    app.connect();
    app.ontoolresult = (result) => {
      const t = result.content?.find((c) => c.type === "text")?.text;
      setTime(t ?? "[no result]");
    };
  }, []);

  const refresh = async () => {
    setLoading(true);
    const result = await app.callServerTool({ name: "get-time", arguments: {} });
    const t = result.content?.find((c) => c.type === "text")?.text;
    setTime(t ?? "[no result]");
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "sans-serif", padding: "1rem" }}>
      <h3>Hello MCP App</h3>
      <p>
        <strong>Server time:</strong>{" "}
        <code style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: 4, color: "#16a34a" }}>
          {loading ? "loading..." : time ? new Date(time).toLocaleString() : "waiting..."}
        </code>
      </p>
      <button
        onClick={refresh}
        disabled={loading}
        style={{ marginTop: "0.5rem", padding: "0.4rem 0.8rem", cursor: "pointer" }}
      >
        Refresh
      </button>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(<McpApp />);
