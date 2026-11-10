import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import ts from "typescript";

const require = createRequire(import.meta.url);
const { NextRequest } = require("next/server");
const mode = { IS_MOCK: false };
const modules = new Map([["@/lib/data-mode", mode]]);
function load(path) {
  const source = readFileSync(path, "utf8");
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const loaded = { exports: {} };
  new Function("require", "module", "exports", compiled)(
    (name) => modules.get(name) ?? require(name), loaded, loaded.exports,
  );
  return loaded.exports;
}
modules.set("@/lib/auth-cookies", load("src/lib/auth-cookies.ts"));
const route = load("src/app/api/auth/demo-admin/route.ts");
const originalFetch = globalThis.fetch;
const keys = ["DEMO_ADMIN_LOGIN_ENABLED", "DEMO_ADMIN_EMAIL", "DEMO_ADMIN_PASSWORD", "BACKEND_URL", "NODE_ENV", "COOKIE_SECURE"];
const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
const base = "http://127.0.0.1:3000";
const request = (origin = base) => new NextRequest(`${base}/api/auth/demo-admin`, {
  method: "POST",
  headers: { host: new URL(base).host, ...(origin ? { origin } : {}) },
  body: JSON.stringify({ email: "ignored@example.test", password: "ignored" }),
});
const tokens = {
  user: { id: 1, role: "ADMIN", status: "ACTIVE", name: "Demo admin" },
  accessToken: "synthetic-access", refreshToken: "synthetic-refresh",
  expiresIn: 900, refreshExpiresIn: 604800,
};
let calls = 0;
let backendResponse = () => Response.json(tokens);
globalThis.fetch = async (url, options) => {
  calls++;
  assert.equal(url, "http://localhost:8080/api/auth/login");
  assert.equal(options.method, "POST");
  assert.equal(options.redirect, "error");
  assert.deepEqual(JSON.parse(options.body), {
    email: "demo@example.test", password: "Synthetic-password-only",
  });
  return backendResponse();
};
async function rejected(status, req = request()) {
  const response = await route.POST(req);
  assert.equal(response.status, status);
  assert.equal(response.headers.getSetCookie().length, 0);
  assert.equal(response.headers.get("cache-control"), "no-store");
  const body = JSON.stringify(await response.json());
  for (const secret of [tokens.accessToken, tokens.refreshToken, "Synthetic-password-only"])
    assert.ok(!body.includes(secret));
}
try {
  process.env.DEMO_ADMIN_EMAIL = "demo@example.test";
  process.env.DEMO_ADMIN_PASSWORD = "Synthetic-password-only";
  process.env.BACKEND_URL = "http://localhost:8080/";
  process.env.NODE_ENV = "development";
  delete process.env.COOKIE_SECURE;
  delete process.env.DEMO_ADMIN_LOGIN_ENABLED;
  assert.deepEqual(await route.GET().json(), { enabled: false });
  await rejected(404);
  process.env.DEMO_ADMIN_LOGIN_ENABLED = "true";
  delete process.env.DEMO_ADMIN_PASSWORD;
  assert.deepEqual(await route.GET().json(), { enabled: false });
  await rejected(404);
  process.env.DEMO_ADMIN_PASSWORD = "Synthetic-password-only";
  mode.IS_MOCK = true;
  assert.deepEqual(await route.GET().json(), { enabled: false });
  await rejected(404);
  mode.IS_MOCK = false;
  await rejected(403, request("https://untrusted.example"));
  await rejected(403, request("http://127.0.0.1:4000"));
  await rejected(403, request("invalid-origin"));
  await rejected(403, request(null));
  assert.equal(calls, 0);
  console.log("PASS: disabled, missing configuration, mock mode and foreign/missing origins do not call backend");

  assert.deepEqual(await route.GET().json(), { enabled: true });
  const success = await route.POST(request());
  assert.equal(success.status, 200);
  assert.deepEqual(await success.json(), { user: tokens.user });
  assert.equal(success.headers.get("cache-control"), "no-store");
  const cookies = success.headers.getSetCookie();
  assert.equal(cookies.length, 2);
  assert.ok(cookies.every((cookie) => cookie.includes("HttpOnly") && cookie.includes("SameSite=lax")));
  assert.ok(cookies.some((cookie) => cookie.startsWith("lms_access=") && cookie.includes("Max-Age=900")));
  assert.ok(cookies.some((cookie) => cookie.startsWith("lms_refresh=") && cookie.includes("Max-Age=604800")));
  console.log("PASS: configured account only, ADMIN response and HttpOnly cookies; no token/password JSON");

  process.env.NODE_ENV = "production";
  assert.ok((await route.POST(request())).headers.getSetCookie().every((c) => c.includes("Secure")));
  for (const user of [{ role: "STUDENT", status: "ACTIVE" }, { role: "ADMIN", status: "DISABLED" }]) {
    backendResponse = () => Response.json({ ...tokens, user });
    await rejected(403);
  }
  backendResponse = () => Response.json({ ...tokens, accessToken: null });
  await rejected(502);
  backendResponse = () => Response.json({ message: "upstream detail" }, { status: 401 });
  await rejected(502);
  backendResponse = () => { throw Error("network unavailable"); };
  await rejected(502);
  console.log("PASS: secure production cookies; non-admin, disabled, malformed, rejected and unreachable backends do not issue cookies");
} finally {
  globalThis.fetch = originalFetch;
  for (const key of keys) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
}
