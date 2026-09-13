import http from "node:http";
import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import {
  createOpenAIProvider,
  createUnderstandingService,
  providerStatus,
} from "./src/provider.mjs";
const routes = {
  "/": ["public/index.html", "text/html"],
  "/app.js": ["public/app.js", "text/javascript"],
  "/style.css": ["public/style.css", "text/css"],
  "/experience.js": ["src/experience.js", "text/javascript"],
  "/semantic.js": ["src/semantic.js", "text/javascript"],
  "/intent.js": ["src/intent.js", "text/javascript"],
  "/duck.svg": ["public/duck.svg", "image/svg+xml"],
  "/fonts/inter-400.woff2": ["public/fonts/inter-400.woff2", "font/woff2"],
  "/fonts/inter-600.woff2": ["public/fonts/inter-600.woff2", "font/woff2"],
  "/fonts/inter-700.woff2": ["public/fonts/inter-700.woff2", "font/woff2"],
};
export function createServer({
  service = createUnderstandingService(createOpenAIProvider()),
  status = providerStatus,
} = {}) {
  return http.createServer(async (req, res) => {
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "no-store");
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self'; script-src 'self'; style-src 'self'; object-src 'none'; base-uri 'none'; frame-ancestors 'none'",
    );
    const json = (code, value) => {
      res.writeHead(code, {
        "Content-Type": "application/json; charset=utf-8",
      });
      res.end(JSON.stringify(value));
    };
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/api/status" && req.method === "GET") {
      json(200, status());
      return;
    }
    if (url.pathname === "/api/understand" && req.method === "POST") {
      if (
        req.headers.origin &&
        req.headers.origin !== `http://${req.headers.host}`
      ) {
        json(403, { error: "This request must come from the local app." });
        return;
      }
      if (!req.headers["content-type"]?.startsWith("application/json")) {
        json(415, { error: "Expected JSON." });
        return;
      }
      let body = "";
      try {
        for await (const chunk of req) {
          body += chunk;
          if (Buffer.byteLength(body) > 256000) {
            json(413, {
              error: "This idea is too large. Keep it within 5,000 characters.",
            });
            return;
          }
        }
        const state = JSON.parse(body);
        if (state.version !== 2)
          throw Error("Only pre-lock semantic drafts can be interpreted.");
        if (
          state.semantic &&
          (state.semantic.updates >= 1 ||
            Object.keys(state.suggestionChoices || {}).length)
        )
          throw Error(
            "This draft has already been reviewed. Keep your decisions and edit it directly.",
          );
        json(200, await service.understandIdea(state));
      } catch (error) {
        json(error.code === "NOT_CONFIGURED" ? 503 : 422, {
          code: error.code || "INVALID_REQUEST",
          error: error.code
            ? error.message
            : "This draft could not be interpreted. Check the saved idea and retry.",
        });
      }
      return;
    }
    if (url.pathname === "/api/sample" && req.method === "GET") {
      const { sampleResponse } = await import(
        "./test/fixtures/semantic-corpus.js"
      );
      json(200, sampleResponse());
      return;
    }
    const route = routes[url.pathname];
    if (!route || !["GET", "HEAD"].includes(req.method)) {
      res.writeHead(404);
      res.end("Not found");
      return;
    }
    try {
      const body = await readFile(new URL(route[0], import.meta.url));
      res.writeHead(200, { "Content-Type": `${route[1]}; charset=utf-8` });
      res.end(req.method === "HEAD" ? undefined : body);
    } catch {
      res.writeHead(500);
      res.end("Could not load the application.");
    }
  });
}
if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  createServer().listen(
    Number(process.env.PORT || 3000),
    "127.0.0.1",
    function () {
      console.log(`TheDuck: http://127.0.0.1:${this.address().port}`);
    },
  );
}
