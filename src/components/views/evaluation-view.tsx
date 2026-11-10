"use client";

import * as React from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Bookmark,
  CheckCircle2,
  Clock,
  Filter,
  List,
  Play,
  Printer,
  Send,
  Sparkles,
  TrendingUp,
  XCircle,
} from "lucide-react";

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
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  EvaluationItem,
  EvaluationMeta,
  EvaluationQuestion,
  INITIAL_EVALUATIONS,
  INITIAL_EXAM_QUESTIONS,
  PAST_EXAM_FEEDBACK_QUESTIONS,
  WSTS_EVALUATIONS,
} from "@/lib/lms-data";

interface EvaluationViewProps {
  onNavigate?: (tab: string) => void;
}

export function EvaluationView({ onNavigate }: EvaluationViewProps) {
  // Navigation View Modes: "list" (Hub) | "exam" (Taking exam) | "review" (Problem Solving Feedback) | "report" (Radar Report)
  const [viewMode, setViewMode] = React.useState<"list" | "exam" | "review" | "report">("list");
  const [selectedExam, setSelectedExam] = React.useState<EvaluationMeta>(WSTS_EVALUATIONS[0]);

  // Exam Taking State
  const [examQuestions, setExamQuestions] = React.useState<EvaluationQuestion[]>(INITIAL_EXAM_QUESTIONS);
  const [currentQuestionIdx, setCurrentQuestionIdx] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<number, number>>({});
  const [bookmarkedIds, setBookmarkedIds] = React.useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = React.useState<number>(40 * 60); // 40 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = React.useState<boolean>(false);
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState<boolean>(false);
  const [isExitDialogOpen, setIsExitDialogOpen] = React.useState<boolean>(false);
  const [autoSaveToast, setAutoSaveToast] = React.useState<boolean>(false);

  // Review & Feedback State
  const [reviewQuestions, setReviewQuestions] = React.useState<EvaluationQuestion[]>([]);
  const [reviewFilter, setReviewFilter] = React.useState<"all" | "wrong" | "correct" | "bookmarked">("all");
  const [examFinalScore, setExamFinalScore] = React.useState<number | null>(null);
  const [correctCount, setCorrectCount] = React.useState<number>(0);
  const [isResultModalOpen, setIsResultModalOpen] = React.useState<boolean>(false);

  // Report Round Switcher State
  const [activeReportRound, setActiveReportRound] = React.useState<number>(1);
  const reportItem = INITIAL_EVALUATIONS.find((e) => e.id === activeReportRound) || INITIAL_EVALUATIONS[0];

  // Calculate Score & Finalize Submission
  const handleFinalSubmit = React.useCallback(() => {
    setIsSubmitDialogOpen(false);
    setIsTimerRunning(false);

    // Score calculation
    let totalScore = 0;
    let correct = 0;
    const reviewed = examQuestions.map((q) => {
      const userChoice = userAnswers[q.id];
      const isCorrect = userChoice === q.correctIndex;
      if (isCorrect) {
        totalScore += q.points;
        correct += 1;
      }
      return {
        ...q,
        userAnswerIndex: userChoice,
      };
    });

    setCorrectCount(correct);
    setReviewQuestions(reviewed);
    setExamFinalScore(totalScore);
    setIsResultModalOpen(true);
  }, [examQuestions, userAnswers]);

  // ==========================================
  // Timer Effect during Live Exam
  // ==========================================
  React.useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (viewMode === "exam" && isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleFinalSubmit();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [viewMode, isTimerRunning, timeLeft, handleFinalSubmit]);

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // Start Live Exam
  const handleStartExam = (exam: EvaluationMeta) => {
    setSelectedExam(exam);
    setExamQuestions(INITIAL_EXAM_QUESTIONS);
    setUserAnswers({});
    setBookmarkedIds(new Set());
    setCurrentQuestionIdx(0);
    setTimeLeft(40 * 60);
    setIsTimerRunning(true);
    setViewMode("exam");
  };

  // Open Problem Solving Review (WSTS problemSolving/lg06_st33 대응)
  const handleOpenReview = (exam: EvaluationMeta) => {
    setSelectedExam(exam);
    if (exam.id === 1) {
      setReviewQuestions(PAST_EXAM_FEEDBACK_QUESTIONS);
      setExamFinalScore(exam.myScore || 46);
    } else {
      const questionsWithUserAnswers = INITIAL_EXAM_QUESTIONS.map((q) => {
        const userChoice = userAnswers[q.id];
        return {
          ...q,
          userAnswerIndex: userChoice !== undefined ? userChoice : q.correctIndex,
        };
      });
      setReviewQuestions(questionsWithUserAnswers);
      setExamFinalScore(examFinalScore || exam.myScore || 87);
    }
    setReviewFilter("all");
    setViewMode("review");
  };

  // View Radar Diagnostic Report
  const handleOpenReport = (exam?: EvaluationMeta) => {
    if (exam) {
      setSelectedExam(exam);
      if (exam.id === 1) setActiveReportRound(1);
      else if (exam.id >= 2) setActiveReportRound(2);
    }
    setViewMode("report");
  };

  // Handle Option Select during Exam
  const handleSelectOption = (questionId: number, optionIdx: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIdx,
    }));
    setAutoSaveToast(true);
    setTimeout(() => setAutoSaveToast(false), 1200);
  };

  // Toggle Bookmark Flag
  const handleToggleBookmark = (questionId: number) => {
    setBookmarkedIds((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  };

  // Radar chart mathematical coordinates calculator (5 vertices)
  const renderRadarChart = (metrics: EvaluationItem["radarMetrics"]) => {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const total = metrics.length;

    const getPoint = (score: number, index: number, maxScore = 100) => {
      const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
      const r = (score / maxScore) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    };

    const myPoints = metrics
      .map((m, i) => {
        const pt = getPoint(m.myScore, i);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");

    const avgPoints = metrics
      .map((m, i) => {
        const pt = getPoint(m.avgScore, i);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");

    return (
      <svg width={size} height={size} className="mx-auto overflow-visible">
        {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
          const ringPoints = Array.from({ length: total })
            .map((_, i) => {
              const pt = getPoint(100 * scale, i);
              return `${pt.x},${pt.y}`;
            })
            .join(" ");
          return (
            <polygon
              key={sIdx}
              points={ringPoints}
              fill="none"
              stroke="currentColor"
              className="text-muted/40 stroke-dasharray-1"
              strokeWidth="1"
            />
          );
        })}

        {metrics.map((_, i) => {
          const outerPt = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={outerPt.x}
              y2={outerPt.y}
              stroke="currentColor"
              className="text-muted/40"
              strokeWidth="1"
            />
          );
        })}

        <polygon
          points={avgPoints}
          fill="rgba(148, 163, 184, 0.25)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        <polygon
          points={myPoints}
          fill="rgba(99, 102, 241, 0.35)"
          stroke="#6366f1"
          strokeWidth="2.5"
        />

        {metrics.map((m, i) => {
          const myPt = getPoint(m.myScore, i);
          const labelPt = getPoint(125, i);

          return (
            <g key={i}>
              <circle cx={myPt.x} cy={myPt.y} r="4" fill="#6366f1" className="stroke-background stroke-2" />
              <text
                x={labelPt.x}
                y={labelPt.y}
                textAnchor="middle"
                dominantBaseline="central"
                className="text-[10px] font-semibold fill-foreground"
              >
                {m.subject.split(" ")[0]} ({m.myScore}점)
              </text>
            </g>
          );
        })}
      </svg>
    );
  };

  // Keyboard shortcut listener during exam (1, 2, 3, 4 keys)
  React.useEffect(() => {
    if (viewMode !== "exam") return;
    const currentQ = examQuestions[currentQuestionIdx];
    if (!currentQ) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (["1", "2", "3", "4"].includes(e.key)) {
        const optionIdx = parseInt(e.key, 10) - 1;
        handleSelectOption(currentQ.id, optionIdx);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [viewMode, currentQuestionIdx, examQuestions]);

  // Current question in exam mode
  const currentQ = examQuestions[currentQuestionIdx];
  const answeredCount = Object.keys(userAnswers).length;
  const examProgress = Math.round((answeredCount / examQuestions.length) * 100);

  // Filtered questions in review mode
  const filteredReviewQuestions = reviewQuestions.filter((q) => {
    const isCorrect = q.userAnswerIndex === q.correctIndex;
    if (reviewFilter === "wrong") return !isCorrect;
    if (reviewFilter === "correct") return isCorrect;
    if (reviewFilter === "bookmarked") return bookmarkedIds.has(q.id);
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Universal Mode Switcher & Breadcrumbs Bar */}
      <Card className="border-border/60 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start sm:items-center gap-3">
              <div className="size-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5 sm:mt-0">
                <BarChart3 className="size-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-base sm:text-lg font-bold text-foreground tracking-tight">
                    역량평가 포털
                  </h2>
                  <Badge
                    variant="outline"
                    className="text-[10.5px] font-semibold border-indigo-200 text-indigo-600 dark:border-indigo-900 dark:text-indigo-400 tracking-tight"
                  >
                    WSTS 공식 연동
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed tracking-[-0.01em] break-keep">
                  평가 목록 조회부터 실전 문제풀이 시험 응시, 오답노트 해설 리뷰, 종합 역량 리포트까지 원스톱으로 관리합니다.
                </p>
              </div>
            </div>

            {/* Navigation Tabs (목록 / 문제풀이 / 리포트) */}
            <div className="flex items-center rounded-lg bg-muted p-1 border border-border/40 shrink-0 self-start sm:self-auto">
              <button
                onClick={() => setViewMode("list")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "list"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <List className="size-3.5" />
                <span>평가 목록</span>
              </button>

              <button
                onClick={() => {
                  if (reviewQuestions.length === 0) {
                    handleOpenReview(WSTS_EVALUATIONS[0]);
                  } else {
                    setViewMode("review");
                  }
                }}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "review"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <CheckCircle2 className="size-3.5" />
                <span>문제풀이 (오답노트)</span>
              </button>

              <button
                onClick={() => setViewMode("report")}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                  viewMode === "report"
                    ? "bg-background text-primary shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Award className="size-3.5" />
                <span>종합 리포트</span>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================================================= */}
      {/* MODE 1: EVALUATION HUB LIST VIEW (역량평가 목록) */}
      {/* ========================================================================= */}
      {viewMode === "list" && (
        <div className="space-y-6">
          {/* Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="border-border/60 shadow-xs bg-card">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                    누적 평가 응시
                  </span>
                  <p className="text-2xl font-black text-foreground font-mono tracking-tight">
                    4회 완료{" "}
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-bold font-sans">
                      (1회 응시 대기)
                    </span>
                  </p>
                </div>
                <div className="size-11 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                  <CheckCircle2 className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                    최고 득점 (2차 사후)
                  </span>
                  <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono tracking-tight">
                    93점{" "}
                    <span className="text-xs text-muted-foreground font-normal font-sans">
                      / 100점
                    </span>
                  </p>
                </div>
                <div className="size-11 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                  <Award className="size-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-xs bg-card">
              <CardContent className="p-4 sm:p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-[11.5px] font-semibold text-muted-foreground uppercase tracking-wider">
                    성장률 (사전 → 사후)
                  </span>
                  <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 font-mono tracking-tight">
                    +39점{" "}
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-bold font-sans">
                      ▲ 84.7%
                    </span>
                  </p>
                </div>
                <div className="size-11 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <TrendingUp className="size-5" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Evaluations Grid List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 tracking-tight">
                <List className="size-4 text-primary" />
                LG CNS AM Inspire Camp 6기 역량평가 차수 목록
              </h3>
              <span className="text-xs text-muted-foreground font-mono">
                총 {WSTS_EVALUATIONS.length}개 평가
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WSTS_EVALUATIONS.map((exam) => {
                const isAvailable = exam.status === "응시 가능";
                return (
                  <Card
                    key={exam.id}
                    className={`transition-all rounded-xl border ${
                      isAvailable
                        ? "border-indigo-500 bg-gradient-to-br from-indigo-50/40 via-background to-purple-50/30 dark:from-indigo-950/30 dark:via-background dark:to-purple-950/20 shadow-md ring-1 ring-indigo-500/50"
                        : "border-border/70 hover:border-border hover:shadow-xs bg-card"
                    }`}
                  >
                    <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/50">
                      <div className="flex items-center justify-between gap-2">
                        <Badge
                          variant={isAvailable ? "default" : "outline"}
                          className={`text-[10px] font-bold ${
                            isAvailable
                              ? "bg-indigo-600 text-white"
                              : "border-border text-muted-foreground"
                          }`}
                        >
                          {exam.status}
                        </Badge>
                        <span className="text-[11px] text-muted-foreground font-mono">
                          {exam.testDate}
                        </span>
                      </div>
                      <CardTitle className="text-[15px] sm:text-base font-bold text-foreground tracking-tight pt-1 leading-snug">
                        {exam.round}
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground font-medium leading-normal">
                        {exam.course}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="p-4 sm:p-5 space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block font-medium">시험 구성</span>
                          <span className="font-semibold text-foreground font-mono text-xs">
                            {exam.questionCount}문항 / {exam.timeLimit}
                          </span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-muted/30 border border-border/40">
                          <span className="text-[10px] text-muted-foreground block font-medium">
                            {isAvailable ? "응시 기회" : "내 점수 / 반 평균"}
                          </span>
                          {isAvailable ? (
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 text-xs">
                              1회 응시 가능
                            </span>
                          ) : (
                            <span className="font-mono font-bold text-foreground">
                              <span className="text-indigo-600 dark:text-indigo-400 text-sm">
                                {exam.myScore}점
                              </span>{" "}
                              <span className="text-xs text-muted-foreground font-normal">
                                / {exam.avgScore}점
                              </span>
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Performance Bar (for completed exams) */}
                      {!isAvailable && exam.myScore && exam.avgScore && (
                        <div className="space-y-1.5 pt-0.5">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-muted-foreground">반 평균 대비</span>
                            <span
                              className={`font-semibold font-mono ${
                                exam.myScore >= exam.avgScore
                                  ? "text-emerald-600 dark:text-emerald-400"
                                  : "text-amber-600 dark:text-amber-400"
                              }`}
                            >
                              {exam.myScore >= exam.avgScore ? "+" : ""}
                              {exam.myScore - exam.avgScore}점
                            </span>
                          </div>
                          <Progress
                            value={exam.myScore}
                            className="h-1.5 bg-muted"
                          />
                        </div>
                      )}
                    </CardContent>

                    <CardFooter className="p-4 sm:p-5 pt-0 flex items-center justify-between gap-2.5 border-t border-border/40 mt-1">
                      {isAvailable ? (
                        <Button
                          onClick={() => handleStartExam(exam)}
                          className="w-full text-xs font-bold gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-xs h-9"
                        >
                          <Play className="size-3.5 fill-white" />
                          실전 문제풀이 시험 응시하기 🚀
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenReview(exam)}
                            className="w-1/2 text-xs font-semibold gap-1.5 hover:border-primary hover:text-primary cursor-pointer h-8.5"
                          >
                            <CheckCircle2 className="size-3.5 text-primary" />
                            문제풀이 (오답노트)
                          </Button>
                          <Button
                            variant="default"
                            size="sm"
                            onClick={() => handleOpenReport(exam)}
                            className="w-1/2 text-xs font-semibold gap-1.5 bg-slate-900 dark:bg-slate-800 text-white hover:bg-slate-800 cursor-pointer h-8.5"
                          >
                            <BarChart3 className="size-3.5" />
                            성적 리포트
                          </Button>
                        </>
                      )}
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: LIVE PROBLEM SOLVING EXAM ROOM (실전 시험 응시) */}
      {/* ========================================================================= */}
      {viewMode === "exam" && currentQ && (
        <div className="space-y-4">
          {/* Top Exam Status Bar */}
          <Card className="border-indigo-500/40 bg-indigo-50/30 dark:bg-indigo-950/20 shadow-xs">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                    onClick={() => setIsExitDialogOpen(true)}
                  >
                    <ArrowLeft className="size-3.5" /> 나가기
                  </Button>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2 tracking-tight">
                      {selectedExam.round} - {selectedExam.course}
                      <Badge className="bg-emerald-600 text-white text-[10px] font-bold">
                        응시 진행 중
                      </Badge>
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5 tracking-[-0.01em]">
                      응시자: <b>윤창일 (lg06_st33)</b> • 총 {examQuestions.length}문항 • 키보드 1~4번 키로 답안 선택 가능
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Timer Display */}
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-background border border-border/80 shadow-2xs font-mono">
                    <Clock className="size-4 text-rose-500 animate-pulse" />
                    <span className="text-xs text-muted-foreground">남은 시간:</span>
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400">
                      {formatTime(timeLeft)}
                    </span>
                  </div>

                  {/* Submit Button */}
                  <Button
                    size="sm"
                    onClick={() => setIsSubmitDialogOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs gap-1.5 shadow-xs cursor-pointer h-9"
                  >
                    <Send className="size-3.5" />
                    최종 답안 제출
                  </Button>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mt-3.5 space-y-1.5">
                <div className="flex justify-between text-[11.5px] text-muted-foreground font-mono">
                  <span>진행률: {answeredCount} / {examQuestions.length}문항 완료</span>
                  <span className="font-bold text-primary">{examProgress}%</span>
                </div>
                <Progress value={examProgress} className="h-1.5" />
              </div>
            </CardContent>
          </Card>

          {/* Main Question + Navigator Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Left 3 cols: Question Body & Options */}
            <div className="lg:col-span-3 space-y-4">
              <Card className="border-border/70 shadow-xs">
                <CardHeader className="p-4 sm:p-6 border-b border-border/60">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono font-bold border-primary text-primary">
                        문제 {currentQuestionIdx + 1}
                      </Badge>
                      <Badge variant="secondary" className="text-[10px]">
                        {currentQ.category}
                      </Badge>
                      <Badge variant="outline" className="text-[10px] text-muted-foreground font-mono">
                        배점 {currentQ.points}점
                      </Badge>
                    </div>

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={() => handleToggleBookmark(currentQ.id)}
                      className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer font-medium ${
                        bookmarkedIds.has(currentQ.id)
                          ? "bg-amber-50 text-amber-700 border-amber-300 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-700"
                          : "text-muted-foreground border-border hover:bg-muted"
                      }`}
                      title="나중에 다시 검토할 문제로 표시"
                    >
                      <Bookmark className={`size-3.5 ${bookmarkedIds.has(currentQ.id) ? "fill-amber-500" : ""}`} />
                      <span>{bookmarkedIds.has(currentQ.id) ? "검토 표시됨" : "나중에 검토"}</span>
                    </button>
                  </div>

                  {/* Question Prompt with Enhanced Korean Typography */}
                  <CardTitle className="text-[15px] sm:text-[16px] font-bold text-foreground leading-[1.68] tracking-[-0.015em] break-keep pt-3">
                    {currentQ.question}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 sm:p-6 space-y-5">
                  {/* Code Snippet Box (Mac style with enhanced font-mono and line-height) */}
                  {currentQ.codeSnippet && (
                    <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 shadow-inner">
                      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-zinc-800 text-[10.5px] text-zinc-400">
                        <div className="flex items-center gap-1.5">
                          <span className="size-2.5 rounded-full bg-rose-500/80" />
                          <span className="size-2.5 rounded-full bg-amber-500/80" />
                          <span className="size-2.5 rounded-full bg-emerald-500/80" />
                        </div>
                        <span className="font-semibold tracking-wider uppercase text-[10px]">
                          SOURCE CODE / JAVA 21 & SPRING
                        </span>
                      </div>
                      <pre className="overflow-x-auto leading-[1.75] whitespace-pre font-mono text-[12px] text-zinc-200">
                        {currentQ.codeSnippet}
                      </pre>
                    </div>
                  )}

                  {/* 4 Options Radio Cards */}
                  <div className="space-y-3 pt-1">
                    <span className="text-xs font-bold text-foreground block tracking-tight">
                      보기 중 정답을 하나 선택하세요 (단축키: 1 ~ 4)
                    </span>
                    {currentQ.options.map((optionText, optIdx) => {
                      const isSelected = userAnswers[currentQ.id] === optIdx;
                      return (
                        <div
                          key={optIdx}
                          onClick={() => handleSelectOption(currentQ.id, optIdx)}
                          className={`p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5 ${
                            isSelected
                              ? "border-primary bg-primary/[0.07] dark:bg-primary/[0.14] ring-1 ring-primary/80 text-foreground shadow-xs"
                              : "border-border/70 hover:border-border hover:bg-muted/40 text-foreground/90"
                          }`}
                        >
                          <span
                            className={`size-6.5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 font-mono ${
                              isSelected
                                ? "bg-primary text-primary-foreground shadow-2xs"
                                : "bg-muted text-muted-foreground border border-border"
                            }`}
                          >
                            {optIdx + 1}
                          </span>
                          <span className="text-[13px] sm:text-[13.5px] leading-[1.7] tracking-[-0.01em] break-keep pt-0.5">
                            {optionText}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>

                <CardFooter className="p-4 sm:p-5 border-t border-border/60 flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIdx === 0}
                    onClick={() => setCurrentQuestionIdx((prev) => Math.max(0, prev - 1))}
                    className="text-xs gap-1 cursor-pointer h-8.5"
                  >
                    <ArrowLeft className="size-3.5" /> 이전 문제
                  </Button>

                  <div className="flex items-center gap-3">
                    {autoSaveToast && (
                      <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-fade-in font-mono">
                        <CheckCircle2 className="size-3" /> 답안 자동 저장됨
                      </span>
                    )}

                    {currentQuestionIdx < examQuestions.length - 1 ? (
                      <Button
                        size="sm"
                        onClick={() => setCurrentQuestionIdx((prev) => Math.min(examQuestions.length - 1, prev + 1))}
                        className="text-xs gap-1 bg-primary text-primary-foreground cursor-pointer h-8.5 font-semibold"
                      >
                        다음 문제 <ArrowRight className="size-3.5" />
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => setIsSubmitDialogOpen(true)}
                        className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer h-8.5 shadow-xs"
                      >
                        <Send className="size-3.5" /> 시험 제출하기
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Right 1 col: Question Quick Jump Navigator */}
            <div className="space-y-4">
              <Card className="border-border/70 shadow-xs sticky top-4">
                <CardHeader className="p-4 pb-2.5 border-b border-border/60">
                  <CardTitle className="text-xs font-bold flex items-center justify-between text-foreground tracking-tight">
                    <span>문항 퀵 점프 내비게이터</span>
                    <span className="font-mono text-xs text-primary font-bold">
                      {answeredCount}/{examQuestions.length}
                    </span>
                  </CardTitle>
                  <CardDescription className="text-[11px] text-muted-foreground leading-normal mt-0.5">
                    문항 번호를 클릭해 원하는 문제로 바로 이동합니다.
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4 space-y-4">
                  {/* Legend Indicator */}
                  <div className="flex flex-wrap gap-2.5 text-[10.5px] text-muted-foreground pb-2.5 border-b border-border/50 font-medium">
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-primary" /> 완료
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-muted border" /> 미완료
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="size-2 rounded-full bg-amber-400" /> 검토표시
                    </span>
                  </div>

                  {/* 15 Question Chips Grid */}
                  <div className="grid grid-cols-5 gap-2">
                    {examQuestions.map((q, idx) => {
                      const isAnswered = userAnswers[q.id] !== undefined;
                      const isCurrent = currentQuestionIdx === idx;
                      const isBookmarked = bookmarkedIds.has(q.id);

                      return (
                        <button
                          key={q.id}
                          onClick={() => setCurrentQuestionIdx(idx)}
                          className={`size-9.5 rounded-lg text-xs font-mono font-bold flex flex-col items-center justify-center relative transition-all cursor-pointer ${
                            isCurrent
                              ? "ring-2 ring-primary ring-offset-1 z-10"
                              : ""
                          } ${
                            isAnswered
                              ? "bg-primary text-primary-foreground shadow-2xs"
                              : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/70"
                          } ${
                            isBookmarked
                              ? "border-amber-400 border-2"
                              : ""
                          }`}
                        >
                          <span>{idx + 1}</span>
                          {isBookmarked && (
                            <span className="absolute -top-1 -right-1 size-2.5 rounded-full bg-amber-400 ring-1 ring-background" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Summary note */}
                  <div className="rounded-xl p-3 bg-muted/30 text-[11px] text-muted-foreground border border-border/40 space-y-1 font-mono">
                    <p>• 미답변 문항: <b className="text-rose-600 dark:text-rose-400 font-sans">{examQuestions.length - answeredCount}개</b></p>
                    <p>• 검토 표시 문항: <b className="text-amber-600 dark:text-amber-400 font-sans">{bookmarkedIds.size}개</b></p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 3: PROBLEM SOLVING REVIEW & FEEDBACK (오답노트 & 결과 리뷰) */}
      {/* ========================================================================= */}
      {viewMode === "review" && (
        <div className="space-y-4">
          {/* Review Header Banner */}
          <Card className="border-border/70 shadow-xs bg-gradient-to-r from-indigo-900/10 via-background to-purple-900/10">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                      onClick={() => setViewMode("list")}
                    >
                      <ArrowLeft className="size-3" /> 평가 목록
                    </Button>
                    <Badge variant="outline" className="text-[10px] font-bold border-indigo-200 text-indigo-600">
                      오답노트 & 문제풀이 결과
                    </Badge>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-foreground tracking-tight pt-1 leading-snug">
                    {selectedExam.round} ({selectedExam.course}) 문제풀이 및 해설
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed tracking-[-0.01em] break-keep">
                    응시자: 윤창일 (lg06_st33) • 문항별 정답 대조 및 공식 출제 해설을 확인하고 취약 개념을 복습합니다.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3.5 rounded-xl bg-background border border-border/80 shadow-2xs text-center font-mono min-w-[130px]">
                    <span className="text-[10px] text-muted-foreground block font-medium">최종 취득 점수</span>
                    <span className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                      {examFinalScore ?? selectedExam.myScore}점
                    </span>
                    <span className="text-[10.5px] text-muted-foreground block mt-0.5">
                      (반 평균 {selectedExam.avgScore}점)
                    </span>
                  </div>

                  <Button
                    size="sm"
                    onClick={() => handleOpenReport(selectedExam)}
                    className="h-10 text-xs font-semibold gap-1.5 bg-slate-900 dark:bg-slate-800 text-white cursor-pointer shadow-xs"
                  >
                    <BarChart3 className="size-3.5" />
                    성적 리포트 보기
                  </Button>
                </div>
              </div>

              {/* Smart Review Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-3.5 mt-3.5 border-t border-border/50 text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <Filter className="size-3.5 text-muted-foreground" />
                  <span className="font-semibold text-foreground text-xs tracking-tight">문항 필터:</span>
                  <div className="flex items-center gap-1.5 ml-1 flex-wrap">
                    <button
                      onClick={() => setReviewFilter("all")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        reviewFilter === "all"
                          ? "bg-primary text-primary-foreground shadow-2xs"
                          : "bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      전체 ({reviewQuestions.length})
                    </button>
                    <button
                      onClick={() => setReviewFilter("wrong")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        reviewFilter === "wrong"
                          ? "bg-rose-600 text-white shadow-2xs"
                          : "bg-muted text-rose-600 dark:text-rose-400 hover:bg-rose-50"
                      }`}
                    >
                      ❌ 틀린 문제만 ({reviewQuestions.filter((q) => q.userAnswerIndex !== q.correctIndex).length})
                    </button>
                    <button
                      onClick={() => setReviewFilter("correct")}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                        reviewFilter === "correct"
                          ? "bg-emerald-600 text-white shadow-2xs"
                          : "bg-muted text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50"
                      }`}
                    >
                      ✅ 맞힌 문제 ({reviewQuestions.filter((q) => q.userAnswerIndex === q.correctIndex).length})
                    </button>
                  </div>
                </div>

                <span className="text-[11.5px] text-muted-foreground font-mono">
                  표시 중: <b>{filteredReviewQuestions.length}문항</b>
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Question List Review */}
          <div className="space-y-4">
            {filteredReviewQuestions.map((q, idx) => {
              const isCorrect = q.userAnswerIndex === q.correctIndex;

              return (
                <Card
                  key={q.id}
                  id={`review-question-${q.id}`}
                  className={`border transition-all rounded-xl ${
                    isCorrect
                      ? "border-emerald-200/70 dark:border-emerald-950/60 bg-card"
                      : "border-rose-200/80 dark:border-rose-950/60 bg-rose-50/[0.04] dark:bg-rose-950/[0.06]"
                  }`}
                >
                  <CardHeader className="p-4 sm:p-5 pb-3 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs px-2.5 py-0.5 rounded-md bg-muted text-foreground">
                          문제 #{idx + 1}
                        </span>
                        {isCorrect ? (
                          <Badge className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 font-bold text-[10.5px]">
                            <CheckCircle2 className="size-3 mr-1" /> 정답 (+{q.points}점)
                          </Badge>
                        ) : (
                          <Badge className="bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 font-bold text-[10.5px]">
                            <XCircle className="size-3 mr-1" /> 오답 (0점)
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-[10px]">
                          {q.category}
                        </Badge>
                      </div>

                      <span className="text-[11px] text-muted-foreground font-mono">
                        배점 {q.points}점
                      </span>
                    </div>

                    <CardTitle className="text-[14.5px] sm:text-[15px] font-bold text-foreground leading-[1.68] tracking-[-0.015em] break-keep pt-2.5">
                      {q.question}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-5 space-y-4">
                    {/* Code Snippet Box (if available) */}
                    {q.codeSnippet && (
                      <div className="rounded-xl overflow-hidden border border-zinc-800 bg-zinc-950 p-4 font-mono text-xs text-zinc-100 shadow-inner">
                        <pre className="overflow-x-auto leading-[1.75] whitespace-pre font-mono text-[12px] text-zinc-200">
                          {q.codeSnippet}
                        </pre>
                      </div>
                    )}

                    {/* 4 Options with Side-by-Side User Answer vs Correct Answer */}
                    <div className="space-y-2.5">
                      <span className="text-[11.5px] font-bold text-muted-foreground block tracking-tight">
                        선택지 및 채점 결과:
                      </span>
                      {q.options.map((optionText, optIdx) => {
                        const isCorrectOption = optIdx === q.correctIndex;
                        const isUserChoice = optIdx === q.userAnswerIndex;

                        let optionStyle = "border-border/60 bg-card text-muted-foreground";
                        let badgeContent = null;

                        if (isCorrectOption) {
                          optionStyle = "border-emerald-500 bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-100 font-semibold ring-1 ring-emerald-500";
                          badgeContent = (
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white flex items-center gap-1 shrink-0">
                              <CheckCircle2 className="size-2.5" /> 실제 정답
                            </span>
                          );
                        } else if (isUserChoice && !isCorrect) {
                          optionStyle = "border-rose-400 bg-rose-50/80 dark:bg-rose-950/40 text-rose-950 dark:text-rose-100 line-through ring-1 ring-rose-400";
                          badgeContent = (
                            <span className="text-[10.5px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white flex items-center gap-1 shrink-0">
                              <XCircle className="size-2.5" /> 내가 고른 오답
                            </span>
                          );
                        }

                        return (
                          <div
                            key={optIdx}
                            className={`p-3.5 rounded-xl border text-[13px] sm:text-[13.5px] flex items-center justify-between gap-3 ${optionStyle}`}
                          >
                            <div className="flex items-start gap-3">
                              <span className="size-5.5 rounded-full bg-background border flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 font-mono">
                                {optIdx + 1}
                              </span>
                              <span className="leading-[1.65] tracking-[-0.01em] break-keep">{optionText}</span>
                            </div>
                            {badgeContent}
                          </div>
                        );
                      })}
                    </div>

                    {/* Official Explanation Box (examExplain) with Golden Typography */}
                    <div className="rounded-xl p-4 bg-indigo-50/70 dark:bg-indigo-950/35 border border-indigo-200/70 dark:border-indigo-900/50 space-y-2">
                      <div className="flex items-center gap-1.5 text-indigo-700 dark:text-indigo-300 font-bold text-xs tracking-tight">
                        <Sparkles className="size-3.5 text-indigo-600 shrink-0" />
                        <span>공식 출제 해설 및 개념 정리</span>
                      </div>
                      <p className="text-foreground/90 leading-[1.78] tracking-[-0.012em] text-[13px] sm:text-[13.5px] break-keep">
                        {q.explanation}
                      </p>
                    </div>

                    {/* AI Review Deep-link CTA */}
                    {q.relatedAiTopic && (
                      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <span className="text-[11.5px] text-muted-foreground flex items-center gap-1">
                          연관 복습 토픽: <b className="text-foreground font-semibold">{q.relatedAiTopic}</b>
                        </span>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            if (onNavigate) {
                              onNavigate("ai-review");
                            } else {
                              const url = new URL(window.location.href);
                              url.searchParams.set("tab", "ai-review");
                              window.history.replaceState({}, "", url.toString());
                              window.dispatchEvent(new PopStateEvent("popstate"));
                            }
                          }}
                          className="h-8 text-xs font-semibold gap-1.5 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/50 cursor-pointer self-start sm:self-auto"
                        >
                          <Sparkles className="size-3 text-indigo-500" />
                          AI 복습 탭에서 퀴즈로 재점검 ↗
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 4: COMPREHENSIVE RADAR DIAGNOSTIC REPORT (종합 역량 리포트) */}
      {/* ========================================================================= */}
      {viewMode === "report" && (
        <div className="space-y-6">
          {/* Round Switcher & Actions Bar */}
          <Card className="border-border/60 shadow-xs">
            <CardContent className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2 flex-wrap">
                {INITIAL_EVALUATIONS.map((evalItem) => (
                  <Button
                    key={evalItem.id}
                    variant={activeReportRound === evalItem.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveReportRound(evalItem.id)}
                    className="text-xs h-8.5 cursor-pointer font-semibold px-3"
                  >
                    {evalItem.round} 결과 ({evalItem.testDate})
                  </Button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs h-8.5 gap-1.5"
                  onClick={() => window.print()}
                >
                  <Printer className="size-3.5" /> 리포트 인쇄
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => handleOpenReview(WSTS_EVALUATIONS[0])}
                  className="text-xs h-8.5 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer font-semibold"
                >
                  <CheckCircle2 className="size-3.5" /> 오답노트 보러가기
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Main Score & Radar Card Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Summary Metric KPI */}
            <div className="space-y-4">
              <Card className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-0 shadow-md">
                <CardHeader className="pb-2 p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-[10px] text-white border-white/20 bg-white/10 font-bold">
                      {reportItem.round} 종합 성적
                    </Badge>
                    <Award className="size-5 text-amber-400" />
                  </div>
                  <CardTitle className="text-3xl sm:text-4xl font-black pt-3 font-mono">
                    {reportItem.myScore} <span className="text-base font-normal text-indigo-200 font-sans">/ 100점</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-indigo-200 mt-0.5">
                    평가일: {reportItem.testDate}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3.5 p-5 sm:p-6 pt-0">
                  <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
                    <div className="rounded-xl bg-white/10 p-3">
                      <span className="text-[10px] text-indigo-300 block font-sans">수강생 반 평균</span>
                      <span className="font-bold text-base">{reportItem.avgScore}점</span>
                    </div>
                    <div className="rounded-xl bg-white/10 p-3">
                      <span className="text-[10px] text-indigo-300 block font-sans">전체 백분위</span>
                      <span className="font-bold text-base text-emerald-300">{reportItem.rank}</span>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                    <span className="font-bold flex items-center gap-1.5 text-sky-300 font-mono text-[12.5px]">
                      <TrendingUp className="size-3.5" /> 반 평균 대비 +{reportItem.myScore - reportItem.avgScore}점
                    </span>
                    <p className="text-[12px] text-white/80 leading-[1.65] break-keep">
                      모든 핵심 영역에서 안정적인 성취도를 보이고 있습니다.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* AI Feedback & Action Plan with Refined Typography */}
              <Card className="border-indigo-500/20 bg-indigo-500/5">
                <CardHeader className="pb-2 p-4 sm:p-5">
                  <CardTitle className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                    <Sparkles className="size-3.5 text-indigo-500" />
                    AI 학습 역량 진단 피드백
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-5 pt-0 space-y-2.5 text-xs text-foreground/90 leading-[1.78] tracking-[-0.012em] break-keep">
                  <p>{reportItem.feedback}</p>
                  <div className="p-3 rounded-xl bg-background border text-[11.5px] space-y-1 mt-2.5 leading-relaxed">
                    <span className="font-bold text-primary block">💡 멘토 추천 복습 큐레이션:</span>
                    <p className="text-muted-foreground">
                      교육 캘린더의 <b>[Day 66] AWS 인프라 자동화와 Terraform 기초</b> 다시보기 영상을 시청하여 인프라 프로비저닝 개념을 재확인하세요.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right (2 cols): 5-Point Radar Chart & Metrics Detail */}
            <div className="lg:col-span-2 space-y-4">
              <Card>
                <CardHeader className="p-5 sm:p-6 pb-3 border-b">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-base font-bold flex items-center gap-2 tracking-tight">
                        <BarChart3 className="size-4 text-primary" />
                        5대 핵심 기술 역량 방사형 차트
                      </CardTitle>
                      <CardDescription className="text-xs mt-0.5">
                        내 역량 점수(보라색)와 전체 수강생 평균(회색 점선)을 비교 분석합니다.
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-3.5 text-xs font-medium">
                      <span className="flex items-center gap-1.5 font-semibold text-indigo-600 dark:text-indigo-400">
                        <span className="size-2 rounded-full bg-indigo-600" /> 내 점수
                      </span>
                      <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                        <span className="size-2 rounded-full bg-slate-400" /> 반 평균
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 sm:p-6">
                  {renderRadarChart(reportItem.radarMetrics)}

                  {/* Breakdown Bars */}
                  <div className="space-y-3.5 pt-6 border-t mt-6">
                    <h4 className="text-xs font-bold text-foreground tracking-tight">영역별 세부 성적표</h4>
                    <div className="space-y-3">
                      {reportItem.radarMetrics.map((metric, idx) => (
                        <div key={idx} className="space-y-1.5">
                          <div className="flex justify-between text-xs">
                            <span className="font-semibold text-foreground tracking-tight">{metric.subject}</span>
                            <span className="font-mono">
                              <b className="text-indigo-600 dark:text-indigo-400">{metric.myScore}점</b>
                              <span className="text-muted-foreground text-[11px] ml-1.5">
                                (평균 {metric.avgScore}점)
                              </span>
                            </span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2 overflow-hidden flex">
                            <div
                              className="bg-indigo-600 h-full rounded-full transition-all"
                              style={{ width: `${metric.myScore}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIALOG 1: EXAM SUBMISSION CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2">
              <Send className="size-4 text-indigo-600" />
              최종 시험 답안 제출
            </DialogTitle>
            <DialogDescription className="text-xs">
              제출 후에는 답안을 수정할 수 없으며, 즉시 자동 채점이 진행됩니다.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-2 gap-2 text-center font-mono">
              <div className="p-3 rounded-xl bg-muted/40 border">
                <span className="text-[10px] text-muted-foreground block font-sans">완료된 답변</span>
                <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">
                  {answeredCount} / {examQuestions.length}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-muted/40 border">
                <span className="text-[10px] text-muted-foreground block font-sans">미답변 문항</span>
                <span className="text-lg font-bold text-rose-600 dark:text-rose-400">
                  {examQuestions.length - answeredCount}문항
                </span>
              </div>
            </div>

            {examQuestions.length - answeredCount > 0 && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-[11.5px] leading-relaxed flex items-start gap-2 break-keep">
                <AlertCircle className="size-4 shrink-0 mt-0.5" />
                <span>아직 풀지 않은 {examQuestions.length - answeredCount}개 문항이 있습니다. 미답변 문항은 0점 처리됩니다. 그래도 제출하시겠습니까?</span>
              </div>
            )}
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-2 border-t">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitDialogOpen(false)}
              className="text-xs cursor-pointer h-8.5"
            >
              계속 풀기
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleFinalSubmit}
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-bold cursor-pointer h-8.5"
            >
              확인 및 최종 제출
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 2: EXAM EXIT CONFIRMATION MODAL */}
      {/* ========================================================================= */}
      <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-rose-600">
              <AlertCircle className="size-4" />
              시험 응시 중단
            </DialogTitle>
            <DialogDescription className="text-xs">
              시험을 중단하고 목록으로 나가시겠습니까? 진행 중인 타이머는 멈추지만 답안은 임시 저장됩니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsExitDialogOpen(false)}
              className="text-xs cursor-pointer h-8.5"
            >
              계속 시험 응시
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setIsExitDialogOpen(false);
                setIsTimerRunning(false);
                setViewMode("list");
              }}
              className="text-xs cursor-pointer h-8.5"
            >
              나가기
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG 3: POST-SUBMISSION RESULT POPUP MODAL */}
      {/* ========================================================================= */}
      <Dialog open={isResultModalOpen} onOpenChange={setIsResultModalOpen}>
        <DialogContent className="sm:max-w-md text-center p-6">
          <div className="size-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Award className="size-8" />
          </div>

          <DialogTitle className="text-lg font-black text-foreground tracking-tight">
            3차 종합 실무역량평가 완료!
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground mt-1">
            수고하셨습니다. 응시 답안이 성공적으로 제출되었으며 자동 채점이 완료되었습니다.
          </DialogDescription>

          <div className="my-4 p-4 rounded-xl bg-muted/40 border border-border/60 space-y-2 font-mono">
            <span className="text-xs text-muted-foreground block font-sans">최종 취득 점수</span>
            <p className="text-3xl font-black text-indigo-600 dark:text-indigo-400">
              {examFinalScore ?? 0} <span className="text-sm font-normal text-muted-foreground font-sans">/ 100점</span>
            </p>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold block font-sans">
              총 {examQuestions.length}문항 중 {correctCount}문항 정답 (정답률 {Math.round((correctCount / examQuestions.length) * 100)}%)
            </span>
          </div>

          <DialogFooter className="flex flex-col sm:flex-row gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setIsResultModalOpen(false);
                setViewMode("report");
              }}
              className="w-full sm:w-1/2 text-xs font-semibold cursor-pointer h-9"
            >
              종합 리포트 보기
            </Button>
            <Button
              size="sm"
              onClick={() => {
                setIsResultModalOpen(false);
                setViewMode("review");
              }}
              className="w-full sm:w-1/2 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer h-9"
            >
              오답노트 및 풀이 확인 🚀
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
