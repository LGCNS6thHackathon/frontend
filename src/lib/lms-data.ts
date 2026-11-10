export interface UserProfile {
  name: string;
  course: string;
  generation: string;
  email: string;
  phone: string;
  attendanceRate: number; // e.g. 98.5
  unitPeriodAttendance: number; // e.g. 100
  totalTrainingDays: number;
  attendedDays: number;
  lateDays: number;
  absentDays: number;
  awsAccountId: string;
  awsIamUser: string;
  awsRegion: string;
  allowanceBank: string;
  allowanceAccount: string;
}

export interface TodaySchedule {
  date: string;
  dayOfWeek: string;
  dayCount: string; // e.g. "해커톤_1일차"
  subject: string;
  instructor: string;
  time: string;
  location: string;
  zepUrl: string;
  detectUrl: string;
  materialUrl: string;
  attendanceStatus: "출석" | "지각" | "조퇴" | "결석" | "대기";
  replayAvailable: boolean;
  replayUrl?: string;
  topics: string[];
}

export interface NoticeItem {
  id: number;
  category: "필독" | "공지" | "자료" | "시스템";
  title: string;
  author: string;
  createdAt: string;
  views: number;
  isPinned: boolean;
  isNew: boolean;
  content: string;
}

export interface QnaItem {
  id: number;
  title: string;
  category: "Next.js" | "React" | "AWS" | "FastAPI" | "일반";
  author: string;
  createdAt: string;
  status: "답변완료" | "답변대기";
  views: number;
  likes: number;
  content: string;
  codeSnippet?: string;
  answers: {
    author: string;
    role: "멘토" | "강사" | "수강생";
    createdAt: string;
    content: string;
  }[];
}

export interface EvaluationItem {
  id: number;
  title: string;
  round: string; // "1차", "2차", "3차"
  testDate: string;
  myScore: number;
  avgScore: number;
  highestScore: number;
  rank: string; // "Top 10%"
  radarMetrics: {
    subject: string;
    myScore: number;
    avgScore: number;
    fullScore: number;
  }[];
  feedback: string;
}

export interface VideoTimelineChapter {
  timeStr: string;
  title: string;
  isExamPoint?: boolean;
}

export interface LectureVideoClip {
  lectureDay: string;
  lectureTitle: string;
  instructor: string;
  duration: string;
  clipStartTime: string;
  clipEndTime: string;
  instructorQuote: string;
  chapters: VideoTimelineChapter[];
}

export interface EvaluationQuestion {
  id: number;
  examId: number;
  category: "Java" | "MSA" | "Cloud" | "React" | "Database" | "HTML/CSS";
  level: "초급" | "중급" | "고급";
  points: number;
  question: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  userAnswerIndex?: number;
  explanation: string;
  relatedAiTopic?: string;
  videoClip?: LectureVideoClip;
}

export interface EvaluationMeta {
  id: number;
  round: string;
  course: string;
  testDate: string;
  timeLimit: string;
  questionCount: number;
  status: "완료" | "응시 가능" | "예정";
  myScore?: number;
  avgScore?: number;
  highestScore?: number;
  rank?: string;
  canTakeExam?: boolean;
  radarMetrics?: EvaluationItem["radarMetrics"];
  feedback?: string;
}

export interface AssignmentItem {
  id: number;
  title: string;
  subject: string;
  dueDate: string;
  dDay: string; // "D-2", "D-Day", "제출완료"
  status: "제출완료" | "미제출" | "채점완료";
  author: string;
  description: string;
  submissionDate?: string;
  feedback?: {
    mentor: string;
    score: string;
    comment: string;
  };
}

export interface ReplayLecture {
  id: number;
  date: string;
  title: string;
  subject: string;
  instructor: string;
  duration: string;
  videoUrl: string;
  keyTopics: string[];
  hasAiSummary: boolean;
}

export const INITIAL_USER: UserProfile = {
  name: "윤창일",
  course: "LG CNS AM Inspire Camp",
  generation: "6기",
  email: "changil.yoon@inspire6.dev",
  phone: "010-8293-4921",
  attendanceRate: 98.5,
  unitPeriodAttendance: 100,
  totalTrainingDays: 120,
  attendedDays: 68,
  lateDays: 1,
  absentDays: 0,
  awsAccountId: "9823-1049-2810",
  awsIamUser: "inspire6-changil",
  awsRegion: "ap-northeast-2 (서울)",
  allowanceBank: "신한은행",
  allowanceAccount: "110-384-918234",
};

export const TODAY_SCHEDULE: TodaySchedule = {
  date: "2026. 11. 09 (월)",
  dayOfWeek: "월요일",
  dayCount: "해커톤 1일차 (Day 69/120)",
  subject: "LG CNS AM Inspire Camp 6기",
  instructor: "홍길동 멘토",
  time: "09:00 ~ 18:00 (총 8시간)",
  location: "다산로36길 11, 동산빌딩 4층 / 온·오프라인 병행",
  zepUrl: "https://zep.us/@lgam06",
  detectUrl: "https://lms.wsts.kr/detection/student?classId=114",
  materialUrl: "https://lms.wsts.kr/materials/day69.pdf",
  attendanceStatus: "출석",
  replayAvailable: true,
  replayUrl: "https://lms.wsts.kr/replay/day68",
  topics: ["Next.js 15 App Router", "Tailwind CSS v4", "shadcn UI Customization", "LMS UX Overhaul"],
};

export const INITIAL_NOTICES: NoticeItem[] = [
  {
    id: 1,
    category: "필독",
    title: "[필독] 11월 9일(월) 해커톤 1일차 팀별 깃허브 레포지토리 제출 안내",
    author: "교육운영국",
    createdAt: "2026-11-09",
    views: 142,
    isPinned: true,
    isNew: true,
    content: "해커톤 1일차 18:00까지 팀별 대표 레포지토리 주소 및 배포 URL을 과제 제출 탭에 등록해 주시기 바랍니다.",
  },
  {
    id: 2,
    category: "공지",
    title: "[특강 공지] 생성형 AI 기반 웹 서비스 아키텍처 실무 특강 (11/12 목)",
    author: "김태호 강사",
    createdAt: "2026-11-08",
    views: 230,
    isPinned: true,
    isNew: true,
    content: "LG CNS 현직 엔지니어가 직접 전수하는 엔터프라이즈 레벨의 RAG & LLM 파이프라인 연동 실무 특강이 진행됩니다.",
  },
  {
    id: 3,
    category: "공지",
    title: "11월 훈련수당 지급을 위한 단위기간(4회차) 출결 확인 및 소명 마감",
    author: "행정지원팀",
    createdAt: "2026-11-07",
    views: 310,
    isPinned: false,
    isNew: false,
    content: "4회차 단위기간 출결 데이터에 이상이 있는 수강생은 마이페이지 또는 캘린더에서 11월 10일까지 소명 신청서를 제출 바랍니다.",
  },
  {
    id: 4,
    category: "시스템",
    title: "[시스템] 해커톤 프로젝트용 AWS 크레딧($200) 충전 및 IAM 계정 설정 가이드",
    author: "클라우드 멘토단",
    createdAt: "2026-11-05",
    views: 405,
    isPinned: false,
    isNew: false,
    content: "각 팀의 AWS IAM 계정으로 200달러 상당의 크레딧이 충전되었습니다. 마이페이지 > AWS 계정 정보 탭에서 자격증명을 확인하세요.",
  },
  {
    id: 5,
    category: "자료",
    title: "[강의 자료] 클라우드 네이티브 MSA 3차 역량평가 대비 실습 교안 및 레퍼런스",
    author: "교육운영국",
    createdAt: "2026-11-03",
    views: 520,
    isPinned: false,
    isNew: false,
    content: "Docker, Kubernetes, CI/CD 파이프라인 종합 실습 역량평가 대비 강의 자료와 치트시트가 배포되었습니다.",
  },
  {
    id: 6,
    category: "자료",
    title: "[템플릿 자료] Next.js 15 & shadcn/ui 기반 스타터 킷 및 디자인 가이드라인",
    author: "이지은 디자이너",
    createdAt: "2026-11-02",
    views: 612,
    isPinned: false,
    isNew: false,
    content: "해커톤 및 프론트엔드 프로젝트에 즉시 활용할 수 있는 Base UI 기반 shadcn 컴포넌트 프리셋과 Tailwind v4 테마 가이드입니다.",
  },
];

