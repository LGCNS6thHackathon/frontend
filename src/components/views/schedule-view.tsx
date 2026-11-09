"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  Play,
  PlayCircle,
  Send,
  Video,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { REPLAY_LECTURES } from "@/lib/lms-data";

interface DayScheduleData {
  day: number;
  dateStr: string;
  title: string;
  instructor: string;
  type: "정규강의" | "특강" | "해커톤" | "평가" | "휴일";
  status: "출석" | "지각" | "결석" | "예정" | "휴일";
  checkIn?: string;
  checkOut?: string;
  hasReplay?: boolean;
}

const NOVEMBER_DAYS: DayScheduleData[] = [
  { day: 2, dateStr: "2026-11-02", title: "Next.js 15 Server Actions", instructor: "김민수 강사", type: "정규강의", status: "출석", checkIn: "08:50:22", checkOut: "18:05:10", hasReplay: true },
  { day: 3, dateStr: "2026-11-03", title: "Next.js 캐싱 & Revalidation", instructor: "김민수 강사", type: "정규강의", status: "출석", checkIn: "08:54:10", checkOut: "18:01:45", hasReplay: true },
  { day: 4, dateStr: "2026-11-04", title: "Tailwind CSS v4 & 디자인 토큰", instructor: "이지은 디자이너", type: "정규강의", status: "출석", checkIn: "08:48:33", checkOut: "18:12:00", hasReplay: true },
  { day: 5, dateStr: "2026-11-05", title: "AWS ECS & 컨테이너 아키텍처", instructor: "박서준 멘토", type: "정규강의", status: "지각", checkIn: "09:08:12", checkOut: "18:02:11", hasReplay: true },
  { day: 6, dateStr: "2026-11-06", title: "MSA 환경 테라폼 인프라 자동화", instructor: "박서준 멘토", type: "특강", status: "출석", checkIn: "08:51:00", checkOut: "18:04:19", hasReplay: true },
  { day: 9, dateStr: "2026-11-09", title: "웹 프론트엔드 실무 해커톤 (1일차)", instructor: "김민수 강사", type: "해커톤", status: "출석", checkIn: "08:52:14", checkOut: "진행 중", hasReplay: true },
  { day: 10, dateStr: "2026-11-10", title: "웹 프론트엔드 실무 해커톤 (2일차)", instructor: "김민수 강사", type: "해커톤", status: "예정" },
  { day: 11, dateStr: "2026-11-11", title: "해커톤 데모데이 & 팀 피어리뷰", instructor: "전체 멘토단", type: "해커톤", status: "예정" },
  { day: 12, dateStr: "2026-11-12", title: "생성형 AI RAG 파이프라인 특강", instructor: "김태호 강사", type: "특강", status: "예정" },
  { day: 13, dateStr: "2026-11-13", title: "FastAPI 벡터 검색 엔진 연동", instructor: "이진호 박사", type: "정규강의", status: "예정" },
  { day: 20, dateStr: "2026-11-20", title: "3차 클라우드 MSA 종합 역량평가", instructor: "교육운영국", type: "평가", status: "예정" },
];

