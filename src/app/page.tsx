"use client";

import * as React from "react";
import {
  Activity,
  Bell,
  Check,
  CheckCircle2,
  Code2,
  ExternalLink,
  FolderGit2,
  Laptop,
  Layers,
  LogOut,
  Moon,
  MoreHorizontal,
  Plus,
  Search,
  Settings,
  Sparkles,
  Sun,
  Terminal,
  Trash2,
  User,
  Users,
  Zap,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage, AvatarGroup } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface ProjectItem {
  id: string;
  name: string;
  category: string;
  stack: string[];
  status: "완료" | "진행중" | "대기중";
  author: string;
  avatar: string;
  createdAt: string;
}

const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: "PRJ-001",
    name: "AI 기반 스마트 캘린더",
    category: "AI / Productivity",
    stack: ["Next.js 15", "shadcn/ui", "OpenAI"],
    status: "진행중",
    author: "김지민",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces",
    createdAt: "2026-11-01",
  },
  {
    id: "PRJ-002",
    name: "실시간 해커톤 협업 대시보드",
    category: "Web / Collaboration",
    stack: ["Next.js 15", "Tailwind CSS", "WebSocket"],
    status: "완료",
    author: "박서준",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces",
    createdAt: "2026-11-04",
  },
  {
    id: "PRJ-003",
    name: "이커머스 결제 자동화 위젯",
    category: "Fintech",
    stack: ["React 19", "shadcn", "Stripe"],
    status: "대기중",
    author: "이지은",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces",
    createdAt: "2026-11-08",
  },
];

