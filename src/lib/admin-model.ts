export type Row = {
  id: number;
  [key: string]: string | number | boolean | null | undefined;
};
export type Resource =
  | "courses"
  | "events"
  | "users"
  | "cohorts"
  | "enrollments"
  | "attendance"
  | "corrections"
  | "posts"
  | "comments"
  | "videos"
  | "chapters"
  | "subjects"
  | "units"
  | "topics"
  | "assignments"
  | "submissions"
  | "assessments"
  | "questions";
export type Store = Record<Resource, Row[]>;
export const labels: Record<string, string> = {
  ADMIN: "관리자",
  INSTRUCTOR: "강사",
  MANAGER: "매니저",
  STUDENT: "수강생",
  ACTIVE: "활성",
  DISABLED: "비활성",
  INACTIVE: "비활성",
  SUSPENDED: "정지",
  PRESENT: "출석",
  LATE: "지각",
  ABSENT: "결석",
  EXCUSED: "공결",
  LEAVE: "휴가",
  EARLY: "조퇴",
  PENDING: "대기",
  APPROVED: "승인",
  REJECTED: "반려",
  INVALIDATED: "무효화 · 409",
  SENT: "전송 완료",
  FAILED: "전송 실패",
  COURSE: "과정공지",
  SYSTEM: "시스템공지",
  FAQ: "FAQ",
  QUESTION: "학습질문",
  COHORT: "기수 공개",
  PUBLIC: "공개",
  PRIVATE: "비공개",
  DRAFT: "초안",
  PUBLISHED: "게시 중",
  CLOSED: "종료",
  DATE: "일자",
  SESSION: "회차",
  SUBMITTED: "제출 완료",
  REVIEWED: "채점 완료",
};
export const transitions = [
  "ABSENT>LATE",
  "ABSENT>PRESENT",
  "LATE>PRESENT",
  "EXCUSED>PRESENT",
  "LEAVE>PRESENT",
  "EARLY>PRESENT",
];
export const today = () =>
  new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
