"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink, Menu, ShieldAlert } from "lucide-react";

import { ZepIcon } from "@/components/icons/zep-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "@/components/live/session";
import { TODAY_SCHEDULE } from "@/lib/lms-data";
import { NavTabId } from "./app-sidebar";

interface HeaderProps {
  currentTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  onOpenMobileMenu: () => void;
  isDark: boolean;
  onToggleDark: () => void;
}

const TAB_TITLES: Record<NavTabId, { title: string; subtitle: string }> = {
  home: {
    title: "대시보드",
    subtitle: "오늘의 강의 일정과 주요 학습 지표를 확인합니다.",
  },
  schedule: {
    title: "캘린더",
    subtitle: "월별 커리큘럼 일정, 일별 출결 타임로그 및 녹화본 아카이브",
  },
  notices: {
    title: "공지사항",
    subtitle: "필독, 일반 공지, 강의 자료 및 시스템 안내를 제공합니다.",
  },
  qa: {
    title: "학습 질문",
    subtitle:
      "코드 및 실습 중 발생하는 기술적 질문을 멘토단과 함께 해결합니다.",
  },
  evaluation: {
    title: "역량평가",
    subtitle: "차수별 평가 결과 및 5대 핵심 기술 역량 방사형 차트 분석",
  },
  assignment: {
    title: "과제",
    subtitle: "교과목별 실습 과제 제출, 마감일 확인 및 멘토 피드백",
  },
  "ai-review": {
    title: "AI 복습",
    subtitle:
      "오늘 학습한 핵심 내용을 요약하고 AI 생성 퀴즈로 개념을 점검합니다.",
  },
  mypage: {
    title: "마이페이지",
    subtitle:
      "수강생 개인정보, 훈련수당 지급 계좌 및 AWS 클라우드 자격증명 관리",
  },
};

export function AppHeader({ currentTab, onOpenMobileMenu }: HeaderProps) {
  const current = TAB_TITLES[currentTab];
  const { cohort, user } = useSession();

  const zepUrl = cohort?.classroomUrl || TODAY_SCHEDULE.zepUrl || "https://zep.us/@lgam06";
  const detectUrl = TODAY_SCHEDULE.detectUrl || "https://lms.wsts.kr/detection/student?classId=114";

  return (
    // Non-sticky header: DOES NOT follow when scrolling, fully responsive
    <header className="w-full border-b bg-background px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 min-w-0">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
        <Button
          variant="outline"
          size="icon-sm"
          className="md:hidden shrink-0"
          onClick={onOpenMobileMenu}
          aria-label="메뉴 열기"
        >
          <Menu className="size-4" />
        </Button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-1.5 sm:gap-2 truncate">
            <span>{current.title}</span>
            {currentTab === "ai-review" && (
              <Badge
                variant="default"
                className="text-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold tracking-wider px-2 py-0.5 rounded-full uppercase border-none shadow-xs shrink-0"
              >
                BETA
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground hidden lg:block truncate">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Action Buttons (Prevent awkward wrap on narrow widths) */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0 flex-nowrap">
        {user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="rounded-lg border border-border bg-primary px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs font-semibold text-primary-foreground whitespace-nowrap shrink-0 shadow-2xs hover:bg-primary/90 transition-colors"
          >
            관리자 모드 ↗
          </Link>
        )}

        {/* High-End Official ZEP Button */}
        <button
          onClick={() => window.open(zepUrl, "_blank", "noopener,noreferrer")}
          className="group relative inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r from-[#6758FF] via-[#5c4cff] to-[#4e3dff] hover:from-[#5747ee] hover:to-[#4332ee] shadow-xs border border-white/20 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
        >
          <div className="flex size-4 items-center justify-center rounded bg-white/20 p-0.5 text-white group-hover:scale-110 transition-transform">
            <ZepIcon className="size-full fill-white" />
          </div>
          <span>젭 입장</span>
          <span className="flex size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {/* Seat Departure Detection Button */}
        <Button
          variant="outline"
          size="sm"
          className="gap-1 sm:gap-1.5 text-xs h-8 font-semibold border-amber-500/30 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 whitespace-nowrap shrink-0 px-2 sm:px-3"
          onClick={() => window.open(detectUrl, "_blank", "noopener,noreferrer")}
        >
          <ShieldAlert className="size-3.5 text-amber-500 shrink-0" />
          <span>자리이탈감지</span>
          <ExternalLink className="size-3 opacity-60 ml-0.5 hidden sm:inline" />
        </Button>
      </div>
    </header>
  );
}