export default function HomePage() {
  const [isDark, setIsDark] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [projects, setProjects] = React.useState<ProjectItem[]>(INITIAL_PROJECTS);
  const [count, setCount] = React.useState(0);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  // New project modal form state
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState("Web / App");
  const [newStack, setNewStack] = React.useState("Next.js 15, Tailwind v4");

  const toggleDarkMode = () => {
    setIsDark((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
      return next;
    });
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newProject: ProjectItem = {
      id: `PRJ-${String(projects.length + 1).padStart(3, "0")}`,
      name: newTitle.trim(),
      category: newCategory.trim() || "General",
      stack: newStack.split(",").map((s) => s.trim()).filter(Boolean),
      status: "진행중",
      author: "게스트 사용자",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=faces",
      createdAt: new Date().toISOString().split("T")[0],
    };

    setProjects([newProject, ...projects]);
    setNewTitle("");
    setIsModalOpen(false);
  };

  const handleDeleteProject = (id: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  };

  const filteredProjects = projects.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.stack.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex min-h-screen flex-col bg-background selection:bg-primary/20">
      {/* Top Navigation */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Zap className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight sm:text-lg">
                  Next15 Stack Hub
                </span>
                <Badge variant="outline" className="text-[10px] hidden sm:inline-flex">
                  Next.js 15
                </Badge>
                <Badge variant="secondary" className="text-[10px] hidden sm:inline-flex">
                  Tailwind v4
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Next.js 15 + shadcn/ui + Tailwind CSS 3종 완벽 연동 예제
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="프로젝트 검색..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Dark Mode Switch */}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg border bg-muted/30">
              {isDark ? (
                <Moon className="size-4 text-primary" />
              ) : (
                <Sun className="size-4 text-amber-500" />
              )}
              <Switch
                checked={isDark}
                onCheckedChange={toggleDarkMode}
                aria-label="Toggle dark mode"
              />
            </div>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="rounded-full" />}>
                <Avatar size="sm">
                  <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
                  <AvatarFallback>NX</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <p className="font-semibold text-sm">관리자 계정</p>
                  <p className="text-xs text-muted-foreground font-normal">admin@hackathon.dev</p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4 mr-2" /> 내 프로필
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" /> 프로젝트 설정
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bell className="size-4 mr-2" /> 알림 설정
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="size-4 mr-2" /> 로그아웃
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 container mx-auto px-4 py-8 sm:px-8 space-y-8">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-card via-card to-muted/40 p-6 sm:p-8 shadow-sm">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur">
                <Sparkles className="size-3.5 text-primary" />
                <span>Next.js 15.5 App Router + shadcn/ui 공식 연동</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                현대적인 웹을 위한 풀스택 스타터 킷
              </h1>
              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Next.js 15의 App Router, shadcn/ui의 Base UI 컴포넌트, Tailwind CSS v4 테마 시스템을 적용한 대시보드 예제입니다. 반응형 테이블, 모달 다이얼로그, 탭 뷰, 다크모드 등을 즉시 테스트할 수 있습니다.
              </p>
            </div>

            {/* Quick Action Dialog */}
            <div className="flex flex-wrap items-center gap-3">
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger render={<Button className="gap-2 shadow-sm" size="lg" />}>
                  <Plus className="size-4" />
                  새 프로젝트 생성
                </DialogTrigger>
                <DialogContent>
                  <form onSubmit={handleAddProject}>
                    <DialogHeader>
                      <DialogTitle>새 프로젝트 추가</DialogTitle>
                      <DialogDescription>
                        새로운 해커톤 프로젝트의 기본 정보를 입력하세요.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          프로젝트명 *
                        </label>
                        <Input
                          placeholder="예: 실시간 문서 편집기"
                          value={newTitle}
                          onChange={(e) => setNewTitle(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          카테고리
                        </label>
                        <Input
                          placeholder="예: AI, Web, Fintech"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-foreground">
                          기술 스택 (쉼표 구분)
                        </label>
                        <Input
                          placeholder="Next.js 15, Tailwind, Supabase"
                          value={newStack}
                          onChange={(e) => setNewStack(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                      <DialogClose render={<Button type="button" variant="outline" />}>
                        취소
                      </DialogClose>
                      <Button type="submit">생성하기</Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <Button
                variant="outline"
                size="lg"
                onClick={() => window.open("https://ui.shadcn.com", "_blank")}
                className="gap-2"
              >
                <ExternalLink className="size-4" />
                shadcn 문서
              </Button>
            </div>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                등록된 프로젝트
              </CardTitle>
              <FolderGit2 className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{projects.length}개</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-semibold">+24%</span> 지난주 대비
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                활성 팀 멤버
              </CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">18명</div>
                <AvatarGroup>
                  <Avatar size="sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
                    <AvatarFallback>A</AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" />
                    <AvatarFallback>B</AvatarFallback>
                  </Avatar>
                  <Avatar size="sm">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" />
                    <AvatarFallback>C</AvatarFallback>
                  </Avatar>
                </AvatarGroup>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                현재 4개 팀 동시 작업 중
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                빌드 & 배포 성공률
              </CardTitle>
              <CheckCircle2 className="size-4 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">99.8%</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Badge variant="secondary" className="text-[10px] py-0">Turbopack 활성</Badge>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                평균 응답 시간
              </CardTitle>
              <Activity className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12ms</div>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <span className="text-emerald-500 font-semibold">최적 상태</span> Server Components
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabbed Interface */}
        <Tabs defaultValue="projects" className="w-full space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4">
            <TabsList>
              <TabsTrigger value="projects" className="gap-2">
                <FolderGit2 className="size-4" />
                프로젝트 관리
              </TabsTrigger>
              <TabsTrigger value="components" className="gap-2">
                <Layers className="size-4" />
                shadcn UI 컴포넌트 갤러리
              </TabsTrigger>
              <TabsTrigger value="guide" className="gap-2">
                <Code2 className="size-4" />
                아키텍처 & 설정 가이드
              </TabsTrigger>
            </TabsList>

            <span className="text-xs text-muted-foreground">
              총 {filteredProjects.length}개 항목 표시 중
            </span>
          </div>

          {/* TAB 1: Projects Table */}
          <TabsContent value="projects" className="space-y-4">
            <Card>
              <CardHeader className="border-b">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <CardTitle>프로젝트 목록</CardTitle>
                    <CardDescription>
                      진행 중인 모든 프로젝트 상태 및 기술 스택을 한눈에 관리합니다.
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="이름/기술스택 필터링..."
                      className="w-full sm:w-64"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">ID</TableHead>
                      <TableHead>프로젝트명</TableHead>
                      <TableHead>카테고리</TableHead>
                      <TableHead>기술 스택</TableHead>
                      <TableHead>담당자</TableHead>
                      <TableHead>상태</TableHead>
                      <TableHead className="text-right">관리</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProjects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="h-32 text-center text-muted-foreground">
                          일치하는 프로젝트가 없습니다.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProjects.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-mono text-xs font-semibold text-muted-foreground">
                            {item.id}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {item.name}
                          </TableCell>
                          <TableCell className="text-muted-foreground text-xs">
                            {item.category}
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {item.stack.map((stk, idx) => (
                                <Badge key={idx} variant="outline" className="text-[10px]">
                                  {stk}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Avatar size="sm">
                                <AvatarImage src={item.avatar} />
                                <AvatarFallback>{item.author.slice(0, 1)}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs">{item.author}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={
                                item.status === "완료"
                                  ? "default"
                                  : item.status === "진행중"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {item.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger
                                render={
                                  <Button variant="ghost" size="icon-sm">
                                    <MoreHorizontal className="size-4" />
                                  </Button>
                                }
                              />
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => {
                                    alert(`프로젝트: ${item.name}`);
                                  }}
                                >
                                  상세 보기
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => {
                                    const nextStatus =
                                      item.status === "완료"
                                        ? "진행중"
                                        : item.status === "진행중"
                                        ? "대기중"
                                        : "완료";
                                    setProjects((prev) =>
                                      prev.map((p) =>
                                        p.id === item.id ? { ...p, status: nextStatus } : p
                                      )
                                    );
                                  }}
                                >
                                  상태 변경
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleDeleteProject(item.id)}
                                >
                                  <Trash2 className="size-3.5 mr-2" /> 삭제
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-between items-center text-xs text-muted-foreground border-t py-3">
                <span>총 {projects.length}개 프로젝트 중 {filteredProjects.length}개 표시</span>
                <span className="text-[11px]">Next.js 15 App Router 반응형 데이터 렌더링</span>
              </CardFooter>
            </Card>
          </TabsContent>

          {/* TAB 2: shadcn Component Showcase */}
          <TabsContent value="components" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Button Variants */}
              <Card>
                <CardHeader>
                  <CardTitle>Button (버튼 변형)</CardTitle>
                  <CardDescription>
                    다양한 스타일의 shadcn 버튼 컴포넌트
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="default">Default</Button>
                    <Button variant="secondary">Secondary</Button>
                    <Button variant="outline">Outline</Button>
                    <Button variant="ghost">Ghost</Button>
                    <Button variant="destructive">Destructive</Button>
                    <Button variant="link">Link Button</Button>
                  </div>
                  <Separator />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button size="sm">Small</Button>
                    <Button size="default">Default</Button>
                    <Button size="lg">Large</Button>
                    <Button size="icon" variant="outline">
                      <Zap className="size-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Badge & Avatar */}
              <Card>
                <CardHeader>
                  <CardTitle>Badge & Avatar (뱃지 및 아바타)</CardTitle>
                  <CardDescription>
                    상태 표시 뱃지와 사용자 프로필 아바타 그룹
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="default">Default Badge</Badge>
                    <Badge variant="secondary">Secondary</Badge>
                    <Badge variant="outline">Outline</Badge>
                    <Badge variant="destructive">Destructive</Badge>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarImage src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces" />
                      <AvatarFallback>LG</AvatarFallback>
                    </Avatar>
                    <Avatar size="default">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces" />
                      <AvatarFallback>MD</AvatarFallback>
                    </Avatar>
                    <Avatar size="sm">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces" />
                      <AvatarFallback>SM</AvatarFallback>
                    </Avatar>
                    <AvatarGroup>
                      <Avatar size="sm">
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">U1</AvatarFallback>
                      </Avatar>
                      <Avatar size="sm">
                        <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">U2</AvatarFallback>
                      </Avatar>
                      <Avatar size="sm">
                        <AvatarFallback className="bg-muted text-muted-foreground text-xs">+5</AvatarFallback>
                      </Avatar>
                    </AvatarGroup>
                  </div>
                </CardContent>
              </Card>

              {/* Inputs & Form Controls */}
              <Card>
                <CardHeader>
                  <CardTitle>Input & Controls (폼 컨트롤)</CardTitle>
                  <CardDescription>
                    텍스트 필드와 토글 스위치 인터랙션
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-medium">검색 또는 입력창</label>
                    <Input placeholder="이곳에 텍스트를 입력하세요..." />
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium">실시간 동기화</p>
                      <p className="text-xs text-muted-foreground">
                        클라이언트 상태를 서버와 자동 동기화합니다.
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </CardContent>
              </Card>

              {/* React 19 Client State Demo */}
              <Card>
                <CardHeader>
                  <CardTitle>React 19 클라이언트 상태 데모</CardTitle>
                  <CardDescription>
                    Next.js 15의 Client Component 인터랙션 테스트
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/20">
                    <div>
                      <span className="text-xs text-muted-foreground block">현재 카운트</span>
                      <span className="text-3xl font-extrabold">{count}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => setCount((c) => c - 1)}>
                        - 1
                      </Button>
                      <Button variant="default" size="sm" onClick={() => setCount((c) => c + 1)}>
                        + 1
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => setCount(0)}>
                        초기화
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    ⚡ Next.js 15는 Turbopack과 결합되어 초고속 HMR(Hot Module Replacement)을 제공합니다.
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 3: Guide & Architecture */}
          <TabsContent value="guide" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Terminal className="size-5 text-primary" />
                    프로젝트 구조 및 핵심 설정
                  </CardTitle>
                  <CardDescription>
                    Next.js 15, shadcn/ui, Tailwind CSS v4가 어떻게 결합되어 있는지 확인하세요.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm">
                  <div className="rounded-lg bg-muted p-4 font-mono text-xs overflow-x-auto space-y-1">
                    <p className="text-primary font-bold">src/</p>
                    <p className="pl-4">├── app/</p>
                    <p className="pl-8">├── layout.tsx         # 전역 폰트(Geist) 및 루트 레이아웃</p>
                    <p className="pl-8">├── page.tsx           # 대시보드 메인 컴포넌트</p>
                    <p className="pl-8">└── globals.css        # Tailwind v4 @import 및 색상 토큰(oklch)</p>
                    <p className="pl-4">├── components/</p>
                    <p className="pl-8">└── ui/                # shadcn 컴포넌트 (button, card, dialog 등)</p>
                    <p className="pl-4">└── lib/</p>
                    <p className="pl-8">└── utils.ts          # clsx + tailwind-merge (cn 유틸)</p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">새로운 shadcn 컴포넌트 추가 방법</h4>
                    <pre className="rounded-lg bg-zinc-950 p-3 text-zinc-100 font-mono text-xs overflow-x-auto">
                      npx shadcn@latest add [컴포넌트명]
                    </pre>
                    <p className="text-xs text-muted-foreground">
                      예: <code>npx shadcn@latest add accordion calendar slider toast</code>
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Check className="size-5 text-emerald-500" />
                    주요 기술 특징
                  </CardTitle>
                  <CardDescription>3가지 스택의 시너지</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-xs leading-relaxed">
                  <div className="rounded-lg border p-3 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Laptop className="size-3.5 text-primary" /> Next.js 15 (App Router)
                    </div>
                    <p className="text-muted-foreground">
                      React 19 지원, Turbopack 기본 활성화, 비동기 Request API 및 Server Components 최적화.
                    </p>
                  </div>

                  <div className="rounded-lg border p-3 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Layers className="size-3.5 text-primary" /> shadcn/ui
                    </div>
                    <p className="text-muted-foreground">
                      외부 패키지가 아닌 프로젝트 내 컴포넌트 코드로 소유하여 100% 커스터마이징 가능.
                    </p>
                  </div>

                  <div className="rounded-lg border p-3 space-y-1">
                    <div className="font-semibold text-foreground flex items-center gap-1.5">
                      <Zap className="size-3.5 text-primary" /> Tailwind CSS v4
                    </div>
                    <p className="text-muted-foreground">
                      CSS 퍼스트 구성(@theme inline), oklch 모던 컬러 스페이스, Rust 기반 차세대 엔진.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>© 2026 Next.js 15 + shadcn/ui + Tailwind CSS Showcase Project.</p>
          <div className="flex items-center gap-4">
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Next.js Docs
            </a>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              shadcn/ui Docs
            </a>
            <Separator orientation="vertical" className="h-3" />
            <a
              href="https://tailwindcss.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Tailwind CSS
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
