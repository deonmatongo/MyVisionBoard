import http from "node:http";

const port = Number(process.env.PORT || 3001);

const server = http.createServer((req, res) => {
  if (req.url === "/health") {
    res.writeHead(200, { "content-type": "application/json" });
    res.end(JSON.stringify({ ok: true }));
    return;
  }

  res.writeHead(404, { "content-type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

server.listen(port, () => {
  console.log(`API server placeholder listening on http://localhost:${port}`);
  console.log("Note: this is a placeholder. We will replace it with the MongoDB-backed API.");
});