export function ScheduleView() {
  const [selectedDay, setSelectedDay] = React.useState<DayScheduleData | null>(null);
  const [isAppealOpen, setIsAppealOpen] = React.useState(false);
  const [appealReason, setAppealReason] = React.useState("");

  const handleDayClick = (item: DayScheduleData) => {
    setSelectedDay(item);
  };

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    alert(`[소명 신청 접수 완료]\n일자: ${selectedDay?.dateStr}\n사유: ${appealReason}\n행정팀 검토 후 24시간 내 반영됩니다.`);
    setIsAppealOpen(false);
    setAppealReason("");
  };

  return (
    <div className="space-y-6">
      {/* Top Calendar Card */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b gap-3">
          <div>
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <CalendarIcon className="size-4 text-primary" />
              2026년 11월 교육 캘린더
            </CardTitle>
            <CardDescription className="text-xs">
              일정 클릭 시 강의 상세, 당일 입·퇴실 출결 타임로그 및 소명 신청이 가능합니다.
            </CardDescription>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-indigo-600" /> 정규강의
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-purple-600" /> 특강
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" /> 해커톤
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-amber-500" /> 평가
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4">
          {/* Weekday Header */}
          <div className="grid grid-cols-7 text-center font-semibold text-xs text-muted-foreground mb-2 py-1 border-b">
            <div className="text-red-500">일</div>
            <div>월</div>
            <div>화</div>
            <div>수</div>
            <div>목</div>
            <div>금</div>
            <div className="text-blue-500">토</div>
          </div>

          {/* Calendar Grid (Nov 2026 starts on Sunday 1) */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2 auto-rows-fr">
            {/* Nov 1 (Sun) */}
            <div className="min-h-[75px] sm:min-h-[90px] p-2 rounded-lg border bg-muted/20 text-muted-foreground text-xs opacity-50">
              <span className="font-semibold text-red-400">1</span>
            </div>

            {/* Days 2 to 30 */}
            {Array.from({ length: 29 }).map((_, idx) => {
              const dayNum = idx + 2;
              const isToday = dayNum === 9;
              const schedule = NOVEMBER_DAYS.find((d) => d.day === dayNum);

              return (
                <div
                  key={dayNum}
                  onClick={() => schedule && handleDayClick(schedule)}
                  className={`min-h-[75px] sm:min-h-[90px] p-1.5 sm:p-2 rounded-lg border transition-all flex flex-col justify-between ${
                    schedule ? "cursor-pointer hover:border-primary hover:shadow-sm" : "bg-muted/10 opacity-60"
                  } ${isToday ? "ring-2 ring-indigo-500 bg-indigo-500/5 font-semibold" : "bg-card"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`text-xs ${isToday ? "text-indigo-600 font-extrabold" : "text-foreground font-medium"}`}>
                      {dayNum}
                      {isToday && <span className="ml-1 text-[9px] text-indigo-600 font-bold">(오늘)</span>}
                    </span>
                    {schedule?.status && (
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded font-bold ${
                          schedule.status === "출석"
                            ? "bg-emerald-500/10 text-emerald-600"
                            : schedule.status === "지각"
                            ? "bg-amber-500/10 text-amber-600"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {schedule.status}
                      </span>
                    )}
                  </div>

                  {schedule && (
                    <div className="space-y-1 mt-1">
                      <p className="text-[10px] sm:text-[11px] font-medium text-foreground line-clamp-2 leading-tight">
                        {schedule.title}
                      </p>
                      <div className="flex items-center gap-1">
                        <span
                          className={`size-1.5 rounded-full ${
                            schedule.type === "해커톤"
                              ? "bg-emerald-500"
                              : schedule.type === "특강"
                              ? "bg-purple-600"
                              : schedule.type === "평가"
                              ? "bg-amber-500"
                              : "bg-indigo-600"
                          }`}
                        />
                        <span className="text-[9px] text-muted-foreground truncate">{schedule.type}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Replay Video Section */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Video className="size-4 text-indigo-600" />
                강의 다시보기 & AI 요약 아카이브
              </CardTitle>
              <CardDescription className="text-xs">
                지난 정규 강의 및 실습 세션을 고화질 녹화본과 AI 핵심 요약으로 복습합니다.
              </CardDescription>
            </div>
            <Badge variant="outline" className="text-xs">
              총 {REPLAY_LECTURES.length}개 강의 제공
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {REPLAY_LECTURES.map((lecture) => (
              <div
                key={lecture.id}
                className="group rounded-xl border bg-card hover:border-indigo-500/50 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="relative aspect-video bg-slate-900 flex items-center justify-center text-white overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="size-11 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform cursor-pointer">
                    <Play className="size-5 fill-white text-white ml-0.5" />
                  </div>
                  <span className="absolute bottom-2 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded font-mono">
                    {lecture.duration}
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] bg-indigo-600 px-1.5 py-0.5 rounded font-bold">
                    AI 요약 지원
                  </span>
                </div>

                <div className="p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                    <span>{lecture.date}</span>
                    <span className="font-semibold">{lecture.instructor}</span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {lecture.title}
                  </h4>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {lecture.keyTopics.map((topic, i) => (
                      <Badge key={i} variant="secondary" className="text-[9px] px-1.5 py-0">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="p-3 border-t bg-muted/20 flex gap-2">
                  <Button
                    size="sm"
                    className="w-full text-xs h-7 gap-1"
                    onClick={() => alert(`[영상 재생]\n"${lecture.title}" 고화질 플레이어를 시작합니다.`)}
                  >
                    <PlayCircle className="size-3.5" />
                    다시보기 시청
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Day Detail Dialog (Integrated Attendance & Lecture Details) */}
      <Dialog open={!!selectedDay} onOpenChange={(open) => !open && setSelectedDay(null)}>
        <DialogContent className="sm:max-w-md">
          {selectedDay && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedDay.type}</Badge>
                  <span className="text-xs text-muted-foreground font-mono">{selectedDay.dateStr}</span>
                </div>
                <DialogTitle className="text-base font-bold pt-1">
                  {selectedDay.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  담당 강사: {selectedDay.instructor}
                </DialogDescription>
              </DialogHeader>

              {/* Attendance Log Box (Integrated) */}
              <div className="rounded-xl border bg-muted/40 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <CheckCircle2 className="size-4 text-emerald-500" />
                    당일 출결 타임로그
                  </span>
                  <Badge
                    variant={selectedDay.status === "출석" ? "default" : selectedDay.status === "지각" ? "destructive" : "secondary"}
                    className="text-[10px]"
                  >
                    {selectedDay.status}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                  <div className="rounded-lg bg-background p-2 border">
                    <span className="text-[10px] text-muted-foreground block">입실 체크인</span>
                    <span className="font-mono font-bold">{selectedDay.checkIn || "기록 없음"}</span>
                  </div>
                  <div className="rounded-lg bg-background p-2 border">
                    <span className="text-[10px] text-muted-foreground block">퇴실 체크아웃</span>
                    <span className="font-mono font-bold">{selectedDay.checkOut || "기록 없음"}</span>
                  </div>
                </div>

                {selectedDay.status === "지각" && (
                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[11px] text-amber-600 dark:text-amber-400 flex items-center gap-1">
                      <AlertCircle className="size-3" /> 출결 소명이 필요하신가요?
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-[10px] h-6 px-2"
                      onClick={() => setIsAppealOpen(true)}
                    >
                      소명 신청하기
                    </Button>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end pt-2">
                {selectedDay.hasReplay && (
                  <Button
                    size="sm"
                    className="gap-1.5 text-xs"
                    onClick={() => alert(`[강의 다시보기]\n"${selectedDay.title}" 녹화본 뷰어로 이동합니다.`)}
                  >
                    <Play className="size-3" />
                    녹화본 보기
                  </Button>
                )}
                <DialogClose render={<Button variant="outline" size="sm" className="text-xs" />}>
                  닫기
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Appeal Dialog Modal */}
      <Dialog open={isAppealOpen} onOpenChange={setIsAppealOpen}>
        <DialogContent className="sm:max-w-sm">
          <form onSubmit={handleSendAppeal} className="space-y-4">
            <DialogHeader>
              <DialogTitle className="text-base font-bold">출결 소명 신청서</DialogTitle>
              <DialogDescription className="text-xs">
                {selectedDay?.dateStr} 지각/결석 사유와 증빙 서류를 제출합니다.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">소명 사유 *</label>
                <Input
                  placeholder="예: 지하철 2호선 연착 증명, 병원 진료 등"
                  value={appealReason}
                  onChange={(e) => setAppealReason(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold">증빙 서류 첨부</label>
                <Input type="file" className="cursor-pointer text-xs" />
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-2">
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAppealOpen(false)}>
                취소
              </Button>
              <Button type="submit" size="sm" className="gap-1">
                <Send className="size-3.5" /> 신청 제출
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
