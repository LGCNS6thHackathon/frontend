import { isApiResource, UNAVAILABLE_MESSAGE } from "./backend-capabilities";
import { api as authenticatedApi, FileInfo } from "./api-client";
import { Resource, Row } from "./admin-model";
export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
type RawRow = Record<string, unknown>;
type Page = {
  items: RawRow[];
  total: number;
  questions?: RawRow[];
};
function normalize(resource: Resource, raw: RawRow): Row {
  const row = { ...raw } as Row;
  if (resource === "attendance") row.date = String(raw.attendanceDate);
  if (resource === "submissions")
    row.status = raw.score == null ? "SUBMITTED" : "REVIEWED";
  if (resource === "questions" && Array.isArray(raw.options)) {
    row.optionCount = raw.options.length;
    raw.options.forEach((option, i) => {
      row[`option${i + 1}`] = option.label;
      if (option.isCorrect) row.correct = i + 1;
    });
  }
  for (const key of ["dueAt", "startAt", "endAt"]) {
    if (typeof raw[key] === "string") {
      const date = new Date(raw[key] as string);
      if (!Number.isNaN(date.valueOf()))
        row[key] = new Date(date.valueOf() + 9 * 3600000)
          .toISOString()
          .slice(0, 16);
    }
  }
  if (Array.isArray(raw.files)) {
    const files = raw.files as FileInfo[];
    row.fileName = files.map((f) => f.originalName).join(", ");
    row.fileIds = JSON.stringify(files.map((f) => f.id));
  }
  return row;
}
// Token remains in memory. The host application supplies an authenticated ADMIN token.
export function createAdminApi(
  baseUrl: string,
  token: string,
  cohortId: number,
) {
  const request = async <T>(
    path: string,
    method = "GET",
    body?: unknown,
  ): Promise<T> => {
    if (!baseUrl) return authenticatedApi<T>(path, method, body);
    const response = await fetch(`${baseUrl.replace(/\/$/, "")}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body instanceof FormData
          ? {}
          : { "Content-Type": "application/json" }),
      },
      body:
        body === undefined
          ? undefined
          : body instanceof FormData
            ? body
            : JSON.stringify(body),
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(
        response.status,
        error.message || `요청 실패 (${response.status})`,
      );
    }
    return response.status === 204 ? (undefined as T) : response.json();
  };
  function check(resource: Resource) {
    if (!isApiResource(resource)) throw new ApiError(501, UNAVAILABLE_MESSAGE);
  }
  function collection(resource: Resource, parent?: number) {
    switch (resource) {
      case "courses":
        return "/api/courses";
      case "videos":
        return `/api/admin/cohorts/${cohortId}/lecture-videos`;
      case "posts":
        return `/api/admin/cohorts/${cohortId}/posts`;
      case "users":
        return "/api/users";
      case "cohorts":
        return "/api/cohorts";
      case "comments":
        return `/api/posts/${parent}/comments`;
      case "submissions":
        return `/api/assignments/${parent}/submissions`;
      case "questions":
        return `/api/assessments/${parent}`;
      default:
        return `/api/cohorts/${cohortId}/${resource === "corrections" ? "attendance/corrections" : resource}`;
    }
  }
  const item = (resource: Resource, id: number) =>
    resource === "videos" ? `/api/admin/lecture-videos/${id}` : resource === "posts" ? `/api/admin/posts/${id}` :
    `/api/${resource === "corrections" ? "attendance/corrections" : resource === "questions" ? "assessment-questions" : resource}/${id}`;
  return {
    request,
    async list(resource: Resource, parent?: number): Promise<Row[]> {
      check(resource);
      // Fetch every page rather than silently truncating an administrative list at 100 rows.
      const all: RawRow[] = [];
      for (let page = 0; ; page++) {
        const result = await request<RawRow[] | Page>(
          collection(resource, parent) +
            (resource === "questions" ? "" : `?size=100&page=${page}`),
        );
        if (Array.isArray(result)) {
          all.push(...result);
          break;
        }
        const rows =
          resource === "questions"
            ? result.questions || []
            : result.items || [];
        all.push(...rows);
        if (
          resource === "questions" ||
          !rows.length ||
          all.length >= result.total
        )
          break;
      }
      const detailed =
        resource === "posts"
          ? await Promise.all(
              all.map((row) => request<RawRow>(`/api/admin/posts/${row.id}`)),
            )
          : all;
      const parentField: Partial<Record<Resource, string>> = {
        chapters: "videoId",
        units: "subjectId",
        topics: "unitId",
      };
      const normalized = detailed
        .map((row) => normalize(resource, row))
        .filter(
          (row) =>
            !parent ||
            !parentField[resource] ||
            row[parentField[resource]!] === parent,
        );
      if (resource !== "posts" || !normalized.length) return normalized;
      try {
        const statuses = await request<Record<string, string>>(
          `/api/cohorts/${cohortId}/discord-deliveries`,
        );
        if (!statuses || typeof statuses !== "object" || Array.isArray(statuses))
          throw Error("Invalid Discord status response");
        return normalized.map(row => ({ ...row,
          deliveryStatus: statuses[String(row.id)] == null ? null :
            ["PENDING", "SENT", "FAILED"].includes(statuses[String(row.id)])
              ? statuses[String(row.id)] : "UNKNOWN",
        }));
      } catch {
        // A failed lookup must never make a previously sent notice appear unsent.
        return normalized.map(row => ({ ...row, deliveryStatus: "UNKNOWN" }));
      }
    },
    async save(
      resource: Resource,
      data: Row,
      isNew: boolean,
      parent?: number,
      original?: Row,
    ) {
      check(resource);
      if (resource === "users" && !isNew && data.role === "MANAGER")
        throw new ApiError(
          501,
          "현재 회원 API의 전역 역할에는 MANAGER가 없습니다. 기수 배정에서 MANAGER로 지정하세요.",
        );
      const keys: Partial<Record<Resource, string[]>> = {
        videos: ["title", "youtubeUrl", "lectureDate", "periodNo", "durationSeconds", "visibility"],
        courses: ["title", "description", "totalHours"],
        events: [
          "title",
          "type",
          "startAt",
          "endAt",
          "location",
          "description",
        ],
        users: isNew
          ? ["name", "email", "password", "phone"]
          : ["role", "status"],
        cohorts: ["name", "startDate", "endDate"],
        enrollments: ["userId", "role", "status"],
        attendance: [
          "userId",
          "date",
          "unitType",
          "sessionNo",
          "status",
          "note",
          "checkIn",
          "checkOut",
        ],
        posts: ["category", "title", "body", "pinned"],
        comments: ["body"],
        assignments: [
          "title",
          "description",
          "dueAt",
          "maxScore",
          "instructorId",
          "instructorName",
          "subject",
        ],
        submissions: ["score", "feedback"],
        assessments: [
          "title",
          "description",
          "domain",
          "startAt",
          "endAt",
          "durationMinutes",
        ],
        questions: ["prompt", "explanation", "points", "topicId", "chapterId"],
      };
      const payload: Record<string, unknown> = {};
      for (const key of keys[resource] || [])
        if (
          data[key] !== undefined &&
          (isNew ||
            resource === "attendance" ||
            !original ||
            data[key] !== original[key])
        )
          payload[key] = data[key];
      for (const key of ["dueAt", "startAt", "endAt"])
        if (typeof payload[key] === "string")
          payload[key] = `${String(payload[key]).slice(0, 16)}:00+09:00`;
      if (resource === "questions")
        payload.options = Array.from(
          { length: Number(data.optionCount || 4) },
          (_, index) => index + 1,
        ).map((i) => ({
          label: data[`option${i}`],
          isCorrect: Number(data.correct) === i,
        }));
      if (resource === "enrollments" && !isNew)
        return request<Row>(
          `/api/cohorts/${cohortId}/enrollments/${data.id}`,
          "PATCH",
          payload,
        );
      if (
        !isNew &&
        !["questions", "submissions", "attendance"].includes(resource) &&
        !Object.keys(payload).length
      )
        return data;
      if (resource === "submissions")
        return request<Row>(
          `/api/submissions/${data.id}/review`,
          "PATCH",
          payload,
        );
      if (resource === "attendance")
        return request<Row>(collection(resource), "PUT", payload);
      if (resource === "cohorts" && isNew)
        return request<Row>(
          `/api/courses/${data.courseId}/cohorts`,
          "POST",
          payload,
        );
      if (resource === "questions" && isNew)
        return request<Row>(
          `/api/assessments/${parent}/questions`,
          "POST",
          payload,
        );
      return request<Row>(
        isNew ? collection(resource, parent) : item(resource, data.id),
        isNew ? "POST" : "PATCH",
        payload,
      );
    },
    async remove(resource: Resource, id: number) {
      check(resource);
      return request<void>(item(resource, id), "DELETE");
    },
    async upload(resource: "posts" | "assignments", id: number, file: File) {
      const form = new FormData();
      form.set("file", file);
      return request(`/api/${resource}/${id}/files`, "POST", form);
    },
  };
}