export const INITIAL_QNA: QnaItem[] = [
  {
    id: 101,
    title: "Next.js 15 App Router에서 Server Action과 Turbopack 빌드 오류 해결 방법 문의",
    category: "Next.js",
    author: "박서준",
    createdAt: "2026-11-09 10:24",
    status: "답변완료",
    views: 64,
    likes: 5,
    content: "Next.js 15.5 환경에서 Base UI 기반 shadcn 컴포넌트를 클라이언트 컴포넌트로 렌더링할 때 Hydration Mismatch 경고가 가끔 뜹니다. suppressHydrationWarning 외에 구조적인 해결책이 있을까요?",
    codeSnippet: `// app/page.tsx
"use client";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

export default function ModalDemo() {
  return <Dialog>...</Dialog>;
}`,
    answers: [
      {
        author: "최유진 멘토",
        role: "멘토",
        createdAt: "2026-11-09 11:15",
        content: "Base UI 컴포넌트는 SSR 시 브라우저 전용 속성(예: randomly generated ID)을 마운트 후에 확정합니다. useEffect로 마운트 여부를 체크하거나 컴포넌트 래퍼에 'use client'를 명시해주시면 말끔히 해결됩니다.",
      },
    ],
  },
  {
    id: 102,
    title: "Tailwind CSS v4에서 @theme inline 컬러 토큰을 shadcn 변수와 연동하는 패턴",
    category: "React",
    author: "김지민",
    createdAt: "2026-11-08 16:40",
    status: "답변완료",
    views: 92,
    likes: 8,
    content: "Tailwind v4는 tailwind.config.ts 없이 globals.css의 @theme inline 지시자를 사용하더군요. 다크모드(.dark) 클래스 기반 전환 시 oklch 색상 오버라이딩 팁 공유 부탁드립니다.",
    answers: [
      {
        author: "김민수 강사",
        role: "강사",
        createdAt: "2026-11-08 17:30",
        content: "globals.css 상단에 @custom-variant dark (&:is(.dark *));를 선언하고, :root와 .dark 선택자에서 --primary 등의 CSS 변수 값을 각각 정의하면 아주 자연스럽게 테마가 변경됩니다.",
      },
    ],
  },
  {
    id: 103,
    title: "AWS ECS Fargate 배포 시 VPC 서브넷 라우팅 테이블 관련 질문",
    category: "AWS",
    author: "이동현",
    createdAt: "2026-11-09 14:10",
    status: "답변대기",
    views: 18,
    likes: 1,
    content: "퍼블릭 서브넷에 ALB를 두고 프라이빗 서브넷에 ECS 태스크를 띄웠는데 ECR 이미지 풀 과정에서 Timeout 에러가 납니다. NAT Gateway 엔드포인트를 따로 뚫어주어야 하나요?",
    answers: [],
  },
  {
    id: 104,
    title: "FastAPI 비동기 SQLAlchemy 세션 관리 시 'PendingRollbackError' 트러블슈팅",
    category: "FastAPI",
    author: "정현우",
    createdAt: "2026-11-08 14:20",
    status: "답변완료",
    views: 110,
    likes: 12,
    content: "FastAPI Depends(get_db)를 통해 AsyncSession을 주입받아 사용할 때, 트랜잭션 중 예외가 발생하면 이후 쿼리에서 PendingRollbackError가 지속 발생합니다. 올바른 컨텍스트 매니저 사용 패턴이 궁금합니다.",
    codeSnippet: `@app.get("/items/{item_id}")
async def read_item(item_id: int, db: AsyncSession = Depends(get_db)):
    try:
        return await crud.get_item(db, item_id)
    except Exception:
        await db.rollback()
        raise`,
    answers: [
      {
        author: "최유진 멘토",
        role: "멘토",
        createdAt: "2026-11-08 15:02",
        content: "AsyncSession의 lifespan을 각 요청마다 깔끔히 격리하기 위해 async with AsyncSessionLocal() as session: 블록을 Depends 제너레이터 함수 내에 구현하고 yield 처리하는 것을 권장합니다. 에러 시 자동 롤백되며 누수가 방지됩니다.",
      },
    ],
  },
];

export const INITIAL_EVALUATIONS: EvaluationItem[] = [
  {
    id: 1,
    title: "1차 기초 프로그래밍 & 웹 아키텍처 역량평가",
    round: "1차",
    testDate: "2026-08-25",
    myScore: 94,
    avgScore: 82,
    highestScore: 100,
    rank: "상위 8%",
    radarMetrics: [
      { subject: "프론트엔드 (React/TS)", myScore: 95, avgScore: 80, fullScore: 100 },
      { subject: "백엔드 (API/DB)", myScore: 92, avgScore: 81, fullScore: 100 },
      { subject: "클라우드 (AWS)", myScore: 90, avgScore: 78, fullScore: 100 },
      { subject: "AI/데이터 분석", myScore: 96, avgScore: 84, fullScore: 100 },
      { subject: "협업 & Git 커뮤니케이션", myScore: 97, avgScore: 87, fullScore: 100 },
    ],
    feedback: "웹 프런트엔드와 AI 파이프라인 이해도가 매우 우수합니다. 비동기 상태 관리 기초가 매우 탄탄합니다.",
  },
  {
    id: 2,
    title: "2차 클라우드 MSA & 컨테이너 아키텍처 역량평가",
    round: "2차",
    testDate: "2026-10-15",
    myScore: 88,
    avgScore: 76,
    highestScore: 98,
    rank: "상위 12%",
    radarMetrics: [
      { subject: "프론트엔드 (React/TS)", myScore: 92, avgScore: 79, fullScore: 100 },
      { subject: "백엔드 (API/DB)", myScore: 88, avgScore: 77, fullScore: 100 },
      { subject: "클라우드 (AWS)", myScore: 84, avgScore: 72, fullScore: 100 },
      { subject: "AI/데이터 분석", myScore: 86, avgScore: 74, fullScore: 100 },
      { subject: "협업 & Git 커뮤니케이션", myScore: 90, avgScore: 80, fullScore: 100 },
    ],
    feedback: "Docker 기반 멀티 컨테이너 환경 구축에 성공했으나, Kubernetes 인그레스 라우팅 및 헬름 차트 작성 영역의 복습이 권장됩니다.",
  },
];

// ==========================================
// WSTS 공식 연동 역량평가 차수별 메타데이터 (https://lms.wsts.kr/evaluation/list 실사)
// ==========================================
export const WSTS_EVALUATIONS: EvaluationMeta[] = [
  {
    id: 1,
    round: "1차 사전평가",
    course: "풀스택(Full-Stack) AI서비스 개발",
    testDate: "2026.07.28 17:00 ~ 17:40",
    timeLimit: "40분",
    questionCount: 60,
    status: "완료",
    myScore: 46,
    avgScore: 57,
    highestScore: 92,
    rank: "상위 65%",
    radarMetrics: [
      { subject: "HTML/CSS 기초", myScore: 55, avgScore: 62, fullScore: 100 },
      { subject: "JavaScript 핵심", myScore: 42, avgScore: 56, fullScore: 100 },
      { subject: "React 프레임워크", myScore: 40, avgScore: 54, fullScore: 100 },
      { subject: "알고리즘 & 자료구조", myScore: 48, avgScore: 58, fullScore: 100 },
      { subject: "데이터베이스 (SQL)", myScore: 45, avgScore: 55, fullScore: 100 },
    ],
    feedback: "사전 진단 결과 자바스크립트 스코프/호이스팅 및 React 비동기 라이프사이클 영역의 선수 학습이 필요합니다.",
  },
  {
    id: 2,
    round: "1차 사후평가",
    course: "풀스택(Full-Stack) AI서비스 개발",
    testDate: "2026.10.28 17:00 ~ 17:40",
    timeLimit: "40분",
    questionCount: 80,
    status: "완료",
    myScore: 85,
    avgScore: 81,
    highestScore: 98,
    rank: "상위 18%",
    radarMetrics: [
      { subject: "HTML/CSS 마크업", myScore: 92, avgScore: 84, fullScore: 100 },
      { subject: "JavaScript/ES6+", myScore: 84, avgScore: 80, fullScore: 100 },
      { subject: "React 생태계", myScore: 88, avgScore: 82, fullScore: 100 },
      { subject: "REST API & 연동", myScore: 82, avgScore: 79, fullScore: 100 },
      { subject: "컴포넌트 설계", myScore: 84, avgScore: 80, fullScore: 100 },
    ],
    feedback: "사전평가 대비 +39점의 괄목할 성장을 이루었습니다. 모던 웹 컴포넌트 아키텍처와 상태 관리가 매우 안정적입니다.",
  },
  {
    id: 3,
    round: "2차 사전평가",
    course: "AM 기술(MSA, Cloud, Agile)",
    testDate: "2026.10.06 17:00 ~ 17:40",
    timeLimit: "40분",
    questionCount: 60,
    status: "완료",
    myScore: 57,
    avgScore: 68,
    highestScore: 95,
    rank: "상위 58%",
    radarMetrics: [
      { subject: "Java OOP & 기본기", myScore: 65, avgScore: 72, fullScore: 100 },
      { subject: "Spring Boot 기초", myScore: 58, avgScore: 69, fullScore: 100 },
      { subject: "MSA 개념", myScore: 52, avgScore: 65, fullScore: 100 },
      { subject: "Docker 컨테이너", myScore: 54, avgScore: 67, fullScore: 100 },
      { subject: "클라우드 인프라", myScore: 56, avgScore: 67, fullScore: 100 },
    ],
    feedback: "엔터프라이즈 MSA 및 컨테이너 가상화 기본기에 대한 이론적 배경 학습이 요구됩니다.",
  },
  {
    id: 4,
    round: "2차 사후평가",
    course: "AM 기술(MSA, Cloud, Agile)",
    testDate: "2026.10.30 17:10 ~ 17:50",
    timeLimit: "40분",
    questionCount: 80,
    status: "완료",
    myScore: 93,
    avgScore: 95,
    highestScore: 100,
    rank: "상위 10%",
    radarMetrics: [
      { subject: "Java 21 & 스프링 3", myScore: 95, avgScore: 94, fullScore: 100 },
      { subject: "MSA 분산 트랜잭션", myScore: 90, avgScore: 93, fullScore: 100 },
      { subject: "Kafka 이벤트 스트리밍", myScore: 92, avgScore: 95, fullScore: 100 },
      { subject: "Docker/K8s 배포", myScore: 94, avgScore: 96, fullScore: 100 },
      { subject: "애자일 스크럼 실무", myScore: 94, avgScore: 97, fullScore: 100 },
    ],
    feedback: "실무급 분산 아키텍처 구현 역량이 입증되었습니다. 클래스 평균 95점의 초고득점 그룹에 진입했습니다.",
  },
  {
    id: 5,
    round: "3차 종합 실무역량평가",
    course: "클라우드 네이티브 MSA & Spring Cloud 심화",
    testDate: "2026.11.09 (오늘 응시 가능)",
    timeLimit: "40분",
    questionCount: 15,
    status: "응시 가능",
    canTakeExam: true,
  },
];

