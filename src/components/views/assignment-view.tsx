"use client";

import * as React from "react";
import {
  AlertCircle,
  CalendarCheck2,
  CheckCircle2,
  Clock,
  FileArchive,
  FileCode,
  FolderGit2,
  Globe,
  MessageSquare,
  Send,
  Sparkles,
  UploadCloud,
  User,
  X,
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
  const [deployUrl, setDeployUrl] = React.useState("");
  const [submitMemo, setSubmitMemo] = React.useState("");
  const [selectedFile, setSelectedFile] = React.useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmitModal || !repoUrl.trim()) return;

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
      now.getDate()
    ).padStart(2, "0")} ${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(
      2,
      "0"
    )}`;

    const updated = assignments.map((item) => {
      if (item.id === activeSubmitModal.id) {
        return {
          ...item,
          status: "제출완료" as const,
          dDay: "제출완료",
          submissionDate: formattedDate,
          feedback: {
            mentor: "자동 검증 봇 & 멘토단",
            score: "검수 대기중",
            comment:
              "GitHub Repository 및 제출 산출물이 정상 등록되었습니다. 멘토가 코드를 리뷰한 후 상세 피드백과 점수를 업데이트합니다.",
          },
        };
      }
      return item;
    });

    setAssignments(updated);
    setActiveSubmitModal(null);
    setRepoUrl("");
    setDeployUrl("");
    setSubmitMemo("");
    setSelectedFile(null);
    alert("과제 제출이 정상 접수되었습니다!");
  };

  const filtered = assignments.filter((a) => {
    if (statusFilter === "전체") return true;
    return a.status === statusFilter;
  });

  const submittedCount = assignments.filter((a) => a.status === "제출완료").length;
  const completionRate = Math.round((submittedCount / assignments.length) * 100);

  return (
    <div className="space-y-6">
      {/* Filter Tabs & Progress Bar Header */}
      <Card className="border-border/70 shadow-xs">
        <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1.5">
            {["전체", "미제출", "제출완료"].map((tab) => {
              const count =
                tab === "전체"
                  ? assignments.length
                  : assignments.filter((a) => a.status === tab).length;
              const isSelected = statusFilter === tab;

              return (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all inline-flex items-center gap-1.5 ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold shadow-xs"
                      : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-border/40"
                  }`}
                >
                  <span>{tab}</span>
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

          {/* Progress Summary */}
          <div className="flex items-center gap-3">
            <div className="space-y-1 text-right">
              <div className="text-xs font-semibold text-foreground tracking-tight flex items-center justify-end gap-1.5">
                <Sparkles className="size-3 text-primary" />
                <span>과제 달성률 {completionRate}%</span>
                <span className="text-muted-foreground font-mono text-[11px]">
                  ({submittedCount}/{assignments.length}건)
                </span>
              </div>
              <div className="h-1.5 w-36 bg-muted rounded-full overflow-hidden ml-auto">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assignment Cards List */}
      <div className="space-y-4">
        {filtered.map((item) => {
          const isSubmitted = item.status === "제출완료";
          const isDueToday = item.dDay === "오늘 마감";

          return (
            <Card
              key={item.id}
              className="overflow-hidden hover:border-primary/40 hover:shadow-sm transition-all border-border/70"
            >
              {/* Card Header */}
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/60 bg-muted/15">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      {/* Subject Pill */}
                      <span className="font-mono text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                        {item.subject}
                      </span>

                      {/* D-Day / Status Pill */}
                      <span
                        className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                          isSubmitted
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200/80 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
                            : isDueToday
                            ? "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800 font-semibold"
                            : "bg-amber-50 text-amber-700 border border-amber-200/80 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800"
                        }`}
                      >
                        {isSubmitted ? (
                          <CheckCircle2 className="size-3 text-emerald-600 dark:text-emerald-400" />
                        ) : isDueToday ? (
                          <AlertCircle className="size-3 text-rose-600 dark:text-rose-400" />
                        ) : (
                          <Clock className="size-3 text-amber-600 dark:text-amber-400" />
                        )}
                        <span>{item.dDay}</span>
                      </span>
                    </div>

                    <CardTitle className="text-base sm:text-lg font-bold text-foreground tracking-tight leading-snug">
                      {item.title}
                    </CardTitle>
                  </div>

                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono shrink-0 bg-background/80 px-2.5 py-1 rounded-md border border-border/50">
                    <Clock className="size-3.5 text-muted-foreground" />
                    <span>마감: <b>{item.dueDate}</b></span>
                  </div>
                </div>
              </CardHeader>

              {/* Card Body */}
              <CardContent className="p-4 sm:p-5 space-y-4">
                {/* Requirements Box */}
                <div className="space-y-1.5">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-tight flex items-center gap-1.5">
                    <FileCode className="size-3.5 text-primary" />
                    과제 안내 및 요구사항
                  </p>
                  <div className="text-xs sm:text-[13.5px] text-foreground/85 leading-[1.78] tracking-[-0.01em] bg-muted/20 p-4 rounded-xl border border-border/50 whitespace-pre-wrap">
                    {item.description}
                  </div>
                </div>

                {/* Feedback Box (If submitted and evaluated) */}
                {item.feedback && (
                  <div className="rounded-xl border border-primary/25 bg-primary/[0.03] dark:bg-primary/[0.06] p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <div className="size-6 rounded-full bg-primary text-primary-foreground font-bold text-[11px] flex items-center justify-center">
                          {item.feedback.mentor.slice(0, 1)}
                        </div>
                        <span className="font-bold text-foreground tracking-tight">
                          {item.feedback.mentor}
                        </span>
                        <Badge className="text-[10px] px-2 py-0 bg-primary/15 text-primary border-primary/30">
                          피드백 완료
                        </Badge>
                      </div>

                      <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                        점수: {item.feedback.score}
                      </span>
                    </div>

                    <p className="text-xs sm:text-[13px] text-foreground/90 leading-[1.75] tracking-[-0.01em] pl-8 border-l-2 border-primary/40 italic">
                      &ldquo;{item.feedback.comment}&rdquo;
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Card Footer */}
              <CardFooter className="p-4 sm:p-5 border-t border-border/60 bg-muted/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <div className="text-muted-foreground flex items-center gap-1.5 w-full sm:w-auto">
                  {item.submissionDate ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-medium inline-flex items-center gap-1.5 font-mono">
                      <CalendarCheck2 className="size-3.5" />
                      최종 제출: {item.submissionDate}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5">
                      <User className="size-3.5 text-muted-foreground" />
                      담당 강사: {item.author}
                    </span>
                  )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto justify-end">
                  {!isSubmitted ? (
                    <Button
                      size="sm"
                      className="w-full sm:w-auto gap-1.5 text-xs h-8.5 font-semibold shadow-xs"
                      onClick={() => setActiveSubmitModal(item)}
                    >
                      <UploadCloud className="size-3.5" />
                      과제 제출하기
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full sm:w-auto gap-1.5 text-xs h-8.5 font-medium"
                      onClick={() => setActiveSubmitModal(item)}
                    >
                      <FileCode className="size-3.5 text-primary" />
                      제출물 수정 / 재제출
                    </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Submit Assignment Dialog Modal */}
      <Dialog open={!!activeSubmitModal} onOpenChange={(open) => !open && setActiveSubmitModal(null)}>
        <DialogContent className="sm:max-w-lg">
          {activeSubmitModal && (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <DialogHeader className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700">
                    {activeSubmitModal.subject}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">
                    마감: {activeSubmitModal.dueDate}
                  </span>
                </div>
                <DialogTitle className="text-base sm:text-lg font-bold tracking-tight">
                  과제 제출: {activeSubmitModal.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
                  완성된 저장소 주소와 빌드 산출물을 업로드하면 멘토단 코드 리뷰가 시작됩니다.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3.5 py-2 text-xs">
                {/* Repo URL */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                    <FolderGit2 className="size-3.5 text-primary" /> GitHub Repository URL *
                  </label>
                  <Input
                    placeholder="https://github.com/inspire-camp/my-project"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    className="text-xs h-9 tracking-tight font-mono"
                    required
                  />
                </div>

                {/* Deployment URL */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                    <Globe className="size-3.5 text-primary" /> 실서비스 배포 URL (선택)
                  </label>
                  <Input
                    placeholder="https://my-service.vercel.app 또는 AWS CloudFront 도메인"
                    value={deployUrl}
                    onChange={(e) => setDeployUrl(e.target.value)}
                    className="text-xs h-9 tracking-tight font-mono"
                  />
                </div>

                {/* Memo */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                    <MessageSquare className="size-3.5 text-primary" /> 제출 비고 및 메모
                  </label>
                  <textarea
                    className="w-full min-h-[75px] rounded-lg border border-input bg-transparent p-3 text-xs leading-[1.65] tracking-tight outline-none focus:border-ring transition-colors"
                    placeholder="핵심 구현 기능, 테스트 계정, 또는 멘토에게 전하고 싶은 내용을 자유롭게 작성해 주세요."
                    value={submitMemo}
                    onChange={(e) => setSubmitMemo(e.target.value)}
                  />
                </div>

                {/* File Upload Simulator */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-foreground tracking-tight flex items-center gap-1.5">
                    <UploadCloud className="size-3.5 text-primary" /> 추가 첨부 파일 (ZIP, 보고서 PDF)
                  </label>

                  {selectedFile ? (
                    <div className="flex items-center justify-between p-3 rounded-xl border border-primary/30 bg-primary/[0.04]">
                      <div className="flex items-center gap-2">
                        <FileArchive className="size-4 text-primary" />
                        <span className="font-mono text-xs font-medium text-foreground">
                          {selectedFile}
                        </span>
                        <span className="text-[11px] text-muted-foreground font-mono">(14.8 MB)</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedFile(null)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="size-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => setSelectedFile("project_source_v1.0.zip")}
                      className="rounded-xl border-2 border-dashed border-border/80 hover:border-primary/50 p-4 text-center space-y-1 bg-muted/20 cursor-pointer transition-colors"
                    >
                      <UploadCloud className="size-6 text-muted-foreground mx-auto" />
                      <p className="text-xs font-semibold text-foreground tracking-tight">
                        클릭하여 산출물 파일 업로드 (시뮬레이션)
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        최대 50MB (ZIP, TAR.GZ, PDF 문서 지원)
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <DialogFooter className="flex justify-end gap-2 pt-2 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="text-xs h-8.5"
                  onClick={() => setActiveSubmitModal(null)}
                >
                  취소
                </Button>
                <Button type="submit" size="sm" className="gap-1.5 text-xs h-8.5 font-semibold">
                  <Send className="size-3" /> 최종 제출 완료
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
