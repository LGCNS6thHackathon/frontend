import { Resource } from "@/lib/admin-model";
export type Field = {
  key: string;
  label: string;
  type?: string;
  options?: string[];
  ref?: Resource;
  optional?: boolean;
  min?: number;
  max?: number;
  initial?: string | number;
};
export type Config = {
  title: string;
  singular: string;
  description: string;
  fields: Field[];
  columns: string[];
  parent?: string;
  noCreate?: boolean;
};
const title: Field = { key: "title", label: "제목" };
const body: Field = { key: "body", label: "본문", type: "textarea" };
const user: Field = { key: "userId", label: "회원", ref: "users" };
const statuses = ["PRESENT", "LATE", "ABSENT", "EXCUSED", "LEAVE", "EARLY"];
export const configs: Record<Resource, Config> = {
  courses: {
    title: "교육 과정",
    singular: "교육 과정",
    description: "기수를 등록할 상위 교육 과정을 관리합니다.",
    columns: ["title", "totalHours", "description"],
    fields: [
      title,
      {
        key: "totalHours",
        label: "교육 시간",
        type: "number",
        min: 0,
        max: 10000,
        initial: 0,
      },
      { key: "description", label: "설명", type: "textarea", optional: true },
    ],
  },
  events: {
    title: "교육 일정",
    singular: "일정",
    description: "수강생 캘린더에 표시되는 일정을 관리합니다.",
    columns: ["title", "type", "startAt", "endAt", "location"],
    fields: [
      title,
      {
        key: "type",
        label: "일정 분류",
        options: ["LECTURE", "PROJECT", "SPECIAL", "HOLIDAY"],
      },
      { key: "startAt", label: "시작 시각", type: "datetime-local" },
      { key: "endAt", label: "종료 시각", type: "datetime-local" },
      { key: "location", label: "장소", optional: true },
      { key: "description", label: "설명", type: "textarea", optional: true },
    ],
  },
  users: {
    title: "회원 목록",
    singular: "수강생 계정",
    description:
      "계정 발급과 권한 변경을 관리합니다. 기수 배정은 별도로 진행하세요.",
    columns: [
      "name",
      "email",
      "role",
      "status",
      "provisionedBy",
      "provisionedAt",
    ],
    fields: [
      { key: "name", label: "이름" },
      { key: "email", label: "이메일", type: "email" },
      { key: "password", label: "초기 비밀번호", type: "password" },
      { key: "phone", label: "전화번호", type: "tel", optional: true },
      {
        key: "role",
        label: "권한",
        options: ["STUDENT", "INSTRUCTOR", "ADMIN"],
      },
      { key: "status", label: "계정 상태", options: ["ACTIVE", "DISABLED"] },
    ],
  },
  cohorts: {
    title: "기수 목록",
    singular: "기수",
    description: "교육 기간과 소속 과정을 등록합니다.",
    columns: ["name", "startDate", "endDate"],
    fields: [
      { key: "name", label: "기수 이름" },
      { key: "courseId", label: "교육 과정", ref: "courses" },
      { key: "startDate", label: "시작일", type: "date" },
      { key: "endDate", label: "종료일", type: "date" },
    ],
  },
  enrollments: {
    title: "기수 배정",
    singular: "기수 배정",
    description: "수강생·강사·매니저의 기수 소속을 지정합니다.",
    columns: ["userId", "role", "status"],
    fields: [
      user,
      {
        key: "role",
        label: "등록 역할",
        options: ["STUDENT", "INSTRUCTOR", "MANAGER"],
      },
      { key: "status", label: "등록 상태", options: ["ACTIVE", "WITHDRAWN"] },
    ],
  },
  attendance: {
    title: "출결 기록",
    singular: "출결",
    description:
      "일자 또는 회차 단위로 관리합니다. 정정 대상 전환은 소명 승인으로 처리합니다.",
    columns: ["userId", "date", "unitType", "sessionNo", "status", "version"],
    fields: [
      user,
      { key: "date", label: "교육 날짜", type: "date" },
      { key: "unitType", label: "출결 단위", options: ["DATE", "SESSION"] },
      {
        key: "sessionNo",
        label: "회차 (일자 0 / 회차 1 이상)",
        type: "number",
        min: 0,
        initial: 0,
      },
      { key: "status", label: "출결 상태", options: statuses },
      { key: "note", label: "운영 메모", type: "textarea", optional: true },
    ],
  },
  corrections: {
    title: "소명 승인 큐",
    singular: "소명",
    description:
      "결석→지각/출석 · 지각/공결/휴가/조퇴→출석, 총 6가지 전환을 승인합니다.",
    noCreate: true,
    columns: [
      "userId",
      "originalStatus",
      "requestedStatus",
      "reason",
      "originalVersion",
      "status",
    ],
    fields: [],
  },
  posts: {
    title: "게시글 목록",
    singular: "게시글",
    description: "과정·시스템 공지, FAQ와 학습질문을 한곳에서 관리합니다.",
    columns: ["category", "title", "pinned", "visibility", "deliveryStatus"],
    fields: [
      {
        key: "category",
        label: "게시판",
        options: ["COURSE", "SYSTEM", "FAQ", "QUESTION"],
      },
      title,
      body,
      { key: "pinned", label: "상단 고정", type: "checkbox", optional: true },
      { key: "visibility", label: "공개 범위", options: ["COHORT", "PUBLIC"] },
      { key: "publicSlug", label: "공개 링크 슬러그", optional: true },
      { key: "attachment", label: "첨부파일", type: "file", optional: true },
    ],
  },
  comments: {
    title: "답변 관리",
    singular: "답변",
    description: "학습질문에 강사·관리자 답변을 남깁니다.",
    parent: "postId",
    columns: ["body", "authorId"],
    fields: [body],
  },
  videos: {
    title: "강의 다시보기",
    singular: "강의 영상",
    description: "날짜·교시별 YouTube 영상과 공개 상태를 관리합니다.",
    columns: ["lectureDate", "periodNo", "title", "visibility"],
    fields: [
      title,
      { key: "lectureDate", label: "교육 날짜", type: "date" },
      { key: "periodNo", label: "교시", type: "number", min: 1, initial: 1 },
      { key: "youtubeUrl", label: "YouTube URL", type: "url" },
      { key: "visibility", label: "공개 상태", options: ["PUBLIC", "PRIVATE"] },
    ],
  },
  chapters: {
    title: "영상 소단원",
    singular: "소단원",
    description: "시작 시점을 지정하여 해당 구간으로 바로 연결합니다.",
    parent: "videoId",
    columns: ["title", "startSeconds", "topicId"],
    fields: [
      title,
      {
        key: "startSeconds",
        label: "시작 시점 (초)",
        type: "number",
        min: 0,
        initial: 0,
      },
      { key: "topicId", label: "핵심 개념", ref: "topics", optional: true },
    ],
  },
  subjects: {
    title: "학습 과목",
    singular: "과목",
    description: "과목 → 단원 → 핵심 개념의 3단계 커리큘럼을 구성합니다.",
    columns: ["title"],
    fields: [title],
  },
  units: {
    title: "단원",
    singular: "단원",
    description: "선택한 과목의 단원을 관리합니다.",
    parent: "subjectId",
    columns: ["title"],
    fields: [title],
  },
  topics: {
    title: "핵심 개념",
    singular: "핵심 개념",
    description: "평가 문항·복습 영상 분류에 사용합니다.",
    parent: "unitId",
    columns: ["title", "description"],
    fields: [
      title,
      { key: "description", label: "설명", type: "textarea", optional: true },
    ],
  },
  assignments: {
    title: "과제 목록",
    singular: "과제",
    description: "담당 강사와 등록자를 구분하고 제출 기한·배점을 설정합니다.",
    columns: ["title", "instructorName", "dueAt", "maxScore", "authorId"],
    fields: [
      title,
      { key: "instructorId", label: "담당 강사", ref: "users" },
      { key: "dueAt", label: "제출 기한 (한국 시간)", type: "datetime-local" },
      {
        key: "maxScore",
        label: "만점 배점",
        type: "number",
        min: 1,
        max: 1000,
        initial: 100,
      },
      { key: "description", label: "과제 안내", type: "textarea" },
      {
        key: "attachment",
        label: "안내 첨부파일",
        type: "file",
        optional: true,
      },
    ],
  },
  submissions: {
    title: "제출물 · 채점",
    singular: "채점 및 피드백",
    description:
      "최종 성공 업로드 시각을 표시합니다. 채점 후 학생의 수정은 잠깁니다.",
    parent: "assignmentId",
    noCreate: true,
    columns: ["userId", "submittedAt", "fileName", "status", "score"],
    fields: [
      { key: "score", label: "점수", type: "number", min: 0, initial: 0 },
      { key: "feedback", label: "피드백", type: "textarea" },
    ],
  },
  assessments: {
    title: "역량평가 목록",
    singular: "평가 초안",
    description:
      "문항 작성 → 게시 → 종료 순서로 운영합니다. 게시 후 문항은 잠깁니다.",
    columns: ["title", "domain", "status", "durationMinutes"],
    fields: [
      title,
      { key: "domain", label: "평가 영역", initial: "프론트엔드" },
      {
        key: "description",
        label: "평가 안내",
        type: "textarea",
        optional: true,
      },
      {
        key: "startAt",
        label: "시작 시각 (한국 시간)",
        type: "datetime-local",
      },
      { key: "endAt", label: "종료 시각 (한국 시간)", type: "datetime-local" },
      {
        key: "durationMinutes",
        label: "제한 시간 (분)",
        type: "number",
        min: 1,
        max: 480,
        initial: 40,
      },
    ],
  },
  questions: {
    title: "평가 문항",
    singular: "객관식 문항",
    description:
      "정답은 하나만 지정합니다. 미분류 또는 복습 영상 연결 없음도 허용합니다.",
    parent: "assessmentId",
    columns: ["prompt", "points", "topicId", "chapterId"],
    fields: [
      { key: "prompt", label: "문항 지문", type: "textarea" },
      {
        key: "optionCount",
        label: "선택지 수",
        type: "number",
        min: 2,
        max: 10,
        initial: 4,
      },
      ...[1, 2, 3, 4].map((i) => ({ key: `option${i}`, label: `선택지 ${i}` })),
      { key: "correct", label: "정답 번호", options: ["1", "2", "3", "4"] },
      {
        key: "points",
        label: "배점",
        type: "number",
        min: 1,
        max: 100,
        initial: 10,
      },
      { key: "explanation", label: "해설", type: "textarea" },
      {
        key: "topicId",
        label: "과목 / 단원 / 핵심 개념",
        ref: "topics",
        optional: true,
      },
      {
        key: "chapterId",
        label: "복습 강의 챕터",
        ref: "chapters",
        optional: true,
      },
    ],
  },
};
export const columnLabels: Record<string, string> = {
  totalHours: "교육 시간",
  type: "분류",
  startAt: "시작 시각",
  endAt: "종료 시각",
  location: "장소",
  name: "이름",
  email: "이메일",
  role: "역할",
  status: "상태",
  provisionedBy: "발급자",
  provisionedAt: "발급 시각",
  startDate: "교육 시작",
  endDate: "교육 종료",
  userId: "회원",
  date: "교육 날짜",
  unitType: "단위",
  sessionNo: "회차",
  version: "버전",
  originalStatus: "원본",
  requestedStatus: "요청",
  originalVersion: "원본 버전",
  reason: "소명 사유",
  category: "분류",
  title: "제목",
  pinned: "고정",
  visibility: "공개 범위",
  deliveryStatus: "Discord",
  body: "답변",
  authorId: "등록자",
  lectureDate: "교육 날짜",
  periodNo: "교시",
  startSeconds: "시작(초)",
  topicId: "핵심 개념",
  description: "설명",
  instructorName: "담당 강사",
  dueAt: "제출 기한",
  maxScore: "만점",
  submittedAt: "최종 업로드",
  fileName: "제출 파일",
  score: "점수",
  domain: "영역",
  durationMinutes: "제한(분)",
  prompt: "문항 지문",
  points: "배점",
  chapterId: "복습 영상",
};
export const menus = [
  {
    name: "계정·기수",
    subtitle: "수강생 발급 / 기수 배정",
    resources: ["users", "courses", "cohorts", "enrollments"],
  },
  {
    name: "출결·소명",
    subtitle: "일자·회차 출결 / 정정 승인",
    resources: ["attendance", "corrections", "events"],
  },
  {
    name: "게시판·Discord",
    subtitle: "공지 / FAQ / 학습질문",
    resources: ["posts"],
  },
  {
    name: "영상·커리큘럼",
    subtitle: "다시보기 / 학습 주제 트리",
    resources: ["videos", "subjects"],
  },
  {
    name: "과제·피드백",
    subtitle: "과제 운영 / 제출물 평가",
    resources: ["assignments"],
  },
  {
    name: "역량평가·복습",
    subtitle: "평가 출제 / 해설 영상 연결",
    resources: ["assessments"],
  },
] as const;