// ==========================================
// 3차 실전 문제풀이 시험용 15문항 데이터셋
// ==========================================
export const INITIAL_EXAM_QUESTIONS: EvaluationQuestion[] = [
  {
    id: 1,
    examId: 5,
    category: "Java",
    level: "중급",
    points: 7,
    question: "Java 21의 가상 스레드(Virtual Threads)에 대한 설명으로 올바르지 않은 것은?",
    codeSnippet: `// Virtual Thread 생성 예시
try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
    IntStream.range(0, 10_000).forEach(i -> {
        executor.submit(() -> {
            Thread.sleep(Duration.ofSeconds(1));
            return i;
        });
    });
}`,
    options: [
      "가상 스레드는 OS 커널 스레드와 1:1로 매핑되는 무거운 플랫폼 스레드이다.",
      "블로킹 I/O 작업(네트워크, 디스크 I/O) 발생 시 캐리어 스레드를 양보(unmount)하여 높은 동시성을 달성한다.",
      "synchronized 블록이나 네이티브 메서드 호출 시 핀닝(Pinning) 현상이 발생하여 성능 저하가 일어날 수 있다.",
      "스레드 풀(Thread Pool)에 보관해 재사용하기보다는 작업당 하나의 가상 스레드를 새로 생성해 쓰고 버리는 패턴이 권장된다.",
    ],
    correctIndex: 0,
    explanation: "가상 스레드는 JVM 사용자 영역에서 관리되는 경량 스레드로, 소수의 OS 캐리어 스레드(Carrier Thread) 위에서 M:N 다중화(Multiplexing) 방식으로 동작합니다.",
    relatedAiTopic: "Java 21 가상 스레드 대규모 동시성",
    videoClip: {
      lectureDay: "Day 65 (10월 27일)",
      lectureTitle: "Java 21 가상 스레드 대규모 동시성과 스프링 부트 3 최적화",
      instructor: "김민수 강사",
      duration: "2시간 35분",
      clipStartTime: "24:15",
      clipEndTime: "28:40",
      instructorQuote: "가상 스레드는 커널 스레드 1:1 매핑이 아니라 경량 스레드로 M:N 스케줄링됩니다. 시험에서 플랫폼 스레드와의 구조적 차이를 꼭 기억하세요!",
      chapters: [
        { timeStr: "24:15", title: "가상 스레드 탄생 배경과 M:N 매핑 구조" },
        { timeStr: "25:50", title: "블로킹 I/O 시 캐리어 스레드 Unmount 원리", isExamPoint: true },
        { timeStr: "27:10", title: "synchronized 블록 핀닝(Pinning) 주의사항" },
      ],
    },
  },
  {
    id: 2,
    examId: 5,
    category: "MSA",
    level: "고급",
    points: 7,
    question: "마이크로서비스 환경에서 여러 서비스에 걸친 분산 트랜잭션을 처리하기 위한 Saga 패턴 중, 이벤트 브로커(Kafka 등)를 활용한 코레오그래피(Choreography) 방식의 특징으로 올바른 것은?",
    options: [
      "중앙 오케스트레이터 서비스가 모든 비즈니스 로직과 호출 순서를 중앙 집중식으로 통제한다.",
      "각 서비스가 도메인 이벤트를 발행하고 다른 서비스의 이벤트를 구독하여 자율적으로 로컬 트랜잭션을 실행하고 보상(Compensating) 트랜잭션을 처리한다.",
      "2단계 커밋(2-Phase Commit) 프로토콜을 기반으로 모든 참여 노드의 락을 획득하므로 강한 일관성(Strong Consistency)을 보장한다.",
      "서비스 간 결합도가 매우 높아 신규 서비스를 추가할 때마다 중앙 컨트롤러 코드를 반드시 수정해야 한다.",
    ],
    correctIndex: 1,
    explanation: "코레오그래피 Saga 패턴은 중앙 조율자 없이 각 서비스가 Pub/Sub 이벤트를 통해 느슨하게 결합되어 비동기적으로 트랜잭션과 보상 로직을 수행합니다.",
    relatedAiTopic: "Event-Driven MSA 아키텍처와 Kafka Saga 패턴",
    videoClip: {
      lectureDay: "Day 66 (10월 28일)",
      lectureTitle: "Event-Driven MSA 아키텍처와 분산 트랜잭션 (Saga 패턴)",
      instructor: "김민수 강사",
      duration: "2시간 40분",
      clipStartTime: "34:12",
      clipEndTime: "38:50",
      instructorQuote: "코레오그래피 Saga 패턴은 중앙 조율자(Orchestrator) 없이 각 서비스가 이벤트를 발행/구독하여 자율적으로 로컬 트랜잭션을 실행합니다.",
      chapters: [
        { timeStr: "34:12", title: "왜 2PC 대신 Saga 패턴을 써야 하는가?" },
        { timeStr: "36:05", title: "코레오그래피 vs 오케스트레이션 아키텍처 비교", isExamPoint: true },
        { timeStr: "37:45", title: "보상 트랜잭션(Compensating Transaction) 롤백 시뮬레이션" },
      ],
    },
  },
  {
    id: 3,
    examId: 5,
    category: "Cloud",
    level: "중급",
    points: 7,
    question: "Spring Cloud Gateway에서 라우팅 필터(GatewayFilter) 체인을 구성할 때, Resilience4j CircuitBreaker 필터의 주된 역할은 무엇인가?",
    codeSnippet: `spring:
  cloud:
    gateway:
      routes:
        - id: order-service-route
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/v1/orders/**
          filters:
            - name: CircuitBreaker
              args:
                name: orderCircuitBreaker
                fallbackUri: forward:/fallback/orders`,
    options: [
      "클라이언트의 JWT 토큰 서명을 검증하고 인가되지 않은 요청을 401 Unauthorized로 거부한다.",
      "목적지 서비스(ORDER-SERVICE) 장애나 지연 발생 시 호출을 차단하고 정의된 fallbackUri로 요청을 우회하여 연쇄 장애(Cascading Failure)를 방지한다.",
      "요청 헤더의 IP를 기반으로 초당 요청 건수(Rate Limit)를 제한한다.",
      "HTTP 요청 본문의 JSON 데이터를 압축하여 전송 대역폭을 절약한다.",
    ],
    correctIndex: 1,
    explanation: "Circuit Breaker 패턴은 다운스트림 서비스 장애 감지 시 회로를 OPEN하여 더 이상의 실패 요청 전송을 막고 사전 정의된 Fallback 응답을 반환하여 시스템 전체 회복 탄력성을 유지합니다.",
    relatedAiTopic: "Spring Cloud Gateway 라우팅 & 회복 탄력성",
    videoClip: {
      lectureDay: "Day 67 (10월 29일)",
      lectureTitle: "Spring Cloud Gateway 라우팅 심화 & Resilience4j CircuitBreaker",
      instructor: "박서준 멘토",
      duration: "2시간 50분",
      clipStartTime: "41:20",
      clipEndTime: "45:30",
      instructorQuote: "서킷 브레이커는 다운스트림 서비스 장애 시 회로를 열어(OPEN) 연쇄 장애(Cascading Failure)를 차단하고 Fallback을 반환합니다.",
      chapters: [
        { timeStr: "41:20", title: "GatewayFilter 체인과 라우팅 메커니즘" },
        { timeStr: "43:10", title: "CircuitBreaker 3대 상태(CLOSED, OPEN, HALF-OPEN)", isExamPoint: true },
        { timeStr: "44:30", title: "fallbackUri 포워딩 핸들러 구성 실습" },
      ],
    },
  },
  {
    id: 4,
    examId: 5,
    category: "React",
    level: "중급",
    points: 6,
    question: "React 함수형 컴포넌트에서 useEffect 훅의 의존성 배열에 외부 상태 변수를 누락했을 때 발생하는 'Stale Closure' 현상에 대한 올바른 설명은?",
    codeSnippet: `function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // 의존성 배열이 빈 배열 []인 경우
      console.log("Current Count:", count);
    }, 1000);
    return () => clearInterval(timer);
  }, []); // count 누락!
  
  return <button onClick={() => setCount(count + 1)}>+1</button>;
}`,
    options: [
      "컴포넌트가 무한 렌더링 루프에 빠져 브라우저 메모리가 고갈된다.",
      "타이머 콜백 함수가 마운트 시점의 렌더링 스코프에 클로저로 캡처된 이전 count 값(0)을 계속 참조하여 값이 갱신되지 않는다.",
      "React가 컴포넌트 트리에서 DOM 노드를 언마운트하고 에러 바운더리를 발동시킨다.",
      "Next.js Turbopack 빌드 타임에 SyntaxError가 발생하여 서버가 기동되지 않는다.",
    ],
    correctIndex: 1,
    explanation: "자바스크립트 클로저(Closure)는 함수가 선언된 시점의 어휘적 환경(Lexical Scope)을 기억하므로, 의존성 배열에 최신 상태를 전달하지 않으면 과거의 렌더링 스냅샷 값만을 지속적으로 바라보게 됩니다.",
    relatedAiTopic: "React Hook 클로저와 의존성 배열 최적화",
    videoClip: {
      lectureDay: "Day 25 (9월 03일)",
      lectureTitle: "React Hook 심화: useEffect 의존성 배열과 클로저 스냅샷",
      instructor: "박서준 멘토",
      duration: "2시간 30분",
      clipStartTime: "48:10",
      clipEndTime: "53:20",
      instructorQuote: "의존성 배열을 비워두면 타이머나 핸들러는 초기 렌더링 시점의 값만을 기억하는 Stale Closure에 갇힙니다. 함수형 업데이트나 의존성 추가로 해결해야 합니다.",
      chapters: [
        { timeStr: "48:10", title: "함수형 컴포넌트 렌더링 스냅샷과 클로저" },
        { timeStr: "50:15", title: "Stale Closure 재현 실습: 타이머 내부의 멈춘 State", isExamPoint: true },
        { timeStr: "52:00", title: "setState 함수형 업데이트로 의존성 제거하기" },
      ],
    },
  },
  {
    id: 5,
    examId: 5,
    category: "Database",
    level: "고급",
    points: 7,
    question: "데이터베이스 트랜잭션 격리 수준(Isolation Level) 중, 두 개의 트랜잭션이 동일한 범위의 조건으로 검색했을 때 다른 트랜잭션의 커밋에 의해 결과 행의 개수가 달라지는 '팬텀 리드(Phantom Read)'를 방지할 수 있는 가장 엄격한 격리 수준은?",
    options: [
      "READ UNCOMMITTED",
      "READ COMMITTED",
      "REPEATABLE READ",
      "SERIALIZABLE",
    ],
    correctIndex: 3,
    explanation: "SERIALIZABLE 격리 수준은 트랜잭션을 완전히 순차적으로 실행하여 Dirty Read, Non-Repeatable Read, Phantom Read 현상을 모두 완벽히 방지합니다. (참고: PostgreSQL의 REPEATABLE READ도 MVCC와 가상 락으로 팬텀 리드를 기본 차단함)",
    relatedAiTopic: "ACID 트랜잭션 격리 수준과 동시성 제어",
    videoClip: {
      lectureDay: "Day 42 (9월 24일)",
      lectureTitle: "RDBMS ACID 트랜잭션 격리 수준과 동시성 제어 (MVCC)",
      instructor: "김민수 강사",
      duration: "2시간 30분",
      clipStartTime: "55:10",
      clipEndTime: "59:40",
      instructorQuote: "팬텀 리드는 없던 행이 유령처럼 나타나는 현상입니다. SERIALIZABLE 수준이 완전한 직렬화를 통해 이를 방지하며, 실무에서는 인덱스 범위 락(Next-Key Lock)의 동작 원리를 이해해야 합니다.",
      chapters: [
        { timeStr: "55:10", title: "트랜잭션 3대 이상 현상 (Dirty, Non-Repeatable, Phantom Read)" },
        { timeStr: "57:00", title: "4단계 트랜잭션 격리 수준 비교와 SERIALIZABLE", isExamPoint: true },
        { timeStr: "58:30", title: "PostgreSQL/MySQL의 MVCC와 Gap Lock 차이점" },
      ],
    },
  },
  {
    id: 6,
    examId: 5,
    category: "HTML/CSS",
    level: "초급",
    points: 6,
    question: "CSS 선택자의 특이성(Specificity) 계산 가중치에서 우선 순위가 가장 높은 것은 무엇인가?",
    options: [
      "요소(Type/Tag) 선택자 (예: div, p)",
      "클래스(Class) 선택자 (예: .container)",
      "아이디(ID) 선택자 (예: #header)",
      "HTML 태그 인라인 스타일 속성 (예: style='color: red')",
    ],
    correctIndex: 3,
    explanation: "CSS 특이성 가중치는 인라인 스타일(1000) > ID 선택자(100) > 클래스/의사클래스(10) > 요소 선택자(1) 순으로 결정됩니다.",
    relatedAiTopic: "CSS Cascade 및 특이성 우선순위 법칙",
  },
  {
    id: 7,
    examId: 5,
    category: "Java",
    level: "중급",
    points: 7,
    question: "다음 JavaScript 코드의 실행 결과로 콘솔에 출력되는 값은 무엇인가?",
    codeSnippet: `console.log(greeting);
var greeting = "Hello World";
console.log(greeting);`,
    options: [
      "ReferenceError 발생",
      "undefined 그 후 'Hello World'",
      "'Hello World' 그 후 'Hello World'",
      "null 그 후 'Hello World'",
    ],
    correctIndex: 1,
    explanation: "var 키워드로 선언된 변수는 호이스팅(Hoisting) 시 선언부가 해당 스코프 최상단으로 끌어올려지며 undefined로 초기화됩니다. 실제 값 할당은 코드 실행 라인에 도달했을 때 수행됩니다.",
    relatedAiTopic: "JavaScript 호이스팅과 실행 컨텍스트",
  },
  {
    id: 8,
    examId: 5,
    category: "Cloud",
    level: "고급",
    points: 7,
    question: "도커(Docker) 컨테이너 빌드 시 이미지 용량을 극적으로 줄이고 빌드 도구와 컴파일 산출물을 최종 프로덕션 런타임 이미지와 분리하기 위해 활용하는 최적화 기법은?",
    options: [
      "Multi-stage Build (멀티스테이지 빌드)",
      "Docker Daemon Swarm 모드",
      "Layer Caching 비활성화 (--no-cache)",
      "Bridge Network 격리",
    ],
    correctIndex: 0,
    explanation: "멀티스테이지 빌드는 단일 Dockerfile 내에서 여러 개의 FROM 절을 사용하여, 컴파일/테스트 단계의 무거운 SDK를 버리고 빌드 결과물(jar, 정적 파일)만을 가벼운 JRE/알파인 런타임 이미지에 복사하여 배포 이미지를 경량화합니다.",
    relatedAiTopic: "Docker 컨테이너 경량화와 Multi-stage Build",
    videoClip: {
      lectureDay: "Day 52 (10월 10일)",
      lectureTitle: "도커 컨테이너 경량화 최적화와 Multi-stage Build 실무",
      instructor: "박서준 멘토",
      duration: "2시간 40분",
      clipStartTime: "32:00",
      clipEndTime: "36:25",
      instructorQuote: "Gradle 빌드 도구와 JDK는 500MB가 넘습니다. 멀티스테이지 빌드를 통해 컴파일 산출물 jar만 JRE 알파인 이미지로 복사하면 50MB대로 줄일 수 있습니다.",
      chapters: [
        { timeStr: "32:00", title: "단일 스테이지 Dockerfile의 비대화 문제" },
        { timeStr: "33:45", title: "Multi-stage Build: AS builder와 COPY --from 구문", isExamPoint: true },
        { timeStr: "35:10", title: "Distroless vs Alpine 경량 베이스 이미지 선택 전략" },
      ],
    },
  },
  {
    id: 9,
    examId: 5,
    category: "MSA",
    level: "중급",
    points: 7,
    question: "Kafka 이벤트 스트리밍 시스템에서 동일한 파티션 키(Partition Key)를 가진 메시지들의 전달 보장 특성으로 올바른 것은?",
    options: [
      "클러스터 전체의 모든 토픽에 대해 절대적 총 순서(Total Ordering)가 보장된다.",
      "동일한 파티션 내부에서는 메시지가 인입된 순서대로 엄격한 순서(Ordering)가 보장된다.",
      "네트워크 지연 발생 시 파티션 내부에서도 역순으로 컨슈머에게 전달된다.",
      "파티션 키는 오직 브로커 로드밸런싱용이며 메시지 정렬 순서와는 무관하다.",
    ],
    correctIndex: 1,
    explanation: "카프카는 토픽 전체가 아닌 '개별 파티션 단위'로 메시지의 엄격한 순서(In-order)를 보장합니다. 따라서 동일한 비즈니스 엔티티(예: 주문ID)는 동일 파티션 키로 발행해야 순차 처리가 보장됩니다.",
    relatedAiTopic: "Kafka 토픽 파티셔닝과 순서 보장 아키텍처",
    videoClip: {
      lectureDay: "Day 68 (10월 30일)",
      lectureTitle: "Apache Kafka 파티셔닝 구조와 메시지 순서 보장 전략",
      instructor: "김민수 강사",
      duration: "2시간 45분",
      clipStartTime: "28:15",
      clipEndTime: "32:50",
      instructorQuote: "카프카의 핵심은 '파티션 내 순서 보장'입니다. 전체 토픽이 아니라 동일 파티션 키로 해싱되어 같은 파티션에 인입된 메시지만 순서가 보장됩니다.",
      chapters: [
        { timeStr: "28:15", title: "카프카 브로커, 토픽, 파티션 아키텍처" },
        { timeStr: "30:00", title: "파티션 키 해싱과 파티션 내 순서(In-order) 보장 원리", isExamPoint: true },
        { timeStr: "31:40", title: "파티션 리밸런싱과 순서 왜곡 방지 주의점" },
      ],
    },
  },
  {
    id: 10,
    examId: 5,
    category: "Database",
    level: "중급",
    points: 6,
    question: "마이크로서비스에서 로컬 데이터베이스 트랜잭션 커밋과 카프카 메시지 발행 간의 원자성(Atomicity)을 보장하기 위해 널리 사용되는 디자인 패턴은?",
    options: [
      "CQRS (Command Query Responsibility Segregation)",
      "Transactional Outbox Pattern (아웃박스 패턴)",
      "Circuit Breaker Pattern",
      "API Composition Pattern",
    ],
    correctIndex: 1,
    explanation: "Transactional Outbox 패턴은 비즈니스 데이터 수정과 발행할 메시지를 하나의 RDBMS 로컬 트랜잭션으로 OUTBOX 테이블에 함께 저장한 뒤, Debezium(CDC)이나 별도 폴러가 카프카로 안전하게 발행하여 분실을 방지합니다.",
    relatedAiTopic: "Transactional Outbox 패턴과 데이터 정합성",
    videoClip: {
      lectureDay: "Day 69 (11월 02일)",
      lectureTitle: "분산 시스템 데이터 정합성과 Transactional Outbox 패턴",
      instructor: "박서준 멘토",
      duration: "2시간 35분",
      clipStartTime: "19:40",
      clipEndTime: "24:30",
      instructorQuote: "DB 커밋과 카프카 전송을 분리하면 네트워크 실패 시 이중 전송이나 유실이 발생합니다. OUTBOX 테이블에 함께 INSERT하고 Debezium CDC로 발행하는 것이 정석입니다.",
      chapters: [
        { timeStr: "19:40", title: "듀얼 라이트(Dual Write) 문제와 분산 트랜잭션의 한계" },
        { timeStr: "21:20", title: "Transactional Outbox 패턴의 구조와 RDBMS 원자성", isExamPoint: true },
        { timeStr: "23:15", title: "Debezium CDC 기반 카프카 커넥터 연동 파이프라인" },
      ],
    },
  },
  {
    id: 11,
    examId: 5,
    category: "React",
    level: "중급",
    points: 7,
    question: "Next.js 15 App Router에서 Server Component와 Client Component의 경계에 관한 설명으로 옳지 않은 것은?",
    options: [
      "기본적으로 app 디렉토리 내의 모든 컴포넌트는 Server Component로 렌더링된다.",
      "Client Component는 파일 최상단에 'use client' 지시어를 선언해야 한다.",
      "Server Component는 브라우저 전용 API(window, localStorage)나 onClick 이벤트 핸들러를 직접 바인딩할 수 없다.",
      "Client Component 내부에서는 Server Component를 직접 import하여 자식 컴포넌트로 JSX를 작성할 수 있다.",
    ],
    correctIndex: 3,
    explanation: "Client Component 내부에서 Server Component를 직접 import하면 해당 컴포넌트도 Client 모듈 번들에 포함되어버립니다. Server Component를 Client Component 내부에서 쓰려면 children prop으로 넘겨주는 컴포지션(Composition) 패턴을 사용해야 합니다.",
    relatedAiTopic: "Next.js 15 Server Component & Client 렌더링 경계",
  },
  {
    id: 12,
    examId: 5,
    category: "Cloud",
    level: "고급",
    points: 7,
    question: "쿠버네티스(Kubernetes)에서 외부 HTTP/HTTPS 트래픽을 클러스터 내부의 여러 서비스(Service)로 URL 경로 및 호스트 기반으로 라우팅해주는 L7 리소스는?",
    options: [
      "Ingress (인그레스)",
      "ConfigMap",
      "PersistentVolumeClaim",
      "ClusterIP Service",
    ],
    correctIndex: 0,
    explanation: "쿠버네티스 Ingress는 클러스터 외부의 HTTP/S 요청을 도메인 이름이나 URI 경로 규칙에 맞춰 내부 Service들로 스마트하게 포워딩해주는 L7 로드밸런서 리소스입니다.",
    relatedAiTopic: "Kubernetes Ingress Controller 라우팅 실무",
  },
  {
    id: 13,
    examId: 5,
    category: "HTML/CSS",
    level: "초급",
    points: 6,
    question: "HTML5 명세에서 콘텐츠의 텍스트 길이와 상관없이 항상 가로폭 100%를 차지하는 독립된 블록 라인을 생성하는 기본 블록(Block) 요소는?",
    options: [
      "<span>",
      "<div>",
      "<a>",
      "<small>",
    ],
    correctIndex: 1,
    explanation: "<div>는 기본 display 값이 block인 대표적인 블록 레벨 컨테이너 요소로, 부모 컨테이너의 가로 전폭을 차지하며 줄바꿈을 유발합니다. (span, a, small은 inline 요소)",
    relatedAiTopic: "HTML 블록(Block) vs 인라인(Inline) 레이아웃 모델",
  },
  {
    id: 14,
    examId: 5,
    category: "Java",
    level: "중급",
    points: 6,
    question: "Spring Framework의 캐시 추상화 어노테이션 중, 메서드 실행 전에 캐시를 조회하여 이미 캐시된 데이터가 있으면 메서드를 실행하지 않고 캐시된 값을 즉시 반환하는 어노테이션은?",
    options: [
      "@Cacheable",
      "@CachePut",
      "@CacheEvict",
      "@Caching",
    ],
    correctIndex: 0,
    explanation: "@Cacheable은 메서드 호출 전 캐시 적중(Cache Hit) 여부를 확인하여 존재하면 반환하고, 부재(Miss) 시에만 실제 메서드를 수행하고 결과를 캐시에 저장합니다. (반면 @CachePut은 항상 메서드를 실행하고 캐시를 갱신함)",
    relatedAiTopic: "Spring Cache 추상화와 Redis 캐싱 전략",
  },
  {
    id: 15,
    examId: 5,
    category: "MSA",
    level: "고급",
    points: 7,
    question: "마이크로서비스 아키텍처에서 서비스 인스턴스들의 동적 IP와 포트를 실시간으로 등록하고 발견(Discovery)할 수 있게 해주는 Spring Cloud 넷플릭스 핵심 컴포넌트는?",
    options: [
      "Eureka Service Registry & Discovery",
      "Zuul 1.0",
      "Ribbon (클라이언트 로드밸런서)",
      "Hystrix Dashboard",
    ],
    correctIndex: 0,
    explanation: "Spring Cloud Netflix Eureka는 각 마이크로서비스가 기동 시 자신의 호스트/포트 정보를 Eureka 서버에 하트비트로 등록하고, API 게이트웨이나 타 서비스가 Eureka로부터 위치를 동적으로 조회(Lookup)할 수 있도록 지원하는 서비스 레지스트리입니다.",
    relatedAiTopic: "Eureka 서비스 디스커버리와 동적 인스턴스 관리",
  },
];

