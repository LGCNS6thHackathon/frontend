import assert from "node:assert/strict";
const base = new URL(process.argv[2] || "http://127.0.0.1:3110");
assert.ok(
  ["localhost", "127.0.0.1"].includes(base.hostname),
  "검증은 로컬 테스트 서버에서만 실행하세요.",
);
const email = process.env.VERIFY_ADMIN_EMAIL,
  password = process.env.VERIFY_ADMIN_PASSWORD;
assert.ok(
  email && password,
  "VERIFY_ADMIN_EMAIL/PASSWORD 테스트 계정이 필요합니다.",
);
let checks = 0;
const run = Date.now();
function check(value, label) {
  assert.ok(value, label);
  checks++;
  console.log("PASS " + label);
}
function client() {
  const jar = new Map();
  return {
    jar,
    async call(method, path, body, status = 200, extra = {}) {
      const headers = { ...extra };
      if (jar.size)
        headers.Cookie = [...jar].map(([k, v]) => `${k}=${v}`).join("; ");
      if (body !== undefined && !(body instanceof FormData))
        headers["Content-Type"] = "application/json";
      const response = await fetch(new URL(path, base), {
        method,
        headers,
        body:
          body === undefined
            ? undefined
            : body instanceof FormData
              ? body
              : JSON.stringify(body),
      });
      for (const cookie of response.headers.getSetCookie()) {
        const [pair] = cookie.split(";");
        const split = pair.indexOf("=");
        jar.set(pair.slice(0, split), pair.slice(split + 1));
      }
      assert.equal(
        response.status,
        status,
        `${method} ${path}: ${response.status} (expected ${status})`,
      );
      if (status === 204) return null;
      const text = await response.text();
      return {
        data: response.headers.get("content-type")?.includes("application/json")
          ? JSON.parse(text)
          : text,
        headers: response.headers,
      };
    },
  };
}
// Run only against an isolated instance of the unchanged backend main.
const admin = client(),
  student = client(),
  anonymous = client();
await anonymous.call("GET", "/api/me", undefined, 401);
check(true, "익명 API 차단");
const logged = await admin.call("POST", "/api/auth/login", { email, password });
check(
  logged.data.user && !logged.data.accessToken && !logged.data.refreshToken,
  "토큰을 브라우저 JSON에 노출하지 않음",
);
check(
  logged.headers
    .getSetCookie()
    .every((c) => c.includes("HttpOnly") && c.includes("SameSite=lax")),
  "HttpOnly/SameSite 쿠키",
);
admin.jar.set("lms_access", "expired");
await Promise.all([
  admin.call("GET", "/api/me"),
  admin.call("GET", "/api/cohorts"),
]);
check(true, "동시 요청의 갱신 토큰 회전");
await admin.call("POST", "/api/courses", { title: "출처 검증" }, 403, {
  Origin: "https://untrusted.example",
});
check(true, "교차 출처 변경 차단");
for (const [method, path] of [
  ["GET", "/api/cohorts/1/videos"],
  ["GET", "/api/cohorts/1/topics"],
  ["POST", "/api/posts/1/discord"],
  ["GET", "/api/cohorts/1/assessment-summary"],
  ["POST", "/api/cohorts/1/review-sessions"],
]) {
  const result = await admin.call(
    method,
    path,
    method === "POST" ? {} : undefined,
    501,
  );
  assert.equal(result.data.code, "API_NOT_SUPPORTED");
}
check(true, "main에 없는 API는 백엔드에 전달하지 않음");
const date = (offset = 0) =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(Date.now() + offset * 86400000),
  );
