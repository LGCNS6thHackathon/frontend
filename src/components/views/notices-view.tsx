"use client";

import * as React from "react";
import {
  Download,
  FileText,
  Megaphone,
  Pin,
  Search,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
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
import { Separator } from "@/components/ui/separator";
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

  const getCategoryBadgeVariant = (category: NoticeItem["category"]) => {
    switch (category) {
      case "필독":
        return "destructive";
      case "공지":
        return "default";
      case "자료":
        return "secondary";
      case "시스템":
        return "outline";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Category Filter Bar */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Category Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {categories.map((cat) => {
                const count =
                  cat === "전체"
                    ? INITIAL_NOTICES.length
                    : INITIAL_NOTICES.filter((n) => n.category === cat).length;

                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                      selectedCategory === cat
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                  >
                    <span>{cat}</span>
                    <span
                      className={`text-[10px] px-1 rounded-full ${
                        selectedCategory === cat
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="공지사항 검색..."
                className="pl-8 text-xs h-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notices Table */}
      <Card>
        <CardHeader className="pb-3 border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Megaphone className="size-4 text-primary" />
              공지 목록
            </CardTitle>
            <span className="text-xs text-muted-foreground">
              총 {filteredNotices.length}건
            </span>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[85px] text-center">말머리</TableHead>
                <TableHead>제목</TableHead>
                <TableHead className="w-[100px] hidden sm:table-cell">작성자</TableHead>
                <TableHead className="w-[100px] text-center">등록일</TableHead>
                <TableHead className="w-[70px] text-center hidden sm:table-cell">조회수</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-xs text-muted-foreground">
                    검색 조건과 일치하는 공지사항이 없습니다.
                  </TableCell>
                </TableRow>
              ) : (
                filteredNotices.map((notice) => (
                  <TableRow
                    key={notice.id}
                    onClick={() => setActiveNotice(notice)}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <TableCell className="text-center">
                      <Badge
                        variant={getCategoryBadgeVariant(notice.category)}
                        className={`text-[10px] px-2 py-0.5 ${
                          notice.category === "필독" ? "animate-pulse" : ""
                        }`}
                      >
                        {notice.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        {notice.isPinned && (
                          <Pin className="size-3 text-red-500 fill-red-500 shrink-0" />
                        )}
                        <span className="font-semibold text-xs sm:text-sm text-foreground hover:text-primary transition-colors">
                          {notice.title}
                        </span>
                        {notice.isNew && (
                          <span className="size-1.5 rounded-full bg-red-500 shrink-0" />
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground hidden sm:table-cell">
                      {notice.author}
                    </TableCell>
                    <TableCell className="text-xs text-center text-muted-foreground">
                      {notice.createdAt}
                    </TableCell>
                    <TableCell className="text-xs text-center text-muted-foreground hidden sm:table-cell">
                      {notice.views}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Notice Detail Dialog */}
      <Dialog open={!!activeNotice} onOpenChange={(open) => !open && setActiveNotice(null)}>
        <DialogContent className="sm:max-w-lg">
          {activeNotice && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant={getCategoryBadgeVariant(activeNotice.category)}>
                    {activeNotice.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground font-mono">{activeNotice.createdAt}</span>
                </div>
                <DialogTitle className="text-base font-bold pt-1 leading-snug">
                  {activeNotice.title}
                </DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-3 pt-1">
                  <span>작성자: <b>{activeNotice.author}</b></span>
                  <span>조회수: {activeNotice.views}</span>
                </DialogDescription>
              </DialogHeader>

              <Separator />

              {/* Body Content */}
              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap py-2">
                {activeNotice.content}
                <br /><br />
                궁금한 사항이 있으시거나 관련 문의가 있으신 경우 행정지원팀 또는 슬랙 <code>#announcement</code> 채널로 문의해 주시기 바랍니다.
              </div>

              {/* Attachment Download Box */}
              <div className="rounded-xl border bg-muted/40 p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="size-4 text-primary" />
                  <span className="text-xs font-medium">첨부파일_세부안내문_v1.0.pdf</span>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs h-7 gap-1"
                  onClick={() => alert("첨부파일을 다운로드합니다.")}
                >
                  <Download className="size-3" /> 다운로드
                </Button>
              </div>

              <DialogFooter className="flex justify-between items-center pt-2">
                <span className="text-[11px] text-muted-foreground">LG CNS AM 6기 교육운영국</span>
                <DialogClose render={<Button variant="outline" size="sm" className="text-xs" />}>
                  닫기
                </DialogClose>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
