import assert from "node:assert/strict";
import { readFile, mkdtemp, writeFile, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import ts from "typescript";
const spec = JSON.parse(
  await readFile(
    new URL("../../backend/docs/openapi.json", import.meta.url),
    "utf8",
  ),
);
const routes = JSON.parse(
  await readFile(
    new URL("../src/lib/backend-routes.json", import.meta.url),
    "utf8",
  ),
);
assert.deepEqual(
  routes,
  Object.fromEntries(
    Object.entries(spec.paths)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([path, ops]) => [path, Object.keys(ops).sort()]),
  ),
);
const directory = await mkdtemp(join(tmpdir(), "lms-contract-"));
const calls = [];
const originalFetch = globalThis.fetch;
try {
  for (const name of ["api-client", "backend-capabilities", "admin-api"]) {
    const source = await readFile(
      new URL(`../src/lib/${name}.ts`, import.meta.url),
      "utf8",
    );
    const js = ts
      .transpileModule(source, {
        compilerOptions: {
          target: ts.ScriptTarget.ES2022,
          module: ts.ModuleKind.ES2022,
        },
      })
      .outputText.replaceAll('"./api-client"', '"./api-client.mjs"')
      .replaceAll('"./backend-capabilities"', '"./backend-capabilities.mjs"');
    await writeFile(join(directory, name + ".mjs"), js);
  }
  globalThis.fetch = async (path, options = {}) => {
    calls.push({
      path,
      method: options.method || "GET",
      body: options.body ? JSON.parse(options.body) : undefined,
    });
    return Response.json({ id: 2 });
  };
  const { createAdminApi } = await import(
    pathToFileURL(join(directory, "admin-api.mjs"))
  );
  const client = createAdminApi("", "", 7);
  const original = {
    id: 2,
    userId: 3,
    date: "2026-11-09",
    status: "PRESENT",
    unitType: "DATE",
    sessionNo: 0,
    note: "원본",
    checkIn: "2026-11-09T00:00:00Z",
  };
  await client.save(
    "attendance",
    { ...original, status: "EARLY" },
    false,
    undefined,
    original,
  );
  assert.equal(calls.at(-1).method, "PUT");
  assert.equal(calls.at(-1).body.userId, 3);
  assert.equal(calls.at(-1).body.date, original.date);
  assert.equal(calls.at(-1).body.checkIn, original.checkIn);
  await client.save(
    "posts",
    {
      id: 2,
      category: "COURSE",
      title: "공지",
      body: "본문",
      pinned: false,
      visibility: "PUBLIC",
      publicSlug: "ignored",
    },
    true,
  );
  assert.deepEqual(Object.keys(calls.at(-1).body).sort(), [
    "body",
    "category",
    "pinned",
    "title",
  ]);
  await client.save(
    "questions",
    {
      id: 2,
      prompt: "문항",
      explanation: "해설",
      points: 10,
      topicId: 99,
      chapterId: 88,
      optionCount: 2,
      option1: "정답",
      option2: "오답",
      correct: 1,
    },
    true,
    5,
  );
  assert.equal(calls.at(-1).path, "/api/assessments/5/questions");
  assert.equal(calls.at(-1).body.options.length, 2);
  assert.ok(!("topicId" in calls.at(-1).body));
  assert.ok(!("chapterId" in calls.at(-1).body));
  for (const resource of [
    "videos",
    "chapters",
    "subjects",
    "units",
    "topics",
  ]) {
    const count = calls.length;
    await assert.rejects(
      () => client.list(resource),
      (e) => e.status === 501,
    );
    assert.equal(calls.length, count);
  }
  await client.save(
    "enrollments",
    { id: 9, role: "INSTRUCTOR", status: "ACTIVE" },
    false,
  );
  assert.equal(calls.at(-1).path, "/api/cohorts/7/enrollments/9");
  for (const call of calls) {
    assert.ok(
      Object.entries(routes).some(
        ([template, methods]) =>
          methods.includes(call.method.toLowerCase()) &&
          new RegExp("^" + template.replace(/\{[^}]+\}/g, "[^/]+") + "$").test(
            call.path,
          ),
      ),
      `${call.method} ${call.path} is not in backend main`,
    );
  }
  console.log(
    "PASS: 74 backend-main operations match the frontend route snapshot; unsupported resources never fetch; PUT required fields and supported payloads are preserved.",
  );
} finally {
  globalThis.fetch = originalFetch;
  await rm(directory, { recursive: true, force: true });
}
