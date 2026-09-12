import http from "node:http";
import { readFile } from "node:fs/promises";
const routes = {
  "/": ["public/index.html", "text/html"],
  "/app.js": ["public/app.js", "text/javascript"],
  "/style.css": ["public/style.css", "text/css"],
  "/experience.js": ["src/experience.js", "text/javascript"],
  "/intent.js": ["src/intent.js", "text/javascript"],
};
const server = http.createServer(async (req, res) => {
  const route = routes[new URL(req.url, "http://localhost").pathname];
  if (!route || !["GET", "HEAD"].includes(req.method)) {
    res.writeHead(404);
    res.end("Not found");
    return;
  }
  try {
    const body = await readFile(new URL(route[0], import.meta.url));
    res.writeHead(200, {
      "Content-Type": `${route[1]}; charset=utf-8`,
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
      "Content-Security-Policy":
        "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  } catch {
    res.writeHead(500);
    res.end("Could not load the application.");
  }
});
server.listen(Number(process.env.PORT || 3000), "127.0.0.1", () =>
  console.log(`TheDuck: http://127.0.0.1:${server.address().port}`),
);