// ==========================================
// 1차 사전평가 (46점 기응시) 오답노트 문항 데이터셋
// ==========================================
export const PAST_EXAM_FEEDBACK_QUESTIONS: EvaluationQuestion[] = [
  {
    id: 101,
    examId: 1,
    category: "HTML/CSS",
    level: "초급",
    points: 5,
    question: "다음 요소 중 콘텐츠의 길이와 상관없이 항상 독립된 하나의 가로 블록 라인을 만드는 적절한 요소는 무엇인가?",
    options: [
      "<span>",
      "<meta>",
      "<div>",
      "<a>",
    ],
    correctIndex: 2,
    userAnswerIndex: 0, // 오답 선택: <span> 선택
    explanation: "<div> 요소는 블록 레벨 태그로 문자열이나 자식 콘텐츠의 길이와 상관없이 한 개의 온전한 가로 블록을 생성합니다.",
    relatedAiTopic: "HTML 블록 요소 vs 인라인 요소 구조",
    videoClip: {
      lectureDay: "Day 08 (8월 12일)",
      lectureTitle: "웹 표준 HTML5 시맨틱 마크업 & CSS 디스플레이 박스 모델",
      instructor: "김민수 강사",
      duration: "2시간 20분",
      clipStartTime: "18:30",
      clipEndTime: "22:45",
      instructorQuote: "div와 span의 본질적인 차이는 브라우저 렌더링 엔진의 Box Model에서 block 가로 전폭을 점유하느냐 inline 흐름을 따르느냐입니다. 시험 단골 문제입니다!",
      chapters: [
        { timeStr: "18:30", title: "HTML 블록 요소 vs 인라인 요소 박스 모델" },
        { timeStr: "20:15", title: "div 요소의 100% 가로 점유 특성과 줄바꿈 메커니즘", isExamPoint: true },
        { timeStr: "21:50", title: "span 태그와 CSS display: inline-block 변환" },
      ],
    },
  },
  {
    id: 102,
    examId: 1,
    category: "HTML/CSS",
    level: "초급",
    points: 5,
    question: "CSS 선택자의 특이성(specificity) 계산에서 가장 높은 우선 순위를 갖는 것은 무엇인가?",
    options: [
      "요소(Type) 선택자 (가중치 1)",
      "클래스(Class) 선택자 (가중치 10)",
      "ID 선택자 (가중치 100)",
      "인라인 스타일 (style 속성, 가중치 1000)",
    ],
    correctIndex: 3,
    userAnswerIndex: 2, // 오답 선택: ID 선택자 선택
    explanation: "특이성 가중치는 인라인 스타일(1000) > ID(100) > 클래스(10) > 요소(1) 순으로 계산됩니다.",
    relatedAiTopic: "CSS 특이성 점수 계산법",
    videoClip: {
      lectureDay: "Day 10 (8월 14일)",
      lectureTitle: "CSS 캐스케이딩(Cascade) 원리와 특이성(Specificity) 계산법",
      instructor: "김민수 강사",
      duration: "2시간 15분",
      clipStartTime: "31:40",
      clipEndTime: "36:10",
      instructorQuote: "인라인 스타일(1000점)은 ID 선택자(100점)나 클래스(10점)보다 압도적으로 우선합니다. !important 남용을 막으려면 이 가중치 체계를 완벽히 숙지해야 합니다.",
      chapters: [
        { timeStr: "31:40", title: "CSS Cascading 3대 원칙 (중요도, 명시도, 선언 순서)" },
        { timeStr: "33:20", title: "특이성 4자리 점수 체계 (인라인 > ID > 클래스 > 태그)", isExamPoint: true },
        { timeStr: "35:05", title: "!important 규칙과 안티패턴 방지 가이드" },
      ],
    },
  },
  {
    id: 103,
    examId: 1,
    category: "Java",
    level: "초급",
    points: 5,
    question: "다음 코드가 콘솔에 출력하는 값으로 올바른 것은 무엇인가?",
    codeSnippet: `console.log(x);
var x = 5;`,
    options: [
      "5",
      "undefined",
      "ReferenceError: x is not defined",
      "null",
    ],
    correctIndex: 1,
    userAnswerIndex: 2, // 오답 선택: ReferenceError 선택
    explanation: "var 키워드 변수는 호이스팅되어 선언부가 스코프 최상단으로 끌어올려지며 undefined로 기본 초기화됩니다. 실제 할당은 2번째 줄에서 일어납니다.",
    relatedAiTopic: "JavaScript 변수 호이스팅과 TDZ(Temporal Dead Zone)",
    videoClip: {
      lectureDay: "Day 14 (8월 20일)",
      lectureTitle: "JavaScript 실행 컨텍스트(Execution Context)와 변수 호이스팅",
      instructor: "김민수 강사",
      duration: "2시간 45분",
      clipStartTime: "15:20",
      clipEndTime: "19:50",
      instructorQuote: "var 선언은 생성 단계(Creation Phase)에서 undefined로 메모리에 등록됩니다. 반면 let/const는 TDZ(Temporal Dead Zone)로 보호되어 ReferenceError가 발생하죠.",
      chapters: [
        { timeStr: "15:20", title: "자바스크립트 엔진 2단계: 생성 단계 vs 실행 단계" },
        { timeStr: "17:05", title: "var 호이스팅과 undefined 초기화의 함정", isExamPoint: true },
        { timeStr: "18:40", title: "let/const의 TDZ(Temporal Dead Zone) 비교" },
      ],
    },
  },
  {
    id: 104,
    examId: 1,
    category: "React",
    level: "중급",
    points: 5,
    question: "React Hook 규칙 중 useEffect 훅의 의존성 배열에 상태 변수를 누락했을 때 발생할 수 있는 주요 부작용은?",
    options: [
      "무한 렌더링 루프",
      "브라우저 메모리 누수",
      "Stale Closure (오래된 상태 클로저 참조)",
      "컴파일 빌드 실패",
    ],
    correctIndex: 2,
    userAnswerIndex: 0, // 오답 선택: 무한 루프 선택
    explanation: "의존성 배열을 누락하면 컴포넌트가 재렌더링되더라도 이펙트 함수 내부의 클로저가 이전 마운트 당시의 상태값 스냅샷에 고정되는 Stale Closure 문제가 발생합니다.",
    relatedAiTopic: "React useEffect 클로저 함정과 최신 상태 동기화",
    videoClip: {
      lectureDay: "Day 25 (9월 03일)",
      lectureTitle: "React Hook 심화: useEffect 의존성 배열과 클로저 스냅샷",
      instructor: "박서준 멘토",
      duration: "2시간 30분",
      clipStartTime: "48:10",
      clipEndTime: "53:20",
      instructorQuote: "의존성 배열을 비워두면 타이머나 핸들러는 초기 렌더링 시점의 값만을 기억하는 Stale Closure에 갇힙니다. 함수형 업데이트나 의존성 추가로 해결해야 합니다.",
      chapters: [
        { timeStr: "48:10", title: "함수형 컴포넌트 렌더링 스냅샷과 클로저" },
        { timeStr: "50:15", title: "Stale Closure 재현 실습: 타이머 내부의 멈춘 State", isExamPoint: true },
        { timeStr: "52:00", title: "setState 함수형 업데이트로 의존성 제거하기" },
      ],
    },
  },
  {
    id: 105,
    examId: 1,
    category: "React",
    level: "초급",
    points: 5,
    question: "React에서 여러 개의 엘리먼트를 반환할 때 별도의 DOM 노드를 추가하지 않고 그룹화하기 위해 사용하는 태그는?",
    options: [
      "<div>",
      "<Fragment> (또는 빈 태그 <>...</>)",
      "<section>",
      "<template>",
    ],
    correctIndex: 1,
    userAnswerIndex: 1, // 정답 맞힘!
    explanation: "React.Fragment(또는 축약형 <>...</>)는 실제 렌더링되는 HTML DOM에 아무런 마크업 노드를 생성하지 않고 자식들을 감쌉니다.",
    relatedAiTopic: "React Fragment와 불필요한 DOM 래퍼 제거",
  },
  {
    id: 106,
    examId: 1,
    category: "Database",
    level: "초급",
    points: 5,
    question: "SQL에서 중복된 행(Row)을 제거하고 고유한 값만을 조회하고자 할 때 SELECT 절 다음에 사용하는 키워드는?",
    options: [
      "UNIQUE",
      "DISTINCT",
      "GROUP BY",
      "HAVING",
    ],
    correctIndex: 1,
    userAnswerIndex: 1, // 정답 맞힘!
    explanation: "SELECT DISTINCT 컬럼명 FROM 테이블 구문은 결과 집합에서 중복된 튜플을 필터링하고 고유값만 반환합니다.",
    relatedAiTopic: "SQL 기초 데이터 조회와 DISTINCT 필터",
  },
];

