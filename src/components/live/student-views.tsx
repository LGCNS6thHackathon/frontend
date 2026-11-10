"use client";
import { useEffect, useState } from "react";
import { api, allPages, koreanTime, FileInfo } from "@/lib/api-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useSession } from "./session";
import { State, Files, useResource, useMutation, fieldClass } from "./shared";
import { LectureArchive, AssessmentReview } from "./lecture-views";
import { labels, today } from "@/lib/admin-model";
import { eventOnKoreanDay } from "@/lib/calendar";
type Post = {
  id: number;
  title: string;
  body: string;
  authorId: number;
  authorName: string;
  category: string;
  pinned: boolean;
  views: number;
  createdAt: string;
  files?: FileInfo[];
};
type Comment = {
  id: number;
  authorId: number;
  authorName: string;
  body: string;
  createdAt: string;
};
type Assignment = {
  id: number;
  title: string;
  description: string;
  instructorName: string | null;
  author?: string;
  subject: string;
  dueAt: string;
  maxScore: number;
  status: string;
  canSubmit: boolean;
  canResubmit: boolean;
  submissionLocked: boolean;
  lockReason: string;
  files?: FileInfo[];
  mySubmission?: {
    id: number;
    body: string;
    repositoryUrl: string;
    deploymentUrl: string;
    submittedAt: string;
    files: FileInfo[];
  };
  myReview?: { score: number; feedback: string };
  feedback?: { mentor: string; score: string; comment: string };
};
type Event = {
  id: number;
  title: string;
  type: string;
  startAt: string;
  endAt: string;
  location: string;
  description: string;
};
type Attendance = {
  id: number;
  userId: number;
  attendanceDate: string;
  unitType: string;
  sessionNo: number;
  status: string;
  version?: number;
  availableRequestedStatuses?: string[];
  latestCorrection?: Correction | null;
};
type Correction = {
  id: number;
  attendanceId: number;
  status: string;
  reason: string;
  requestedStatus: string;
};
type Dashboard = {
  progressPercent: number;
  activeMemberCount: number;
  attendance: {
    attendanceRate: number;
    trainingDays: number;
    attendedDays: number;
    lateDays: number;
    absentDays: number;
  };
  todayEvents: Event[];
  upcomingAssignments: Assignment[];
  notices: Post[];
  unreadNotificationCount: number;
};
export function LiveHome() {
  const { cohort, user } = useSession();
  const resource = useResource<Dashboard>(
    `/api/cohorts/${cohort!.id}/dashboard`,
  );
  if (!resource.data) return <State {...resource} retry={resource.reload} />;
  const d = resource.data;
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 p-6 text-white sm:p-8">
        <p className="text-sm text-indigo-200">{cohort!.name}</p>
        <h2 className="my-3 text-3xl font-extrabold">
          안녕하세요, {user.name} 님!
        </h2>
        <p>오늘의 학습 일정과 공지사항을 확인하세요.</p>
        {cohort!.classroomUrl && (
          <Button
            className="mt-5 bg-white text-indigo-950"
            onClick={() =>
              window.open(cohort!.classroomUrl, "_blank", "noopener,noreferrer")
            }
          >
            온라인 강의실 입장
          </Button>
        )}
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["누적 출석률", `${d.attendance.attendanceRate}%`],
          ["교육 진행률", `${d.progressPercent}%`],
          ["등록 회원", `${d.activeMemberCount}명`],
          ["미확인 알림", `${d.unreadNotificationCount}건`],
        ].map(([title, value]) => (
          <Card key={title}>
            <CardContent className="p-5">
              <p className="text-xs text-muted-foreground">{title}</p>
              <strong className="mt-3 block text-3xl">{value}</strong>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>오늘의 교육 일정</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {d.todayEvents.length ? (
            d.todayEvents.map((x) => (
              <div key={x.id} className="rounded-lg border p-4">
                <strong>{x.title}</strong>
                <p className="text-sm text-muted-foreground">
                  {koreanTime(x.startAt)} ~ {koreanTime(x.endAt)} · {x.location}
                </p>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              오늘 등록된 일정이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>최근 공지</CardTitle>
          </CardHeader>
          <CardContent>
            {d.notices.map((p) => (
              <p key={p.id} className="border-b py-3 text-sm">
                {p.pinned ? "📌 " : ""}
                {p.title}
              </p>
            ))}
            {!d.notices.length && (
              <p className="text-sm text-muted-foreground">
                등록된 공지가 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>다가오는 과제</CardTitle>
          </CardHeader>
          <CardContent>
            {d.upcomingAssignments.map((a) => (
              <div key={a.id} className="border-b py-3 text-sm">
                {a.title}
                <p className="text-xs text-muted-foreground">
                  {koreanTime(a.dueAt)}
                </p>
              </div>
            ))}
            {!d.upcomingAssignments.length && (
              <p className="text-sm text-muted-foreground">
                제출할 과제가 없습니다.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
export function LivePosts({ question = false }: { question?: boolean }) {
  const { cohort, user } = useSession();
  const list = useResource<Post[]>(
    `/api/cohorts/${cohort!.id}/posts${question ? "?category=QUESTION" : ""}`,
    true,
  );
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState(""),
    [active, setActive] = useState<Post | null>(null),
    [comments, setComments] = useState<Comment[]>([]),
    [editor, setEditor] = useState(false),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [reply, setReply] = useState(""),
    [detailError, setDetailError] = useState("");
  const [editingComment, setEditingComment] = useState<number | null>(null),
    [editingPost, setEditingPost] = useState<number | null>(null);
  const mutation = useMutation();
  async function open(post: Post) {
    setEditingComment(null);
    setReply("");
    setDetailError("");
    setActive(post);
    setComments([]);
    try {
      const [detail, answers] = await Promise.all([
        api<Post>(`/api/posts/${post.id}`),
        allPages<Comment>(`/api/posts/${post.id}/comments`),
      ]);
      setActive(detail);
      setComments(answers);
    } catch (e) {
      setDetailError((e as Error).message);
    }
  }
  const rows = (list.data || []).filter(
    (x) =>
      (question || x.category !== "QUESTION") &&
      (!category || x.category === category) &&
      x.title.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-wrap gap-3 p-4">
          <input
            className={`${fieldClass} flex-1`}
            aria-label="게시글 검색"
            placeholder="제목 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {!question && (
            <select
              className={fieldClass + " sm:w-40"}
              aria-label="게시판 분류"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">전체 공지 / FAQ</option>
              {["COURSE", "SYSTEM", "FAQ"].map((x) => (
                <option key={x} value={x}>
                  {labels[x]}
                </option>
              ))}
            </select>
          )}
          {question && (
            <Button
              onClick={() => {
                setTitle("");
                setBody("");
                setEditor(true);
              }}
            >
              질문 작성
            </Button>
          )}
        </CardContent>
      </Card>
      {list.loading || list.error ? (
        <State {...list} retry={list.reload} />
      ) : !rows.length ? (
        <State {...list} empty retry={list.reload} />
      ) : (
        rows.map((x) => (
          <Card key={x.id}>
            <button
              className="w-full p-5 text-left hover:bg-muted/40"
              onClick={() => open(x)}
            >
              <div className="mb-2 flex items-center gap-2">
                <Badge variant="secondary">{labels[x.category]}</Badge>
                {x.pinned && <Badge>상단 고정</Badge>}
              </div>
              <h3 className="font-semibold">{x.title}</h3>
              <p className="mt-2 text-xs text-muted-foreground">
                {x.authorName} · {koreanTime(x.createdAt)} · 조회 {x.views}
              </p>
            </button>
          </Card>
        ))
      )}
      <Dialog
        open={!!active}
        onOpenChange={(v) => {
          if (!v) setActive(null);
        }}
      >
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogTitle>{active?.title}</DialogTitle>
          <DialogDescription>
            {active?.authorName} · {koreanTime(active?.createdAt)}
          </DialogDescription>
          {detailError ? (
            <p role="alert" className="text-destructive">
              {detailError}
            </p>
          ) : (
            <>
              <p className="whitespace-pre-wrap text-sm">{active?.body}</p>
              <Files files={active?.files} />
              <div className="space-y-3 border-t pt-4">
                <h3 className="font-semibold">답변 / 댓글 {comments.length}</h3>
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground">
                      {c.authorName} · {koreanTime(c.createdAt)}
                    </p>
                    <p className="my-2 whitespace-pre-wrap text-sm">{c.body}</p>
                    {(user.id === c.authorId || user.role === "ADMIN") && (
                      <div className="flex gap-2">
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => {
                            setReply(c.body);
                            setEditingComment(c.id);
                          }}
                        >
                          수정
                        </Button>
                        <Button
                          size="xs"
                          variant="destructive"
                          disabled={mutation.busy}
                          onClick={() =>
                            mutation.run(async () => {
                              await api(`/api/comments/${c.id}`, "DELETE");
                              await open(active!);
                            }, "댓글을 삭제했습니다.")
                          }
                        >
                          삭제
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <form
                className="space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  mutation.run(async () => {
                    await api(
                      editingComment
                        ? `/api/comments/${editingComment}`
                        : `/api/posts/${active!.id}/comments`,
                      editingComment ? "PATCH" : "POST",
                      { body: reply },
                    );
                    setReply("");
                    setEditingComment(null);
                    await open(active!);
                  }, "답변을 저장했습니다.");
                }}
              >
                <textarea
                  className={fieldClass}
                  aria-label="답변 내용"
                  required
                  minLength={1}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <Button type="submit" disabled={mutation.busy}>
                  {editingComment ? "답변 수정" : "답변 등록"}
                </Button>
              </form>
              {active &&
                (user.id === active.authorId || user.role === "ADMIN") && (
                  <div className="flex gap-2 border-t pt-3">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setTitle(active.title);
                        setBody(active.body);
                        setEditingPost(active.id);
                        setEditor(true);
                      }}
                    >
                      게시글 수정
                    </Button>
                    <Button
                      variant="destructive"
                      disabled={mutation.busy}
                      onClick={() =>
                        mutation.run(async () => {
                          await api(`/api/posts/${active.id}`, "DELETE");
                          setActive(null);
                          list.reload();
                        }, "게시글을 삭제했습니다.")
                      }
                    >
                      게시글 삭제
                    </Button>
                  </div>
                )}
            </>
          )}
        </DialogContent>
      </Dialog>
      <Dialog
        open={editor}
        onOpenChange={(v) => {
          setEditor(v);
          if (!v) setEditingPost(null);
        }}
      >
        <DialogContent>
          <DialogTitle>{editingPost ? "질문 수정" : "질문 작성"}</DialogTitle>
          <DialogDescription>내용을 입력하고 저장해 주세요.</DialogDescription>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              mutation.run(async () => {
                await api(
                  editingPost
                    ? `/api/posts/${editingPost}`
                    : `/api/cohorts/${cohort!.id}/posts`,
                  editingPost ? "PATCH" : "POST",
                  { title, body, category: "QUESTION" },
                );
                setEditor(false);
                setEditingPost(null);
                setActive(null);
                list.reload();
              }, "질문을 저장했습니다.");
            }}
          >
            <label className="grid gap-2 text-sm">
              제목
              <input
                className={fieldClass}
                required
                minLength={2}
                maxLength={160}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              내용
              <textarea
                className={fieldClass}
                required
                minLength={2}
                rows={7}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </label>
            <Button type="submit" disabled={mutation.busy}>
              저장하기
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function LiveAssignments() {
  const { cohort } = useSession();
  const list = useResource<Assignment[]>(
    `/api/cohorts/${cohort!.id}/assignments`,
    true,
  );
  const [selected, setSelected] = useState<Assignment | null>(null),
    [repo, setRepo] = useState(""),
    [deploy, setDeploy] = useState(""),
    [memo, setMemo] = useState(""),
    [file, setFile] = useState<File | null>(null),
    [filter, setFilter] = useState("");
  const { busy, run } = useMutation();
  async function open(item: Assignment) {
    await run(async () => {
      const detail = await api<Assignment>(`/api/assignments/${item.id}`);
      setSelected(detail);
      setRepo(detail.mySubmission?.repositoryUrl || "");
      setDeploy(detail.mySubmission?.deploymentUrl || "");
      setMemo(detail.mySubmission?.body || "");
      setFile(null);
    });
  }
  if (list.loading || list.error)
    return <State {...list} retry={list.reload} />;
  const rows = (list.data || []).filter((x) => !filter || x.status === filter);
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {["", "미제출", "제출완료"].map((v) => (
          <Button
            key={v}
            variant={filter === v ? "default" : "outline"}
            onClick={() => setFilter(v)}
          >
            {v || "전체"}
          </Button>
        ))}
      </div>
      {!rows.length && <State {...list} empty retry={list.reload} />}
      {rows.map((x) => (
        <Card key={x.id}>
          <CardHeader>
            <div className="flex justify-between gap-3">
              <CardTitle>{x.title}</CardTitle>
              <Badge variant="secondary">{x.status}</Badge>
            </div>
            <p className="text-xs text-muted-foreground">
              {x.subject} · {x.instructorName || x.author || "담당 강사 미지정"} · 마감{" "}
              {koreanTime(x.dueAt)}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="whitespace-pre-wrap text-sm">{x.description}</p>
            {x.feedback && (
              <div className="rounded-lg bg-muted p-4 text-sm">
                <strong>
                  {x.feedback.score}점 · {x.feedback.mentor}
                </strong>
                <p>{x.feedback.comment}</p>
              </div>
            )}
            <Button disabled={busy} onClick={() => open(x)}>
              {x.submissionLocked
                ? "제출 내역 확인"
                : x.mySubmission
                  ? "제출 확인 / 수정"
                  : "과제 제출"}
            </Button>
          </CardContent>
        </Card>
      ))}
      <Dialog
        open={!!selected}
        onOpenChange={(v) => {
          if (!v) setSelected(null);
        }}
      >
        <DialogContent className="max-h-[88vh] overflow-auto sm:max-w-xl">
          <DialogTitle>{selected?.title}</DialogTitle>
          <DialogDescription>
            제출 성공 후 최종 업로드 시각과 채점 상태를 다시 조회합니다.
          </DialogDescription>
          <Files files={selected?.files} />
          <p className="text-xs text-muted-foreground">
            최종 업로드: {koreanTime(selected?.mySubmission?.submittedAt)}
          </p>
          <Files files={selected?.mySubmission?.files} />
          {selected?.submissionLocked && (
            <p className="rounded-lg bg-muted p-3 text-sm">
              {selected.lockReason ||
                "채점 완료 또는 마감으로 제출물 수정이 잠겼습니다."}
            </p>
          )}
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                const form = new FormData();
                form.set("repoUrl", repo);
                form.set("deployUrl", deploy);
                form.set("submitMemo", memo);
                if (file) form.set("file", file);
                await api(
                  `/api/assignments/${selected!.id}/submission`,
                  "PUT",
                  form,
                );
                setSelected(await api(`/api/assignments/${selected!.id}`));
                setFile(null);
                list.reload();
              }, "과제 제출을 완료했습니다.");
            }}
          >
            <label className="grid gap-2 text-sm">
              저장소 URL
              <input
                className={fieldClass}
                type="url"
                value={repo}
                disabled={selected?.submissionLocked}
                onChange={(e) => setRepo(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              배포 URL
              <input
                className={fieldClass}
                type="url"
                value={deploy}
                disabled={selected?.submissionLocked}
                onChange={(e) => setDeploy(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              제출 메모
              <textarea
                className={fieldClass}
                rows={4}
                value={memo}
                disabled={selected?.submissionLocked}
                onChange={(e) => setMemo(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              첨부파일 (최대 50MiB)
              <input
                type="file"
                disabled={selected?.submissionLocked}
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
            </label>
            <Button
              type="submit"
              disabled={
                busy ||
                selected?.submissionLocked ||
                (!repo.trim() && !deploy.trim() && !memo.trim() && !file) ||
                (!!file && file.size > 50 * 1024 * 1024)
              }
            >
              제출 저장
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function LiveSchedule() {
  const { cohort } = useSession();
  const [replayDate, setReplayDate] = useState(today());
  const [month, setMonth] = useState(today().slice(0, 7)),
    [target, setTarget] = useState<Attendance | null>(null),
    [reason, setReason] = useState(""),
    [requested, setRequested] = useState("PRESENT");
  const calendar = useResource<{ events: Event[]; attendance: Attendance[] }>(
    `/api/cohorts/${cohort!.id}/attendance/calendar?month=${month}`,
  );
  const events = { ...calendar, data: calendar.data?.events };
  const attendance = { ...calendar, data: calendar.data?.attendance };
  const corrections = { ...calendar, data: calendar.data?.attendance.flatMap(a => a.latestCorrection ? [{ ...a.latestCorrection, attendanceId: a.id }] : []) };
  const { busy, run } = useMutation();
  const [year, m] = month.split("-").map(Number);
  const count = new Date(year, m, 0).getDate(),
    offset = new Date(year, m - 1, 1).getDay();
  const replayDates = useResource<{ dates: { date: string; videoCount: number }[] }>(
    `/api/cohorts/${cohort!.id}/lecture-replays/dates?from=${month}-01&to=${month}-${count}`,
  );
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">교육 캘린더</h2>
        <input
          type="month"
          aria-label="조회 월"
          className={fieldClass + " max-w-48"}
          value={month}
          onChange={(e) => {
            if (e.target.value) setMonth(e.target.value);
          }}
        />
      </div>
      {events.error || attendance.error ? (
        <State
          loading={false}
          error={events.error || attendance.error}
          retry={() => {
            events.reload();
            attendance.reload();
          }}
        />
      ) : (
        <Card>
          <CardContent className="overflow-auto p-4">
            <div className="grid min-w-[600px] grid-cols-7">
              {["일", "월", "화", "수", "목", "금", "토"].map((day) => (
                <div
                  className="border-b p-3 text-center text-xs text-muted-foreground"
                  key={day}
                >
                  {day}
                </div>
              ))}
              {Array.from({ length: offset }, (_, i) => (
                <div key={"blank" + i} />
              ))}
              {Array.from({ length: count }, (_, i) => {
                const day = `${month}-${String(i + 1).padStart(2, "0")}`;
                return (
                  <div
                    key={day}
                    className={`min-h-28 border-b border-r p-2 text-xs ${day === today() ? "bg-indigo-500/10" : ""}`}
                  >
                    <strong>{i + 1}</strong>
                    {events.data
                      ?.filter((e) => eventOnKoreanDay(e, day))
                      .map((e) => (
                        <div key={e.id} className="mt-2 rounded bg-muted p-1">
                          {e.title}
                        </div>
                      ))}
                    {replayDates.data?.dates.some(entry => entry.date === day) && <button className="mt-2 block text-indigo-500 underline" onClick={() => setReplayDate(day)}>강의 다시보기</button>}
                    {attendance.data
                      ?.filter((a) => a.attendanceDate === day)
                      .map((a) => (
                        <div key={a.id} className="mt-2 space-y-1">
                          <Badge variant="secondary">
                            {labels[a.status]} ·{" "}
                            {a.unitType === "DATE"
                              ? "일자"
                              : a.sessionNo + "회차"}
                          </Badge>
                          {(a.availableRequestedStatuses?.length ?? (a.status !== "PRESENT" ? 1 : 0)) > 0 && (
                            <button
                              className="block text-indigo-500 underline"
                              disabled={corrections.data?.some(
                                (c) =>
                                  c.attendanceId === a.id &&
                                  c.status === "PENDING",
                              )}
                              onClick={() => {
                                setTarget(a);
                                setReason("");
                                setRequested("PRESENT");
                              }}
                            >
                              {corrections.data?.some(
                                (c) =>
                                  c.attendanceId === a.id &&
                                  c.status === "PENDING",
                              )
                                ? "소명 검토 중"
                                : "소명 요청"}
                            </button>
                          )}
                        </div>
                      ))}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
      {corrections.error && (
        <State {...corrections} retry={corrections.reload} />
      )}
      <Card>
        <CardHeader>
          <CardTitle>나의 소명 요청</CardTitle>
        </CardHeader>
        <CardContent>
          {corrections.data?.length ? (
            corrections.data.map((c) => (
              <div
                className="flex justify-between gap-4 border-b py-3 text-sm"
                key={c.id}
              >
                <span>{c.reason}</span>
                <Badge variant="outline">{labels[c.status]}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              소명 요청 내역이 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
      <Dialog
        open={!!target}
        onOpenChange={(v) => {
          if (!v) setTarget(null);
        }}
      >
        <DialogContent>
          <DialogTitle>출결 소명 요청</DialogTitle>
          <DialogDescription>
            {target?.attendanceDate} · {labels[target?.status || ""]}
          </DialogDescription>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api(`/api/attendance/${target!.id}/corrections`, "POST", {
                  requestedStatus: requested,
                  ...(reason.trim() ? { reason } : {}),
                });
                setTarget(null);
                corrections.reload();
              }, "소명 요청을 접수했습니다. 승인 전까지 원본 출결은 유지됩니다.");
            }}
          >
            <label className="grid gap-2 text-sm">
              정정할 상태
              <select
                className={fieldClass}
                value={requested}
                onChange={(e) => setRequested(e.target.value)}
              >
                <option value="PRESENT">출석</option>
                {target?.status === "ABSENT" && (
                  <option value="LATE">지각</option>
                )}
              </select>
            </label>
            <label className="grid gap-2 text-sm">
              소명 사유
              <textarea
                className={fieldClass}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                minLength={reason ? 5 : undefined}
              />
            </label>
            <Button type="submit" disabled={busy}>
              소명 요청
            </Button>
          </form>
        </DialogContent>
      </Dialog>
      {replayDates.error && <State {...replayDates} retry={replayDates.reload} />}
      <LectureArchive key={`${cohort!.id}:${replayDate}`} initialDate={replayDate} />
    </div>
  );
}
export function LiveVideos() {
  return <LectureArchive />;
}
function UnavailableFeature({ title }: { title: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          현재 백엔드에서 제공하지 않는 기능입니다. 목업 모드에서는 화면을
          시연할 수 있습니다.
        </p>
      </CardContent>
    </Card>
  );
}
type Question = {
  id: number;
  prompt: string;
  explanation?: string;
  topicId?: number;
  points: number;
  options: { id: number; label: string; isCorrect?: boolean }[];
};
type Assessment = {
  id: number;
  title: string;
  domain: string;
  status: string;
  startAt: string;
  endAt: string;
  durationMinutes: number;
  myAttempt?: Attempt;
};
type Attempt = {
  id: number;
  status: string;
  score?: number;
  expiresAt: string;
  remainingSeconds: number;
  expired: boolean;
  questions: Question[];
  answers: { questionId: number; optionId: number; isCorrect?: boolean }[];
};
export function LiveAssessments() {
  const { cohort } = useSession();
  const list = useResource<Assessment[]>(
      `/api/cohorts/${cohort!.id}/assessments`,
      true,
    ),
    report = useResource<{
      results: {
        id: number;
        title: string;
        score: number;
        cohortAverage: number;
      }[];
    }>(`/api/cohorts/${cohort!.id}/assessment-report`);
  const [attempt, setAttempt] = useState<Attempt | null>(null),
    [answers, setAnswers] = useState<Record<number, number>>({}),
    [remaining, setRemaining] = useState(0);
  const { busy, run } = useMutation();
  useEffect(() => {
    if (!attempt) return;
    const tick = () =>
      setRemaining(
        Math.max(
          0,
          Math.floor(
            (new Date(attempt.expiresAt).valueOf() - Date.now()) / 1000,
          ),
        ),
      );
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [attempt]);
  async function open(x: Assessment) {
    await run(async () => {
      const detail = await api<Assessment>(`/api/assessments/${x.id}`);
      const result = detail.myAttempt
        ? await api<Attempt>(`/api/assessment-attempts/${detail.myAttempt.id}`)
        : await api<Attempt>(`/api/assessments/${x.id}/attempts`, "POST", {});
      setAnswers(
        Object.fromEntries(
          result.answers.map((a) => [a.questionId, a.optionId]),
        ),
      );
      setAttempt(result);
    });
  }
  return (
    <div className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>역량평가 리포트</CardTitle>
        </CardHeader>
        <CardContent>
          {report.error ? (
            <p role="alert">{report.error}</p>
          ) : report.data?.results.length ? (
            report.data.results.map((x) => (
              <div
                className="flex flex-wrap justify-between gap-3 border-b py-4"
                key={x.id}
              >
                <strong>{x.title}</strong>
                <span className="text-sm">
                  내 점수 {x.score} · 기수 평균{" "}
                  {Number(x.cohortAverage).toFixed(1)}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              완료된 평가 결과가 없습니다.
            </p>
          )}
        </CardContent>
      </Card>
      {list.error || list.loading ? (
        <State {...list} retry={list.reload} />
      ) : list.data?.length ? (
        list.data.map((x) => (
          <Card key={x.id}>
            <CardContent className="flex flex-wrap items-center justify-between gap-4 p-5">
              <div>
                <strong>{x.title}</strong>
                <p className="mt-2 text-xs text-muted-foreground">
                  {x.domain} · {koreanTime(x.startAt)} ~ {koreanTime(x.endAt)} ·{" "}
                  {x.durationMinutes}분
                </p>
              </div>
              <Badge variant="outline">{labels[x.status]}</Badge>
              <Button disabled={busy} onClick={() => open(x)}>
                응시 / 내역 확인
              </Button>
              {x.status !== "DRAFT" && <AssessmentReview assessmentId={x.id} />}
            </CardContent>
          </Card>
        ))
      ) : (
        <State {...list} empty retry={list.reload} />
      )}
      <Dialog
        open={!!attempt}
        onOpenChange={(v) => {
          if (!v) setAttempt(null);
        }}
      >
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-2xl">
          <DialogTitle>
            역량평가{" "}
            {attempt?.status === "IN_PROGRESS"
              ? `· 남은 시간 ${Math.floor(remaining / 60)}:${String(remaining % 60).padStart(2, "0")}`
              : `· ${attempt?.score ?? 0}점`}
          </DialogTitle>
          <DialogDescription>
            답안은 저장 버튼으로 보관합니다. 제출 시 서버에서 채점하며 마감
            후에는 저장된 답안만 채점합니다.
          </DialogDescription>
          {attempt?.questions.map((q, i) => (
            <div className="space-y-3 rounded-lg border p-4" key={q.id}>
              <h3 className="font-semibold">
                {i + 1}. {q.prompt}
              </h3>
              {q.options.map((o) => (
                <label
                  key={o.id}
                  className="flex gap-2 rounded-lg bg-muted/50 p-3 text-sm"
                >
                  <input
                    type="radio"
                    name={"q" + q.id}
                    checked={answers[q.id] === o.id}
                    disabled={
                      attempt.status !== "IN_PROGRESS" || remaining === 0
                    }
                    onChange={() => setAnswers({ ...answers, [q.id]: o.id })}
                  />
                  {o.label}
                  {o.isCorrect === true && <Badge>정답</Badge>}
                </label>
              ))}
              {q.explanation && (
                <p className="text-sm text-muted-foreground">
                  해설: {q.explanation}
                </p>
              )}
            </div>
          ))}
          {attempt?.status === "IN_PROGRESS" && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                disabled={
                  busy || remaining === 0 || !Object.keys(answers).length
                }
                onClick={() =>
                  run(async () => {
                    setAttempt(
                      await api(
                        `/api/assessment-attempts/${attempt.id}/answers`,
                        "PUT",
                        {
                          answers: Object.entries(answers).map(
                            ([questionId, optionId]) => ({
                              questionId: Number(questionId),
                              optionId,
                            }),
                          ),
                        },
                      ),
                    );
                  }, "답안을 저장했습니다.")
                }
              >
                답안 저장
              </Button>
              <Button
                disabled={busy}
                onClick={() =>
                  run(async () => {
                    if (remaining > 0 && Object.keys(answers).length)
                      await api(
                        `/api/assessment-attempts/${attempt.id}/answers`,
                        "PUT",
                        {
                          answers: Object.entries(answers).map(
                            ([questionId, optionId]) => ({
                              questionId: Number(questionId),
                              optionId,
                            }),
                          ),
                        },
                      );
                    setAttempt(
                      await api(
                        `/api/assessment-attempts/${attempt.id}/submit`,
                        "POST",
                        {},
                      ),
                    );
                    list.reload();
                    report.reload();
                  }, "평가 제출 및 채점을 완료했습니다.")
                }
              >
                {remaining === 0 ? "마감된 평가 확정" : "최종 제출"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
export function LiveProfile() {
  const { user, reload, logout } = useSession();
  const [name, setName] = useState(user.name),
    [phone, setPhone] = useState(user.phone || ""),
    [currentPassword, setCurrent] = useState(""),
    [newPassword, setNew] = useState("");
  const { busy, run } = useMutation();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>내 정보</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api("/api/me", "PATCH", { name, phone });
                await reload();
              }, "개인정보를 저장했습니다.");
            }}
          >
            <p className="text-sm text-muted-foreground">
              {user.email} · {user.role}
            </p>
            <label className="grid gap-2 text-sm">
              이름
              <input
                className={fieldClass}
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              전화번호
              <input
                type="tel"
                className={fieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </label>
            <Button type="submit" disabled={busy}>
              정보 저장
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 변경</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              run(async () => {
                await api("/api/me/password", "PATCH", {
                  currentPassword,
                  newPassword,
                });
                setCurrent("");
                setNew("");
                await logout();
              }, "비밀번호를 변경했습니다. 다시 로그인해 주세요.");
            }}
          >
            <label className="grid gap-2 text-sm">
              현재 비밀번호
              <input
                type="password"
                autoComplete="current-password"
                className={fieldClass}
                required
                value={currentPassword}
                onChange={(e) => setCurrent(e.target.value)}
              />
            </label>
            <label className="grid gap-2 text-sm">
              새 비밀번호
              <input
                type="password"
                autoComplete="new-password"
                className={fieldClass}
                required
                minLength={8}
                maxLength={72}
                value={newPassword}
                onChange={(e) => setNew(e.target.value)}
              />
            </label>
            <Button type="submit" disabled={busy}>
              비밀번호 변경
            </Button>
          </form>
          <p className="mt-5 text-xs text-muted-foreground">
            AWS 계정 및 수당 계좌는 현재 백엔드에 저장·조회 기능이 제공되지
            않습니다.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
export function LiveNotifications() {
  const list = useResource<
    {
      id: number;
      title: string;
      body: string;
      readAt: string | null;
      createdAt: string;
    }[]
  >("/api/notifications", true);
  const { busy, run } = useMutation();
  return (
    <Card>
      <CardHeader>
        <CardTitle>내 알림</CardTitle>
        <Button
          size="sm"
          variant="outline"
          disabled={busy}
          onClick={() =>
            run(async () => {
              await api("/api/notifications/read-all", "POST", {});
              list.reload();
            }, "모든 알림을 읽음 처리했습니다.")
          }
        >
          모두 읽음
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {list.error ? (
          <State {...list} retry={list.reload} />
        ) : list.data?.length ? (
          list.data.map((x) => (
            <button
              key={x.id}
              className="block w-full rounded-lg border p-3 text-left text-sm"
              disabled={busy}
              onClick={() =>
                run(async () => {
                  await api(`/api/notifications/${x.id}/read`, "PATCH", {});
                  list.reload();
                })
              }
            >
              <strong>
                {!x.readAt ? "● " : ""}
                {x.title}
              </strong>
              <p>{x.body}</p>
              <small className="text-muted-foreground">
                {koreanTime(x.createdAt)}
              </small>
            </button>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">새 알림이 없습니다.</p>
        )}
      </CardContent>
    </Card>
  );
}
export function LiveReview() {
  return <UnavailableFeature title="AI 복습" />;
}
