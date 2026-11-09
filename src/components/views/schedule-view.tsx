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
  PlayCircle,
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
  TODAY_SCHEDULE,
} from "@/lib/lms-data";

export function ScheduleView() {
  const [viewMode, setViewMode] = React.useState<"calendar" | "list">("calendar");
  const [selectedItem, setSelectedItem] = React.useState<CurriculumScheduleItem | null>(null);
  const [isAppealOpen, setIsAppealOpen] = React.useState(false);
  const [appealReason, setAppealReason] = React.useState("");

  const handleItemClick = (item: CurriculumScheduleItem) => {
    setSelectedItem(item);
  };

  const handleSendAppeal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!appealReason.trim()) return;
    alert(`[소명 신청 접수 완료]\n일자: ${selectedItem?.dateStr}\n사유: ${appealReason}\n행정지원팀 검토 후 24시간 내 반영됩니다.`);
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
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/60 dark:border-rose-800">
            {label}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {label}
          </span>
        );
    }
  };

  const getStatusBadge = (status: CurriculumScheduleItem["status"]) => {
    switch (status) {
      case "출석":
        return <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">출석</span>;
      case "진행 중":
        return <span className="text-[10px] px-1.5 py-0.2 rounded font-bold bg-indigo-600 text-white animate-pulse">진행 중</span>;
      case "휴강":
        return <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">휴강</span>;
      case "예정":
      default:
        return <span className="text-[10px] px-1.5 py-0.2 rounded font-medium bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">예정</span>;
    }
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
                <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
                  2026년 11월 교육 캘린더
                </h2>
                <Badge variant="outline" className="text-[11px] font-semibold border-indigo-200 text-indigo-600 dark:border-indigo-900 dark:text-indigo-400">
                  LMS 실시간 연동
                </Badge>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                일정을 클릭하시면 교과목 상세, ZEP 강의실 링크, 당일 출결 타임로그 및 소명 신청 폼을 확인하실 수 있습니다.
              </p>
            </div>

            {/* Navigation & View Toggle (달력 / 목록) */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Month Navigation */}
              <div className="flex items-center rounded-lg border border-border/80 bg-background p-0.5">
                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground" onClick={() => alert("10월 일정은 목록 보기에서 조회 가능합니다.")}>
                  <ChevronLeft className="size-3.5" />
                </Button>
                <span className="text-xs font-bold px-2.5 text-slate-800 dark:text-slate-200 font-mono">
                  2026-11
                </span>
                <Button variant="ghost" size="icon-sm" className="h-7 w-7 text-muted-foreground" onClick={() => alert("12월 최종 프로젝트 일정으로 이동합니다.")}>
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
              <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-slate-800/80 border border-border/40">
                <button
                  onClick={() => setViewMode("calendar")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "calendar"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <CalendarIcon className="size-3.5" />
                  <span>달력</span>
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                    viewMode === "list"
                      ? "bg-white text-indigo-600 shadow-xs dark:bg-slate-900 dark:text-indigo-400"
                      : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-200"
                  }`}
                >
                  <List className="size-3.5" />
                  <span>목록</span>
                </button>
              </div>
            </div>
          </div>

          {/* Legend Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-3.5 mt-3 border-t border-border/60 text-xs">
            <span className="text-[11px] font-medium text-slate-500">범례:</span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-indigo-500" /> 프로젝트
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-emerald-500" /> 해커톤
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-purple-500" /> 특강(Agile)
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-amber-500" /> 멘토링
            </span>
            <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 text-[11px]">
              <span className="size-2 rounded-full bg-rose-500" /> 휴강
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Mode 1: Calendar Grid View */}
      {viewMode === "calendar" && (
        <Card className="border-border/60 shadow-xs overflow-hidden">
          <CardContent className="p-3 sm:p-5">
            {/* Weekday Header */}
            <div className="grid grid-cols-7 text-center font-semibold text-xs py-2 border-b border-border/80 mb-2">
              <div className="text-rose-500 font-bold">일</div>
              <div className="text-slate-600 dark:text-slate-400">월</div>
              <div className="text-slate-600 dark:text-slate-400">화</div>
              <div className="text-slate-600 dark:text-slate-400">수</div>
              <div className="text-slate-600 dark:text-slate-400">목</div>
              <div className="text-slate-600 dark:text-slate-400">금</div>
              <div className="text-sky-500 font-bold">토</div>
            </div>

            {/* 7-column Calendar Grid (Nov 2026 starts on Sunday 1) */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-2 auto-rows-fr">
              {/* Day 1 (Sun) */}
              <div className="min-h-[85px] sm:min-h-[105px] p-2 rounded-lg border border-border/40 bg-slate-50/40 dark:bg-slate-900/30 text-muted-foreground opacity-60">
                <span className="text-xs font-semibold text-rose-400">1</span>
              </div>

              {/* Days 2 to 30 */}
              {Array.from({ length: 29 }).map((_, idx) => {
                const dayNum = idx + 2;
                // November 2026: Day 1 is Sun (col 1). Day 2 is Mon (col 2). Day 7 is Sat, Day 8 is Sun...
                const dayOfWeekIdx = (dayNum - 1) % 7; // 0=Sun, 1=Mon, ..., 6=Sat
                const isSunday = dayOfWeekIdx === 0;
                const isSaturday = dayOfWeekIdx === 6;

                const item = REAL_CURRICULUM_NOVEMBER.find((d) => d.day === dayNum);
                const isToday = item?.isToday;

                return (
                  <div
                    key={dayNum}
                    onClick={() => item && handleItemClick(item)}
                    className={`min-h-[85px] sm:min-h-[105px] p-1.5 sm:p-2 rounded-lg border transition-all flex flex-col justify-between ${
                      item
                        ? "cursor-pointer hover:border-indigo-500 hover:shadow-xs active:scale-[0.99]"
                        : "bg-slate-50/30 dark:bg-slate-900/20 opacity-50 border-border/40"
                    } ${
                      isToday
                        ? "ring-2 ring-indigo-500 bg-indigo-50/15 dark:bg-indigo-950/30 font-semibold border-indigo-400"
                        : "bg-card border-border/60"
                    }`}
                  >
                    {/* Date Number & Top Status */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`text-xs font-mono font-medium ${
                          isToday
                            ? "text-indigo-600 dark:text-indigo-400 font-extrabold text-[13px]"
                            : isSunday
                            ? "text-rose-500 font-semibold"
                            : isSaturday
                            ? "text-sky-500 font-semibold"
                            : "text-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {dayNum}
                        {isToday && (
                          <span className="ml-1 text-[9px] font-sans font-bold text-indigo-600 dark:text-indigo-400">
                            (오늘)
                          </span>
                        )}
                      </span>

                      {item && getStatusBadge(item.status)}
                    </div>

                    {/* Event Capsule */}
                    {item ? (
                      <div className="mt-1 space-y-1">
                        <div className="flex items-center gap-1">
                          {getTypeBadge(item.type, item.typeLabel)}
                        </div>
                        <p className="text-[11px] font-medium text-slate-800 dark:text-slate-200 line-clamp-2 leading-tight tracking-tight">
                          {item.shortTitle}
                        </p>
                      </div>
                    ) : (
                      <div className="flex-1" />
                    )}

                    {/* Bottom Micro Indicator */}
                    {item?.hasReplay && (
                      <div className="flex items-center gap-1 text-[9px] text-indigo-500 dark:text-indigo-400 font-medium pt-1">
                        <PlayCircle className="size-2.5" />
                        <span>다시보기</span>
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Overflow padding days for Nov 2026: 30 days ends on Monday (30th) */}
              {Array.from({ length: 5 }).map((_, idx) => (
                <div
                  key={`next-month-${idx}`}
                  className="min-h-[85px] sm:min-h-[105px] p-2 rounded-lg border border-border/30 bg-slate-50/20 dark:bg-slate-900/10 text-muted-foreground opacity-40"
                >
                  <span className="text-xs font-mono text-slate-400">{idx + 1}</span>
                  <p className="text-[10px] text-slate-400 mt-2">최종 프로젝트</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mode 2: Timeline List View (Directly Matching & Elevating WSTS /schedule) */}
      {viewMode === "list" && (
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="py-3.5 px-4 sm:px-5 border-b border-border/60 bg-muted/20">
            <CardTitle className="text-sm font-bold flex items-center justify-between text-slate-900 dark:text-slate-100">
              <span className="flex items-center gap-2">
                <List className="size-4 text-indigo-600" />
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
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`py-3.5 px-3 rounded-xl transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isToday
                      ? "bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-900/60"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                  }`}
                >
                  {/* Left: Date Stamp Block */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div
                      className={`flex flex-col items-center justify-center size-12 rounded-xl font-mono border ${
                        isToday
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                          : item.type === "holiday"
                          ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/40 dark:border-rose-900"
                          : "bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700"
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
                        {getStatusBadge(item.status)}
                      </div>
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mt-1 tracking-tight">
                        {item.title}
                      </h4>
                    </div>
                  </div>

                  {/* Middle: Details & Meta */}
                  <div className="sm:text-right text-xs text-slate-500 dark:text-slate-400 space-y-0.5">
                    <p className="font-medium text-slate-700 dark:text-slate-300">
                      {item.category}
                    </p>
                    <div className="flex items-center sm:justify-end gap-3 text-[11px] text-slate-500">
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
                    {getStatusBadge(selectedItem.status)}
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {selectedItem.dateStr} ({selectedItem.dayOfWeek})
                  </span>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight pt-1 leading-snug">
                  {selectedItem.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedItem.category}
                </DialogDescription>
              </DialogHeader>

              {/* Details Grid */}
              <div className="space-y-3 py-1 text-xs">
                {/* Description */}
                {selectedItem.description && (
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-900/60 p-3 text-slate-700 dark:text-slate-200 border border-border/60 leading-relaxed">
                    <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1 flex items-center gap-1.5">
                      <Sparkles className="size-3.5 text-indigo-500" /> 세부 학습 내용 및 개요
                    </p>
                    {selectedItem.description}
                  </div>
                )}

                {/* Session Meta Information */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                    <span className="text-muted-foreground block text-[11px]">교육 시간</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <Clock className="size-3 text-indigo-500" /> {selectedItem.timeRange}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                    <span className="text-muted-foreground block text-[11px]">담당 강사 / 멘토</span>
                    <span className="font-semibold text-foreground flex items-center gap-1 mt-0.5">
                      <User className="size-3 text-indigo-500" /> {selectedItem.instructor}
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg border border-border/60 bg-card">
                  <span className="text-muted-foreground block text-[11px]">강의실 / 장소</span>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="font-semibold text-foreground flex items-center gap-1">
                      <MapPin className="size-3 text-indigo-500" /> {selectedItem.location}
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs text-indigo-600 dark:text-indigo-400 h-6 px-1.5 gap-1"
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
                        className="text-[11px] text-amber-600 dark:text-amber-400 h-6 px-1.5 hover:bg-amber-500/10"
                        onClick={() => setIsAppealOpen(true)}
                      >
                        출결 이상 소명하기
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2 font-mono text-xs">
                      <div className="p-1.5 rounded bg-background/80 border text-center">
                        <span className="text-[10px] text-muted-foreground block">입실 체크</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedItem.checkIn}</span>
                      </div>
                      <div className="p-1.5 rounded bg-background/80 border text-center">
                        <span className="text-[10px] text-muted-foreground block">퇴실 체크</span>
                        <span className="font-bold text-slate-800 dark:text-slate-100">{selectedItem.checkOut || "-"}</span>
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
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">소명 일자</label>
              <Input value={selectedItem?.dateStr || ""} disabled className="h-8 text-xs bg-muted/50 font-mono" />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">소명 사유</label>
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
              <Button type="button" variant="outline" size="sm" onClick={() => setIsAppealOpen(false)} className="text-xs">
                취소
              </Button>
              <Button type="submit" size="sm" className="text-xs gap-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold">
                <Send className="size-3" /> 소명서 접수하기
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Bottom Replay Lectures Archive with Clean Typography */}
      <Card className="border-border/60 shadow-xs">
        <CardHeader className="py-4 px-4 sm:px-5 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 tracking-tight">
                <Video className="size-4 text-indigo-600" />
                강의 다시보기 & AI 요약 아카이브
              </CardTitle>
              <CardDescription className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
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
                className="group rounded-xl border border-border/70 bg-card p-3.5 hover:border-indigo-500 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5 font-mono">
                    <span className="text-[11px]">{lecture.date}</span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                      <Clock className="size-3" /> {lecture.duration}
                    </span>
                  </div>

                  <h4 className="text-xs sm:text-[13px] font-semibold text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {lecture.title}
                  </h4>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                    강사: {lecture.instructor}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-2.5">
                    {lecture.keyTopics.map((topic) => (
                      <span
                        key={topic}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-mono"
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
                    className="h-7 text-xs gap-1 ml-auto group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all cursor-pointer"
                    onClick={() => alert(`[${lecture.title}]\n다시보기 플레이어를 실행합니다.`)}
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
