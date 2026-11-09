import type { Resource } from "./admin-model";
// Only resources with controllers in the team's existing backend main.
export const API_RESOURCES: readonly Resource[] = [
  "courses",
  "events",
  "users",
  "cohorts",
  "enrollments",
  "attendance",
  "corrections",
  "posts",
  "comments",
  "assignments",
  "submissions",
  "assessments",
  "questions",
];
export const isApiResource = (resource: Resource) =>
  API_RESOURCES.includes(resource);
export const UNAVAILABLE_MESSAGE =
  "현재 백엔드에서 제공하지 않는 기능입니다. 목업 모드에서는 화면을 시연할 수 있습니다.";
