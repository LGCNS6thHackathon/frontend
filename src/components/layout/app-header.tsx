"use client";

import * as React from "react";
import {
  Bell,
  Laptop,
  LogOut,
  Menu,
  User,
  Video,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { INITIAL_NOTICES, INITIAL_USER, TODAY_SCHEDULE } from "@/lib/lms-data";
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
    title: "수강생 대시보드",
    subtitle: "오늘의 강의 일정과 주요 학습 지표를 한눈에 확인합니다.",
  },
  schedule: {
    title: "교육 캘린더 & 강의 다시보기",
    subtitle: "월별 커리큘럼 일정, 일별 출결 타임로그 및 녹화본 아카이브",
  },
  notices: {
    title: "통합 공지사항",
    subtitle: "과정 공지, 긴급 행사, 특강 교안 및 행정 안내를 통합 제공합니다.",
  },
  qa: {
    title: "학습 질문 (Q&A)",
    subtitle: "코드 및 실습 중 발생하는 기술적 질문을 멘토단과 함께 해결합니다.",
  },
  evaluation: {
    title: "역량평가 리포트",
    subtitle: "차수별 평가 결과 및 5대 핵심 기술 역량 방사형 차트 분석",
  },
  assignment: {
    title: "과제 워크스페이스",
    subtitle: "교과목별 실습 과제 제출, D-Day 확인 및 멘토 피드백",
  },
  "ai-review": {
    title: "AI 데일리 복습 허브 (Beta)",
    subtitle: "오늘 학습한 핵심 내용을 요약하고 AI 생성 퀴즈로 개념을 점검합니다.",
  },
  mypage: {
    title: "마이페이지 & AWS 허브",
    subtitle: "수강생 개인정보, 훈련수당 지급 계좌 및 AWS 클라우드 자격증명 관리",
  },
};

export function AppHeader({
  currentTab,
  onTabChange,
  onOpenMobileMenu,
}: HeaderProps) {
  const current = TAB_TITLES[currentTab];
  const [unreadCount, setUnreadCount] = React.useState(2);

  return (
    <header className="sticky top-0 z-20 w-full border-b bg-background/80 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon-sm"
          className="md:hidden"
          onClick={onOpenMobileMenu}
          aria-label="메뉴 열기"
        >
          <Menu className="size-4" />
        </Button>

        <div>
          <h1 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
            {current.title}
            {currentTab === "ai-review" && (
              <Badge variant="default" className="text-[10px] bg-gradient-to-r from-indigo-500 to-purple-500 text-white">
                AI Powered
              </Badge>
            )}
          </h1>
          <p className="text-xs text-muted-foreground hidden sm:block">
            {current.subtitle}
          </p>
        </div>
      </div>

      {/* Right: Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Zoom Link */}
        <Button
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-600/20 gap-1.5 hidden sm:inline-flex text-xs h-8"
          onClick={() => window.open(TODAY_SCHEDULE.zoomUrl, "_blank")}
        >
          <Video className="size-3.5" />
          <span>강의실 입장 (Zoom)</span>
        </Button>

        {/* Notification Bell */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon-sm" className="relative">
                <Bell className="size-4 text-muted-foreground" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-white ring-2 ring-background">
                    {unreadCount}
                  </span>
                )}
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 p-2">
            <div className="flex items-center justify-between px-2 py-1.5 border-b mb-1">
              <span className="text-xs font-bold text-foreground">새로운 알림</span>
              <button
                onClick={() => setUnreadCount(0)}
                className="text-[10px] text-primary hover:underline"
              >
                모두 읽음 표시
              </button>
            </div>
            <div className="space-y-1">
              {INITIAL_NOTICES.slice(0, 3).map((notice) => (
                <div
                  key={notice.id}
                  onClick={() => onTabChange("notices")}
                  className="p-2 rounded-lg hover:bg-muted/70 transition-colors cursor-pointer text-xs space-y-0.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground truncate max-w-[190px]">
                      {notice.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">{notice.createdAt}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">{notice.content}</p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon-sm" className="rounded-full">
                <Avatar size="sm" className="ring-1 ring-border">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
                  <AvatarFallback>창일</AvatarFallback>
                </Avatar>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="space-y-0.5">
                <p className="font-bold text-sm text-foreground">{INITIAL_USER.name} 수강생</p>
                <p className="text-xs text-muted-foreground font-normal truncate">{INITIAL_USER.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onTabChange("mypage")}>
              <User className="size-4 mr-2" /> 마이페이지 & AWS
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onTabChange("schedule")}>
              <Laptop className="size-4 mr-2" /> 출결 및 일정 확인
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive"
              onClick={() => alert("로그아웃 되었습니다 (예제 데모)")}
            >
              <LogOut className="size-4 mr-2" /> 로그아웃
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
