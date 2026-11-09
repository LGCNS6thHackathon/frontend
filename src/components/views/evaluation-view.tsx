"use client";

import * as React from "react";
import {
  Award,
  BarChart3,
  Printer,
  Sparkles,
  TrendingUp,
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
import { INITIAL_EVALUATIONS, EvaluationItem } from "@/lib/lms-data";

export function EvaluationView() {
  const [activeRound, setActiveRound] = React.useState<number>(1);
  const evaluation = INITIAL_EVALUATIONS.find((e) => e.id === activeRound) || INITIAL_EVALUATIONS[0];

  // Radar chart mathematical coordinates calculator (5 vertices)
  const renderRadarChart = (metrics: EvaluationItem["radarMetrics"]) => {
    const size = 260;
    const center = size / 2;
    const radius = 95;
    const total = metrics.length;

    // Helper to calculate polar coordinates
    const getPoint = (score: number, index: number, maxScore = 100) => {
      const angle = (Math.PI * 2 / total) * index - Math.PI / 2;
      const r = (score / maxScore) * radius;
      return {
        x: center + r * Math.cos(angle),
        y: center + r * Math.sin(angle),
      };
    };

    // My score polygon points
    const myPoints = metrics
      .map((m, i) => {
        const pt = getPoint(m.myScore, i);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");

    // Average score polygon points
    const avgPoints = metrics
      .map((m, i) => {
        const pt = getPoint(m.avgScore, i);
        return `${pt.x},${pt.y}`;
      })
      .join(" ");

    return (
      <svg width={size} height={size} className="mx-auto overflow-visible">
        {/* Background Web Rings */}
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

        {/* Axis Spokes */}
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

        {/* Class Average Polygon (Gray/Muted) */}
        <polygon
          points={avgPoints}
          fill="rgba(148, 163, 184, 0.25)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* My Score Polygon (Indigo/Blue Accent) */}
        <polygon
          points={myPoints}
          fill="rgba(99, 102, 241, 0.35)"
          stroke="#6366f1"
          strokeWidth="2.5"
        />

        {/* Data Point Dots & Labels */}
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

  return (
    <div className="space-y-6">
      {/* Round Switcher Header */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {INITIAL_EVALUATIONS.map((evalItem) => (
              <Button
                key={evalItem.id}
                variant={activeRound === evalItem.id ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveRound(evalItem.id)}
                className="text-xs h-8"
              >
                {evalItem.round} 결과 ({evalItem.testDate})
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="text-xs h-8 gap-1.5"
              onClick={() => window.print()}
            >
              <Printer className="size-3.5" /> 리포트 인쇄
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Score & Radar Card Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Summary Metric KPI */}
        <div className="space-y-4">
          <Card className="bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-[10px] text-white border-white/20 bg-white/10">
                  {evaluation.round} 종합 성적
                </Badge>
                <Award className="size-5 text-amber-400" />
              </div>
              <CardTitle className="text-3xl font-black pt-2">
                {evaluation.myScore} <span className="text-base font-normal text-indigo-200">/ 100점</span>
              </CardTitle>
              <CardDescription className="text-xs text-indigo-200">
                평가일: {evaluation.testDate}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-white/10 p-2.5">
                  <span className="text-[10px] text-indigo-300 block">수강생 반 평균</span>
                  <span className="font-bold text-sm">{evaluation.avgScore}점</span>
                </div>
                <div className="rounded-lg bg-white/10 p-2.5">
                  <span className="text-[10px] text-indigo-300 block">전체 백분위</span>
                  <span className="font-bold text-sm text-emerald-300">{evaluation.rank}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
                <span className="font-bold flex items-center gap-1 text-sky-300">
                  <TrendingUp className="size-3.5" /> 반 평균 대비 +{evaluation.myScore - evaluation.avgScore}점
                </span>
                <p className="text-[11px] text-white/80 leading-relaxed">
                  모든 핵심 영역에서 안정적인 성취도를 보이고 있습니다.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* AI Feedback & Action Plan */}
          <Card className="border-indigo-500/20 bg-indigo-500/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Sparkles className="size-3.5 text-indigo-500" />
                AI 학습 역량 진단 피드백
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs text-foreground/90 leading-relaxed">
              <p>{evaluation.feedback}</p>
              <div className="p-2.5 rounded-lg bg-background border text-[11px] space-y-1 mt-2">
                <span className="font-semibold text-primary block">💡 멘토 추천 복습 큐레이션:</span>
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
            <CardHeader className="pb-2 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base font-bold flex items-center gap-2">
                    <BarChart3 className="size-4 text-primary" />
                    5대 핵심 기술 역량 방사형 차트
                  </CardTitle>
                  <CardDescription className="text-xs">
                    내 역량 점수(보라색)와 전체 수강생 평균(회색 점선)을 비교 분석합니다.
                  </CardDescription>
                </div>
                <div className="flex items-center gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-semibold text-indigo-600">
                    <span className="size-2 rounded-full bg-indigo-600" /> 내 점수
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold text-muted-foreground">
                    <span className="size-2 rounded-full bg-slate-400" /> 반 평균
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {renderRadarChart(evaluation.radarMetrics)}

              {/* Breakdown Bars */}
              <div className="space-y-3 pt-6 border-t mt-6">
                <h4 className="text-xs font-bold text-foreground">영역별 세부 성적표</h4>
                <div className="space-y-2.5">
                  {evaluation.radarMetrics.map((metric, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-foreground">{metric.subject}</span>
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
  );
}
