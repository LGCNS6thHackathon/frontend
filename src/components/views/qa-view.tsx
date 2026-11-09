"use client";

import * as React from "react";
import {
  Code2,
  MessageSquare,
  Plus,
  Search,
  Send,
  User,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { INITIAL_QNA, QnaItem } from "@/lib/lms-data";

export function QaView() {
  const [qnaList, setQnaList] = React.useState<QnaItem[]>(INITIAL_QNA);
  const [selectedTag, setSelectedTag] = React.useState<string>("전체");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [activeQuestion, setActiveQuestion] = React.useState<QnaItem | null>(null);

  // New question modal form state
  const [isNewModalOpen, setIsNewModalOpen] = React.useState(false);
  const [newTitle, setNewTitle] = React.useState("");
  const [newCategory, setNewCategory] = React.useState<QnaItem["category"]>("Next.js");
  const [newContent, setNewContent] = React.useState("");
  const [newSnippet, setNewSnippet] = React.useState("");

  // New reply input state
  const [replyText, setReplyText] = React.useState("");

  const tags = ["전체", "Next.js", "React", "AWS", "FastAPI", "일반"];

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

    const updated = {
      ...activeQuestion,
      status: "답변완료" as const,
      answers: [
        ...activeQuestion.answers,
        {
          author: "윤창일",
          role: "수강생" as const,
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
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Create Action */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            {/* Tag Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              {tags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedTag === tag
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>

            {/* Actions: Search & Ask Question */}
            <div className="flex items-center gap-2">
              <div className="relative w-full sm:w-56">
                <Search className="absolute left-2.5 top-2.5 size-3.5 text-muted-foreground pointer-events-none" />
                <Input
                  placeholder="질문 검색..."
                  className="pl-8 text-xs h-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Ask Question Dialog */}
              <Dialog open={isNewModalOpen} onOpenChange={setIsNewModalOpen}>
                <DialogTrigger
                  render={
                    <Button size="sm" className="h-8 gap-1.5 text-xs shrink-0 shadow-sm">
                      <Plus className="size-3.5" /> 질문 작성
                    </Button>
                  }
                />
                <DialogContent className="sm:max-w-lg">
                  <form onSubmit={handleAddQuestion} className="space-y-4">
                    <DialogHeader>
                      <DialogTitle className="text-base font-bold">새 학습 질문 등록</DialogTitle>
                      <DialogDescription className="text-xs">
                        실습 중 마주친 오류나 궁금한 점을 구체적으로 질문하세요.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-3 py-2 text-xs">
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2 space-y-1">
                          <label className="font-semibold">제목 *</label>
                          <Input
                            placeholder="예: Next.js 15 Turbopack 빌드 에러"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-semibold">카테고리</label>
                          <select
                            className="w-full h-8 rounded-lg border bg-transparent px-2 text-xs outline-none"
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

                      <div className="space-y-1">
                        <label className="font-semibold">질문 내용 *</label>
                        <textarea
                          className="w-full min-h-[90px] rounded-lg border bg-transparent p-2.5 text-xs outline-none focus:ring-2 focus:ring-ring"
                          placeholder="발생한 에러 현상과 시도해 본 방법을 적어주세요."
                          value={newContent}
                          onChange={(e) => setNewContent(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-semibold flex items-center gap-1">
                          <Code2 className="size-3.5" /> 관련 코드 / 에러 로그 (선택)
                        </label>
                        <textarea
                          className="w-full min-h-[70px] font-mono rounded-lg border bg-muted/40 p-2.5 text-[11px] outline-none"
                          placeholder="// 코드 또는 터미널 에러 로그를 붙여넣으세요"
                          value={newSnippet}
                          onChange={(e) => setNewSnippet(e.target.value)}
                        />
                      </div>
                    </div>

                    <DialogFooter className="flex justify-end gap-2">
                      <Button type="button" variant="outline" size="sm" onClick={() => setIsNewModalOpen(false)}>
                        취소
                      </Button>
                      <Button type="submit" size="sm">
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
          <Card>
            <CardContent className="h-32 flex items-center justify-center text-xs text-muted-foreground">
              등록된 질문이 없습니다. 첫 질문을 남겨보세요!
            </CardContent>
          </Card>
        ) : (
          filteredQna.map((q) => (
            <Card
              key={q.id}
              onClick={() => setActiveQuestion(q)}
              className="hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer group"
            >
              <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-[10px]">
                        #{q.category}
                      </Badge>
                      <Badge
                        variant={q.status === "답변완료" ? "default" : "secondary"}
                        className={`text-[10px] ${q.status === "답변완료" ? "bg-emerald-600 text-white" : "bg-amber-500/10 text-amber-600"}`}
                      >
                        {q.status}
                      </Badge>
                      <span className="text-[11px] text-muted-foreground">{q.createdAt}</span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                      {q.title}
                    </h3>

                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {q.content}
                    </p>
                  </div>

                  {/* Right metadata badge */}
                  <div className="flex flex-col items-end gap-1.5 text-right shrink-0">
                    <span className="text-xs font-semibold text-foreground flex items-center gap-1">
                      <User className="size-3 text-muted-foreground" /> {q.author}
                    </span>
                    <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <MessageSquare className="size-3" /> 답변 {q.answers.length}개
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Question Detail & Reply Dialog */}
      <Dialog open={!!activeQuestion} onOpenChange={(open) => !open && setActiveQuestion(null)}>
        <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto">
          {activeQuestion && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{activeQuestion.category}</Badge>
                  <Badge
                    variant={activeQuestion.status === "답변완료" ? "default" : "secondary"}
                    className={activeQuestion.status === "답변완료" ? "bg-emerald-600 text-white" : ""}
                  >
                    {activeQuestion.status}
                  </Badge>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold pt-1 leading-snug">
                  {activeQuestion.title}
                </DialogTitle>
                <DialogDescription className="text-xs flex items-center gap-3 pt-0.5">
                  <span>작성자: <b>{activeQuestion.author}</b></span>
                  <span>등록일: {activeQuestion.createdAt}</span>
                </DialogDescription>
              </DialogHeader>

              {/* Question Body */}
              <div className="text-xs sm:text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap py-2">
                {activeQuestion.content}
              </div>

              {/* Code Snippet if present */}
              {activeQuestion.codeSnippet && (
                <div className="rounded-lg bg-zinc-950 p-3 text-zinc-100 font-mono text-xs overflow-x-auto border border-zinc-800">
                  <pre>{activeQuestion.codeSnippet}</pre>
                </div>
              )}

              <Separator />

              {/* Answers Feed */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5">
                  <MessageSquare className="size-3.5 text-primary" />
                  멘토 및 동료 답변 ({activeQuestion.answers.length})
                </h4>

                {activeQuestion.answers.length === 0 ? (
                  <p className="text-xs text-muted-foreground p-3 rounded-lg bg-muted/30">
                    아직 등록된 답변이 없습니다. 멘토단이 확인 후 신속히 답변을 드릴 예정입니다.
                  </p>
                ) : (
                  activeQuestion.answers.map((ans, idx) => (
                    <div key={idx} className="rounded-xl border bg-muted/30 p-3 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-foreground">{ans.author}</span>
                          <Badge
                            variant={ans.role === "멘토" ? "default" : "secondary"}
                            className="text-[9px] px-1.5 py-0"
                          >
                            {ans.role}
                          </Badge>
                        </div>
                        <span className="text-[10px] text-muted-foreground">{ans.createdAt}</span>
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
                        {ans.content}
                      </p>
                    </div>
                  ))
                )}
              </div>

              {/* Reply Form */}
              <form onSubmit={handleAddReply} className="pt-2 space-y-2">
                <label className="text-xs font-semibold text-foreground">답변 또는 의견 작성</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="해결 팁이나 추가 질문을 남겨보세요..."
                    className="text-xs h-9"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                  <Button type="submit" size="sm" className="gap-1 shrink-0">
                    <Send className="size-3" /> 등록
                  </Button>
                </div>
              </form>

              <DialogFooter className="pt-2">
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
