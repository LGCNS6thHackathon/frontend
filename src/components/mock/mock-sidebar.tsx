"use client";

import * as React from "react";
import {
  Award,
  Bell,
  CalendarDays,
  ChevronRight,
  FileCheck2,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { INITIAL_NOTICES, INITIAL_USER } from "@/lib/lms-data";
import Logo from "@/components/layout/Logo";

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
  highlight?: boolean;
  badge?: string;
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
  const [unreadCount, setUnreadCount] = React.useState(2);

  const navItems: NavGroup[] = [
    {
      group: "워크스페이스",
      items: [
        {
          id: "home",
          label: "대시보드",
          icon: LayoutDashboard,
        },
        {
          id: "schedule",
          label: "캘린더",
          icon: CalendarDays,
        },
        {
          id: "assignment",
          label: "과제",
          icon: FileCheck2,
        },
      ],
    },
    {
      group: "커뮤니케이션",
      items: [
        {
          id: "notices",
          label: "공지사항",
          icon: Megaphone,
        },
        {
          id: "qa",
          label: "학습 질문",
          icon: HelpCircle,
        },
        {
          id: "evaluation",
          label: "역량평가",
          icon: Award,
        },
      ],
    },
    {
      group: "개인 맞춤",
      items: [
        {
          id: "ai-review",
          label: "AI 복습",
          icon: Sparkles,
          highlight: true,
          badge: "BETA",
        },
        {
          id: "mypage",
          label: "마이페이지",
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
          <Logo
            size={40}
            subtitle="LG CNS AM 캠프 6기"
            onClick={() => onTabChange("home")}
          />
        </div>

        {/* Navigation Groups (No chip designs on right) */}
        <div className="p-3 space-y-6 overflow-y-auto max-h-[calc(100vh-250px)]">
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
                      className={`w-full flex items-center px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
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
                            isActive
                              ? "text-primary-foreground"
                              : "text-muted-foreground group-hover:text-foreground"
                          }`}
                        />
                        <span className="truncate">{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={`ml-auto text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                            isActive
                              ? "bg-primary-foreground/20 text-primary-foreground"
                              : "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section: Theme Switch (Placed Above Notifications) -> Notification -> User Profile */}
      <div className="p-3 border-t bg-card/40 space-y-2.5">
        {/* 1. Theme & Quick Settings (Placed Above Notifications) */}
        <div className="flex items-center justify-between px-2 pt-0.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            {isDark ? (
              <Moon className="size-3.5 text-indigo-400" />
            ) : (
              <Sun className="size-3.5 text-amber-500" />
            )}
            <span className="text-[11px] font-medium text-foreground">
              다크 모드
            </span>
          </div>
          <Switch
            size="sm"
            checked={isDark}
            onCheckedChange={onToggleDark}
            aria-label="다크 모드 전환"
          />
        </div>

        <Separator />

        {/* 2. Notifications (Moved from Top-Right Header) */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="w-full flex items-center justify-between p-2 rounded-xl text-xs hover:bg-muted/60 transition-colors group">
                <div className="flex items-center gap-2.5">
                  <div className="relative">
                    <Bell className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 flex size-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white ring-2 ring-background">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                  <span className="font-semibold text-foreground">
                    새로운 알림
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full font-mono">
                  {unreadCount}개
                </span>
              </button>
            }
          />
          <DropdownMenuContent
            align="start"
            side="top"
            className="w-72 p-2 mb-2"
          >
            <div className="flex items-center justify-between px-2 py-1.5 border-b mb-1">
              <span className="text-xs font-bold text-foreground">
                알림 피드
              </span>
              <button
                onClick={() => setUnreadCount(0)}
                className="text-[10px] text-primary hover:underline"
              >
                모두 읽음
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
                    <span className="font-semibold text-foreground truncate max-w-[160px]">
                      {notice.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {notice.createdAt}
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground line-clamp-1">
                    {notice.content}
                  </p>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator />

        {/* 3. User Mini Card */}
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
                출석률{" "}
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                  98.5%
                </span>{" "}
                (안전)
              </p>
            </div>
          </div>
          <ChevronRight className="size-3.5 text-muted-foreground group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
    </aside>
  );
}
