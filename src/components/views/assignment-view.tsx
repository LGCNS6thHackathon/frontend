"use client";

import * as React from "react";
import {
  CheckCircle2,
  Clock,
  FileCode,
  FolderGit2,
  MessageSquare,
  Send,
  UploadCloud,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { INITIAL_ASSIGNMENTS, AssignmentItem } from "@/lib/lms-data";

export function AssignmentView() {
  const [assignments, setAssignments] = React.useState<AssignmentItem[]>(INITIAL_ASSIGNMENTS);
  const [statusFilter, setStatusFilter] = React.useState<string>("전체");
  const [activeSubmitModal, setActiveSubmitModal] = React.useState<AssignmentItem | null>(null);

  // Submit form state
  const [repoUrl, setRepoUrl] = React.useState("");
  const [submitMemo, setSubmitMemo] = React.useState("");

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModal || !repoUrl.trim()) return;

    const updated = assignments.map((item) => {
      if (item.id === activeSubmitModal.id) {
        return {
          ...item,
          status: "제출완료" as const,
          dDay: "제출완료",
          submissionDate: new Date().toISOString().replace("T", " ").slice(0, 16),
          feedback: {
            mentor: "자동 검증 봇",
            score: "검수 대기중",
            comment: "GitHub Repository 연결이 확인되었습니다. 멘토가 코드를 리뷰한 후 최종 점수가 부여됩니다.",
          },
        };
      }
      return item;
    });

    setAssignments(updated);
    setActiveSubmitModal(null);
    setRepoUrl("");
    setSubmitMemo("");
    alert("과제 제출이 정상 완료되었습니다!");
  };

  const filtered = assignments.filter((a) => {
    if (statusFilter === "전체") return true;
    return a.status === statusFilter;
  });

  return (
    <div className="space-y-6">
      {/* Filter Tabs Header */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5">
            {["전체", "미제출", "제출완료"].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  statusFilter === tab
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <span className="text-xs text-muted-foreground">
            총 {assignments.length}개 과제 중 {filtered.length}개 표시
          </span>
        </CardContent>
      </Card>

      {/* Assignment Cards */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader className="pb-3 border-b bg-card/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-[10px]">
                      {item.subject}
                    </Badge>
                    <Badge
                      variant={
                        item.status === "제출완료"
                          ? "default"
                          : item.dDay === "오늘 마감"
                          ? "destructive"
                          : "secondary"
                      }
                      className="text-[10px]"
                    >
                      {item.dDay}
                    </Badge>
                  </div>
                  <CardTitle className="text-base sm:text-lg font-bold text-foreground">
                    {item.title}
                  </CardTitle>
                </div>

                <div className="flex items-center gap-2 text-xs text-muted-foreground shrink-0">
                  <Clock className="size-3.5" />
                  <span>마감: <b>{item.dueDate}</b></span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              <div className="space-y-1">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  과제 안내 및 요구사항
                </p>
                <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Feedback Box (If submitted and graded) */}
              {item.feedback && (
                <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <MessageSquare className="size-3.5 text-primary" />
                      멘토 피드백 및 채점 결과 ({item.feedback.mentor})
                    </span>
                    <Badge variant="outline" className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      점수: {item.feedback.score}
                    </Badge>
                  </div>
                  <p className="text-xs text-foreground/90 leading-relaxed pl-5">
                    &ldquo;{item.feedback.comment}&rdquo;
                  </p>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 border-t bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-muted-foreground">
                {item.submissionDate ? (
                  <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="size-3.5" /> 최종 제출일: {item.submissionDate}
                  </span>
                ) : (
                  <span>담당 강사: {item.author}</span>
                )}
              </span>

              <div className="flex gap-2 w-full sm:w-auto">
                {item.status === "미제출" ? (
                  <Button
                    size="sm"
                    className="w-full sm:w-auto gap-1.5 text-xs h-8"
                    onClick={() => setActiveSubmitModal(item)}
                  >
                    <UploadCloud className="size-3.5" />
                    과제 제출하기
                  </Button>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto gap-1.5 text-xs h-8"
                    onClick={() => setActiveSubmitModal(item)}
                  >
                    <FileCode className="size-3.5" />
                    제출물 수정 / 재제출
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {/* Submit Assignment Dialog Modal */}
      <Dialog open={!!activeSubmitModal} onOpenChange={(open) => !open && setActiveSubmitModal(null)}>
        <DialogContent className="sm:max-w-md">
          {activeSubmitModal && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <DialogHeader>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{activeSubmitModal.subject}</Badge>
                  <span className="text-xs text-muted-foreground">{activeSubmitModal.dDay}</span>
                </div>
                <DialogTitle className="text-base font-bold pt-1">
                  과제 제출: {activeSubmitModal.title}
                </DialogTitle>
                <DialogDescription className="text-xs">
                  마감 기한: {activeSubmitModal.dueDate}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 py-2 text-xs">
                <div className="space-y-1">
                  <label className="font-semibold flex items-center gap-1">
                    <FolderGit2 className="size-3.5" /> GitHub Repository URL *
                  </label>
                  <Input
                    placeholder="https://github.com/username/project-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold">제출 비고 및 메모</label>
                  <textarea
                    className="w-full min-h-[70px] rounded-lg border bg-transparent p-2 text-xs outline-none"
                    placeholder="배포 URL 또는 멘토에게 전달할 특이사항이 있다면 적어주세요."
                    value={submitMemo}
                    onChange={(e) => setSubmitMemo(e.target.value)}
                  />
                </div>

                {/* Drag and Drop Box Simulation */}
                <div className="rounded-xl border-2 border-dashed p-4 text-center space-y-1 bg-muted/20">
                  <UploadCloud className="size-6 text-muted-foreground mx-auto" />
                  <p className="text-xs font-medium text-foreground">
                    추가 산출물 압축파일(ZIP) 업로드
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    최대 50MB 파일 업로드 가능
                  </p>
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setActiveSubmitModal(null)}>
                  취소
                </Button>
                <Button type="submit" size="sm" className="gap-1">
                  <Send className="size-3" /> 최종 제출
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