export function youtubeId(value: string) {
  try {
    const u = new URL(value);
    if (u.protocol !== "https:" || u.username || u.password) return null;
    const id =
      ["youtube.com", "www.youtube.com"].includes(u.hostname) &&
      u.pathname === "/watch"
        ? u.searchParams.get("v")
        : u.hostname === "youtu.be"
          ? u.pathname.slice(1)
          : null;
    return id && /^[\w-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}
export function seed(): Store {
  return {
    courses: [
      {
        id: 1,
        title: "AM Inspire Camp",
        description: "교육 과정",
        totalHours: 960,
      },
    ],
    events: [],
    users: [
      {
        id: 1,
        name: "이지원",
        email: "jiwon@inspire.camp",
        role: "ADMIN",
        status: "ACTIVE",
        provisionedBy: null,
        provisionedAt: null,
      },
      {
        id: 2,
        name: "김도윤",
        email: "doyun@inspire.camp",
        role: "STUDENT",
        status: "ACTIVE",
        phone: "010-1234-5678",
        provisionedBy: 1,
        provisionedAt: "2026-11-02T00:30:00Z",
      },
      {
        id: 3,
        name: "박서연",
        email: "seoyeon@inspire.camp",
        role: "STUDENT",
        status: "ACTIVE",
        provisionedBy: 1,
        provisionedAt: "2026-11-02T00:35:00Z",
      },
      {
        id: 4,
        name: "정현우",
        email: "hyunwoo@inspire.camp",
        role: "INSTRUCTOR",
        status: "ACTIVE",
        provisionedBy: 1,
        provisionedAt: "2026-11-01T00:00:00Z",
      },
      {
        id: 5,
        name: "최민준",
        email: "minjun@inspire.camp",
        role: "STUDENT",
        status: "ACTIVE",
        provisionedBy: 1,
        provisionedAt: "2026-11-02T01:00:00Z",
      },
    ],
    cohorts: [
      {
        id: 1,
        courseId: 1,
        name: "AM Inspire Camp 6기",
        startDate: "2026-09-01",
        endDate: "2027-02-28",
        status: "ACTIVE",
      },
      {
        id: 2,
        courseId: 1,
        name: "AM Inspire Camp 7기",
        startDate: "2027-03-01",
        endDate: "2027-08-31",
        status: "ACTIVE",
      },
    ],
    enrollments: [
      { id: 1, cohortId: 1, userId: 2, role: "STUDENT", status: "ACTIVE" },
      { id: 2, cohortId: 1, userId: 3, role: "STUDENT", status: "ACTIVE" },
      { id: 3, cohortId: 1, userId: 4, role: "INSTRUCTOR", status: "ACTIVE" },
      { id: 4, cohortId: 1, userId: 5, role: "STUDENT", status: "ACTIVE" },
    ],
    attendance: ["ABSENT", "LATE", "EXCUSED", "LEAVE", "EARLY", "PRESENT"].map(
      (status, i) => ({
        id: i + 1,
        cohortId: 1,
        userId: [2, 3, 5][i % 3],
        date: "2026-11-06",
        unitType: i > 2 ? "SESSION" : "DATE",
        sessionNo: i > 2 ? i - 2 : 0,
        status,
        version: 1,
      }),
    ),
    corrections: ["ABSENT", "LATE", "EXCUSED", "LEAVE", "EARLY"].map(
      (status, i) => ({
        id: i + 1,
        cohortId: 1,
        attendanceId: i + 1,
        userId: [2, 3, 5][i % 3],
        originalStatus: status,
        originalVersion: 1,
        requestedStatus: "PRESENT",
        status: "PENDING",
        reason: [
          "교통 지연으로 입실 기록 확인을 요청합니다.",
          "출석 체크가 늦게 반영되었습니다.",
          "교육장 출석으로 정정 요청합니다.",
        ][i % 3],
      }),
    ),
    posts: [
      {
        id: 1,
        cohortId: 1,
        category: "COURSE",
        title: "이번 주 해커톤 운영 안내",
        body: "팀별 기획과 개발을 진행합니다. 최종 발표는 금요일 오후 2시입니다.",
        pinned: true,
        visibility: "PUBLIC",
        publicSlug: "hackathon-guide",
        deliveryStatus: "SENT",
        createdAt: "2026-11-09T00:00:00Z",
      },
      {
        id: 2,
        cohortId: 1,
        category: "SYSTEM",
        title: "학습 포털 점검 안내",
        body: "일요일 오전 2시부터 3시까지 시스템 점검이 예정되어 있습니다.",
        visibility: "PUBLIC",
        publicSlug: "system-maintenance",
        deliveryStatus: "FAILED",
      },
      {
        id: 3,
        cohortId: 1,
        category: "FAQ",
        title: "출결 소명은 어떻게 신청하나요?",
        body: "캘린더에서 출결 기록을 선택하여 소명을 요청해 주세요.",
        visibility: "COHORT",
      },
      {
        id: 4,
        cohortId: 1,
        category: "QUESTION",
        title: "React의 상태 업데이트가 비동기인 이유가 궁금해요",
        body: "여러 번 setState를 호출할 때의 동작을 알고 싶습니다.",
        visibility: "COHORT",
      },
    ],
    comments: [
      {
        id: 1,
        postId: 4,
        cohortId: 1,
        body: "React는 여러 상태 변경을 배치하여 불필요한 렌더링을 줄입니다.",
        authorId: 4,
      },
    ],
    videos: [
      {
        id: 1,
        cohortId: 1,
        title: "React 상태와 렌더링 이해하기",
        lectureDate: "2026-11-06",
        periodNo: 1,
        youtubeUrl: "https://www.youtube.com/watch?v=Tn6-PIqc4UM",
        visibility: "PUBLIC",
      },
      {
        id: 2,
        cohortId: 1,
        title: "컴포넌트 설계 실습",
        lectureDate: "2026-11-06",
        periodNo: 2,
        youtubeUrl: "https://youtu.be/Tn6-PIqc4UM",
        visibility: "PRIVATE",
      },
    ],
    chapters: [
      {
        id: 1,
        cohortId: 1,
        videoId: 1,
        title: "상태 업데이트와 배치",
        startSeconds: 120,
        topicId: 1,
      },
      {
        id: 2,
        cohortId: 1,
        videoId: 1,
        title: "렌더링 최적화",
        startSeconds: 480,
        topicId: 2,
      },
    ],
    subjects: [{ id: 1, cohortId: 1, title: "프론트엔드 개발" }],
    units: [{ id: 1, cohortId: 1, subjectId: 1, title: "React 핵심 원리" }],
    topics: [
      { id: 1, cohortId: 1, unitId: 1, title: "상태 관리" },
      { id: 2, cohortId: 1, unitId: 1, title: "렌더링" },
    ],
    assignments: [
      {
        id: 1,
        cohortId: 1,
        title: "React 대시보드 구현",
        description:
          "컴포넌트를 분리하고 상태 관리를 적용해 대시보드를 구현하세요.",
        instructorId: 4,
        instructorName: "정현우",
        authorId: 1,
        dueAt: "2026-11-13T23:59",
        maxScore: 100,
      },
      {
        id: 2,
        cohortId: 1,
        title: "API 연동 실습",
        description: "로딩과 오류 상태를 포함한 API 연동을 구현하세요.",
        instructorId: 4,
        instructorName: "정현우",
        authorId: 1,
        dueAt: "2026-11-16T23:59",
        maxScore: 100,
      },
    ],
    submissions: [
      {
        id: 1,
        cohortId: 1,
        assignmentId: 1,
        userId: 2,
        body: "대시보드 구현 과제를 제출합니다.",
        submittedAt: "2026-11-08T07:32:00Z",
        fileName: "dashboard.tsx",
        fileContent:
          "export default function Dashboard() { return <main>Dashboard</main>; }",
        status: "SUBMITTED",
      },
      {
        id: 2,
        cohortId: 1,
        assignmentId: 1,
        userId: 3,
        body: "리뷰 부탁드립니다.",
        submittedAt: "2026-11-08T09:12:00Z",
        fileName: "README.md",
        fileContent: "# React dashboard\n컴포넌트와 상태 관리 실습",
        status: "REVIEWED",
        score: 92,
        feedback: "컴포넌트 구성이 명확합니다. 로딩 상태를 보완해 주세요.",
      },
    ],
    assessments: [
      {
        id: 1,
        cohortId: 1,
        title: "React 핵심 역량평가",
        description: "상태 관리와 렌더링의 이해도를 확인합니다.",
        domain: "프론트엔드",
        startAt: "2026-11-12T09:00",
        endAt: "2026-11-12T10:00",
        durationMinutes: 40,
        status: "DRAFT",
      },
      {
        id: 2,
        cohortId: 1,
        title: "JavaScript 기초 평가",
        domain: "프론트엔드",
        status: "CLOSED",
        average: 84,
        completedCount: 3,
      },
    ],
    questions: [
      {
        id: 1,
        cohortId: 1,
        assessmentId: 1,
        prompt: "React에서 상태를 변경하는 올바른 방법은?",
        option1: "상태를 직접 수정한다",
        option2: "상태 갱신 함수를 호출한다",
        option3: "DOM을 직접 수정한다",
        option4: "페이지를 새로고침한다",
        correct: 2,
        explanation:
          "상태 갱신 함수는 React에 변경을 알려 렌더링을 예약합니다.",
        points: 10,
        topicId: 1,
        chapterId: 1,
      },
    ],
  };
}
