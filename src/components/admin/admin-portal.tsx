"use client";
import { isApiResource, UNAVAILABLE_MESSAGE } from "@/lib/backend-capabilities";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  ClipboardCheck,
  GraduationCap,
  Inbox,
  Moon,
  Sun,
  Loader2,
  MessageSquare,
  Plus,
  Search,
  ShieldCheck,
  Users,
  Video,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { configs, columnLabels, Field, menus } from "./config";
import {
  labels,
  Resource,
  Row,
  seed,
  Store,
  today,
  transitions,
  youtubeId,
} from "@/lib/admin-model";
import { useSession, SessionToolbar } from "@/components/live/session";
import { api as sessionApi, downloadFile, FileInfo } from "@/lib/api-client";
import { sendDiscord, DeliveryStatus } from "@/lib/discord-delivery";
import { ApiError, createAdminApi } from "@/lib/admin-api";
const icons = [
  Users,
  ClipboardCheck,
  MessageSquare,
  Video,
  BookOpen,
  GraduationCap,
];
function emptyStore(): Store {
  const store = seed();
  for (const key of Object.keys(store) as Resource[]) store[key] = [];
  return store;
}
const storageKey = "inspire-admin-demo-v1";
const fileData = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(Error("첨부파일을 읽지 못했습니다."));
    reader.readAsDataURL(file);
  });
