import React, { useEffect, useState } from "react";

type Invocation = { time: string; caller: string };

export function Landing() {
  const [history, setHistory] = useState<Invocation[]>([]);

  useEffect(() => {
    const load = () => {
      fetch("/api/history")
        .then((r) => r.json())
        .then(setHistory)
        .catch(() => {});
    };
    load();
    const id = setInterval(load, 3000);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 860, margin: "2rem auto", padding: "0 1rem" }}>
      <h1>hello-mcp-app</h1>
      <p>
        MCP endpoint: <code style={{ background: "#f0f0f0", padding: "2px 5px", borderRadius: 3 }}>POST /mcp</code>
      </p>

      <h2>App UI Preview</h2>
      <iframe
        src="/app"
        style={{ width: "100%", height: 200, border: "1px solid #ccc", borderRadius: 6 }}
        title="MCP App UI"
      />

      <h2 style={{ marginTop: "2rem" }}>
        Invocation History{" "}
        <span style={{ fontSize: "0.8rem", color: "#888", fontWeight: "normal" }}>
          (auto-refreshes every 3s)
        </span>
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.9rem" }}>
        <thead>
          <tr>
            {["Time", "Caller"].map((h) => (
              <th
                key={h}
                style={{ textAlign: "left", padding: "0.4rem 0.6rem", background: "#f5f5f5", borderBottom: "1px solid #eee" }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan={2} style={{ color: "#888", padding: "0.4rem 0.6rem" }}>
                No invocations yet
              </td>
            </tr>
          ) : (
            history.map((inv, i) => (
              <tr key={i}>
                <td style={{ padding: "0.4rem 0.6rem", borderBottom: "1px solid #eee" }}>{inv.time}</td>
                <td style={{ padding: "0.4rem 0.6rem", borderBottom: "1px solid #eee" }}>{inv.caller}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