export const INITIAL_ASSIGNMENTS: AssignmentItem[] = [
  {
    id: 201,
    title: "Next.js 15 + Tailwind CSS v4 기반 반응형 수강생 대시보드 구현",
    subject: "고급 웹 프론트엔드",
    dueDate: "2026-11-09 23:59",
    dDay: "오늘 마감",
    status: "제출완료",
    author: "김민수 강사",
    description: "shadcn/ui 및 Base UI 컴포넌트를 활용하여 다크모드, 반응형 사이드바, 필터링 테이블을 완성하여 깃허브 링크를 제출하세요.",
    submissionDate: "2026-11-09 15:30",
    feedback: {
      mentor: "최유진 멘토",
      score: "98 / 100",
      comment: "UX 흐름이 매우 매끄럽고 정보 위계가 훌륭합니다. 접근성 속성까지 세심하게 신경 쓴 점이 인상적입니다.",
    },
  },
  {
    id: 202,
    title: "AWS ECS & Fargate 기반 CI/CD 파이프라인 자동화 구성서",
    subject: "클라우드 데브옵스",
    dueDate: "2026-11-13 18:00",
    dDay: "D-4",
    status: "미제출",
    author: "박서준 멘토",
    description: "GitHub Actions를 통해 Docker 이미지를 빌드하고 ECR 푸시 후 ECS 서비스 롤링 업데이트를 자동화하는 워크플로우 YAML을 작성하세요.",
  },
  {
    id: 203,
    title: "FastAPI & LangChain 기반 검색 증강 생성(RAG) 챗봇 백엔드",
    subject: "생성형 AI 엔지니어링",
    dueDate: "2026-11-18 18:00",
    dDay: "D-9",
    status: "미제출",
    author: "이진호 박사",
    description: "ChromaDB 벡터 데이터베이스와 OpenAI 임베딩 모델을 연동하여 LMS 공지사항 문서를 검색 응답하는 API를 구현하세요.",
  },
];

