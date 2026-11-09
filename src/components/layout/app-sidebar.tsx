"use client";

import * as React from "react";
import {
  Award,
  CalendarDays,
  ChevronRight,
  FileCheck2,
  GraduationCap,
  HelpCircle,
  LayoutDashboard,
  LucideIcon,
  Megaphone,
  Moon,
  Sparkles,
  Sun,
  UserCheck,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { INITIAL_USER } from "@/lib/lms-data";

export type NavTabId =
  | "home"
  | "schedule"
  | "notices"
  | "qa"
  | "evaluation"
  | "assignment"
  | "ai-review"
  | "mypage";

interface NavItem {
  id: NavTabId;
  label: string;
  icon: LucideIcon;
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
  highlight?: boolean;
}

interface NavGroup {
  group: string;
  items: NavItem[];
}

interface SidebarProps {
  currentTab: NavTabId;
  onTabChange: (tab: NavTabId) => void;
  isDark: boolean;
  onToggleDark: () => void;
}

export function AppSidebar({
  currentTab,
  onTabChange,
  isDark,
  onToggleDark,
}: SidebarProps) {
  const navItems: NavGroup[] = [
    {
      group: "학습 워크스페이스",
      items: [
        {
          id: "home",
          label: "홈 대시보드",
          icon: LayoutDashboard,
          badge: "오늘",
        },
        {
          id: "schedule",
          label: "교육 캘린더 & 다시보기",
          icon: CalendarDays,
        },
        {
          id: "assignment",
          label: "과제 워크스페이스",
          icon: FileCheck2,
          badge: "D-Day",
          badgeVariant: "destructive",
        },
      ],
    },
    {
      group: "커뮤니케이션 & 성장",
      items: [
        {
          id: "notices",
          label: "통합 공지사항",
          icon: Megaphone,
          badge: "New",
          badgeVariant: "default",
        },
        {
          id: "qa",
          label: "학습 질문 (Q&A)",
          icon: HelpCircle,
          badge: "3건",
          badgeVariant: "secondary",
        },
        {
          id: "evaluation",
          label: "역량평가 리포트",
          icon: Award,
          badge: "상위 8%",
          badgeVariant: "outline",
        },
      ],
    },
    {
      group: "차세대 도구 & 계정",
      items: [
        {
          id: "ai-review",
          label: "AI 복습 & 퀴즈",
          icon: Sparkles,
          badge: "Beta",
          badgeVariant: "default",
          highlight: true,
        },
        {
          id: "mypage",
          label: "마이페이지 & AWS",
          icon: UserCheck,
        },
      ],
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r bg-card/60 backdrop-blur-xl flex flex-col justify-between h-screen sticky top-0 z-30 select-none">
      {/* Top Branding */}
      <div>
        <div className="p-5 flex items-center justify-between border-b bg-card/40">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-foreground">
                  Inspire LMS
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                  v2.0
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground font-medium">
                LG CNS AM 캠프 6기
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Groups */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-210px)]">
          {navItems.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1.5">
              <p className="px-3 text-[11px] font-semibold tracking-wider text-muted-foreground/70 uppercase">
                {group.group}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-sm shadow-primary/25 font-semibold"
                          : item.highlight
                          ? "hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                          : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon
                          className={`size-4 shrink-0 transition-transform group-hover:scale-110 ${
                            isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <Badge
                          variant={isActive ? "secondary" : item.badgeVariant || "outline"}
                          className="text-[10px] px-1.5 py-0 h-4 ml-1.5"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Profile & Theme Section */}
      <div className="p-3 border-t bg-card/40 space-y-3">
        {/* User Mini Card */}
        <div
          onClick={() => onTabChange("mypage")}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer group"
        >
          <div className="flex items-center gap-2.5">
            <Avatar size="sm" className="ring-1 ring-border">
              <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
              <AvatarFallback>창일</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                  {INITIAL_USER.name} 님
                </span>
                <span className="inline-block size-1.5 rounded-full bg-emerald-500" />
              </div>
              <p className="text-[10px] text-muted-foreground">
                출석률 <span className="font-semibold text-emerald-600 dark:text-emerald-400">98.5%</span> (안전)
              </p>
            </div>
          </div>
          <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>

        <Separator />

        {/* Theme & Quick Settings */}
        <div className="flex items-center justify-between px-2 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="size-3.5 text-indigo-400" />
            ) : (
              <Sun className="size-3.5 text-amber-500" />
            )}
            <span className="text-[11px]">다크 모드</span>
          </div>
          <Switch
            size="sm"
            checked={isDark}
            onCheckedChange={onToggleDark}
            aria-label="다크 모드 전환"
          />
        </div>
      </div>
    </aside>
  );
}
