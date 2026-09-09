import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import path from "node:path";
import process from "node:process";

/**
 * Serves the static export the way GitHub Pages does: a directory URL resolves to its
 * `index.html`, anything unknown returns the exported `404.html` with a 404 status, and
 * everything lives under the configured base path. It exists so the acceptance suite can
 * exercise the real artifact instead of the development server, whose unknown-route
 * behavior differs.
 */
const OUT_DIRECTORY = path.join(process.cwd(), "out");

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
};

function argument(name: string, fallback: string): string {
  const match = process.argv.find((value) => value.startsWith(`--${name}=`));
  return match ? match.slice(name.length + 3) : fallback;
}

const port = Number(argument("port", "3200"));
const basePath = argument("base-path", process.env.NEXT_PUBLIC_BASE_PATH ?? "");

/** Resolves a request path to a file inside the export, or null when it escapes it. */
async function resolveFile(requestPath: string): Promise<string | null> {
  const candidates = requestPath.endsWith("/")
    ? [path.join(requestPath, "index.html")]
    : [requestPath, `${requestPath}.html`, path.join(requestPath, "index.html")];

  for (const candidate of candidates) {
    const resolved = path.resolve(OUT_DIRECTORY, `.${candidate}`);
    if (resolved !== OUT_DIRECTORY && !resolved.startsWith(`${OUT_DIRECTORY}${path.sep}`)) {
      continue;
    }

    const info = await stat(resolved).catch(() => null);
    if (info?.isFile()) return resolved;
  }

  return null;
}

const server = createServer(async (request, response) => {
  const url = new URL(request.url ?? "/", `http://localhost:${port}`);

  if (basePath && !url.pathname.startsWith(basePath)) {
    response.writeHead(404, { "content-type": "text/plain" });
    response.end("Outside the published base path");
    return;
  }

  const pathname = decodeURIComponent(url.pathname);
  const relativePath = basePath ? pathname.slice(basePath.length) : pathname;
  const file = await resolveFile(relativePath || "/");

  if (!file) {
    const notFound = await resolveFile("/404.html");
    response.writeHead(404, { "content-type": MIME_TYPES[".html"] });
    if (notFound) createReadStream(notFound).pipe(response);
    else response.end("Not found");
    return;
  }

  response.writeHead(200, {
    "content-type": MIME_TYPES[path.extname(file)] ?? "application/octet-stream",
  });
  createReadStream(file).pipe(response);
});

server.listen(port, () => {
  console.warn(`Serving out/ at http://localhost:${port}${basePath}/`);
});