export const REPLAY_LECTURES: ReplayLecture[] = [
  {
    id: 1,
    date: "2026. 11. 08 (금)",
    title: "[Day 68] Next.js 15 Server Action & 캐싱 전략 심화",
    subject: "프론트엔드 실무",
    instructor: "김민수 강사",
    duration: "2시간 45분",
    videoUrl: "https://lms.wsts.kr/replay/day68",
    keyTopics: ["Server Components", "useActionState", "revalidatePath", "Turbopack HMR"],
    hasAiSummary: true,
  },
  {
    id: 2,
    date: "2026. 11. 07 (목)",
    title: "[Day 67] shadcn/ui 컴포넌트 커스터마이징 & 디자인 토큰 설계",
    subject: "UI/UX 엔지니어링",
    instructor: "이지은 디자이너",
    duration: "3시간 10분",
    videoUrl: "https://lms.wsts.kr/replay/day67",
    keyTopics: ["Base UI", "oklch Color System", "Accessible Dialog", "CVA"],
    hasAiSummary: true,
  },
  {
    id: 3,
    date: "2026. 11. 06 (수)",
    title: "[Day 66] AWS 인프라 자동화와 Terraform 기초",
    subject: "클라우드 아키텍처",
    instructor: "박서준 멘토",
    duration: "2시간 30분",
    videoUrl: "https://lms.wsts.kr/replay/day66",
    keyTopics: ["Terraform HCL", "VPC Module", "State Locking", "S3 Backend"],
    hasAiSummary: true,
  },
];

