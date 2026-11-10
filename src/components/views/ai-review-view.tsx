"use client";

import * as React from "react";
import {
  Check,
  CheckCircle2,
  Clock,
  Copy,
  Eye,
  EyeOff,
  FileText,
  HelpCircle,
  Lightbulb,
  Lock,
  Play,
  RefreshCw,
  RotateCcw,
  Sparkles,
  Subtitles,
  Unlock,
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
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

interface SubtitleSegment {
  time: string;
  text: string;
}

interface QuizItem {
  id: number;
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
  sourceTimestamp: string;
}

interface VideoReviewData {
  id: string;
  url: string;
  title: string;
  instructor: string;
  duration: string;
  thumbnail: string;
  charCount: number;
  subtitles: SubtitleSegment[];
  summary: string[];
  keywords: string[];
  quizzes: QuizItem[];
}

// Java & MSA (Microservices Architecture) authentic curriculum presets
const PRESET_VIDEOS: VideoReviewData[] = [
  {
    id: "preset-java-gateway",
    url: "https://www.youtube.com/watch?v=Jm_K8wS3vA0",
    title: "[Java & Spring Cloud] MSA 서비스 디스커버리 & Spring Cloud Gateway 라우팅 심화",
    instructor: "김동현 강사 (LG CNS AM 기술자문 수석 아키텍트)",
    duration: "48분 30초",
    thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&auto=format&fit=crop&q=80",
    charCount: 6840,
    subtitles: [
      {
        time: "01:15",
        text: "안녕하세요, 오늘 세션에서는 Spring Boot 3 기반의 마이크로서비스 간 동적 서비스 디스커버리와 Spring Cloud Gateway의 필터 체인 아키텍처를 다룹니다.",
      },
      {
        time: "09:40",
        text: "Eureka 서버에 등록된 인스턴스 메타데이터를 기반으로 클라이언트 사이드 로드밸런서인 Spring Cloud LoadBalancer가 트래픽을 가중치 분산합니다.",
      },
      {
        time: "18:25",
        text: "인증/인가 처리를 위해 Gateway의 GlobalFilter에서 JWT 토큰을 사전 검증하고, 백엔드 서비스로는 X-User-Id, X-User-Role 헤더를 안전하게 전달하는 것이 핵심입니다.",
      },
      {
        time: "29:50",
        text: "특정 도메인 서비스 장애가 전체 시스템으로 전파되는 Cascading Failure를 방지하기 위해 Resilience4j 서킷 브레이커(CircuitBreaker)와 Fallback 메소드를 구성합니다.",
      },
      {
        time: "41:10",
        text: "마지막으로 분산 환경에서의 요청 추적을 위해 Micrometer Tracing과 Zipkin을 연동하여 각 서비스 간 TraceId와 SpanId를 전파하는 실습을 진행하겠습니다.",
      },
    ],
    summary: [
      "Spring Cloud Gateway 단일 진입점: 라우팅 필터와 JWT 글로벌 필터를 통해 인증·인가를 게이트웨이 레이어에서 일원화 처리.",
      "Resilience4j 서킷 브레이커 적용: 장애 격리(Fault Tolerance) 패턴으로 슬로우 쿼리 및 서비스 다운타임의 연쇄 장애(Cascading Failure) 원천 차단.",
      "Micrometer & Zipkin 분산 트레이싱: 마이크로서비스 간 비동기 호출 트래픽을 TraceId로 통합 모니터링하여 네트워크 병목 구간 즉시 파악.",
    ],
    keywords: ["#Java21", "#SpringBoot3", "#SpringCloudGateway", "#Resilience4j", "#Eureka", "#MSA"],
    quizzes: [
      {
        id: 1,
        question: "Spring Cloud 기반 MSA 아키텍처에서 마이크로서비스 간 동적 위치 탐색(Service Discovery)을 담당하는 컴포넌트는?",
        options: [
          "Eureka (Service Registry & Discovery)",
          "Logstash 로그 수집기",
          "RabbitMQ Management CLI",
          "Maven Wrapper 빌드 도구",
        ],
        answerIndex: 0,
        explanation: "Eureka는 각 마이크로서비스 인스턴스의 IP와 포트 번호를 실시간으로 등록받아 동적 라우팅을 지원하는 서비스 디스커버리 서버입니다.",
        sourceTimestamp: "09:40",
      },
      {
        id: 2,
        question: "강의 [29:50]에서 특정 마이크로서비스의 장애가 다른 연관 서비스로 연쇄 전파(Cascading Failure)되는 것을 차단하기 위해 적용하는 라이브러리는?",
        options: [
          "Resilience4j CircuitBreaker (서킷 브레이커)",
          "Project Lombok 어노테이션 프로세서",
          "Jackson ObjectMapper JSON 변환기",
          "JUnit 5 단위 테스트 러너",
        ],
        answerIndex: 0,
        explanation: "Resilience4j는 실패율 임계치가 초과되면 회로를 차단(OPEN)하여 즉시 Fallback 응답을 반환함으로써 시스템 붕괴를 예방합니다.",
        sourceTimestamp: "29:50",
      },
      {
        id: 3,
        question: "강의 [18:25]에서 API Gateway가 인증된 사용자의 요청을 내부 마이크로서비스로 전달할 때 권장되는 안전한 보안 패턴은?",
        options: [
          "Gateway GlobalFilter에서 JWT 검증 후 X-User-Id 등의 신뢰 헤더를 주입하여 전송",
          "각 마이크로서비스마다 매번 DB 비밀번호를 직접 재검증",
          "DB 루트 권한을 프론트엔드 브라우저에 직접 노출",
          "세션 쿠키를 외부 퍼블릭 망에 암호화 없이 브로드캐스팅",
        ],
        answerIndex: 0,
        explanation: "게이트웨이에서 JWT 서명을 단 1회 중앙 검증한 후 내부 마이크로서비스로는 신뢰할 수 있는 헤더(X-User-Id)로 전파하는 것이 표준 MSA 보안 패턴입니다.",
        sourceTimestamp: "18:25",
      },
    ],
  },
  {
    id: "preset-kafka-saga",
    url: "https://www.youtube.com/watch?v=k9_P8wD2mQ1",
    title: "[Java & Kafka] Event-Driven MSA 아키텍처와 분산 트랜잭션 (Saga 패턴)",
    instructor: "최유진 멘토 (클라우드 네이티브 아키텍트)",
    duration: "55분 20초",
    thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=600&auto=format&fit=crop&q=80",
    charCount: 7920,
    subtitles: [
      {
        time: "02:10",
        text: "데이터베이스를 서비스별로 격리하는 Database-per-Service 원칙 하에서는 전통적인 2PC(Two-Phase Commit) 대신 비동기 Saga 패턴을 도입해야 합니다.",
      },
      {
        time: "14:35",
        text: "주문 서비스에서 결제 서비스, 재고 서비스로 이어지는 트랜잭션 흐름을 Apache Kafka의 토픽을 매개체로 한 Choreography Saga로 풀어냅니다.",
      },
      {
        time: "27:40",
        text: "중간에 결제 실패나 재고 부족 예외가 발생했을 때는 반드시 보상 트랜잭션(Compensating Transaction) 이벤트를 발행하여 최종적 일관성(Eventual Consistency)을 맞춥니다.",
      },
      {
        time: "43:15",
        text: "DB 쓰기와 Kafka 이벤트 발행의 원자성을 보장하기 위해 트랜잭셔널 아웃박스(Transactional Outbox) 패턴과 Debezium CDC 커넥터를 활용합니다.",
      },
    ],
    summary: [
      "Database-per-Service & Saga 패턴: 2단계 커밋(2PC)의 락(Lock) 병목을 극복하고 서비스 자율성을 유지하며 분산 비즈니스 정합성 유지.",
      "보상 트랜잭션(Compensating Transaction): 트랜잭션 실패 시 직전 성공 단계들을 롤백하는 이벤트를 연쇄 발행하여 최종 일관성 확보.",
      "Transactional Outbox 패턴: 로컬 DB 트랜잭션 내에 Outbox 테이블을 함께 커밋한 후 Kafka로 신뢰성 있게 발행(At-least-once) 달성.",
    ],
    keywords: ["#ApacheKafka", "#SagaPattern", "#TransactionalOutbox", "#EventDriven", "#JavaMSA"],
    quizzes: [
      {
        id: 1,
        question: "MSA 환경에서 각 서비스가 독립된 DB를 가질 때(Database-per-Service), 분산 트랜잭션의 최종 일관성을 달성하기 위한 대표적인 아키텍처 패턴은?",
        options: [
          "2PC (Two-Phase Commit) 글로벌 락 트랜잭션",
          "Saga 패턴 (오케스트레이션 / 코레오그래피)",
          "단일 거대 모놀리식 DB 물리적 통합",
          "FTP 파일 공유 동기화 방식",
        ],
        answerIndex: 1,
        explanation: "Saga 패턴은 마이크로서비스 간에 로컬 트랜잭션을 순차적으로 실행하고, 실패 시 보상 트랜잭션을 발행해 최종적 일관성을 유지합니다.",
        sourceTimestamp: "02:10",
      },
      {
        id: 2,
        question: "강의 [27:40]에서 주문 처리 중 결제 실패 예외가 발생했을 때 이전 상태(주문 생성)를 취소하기 위해 발행하는 특수한 트랜잭션은?",
        options: [
          "보상 트랜잭션 (Compensating Transaction)",
          "강제 셧다운 트랜잭션",
          "데이터베이스 백업 복구 스크립트",
          "무한 재시도 트랜잭션",
        ],
        answerIndex: 0,
        explanation: "보상 트랜잭션은 이미 커밋된 이전 단계의 작업을 비즈니스적으로 취소하거나 무효화(예: 주문 취소 상태 변경)하는 메커니즘입니다.",
        sourceTimestamp: "27:40",
      },
      {
        id: 3,
        question: "강의 [43:15]에서 DB 데이터 변경과 Kafka 메시지 발행 간의 원자성(Atomicity)을 보장하기 위해 권장되는 디자인 패턴은?",
        options: [
          "Transactional Outbox 패턴 (아웃박스 패턴)",
          "단순 Thread.sleep(5000) 대기",
          "클라이언트 브라우저 로컬스토리지 저장",
          "HTTP 단순 GET 무한 폴링",
        ],
        answerIndex: 0,
        explanation: "Transactional Outbox 패턴은 비즈니스 데이터와 메시지 레코드를 동일한 DB 트랜잭션에 기록한 뒤 별도 릴레이 프로세스가 브로커로 안전하게 전송합니다.",
        sourceTimestamp: "43:15",
      },
    ],
  },
  {
    id: "preset-java-virtual-threads",
    url: "https://www.youtube.com/watch?v=L9_X2wM8kA4",
    title: "[Java 21 가상 스레드] Spring Boot 3 대규모 동시성 최적화 & 도메인 주도 설계(DDD)",
    instructor: "이진호 박사 (시스템 소프트웨어 수석 엔지니어)",
    duration: "51분 15초",
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80",
    charCount: 7150,
    subtitles: [
      {
        time: "01:45",
        text: "Java 21의 가상 스레드(Virtual Threads, Project Loom)는 I/O 블로킹 시 운영체제 스레드가 아닌 캐리어 스레드를 양보하여 처리량을 수십 배 끌어올립니다.",
      },
      {
        time: "15:20",
        text: "Spring Boot 3.2 이상에서는 spring.threads.virtual.enabled=true 단 한 줄의 프로퍼티 설정으로 톰캣 요청 처리 스레드를 가상 스레드로 전환할 수 있습니다.",
      },
      {
        time: "28:35",
        text: "도메인 주도 설계(DDD) 관점에서 Entity, Value Object, Aggregate Root의 경계를 명확히 하고, 비즈니스 로직을 도메인 모델 내부로 응집시킵니다.",
      },
      {
        time: "42:50",
        text: "주의할 점은 synchronized 블록이나 네이티브 I/O 호출 시 발생하는 스레드 피닝(Thread Pinning) 현상이며, 이를 ReentrantLock으로 대체해야 합니다.",
      },
    ],
    summary: [
      "Java 21 Virtual Threads: 경량 사용자 공간 스레드로 전통적인 1:1 OS 플랫폼 스레드 풀 모델의 I/O 병목 해소.",
      "Spring Boot 3 설정: spring.threads.virtual.enabled=true 선언만으로 리액티브 프로그래밍의 복잡도 없이 높은 처리량 달성.",
      "Thread Pinning 트러블슈팅: synchronized 키워드 대신 ReentrantLock을 사용하여 캐리어 스레드 고착화 방지.",
    ],
    keywords: ["#Java21", "#VirtualThreads", "#SpringBoot3", "#DDD", "#ThreadPinning"],
    quizzes: [
      {
        id: 1,
        question: "Java 21 가상 스레드(Virtual Threads)의 가장 핵심적인 설계 목표는 무엇인가요?",
        options: [
          "초당 연산 속도를 1,000배 높이는 CPU 하드웨어 오버클럭",
          "I/O 블로킹이 잦은 서버 환경에서 수백만 개의 경량 스레드를 적은 메모리로 구동하여 높은 동시 처리량 달성",
          "GUI 윈도우 그래픽 렌더링 전용 가속",
          "파이썬 스크립트 강제 컴파일",
        ],
        answerIndex: 1,
        explanation: "가상 스레드는 OS 스레드와 1:1 매핑되지 않는 경량 유저 스레드로, DB 조회 및 네트워크 I/O 대기 시 캐리어 스레드를 언마운트하여 높은 처리량을 제공합니다.",
        sourceTimestamp: "01:45",
      },
      {
        id: 2,
        question: "강의 [15:20]에서 Spring Boot 3 환경에서 톰캣 서블릿 컨테이너의 요청 처리를 가상 스레드로 전환하기 위한 프로퍼티는?",
        options: [
          "spring.threads.virtual.enabled=true",
          "server.port=8080",
          "logging.level.root=DEBUG",
          "spring.datasource.url=h2",
        ],
        answerIndex: 0,
        explanation: "Spring Boot 3.2 이상에서는 spring.threads.virtual.enabled=true 설정 시 내장 톰캣의 Executor가 Executors.newVirtualThreadPerTaskExecutor()로 자동 대체됩니다.",
        sourceTimestamp: "15:20",
      },
      {
        id: 3,
        question: "강의 [42:50]에서 가상 스레드가 OS 플랫폼 스레드에 고착되어 언마운트되지 못하는 'Thread Pinning'을 유발하는 자바 키워드와 그 해결책은?",
        options: [
          "synchronized 블록 → ReentrantLock으로 대체",
          "public static void main → private로 변경",
          "import java.util → 전부 주석 처리",
          "final 키워드 → volatile로 변경",
        ],
        answerIndex: 0,
        explanation: "synchronized 블록이나 네이티브 메서드 내부에서 블로킹이 발생하면 캐리어 스레드가 피닝(Pinning)되므로 java.util.concurrent.locks.ReentrantLock 사용이 권장됩니다.",
        sourceTimestamp: "42:50",
      },
    ],
  },
];

export function AiReviewView() {
  const [inputUrl, setInputUrl] = React.useState(PRESET_VIDEOS[0].url);
  const [currentVideo, setCurrentVideo] = React.useState<VideoReviewData>(PRESET_VIDEOS[0]);
  const [isExtracting, setIsExtracting] = React.useState(false);
  const [extractionStep, setExtractionStep] = React.useState<string>("");
  const [extractionProgress, setExtractionProgress] = React.useState<number>(0);

  // Anti-cheating Toggle for AI Summary (Closed by default to prevent cheating during quizzes!)
  const [isSummaryOpen, setIsSummaryOpen] = React.useState(false);

  // Transcript Collapsible Toggle
  const [isTranscriptOpen, setIsTranscriptOpen] = React.useState(false);
  const [isCopiedTranscript, setIsCopiedTranscript] = React.useState(false);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = React.useState<Record<number, number>>({});

  // Preset Selection with cinematic, presentation-ready loading delays
  const handleSelectPreset = (preset: VideoReviewData) => {
    setInputUrl(preset.url);
    setIsExtracting(true);
    setExtractionProgress(15);
    setExtractionStep("유튜브 영상 메타데이터 및 Java & MSA 커리큘럼 음성 트랙 파싱 중...");
    setSelectedAnswers({});
    setIsSummaryOpen(false);

    // Step 2 (1,000ms)
    setTimeout(() => {
      setExtractionProgress(48);
      setExtractionStep(`한국어 CC 자막 스트림 추출 중 (총 ${preset.charCount.toLocaleString()}자 파싱 및 타임스탬프 색인)...`);
    }, 1000);

    // Step 3 (2,400ms)
    setTimeout(() => {
      setExtractionProgress(85);
      setExtractionStep("Gemini 1.5 Pro 기반 Java/MSA 도메인 핵심 3-Point 요약 & 객관식 퀴즈 3문항 생성 중...");
    }, 2400);

    // Step 4 Complete (3,800ms)
    setTimeout(() => {
      setExtractionProgress(100);
      setExtractionStep("AI 자막 싱크 동기화 및 퀴즈 파이프라인 생성 완료!");
    }, 3800);

    // Final finish (4,400ms)
    setTimeout(() => {
      setIsExtracting(false);
      setCurrentVideo(preset);
      setExtractionStep("");
      setExtractionProgress(0);
    }, 4400);
  };

  const handleStartExtraction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    const matched = PRESET_VIDEOS.find(
      (p) => p.url.trim().toLowerCase() === inputUrl.trim().toLowerCase()
    );

    setIsExtracting(true);
    setExtractionProgress(15);
    setExtractionStep("유튜브 URL 유효성 검증 및 음성 스트림 파싱 중...");
    setSelectedAnswers({});
    setIsSummaryOpen(false);

    setTimeout(() => {
      setExtractionProgress(52);
      setExtractionStep("Whisper 음성 인식 & 한국어 강의 자막 타임스탬프 추출 중...");
    }, 1100);

    setTimeout(() => {
      setExtractionProgress(88);
      setExtractionStep("Java & MSA 핵심 아키텍처 요약 및 이해도 점검 퀴즈 3문항 생성 중...");
    }, 2500);

    setTimeout(() => {
      setExtractionProgress(100);
      setExtractionStep("AI 복습 데이터 동기화 완료!");
    }, 3800);

    setTimeout(() => {
      setIsExtracting(false);
      setExtractionStep("");
      setExtractionProgress(0);

      if (matched) {
        setCurrentVideo(matched);
      } else {
        const customData: VideoReviewData = {
          id: `custom-${Date.now()}`,
          url: inputUrl,
          title: `[Java & MSA 특강] ${inputUrl.replace(/https?:\/\/(www\.)?/, "").slice(0, 36)}...`,
          instructor: "LG CNS 마이크로서비스 강사진",
          duration: "42분 10초",
          thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80",
          charCount: 6520,
          subtitles: [
            {
              time: "00:20",
              text: "입력하신 유튜브 영상의 자막 스트림에서 Java 기반 MSA 백엔드 아키텍처 강의 내용이 정상 추출되었습니다.",
            },
            {
              time: "10:15",
              text: "서비스 경계 컨텍스트(Bounded Context) 분리와 Spring Boot 기반 독립 배포 파이프라인의 핵심 전략을 학습합니다.",
            },
            {
              time: "24:30",
              text: "비동기 메시지 브로커를 활용한 최종 일관성과 데드 레터 큐(DLQ)를 통한 장애 격리 패턴을 실습합니다.",
            },
            {
              time: "37:50",
              text: "마지막으로 클라우드 인프라(Kubernetes) 상에서의 파드 스케일아웃 및 헬스 체크 엔드포인트 구성을 점검합니다.",
            },
          ],
          summary: [
            "도메인 경계 분리: Bounded Context 기준의 자율적인 서비스 모델링 및 API 계약 정의.",
            "비동기 이벤트 파이프라인: Kafka/RabbitMQ 기반의 느슨한 결합 및 장애 전파 격리 달성.",
            "컨테이너 오케스트레이션: Kubernetes 환경에서의 무중단 롤링 배포 및 관측 가능성(Observability) 확보.",
          ],
          keywords: ["#JavaMSA", "#SpringBoot3", "#Kafka", "#Kubernetes", "#AM_Inspire6"],
          quizzes: [
            {
              id: 1,
              question: "추출된 자막 [10:15]에서 강조된 도메인 주도 설계(DDD) 기반 MSA 분리의 핵심 개념은?",
              options: [
                "바운디드 컨텍스트 (Bounded Context) 경계 분리",
                "모든 DB 테이블 하나의 물리 스키마로 병합",
                "서버 강제 재부팅",
                "단순 텍스트 메모장으로 코딩",
              ],
              answerIndex: 0,
              explanation: "바운디드 컨텍스트는 도메인 모델의 적용 범위를 명확히 규정하여 마이크로서비스 간 책임과 경계를 나누는 기초입니다.",
              sourceTimestamp: "10:15",
            },
            {
              id: 2,
              question: "자막 [24:30]에서 비동기 메시지 처리 중 반복 실패하는 메시지를 격리하기 위해 사용하는 큐는?",
              options: [
                "Dead Letter Queue (DLQ, 데드 레터 큐)",
                "브라우저 캐시 스토리지",
                "FTP 다운로드 폴더",
                "Windows 휴지통",
              ],
              answerIndex: 0,
              explanation: "DLQ(Dead Letter Queue)는 정상 소비되지 못하고 실패한 메시지를 별도로 모아 시스템 마비를 방지하고 원인을 분석하는 큐입니다.",
              sourceTimestamp: "24:30",
            },
            {
              id: 3,
              question: "자막 [37:50]의 클라우드 배포 체크리스트 중 서비스 안정성을 위한 모니터링 기법은?",
              options: [
                "Kubernetes Liveness/Readiness 헬스 체크 프로브",
                "단순 모니터 화면 쳐다보기",
                "로그 파일 수동 삭제",
                "스레드 덤프 무시",
              ],
              answerIndex: 0,
              explanation: "쿠버네티스의 Liveness/Readiness 프로브는 파드의 생존과 트래픽 수신 준비 상태를 자동으로 검증하여 무중단 서비스를 유지합니다.",
              sourceTimestamp: "37:50",
            },
          ],
        };
        setCurrentVideo(customData);
      }
    }, 4400);
  };

  const handleCopyTranscript = () => {
    const fullText = currentVideo.subtitles
      .map((s) => `[${s.time}] ${s.text}`)
      .join("\n");
    navigator.clipboard.writeText(fullText);
    setIsCopiedTranscript(true);
    setTimeout(() => setIsCopiedTranscript(false), 2000);
  };

  const handleSelectOption = (quizId: number, optionIdx: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [quizId]: optionIdx,
    }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = currentVideo.quizzes.filter(
    (q) => selectedAnswers[q.id] === q.answerIndex
  ).length;

  return (
    <div className="space-y-6">
      {/* Top Banner with refined UI/UX Typography */}
      <div className="rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-500/10 via-purple-500/10 to-indigo-500/10 p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-red-600 text-white shadow-xs">
              <YoutubeIcon className="size-4" />
            </span>
            <h2 className="text-base sm:text-lg font-bold tracking-tight text-foreground flex items-center gap-2">
              YouTube 강의 자막 기반 AI 복습 & 퀴즈 엔진
              <Badge className="text-[10px] bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold uppercase px-2 py-0.2">
                BETA
              </Badge>
            </h2>
          </div>
          <p className="text-xs sm:text-[13px] text-muted-foreground leading-[1.72] tracking-[-0.012em]">
            유튜브 강의 영상 URL을 입력하면 <b>한국어 자막(CC)을 자동으로 파싱</b>하여, <b>Java & 마이크로서비스(MSA)</b> 핵심 요약과 맞춤 데일리 점검 퀴즈를 생성합니다.
          </p>
        </div>

        <Badge variant="outline" className="text-xs bg-background/80 font-mono font-semibold shrink-0 gap-1.5 self-start md:self-auto py-1">
          <Sparkles className="size-3 text-primary" />
          Java/MSA & Gemini Pipeline
        </Badge>
      </div>

      {/* Step 1: YouTube URL Input & Preset Pills */}
      <Card className="border-border/70 shadow-xs">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-muted/20">
          <CardTitle className="text-sm font-bold flex items-center gap-2 tracking-tight">
            <YoutubeIcon className="size-4 text-red-600" />
            1. 유튜브 강의 영상 URL 입력
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground leading-relaxed">
            수강 중인 Java & MSA 관련 특강 또는 공식 녹화본 링크를 입력하면 실시간 자막을 분석합니다.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-4">
          <form onSubmit={handleStartExtraction} className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <YoutubeIcon className="absolute left-3.5 top-3 size-4 text-red-500 pointer-events-none" />
              <Input
                placeholder="https://www.youtube.com/watch?v=..."
                className="pl-10 text-xs h-10 tracking-tight font-mono"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                required
              />
            </div>
            <Button
              type="submit"
              disabled={isExtracting}
              className="h-10 text-xs font-semibold px-5 gap-1.5 bg-red-600 hover:bg-red-700 text-white shrink-0 shadow-xs cursor-pointer"
            >
              <Subtitles className={`size-3.5 ${isExtracting ? "animate-pulse" : ""}`} />
              {isExtracting ? "자막 분석 연출 중..." : "자막 추출 및 AI 분석"}
            </Button>
          </form>

          {/* Preset Buttons: 100% Java & MSA Curriculum */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-muted-foreground tracking-tight">
                빠른 시연용 Java & MSA 공식 특강 프리셋:
              </span>
              <span className="text-[10px] text-muted-foreground font-mono">
                클릭 시 약 4초간 실감나는 AI 분석 연출 진행
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {PRESET_VIDEOS.map((preset, idx) => (
                <button
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  disabled={isExtracting}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all text-left border flex items-center gap-1.5 cursor-pointer ${
                    currentVideo.id === preset.id
                      ? "bg-red-500/10 border-red-500/40 text-red-700 dark:text-red-400 font-semibold shadow-2xs"
                      : "bg-muted/50 border-border hover:bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Play className="size-3 text-red-600 shrink-0" />
                  <span className="tracking-tight">
                    추천 {idx + 1}: {preset.title.split("]")[0]}] {preset.keywords[1]}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Cinematic Extraction Loading Animation with percentage counter */}
          {isExtracting && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 sm:p-5 space-y-3 animate-in fade-in-50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-2 tracking-tight">
                  <RefreshCw className="size-4 animate-spin text-red-600" />
                  {extractionStep}
                </span>
                <span className="font-mono text-xs font-bold text-red-700 dark:text-red-400">
                  {extractionProgress}%
                </span>
              </div>
              <div className="h-2 w-full bg-red-500/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-600 via-rose-500 to-indigo-600 rounded-full transition-all duration-700"
                  style={{ width: `${extractionProgress}%` }}
                />
              </div>
              <div className="flex justify-between text-[11px] text-muted-foreground font-mono">
                <span>Whisper Audio Engine</span>
                <span>Gemini 1.5 Pro Pipeline</span>
                <span>MSA Ontology Mapping</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Extracted Video Metadata & Subtitles (Transcript) */}
      <Card className="border-border/70 shadow-xs overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-b">
          {/* Thumbnail & Video Info Preview */}
          <div className="md:col-span-5 relative group bg-zinc-950 overflow-hidden min-h-[170px] md:min-h-full flex items-center justify-center">
            <div
              className="absolute inset-0 bg-cover bg-center opacity-70 group-hover:scale-105 transition-transform duration-500"
              style={{ backgroundImage: `url(${currentVideo.thumbnail})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

            <div className="relative z-10 p-5 text-white space-y-2 w-full">
              <div className="flex items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <YoutubeIcon className="size-3" /> JAVA & MSA CC
                </span>
                <span className="bg-black/60 backdrop-blur-xs text-[10px] font-mono px-2 py-0.5 rounded text-zinc-300">
                  {currentVideo.duration}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-bold leading-snug tracking-tight text-white line-clamp-2">
                {currentVideo.title}
              </h3>
              <p className="text-xs text-zinc-300 font-medium tracking-tight">
                {currentVideo.instructor}
              </p>
            </div>
          </div>

          {/* Subtitle Extraction Metadata Card */}
          <div className="md:col-span-7 p-4 sm:p-5 space-y-3.5 bg-card flex flex-col justify-between">
            <div className="space-y-2.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-bold text-foreground flex items-center gap-1.5 tracking-tight">
                  <CheckCircle2 className="size-3.5 text-emerald-600" />
                  한국어 강의 자막(Closed Caption) 추출 완료
                </span>
                <span className="text-xs font-mono font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded">
                  총 {currentVideo.charCount.toLocaleString()}자 파싱됨
                </span>
              </div>

              <p className="text-xs sm:text-[13px] text-muted-foreground leading-[1.72] tracking-[-0.012em]">
                영상 타임라인별 음성 싱크가 매칭된 총 <b>{currentVideo.subtitles.length}개 핵심 MSA 세그먼트</b>가 추출되었습니다.
              </p>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentVideo.keywords.map((kw) => (
                  <Badge key={kw} variant="secondary" className="text-[10px] font-mono py-0.5 px-2">
                    {kw}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Toggle Full Transcript Button */}
            <div className="pt-2 flex items-center justify-between border-t text-xs">
              <button
                onClick={() => setIsTranscriptOpen(!isTranscriptOpen)}
                className="text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer tracking-tight"
              >
                <FileText className="size-3.5" />
                <span>
                  {isTranscriptOpen ? "추출 자막 원문 접기 ▲" : "추출된 자막 타임라인 원문 보기 ▼"}
                </span>
              </button>

              <span className="text-[11px] text-muted-foreground">자막 기반 퀴즈 생성 완료</span>
            </div>
          </div>
        </div>

        {/* Collapsible Transcript Detail Area */}
        {isTranscriptOpen && (
          <div className="p-4 sm:p-5 bg-muted/20 border-t space-y-3 animate-in fade-in-50">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-foreground flex items-center gap-1.5 tracking-tight">
                <Subtitles className="size-3.5 text-red-600" />
                타임라인별 추출 자막 세그먼트
              </h4>
              <button
                onClick={handleCopyTranscript}
                className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-medium px-2.5 py-1 rounded bg-muted hover:bg-muted/80 transition-colors cursor-pointer"
              >
                {isCopiedTranscript ? (
                  <>
                    <Check className="size-3 text-emerald-600" />
                    <span className="text-emerald-600 font-bold">복사 완료!</span>
                  </>
                ) : (
                  <>
                    <Copy className="size-3" />
                    <span>자막 전체 복사</span>
                  </>
                )}
              </button>
            </div>

            <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
              {currentVideo.subtitles.map((sub, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-xl bg-card border text-xs"
                >
                  <span className="font-mono text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                    {sub.time}
                  </span>
                  <p className="text-foreground/90 leading-[1.72] tracking-[-0.012em]">
                    {sub.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Step 3: Dual Column - Anti-Cheating Summary (Toggle) & Daily Check Quiz */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 Cols): AI Core Summary (Anti-Cheating Collapsible Panel) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-indigo-500/30 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-indigo-500/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-2 tracking-tight">
                  <Sparkles className="size-4 text-indigo-500" />
                  AI 핵심 요약 (3-Point Summary)
                </CardTitle>

                {/* Anti-cheating Toggle Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSummaryOpen(!isSummaryOpen)}
                  className={`h-7 px-2.5 text-xs font-semibold gap-1.5 cursor-pointer ${
                    isSummaryOpen
                      ? "border-amber-500/40 text-amber-600 dark:text-amber-400 hover:bg-amber-500/10"
                      : "border-indigo-500/40 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/10"
                  }`}
                >
                  {isSummaryOpen ? (
                    <>
                      <EyeOff className="size-3" />
                      <span>컨닝 방지용 숨기기</span>
                    </>
                  ) : (
                    <>
                      <Eye className="size-3" />
                      <span>핵심 요약 열기</span>
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-4">
              {!isSummaryOpen ? (
                /* Hidden/Locked State for Anti-Cheating */
                <div className="py-9 px-4 rounded-xl border border-dashed border-amber-500/40 bg-amber-500/5 text-center space-y-3">
                  <div className="size-9 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
                    <Lock className="size-4" />
                  </div>
                  <div className="space-y-1.5">
                    <p className="text-xs font-bold text-foreground tracking-tight">
                      🔒 컨닝 방지 모드 활성화됨
                    </p>
                    <p className="text-[11.5px] text-muted-foreground leading-[1.68] tracking-[-0.01em] max-w-xs mx-auto">
                      퀴즈 풀이 중 핵심 요약이 스포일러가 되지 않도록 닫아두었습니다. 퀴즈를 모두 푼 뒤 복습용으로 열어보세요!
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsSummaryOpen(true)}
                    className="text-xs h-7.5 font-medium gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
                  >
                    <Unlock className="size-3" />
                    그래도 요약 열람하기
                  </Button>
                </div>
              ) : (
                /* Expanded Summary Content */
                <div className="space-y-3.5 animate-in fade-in-50">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 text-xs flex items-center justify-between">
                    <span className="font-semibold flex items-center gap-1.5 tracking-tight">
                      <Lightbulb className="size-3.5 text-indigo-500" />
                      자막 기반 Java & MSA 3대 핵심 포인트
                    </span>
                    <button
                      onClick={() => setIsSummaryOpen(false)}
                      className="text-[11px] text-muted-foreground hover:text-foreground underline cursor-pointer"
                    >
                      다시 숨기기
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    {currentVideo.summary.map((point, idx) => (
                      <div
                        key={idx}
                        className="flex items-start gap-3 p-3.5 rounded-xl border bg-card text-xs text-foreground/90"
                      >
                        <span className="size-5 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5 font-mono">
                          {idx + 1}
                        </span>
                        <p className="leading-[1.78] tracking-[-0.012em] text-foreground/85">
                          {point}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-1.5 text-xs">
                    <span className="text-[11px] font-semibold text-muted-foreground tracking-tight">
                      추출 연관 토큰:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {currentVideo.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="font-mono text-[10px] px-2 py-0.5 rounded bg-muted text-muted-foreground"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column (7 Cols): Dynamic Daily Check Quizzes */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-border/70 shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 border-b bg-muted/20">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="space-y-1">
                  <CardTitle className="text-sm sm:text-base font-bold flex items-center gap-2 tracking-tight">
                    <HelpCircle className="size-4 text-primary" />
                    데일리 점검 퀴즈 (자막 기반 3문항)
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground leading-relaxed">
                    강의 자막에서 직접 추출된 핵심 Java & MSA 개념을 객관식 퀴즈로 자가 진단합니다.
                  </CardDescription>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge variant="outline" className="text-xs font-mono font-bold">
                    진행: {answeredCount} / {currentVideo.quizzes.length}
                  </Badge>
                  {answeredCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleResetQuiz}
                      className="h-7 text-xs text-muted-foreground hover:text-foreground gap-1 px-2 cursor-pointer"
                    >
                      <RotateCcw className="size-3" />
                      다시 풀기
                    </Button>
                  )}
                </div>
              </div>

              {/* Score Progress Bar */}
              {answeredCount > 0 && (
                <div className="pt-2 flex items-center justify-between text-xs text-muted-foreground">
                  <span className="tracking-tight">
                    현재 점수: <b>{correctCount}개 정답</b> (
                    {Math.round((correctCount / currentVideo.quizzes.length) * 100)}점)
                  </span>
                  {answeredCount === currentVideo.quizzes.length && (
                    <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                      🎉 전 문항 응시 완료!
                    </span>
                  )}
                </div>
              )}
            </CardHeader>

            <CardContent className="p-4 sm:p-5 space-y-5">
              {currentVideo.quizzes.map((quiz, qIdx) => {
                const selected = selectedAnswers[quiz.id];
                const isAnswered = selected !== undefined;
                const isCorrect = selected === quiz.answerIndex;

                return (
                  <div
                    key={quiz.id}
                    className="space-y-3 p-4 sm:p-4.5 rounded-xl border border-border/70 bg-card hover:border-primary/40 transition-colors"
                  >
                    {/* Question Header */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0 font-mono">
                          Q{qIdx + 1}
                        </span>
                        <h4 className="text-sm sm:text-[14.5px] font-semibold text-foreground leading-snug tracking-tight">
                          {quiz.question}
                        </h4>
                      </div>

                      <span className="text-[10px] font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded shrink-0 flex items-center gap-1">
                        <Clock className="size-2.5" /> 자막 {quiz.sourceTimestamp}
                      </span>
                    </div>

                    {/* Options (1, 2, 3, 4) */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {quiz.options.map((opt, optIdx) => {
                        const isChosen = selected === optIdx;

                        let optionStyle =
                          "bg-muted/30 border-border/70 hover:bg-muted text-foreground";
                        if (isAnswered) {
                          if (optIdx === quiz.answerIndex) {
                            optionStyle =
                              "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold";
                          } else if (isChosen && !isCorrect) {
                            optionStyle =
                              "bg-destructive/10 border-destructive text-destructive font-bold";
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            onClick={() => handleSelectOption(quiz.id, optIdx)}
                            className={`p-3 rounded-lg text-left text-xs sm:text-[13px] transition-all border flex items-center gap-2.5 cursor-pointer ${optionStyle}`}
                          >
                            <span
                              className={`size-5 rounded-full text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                                isChosen
                                  ? isCorrect
                                    ? "bg-emerald-600 text-white"
                                    : "bg-destructive text-white"
                                  : "bg-muted text-muted-foreground"
                              }`}
                            >
                              {optIdx + 1}
                            </span>
                            <span className="leading-[1.6] tracking-[-0.01em]">
                              {opt}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Feedback & Source Explanation */}
                    {isAnswered && (
                      <div
                        className={`p-3.5 rounded-xl text-xs sm:text-[12.5px] leading-[1.75] tracking-[-0.01em] mt-2 border ${
                          isCorrect
                            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-900 dark:text-emerald-200"
                            : "bg-amber-500/10 border-amber-500/30 text-amber-900 dark:text-amber-200"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5 mb-1 tracking-tight">
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="size-4 text-emerald-600 dark:text-emerald-400" />
                              <span>정답입니다!</span>
                            </>
                          ) : (
                            <>
                              <Lightbulb className="size-4 text-amber-600 dark:text-amber-400" />
                              <span>
                                오답입니다. (정답: <b>{quiz.answerIndex + 1}번</b>)
                              </span>
                            </>
                          )}
                        </div>
                        <p className="leading-[1.75] pl-5.5 opacity-90">
                          {quiz.explanation}
                        </p>
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
