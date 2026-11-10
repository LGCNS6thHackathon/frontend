"use client";

import * as React from "react";
import { AppSidebar, NavTabId } from "./mock-sidebar";
import { AppHeader } from "./mock-header";
import { HomeView } from "@/components/views/home-view";
import { ScheduleView } from "@/components/views/schedule-view";
import { NoticesView } from "@/components/views/notices-view";
import { QaView } from "@/components/views/qa-view";
import { EvaluationView } from "@/components/views/evaluation-view";
import { AssignmentView } from "@/components/views/assignment-view";
import { AiReviewView } from "@/components/views/ai-review-view";
import { MyPageView } from "@/components/views/mypage-view";

export default function LmsPortalPage() {
  const [currentTab, setCurrentTab] = React.useState<NavTabId>("home");
  const [isDark, setIsDark] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [evalResetKey, setEvalResetKey] = React.useState(0);

  // Initialize theme from localStorage/system and URL query tab on mount
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme");
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
      ).matches;
      const isDarkMode = savedTheme === "dark" || (!savedTheme && prefersDark);
      setIsDark(isDarkMode);
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }

      // Check URL query param ?tab=...
      const syncTabFromUrl = () => {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get("tab") as NavTabId;
        if (
          tabParam &&
          [
            "home",
            "schedule",
            "notices",
            "qa",
            "evaluation",
            "assignment",
            "ai-review",
            "mypage",
          ].includes(tabParam)
        ) {
          setCurrentTab(tabParam);
        }
      };

      syncTabFromUrl();
      window.addEventListener("popstate", syncTabFromUrl);
      return () => window.removeEventListener("popstate", syncTabFromUrl);
    }
  }, []);

  const handleTabChange = (tab: NavTabId) => {
    setIsMobileMenuOpen(false);

    // If user clicks the tab they are already on (especially "evaluation" to reset to initial hub)
    if (tab === currentTab) {
      if (tab === "evaluation") {
        setEvalResetKey((prev) => prev + 1);
        if (typeof window !== "undefined") {
          const url = new URL(window.location.href);
          url.searchParams.set("tab", "evaluation");
          url.searchParams.delete("view");
          url.searchParams.delete("examId");
          url.searchParams.delete("video");
          url.searchParams.delete("chapter");
          if (url.toString() !== window.location.href) {
            window.history.pushState({}, "", url.toString());
          }
          window.dispatchEvent(new PopStateEvent("popstate"));
        }
      }
      return;
    }

    setCurrentTab(tab);
    // Push new history entry so browser Back works naturally
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("tab", tab);
      url.searchParams.delete("view");
      url.searchParams.delete("examId");
      url.searchParams.delete("video");
      url.searchParams.delete("chapter");
      window.history.pushState({}, "", url.toString());
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      return next;
    });
  };

  return (
    <div className="flex min-h-screen bg-background text-foreground font-sans selection:bg-indigo-500/20">
      {/* Desktop Left Sidebar */}
      <div className="hidden md:block">
        <AppSidebar
          currentTab={currentTab}
          onTabChange={handleTabChange}
          isDark={isDark}
          onToggleDark={toggleDarkMode}
        />
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-10 w-64 h-full bg-card shadow-2xl">
            <AppSidebar
              currentTab={currentTab}
              onTabChange={handleTabChange}
              isDark={isDark}
              onToggleDark={toggleDarkMode}
            />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <AppHeader
          currentTab={currentTab}
          onTabChange={handleTabChange}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          isDark={isDark}
          onToggleDark={toggleDarkMode}
        />

        <main className="flex-1 container mx-auto px-4 py-6 sm:px-8 max-w-7xl animate-in fade-in-50 duration-200">
          {currentTab === "home" && <HomeView onNavigate={handleTabChange} />}
          {currentTab === "schedule" && <ScheduleView onNavigate={tab => handleTabChange(tab as NavTabId)} />}
          {currentTab === "notices" && <NoticesView />}
          {currentTab === "qa" && <QaView />}
          {currentTab === "evaluation" && (
            <EvaluationView
              onNavigate={tab => handleTabChange(tab as NavTabId)}
              resetSignal={evalResetKey}
            />
          )}
          {currentTab === "assignment" && <AssignmentView />}
          {currentTab === "ai-review" && <AiReviewView />}
          {currentTab === "mypage" && <MyPageView />}
        </main>

        {/* Global Footer */}
        <footer className="border-t py-5 bg-card/30 text-center text-xs text-muted-foreground">
          <div className="container mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p>© 2026 LG CNS AM Inspire Camp 6기. 차세대 수강생 LMS 포털</p>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">
                ● 서버 상태 (3ms)
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
