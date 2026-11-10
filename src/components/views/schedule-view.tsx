"use client";

import * as React from "react";
import {
  AlertCircle,
  Calendar as CalendarIcon,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  FileText,
  List,
  MapPin,
  Play,
  Send,
  Sparkles,
  User,
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
import {
  CurriculumScheduleItem,
  REAL_CURRICULUM_NOVEMBER,
  REPLAY_LECTURES,
  ReplayLecture,
  TODAY_SCHEDULE,
} from "@/lib/lms-data";

interface ScheduleViewProps {
  onNavigate?: (tab: string) => void;
}

export function ScheduleView({ onNavigate }: ScheduleViewProps) {
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">("calendar");
  const [selectedItem, setSelectedItem] = React.useState<CurriculumScheduleItem | null>(null);
  const [isAppealOpen, setIsAppealOpen] = React.useState(false);
  const [appealReason, setAppealReason] = React.useState("");

  // Video Replay Modal State
  const [activeReplay, setActiveReplay] = React.useState<ReplayLecture | null>(null);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handleItemClick = (item: CurriculumScheduleItem) => {
    setSelectedItem(item);
  };

  const handleOpenReplay = (lecture: ReplayLecture, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActiveReplay(lecture);
    setIsPlaying(true);
  };

  const handleOpenReplayFromItem = (item: CurriculumScheduleItem, e: React.MouseEvent) => {
    e.stopPropagation();
    // Match with corresponding replay or create seamless session replay
    const matched = REPLAY_LECTURES.find((r) => r.id === item.id) || {
      id: item.id,
      date: item.dateStr,
      title: item.title,
      subject: item.category,
      instructor: item.instructor,
      duration: "2시간 40분",
      videoUrl: "https://lms.wsts.kr/replay/" + item.dateStr,
      keyTopics: ["Java & MSA 아키텍처", "Spring Boot 3", "핵심 실습 데모"],
      hasAiSummary: true,
    };
    setActiveReplay(matched);
    setIsPlaying(true);
  };

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    alert(
      `[출결 소명 신청 접수 완료]\n일자: ${selectedItem?.dateStr}\n사유: ${appealReason}\n운영국 및 고용센터 검토 후 24시간 내 반영됩니다.`
    );
    setIsAppealOpen(false);
    setAppealReason("");
  };

  // Category badge colors with subtle pastel tints
  const getTypeBadge = (type: CurriculumScheduleItem["type"], label: string) => {
    switch (type) {
      case "hackathon":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800">
            {label}
          </span>
        );
      case "project":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
            {label}
          </span>
        );
      case "lecture":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300 border border-purple-200/60 dark:border-purple-800">
            {label}
          </span>
        );
      case "workshop":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300 border border-blue-200/60 dark:border-blue-800">
            {label}
          </span>
        );
      case "mentoring":
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800">
            {label}
          </span>
        );
      case "holiday":
        return null; // Omit inside body to prevent duplicate holiday labels
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {label}
          </span>
        );
    }
  };

  // Attendance badge rendered strictly at the TOP-RIGHT of each date cell
  const getTopRightAttendanceBadge = (status: CurriculumScheduleItem["status"]) => {
    switch (status) {
      case "출석":
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/70 dark:text-emerald-300 border border-emerald-200/70 dark:border-emerald-800 shrink-0">
            출석
          </span>
        );
      case "진행 중":
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-indigo-600 text-white shrink-0 shadow-2xs">
            진행 중
          </span>
        );
      case "휴강":
        return (
          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200/70 dark:border-rose-800 shrink-0">
            휴강
          </span>
        );
      case "예정":
      default:
        return null; // Keep clean and uncluttered without repeating "예정" 20 times
    }
  };

  // Modern event card styles per category with 3.5px left border accent
  const EVENT_THEMES: Record<string, { border: string; bg: string; text: string }> = {
    project: {
      border: "border-l-indigo-500",
      bg: "bg-indigo-50/75 dark:bg-indigo-950/35",
      text: "text-indigo-950 dark:text-indigo-100",
    },
    hackathon: {
      border: "border-l-emerald-500",
      bg: "bg-emerald-50/75 dark:bg-emerald-950/35",
      text: "text-emerald-950 dark:text-emerald-100",
    },
    lecture: {
      border: "border-l-purple-500",
      bg: "bg-purple-50/75 dark:bg-purple-950/35",
      text: "text-purple-950 dark:text-purple-100",
    },
    workshop: {
      border: "border-l-blue-500",
      bg: "bg-blue-50/75 dark:bg-blue-950/35",
      text: "text-blue-950 dark:text-blue-100",
    },
    mentoring: {
      border: "border-l-amber-500",
      bg: "bg-amber-50/75 dark:bg-amber-950/35",
      text: "text-amber-950 dark:text-amber-100",
    },
  };

  // Helper to format clean, non-repetitive event title and continuous sprint info
  const getEventDisplay = (item: CurriculumScheduleItem) => {
    // 2. Remove "자율 학습 / 재충전" box completely per user request
    if (item.type === "holiday") {
      return null;
    }

    // Continuous sprint series naming (1. Remove (기획), (데모), (워크숍) etc.)
    const title = item.shortTitle.replace(/📚|🤩/g, "").trim();
    let seriesProgress = "";

    if (title.includes("미니 PJT")) {
      const dayMap: Record<number, string> = { 2: "1/4일차", 3: "2/4일차", 4: "3/4일차", 5: "4/4일차" };
      seriesProgress = dayMap[item.day] || "";
    } else if (title.includes("해커톤")) {
      seriesProgress = item.day === 9 ? "1/2일차" : "2/2일차"; // (기획), (데모) 제거
    } else if (title.includes("Agile")) {
      seriesProgress = item.day === 11 ? "1/2일차" : "2/2일차"; // (워크숍) 제거
    } else if (title.includes("최종 프로젝트")) {
      seriesProgress = `Day ${item.day - 16}`;
    } else if (title.includes("멘토링")) {
      seriesProgress = item.day === 14 ? "1회차" : "2회차";
    }

    const displayLabel = seriesProgress ? `${title} · ${seriesProgress}` : title;

    return {
      type: item.type,
      title,
      seriesProgress,
      displayLabel,
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Header & View Controls Bar */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Title & Description with enhanced typography */}
            <div>
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4.5 text-indigo-600 dark:text-indigo-400" />
                <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                  2026년 11월 교육 캘린더
                </h2>
                <Badge
                  variant="outline"
                  className="text-[11px] font-semibold border-indigo-200 text-indigo-600 dark:border-indigo-900 dark:text-indigo-400"
                >
                  WSTS 실시간 연동
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                일정을 클릭하시면 교과목 세부 계획, ZEP 강의실 링크, 입·퇴실 출결 타임로그 및 소명 신청 폼을 확인하실 수 있습니다.
              </p>
            </div>

            {/* Navigation & View Toggle (달력 / 목록) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Month Navigation */}
              <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => alert("10월 일정은 목록 보기에서 조회 가능합니다.")}
                >
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-xs font-bold px-2.5 text-foreground font-mono">
                  2026-11
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="h-7 w-7 text-muted-foreground"
                  onClick={() => alert("12월 최종 프로젝트 일정으로 이동합니다.")}
                >
                  <ChevronRight className="size-3.5" />
                </Button>
              </div>

              {/* Today Button */}
              <Button
                variant="outline"
                size="sm"
                className="h-8 text-xs font-semibold px-2.5 border-border/80 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40"
                onClick={() => {
                  const todayItem = REAL_CURRICULUM_NOVEMBER.find((d) => d.isToday);
                  if (todayItem) setSelectedItem(todayItem);
                }}
              >
                오늘 (11/09)
              </Button>

              {/* View Switch Segmented Control (달력 ↔ 목록) */}
              <div className="flex items-center rounded-lg bg-muted p-0.5 border border-border/40">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "calendar"
                      ? "bg-background text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <CalendarIcon className="size-3.5" />
                  <span>달력</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-background text-primary shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <List className="size-3.5" />
                  <span>목록</span>
                </button>
              </div>
            </div>
          </div>

          {/* Clean Legend Badges (Removed "범례:" label per user request) */}
          <div className="flex flex-wrap items-center gap-3 pt-3.5 mt-3 border-t border-border/60 text-xs">
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-indigo-500" /> 프로젝트
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" /> 해커톤
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-purple-500" /> 특강(Agile)
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-amber-500" /> 멘토링
            </span>
            <span className="flex items-center gap-1.5 text-muted-foreground text-[11px]">
              <span className="size-2 rounded-full bg-rose-500" /> 휴강
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Mode 1: Calendar Grid View (Completely Redesigned with Clean Layout) */}
      {viewMode === "calendar" && (
        <Card className="border-border/60 shadow-xs overflow-hidden">
          <CardContent className="p-3 sm:p-5">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 text-center font-semibold text-xs py-2 border-b border-border/80 mb-2">
              <div className="text-rose-500 font-bold">일</div>
              <div className="text-muted-foreground">월</div>
              <div className="text-muted-foreground">화</div>
              <div className="text-muted-foreground">수</div>
              <div className="text-muted-foreground">목</div>
              <div className="text-muted-foreground">금</div>
              <div className="text-sky-500 font-bold">토</div>
            </div>

            {/* 7-column Calendar Grid (Nov 2026 starts on Sunday 1) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 auto-rows-fr">
              {/* Day 1 (Sun) */}
              <div className="min-h-[105px] sm:min-h-[124px] p-2 rounded-xl border border-dashed border-border/40 bg-muted/10 text-muted-foreground opacity-50 flex flex-col justify-between">
                <span className="text-xs font-semibold text-rose-400 font-mono">1</span>
                <span className="text-[10px] text-muted-foreground/60">일정 없음</span>
              </div>

              {/* Days 2 to 30 */}
              {Array.from({ length: 29 }).map((_, idx) => {
                const dayNum = idx + 2;
                const dayOfWeekIdx = (dayNum - 1) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
                const isSunday = dayOfWeekIdx === 0;
                const isSaturday = dayOfWeekIdx === 6;

                const item = REAL_CURRICULUM_NOVEMBER.find((d) => d.day === dayNum);
                const isToday = item?.isToday;
                const isHoliday = item?.type === "holiday";
                const eventDisplay = item ? getEventDisplay(item) : null;
                const theme = eventDisplay ? EVENT_THEMES[eventDisplay.type] || EVENT_THEMES.project : null;

                return (
                  <div
                    key={dayNum}
                    onClick={() => item && handleItemClick(item)}
                    className={`min-h-[105px] sm:min-h-[124px] p-2 sm:p-2.5 rounded-xl border transition-all flex flex-col justify-between relative group ${
                      item
                        ? "cursor-pointer hover:border-primary/50 hover:shadow-xs active:scale-[0.99]"
                        : "bg-muted/10 opacity-40 border-border/30"
                    } ${
                      isToday
                        ? "ring-2 ring-primary bg-primary/[0.04] dark:bg-primary/[0.08] font-semibold border-primary/50 shadow-xs"
                        : isHoliday
                        ? "bg-muted/15 dark:bg-muted/10 border-dashed border-border/60"
                        : "bg-card border-border/70"
                    }`}
                  >
                    {/* Top Row: Date Number (Left) & Attendance Status (Right) */}
                    <div className="flex items-center justify-between">
                      {isToday ? (
                        /* Clean circular highlight for today */
                        <span className="size-6 rounded-full bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center font-mono shadow-2xs">
                          {dayNum}
                        </span>
                      ) : (
                        <span
                          className={`text-xs font-mono font-medium ${
                            isSunday
                              ? "text-rose-500 font-semibold"
                              : isSaturday
                              ? "text-sky-500 font-semibold"
                              : "text-foreground"
                          }`}
                        >
                          {dayNum}
                        </span>
                      )}

                      {/* Attendance Status strictly on TOP-RIGHT */}
                      {item && getTopRightAttendanceBadge(item.status)}
                    </div>

                    {/* Event Body: Modern Event Strip Card (No "자율학습/재충전", clean & spacious) */}
                    {item && eventDisplay && theme ? (
                      <div className="my-auto py-1">
                        <div className={`rounded-md p-1.5 sm:p-2 border-l-[3.5px] transition-colors shadow-2xs ${theme.border} ${theme.bg}`}>
                          <p className={`text-[11px] sm:text-[11.5px] font-semibold tracking-tight leading-snug line-clamp-2 ${theme.text}`}>
                            {eventDisplay.displayLabel}
                          </p>
                        </div>
                      </div>
                    ) : (
                      /* Holiday or Empty: Spacious whitespace without clutter */
                      <div className="flex-1" />
                    )}

                    {/* Bottom Row: Micro Replay Action or Hours */}
                    <div className="pt-0.5 flex items-center justify-between">
                      {item?.hasReplay ? (
                        <button
                          onClick={(e) => handleOpenReplayFromItem(item, e)}
                          className="inline-flex items-center gap-1 text-[10.5px] text-indigo-600 dark:text-indigo-400 font-semibold hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors cursor-pointer py-0.5"
                          title="녹화본 다시보기 플레이어 열기"
                        >
                          <Play className="size-2.5 fill-indigo-600 dark:fill-indigo-400" />
                          <span>다시보기</span>
                        </button>
                      ) : (
                        <span className="text-[10px] text-muted-foreground/60 font-mono">
                          {item?.hours ? `${item.hours}H` : ""}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Overflow padding days for Nov 2026: 30 days ends on Monday (30th) */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={`next-month-${idx}`}
                  className="min-h-[105px] sm:min-h-[124px] p-2 rounded-xl border border-dashed border-border/30 bg-muted/10 text-muted-foreground opacity-40 flex flex-col justify-between"
                >
                  <span className="text-xs font-mono text-muted-foreground">{idx + 1}</span>
                  <p className="text-[10px] text-muted-foreground/60">스프린트 2</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode 2: Timeline List View */}
      {viewMode === "list" && (
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-border/60 bg-muted/20">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <List className="size-4 text-primary" />
                11월 전체 교육 일정 목록 ({REAL_CURRICULUM_NOVEMBER.length}개 세션)
              </span>
              <span className="text-xs font-normal text-muted-foreground">
                기준: LG CNS AM Inspire Camp 6기
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 sm:p-5 divide-y divide-border/50">
            {REAL_CURRICULUM_NOVEMBER.map((item) => {
              const isToday = item.isToday;
              const eventDisplay = getEventDisplay(item);
              const displayTitle = item.type === "holiday" ? "휴강" : (eventDisplay?.displayLabel || item.title);

              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isToday
                      ? "bg-primary/[0.04] dark:bg-primary/[0.08] border border-primary/30"
                      : "hover:bg-muted/50"
                  }`}
                >
                  {/* Left: Date Stamp Block */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={`flex flex-col items-center justify-center size-12 rounded-xl font-mono border ${
                        isToday
                          ? "bg-primary text-primary-foreground border-primary shadow-xs"
                          : item.type === "holiday"
                          ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900"
                          : "bg-muted text-foreground border-border"
                      }`}
                    >
                      <span className="text-[10px] font-bold uppercase leading-none">
                        {item.dayOfWeek}
                      </span>
                      <span className="text-base font-extrabold leading-none mt-1">
                        {item.day}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        {getTypeBadge(item.type, item.typeLabel)}
                        {getTopRightAttendanceBadge(item.status)}
                        {item.hasReplay && (
                          <button
                            onClick={(e) => handleOpenReplayFromItem(item, e)}
                            className="inline-flex items-center gap-1 text-[10.5px] text-indigo-600 dark:text-indigo-400 font-semibold hover:underline cursor-pointer"
                          >
                            <Play className="size-2.5 fill-indigo-600 dark:fill-indigo-400" />
                            다시보기
                          </button>
                        )}
                      </div>
                      <h4 className="text-sm font-semibold text-foreground mt-1 tracking-tight">
                        {displayTitle}
                      </h4>
                    </div>
                  </div>

                  {/* Middle: Details & Meta */}
                  <div className="sm:text-right text-xs text-muted-foreground space-y-0.5">
                    <p className="font-medium text-foreground">{item.category}</p>
                    <div className="flex items-center sm:justify-end gap-3 text-[11px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" /> {item.timeRange}
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" /> {item.location}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}

      {/* Interactive Day & Schedule Detail Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <DialogContent className="sm:max-w-lg p-5 sm:p-6">
          {selectedItem && (
            <div className="space-y-4">
              <DialogHeader className="border-b border-border/60 pb-3 text-left">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getTypeBadge(selectedItem.type, selectedItem.typeLabel)}
                    {getTopRightAttendanceBadge(selectedItem.status)}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {selectedItem.dateStr} ({selectedItem.dayOfWeek})
                  </span>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight pt-1 leading-snug">
                  {selectedItem.type === "holiday" ? "휴강" : (getEventDisplay(selectedItem)?.displayLabel || selectedItem.title)}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  {selectedItem.category}
                </DialogDescription>
              </DialogHeader>

              {/* Details Grid */}
              <div className="space-y-3 py-1 text-xs">
                {/* Description */}
                {selectedItem.description && (
                  <div className="rounded-lg bg-muted/40 p-3 text-foreground/90 border border-border/60 leading-relaxed">
                    <p className="font-semibold text-foreground mb-1 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-primary" /> 세부 학습 내용 및 개요
                    </p>
                    {selectedItem.description}
                  </div>
                )}

                {/* Session Meta Information */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                    <span className="text-muted-foreground block text-[11px]">교육 시간</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3 text-primary" /> {selectedItem.timeRange}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                    <span className="text-muted-foreground block text-[11px]">담당 강사 / 멘토</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <User className="size-3 text-primary" /> {selectedItem.instructor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                  <span className="text-muted-foreground block text-[11px]">강의실 / 장소</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-primary" /> {selectedItem.location}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-primary h-6 px-1.5 gap-1"
                      onClick={() => window.open(TODAY_SCHEDULE.zepUrl, "_blank")}
                    >
                      젭 바로가기 <ExternalLink className="size-3" />
                    </Button>
                  </div>
                </div>

                {/* Attendance Check-in / Check-out Log */}
                {selectedItem.checkIn && (
                  <div className="p-3 rounded-lg border border-emerald-500/30 bg-emerald-50/20 dark:bg-emerald-950/20">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1.5">
                        <CheckCircle2 className="size-3.5" /> 당일 입·퇴실 출결 타임로그
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-[11px] text-amber-600 dark:text-amber-400 h-6 px-1.5 hover:bg-amber-500/10 cursor-pointer"
                        onClick={() => setIsAppealOpen(true)}
                      >
                        출결 이상 소명하기
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                      <div className="p-1.5 rounded bg-background/80 border text-center">
                        <span className="text-[10px] text-muted-foreground block">입실 체크</span>
                        <span className="font-bold text-foreground">{selectedItem.checkIn}</span>
                      </div>
                      <div className="p-1.5 rounded bg-background/80 border text-center">
                        <span className="text-[10px] text-muted-foreground block">퇴실 체크</span>
                        <span className="font-bold text-foreground">{selectedItem.checkOut || "-"}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <DialogFooter className="flex justify-between items-center pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs gap-1.5"
                  onClick={() => alert("해당 일차의 강의자료(PDF)를 다운로드합니다.")}
                >
                  <FileText className="size-3.5" /> 강의자료 다운로드
                </Button>
                <DialogClose render={<Button variant="default" size="sm" className="text-xs" />}>
                  닫기
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Attendance Appeal Form Dialog */}
      <Dialog open={isAppealOpen} onOpenChange={setIsAppealOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-500" />
              출결 이상 소명서 신청
            </DialogTitle>
            <DialogDescription className="text-xs">
              지문 인식기 오류, 통신 장애, 공결 사유 등으로 출결 기록에 이상이 있는 경우 사유를 작성해 제출하세요.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSendAppeal} className="space-y-4 py-2 text-xs">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">소명 일자</label>
              <Input
                value={selectedItem?.dateStr || ""}
                disabled
                className="h-8 text-xs bg-muted/50 font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-foreground">소명 사유</label>
              <textarea
                required
                rows={3}
                placeholder="예: 08:52경 지문 인식기 단말기 네트워크 순단으로 인식이 지연되었습니다. 증빙 사진 제출 가능합니다."
                className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-xs shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                value={appealReason}
                onChange={(e) => setAppealReason(e.target.value)}
              />
            </div>

            <div className="p-2.5 rounded-lg bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 text-amber-800 dark:text-amber-300 text-[11px] leading-relaxed">
              소명 신청서는 훈련과정 운영지침에 따라 익월 훈련장려금 지급 전 운영국 및 고용센터 검토를 거쳐 최종 처리됩니다.
            </div>

            <DialogFooter className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAppealOpen(false)}
                className="text-xs"
              >
                취소
              </Button>
              <Button
                type="submit"
                size="sm"
                className="text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold"
              >
                <Send className="size-3" /> 소명서 접수하기
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Interactive Lecture Replay Video Player Modal */}
      <Dialog open={!!activeReplay} onOpenChange={(open) => !open && setActiveReplay(null)}>
        <DialogContent className="sm:max-w-2xl p-5 sm:p-6">
          {activeReplay && (
            <div className="space-y-4">
              <DialogHeader className="border-b border-border/60 pb-3 text-left">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="font-mono">{activeReplay.date}</span>
                  <span className="flex items-center gap-1 font-semibold text-primary">
                    <Clock className="size-3.5" /> 러닝타임: {activeReplay.duration}
                  </span>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight pt-1">
                  {activeReplay.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  담당: {activeReplay.instructor} • 과목: {activeReplay.subject}
                </DialogDescription>
              </DialogHeader>

              {/* Simulated Video Player Screen */}
              <div className="relative rounded-xl overflow-hidden bg-zinc-950 aspect-video flex items-center justify-center border border-zinc-800 group shadow-lg">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/40 via-zinc-950/80 to-zinc-950" />

                {/* Player Controls Center */}
                <div className="relative z-10 flex flex-col items-center gap-3 text-white text-center p-4">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="size-14 rounded-full bg-primary/90 hover:bg-primary text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all cursor-pointer"
                  >
                    {isPlaying ? (
                      <span className="text-xl font-bold">❚❚</span>
                    ) : (
                      <Play className="size-6 fill-white ml-0.5" />
                    )}
                  </button>
                  <p className="text-xs font-medium text-zinc-300">
                    {isPlaying ? "온라인 강의 스트리밍 재생 중 (1080p 60fps)" : "클릭하여 강의 시청"}
                  </p>
                </div>

                {/* Bottom Scrubber Bar */}
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex flex-col gap-1.5 z-10">
                  <div className="h-1.5 w-full bg-zinc-700/60 rounded-full overflow-hidden cursor-pointer">
                    <div className="h-full bg-primary w-2/5 rounded-full" />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span>42:15 / {activeReplay.duration}</span>
                    <span>1.0x 배속 • 자막(CC) 켬</span>
                  </div>
                </div>
              </div>

              {/* AI Key Topics & Summary */}
              <div className="space-y-2 p-3 rounded-xl bg-muted/30 border border-border/60 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <Sparkles className="size-3.5 text-primary" /> AI 핵심 개념 요약
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground">자막 동기화 완료</span>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  본 강의에서는 마이크로서비스 간 비동기 트랜잭션 완결과 서비스 복원력(Fault Tolerance)을 다룹니다.
                </p>
                <div className="flex flex-wrap gap-1 pt-1">
                  {activeReplay.keyTopics.map((topic) => (
                    <span
                      key={topic}
                      className="font-mono text-[10px] px-2 py-0.5 rounded bg-background border text-foreground"
                    >
                      #{topic}
                    </span>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex justify-between items-center pt-2 border-t border-border/60">
                <Button
                  size="sm"
                  className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-semibold cursor-pointer"
                  onClick={() => {
                    setActiveReplay(null);
                    if (onNavigate) {
                      onNavigate("ai-review");
                    } else {
                      const url = new URL(window.location.href);
                      url.searchParams.set("tab", "ai-review");
                      window.history.replaceState({}, "", url.toString());
                      window.dispatchEvent(new PopStateEvent("popstate"));
                    }
                  }}
                >
                  <Sparkles className="size-3" />
                  AI 복습 탭에서 퀴즈 풀기 ↗
                </Button>
                <DialogClose render={<Button variant="outline" size="sm" className="text-xs" />}>
                  닫기
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Bottom Replay Lectures Archive with Clean Typography */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="py-4 px-4 sm:px-5 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-foreground tracking-tight">
                <Video className="size-4 text-primary" />
                강의 다시보기 & AI 요약 아카이브
              </CardTitle>
              <CardDescription className="text-xs text-muted-foreground mt-0.5">
                수업 녹화본을 다시 시청하고 핵심 개념을 복습합니다.
              </CardDescription>
            </div>
            <span className="text-xs text-muted-foreground font-mono">
              총 {REPLAY_LECTURES.length}개 강의
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {REPLAY_LECTURES.map((lecture) => (
              <div
                key={lecture.id}
                className="group rounded-xl border border-border/70 bg-card p-3.5 hover:border-primary hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
                    <span className="text-[11px]">{lecture.date}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-primary">
                      <Clock className="size-3" /> {lecture.duration}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-primary transition-colors">
                    {lecture.title}
                  </h4>

                  <p className="text-[11px] text-muted-foreground mt-1">
                    강사: {lecture.instructor}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {lecture.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 mt-3 border-t border-border/50 flex items-center justify-between">
                  {lecture.hasAiSummary && (
                    <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1">
                      <Sparkles className="size-3" /> AI 요약 지원
                    </span>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-7 text-xs gap-1 ml-auto group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all cursor-pointer"
                    onClick={(e) => handleOpenReplay(lecture, e)}
                  >
                    <Play className="size-3" /> 시청하기
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
