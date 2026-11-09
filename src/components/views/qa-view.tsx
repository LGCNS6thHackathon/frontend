"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Code2,
  Copy,
  Eye,
  Heart,
  MessageSquare,
  Plus,
  Search,
  Send,
  ShieldCheck,
  Sparkles,
  Terminal,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { INITIAL_QNA, QnaItem } from "@/lib/lms-data";

export function QaView() {
  const [qnaList, setQnaList] = React.useState<QnaItem[]>(INITIAL_QNA);
  const [selectedTag, setSelectedTag] = React.useState<string>("전체");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeQuestion, setActiveQuestion] = React.useState<QnaItem | null>(null);

  // New question modal state
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<QnaItem["category"]>("Next.js");
  const [newContent, setNewContent] = React.useState("");
  const [newSnippet, setNewSnippet] = React.useState("");

  // New reply input state
  const [replyText, setReplyText] = React.useState("");

  // Code snippet copied state
  const [isCopied, setIsCopied] = React.useState(false);

  const tags = ["전체", "Next.js", "React", "AWS", "FastAPI", "일반"];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleToggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setQnaList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, likes: item.likes + 1 } : item))
    );
    if (activeQuestion && activeQuestion.id === id) {
      setActiveQuestion({ ...activeQuestion, likes: activeQuestion.likes + 1 });
    }
  };

  const handleAddQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newQ: QnaItem = {
      id: Date.now(),
      title: newTitle.trim(),
      category: newCategory,
      author: "윤창일",
      createdAt: "방금 전",
      status: "답변대기",
      views: 1,
      likes: 0,
      content: newContent.trim(),
      codeSnippet: newSnippet.trim() || undefined,
      answers: [],
    };

    setQnaList([newQ, ...qnaList]);
    setNewTitle("");
    setNewContent("");
    setNewSnippet("");
    setIsNewModalOpen(false);
  };

  const handleAddReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeQuestion) return;

    const updated: QnaItem = {
      ...activeQuestion,
      status: "답변완료",
      answers: [
        ...activeQuestion.answers,
        {
          author: "윤창일",
          role: "수강생",
          createdAt: "방금 전",
          content: replyText.trim(),
        },
      ],
    };

    setActiveQuestion(updated);
    setQnaList((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
    setReplyText("");
  };

  const filteredQna = qnaList.filter((item) => {
    const matchesTag = selectedTag === "전체" || item.category === selectedTag;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Action Bar */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-4 sm:p-5 space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            {/* Tag Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => {
                const count =
                  tag === "전체"
                    ? qnaList.length
                    : qnaList.filter((q) => q.category === tag).length;
                const isSelected = selectedTag === tag;

                return (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                        : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                    }`}
                  >
                    <span>{tag === "전체" ? "전체" : `#${tag}`}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        isSelected
                          ? "bg-primary-foreground/20 text-primary-foreground"
                          : "bg-muted-foreground/15 text-muted-foreground"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Actions: Search & Ask Question Button */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="질문 제목, 키워드 검색..."
                  className="pl-9 pr-7 text-xs h-9 tracking-tight"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              {/* Ask Question Dialog */}
              <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
                <DialogTrigger
                  render={
                    <Button size="sm" className="h-9 gap-1.5 text-xs shrink-0 font-semibold shadow-xs">
                      <Plus className="size-3.5" /> 새 질문 작성
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-lg">
                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">
                        새 학습 질문 등록
                      </DialogTitle>
                      <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                        실습 중 마주친 오류나 궁금한 점을 질문하시면 멘토단과 동료들이 답변해 드립니다.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3.5 py-2 text-xs">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="col-span-2 space-y-1.5">
                          <label className="font-semibold text-foreground tracking-tight">제목 *</label>
                          <Input
                            placeholder="예: Next.js 15 Turbopack 빌드 에러 해결 방법"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="text-xs h-9 tracking-tight"
                            required
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="font-semibold text-foreground tracking-tight">카테고리</label>
                          <select
                            className="w-full h-9 rounded-md border border-input bg-transparent px-2.5 text-xs outline-none focus:border-ring transition-colors"
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value as QnaItem["category"])}
                          >
                            <option value="Next.js">Next.js</option>
                            <option value="React">React</option>
                            <option value="AWS">AWS</option>
                            <option value="FastAPI">FastAPI</option>
                            <option value="일반">일반</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground tracking-tight">질문 내용 *</label>
                        <textarea
                          className="w-full min-h-[110px] rounded-lg border border-input bg-transparent p-3 text-xs sm:text-[13px] leading-[1.65] tracking-tight outline-none focus:border-ring transition-colors"
                          placeholder="발생한 에러 현상과 시도해 본 조치 방법을 구체적으로 작성해 주세요."
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                          <Code2 className="size-3.5 text-primary" /> 관련 코드 / 에러 로그 (선택)
                        </label>
                        <textarea
                          className="w-full min-h-[85px] font-mono rounded-lg border border-input bg-zinc-950 text-zinc-100 p-3 text-xs leading-[1.6] outline-none focus:border-ring transition-colors"
                          placeholder="// 코드 스니펫이나 터미널 에러 로그를 붙여넣으세요"
                          value={newSnippet}
                          onChange={(e) => setNewSnippet(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2 pt-2 border-t">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="text-xs h-8"
                        onClick={() => setIsNewModalOpen(false)}
                      >
                        취소
                      </Button>
                      <Button type="submit" size="sm" className="text-xs h-8 font-semibold">
                        질문 등록하기
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Q&A List Cards */}
      <div className="space-y-3">
        {filteredQna.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="h-40 flex flex-col items-center justify-center gap-2 text-center text-muted-foreground">
              <MessageSquare className="size-8 text-muted-foreground/50" />
              <p className="text-xs sm:text-sm font-medium">검색 조건에 맞는 질문이 없습니다.</p>
              <p className="text-xs text-muted-foreground/80">궁금한 점이 있다면 첫 질문을 등록해 보세요!</p>
            </CardContent>
          </Card>
        ) : (
          filteredQna.map((q) => {
            const isAnswered = q.status === "답변완료";

            return (
              <Card
                key={q.id}
                onClick={() => setActiveQuestion(q)}
                className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group border-border/70"
              >
                <CardContent className="p-4 sm:p-5 space-y-3">
                  {/* Top line: Badges and time */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {/* Category Pill */}
                      <span className="font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                        #{q.category}
                      </span>

                      {/* Status Pill */}
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isAnswered
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {isAnswered ? (
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{q.status}</span>
                      </span>

                      {q.codeSnippet && (
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-muted text-muted-foreground hidden sm:inline-flex items-center gap-1">
                          <Code2 className="size-3" /> 코드포함
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-muted-foreground font-mono">{q.createdAt}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-semibold text-foreground group-hover:text-primary transition-colors leading-snug tracking-tight">
                    {q.title}
                  </h3>

                  {/* Body Preview */}
                  <p className="text-xs sm:text-[13px] text-muted-foreground leading-[1.68] tracking-[-0.01em] line-clamp-2">
                    {q.content}
                  </p>

                  <Separator className="my-1 opacity-50" />

                  {/* Footer Row: Author & Metrics */}
                  <div className="flex items-center justify-between text-xs pt-0.5">
                    <div className="flex items-center gap-2">
                      <div className="size-6 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                        {q.author.slice(0, 1)}
                      </div>
                      <span className="font-medium text-foreground tracking-tight">{q.author}</span>
                      <span className="text-muted-foreground/60 text-[11px]">수강생</span>
                    </div>

                    <div className="flex items-center gap-3.5 text-muted-foreground">
                      <span className="flex items-center gap-1 text-[11px] font-mono">
                        <Eye className="size-3.5" /> {q.views}
                      </span>

                      <button
                        onClick={(e) => handleToggleLike(q.id, e)}
                        className="flex items-center gap-1 text-[11px] hover:text-rose-600 transition-colors group/like"
                        title="좋아요"
                      >
                        <Heart className="size-3.5 text-muted-foreground group-hover/like:text-rose-500" />
                        <span className="font-mono">{q.likes}</span>
                      </button>

                      <div
                        className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                          q.answers.length > 0
                            ? "bg-primary/10 text-primary"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <MessageSquare className="size-3" />
                        <span>답변 {q.answers.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Question Detail & Answer Dialog */}
      <Dialog open={!!activeQuestion} onOpenChange={(open) => !open && setActiveQuestion(null)}>
        <DialogContent className="sm:max-w-2xl max-h-[88vh] overflow-y-auto">
          {activeQuestion && (
            <div className="space-y-5">
              {/* Modal Header */}
              <DialogHeader className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    #{activeQuestion.category}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                      activeQuestion.status === "답변완료"
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                        : "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                    }`}
                  >
                    {activeQuestion.status === "답변완료" ? (
                      <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                    ) : (
                      <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                    )}
                    <span>{activeQuestion.status}</span>
                  </span>
                </div>

                <DialogTitle className="text-base sm:text-xl font-bold tracking-tight text-foreground leading-snug">
                  {activeQuestion.title}
                </DialogTitle>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                      {activeQuestion.author.slice(0, 1)}
                    </div>
                    <span className="font-semibold text-foreground">{activeQuestion.author}</span>
                    <span>•</span>
                    <span className="font-mono">{activeQuestion.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="flex items-center gap-1">
                      <Eye className="size-3" /> 조회 {activeQuestion.views}
                    </span>
                    <button
                      onClick={(e) => handleToggleLike(activeQuestion.id, e)}
                      className="flex items-center gap-1 text-rose-500 hover:underline cursor-pointer"
                    >
                      <Heart className="size-3 fill-rose-500 text-rose-500" /> 좋아요 {activeQuestion.likes}
                    </button>
                  </div>
                </div>
              </DialogHeader>

              <Separator />

              {/* Question Body */}
              <div className="space-y-3">
                <p className="text-[13.5px] sm:text-sm text-foreground/90 leading-[1.8] tracking-[-0.012em] whitespace-pre-wrap">
                  {activeQuestion.content}
                </p>

                {/* Code Snippet Box */}
                {activeQuestion.codeSnippet && (
                  <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 shadow-sm mt-3">
                    <div className="bg-zinc-900 px-3.5 py-2 flex items-center justify-between border-b border-zinc-800 text-xs">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="size-2.5 rounded-full bg-red-500/80" />
                          <div className="size-2.5 rounded-full bg-yellow-500/80" />
                          <div className="size-2.5 rounded-full bg-green-500/80" />
                        </div>
                        <span className="font-mono text-zinc-400 text-[11px] flex items-center gap-1 ml-1.5">
                          <Terminal className="size-3 text-zinc-500" /> 코드 스니펫 / 로그
                        </span>
                      </div>

                      <button
                        onClick={() => handleCopyCode(activeQuestion.codeSnippet!)}
                        className="text-zinc-400 hover:text-zinc-100 text-[11px] flex items-center gap-1 px-2 py-0.5 rounded hover:bg-zinc-800 transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="size-3 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">복사됨!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="size-3" />
                            <span>코드 복사</span>
                          </>
                        )}
                      </button>
                    </div>

                    <pre className="p-4 font-mono text-xs text-zinc-200 leading-[1.7] overflow-x-auto selection:bg-primary/30">
                      <code>{activeQuestion.codeSnippet}</code>
                    </pre>
                  </div>
                )}
              </div>

              <Separator />

              {/* Answers Feed */}
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold tracking-tight text-foreground flex items-center gap-1.5">
                    <MessageSquare className="size-4 text-primary" />
                    멘토 및 동료 답변
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-primary/10 text-primary ml-1">
                      {activeQuestion.answers.length}
                    </span>
                  </h4>
                  <span className="text-xs text-muted-foreground">공인 멘토 검토 완료</span>
                </div>

                {activeQuestion.answers.length === 0 ? (
                  <div className="text-center py-6 px-4 rounded-xl border border-dashed bg-muted/20 space-y-1.5">
                    <p className="text-xs font-semibold text-foreground">아직 등록된 답변이 없습니다.</p>
                    <p className="text-xs text-muted-foreground">
                      멘토단이 질문을 확인 중입니다. 해결 팁이 있다면 첫 답변을 남겨보세요!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {activeQuestion.answers.map((ans, idx) => {
                      const isMentor = ans.role === "멘토" || ans.role === "강사";

                      return (
                        <div
                          key={idx}
                          className={`rounded-xl border p-4 space-y-2.5 transition-all ${
                            isMentor
                              ? "border-primary/30 bg-primary/[0.03] dark:bg-primary/[0.06]"
                              : "border-border/70 bg-muted/20"
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <div
                                className={`size-6 rounded-full font-bold text-[11px] flex items-center justify-center ${
                                  isMentor
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted-foreground/20 text-foreground"
                                }`}
                              >
                                {ans.author.slice(0, 1)}
                              </div>
                              <span className="font-bold text-foreground tracking-tight">
                                {ans.author}
                              </span>

                              {isMentor ? (
                                <Badge className="text-[10px] px-2 py-0.2 bg-primary/15 text-primary border-primary/30 gap-1 font-medium">
                                  <ShieldCheck className="size-3" />
                                  공인 {ans.role}
                                </Badge>
                              ) : (
                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0.2">
                                  {ans.role}
                                </Badge>
                              )}
                            </div>

                            <span className="text-[11px] text-muted-foreground font-mono">
                              {ans.createdAt}
                            </span>
                          </div>

                          <p className="text-xs sm:text-[13.5px] text-foreground/90 leading-[1.78] tracking-[-0.01em] whitespace-pre-wrap pl-8">
                            {ans.content}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleAddReply} className="pt-2 space-y-2.5">
                <label className="text-xs font-bold text-foreground tracking-tight flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-primary" />
                  답변 또는 해결 팁 작성
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="오류 해결 방법이나 추가 조치 사항을 작성해 주세요..."
                    className="text-xs h-9 tracking-tight"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="gap-1.5 shrink-0 text-xs font-semibold h-9">
                    <Send className="size-3" /> 등록
                  </Button>
                </div>
              </form>

              <DialogFooter className="pt-2 border-t">
                <DialogClose render={<Button variant="outline" size="sm" className="text-xs h-8" />}>
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
