"use client";

import * as React from "react";
import {
  Download,
  FileText,
  Megaphone,
  Pin,
  Search,
  Calendar,
  Eye,
  User,
  Sparkles,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { INITIAL_NOTICES, NoticeItem } from "@/lib/lms-data";

export function NoticesView() {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("전체");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeNotice, setActiveNotice] = React.useState<NoticeItem | null>(null);

  const categories = ["전체", "필독", "공지", "자료", "시스템"];

  const filteredNotices = INITIAL_NOTICES.filter((item) => {
    const matchesCat = selectedCategory === "전체" || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const getCategoryBadge = (category: NoticeItem["category"]) => {
    switch (category) {
      case "필독":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-200/60 dark:border-rose-900/50">
            필독
          </span>
        );
      case "공지":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-200/60 dark:border-indigo-900/50">
            공지
          </span>
        );
      case "자료":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-900/50">
            자료
          </span>
        );
      case "시스템":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            시스템
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
            {category}
          </span>
        );
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Category Filter Navigation Bar */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Chips with refined spacing */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const count =
                  cat === "전체"
                    ? INITIAL_NOTICES.length
                    : INITIAL_NOTICES.filter((n) => n.category === cat).length;
                const isSelected = selectedCategory === cat;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`group px-3 py-1.5 rounded-lg text-xs font-medium tracking-tight transition-all flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? "bg-indigo-600 text-white shadow-xs font-semibold"
                        : "bg-slate-100/80 hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 dark:bg-slate-800/60 dark:hover:bg-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold transition-colors ${
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-200/80 text-slate-500 dark:bg-slate-700 dark:text-slate-400 group-hover:bg-slate-300/80"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input with clean typographic proportions */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-slate-400 dark:text-slate-500 pointer-events-none" />
              <Input
                placeholder="공지사항 제목 또는 내용 검색..."
                className="pl-8 text-xs h-8.5 rounded-lg border-border/80 bg-background placeholder:text-muted-foreground/70 focus-visible:ring-1 focus-visible:ring-indigo-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  ✕
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices Table with enhanced typographic rhythm */}
      <Card className="border-border/60 shadow-xs overflow-hidden">
        <CardHeader className="py-3 px-4 sm:px-5 border-b border-border/60 bg-muted/20">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2 text-slate-900 dark:text-slate-100 tracking-tight">
              <Megaphone className="size-4 text-indigo-600 dark:text-indigo-400" />
              공지 목록
            </CardTitle>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              총 <b className="text-indigo-600 dark:text-indigo-400 font-semibold">{filteredNotices.length}</b>건
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-900/50 hover:bg-slate-50/50 border-b border-border/60">
                <TableHead className="w-[85px] text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-2.5">말머리</TableHead>
                <TableHead className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-2.5">제목</TableHead>
                <TableHead className="w-[110px] hidden sm:table-cell text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-2.5">작성자</TableHead>
                <TableHead className="w-[105px] text-center text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-2.5">등록일</TableHead>
                <TableHead className="w-[75px] text-center hidden sm:table-cell text-[11px] font-semibold text-slate-500 dark:text-slate-400 py-2.5">조회수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-36 text-center text-xs text-muted-foreground">
                    <p className="font-medium text-slate-500">일치하는 공지사항이 없습니다.</p>
                    <p className="text-[11px] text-slate-400 mt-1">다른 검색어를 입력하시거나 카테고리 필터를 변경해보세요.</p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice) => {
                  const isPinned = notice.isPinned;
                  return (
                    <TableRow
                      key={notice.id}
                      onClick={() => setActiveNotice(notice)}
                      className={`cursor-pointer transition-colors border-b border-border/40 ${
                        isPinned
                          ? "bg-indigo-50/20 dark:bg-indigo-950/15 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30"
                          : "hover:bg-slate-50 dark:hover:bg-slate-800/40"
                      }`}
                    >
                      {/* 말머리 뱃지 */}
                      <TableCell className="text-center py-3.5 px-3">
                        {getCategoryBadge(notice.category)}
                      </TableCell>

                      {/* 제목 & 아이콘 */}
                      <TableCell className="py-3.5 px-3">
                        <div className="flex items-center gap-2">
                          {isPinned && (
                            <span className="flex items-center justify-center size-4 rounded bg-rose-100 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400 shrink-0">
                              <Pin className="size-2.5 fill-current" />
                            </span>
                          )}
                          <span className={`text-[13px] sm:text-sm font-medium tracking-tight line-clamp-1 leading-normal transition-colors ${
                            isPinned
                              ? "text-slate-900 dark:text-slate-50 font-semibold"
                              : "text-slate-800 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
                          }`}>
                            {notice.title}
                          </span>
                          {notice.isNew && (
                            <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-rose-500 text-white shrink-0 uppercase tracking-wider">
                              NEW
                            </span>
                          )}
                        </div>
                      </TableCell>

                      {/* 작성자 */}
                      <TableCell className="text-xs text-slate-500 dark:text-slate-400 hidden sm:table-cell py-3.5 px-3 font-normal">
                        <span className="flex items-center gap-1.5">
                          <User className="size-3 text-slate-400" />
                          {notice.author}
                        </span>
                      </TableCell>

                      {/* 등록일 */}
                      <TableCell className="text-xs text-center text-slate-500 dark:text-slate-400 py-3.5 px-3 font-mono tracking-tight">
                        {notice.createdAt}
                      </TableCell>

                      {/* 조회수 */}
                      <TableCell className="text-xs text-center text-slate-500 dark:text-slate-400 hidden sm:table-cell py-3.5 px-3 font-mono">
                        {notice.views.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notice Detail Dialog with Elevated Reading Typography */}
      <Dialog open={!!activeNotice} onOpenChange={(open) => !open && setActiveNotice(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto p-5 sm:p-6">
          {activeNotice && (
            <div className="space-y-4">
              <DialogHeader className="space-y-2.5 text-left border-b border-border/60 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {getCategoryBadge(activeNotice.category)}
                    {activeNotice.isPinned && (
                      <span className="text-[11px] font-medium text-rose-500 flex items-center gap-1">
                        <Pin className="size-3" /> 상단 고정 공지
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                    <Calendar className="size-3" /> {activeNotice.createdAt}
                  </span>
                </div>

                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                  {activeNotice.title}
                </DialogTitle>

                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="size-3 text-slate-400" />
                    작성자: <b className="text-slate-700 dark:text-slate-300 font-semibold">{activeNotice.author}</b>
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3 text-slate-400" />
                    조회: {activeNotice.views}회
                  </span>
                </DialogDescription>
              </DialogHeader>

              {/* Body Content - Optimized Line-Height (1.75) and Letter-Spacing (-0.01em) */}
              <div className="text-[13.5px] sm:text-[14px] text-slate-700 dark:text-slate-200 leading-[1.75] tracking-[-0.01em] whitespace-pre-wrap py-2">
                {activeNotice.content}
                <br /><br />
                궁금한 사항이 있으시거나 관련 문의가 있으신 경우 행정지원팀 또는 슬랙 <code>#announcement</code> 채널로 문의해 주시기 바랍니다.
              </div>

              {/* Attachment Download Box with High-Legibility Metadata */}
              <div className="rounded-xl border border-border/80 bg-slate-50/70 dark:bg-slate-900/60 p-3 sm:p-3.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 shrink-0">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      첨부파일_해커톤_및_학습안내문_v1.0.pdf
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono">PDF • 1.4 MB • 2026. 11. 09 배포</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-8 gap-1.5 font-medium shrink-0 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50"
                  onClick={() => alert("첨부파일을 안전하게 다운로드합니다.")}
                >
                  <Download className="size-3.5" /> 다운로드
                </Button>
              </div>

              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-2 pt-2 border-t border-border/60">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Sparkles className="size-3 text-indigo-500" /> LG CNS AM Inspire Camp 6기 교육운영국
                </span>
                <DialogClose render={<Button variant="outline" size="sm" className="text-xs font-medium" />}>
                  확인 및 닫기
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