// ==========================================
// 캘린더 실제 데이터 (https://lms.wsts.kr/schedule 실시간 연동)
// ==========================================

export interface CurriculumScheduleItem {
  id: number;
  dateStr: string;
  day: number;
  dayOfWeek: "일" | "월" | "화" | "수" | "목" | "금" | "토";
  category: string;
  title: string;
  shortTitle: string;
  type: "project" | "hackathon" | "lecture" | "workshop" | "mentoring" | "holiday";
  typeLabel: "정규강의" | "특강" | "해커톤" | "프로젝트" | "멘토링" | "휴강";
  hours: number;
  timeRange: string;
  instructor: string;
  location: string;
  isToday?: boolean;
  status: "출석" | "지각" | "결석" | "진행 중" | "예정" | "휴강";
  checkIn?: string;
  checkOut?: string;
  hasReplay?: boolean;
  description?: string;
}

export const REAL_CURRICULUM_NOVEMBER: CurriculumScheduleItem[] = [
  {
    id: 1,
    dateStr: "2026-11-02",
    day: 2,
    dayOfWeek: "월",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "미니 PJT - 2 (4일차)",
    shortTitle: "미니 PJT - 2",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "김민수 강사",
    location: "메타버스 ZEP 온라인 교육장",
    status: "출석",
    checkIn: "08:50:22",
    checkOut: "18:05:10",
    hasReplay: true,
    description: "AM 아키텍처 기반 마이크로서비스 연동 및 데이터 동기화 실습 프로젝트",
  },
  {
    id: 2,
    dateStr: "2026-11-03",
    day: 3,
    dayOfWeek: "화",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "미니 PJT - 2 (5일차)",
    shortTitle: "미니 PJT - 2",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "김민수 강사",
    location: "메타버스 ZEP 온라인 교육장",
    status: "출석",
    checkIn: "08:54:10",
    checkOut: "18:01:45",
    hasReplay: true,
    description: "Kafka 이벤트 스트리밍 기반 비동기 서비스 트랜잭션 완결",
  },
  {
    id: 3,
    dateStr: "2026-11-04",
    day: 4,
    dayOfWeek: "수",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "미니 PJT - 2 발표회 및 리허설",
    shortTitle: "미니 PJT - 2",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "김민수 강사 / 멘토단",
    location: "메타버스 ZEP 온라인 교육장",
    status: "출석",
    checkIn: "08:48:33",
    checkOut: "18:12:00",
    hasReplay: true,
    description: "팀별 구현 서비스 시연 데모 및 아키텍처 피어리뷰",
  },
  {
    id: 4,
    dateStr: "2026-11-05",
    day: 5,
    dayOfWeek: "목",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "미니 PJT - 2 회고 및 피드백",
    shortTitle: "미니 PJT - 2",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "박서준 멘토",
    location: "메타버스 ZEP 온라인 교육장",
    status: "출석",
    checkIn: "08:55:02",
    checkOut: "18:03:19",
    hasReplay: true,
    description: "강사 및 멘토 피드백 반영, 최종 코드 리팩토링 및 회고",
  },
  {
    id: 5,
    dateStr: "2026-11-06",
    day: 6,
    dayOfWeek: "금",
    category: "휴강",
    title: "휴강",
    shortTitle: "휴강",
    type: "holiday",
    typeLabel: "휴강",
    hours: 0,
    timeRange: "전일 휴강",
    instructor: "-",
    location: "-",
    status: "휴강",
    description: "해커톤 준비 및 MSA 학습 내용 복습 자율 학습일",
  },
  {
    id: 6,
    dateStr: "2026-11-09",
    day: 9,
    dayOfWeek: "월",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "해커톤 (1일차)",
    shortTitle: "해커톤",
    type: "hackathon",
    typeLabel: "해커톤",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "김민수 마스터 멘토",
    location: "LG CNS 상암 IT센터 4강의실 / ZEP 병행",
    isToday: true,
    status: "진행 중",
    checkIn: "08:52:14",
    checkOut: "진행 중",
    hasReplay: true,
    description: "차세대 웹 프론트엔드 실무 해커톤 (Next.js 15 + shadcn UI) 기획 및 핵심 기능 프로토타이핑",
  },
  {
    id: 7,
    dateStr: "2026-11-10",
    day: 10,
    dayOfWeek: "화",
    category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile",
    title: "해커톤 (2일차)",
    shortTitle: "해커톤",
    type: "hackathon",
    typeLabel: "해커톤",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "전체 멘토단",
    location: "LG CNS 상암 IT센터 4강의실 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "프로토타입 완성, 팀별 최종 피칭 발표회, 심사 및 우수팀 시상",
  },
  {
    id: 8,
    dateStr: "2026-11-11",
    day: 11,
    dayOfWeek: "수",
    category: "Digital Insight 3 - CNS AM Agile",
    title: "AM Agile (1일차)",
    shortTitle: "AM Agile",
    type: "lecture",
    typeLabel: "특강",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "LG CNS 현직 애자일 코치",
    location: "온·오프라인 병행 (상암 IT센터)",
    status: "예정",
    hasReplay: true,
    description: "엔터프라이즈 환경에서의 AM 애자일 방법론과 스크럼/칸반 실무 프랙티스",
  },
  {
    id: 9,
    dateStr: "2026-11-12",
    day: 12,
    dayOfWeek: "목",
    category: "Digital Insight 3 - CNS AM Agile",
    title: "AM Agile (2일차)",
    shortTitle: "AM Agile",
    type: "lecture",
    typeLabel: "특강",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "LG CNS 현직 애자일 코치",
    location: "온·오프라인 병행 (상암 IT센터)",
    status: "예정",
    hasReplay: true,
    description: "프로젝트 백로그 도출 및 유저 스토리 매핑 워크숍",
  },
  {
    id: 10,
    dateStr: "2026-11-13",
    day: 13,
    dayOfWeek: "금",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (프로젝트 워크샵)",
    shortTitle: "프로젝트 워크샵",
    type: "workshop",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "최종 프로젝트 전담 멘토단",
    location: "LG CNS 상암 IT센터",
    status: "예정",
    hasReplay: false,
    description: "최종 프로젝트 주제 확정, 아키텍처 청사진 설계 및 팀별 R&R 정의",
  },
  {
    id: 11,
    dateStr: "2026-11-14",
    day: 14,
    dayOfWeek: "토",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 멘토링 (1회차)",
    shortTitle: "멘토링",
    type: "mentoring",
    typeLabel: "멘토링",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "LG CNS 전담 시니어 멘토",
    location: "온라인 ZEP",
    status: "예정",
    hasReplay: false,
    description: "주말 집중 멘토링 1차: 도메인 모델링 및 API 스펙 1:1 심층 리뷰",
  },
  {
    id: 12,
    dateStr: "2026-11-16",
    day: 16,
    dayOfWeek: "월",
    category: "휴강",
    title: "휴강",
    shortTitle: "휴강",
    type: "holiday",
    typeLabel: "휴강",
    hours: 0,
    timeRange: "전일 휴강",
    instructor: "-",
    location: "-",
    status: "휴강",
    description: "스프린트 1 돌입 전 팀별 기술 스택 검토 및 휴식",
  },
  {
    id: 13,
    dateStr: "2026-11-17",
    day: 17,
    dayOfWeek: "화",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 시작)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "본격 개발 스프린트 1: 코어 비즈니스 로직 및 인프라 프로비저닝",
  },
  {
    id: 14,
    dateStr: "2026-11-18",
    day: 18,
    dayOfWeek: "수",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 개발)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "마이크로서비스 MSA 아키텍처 컴포넌트 개발",
  },
  {
    id: 15,
    dateStr: "2026-11-19",
    day: 19,
    dayOfWeek: "목",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 개발)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "API Gateway 및 서비스 디스커버리 연동",
  },
  {
    id: 16,
    dateStr: "2026-11-20",
    day: 20,
    dayOfWeek: "금",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 중간점검)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "스프린트 1 중간 코드 리뷰 및 진행률 체크",
  },
  {
    id: 17,
    dateStr: "2026-11-23",
    day: 23,
    dayOfWeek: "월",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 고도화)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "프론트엔드-백엔드 E2E 통합 테스트",
  },
  {
    id: 18,
    dateStr: "2026-11-24",
    day: 24,
    dayOfWeek: "화",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 고도화)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "AWS 인프라 CI/CD 파이프라인 자동화 구축",
  },
  {
    id: 19,
    dateStr: "2026-11-25",
    day: 25,
    dayOfWeek: "수",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 고도화)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "데이터 파이프라인 및 보안 IAM 권한 정밀 세팅",
  },
  {
    id: 20,
    dateStr: "2026-11-26",
    day: 26,
    dayOfWeek: "목",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 고도화)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "UI/UX 개선 및 컴포넌트 반응형 대응",
  },
  {
    id: 21,
    dateStr: "2026-11-27",
    day: 27,
    dayOfWeek: "금",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 (스프린트 1 데모)",
    shortTitle: "최종 프로젝트",
    type: "project",
    typeLabel: "프로젝트",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "프로젝트 전담 멘토단",
    location: "LG CNS AM 교육장 / ZEP 병행",
    status: "예정",
    hasReplay: false,
    description: "스프린트 1 완료 결과 데모 및 멘토 종합 리뷰",
  },
  {
    id: 22,
    dateStr: "2026-11-28",
    day: 28,
    dayOfWeek: "토",
    category: "AM 기반의 최종 프로젝트",
    title: "최종 프로젝트 멘토링 (2회차)",
    shortTitle: "멘토링",
    type: "mentoring",
    typeLabel: "멘토링",
    hours: 8,
    timeRange: "09:00 ~ 18:00 (8H)",
    instructor: "LG CNS 전담 시니어 멘토",
    location: "온라인 ZEP",
    status: "예정",
    hasReplay: false,
    description: "주말 집중 멘토링 2차: 클라우드 성능 최적화 및 보안 아키텍처 진단",
  },
  {
    id: 23,
    dateStr: "2026-11-30",
    day: 30,
    dayOfWeek: "월",
    category: "휴강",
    title: "휴강",
    shortTitle: "휴강",
    type: "holiday",
    typeLabel: "휴강",
    hours: 0,
    timeRange: "전일 휴강",
    instructor: "-",
    location: "-",
    status: "휴강",
    description: "단위기간 4회차 마무리 및 스프린트 2 준비 휴강",
  },
];

