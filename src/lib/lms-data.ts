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
