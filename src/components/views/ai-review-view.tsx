"use client";

import * as React from "react";
import {
  BookOpen,
  BrainCircuit,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  RefreshCw,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

const DEFAULT_QUIZZES: QuizItem[] = [
  {
    id: 1,
    question: "Next.js 15에서 기본 번들러로 안정화되어 초고속 HMR을 지원하는 엔진은 무엇인가요?",
    options: ["Webpack 5", "Vite", "Turbopack", "Rollup"],
    answerIndex: 2,
    explanation: "Next.js 15에서는 Rust 기반의 Turbopack이 기본 지원되어 로컬 개발 빌드와 HMR 속도가 대폭 향상되었습니다.",
  },
  {
    id: 2,
    question: "shadcn/ui의 최신 Base UI 버전에서 클라이언트 상태를 스타일과 조합할 때 주로 사용하는 유틸리티는?",
    options: ["styled-components", "class-variance-authority (cva) & cn", "Emotion", "CSS Modules"],
    answerIndex: 1,
    explanation: "shadcn은 cva(class-variance-authority)와 cn(clsx + tailwind-merge)을 사용하여 컴포넌트 변형(Variant)을 선언적으로 관리합니다.",
  },
  {
    id: 3,
    question: "Tailwind CSS v4에서 tailwind.config.js 대신 테마 변수를 선언하는 지시어는?",
    options: ["@theme inline", "@config theme", "@tailwind base", "@apply variables"],
    answerIndex: 0,
    explanation: "Tailwind CSS v4는 CSS-first 엔진으로 globals.css 내의 @theme inline 지시어를 통해 직접 oklch 컬러 및 폰트 토큰을 정의합니다.",
  },
];

export function AiReviewView() {
  const [learningNotes, setLearningNotes] = React.useState(
    "오늘 실습에서는 Next.js 15 App Router 환경에서 Base UI 기반 shadcn 컴포넌트를 이식하고, Tailwind CSS v4의 oklch 컬러 토큰을 연동하는 대시보드 리빌딩 작업을 진행함."
  );
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedSummary, setGeneratedSummary] = React.useState<string[]>([
    "Next.js 15는 React 19와 Turbopack을 공식 지원하여 대규모 엔터프라이즈 컴포넌트의 렌더링 성능을 극대화함.",
    "Tailwind CSS v4는 설정 파일 없이 globals.css에서 CSS 변수를 직관적으로 오버라이드할 수 있어 유지보수성이 뛰어남.",
    "shadcn/ui 컴포넌트는 프로젝트 내부 코드로 소유되므로 접근성과 커스텀 디자인을 100% 제어 가능함.",
  ]);

  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setGeneratedSummary([
        "입력하신 노트를 분석한 결과: Next.js 15 + Base UI 컴포넌트 간 상호작용 및 Tailwind v4 테마 연동이 핵심입니다.",
        "Server Components와 Client Components의 경계를 명확히 분리하여 초기 로딩 번들 크기를 최적화했습니다.",
        "디자인 토큰(@theme inline)을 활용해 라이트/다크 모드 전환 시 일관된 대비(Contrast)를 유지할 수 있습니다.",
      ]);
      alert("AI 핵심 요약과 맞춤 퀴즈가 성공적으로 갱신되었습니다!");
    }, 800);
  };

  const handleSelectOption = (quizId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: optionIdx,
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-2xl border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <Sparkles className="size-4" />
            </span>
            <h2 className="text-lg font-bold text-foreground">
              차세대 AI 학습 복습 & 데일리 퀴즈 허브
            </h2>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            오늘 강의와 실습에서 배운 내용을 간단히 입력하면, AI가 핵심 3줄 요약과 이해도 점검 퀴즈를 즉각 생성합니다.
          </p>
        </div>

        <Badge variant="outline" className="text-xs bg-background/80 font-semibold shrink-0">
          Claude & Gemini 1.5 Pro 파이프라인
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Form & AI Core Summary */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <BookOpen className="size-4 text-primary" />
                오늘의 학습 내용 입력 폼
              </CardTitle>
              <CardDescription className="text-xs">
                강의 키워드, 실습 에러 메모, 핵심 인사이트를 자유롭게 적어보세요.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <textarea
                className="w-full min-h-[120px] rounded-xl border bg-background p-3 text-xs outline-none focus:ring-2 focus:ring-primary/40 leading-relaxed"
                placeholder="예: 오늘 다룬 Next.js 15 Server Action과 Tailwind CSS v4 @theme inline 적용법..."
                value={learningNotes}
                onChange={(e) => setLearningNotes(e.target.value)}
              />

              <div className="flex justify-between items-center pt-1">
                <span className="text-[11px] text-muted-foreground">
                  글자 수: {learningNotes.length}자
                </span>
                <Button
                  size="sm"
                  className="gap-1.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={handleGenerate}
                  disabled={isGenerating}
                >
                  <RefreshCw className={`size-3.5 ${isGenerating ? "animate-spin" : ""}`} />
                  {isGenerating ? "AI 분석 중..." : "AI 요약 & 퀴즈 생성"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* AI 3-Point Summary Card */}
          <Card className="border-indigo-500/30 bg-card">
            <CardHeader className="pb-3 border-b bg-indigo-500/5">
              <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2">
                <BrainCircuit className="size-4 text-indigo-500" />
                AI 핵심 요약 (3-Point Summary)
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-2">
                {generatedSummary.map((sum, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 text-xs text-foreground/90">
                    <span className="size-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed pt-0.5">{sum}</p>
                  </div>
                ))}
              </div>

              <Separator className="my-2" />

              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground mr-1">추천 키워드:</span>
                {["#Nextjs15", "#Tailwindv4", "#shadcn", "#BaseUI", "#Turbopack"].map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-[10px]">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Interactive Daily Quiz (3 Questions) */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3 border-b">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-2">
                  <HelpCircle className="size-4 text-primary" />
                  데일리 점검 퀴즈 (3문항)
                </CardTitle>
                <Badge variant="outline" className="text-[10px]">
                  응시 완료: {Object.keys(selectedAnswers).length} / 3
                </Badge>
              </div>
              <CardDescription className="text-xs">
                정답을 선택하면 즉시 AI 해설과 채점 결과를 확인할 수 있습니다.
              </CardDescription>
            </CardHeader>

            <CardContent className="p-4 space-y-5">
              {DEFAULT_QUIZZES.map((quiz, qIdx) => {
                const selected = selectedAnswers[quiz.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === quiz.answerIndex;

                return (
                  <div key={quiz.id} className="space-y-2.5 p-3.5 rounded-xl border bg-muted/20">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-bold text-primary">Q{qIdx + 1}.</span>
                      <p className="text-xs font-semibold text-foreground leading-snug">
                        {quiz.question}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                      {quiz.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(quiz.id, optIdx)}
                            className={`p-2 rounded-lg text-left text-xs transition-all border ${
                              isChosen
                                ? isCorrect
                                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                                  : "bg-destructive/10 border-destructive text-destructive font-bold"
                                : "bg-card border-border hover:bg-muted/60 text-foreground"
                            }`}
                          >
                            <span className="font-mono text-[10px] text-muted-foreground mr-1.5">
                              {optIdx + 1}.
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {isAnswered && (
                      <div
                        className={`p-2.5 rounded-lg text-xs leading-relaxed mt-2 ${
                          isCorrect ? "bg-emerald-500/10 text-emerald-800 dark:text-emerald-300" : "bg-amber-500/10 text-amber-800 dark:text-amber-300"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1 mb-0.5">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="size-3.5 text-emerald-600" /> 정답입니다!
                            </>
                          ) : (
                            <>
                              <Lightbulb className="size-3.5 text-amber-600" /> 오답입니다. (정답: {quiz.answerIndex + 1}번)
                            </>
                          )}
                        </div>
                        <p className="text-[11px] opacity-90">{quiz.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