export const ALL_CURRICULUM_UNITS = [
  { id: 757, category: "OT / 아이스브레이킹", name: "OT / 아이스브레이킹", hours: 8, dates: "2026-07-24" },
  { id: 759, category: "Digital Insight 1 - 클라우드 & GenAI", name: "클라우드 특강", hours: 8, dates: "2026-07-27" },
  { id: 761, category: "풀스택(Full-Stack) AI서비스 개발", name: "AI 서비스 개발을 위한 프론트엔드", hours: 80, dates: "2026-07-28 ~ 2026-08-10 (10일)" },
  { id: 762, category: "풀스택(Full-Stack) AI서비스 개발", name: "AI 서비스 개발을 위한 백엔드 I", hours: 64, dates: "2026-08-11 ~ 2026-08-21 (8일)" },
  { id: 763, category: "풀스택(Full-Stack) AI서비스 개발", name: "AI 서비스 개발을 위한 백엔드 II", hours: 96, dates: "2026-08-24 ~ 2026-09-09 (12일)" },
  { id: 766, category: "Digital Insight 2 - DevOps Tools", name: "Digital Insight 2 - 서비스 개발을 위한 DevOps Tools", hours: 8, dates: "2026-09-10" },
  { id: 764, category: "풀스택(Full-Stack) AI서비스 개발", name: "코드 퀄리티 플랫폼기반의 생성형 AI를 활용한 REST API 개발", hours: 40, dates: "2026-09-11 ~ 2026-09-18 (5일)" },
  { id: 765, category: "풀스택(Full-Stack) AI서비스 개발", name: "미니 PJT - 1", hours: 40, dates: "2026-09-21 ~ 2026-09-30 (5일)" },
  { id: 767, category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile", name: "AM(Application Modernization)기반의 MSA 기술 I", hours: 80, dates: "2026-10-01 ~ 2026-10-20 (10일)" },
  { id: 768, category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile", name: "AM(Application Modernization)기반의 MSA 기술 II", hours: 56, dates: "2026-10-21 ~ 2026-10-29 (7일)" },
  { id: 769, category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile", name: "미니 PJT - 2", hours: 40, dates: "2026-10-30 ~ 2026-11-05 (5일)" },
  { id: 770, category: "AM(Application Modernization) 기술 - MSA, Cloud, Agile", name: "해커톤", hours: 16, dates: "2026-11-09 ~ 2026-11-10 (2일)" },
  { id: 771, category: "Digital Insight 3 - CNS AM Agile", name: "Digital Insight 3 CNS AM Agile", hours: 8, dates: "2026-11-11 ~ 2026-11-12 (2일)" },
  { id: 772, category: "AM 기반의 최종 프로젝트", name: "최종 프로젝트 (프로젝트 워크샵)", hours: 8, dates: "2026-11-13" },
  { id: 774, category: "AM 기반의 최종 프로젝트", name: "멘토링 (주말 5회)", hours: 40, dates: "2026-11-14 ~ 2027-01-16 (토요일)" },
  { id: 773, category: "AM 기반의 최종 프로젝트", name: "최종 프로젝트 (스프린트)", hours: 344, dates: "2026-11-17 ~ 2027-01-25 (43일)" },
  { id: 775, category: "프로젝트 발표회", name: "최종 발표회", hours: 8, dates: "2027-01-27" },
];