type Panel = {
  resource: Resource;
  parent?: number;
  parentLabel?: string;
};
type Editor = {
  resource: Resource;
  row: Row;
  isNew: boolean;
  parent?: number;
};
type Toast = {
  id: number;
  text: string;
  error?: boolean;
};
const time = (v: unknown) =>
  v
    ? new Date(String(v)).toLocaleString("ko-KR", {
        timeZone: "Asia/Seoul",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
export default function AdminPortal() {
  const session = useSession();
  const [isDark, setIsDark] = useState(false);
  const [mockStore, setStore] = useState<Store>(seed);
  const [apiStore, setApiStore] = useState<Store>(() => emptyStore());
  const [ready, setReady] = useState(false);
  const [tab, setTab] = useState(0);
  const [panel, setPanel] = useState<Panel>({ resource: "users" });
  const [editor, setEditor] = useState<Editor | null>(null);
  const [draft, setDraft] = useState<Row>({ id: 0 });
  const [file, setFile] = useState<File | null>(null);
  const [cohort, setCohort] = useState(session.cohort?.id || 0);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("");
  const [empty, setEmpty] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [busy, setBusy] = useState(false);
  const [mode] = useState<"mock" | "api">(session.mode);
  const [settings, setSettings] = useState(false);
  const [baseUrl] = useState("");
  const [token] = useState("");
  const deliveryLocks = useRef(new Set<string>());
  const [deliveryOverrides, setDeliveryOverrides] = useState<Record<string, DeliveryStatus>>({});
  const [apiRows, setApiRows] = useState<Row[]>([]);
  const [loadError, setLoadError] = useState("");
  const loadVersion = useRef(0);
  const currentView = useRef({ cohort, resource: panel.resource, parent: panel.parent });
  currentView.current = { cohort, resource: panel.resource, parent: panel.parent };
  const [reportTarget, setReportTarget] = useState(0);
  const [reportRows, setReportRows] = useState<Row[]>([]);
  const [reportError, setReportError] = useState("");
  useEffect(() => {
    setReportTarget(0);
    setReportRows([]);
  }, [cohort]);
  useEffect(() => {
    if (mode !== "api" || tab !== 5 || !cohort || !reportTarget) return;
    let cancelled = false;
    setReportRows([]);
    setReportError("");
    sessionApi<{ results: Row[] }>(
      `/api/cohorts/${cohort}/assessment-report?userId=${reportTarget}`,
    )
      .then((data) => {
        if (!cancelled) setReportRows(data.results);
      })
      .catch((e) => {
        if (!cancelled) setReportError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, tab, cohort, reportTarget]);
  const store = mode === "mock" ? mockStore : apiStore;
  const api = createAdminApi(baseUrl, token, cohort);
  useEffect(() => {
    if (mode === "api" && session.cohort?.id) setCohort(session.cohort.id);
  }, [session.cohort?.id, mode]);
  const notify = (text: string, error = false) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t.slice(-3), { id, text, error }]);
    window.setTimeout(
      () => setToasts((t) => t.filter((x) => x.id !== id)),
      6500,
    );
  };
  useEffect(() => {
    const dark =
      document.documentElement.classList.contains("dark") ||
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Object.keys(seed()).every((k) => Array.isArray(parsed[k])))
          setStore(parsed);
      }
    } catch {}
    setReady(true);
  }, []);
  useEffect(() => {
    if (ready)
      try {
        localStorage.setItem(storageKey, JSON.stringify(mockStore));
      } catch {}
  }, [mockStore, ready]);
  useEffect(() => {
    if (mode !== "api") return;
    let cancelled = false;
    setApiStore(emptyStore());
    const client = createAdminApi(baseUrl, token, cohort);
    const resources: Resource[] = [
      "courses",
      "events",
      "users",
      "cohorts",
      "enrollments",
      "assignments",
      "assessments",
      "corrections",
    ];
    const scopedResources = resources.filter(
      (resource) =>
        cohort > 0 || ["users", "courses", "cohorts"].includes(resource),
    );
    Promise.allSettled(
      scopedResources.map((resource) => client.list(resource)),
    ).then((results) => {
      if (cancelled) return;
      setApiStore((current) => {
        const next = { ...current };
        results.forEach((result, i) => {
          if (result.status === "fulfilled")
            next[scopedResources[i]] = result.value.map((row) => ({
              ...row,
              cohortId: row.cohortId ?? cohort,
            }));
        });
        return next;
      });
    });
    return () => {
      cancelled = true;
    };
  }, [mode, baseUrl, token, cohort]);
  // API reads are scoped to the active resource. Failures never fall back to demo data.
  useEffect(() => {
    if (mode !== "api") return;
    if (!isApiResource(panel.resource)) {
      setApiRows([]);
      setLoadError("");
      setBusy(false);
      return;
    }
    let cancelled = false;
    const version = ++loadVersion.current;
    setApiRows([]);
    setLoadError("");
    setBusy(true);
    createAdminApi(baseUrl, token, cohort)
      .list(panel.resource, panel.parent)
      .then((rows) => {
        if (!cancelled && version === loadVersion.current) {
          setApiRows(rows);
          setApiStore((current) => ({
            ...current,
            [panel.resource]: rows.map((row) => ({
              ...row,
              cohortId: row.cohortId ?? cohort,
            })),
          }));
        }
      })
      .catch((e) => {
        if (!cancelled && version === loadVersion.current)
          setLoadError(e.message);
      })
      .finally(() => {
        if (!cancelled && version === loadVersion.current) setBusy(false);
      });
    return () => {
      cancelled = true;
    };
  }, [mode, baseUrl, token, cohort, panel]);
  function navigate(resource: Resource, parent?: number, parentLabel?: string) {
    setPanel({ resource, parent, parentLabel });
    setQuery("");
    setFilter("");
    setEmpty(false);
  }
  const r = panel.resource;
  const config =
    mode === "api"
      ? {
          ...configs[r],
          columns: configs[r].columns.filter(
            (key) =>
              !(
                r === "posts" && ["visibility"].includes(key)
              ) &&
              !(r === "questions" && ["topicId", "chapterId"].includes(key)),
          ),
        }
      : configs[r];
  const unavailable = mode === "api" && !isApiResource(r);
  const active = (resource: Resource) =>
    store[resource].filter(
      (x) =>
        !x.deletedAt &&
        (resource === "users" ||
          resource === "cohorts" ||
          resource === "courses" ||
          x.cohortId === cohort),
    );
  const rows = (
    mode === "api"
      ? apiRows.map(row => {
          const local = deliveryOverrides[`${cohort}:${row.id}`];
          return r === "posts" && local && !["SENT", "FAILED"].includes(String(row.deliveryStatus))
            ? { ...row, deliveryStatus: local } : row;
        })
      : active(r).filter(
          (x) => !config.parent || x[config.parent] === panel.parent,
        )
  ).filter(
    (x) =>
      !empty &&
      (!filter || Object.values(x).includes(filter)) &&
      (!query ||
        Object.values(x).some((v) =>
          String(v ?? "")
            .toLowerCase()
            .includes(query.toLowerCase()),
        )),
  );
  const userName = (id: unknown) =>
    store.users.find((x) => x.id === Number(id))?.name || `회원 #${id}`;
  function topicPath(id: unknown) {
    const topic = store.topics.find((x) => x.id === Number(id));
    const unit = store.units.find((x) => x.id === topic?.unitId);
    const subject = store.subjects.find((x) => x.id === unit?.subjectId);
    return topic
      ? `${subject?.title || ""} / ${unit?.title || ""} / ${topic.title}`
      : "단원 미분류";
  }
  function refLabel(resource: Resource, row: Row): string {
    if (resource === "users") return String(row.name);
    if (resource === "topics") return topicPath(row.id);
    if (resource === "chapters") {
      const video = store.videos.find((x) => x.id === row.videoId);
      return `${video?.lectureDate} · ${video?.periodNo}교시 · ${row.title} (${row.startSeconds}초)`;
    }
    return String(row.title || row.name);
  }
  function cell(row: Row, key: string) {
    if (mode === "api" && ["provisionedBy", "provisionedAt"].includes(key))
      return "API 미제공";
    const v = row[key] ?? (key === "date" ? row.attendanceDate : undefined);
    if (["userId", "authorId", "provisionedBy"].includes(key))
      return v
        ? key === "userId" && row.userName
          ? row.userName
          : userName(v)
        : "기록 없음";
    if (
      ["provisionedAt", "submittedAt", "dueAt", "startAt", "endAt"].includes(
        key,
      )
    )
      return time(v);
    if (key === "topicId") return topicPath(v);
    if (key === "chapterId")
      return v
        ? store.chapters.find((x) => x.id === v)?.title || "챕터 없음"
        : "연결된 복습 영상 없음";
    if (key === "pinned") return v ? "상단 고정" : "—";
    if (key === "score") return v ?? "미채점";
    if (
      [
        "status",
        "role",
        "category",
        "visibility",
        "unitType",
        "deliveryStatus",
      ].includes(key)
    )
      return v ? (
        <span
          className={`admin-badge ${["INVALIDATED", "FAILED", "UNKNOWN", "ABSENT", "REJECTED"].includes(String(v)) ? "warning" : ["ACTIVE", "APPROVED", "PRESENT", "SENT", "REVIEWED"].includes(String(v)) ? "success" : ""}`}
        >
          {labels[String(v)] || v}
        </span>
      ) : (
        "—"
      );
    return String(v ?? "—");
  }
  function open(resource: Resource, row?: Row, parent = panel.parent) {
    if (mode === "api" && !isApiResource(resource)) {
      notify(UNAVAILABLE_MESSAGE, true);
      return;
    }
    if (
      resource === "questions" &&
      store.assessments.find((x) => x.id === parent)?.status !== "DRAFT"
    ) {
      notify("초안 평가에서만 문항을 편집할 수 있습니다.", true);
      return;
    }
    const conf = configs[resource];
    const isNew = !row;
    const initial: Row = { id: row?.id || Date.now(), cohortId: cohort };
    conf.fields.forEach((f) => {
      initial[f.key] =
        f.initial ??
        (f.options
          ? f.options[0]
          : f.type === "checkbox"
            ? false
            : f.type === "date"
              ? today()
              : f.type === "datetime-local"
                ? `${today()}T09:00`
                : "");
    });
    if (conf.parent) initial[conf.parent] = parent;
    setEditor({ resource, row: row || initial, isNew, parent });
    setDraft({ ...initial, ...row });
    setFile(null);
  }
  function patch(resource: Resource, id: number, changes: Partial<Row>) {
    setStore((s) => ({
      ...s,
      [resource]: s[resource].map((x) =>
        x.id === id ? { ...x, ...changes } : x,
      ),
    }));
  }
  async function run(action: () => Promise<void> | void) {
    if (busy) return;
    setBusy(true);
    try {
      await action();
    } catch (e) {
      notify(e instanceof Error ? e.message : "처리에 실패했습니다.", true);
    } finally {
      setBusy(false);
    }
  }
  async function refresh(resource = r, parent = panel.parent) {
    if (mode === "api") {
      const rows = await api.list(resource, parent);
      if (currentView.current.cohort !== cohort || currentView.current.resource !== resource || currentView.current.parent !== parent) return;
      setApiRows(rows);
      setApiStore((current) => ({
        ...current,
        [resource]: rows.map((row) => ({
          ...row,
          cohortId: row.cohortId ?? cohort,
        })),
      }));
      await session.reload();
    }
  }
  function validate(resource: Resource, data: Row, original?: Row) {
    if (
      resource === "questions" &&
      (Number(data.correct) < 1 ||
        Number(data.correct) > Number(data.optionCount || 4))
    )
      throw Error("선택지 범위 안에서 정답을 선택해주세요.");
    if (resource === "users") {
      if (editor?.isNew && store.users.some((x) => x.email === data.email))
        throw Error("이미 발급된 이메일입니다.");
      if (editor?.isNew && String(data.password).length < 8)
        throw Error("초기 비밀번호는 8자 이상 입력해 주세요.");
      if (
        original?.role === "ADMIN" &&
        original.status === "ACTIVE" &&
        (data.role !== "ADMIN" || data.status !== "ACTIVE") &&
        store.users.filter((x) => x.role === "ADMIN" && x.status === "ACTIVE")
          .length === 1
      )
        throw Error("마지막 활성 관리자의 권한은 제거할 수 없습니다.");
    }
    if (resource === "cohorts" && String(data.endDate) < String(data.startDate))
      throw Error("종료일은 시작일 이후여야 합니다.");
    if (
      resource === "enrollments" &&
      store.enrollments.some(
        (x) =>
          x.id !== data.id && x.cohortId === cohort && x.userId === data.userId,
      )
    )
      throw Error("이미 배정된 회원입니다. (409)");
    if (resource === "attendance") {
      if (String(data.date) > today())
        throw Error("미래 날짜의 출결은 기록할 수 없습니다.");
      if (
        (data.unitType === "DATE" && Number(data.sessionNo) !== 0) ||
        (data.unitType === "SESSION" && Number(data.sessionNo) < 1)
      )
        throw Error("일자는 0회차, 회차는 1 이상이어야 합니다.");
      if (original && transitions.includes(`${original.status}>${data.status}`))
        throw Error("이 전환은 소명 승인 경로에서 처리해 주세요.");
    }
    if (
      resource === "posts" &&
      data.visibility === "PUBLIC" &&
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(String(data.publicSlug || ""))
    )
      throw Error("공개 공지는 영문 소문자·숫자·하이픈 슬러그가 필요합니다.");
    if (resource === "videos" && !youtubeId(String(data.youtubeUrl)))
      throw Error(
        "유효한 youtube.com/watch?v= 또는 youtu.be/ URL을 입력해 주세요.",
      );
    if (
      resource === "videos" &&
      active("videos").some(
        (x) =>
          x.id !== data.id &&
          x.lectureDate === data.lectureDate &&
          x.periodNo === data.periodNo,
      )
    )
      throw Error("같은 날짜·교시에 영상이 있습니다. (409)");
    if (resource === "submissions") {
      const assignment = store.assignments.find(
        (x) => x.id === data.assignmentId,
      );
      if (
        Number(data.score) > Number(assignment?.maxScore) ||
        Number(data.score) < 0
      )
        throw Error(`점수는 0~${assignment?.maxScore} 범위여야 합니다.`);
    }
    if (
      resource === "assignments" &&
      store.submissions.some(
        (x) =>
          x.assignmentId === data.id && Number(x.score) > Number(data.maxScore),
      )
    )
      throw Error("이미 부여한 점수보다 만점을 낮출 수 없습니다.");
    if (
      resource === "assessments" &&
      String(data.endAt) <= String(data.startAt)
    )
      throw Error("평가 종료 시각은 시작 시각 이후여야 합니다.");
    if (
      resource === "questions" &&
      store.assessments.find((x) => x.id === data.assessmentId)?.status !==
        "DRAFT"
    )
      throw Error("초안 평가에서만 문항을 편집할 수 있습니다.");
  }
  async function save() {
    if (!editor) return;
    await run(async () => {
      const { resource, isNew, parent } = editor;
      const data = { ...draft };
      configs[resource].fields.forEach((f) => {
        if (
          (f.type === "number" || f.ref || f.key === "correct") &&
          data[f.key] !== ""
        )
          data[f.key] = Number(data[f.key]);
        if (f.optional && data[f.key] === "") data[f.key] = null;
      });
      validate(resource, data, isNew ? undefined : editor.row);
      if (resource === "users" && isNew) {
        data.role = "STUDENT";
        data.status = "ACTIVE";
        data.provisionedBy = 1;
        data.provisionedAt = new Date().toISOString();
      }
      if (resource === "assignments") {
        data.instructorName = String(userName(data.instructorId));
        data.authorId = data.authorId || 1;
      }
      if (resource === "assessments" && isNew) data.status = "DRAFT";
      if (resource === "comments" && mode === "mock")
        data.authorId = session.user.id;
      if (resource === "enrollments" && isNew) data.status = "ACTIVE";
      if (resource === "attendance") {
        const existing = store.attendance.find(
          (x) =>
            !x.deletedAt &&
            x.cohortId === cohort &&
            x.userId === data.userId &&
            x.date === data.date &&
            x.sessionNo === data.sessionNo,
        );
        if (existing && isNew) validate(resource, data, existing);
        data.id = existing?.id || data.id;
        data.version = Number(existing?.version || 0) + 1;
      }
      if (resource === "submissions") data.status = "REVIEWED";
      if (mode === "api") {
        const result = await api.save(
          resource,
          data,
          isNew,
          parent,
          editor.row,
        );
        if (data.fileName === null && editor.row.fileIds) {
          for (const id of JSON.parse(String(editor.row.fileIds)))
            await api.request(`/api/files/${id}`, "DELETE");
        }
        if (file && (resource === "posts" || resource === "assignments")) {
          try {
            await api.upload(resource, result.id, file);
          } catch (e) {
            setEditor(null);
            await refresh();
            throw Error(
              `내용은 저장했지만 첨부 업로드가 실패했습니다: ${e instanceof Error ? e.message : ""}`,
            );
          }
        }
        await refresh();
      } else {
        delete data.password;
        delete data.attachment;
        if (file) {
          data.fileName = file.name;
          data.fileContent = await fileData(file);
        }
        setStore((s) => {
          const next = {
            ...s,
            [resource]: s[resource].some((x) => x.id === data.id)
              ? s[resource].map((x) => (x.id === data.id ? data : x))
              : [data, ...s[resource]],
          };
          if (resource === "attendance")
            next.corrections = s.corrections.map((x) =>
              x.attendanceId === data.id && x.status === "PENDING"
                ? { ...x, status: "INVALIDATED" }
                : x,
            );
          return next;
        });
      }
      setEditor(null);
      notify(
        resource === "attendance"
          ? "출결을 저장했습니다. 버전이 증가하고 대기 소명은 무효화됩니다."
          : resource === "submissions"
            ? "채점을 저장했습니다. 학생의 제출물 수정이 잠겼습니다."
            : `${configs[resource].singular} ${isNew ? "등록" : "수정"}을 완료했습니다.`,
      );
    });
  }
  async function remove(row: Row) {
    await run(async () => {
      if (r === "users" || r === "cohorts" || r === "enrollments")
        throw Error("이 항목은 상태 변경으로 관리합니다.");
      if (r === "assessments" && row.status !== "DRAFT")
        throw Error("초안 평가만 삭제할 수 있습니다.");
      if (
        r === "questions" &&
        store.assessments.find((x) => x.id === row.assessmentId)?.status !==
          "DRAFT"
      )
        throw Error("게시된 평가 문항은 삭제할 수 없습니다.");
      if (
        (r === "subjects" &&
          active("units").some((x) => x.subjectId === row.id)) ||
        (r === "units" && active("topics").some((x) => x.unitId === row.id))
      )
        throw Error("하위 항목을 먼저 삭제해 주세요.");
      if (mode === "api") {
        await api.remove(r, row.id);
        await refresh();
      } else {
        patch(r, row.id, {
          deletedAt: new Date().toISOString(),
          ...(r === "attendance" ? { version: Number(row.version) + 1 } : {}),
        });
        if (r === "attendance")
          setStore((s) => ({
            ...s,
            corrections: s.corrections.map((x) =>
              x.attendanceId === row.id && x.status === "PENDING"
                ? { ...x, status: "INVALIDATED" }
                : x,
            ),
          }));
      }
      notify(
        r === "attendance"
          ? "출결을 논리 삭제했습니다. 버전 증가 · 대기 소명 자동 무효화"
          : `${config.singular}을 삭제했습니다. 이력은 보존됩니다.`,
      );
    });
  }
  async function correction(row: Row, status: string) {
    await run(async () => {
      if (row.status !== "PENDING")
        throw Error("대기 상태의 요청만 처리할 수 있습니다.");
      if (mode === "api") {
        try {
          await api.request(`/api/attendance/corrections/${row.id}`, "PATCH", {
            status,
            reviewNote: "관리자 검토 완료",
          });
        } catch (e) {
          if (e instanceof ApiError && e.status === 409) {
            await refresh();
            throw Error(
              "409 충돌: 원본 출결이 변경되어 소명이 무효화되었습니다.",
            );
          }
          throw e;
        }
        await refresh();
      } else {
        const attendance = store.attendance.find(
          (x) => x.id === row.attendanceId,
        );
        if (
          !attendance ||
          attendance.deletedAt ||
          attendance.version !== row.originalVersion ||
          attendance.status !== row.originalStatus
        ) {
          patch("corrections", row.id, { status: "INVALIDATED" });
          throw Error(
            "409 충돌: 원본 상태·버전이 달라 소명이 무효화되었습니다.",
          );
        }
        if (status === "APPROVED")
          patch("attendance", attendance.id, {
            status: row.requestedStatus,
            version: Number(attendance.version) + 1,
          });
        patch("corrections", row.id, { status });
      }
      notify(`소명 요청을 ${status === "APPROVED" ? "승인" : "반려"}했습니다.`);
    });
  }
  async function delivery(row: Row) {
    if (mode === "api") {
      const key = `${cohort}:${row.id}`;
      if (deliveryLocks.current.has(key) || row.deliveryStatus || deliveryOverrides[key]) return;
      deliveryLocks.current.add(key);
      setDeliveryOverrides(current => ({ ...current, [key]: "PENDING" }));
      await run(async () => {
        const status = await sendDiscord(api.request, row.id);
        setDeliveryOverrides(current => ({ ...current, [key]: status }));
        try { await refresh(); } catch {
          notify("목록을 갱신하지 못했습니다. 전송 결과를 확인해 주세요.", true);
        }
        notify(status === "SENT" ? "Discord 공지 채널에 게시했습니다." :
          status === "UNKNOWN" ? "전송 결과를 확인할 수 없습니다. Discord 채널을 확인해 주세요. 자동 재전송하지 않습니다." :
          "전송 결과를 확인해 주세요. 중복 방지를 위해 재전송이 제한됩니다.", status !== "SENT");
      });
      deliveryLocks.current.delete(key);
      return;
    }
    await run(async () => {
      if (row.deliveryStatus === "SENT" || row.deliveryStatus === "PENDING")
        throw Error(
          "중복 전송을 방지했습니다. 동일 공지는 한 번만 전송됩니다.",
        );
      if (row.visibility !== "PUBLIC" || !row.publicSlug)
        throw Error("공개 범위 PUBLIC 및 공개 링크를 먼저 설정해 주세요.");
      patch("posts", row.id, { deliveryStatus: "PENDING" });
      notify("Discord 전송 대기 중입니다. 중복 요청은 차단됩니다.");
      window.setTimeout(() => {
        patch("posts", row.id, { deliveryStatus: "SENT" });
        notify("Discord 공지 채널 전송을 완료했습니다. (Mock)");
      }, 1000);
    });
  }
  async function assessment(row: Row) {
    await run(async () => {
      const status = row.status === "DRAFT" ? "PUBLISHED" : "CLOSED";
      if (row.status === "CLOSED")
        throw Error("종료한 평가는 재개할 수 없습니다.");
      if (
        status === "PUBLISHED" &&
        mode === "mock" &&
        !active("questions").some((x) => x.assessmentId === row.id)
      )
        throw Error("문항을 한 개 이상 등록한 뒤 게시하세요.");
      if (mode === "api") {
        await api.request(`/api/assessments/${row.id}`, "PATCH", { status });
        await refresh();
      } else patch("assessments", row.id, { status });
      notify(`평가를 ${status === "PUBLISHED" ? "게시" : "종료"}했습니다.`);
    });
  }
  function download(row: Row) {
    if (mode === "api") {
      run(async () => {
        const files = await sessionApi<FileInfo[]>(
          `/api/submissions/${row.id}/files`,
        );
        if (!files.length) throw Error("첨부파일이 없습니다.");
        for (const file of files) await downloadFile(file);
      });
      return;
    }
    const isDataUrl = String(row.fileContent || "").startsWith("data:");
    const url = isDataUrl
      ? String(row.fileContent)
      : URL.createObjectURL(
          new Blob([String(row.fileContent || "")], { type: "text/plain" }),
        );
    const a = document.createElement("a");
    a.href = url;
    a.download = String(row.fileName);
    a.click();
    if (!isDataUrl) URL.revokeObjectURL(url);
    notify("제출 파일을 다운로드했습니다.");
  }
  function replay(row: Row) {
    const video = store.videos.find(
      (x) => x.id === row.videoId && !x.deletedAt,
    );
    if (!video || video.visibility !== "PUBLIC") {
      notify("공개된 재생 가능한 영상이 없습니다.", true);
      return;
    }
    window.open(
      `https://www.youtube.com/watch?v=${youtubeId(String(video.youtubeUrl))}&t=${row.startSeconds || 0}s`,
      "_blank",
      "noopener,noreferrer",
    );
  }
  function actions(row: Row) {
    return (
      <div className="admin-actions">
        {r === "corrections" ? (
          <>
            <button
              disabled={row.status !== "PENDING"}
              onClick={() => correction(row, "APPROVED")}
            >
              승인
            </button>
            <button
              disabled={row.status !== "PENDING"}
              onClick={() => correction(row, "REJECTED")}
            >
              반려
            </button>
            {mode === "mock" && row.status === "PENDING" && (
              <button
                onClick={() => {
                  patch("attendance", Number(row.attendanceId), {
                    version: Number(row.originalVersion) + 1,
                  });
                  notify(
                    "원본 버전 변경을 재현했습니다. 승인을 눌러 409 충돌을 확인하세요.",
                  );
                }}
              >
                충돌 재현
              </button>
            )}
          </>
        ) : (
          <>
            {
              <button onClick={() => open(r, row)}>
                {r === "submissions" ? "채점 / 수정" : "수정"}
              </button>
            }
            {r === "posts" && (
              <>
                {["COURSE", "SYSTEM"].includes(String(row.category)) && (
                    <button disabled={mode === "api" && (busy || !!row.deliveryStatus)} onClick={() => delivery(row)}>
                      {row.deliveryStatus === "FAILED"
                        ? "재시도"
                        : "Discord 전송"}
                    </button>
                  )}
                {row.category === "QUESTION" && (
                  <button
                    onClick={() =>
                      navigate("comments", row.id, String(row.title))
                    }
                  >
                    답변 관리
                  </button>
                )}
              </>
            )}
            {r === "videos" && (
              <button
                onClick={() => navigate("chapters", row.id, String(row.title))}
              >
                소단원 관리
              </button>
            )}
            {r === "subjects" && (
              <button
                onClick={() => navigate("units", row.id, String(row.title))}
              >
                단원 관리
              </button>
            )}
            {r === "units" && (
              <button
                onClick={() => navigate("topics", row.id, String(row.title))}
              >
                개념 관리
              </button>
            )}
            {r === "chapters" && (
              <button onClick={() => replay(row)}>구간 재생 ↗</button>
            )}
            {r === "assignments" && (
              <button
                onClick={() =>
                  navigate("submissions", row.id, String(row.title))
                }
              >
                제출물 평가
              </button>
            )}
            {r === "submissions" && row.fileName && (
              <button onClick={() => download(row)}>파일 확인 ↗</button>
            )}
            {r === "assessments" && (
              <>
                <button
                  onClick={() =>
                    navigate("questions", row.id, String(row.title))
                  }
                >
                  {mode === "mock" ? "문항 / 복습 연결" : "문항 관리"}
                </button>
                <button
                  disabled={row.status === "CLOSED"}
                  onClick={() => assessment(row)}
                >
                  {row.status === "DRAFT" ? "게시" : "종료"}
                </button>
              </>
            )}
            {![
              "courses",
              "users",
              "cohorts",
              "enrollments",
              "submissions",
            ].includes(r) && (
              <button className="danger" onClick={() => remove(row)}>
                삭제
              </button>
            )}
          </>
        )}
      </div>
    );
  }
  function fields(): Field[] {
    if (!editor) return [];
    if (editor.resource === "questions") {
      const count = Math.max(2, Math.min(10, Number(draft.optionCount) || 4));
      return configs.questions.fields
        .filter(
          (field) =>
            mode === "mock" || !["topicId", "chapterId"].includes(field.key),
        )
        .flatMap((field) =>
          /^option[0-9]+$/.test(field.key)
            ? field.key === "option1"
              ? Array.from({ length: count }, (_, i) => ({
                  key: `option${i + 1}`,
                  label: `선택지 ${i + 1}`,
                }))
              : []
            : [
                field.key === "correct"
                  ? {
                      ...field,
                      options: Array.from({ length: count }, (_, i) =>
                        String(i + 1),
                      ),
                    }
                  : field,
              ],
        );
    }
    return configs[editor.resource].fields
      .filter(
        (f) =>
          mode === "mock" ||
          editor.resource !== "posts" ||
          !["visibility", "publicSlug"].includes(f.key),
      )
      .filter(
        (f) =>
          editor.resource !== "users" ||
          (editor.isNew
            ? !["role", "status"].includes(f.key)
            : ["role", "status"].includes(f.key)),
      );
  }
  const locked =
    r === "questions" &&
    store.assessments.find((x) => x.id === panel.parent)?.status !== "DRAFT";
  const pending = active("corrections").filter(
    (x) => x.status === "PENDING",
  ).length;
  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="brand-symbol">
            <GraduationCap size={21} />
          </span>
          <span>
            Inspire LMS <b>v2.0</b>
            <small>LG CNS AM 캠프 6기</small>
          </span>
        </Link>
        <div className="admin-sidebar-nav">
          <p>관리자 워크스페이스</p>
          {menus.map((menu, i) => {
            const Icon = icons[i];
            return (
              <button
                key={menu.name}
                aria-current={tab === i ? "page" : undefined}
                className={tab === i ? "active" : ""}
                onClick={() => {
                  setTab(i);
                  navigate(menu.resources[0]);
                }}
              >
                <Icon size={16} />
                <span>{menu.name}</span>
                {i === 1 && pending > 0 && <small>{pending}</small>}
              </button>
            );
          })}
        </div>
        <div className="admin-sidebar-bottom">
          <button
            onClick={() => {
              setIsDark(!isDark);
              document.documentElement.classList.toggle("dark", !isDark);
            }}
          >
            {isDark ? <Sun size={15} /> : <Moon size={15} />}{" "}
            {isDark ? "라이트 모드" : "다크 모드"}
          </button>
          <div className="admin-profile">
            <span>{session.user.name.slice(0, 1)}</span>
            <div>
              {session.user.name} 관리자<small>최고 관리자 · ADMIN</small>
            </div>
          </div>
        </div>
      </aside>
      <div className="admin-shell">
        <SessionToolbar />
        <header className="admin-header">
          <div className="admin-top">
            <div>
              <h1>관리자 워크스페이스</h1>
              <p>{menus[tab].subtitle}</p>
            </div>
            <div className="mode-switch">
              <Link href="/">
                수강생 모드 <ArrowUpRight size={13} />
              </Link>
              <span>
                <ShieldCheck size={14} /> 관리자 모드
              </span>
            </div>
          </div>
          <nav aria-label="관리자 메뉴" className="admin-nav">
            {menus.map((menu, i) => {
              const Icon = icons[i];
              return (
                <button
                  key={menu.name}
                  aria-current={tab === i ? "page" : undefined}
                  className={tab === i ? "active" : ""}
                  onClick={() => {
                    setTab(i);
                    navigate(menu.resources[0]);
                  }}
                >
                  <Icon size={16} />
                  {menu.name}
                </button>
              );
            })}
          </nav>
        </header>
        <main className="admin-main">
          <div className="admin-breadcrumb">
            워크스페이스 <ChevronRight size={12} /> 관리자{" "}
            <ChevronRight size={12} />
            <span>{menus[tab].name}</span>
          </div>
          <div className="admin-page-heading">
            <div>
              <p className="admin-eyebrow">ADMIN WORKSPACE</p>
              <h1>{menus[tab].name} 관리</h1>
              <p>{menus[tab].subtitle}를 한곳에서 관리하세요.</p>
            </div>
            <div className="admin-context">
              <span
                className={`admin-badge ${mode === "mock" ? "" : "success"}`}
              >
                {mode === "mock" ? "● Mock 데모" : "● API 연결"}
              </span>
              <button
                className="admin-secondary"
                onClick={() => setSettings(true)}
              >
                연결 설정
              </button>
              <label className="sr-only" htmlFor="cohort">
                관리 기수
              </label>
              <select
                id="cohort"
                value={cohort}
                onChange={(e) => {
                  setCohort(Number(e.target.value));
                  session.selectCohort(Number(e.target.value));
                  navigate(menus[tab].resources[0]);
                }}
              >
                {store.cohorts
                  .filter((x) => !x.deletedAt)
                  .map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <section className="admin-stats" aria-label="운영 요약">
            {[
              {
                title: "등록 수강생",
                value: active("enrollments").filter((x) => x.role === "STUDENT")
                  .length,
                unit: "명",
                detail: "선택 기수 기준",
                icon: Users,
              },
              {
                title: "검토 대기 소명",
                value: pending,
                unit: "건",
                detail: "관리자의 확인이 필요해요",
                icon: ClipboardCheck,
              },
              {
                title: "운영 중인 과제",
                value: active("assignments").length,
                unit: "개",
                detail: "과제 및 제출 현황",
                icon: BookOpen,
              },
              {
                title: "등록된 강의 영상",
                value: active("videos").length,
                unit: "개",
                detail: "학습 아카이브",
                icon: Video,
              },
            ].map((s, i) => (
              <div className="admin-stat" key={s.title}>
                <div>
                  <p>{s.title}</p>
                  <strong>
                    {mode === "api" && s.icon === Video ? "미제공" : s.value}
                    <small>
                      {mode === "api" && s.icon === Video ? "" : s.unit}
                    </small>
                  </strong>
                  <span>{s.detail}</span>
                </div>
                <s.icon size={21} className={`stat-icon stat-${i}`} />
              </div>
            ))}
          </section>
          <section className="admin-workarea">
            <div className="admin-subnav">
              {menus[tab].resources.map((resource) => (
                <button
                  className={r === resource ? "active" : ""}
                  key={resource}
                  onClick={() => navigate(resource)}
                >
                  {configs[resource].title}
                </button>
              ))}
              {!menus[tab].resources.some((x) => x === r) && (
                <span className="active child-tab">{config.title}</span>
              )}
            </div>
            <div className="admin-section-heading">
              <div>
                {panel.parentLabel && (
                  <p className="parent-label">
                    {panel.parentLabel} <ChevronRight size={12} />
                  </p>
                )}
                <h2>
                  {config.title}
                  <span>{rows.length}</span>
                </h2>
                <p>{config.description}</p>
              </div>
              {!config.noCreate && !unavailable && (
                <button
                  className="admin-primary"
                  disabled={busy || locked}
                  onClick={() => open(r)}
                >
                  <Plus size={16} />
                  {config.singular} {r === "users" ? "발급" : "등록"}
                </button>
              )}
            </div>
            {locked && (
              <div className="admin-note">
                게시·종료된 평가의 문항은 수정할 수 없습니다. 정답·해설은
                수강생의 응시 완료와 평가 종료 후 공개됩니다.
              </div>
            )}
            {r === "submissions" && (
              <div className="admin-note">
                채점 완료: 학생 제출물 수정 잠금 · 강사는 점수와 피드백을 계속
                수정할 수 있습니다.
              </div>
            )}
            {mode === "api" && r === "posts" && (
              <div className="admin-note">
                Discord 전송 버튼을 누르면 제목과 본문 전문이 외부 Discord 채널로 전달됩니다. 저장만으로는 전송되지 않습니다.
                공개 범위·공개 링크 설정은 제공되지 않습니다.
                게시글과 첨부는 기수 회원용으로 관리합니다.
              </div>
            )}
            {mode === "api" && r === "questions" && (
              <div className="admin-note">
                문항·선택지·정답·해설을 관리합니다. 핵심 개념 및 복습 영상
                매핑은 현재 제공되지 않습니다.
              </div>
            )}
            <div className="admin-toolbar">
              <div className="admin-search">
                <Search size={16} />
                <input
                  aria-label="목록 검색"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="이름, 제목, 내용 검색"
                />
                {query && (
                  <button aria-label="검색 지우기" onClick={() => setQuery("")}>
                    <X size={14} />
                  </button>
                )}
              </div>
              <select
                aria-label="상태 또는 분류 필터"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="">전체 상태·분류</option>
                {Array.from(
                  new Set(
                    (mode === "mock" ? active(r) : apiRows).flatMap((x) =>
                      [x.status, x.category, x.visibility].filter(Boolean),
                    ),
                  ),
                ).map((v) => (
                  <option key={String(v)} value={String(v)}>
                    {labels[String(v)] || v}
                  </option>
                ))}
              </select>
              <label className="empty-toggle">
                <input
                  type="checkbox"
                  checked={empty}
                  onChange={(e) => setEmpty(e.target.checked)}
                />{" "}
                빈 상태 보기
              </label>
              <span className="admin-count">총 {rows.length}개</span>
            </div>
            {unavailable ? (
              <div className="admin-empty">
                <Inbox />
                <h3>현재 제공되지 않는 기능입니다</h3>
                <p>{UNAVAILABLE_MESSAGE}</p>
              </div>
            ) : loadError ? (
              <div className="admin-empty" role="alert">
                <Inbox />
                <h3>데이터를 불러오지 못했습니다</h3>
                <p>{loadError}</p>
                <button
                  className="admin-secondary"
                  onClick={() => setPanel({ ...panel })}
                >
                  다시 시도
                </button>
              </div>
            ) : busy && !editor ? (
              <div className="admin-empty">
                <Loader2 className="animate-spin" />
                <p>처리 중입니다…</p>
              </div>
            ) : rows.length === 0 ? (
              <div className="admin-empty">
                <div>
                  <Inbox size={28} />
                </div>
                <h3>
                  {query || filter
                    ? "검색 결과가 없습니다"
                    : "아직 등록된 데이터가 없습니다"}
                </h3>
                <p>
                  {query || filter
                    ? "검색어와 필터를 변경해 보세요."
                    : "새 항목을 등록하면 이곳에서 확인할 수 있어요."}
                </p>
                <button
                  className="admin-secondary"
                  onClick={() => {
                    setEmpty(false);
                    setQuery("");
                    setFilter("");
                  }}
                >
                  <Check size={14} /> 전체 목록 보기
                </button>
              </div>
            ) : (
              <div className="admin-table-scroll">
                <table className="admin-table">
                  <thead>
                    <tr>
                      {config.columns.map((c) => (
                        <th key={c}>{columnLabels[c]}</th>
                      ))}
                      <th>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.id}>
                        {config.columns.map((c, i) => (
                          <td key={c} className={i === 0 ? "first-column" : ""}>
                            {cell(row, c)}
                          </td>
                        ))}
                        <td>{actions(row)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="admin-table-footer">
              <span>
                <ShieldCheck size={13} />{" "}
                {mode === "mock"
                  ? "변경 사항은 이 브라우저에 저장됩니다."
                  : "인증된 관리자 권한으로 요청합니다."}
              </span>
              <span>
                {rows.length > 0
                  ? `1–${rows.length} / ${rows.length}`
                  : "0 / 0"}
              </span>
            </div>
          </section>
          {mode === "mock" && tab === 3 && r === "subjects" && (
            <section className="admin-tree">
              <h2>커리큘럼 미리보기</h2>
              {active("subjects").length && !empty ? (
                active("subjects").map((subject) => (
                  <div key={subject.id}>
                    <strong>{subject.title}</strong>
                    {active("units")
                      .filter((u) => u.subjectId === subject.id)
                      .map((unit) => (
                        <div className="tree-unit" key={unit.id}>
                          <span>└ {unit.title}</span>
                          <div>
                            {active("topics")
                              .filter((t) => t.unitId === unit.id)
                              .map((topic) => (
                                <span className="admin-badge" key={topic.id}>
                                  {topic.title}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                  </div>
                ))
              ) : (
                <p>등록된 커리큘럼이 없습니다.</p>
              )}
            </section>
          )}
          {tab === 5 && r === "assessments" && (
            <section className="admin-tree">
              <h2>
                {mode === "api" ? "수강생별 평가 결과" : "기수 성적 통계"}
              </h2>
              {mode === "api" ? (
                <>
                  <label>
                    수강생 선택{" "}
                    <select
                      aria-label="평가 결과 수강생"
                      value={reportTarget}
                      onChange={(e) => setReportTarget(Number(e.target.value))}
                    >
                      <option value={0}>조회할 수강생을 선택하세요</option>
                      {active("enrollments")
                        .filter(
                          (x) => x.role === "STUDENT" && x.status === "ACTIVE",
                        )
                        .map((x) => (
                          <option key={x.id} value={Number(x.userId)}>
                            {userName(x.userId)}
                          </option>
                        ))}
                    </select>
                  </label>
                  {reportError ? (
                    <p role="alert">{reportError}</p>
                  ) : !reportTarget ? (
                    <p>
                      수강생을 선택하면 완료한 평가와 해당 평가의 기수 평균을
                      조회합니다.
                    </p>
                  ) : reportRows.length ? (
                    reportRows.map((x) => (
                      <p key={x.id}>
                        {x.title} · 점수 {x.score}점 · 해당 평가 기수 평균{" "}
                        {Number(x.cohortAverage).toFixed(1)}점
                      </p>
                    ))
                  ) : (
                    <p>완료된 평가 결과가 없습니다.</p>
                  )}
                </>
              ) : !empty &&
                active("assessments").some(
                  (x) => Number(x.completedCount) > 0,
                ) ? (
                active("assessments")
                  .filter((x) => Number(x.completedCount) > 0)
                  .map((x) => (
                    <p key={x.id}>
                      {x.title} · 응시 완료 {x.completedCount}명 · 평균{" "}
                      {x.average}점
                    </p>
                  ))
              ) : (
                <p>집계된 평가 결과가 없습니다.</p>
              )}
            </section>
          )}
          <footer className="admin-footer">
            <span>© 2026 LG CNS AM Inspire Camp 6기</span>
            <span>배움이 이어지는 곳, 성장을 함께 만듭니다.</span>
          </footer>
        </main>
        <div className="admin-toasts" aria-live="polite" aria-atomic="false">
          {toasts.map((t) => (
            <div
              key={t.id}
              role={t.error ? "alert" : "status"}
              className={`admin-toast ${t.error ? "error" : ""}`}
            >
              <span>{t.error ? "!" : <Check size={17} />}</span>
              <p>{t.text}</p>
              <button
                aria-label="알림 닫기"
                onClick={() => setToasts((x) => x.filter((a) => a.id !== t.id))}
              >
                <X size={15} />
              </button>
            </div>
          ))}
        </div>
        <Dialog
          open={!!editor}
          onOpenChange={(value) => {
            if (!value && !busy) setEditor(null);
          }}
        >
          <DialogContent className="admin-dialog sm:max-w-2xl max-h-[88vh] overflow-y-auto">
            <DialogTitle>
              {editor && configs[editor.resource].singular}{" "}
              {editor?.isNew ? "등록" : "수정"}
            </DialogTitle>
            <DialogDescription>
              {editor && configs[editor.resource].description}
            </DialogDescription>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                save();
              }}
            >
              <div className="admin-form-grid">
                {fields().map((f) => (
                  <label
                    className={
                      f.type === "textarea" || f.type === "file" ? "wide" : ""
                    }
                    key={f.key}
                  >
                    {editor?.resource === "posts" && draft.category === "FAQ"
                      ? f.key === "title"
                        ? "질문"
                        : f.key === "body"
                          ? "답변"
                          : f.label
                      : f.label}
                    {!f.optional && <span className="required"> *</span>}
                    {f.type === "textarea" ? (
                      <textarea
                        required={!f.optional}
                        value={String(draft[f.key] || "")}
                        onChange={(e) =>
                          setDraft({ ...draft, [f.key]: e.target.value })
                        }
                      />
                    ) : f.type === "checkbox" ? (
                      <input
                        type="checkbox"
                        checked={!!draft[f.key]}
                        onChange={(e) =>
                          setDraft({ ...draft, [f.key]: e.target.checked })
                        }
                      />
                    ) : f.options || f.ref ? (
                      <select
                        required={!f.optional}
                        value={String(draft[f.key] ?? "")}
                        onChange={(e) =>
                          setDraft({ ...draft, [f.key]: e.target.value })
                        }
                      >
                        {f.ref && (
                          <option value="">
                            {f.optional ? "미지정" : "선택해 주세요"}
                          </option>
                        )}
                        {f.options?.map((v) => (
                          <option key={v} value={v}>
                            {labels[v] || v}
                          </option>
                        ))}
                        {f.ref &&
                          active(f.ref)
                            .filter(
                              (x) =>
                                f.key !== "instructorId" ||
                                (x.role === "INSTRUCTOR" &&
                                  store.enrollments.some(
                                    (e) =>
                                      e.cohortId === cohort &&
                                      e.userId === x.id &&
                                      e.role === "INSTRUCTOR" &&
                                      e.status === "ACTIVE",
                                  )),
                            )
                            .map((x) => (
                              <option key={x.id} value={x.id}>
                                {refLabel(f.ref!, x)}
                              </option>
                            ))}
                      </select>
                    ) : f.type === "file" ? (
                      <>
                        <input
                          type="file"
                          onChange={(e) => {
                            const next = e.target.files?.[0];
                            if (next && next.size > 10 * 1024 * 1024) {
                              notify(
                                "파일은 10MiB 이하로 선택해 주세요.",
                                true,
                              );
                              e.target.value = "";
                              return;
                            }
                            setFile(next || null);
                          }}
                        />
                        {draft.fileName && (
                          <small>
                            기존 첨부: {draft.fileName}{" "}
                            <button
                              type="button"
                              onClick={() => {
                                setDraft({
                                  ...draft,
                                  fileName: null,
                                  fileContent: null,
                                });
                                notify(
                                  "첨부 제거를 예약했습니다. 저장하면 반영됩니다.",
                                );
                              }}
                            >
                              첨부 제거
                            </button>
                          </small>
                        )}
                      </>
                    ) : (
                      <input
                        type={f.type || "text"}
                        required={!f.optional}
                        min={f.min}
                        max={f.max}
                        minLength={f.type === "password" ? 8 : undefined}
                        value={String(draft[f.key] ?? "")}
                        onChange={(e) =>
                          setDraft({ ...draft, [f.key]: e.target.value })
                        }
                      />
                    )}
                  </label>
                ))}
              </div>
              {editor?.resource === "submissions" && (
                <div className="admin-note">
                  제출 내용: {draft.body}
                  <br />
                  최종 업로드: {time(draft.submittedAt)}
                  {draft.status === "REVIEWED" && (
                    <p>채점 완료 · 학생 수정 잠금</p>
                  )}
                </div>
              )}
              {editor?.resource === "questions" && draft.chapterId && (
                <button
                  type="button"
                  className="admin-secondary"
                  onClick={() => {
                    const chapter = store.chapters.find(
                      (x) => x.id === Number(draft.chapterId),
                    );
                    if (chapter) replay(chapter);
                  }}
                >
                  연결된 복습 구간 미리보기 ↗
                </button>
              )}
              <div className="admin-form-footer">
                <button
                  type="button"
                  className="admin-secondary"
                  onClick={() => setEditor(null)}
                  disabled={busy}
                >
                  취소
                </button>
                <button className="admin-primary" disabled={busy}>
                  {busy ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <Check size={16} />
                  )}
                  저장하기
                </button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
        <Dialog open={settings} onOpenChange={setSettings}>
          <DialogContent className="admin-dialog sm:max-w-lg">
            <DialogTitle>데이터 설정</DialogTitle>
            <DialogDescription>
              현재 모드:{" "}
              {mode === "mock" ? "목업 · 브라우저 저장" : "백엔드 API"}. 프론트
              .env.local의 NEXT_PUBLIC_DATA_MODE로 설정하며 변경 후 서버를
              재시작하세요.
            </DialogDescription>
            {mode === "mock" ? (
              <button
                className="admin-secondary"
                onClick={() => {
                  setStore(seed());
                  notify("Mock 데이터를 초기화했습니다.");
                }}
              >
                Mock 데이터 초기화
              </button>
            ) : (
              <p className="admin-note">
                로그인한 관리자 세션으로 실제 API를 사용합니다. 서버 주소는
                BACKEND_URL 환경변수로 설정합니다.
              </p>
            )}
            <button
              className="admin-primary"
              onClick={() => {
                setSettings(false);
                notify(
                  `${mode === "mock" ? "Mock" : "API"} 모드를 적용했습니다.`,
                );
              }}
            >
              설정 완료
            </button>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
