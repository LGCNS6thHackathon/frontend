"use client";

import * as React from "react";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileCheck,
  MapPin,
  Megaphone,
  Sparkles,
  User,
  Video,
  Zap,
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
import { Separator } from "@/components/ui/separator";
import {
  INITIAL_ASSIGNMENTS,
  INITIAL_NOTICES,
  INITIAL_USER,
  TODAY_SCHEDULE,
} from "@/lib/lms-data";
import { NavTabId } from "../layout/app-sidebar";

interface HomeViewProps {
  onNavigate: (tab: NavTabId) => void;
}

export function HomeView({ onNavigate }: HomeViewProps) {
  const pendingAssignment = INITIAL_ASSIGNMENTS.find((a) => a.status === "미제출");

  return (
    <div className="space-y-6">
      {/* Top Welcome / Today's Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white p-6 sm:p-8 shadow-lg shadow-indigo-950/20">
        <div className="absolute right-0 top-0 -mr-16 -mt-16 size-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="absolute left-1/3 bottom-0 size-60 rounded-full bg-sky-500/10 blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur-md border border-white/15">
              <span className="flex size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{TODAY_SCHEDULE.dayCount} 진행 중</span>
              <span className="text-white/40">|</span>
              <span className="text-indigo-200">정상 출석 완료 (08:52:14)</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
              안녕하세요, {INITIAL_USER.name} 님! 👋<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-300 via-indigo-200 to-white">
                {TODAY_SCHEDULE.subject}
              </span>
            </h2>

            <div className="flex flex-wrap items-center gap-4 text-xs text-indigo-100/80">
              <div className="flex items-center gap-1.5">
                <Clock className="size-3.5 text-indigo-300" />
                <span>{TODAY_SCHEDULE.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="size-3.5 text-indigo-300" />
                <span>{TODAY_SCHEDULE.location}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <User className="size-3.5 text-indigo-300" />
                <span>{TODAY_SCHEDULE.instructor}</span>
              </div>
            </div>
          </div>

          {/* Quick Action CTA Box */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0">
            <Button
              size="lg"
              className="bg-white text-indigo-950 hover:bg-white/90 font-bold gap-2 shadow-md shadow-black/20"
              onClick={() => window.open(TODAY_SCHEDULE.zoomUrl, "_blank")}
            >
              <Video className="size-4 text-indigo-600" />
              온라인 강의실 입장 (Zoom)
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs gap-1.5"
                onClick={() => window.open(TODAY_SCHEDULE.materialUrl, "_blank")}
              >
                <Download className="size-3.5" />
                강의자료
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-white/10 hover:bg-white/20 border-white/20 text-white text-xs gap-1.5"
                onClick={() => onNavigate("schedule")}
              >
                <BookOpen className="size-3.5" />
                다시보기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards (Integrated Attendance & Course Stats) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Attendance Rate */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              나의 누적 출석률
            </CardTitle>
            <CheckCircle2 className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                {INITIAL_USER.attendanceRate}%
              </span>
              <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/30 bg-emerald-500/10">
                수당 수령 기준(80%) 안전
              </Badge>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all"
                style={{ width: `${INITIAL_USER.attendanceRate}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground flex justify-between">
              <span>단위기간 출석: <b>100%</b></span>
              <span>지각 1회 / 결석 0회</span>
            </p>
          </CardContent>
        </Card>

        {/* Metric 2: Course Progress */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              전체 교육 진도율
            </CardTitle>
            <Zap className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">58%</span>
              <span className="text-xs text-muted-foreground">556 / 960 시간</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-indigo-600 h-full rounded-full transition-all"
                style={{ width: "58%" }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              총 120일 중 <b>69일차</b> 완료 단계
            </p>
          </CardContent>
        </Card>

        {/* Metric 3: Assignments */}
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer group"
          onClick={() => onNavigate("assignment")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider group-hover:text-primary transition-colors">
              미제출 과제
            </CardTitle>
            <FileCheck className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-2xl font-black text-foreground">
                1<span className="text-sm font-normal text-muted-foreground">건</span>
              </span>
              <Badge variant="destructive" className="text-[10px] animate-pulse">
                {pendingAssignment ? pendingAssignment.dDay : "D-4"}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {pendingAssignment ? pendingAssignment.title : "모든 과제 제출 완료"}
            </p>
            <p className="text-[10px] text-primary group-hover:underline flex items-center gap-1 pt-1">
              과제실 바로가기 <ArrowRight className="size-3" />
            </p>
          </CardContent>
        </Card>

        {/* Metric 4: AI Review Prompt */}
        <Card
          className="hover:shadow-md transition-shadow cursor-pointer group border-indigo-500/20 bg-gradient-to-br from-card to-indigo-500/5"
          onClick={() => onNavigate("ai-review")}
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
              AI 데일리 복습
            </CardTitle>
            <Sparkles className="size-4 text-indigo-500" />
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex items-baseline justify-between">
              <span className="text-base font-bold text-foreground">오늘의 복습 퀴즈</span>
              <Badge variant="secondary" className="text-[10px]">미완료</Badge>
            </div>
            <p className="text-[11px] text-muted-foreground">
              오늘 배운 3가지 핵심 개념 3분 점검
            </p>
            <p className="text-[10px] text-indigo-600 dark:text-indigo-400 group-hover:underline flex items-center gap-1 pt-1 font-semibold">
              퀴즈 풀러가기 <ArrowRight className="size-3" />
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Two-Column Layout: Notices & Today Schedule Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left (2 cols): Smart Notice Feed */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b">
              <div>
                <CardTitle className="text-base font-bold flex items-center gap-2">
                  <Megaphone className="size-4 text-indigo-600" />
                  주요 공지사항
                </CardTitle>
                <CardDescription className="text-xs">
                  수강 과정 및 행정 관련 필수 확인 안내사항
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground hover:text-foreground gap-1"
                onClick={() => onNavigate("notices")}
              >
                더보기 <ArrowRight className="size-3.5" />
              </Button>
            </CardHeader>
            <CardContent className="p-0 divide-y">
              {INITIAL_NOTICES.slice(0, 4).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => onNavigate("notices")}
                  className="p-4 hover:bg-muted/40 transition-colors cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1 max-w-xl">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          notice.category === "필독"
                            ? "destructive"
                            : notice.category === "공지"
                            ? "default"
                            : notice.category === "자료"
                            ? "secondary"
                            : "outline"
                        }
                        className="text-[10px] px-1.5 py-0 h-4"
                      >
                        {notice.category}
                      </Badge>
                      <h4 className="text-xs sm:text-sm font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {notice.title}
                      </h4>
                      {notice.isNew && (
                        <span className="size-1.5 rounded-full bg-red-500" />
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-1 pl-0.5">
                      {notice.content}
                    </p>
                  </div>
                  <div className="text-right shrink-0 text-[11px] text-muted-foreground space-y-1">
                    <span>{notice.createdAt}</span>
                    <p className="text-[10px]">조회 {notice.views}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right (1 col): Today Schedule & Learning Focus */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Calendar className="size-4 text-primary" />
                오늘의 강의 타임라인
              </CardTitle>
              <CardDescription className="text-xs">
                {TODAY_SCHEDULE.date} 세부 일정
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="relative pl-5 border-l-2 border-primary space-y-4">
                <div className="relative">
                  <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-emerald-500 ring-4 ring-background" />
                  <p className="text-[11px] text-muted-foreground font-semibold">09:00 - 10:00</p>
                  <p className="text-xs font-bold text-foreground">해커톤 킥오프 & 기획안 리뷰</p>
                  <Badge variant="outline" className="text-[9px] mt-1">완료</Badge>
                </div>

                <div className="relative">
                  <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-indigo-600 ring-4 ring-background animate-pulse" />
                  <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold">10:00 - 16:30 (현재)</p>
                  <p className="text-xs font-bold text-foreground">Next.js 15 & shadcn UI 프로토타이핑</p>
                  <p className="text-[11px] text-muted-foreground">팀별 구현 및 멘토 1:1 코칭</p>
                </div>

                <div className="relative">
                  <span className="absolute -left-[27px] top-1 size-3 rounded-full bg-muted-foreground/40 ring-4 ring-background" />
                  <p className="text-[11px] text-muted-foreground">16:30 - 18:00</p>
                  <p className="text-xs font-semibold text-muted-foreground">중간 코드 커밋 및 데일리 회고</p>
                </div>
              </div>

              <Separator className="my-3" />

              {/* Allowance info snippet */}
              <div className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-foreground">11월 훈련수당 지급 예정</span>
                  <Badge variant="outline" className="text-[10px] text-emerald-600">지급 대상</Badge>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  현재 단위기간 100% 출석 달성으로 최대 수당(316,000원) 지급 요건을 충족했습니다.
                </p>
                <div
                  onClick={() => onNavigate("mypage")}
                  className="text-[10px] text-primary hover:underline cursor-pointer pt-1 flex items-center gap-1 font-medium"
                >
                  수당 계좌 정보 확인하기 <ArrowRight className="size-2.5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