const course = (
  await admin.call(
    "POST",
    "/api/courses",
    {
      title: `프론트 검증 ${run}`,
      description: "기존 main 연동",
      totalHours: 100,
    },
    201,
  )
).data;
await admin.call("PATCH", `/api/courses/${course.id}`, {
  description: "수정된 과정",
});
const cohort = (
  await admin.call(
    "POST",
    `/api/courses/${course.id}/cohorts`,
    { name: "검증 기수", startDate: date(-7), endDate: date(60) },
    201,
  )
).data;
const other = (
  await admin.call(
    "POST",
    `/api/courses/${course.id}/cohorts`,
    { name: "접근 차단 기수", startDate: date(-7), endDate: date(60) },
    201,
  )
).data;
const user = (
  await admin.call(
    "POST",
    "/api/users",
    {
      name: "검증 수강생",
      email: `student-${run}@example.test`,
      password: "IntegrationStudent!42",
    },
    201,
  )
).data;
check(
  user.role === "STUDENT" && !user.passwordHash && !user.password,
  "기존 계정 발급 계약",
);
await student.call("POST", "/api/auth/login", {
  email: user.email,
  password: "IntegrationStudent!42",
});
check(
  (await student.call("GET", "/api/cohorts")).data.total === 0,
  "미배정 회원의 빈 기수 목록",
);
const enrollment = (
  await admin.call(
    "POST",
    `/api/cohorts/${cohort.id}/enrollments`,
    { userId: user.id, role: "STUDENT" },
    201,
  )
).data;
await admin.call(
  "PATCH",
  `/api/cohorts/${cohort.id}/enrollments/${enrollment.id}`,
  { status: "ACTIVE" },
);
await student.call("GET", `/api/cohorts/${other.id}/posts`, undefined, 403);
await student.call("GET", "/api/users", undefined, 403);
check(true, "회원 관리 및 다른 기수 접근 차단");
const event = (
  await admin.call(
    "POST",
    `/api/cohorts/${cohort.id}/events`,
    {
      title: "학습 일정",
      type: "LECTURE",
      startAt: new Date().toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
    },
    201,
  )
).data;
await admin.call("PATCH", `/api/events/${event.id}`, { location: "교육장" });
check(
  (
    await student.call(
      "GET",
      `/api/cohorts/${cohort.id}/events?month=${date().slice(0, 7)}`,
    )
  ).data.items.some((x) => x.id === event.id),
  "월별 일정 조회/관리",
);
const post = (
  await admin.call(
    "POST",
    `/api/cohorts/${cohort.id}/posts`,
    {
      category: "COURSE",
      title: "운영 공지",
      body: "기존 API 공지 저장",
      pinned: true,
    },
    201,
  )
).data;
await admin.call("PATCH", `/api/posts/${post.id}`, { body: "수정된 공지" });
check(
  (await student.call("GET", `/api/posts/${post.id}`)).data.body ===
    "수정된 공지",
  "공지 CRUD",
);
const questionPost = (
  await student.call(
    "POST",
    `/api/cohorts/${cohort.id}/posts`,
    { category: "QUESTION", title: "학습 질문", body: "질문 작성 검증" },
    201,
  )
).data;
const comment = (
  await admin.call(
    "POST",
    `/api/posts/${questionPost.id}/comments`,
    { body: "강사 답변" },
    201,
  )
).data;
await admin.call("PATCH", `/api/comments/${comment.id}`, { body: "수정 답변" });
await admin.call("DELETE", `/api/comments/${comment.id}`, undefined, 204);
check(true, "학습 질문 및 댓글 CRUD");
const noticeFile = new FormData();
noticeFile.set("file", new Blob(["공지 파일"]), "notice.txt");
const uploaded = (
  await admin.call("POST", `/api/posts/${post.id}/files`, noticeFile, 201)
).data;
check(
  (await student.call("GET", `/api/files/${uploaded.id}/download`)).data ===
    "공지 파일",
  "공지 첨부 업로드·인증 다운로드",
);
await admin.call("DELETE", `/api/files/${uploaded.id}`, undefined, 204);
const assignment = (
  await admin.call(
    "POST",
    `/api/cohorts/${cohort.id}/assignments`,
    {
      title: "실제 API 과제",
      description: "제출과 평가 검증",
      instructorName: "검증 강사",
      maxScore: 100,
      dueAt: new Date(Date.now() + 86400000).toISOString(),
    },
    201,
  )
).data;
const form = new FormData();
form.set("repoUrl", "https://github.com/example/project");
form.set("submitMemo", "제출 내용");
form.set("file", new Blob(["student upload"]), "submission.txt");
const submission = (
  await student.call(
    "PUT",
    `/api/assignments/${assignment.id}/submission`,
    form,
  )
).data;
check(
  submission.files.length === 1 && submission.submittedAt,
  "기존 multipart 제출 계약",
);
check(
  (await admin.call("GET", `/api/submissions/${submission.id}/files`)).data
    .length === 1,
  "관리자 제출 파일 조회",
);
await admin.call("PATCH", `/api/submissions/${submission.id}/review`, {
  score: 95,
  feedback: "피드백 검증 완료",
});
await student.call(
  "PUT",
  `/api/assignments/${assignment.id}/submission`,
  { submitMemo: "잠금 후 수정" },
  409,
);
check(
  (await student.call("GET", `/api/assignments/${assignment.id}`)).data
    .submissionLocked,
  "채점 및 제출 잠금",
);
const attendance = (
  await admin.call("PUT", `/api/cohorts/${cohort.id}/attendance`, {
    userId: user.id,
    date: date(),
    status: "ABSENT",
    unitType: "DATE",
    sessionNo: 0,
  })
).data;
const correction = (
  await student.call(
    "POST",
    `/api/attendance/${attendance.id}/corrections`,
    { requestedStatus: "PRESENT", reason: "기록 정정 요청 검증" },
    201,
  )
).data;
await admin.call("PATCH", `/api/attendance/corrections/${correction.id}`, {
  status: "APPROVED",
});
check(true, "출결 및 소명 승인");
const sessionRecord = (
  await admin.call("PUT", `/api/cohorts/${cohort.id}/attendance`, {
    userId: user.id,
    date: date(),
    status: "ABSENT",
    unitType: "SESSION",
    sessionNo: 1,
  })
).data;
const stale = (
  await student.call(
    "POST",
    `/api/attendance/${sessionRecord.id}/corrections`,
    { requestedStatus: "PRESENT", reason: "버전 충돌 재검증 요청" },
    201,
  )
).data;
await admin.call("PUT", `/api/cohorts/${cohort.id}/attendance`, {
  userId: user.id,
  date: date(),
  status: "LEAVE",
  unitType: "SESSION",
  sessionNo: 1,
});
await admin.call(
  "PATCH",
  `/api/attendance/corrections/${stale.id}`,
  { status: "APPROVED" },
  409,
);
check(true, "출결 변경 후 소명 409 처리");
const assessment = (
  await admin.call(
    "POST",
    `/api/cohorts/${cohort.id}/assessments`,
    {
      title: "기존 평가 API",
      domain: "React",
      startAt: new Date(Date.now() - 3600000).toISOString(),
      endAt: new Date(Date.now() + 3600000).toISOString(),
    },
    201,
  )
).data;
const question = (
  await admin.call(
    "POST",
    `/api/assessments/${assessment.id}/questions`,
    {
      prompt: "상태 변경 방법은?",
      options: [
        { label: "갱신 함수", isCorrect: true },
        { label: "직접 변경", isCorrect: false },
      ],
      points: 10,
      explanation: "갱신 함수를 사용합니다.",
    },
    201,
  )
).data;
await admin.call("PATCH", `/api/assessments/${assessment.id}`, {
  status: "PUBLISHED",
});
const attempt = (
  await student.call(
    "POST",
    `/api/assessments/${assessment.id}/attempts`,
    {},
    201,
  )
).data;
check(!("isCorrect" in attempt.questions[0].options[0]), "응시 중 정답 비공개");
await student.call("PUT", `/api/assessment-attempts/${attempt.id}/answers`, {
  answers: [
    {
      questionId: question.id,
      optionId: question.options.find((x) => x.isCorrect).id,
    },
  ],
});
check(
  (
    await student.call(
      "POST",
      `/api/assessment-attempts/${attempt.id}/submit`,
      {},
    )
  ).data.score === 100,
  "평가 답안 저장·서버 채점",
);
await admin.call("PATCH", `/api/assessments/${assessment.id}`, {
  status: "CLOSED",
});
const report = (
  await admin.call(
    "GET",
    `/api/cohorts/${cohort.id}/assessment-report?userId=${user.id}`,
  )
).data;
check(
  report.results[0].score === 100 &&
    Number(report.results[0].cohortAverage) === 100,
  "기존 회원별 성적 리포트와 해당 평가 기수 평균",
);
await student.call("POST", "/api/notifications/read-all", {});
await student.call("PATCH", "/api/me", {
  name: "검증 완료 수강생",
  phone: "010-0000-0000",
});
check(
  (await student.call("GET", "/api/me")).data.name === "검증 완료 수강생",
  "알림·개인정보",
);
await student.call("POST", "/api/auth/logout", {}, 204);
await student.call("GET", "/api/me", undefined, 401);
check(true, "로그아웃");
console.log(`Passed ${checks} checks using only existing backend-main APIs.`);
