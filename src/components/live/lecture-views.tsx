"use client";
import { useState } from "react";
import { api } from "@/lib/api-client";
import { today } from "@/lib/admin-model";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useSession } from "./session";
import { State, useResource, useMutation, fieldClass } from "./shared";

type Chapter = { id: number; title: string; startSeconds: number };
type Video = { id: number; title: string; periodNo: number; chapters: Chapter[] };
type Playback = { videoTitle: string; chapterTitle?: string; embedUrl: string; watchUrl: string; autoplayNotice: string; unavailableMessage: string };
type ReviewLink = { chapterId: number; chapterTitle: string; lectureDate: string; periodNo: number; startSeconds: number; matchType: string };
type Guide = { reviewReleased: boolean; questions: { questionId: number; position: number; classificationLabel: string; reviewMessage: string; reviewLinks: ReviewLink[] | null }[] };
type Recommendations = { reviewReleased: boolean; wrongCount: number; summary: string | null; items: (ReviewLink & { questionPositions: number[] })[] };
const stamp = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
function usePlayer() {
  const { cohort } = useSession();
  const [playback, setPlayback] = useState<Playback | null>(null);
  const mutation = useMutation();
  return { ...mutation, playback, close: () => setPlayback(null),
    play: (id: number, chapter = false) => mutation.run(async () => {
      setPlayback(await api<Playback>(`/api/cohorts/${cohort!.id}/${chapter ? "lecture-chapters" : "lecture-videos"}/${id}/playback`));
    }),
  };
}
function Player({ player }: { player: ReturnType<typeof usePlayer> }) {
  const [failedUrl, setFailedUrl] = useState("");
  const value = player.playback;
  return <Dialog open={!!value} onOpenChange={open => { if (!open) player.close(); }}>
    <DialogContent className="sm:max-w-4xl">
      <DialogTitle>{value?.videoTitle}{value?.chapterTitle ? ` · ${value.chapterTitle}` : ""}</DialogTitle>
      <DialogDescription>{value?.autoplayNotice || "재생 버튼을 눌러 강의를 시청하세요."}</DialogDescription>
      {value && <>
        {failedUrl !== value.embedUrl && <iframe key={value.embedUrl} title={value.videoTitle} src={value.embedUrl} className="aspect-video w-full rounded-xl border" allow="encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" onError={() => setFailedUrl(value.embedUrl)} />}
        <p className="text-sm text-muted-foreground">{value.unavailableMessage || "영상이 재생되지 않으면 YouTube에서 확인하세요."}</p>
        <a href={value.watchUrl} target="_blank" rel="noopener noreferrer" className="text-sm underline">YouTube에서 보기 ↗</a>
      </>}
    </DialogContent>
  </Dialog>;
}
export function LectureArchive({ initialDate = today() }: { initialDate?: string }) {
  const { cohort } = useSession();
  const base = `/api/cohorts/${cohort!.id}`;
  const [date, setDate] = useState(initialDate);
  const [archive, setArchive] = useState(false);
  const month = date.slice(0, 7);
  const lastDay = new Date(Number(month.slice(0, 4)), Number(month.slice(5)), 0).getDate();
  const dates = useResource<{ dates: { date: string; videoCount: number }[] }>(`${base}/lecture-replays/dates?from=${month}-01&to=${month}-${lastDay}`);
  const daily = useResource<{ videos: Video[]; emptyMessage: string | null }>(`${base}/lecture-replays?date=${date}`);
  const recent = useResource<{ items: { id: number; date: string; title: string }[] }>(`${base}/lecture-replays/recent?limit=30`);
  const catalog = useResource<{ id: number; title: string; lectureDate: string; periodNo: number }[]>(`${base}/lecture-videos`, true);
  const player = usePlayer();
  const { run, busy } = useMutation();
  return <Card>
    <CardHeader><CardTitle>강의 다시보기</CardTitle></CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <input aria-label="강의 날짜" type="date" value={date} className={fieldClass + " max-w-48"} onChange={e => { if (e.target.value) setDate(e.target.value); }} />
        <Button variant="outline" onClick={() => setArchive(!archive)}>{archive ? "날짜별 보기" : "전체 영상 보기"}</Button>
      </div>
      {recent.error ? <State {...recent} retry={recent.reload} /> : <div className="flex flex-wrap gap-2">{recent.data?.items.map(card => <Button size="sm" variant="outline" key={card.id} onClick={() => setDate(card.date)}>{card.date} · {card.title}</Button>)}</div>}
      {dates.error ? <State {...dates} retry={dates.reload} /> : <div className="flex flex-wrap gap-2">{dates.data?.dates.map(day => <Button variant={day.date === date ? "default" : "outline"} size="sm" key={day.date} onClick={() => setDate(day.date)}>{day.date.slice(5)} · {day.videoCount}개</Button>)}</div>}
      {archive ? <>
        {catalog.loading || catalog.error ? <State {...catalog} retry={catalog.reload} /> : !catalog.data?.length ? <p>등록된 공개 영상이 없습니다.</p> : catalog.data.map(video => <div key={video.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4">
          <span>{video.lectureDate} · {video.periodNo}교시 · {video.title}</span>
          <Button disabled={busy || player.busy} onClick={() => run(async () => {
            // Fetch the current public detail before opening playback, including access checks.
            await api(`/api/lecture-videos/${video.id}`);
            await player.play(video.id);
          })}>재생</Button>
        </div>)}
      </> : daily.loading || daily.error ? <State {...daily} retry={daily.reload} /> : !daily.data?.videos.length ? <p className="py-6 text-sm text-muted-foreground">{daily.data?.emptyMessage || "선택한 날짜에 등록된 강의가 없습니다."}</p> : daily.data.videos.map(video => <div key={video.id} className="space-y-3 rounded-xl border p-4">
        <div className="flex flex-wrap items-center justify-between gap-3"><strong>{video.periodNo}교시 · {video.title}</strong><Button disabled={player.busy} onClick={() => player.play(video.id)}>강의 재생</Button></div>
        <div className="flex flex-wrap gap-2">{video.chapters.map(chapter => <Button size="sm" variant="outline" key={chapter.id} disabled={player.busy} onClick={() => player.play(chapter.id, true)}>{stamp(chapter.startSeconds)} · {chapter.title}</Button>)}</div>
        {!video.chapters.length && <p className="text-xs text-muted-foreground">등록된 소단원이 없습니다.</p>}
      </div>)}
      <Player player={player} />
    </CardContent>
  </Card>;
}
function ReviewContent({ assessmentId }: { assessmentId: number }) {
  const guide = useResource<Guide>(`/api/assessments/${assessmentId}/review-guide`);
  const recommended = useResource<Recommendations>(`/api/assessments/${assessmentId}/review-recommendations`);
  const player = usePlayer();
  if (!guide.data || guide.error) return <State {...guide} retry={guide.reload} />;
  if (!guide.data.reviewReleased) return <p>해설 공개 전입니다. 공개 후 복습 영상을 확인할 수 있습니다.</p>;
  const link = (item: ReviewLink) => <Button key={item.chapterId} size="sm" variant="outline" disabled={player.busy} onClick={() => player.play(item.chapterId, true)}>{item.matchType === "TOPIC" ? "같은 개념 강의" : "복습하기"} · {item.lectureDate} {item.periodNo}교시 · {stamp(item.startSeconds)} · {item.chapterTitle}</Button>;
  return <div className="space-y-4">
    <section className="space-y-2 rounded-xl border p-4"><h3 className="font-semibold">추천 복습</h3>
      {recommended.loading || recommended.error ? <State {...recommended} retry={recommended.reload} /> : <><p className="text-sm">{recommended.data?.summary || "추천 복습 영상이 없습니다."}</p>{recommended.data?.items.map(item => <div key={item.chapterId}>{link(item)}<p className="mt-1 text-xs text-muted-foreground">관련 문항: {item.questionPositions.join(", ")}</p></div>)}</>}
    </section>
    {guide.data.questions.map(question => <section key={question.questionId} className="space-y-2 rounded-xl border p-4"><h3 className="font-semibold">{question.position}번 · {question.classificationLabel || "단원 미분류"}</h3><div className="flex flex-wrap gap-2">{question.reviewLinks?.length ? question.reviewLinks.map(link) : <p className="text-sm text-muted-foreground">{question.reviewMessage || "연결된 복습 영상 없음"}</p>}</div></section>)}
    {!guide.data.questions.length && <p>복습할 문항이 없습니다.</p>}
    <Player player={player} />
  </div>;
}
export function AssessmentReview({ assessmentId }: { assessmentId: number }) {
  const [open, setOpen] = useState(false);
  return <><Button variant="outline" onClick={() => setOpen(true)}>문항별 복습 · 추천 영상</Button><Dialog open={open} onOpenChange={setOpen}><DialogContent className="max-h-[90vh] overflow-auto sm:max-w-3xl"><DialogTitle>평가 복습 가이드</DialogTitle><DialogDescription>해설 공개 후 문항 분류와 연결된 강의 구간을 확인합니다.</DialogDescription>{open && <ReviewContent assessmentId={assessmentId} />}</DialogContent></Dialog></>;
}
