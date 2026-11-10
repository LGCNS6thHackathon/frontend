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
  for (const name of ["api-client", "backend-capabilities", "admin-api", "calendar"]) {
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
  assert.equal(calls.at(-1).body.topicId, 99);
  assert.equal(calls.at(-1).body.chapterId, 88);
  assert.equal(calls.at(-1).body.position, 1);
  await client.save("videos", { id: 8, title: "강의", lectureDate: "2026-11-10", periodNo: 1, youtubeUrl: "https://youtu.be/abcdefghijk", visibility: "PRIVATE", durationSeconds: 120 }, true);
  assert.equal(calls.at(-1).path, "/api/admin/cohorts/7/lecture-videos");
  assert.equal(calls.at(-1).body.durationSeconds, 120);
  await client.save("videos", { id: 8, visibility: "PUBLIC" }, false);
  assert.equal(calls.at(-1).path, "/api/admin/lecture-videos/8");
  assert.equal(calls.at(-1).method, "PATCH");
  await client.remove("videos", 8);
  assert.equal(calls.at(-1).method, "DELETE");
  assert.equal(calls.at(-1).path, "/api/admin/lecture-videos/8");
  for (const resource of [
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
    { id: 9, role: "ADMIN", status: "ACTIVE" },
    false,
  );
  assert.equal(calls.at(-1).path, "/api/cohorts/7/enrollments/9");
  assert.equal(calls.at(-1).body.role, "ADMIN");
  for (const resource of ["users", "enrollments"]) {
    for (const role of ["INSTRUCTOR", "MANAGER"]) {
      const before = calls.length;
      await assert.rejects(() => client.save(resource, { id: 9, role }, false), e => e.status === 400);
      assert.equal(calls.length, before);
    }
  }
  const oldFetch = globalThis.fetch;
  try {
    const questionCalls = [];
    globalThis.fetch = async (path, options = {}) => {
      questionCalls.push({ path, method: options.method || "GET", body: options.body ? JSON.parse(options.body) : null });
      return Response.json(options.method === "POST" ? { id: 4 } : { questions: [{ position: 1 }, { position: 3 }] });
    };
    await client.save("questions", { id: 0, prompt: "다음 문항", optionCount: 2, option1: "가", option2: "나", correct: 1 }, true, 5);
    assert.equal(questionCalls[0].path, "/api/assessments/5");
    assert.equal(questionCalls.at(-1).body.position, 4, "deleted positions must not cause duplicate numbering");
    await client.save("questions", { id: 0, prompt: "지정 순번", position: 7, optionCount: 2, option1: "가", option2: "나", correct: 1 }, true, 5);
    assert.equal(questionCalls.length, 3, "explicit positions need no additional lookup");
    assert.equal(questionCalls.at(-1).body.position, 7);
    globalThis.fetch = async () => Response.json({ items: [
      { id: 1, instructorName: null, author: "등록 관리자" },
      { id: 2, instructorName: "기존 담당자", author: "등록 관리자" },
    ], total: 2 });
    assert.deepEqual((await client.list("assignments")).map(row => row.instructorName), ["등록 관리자", "기존 담당자"]);
    const videoCalls = [];
    globalThis.fetch = async path => {
      videoCalls.push(path);
      return Response.json(path.includes("page=0") ? { items: [{ id: 8, lectureDate: "2026-11-10", visibility: "PRIVATE" }], total: 2 } : { items: [{ id: 9, lectureDate: "2026-11-09", visibility: "PUBLIC" }], total: 2 });
    };
    const videos = await client.list("videos");
    assert.deepEqual(videos.map(video => video.id), [8, 9]);
    assert.equal(videoCalls.length, 2);
    assert.ok(videoCalls.every(path => path.startsWith("/api/admin/cohorts/7/lecture-videos?")));
  } finally { globalThis.fetch = oldFetch; }
  const { eventOnKoreanDay } = await import(pathToFileURL(join(directory, "calendar.mjs")));
  const hackathon = { startAt: "2026-11-08T15:00:00Z", endAt: "2026-11-10T15:00:00Z" };
  assert.equal(eventOnKoreanDay(hackathon, "2026-11-08"), false);
  assert.equal(eventOnKoreanDay(hackathon, "2026-11-09"), true);
  assert.equal(eventOnKoreanDay(hackathon, "2026-11-10"), true);
  assert.equal(eventOnKoreanDay(hackathon, "2026-11-11"), false, "end midnight must not occupy the next day");
  assert.equal(eventOnKoreanDay({ startAt: "2026-10-31T14:00:00Z", endAt: "2026-10-31T16:00:00Z" }, "2026-11-01"), true);
  assert.equal(eventOnKoreanDay({ startAt: "2026-11-09T15:00:00Z", endAt: "2026-11-09T16:00:00Z" }, "2026-11-10"), true);
  for (const call of calls) {
    assert.ok(
      Object.entries(routes).some(
        ([template, methods]) =>
          methods.includes(call.method.toLowerCase()) &&
          new RegExp("^" + template.replace(/\{[^}]+\}/g, "[^/]+") + "$").test(
            call.path,
          ),
      ),
      `${call.method} ${call.path} is not in backend develop`,
    );
  }
  console.log(
    "PASS: 97 backend-develop operations match; request payloads, question positions, ADMIN/STUDENT roles, and KST multi-day calendar boundaries are verified.",
  );
} finally {
  globalThis.fetch = originalFetch;
  await rm(directory, { recursive: true, force: true });
}
