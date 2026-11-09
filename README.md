# Next.js 15 + shadcn/ui + Tailwind CSS 예제 프로젝트

Next.js 15 (App Router), shadcn/ui, Tailwind CSS v4를 결합한 풀스택 모던 웹 애플리케이션 예제입니다.

## 🚀 기술 스택

- **프레임워크**: [Next.js 15.5](https://nextjs.org/) (App Router, Turbopack, React 19)
- **UI 컴포넌트**: [shadcn/ui](https://ui.shadcn.com/) (Base UI 기반, 접근성 및 풀 커스터마이징)
- **스타일링**: [Tailwind CSS v4](https://tailwindcss.com/) (차세대 고성능 CSS 엔진, CSS 변수 테마)
- **아이콘**: [Lucide React](https://lucide.dev/)
- **언어**: TypeScript

---

## 🛠 실행 방법

### 1. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)으로 접속하면 동작하는 대시보드를 확인할 수 있습니다.

### 2. 프로덕션 빌드
```bash
npm run build
npm run start
```

---

## 📦 포함된 shadcn/ui 컴포넌트

이 예제 프로젝트에는 실무에서 자주 사용되는 핵심 컴포넌트들이 이미 설치 및 설정되어 있습니다:

- `Button` (버튼: default, secondary, outline, destructive, ghost, link 및 다양한 크기)
- `Card` (카드: Header, Title, Description, Content, Footer)
- `Badge` (상태 뱃지)
- `Dialog` (모달 팝업 및 생성 폼)
- `DropdownMenu` (옵션 메뉴 및 사용자 프로필 메뉴)
- `Table` (정렬 및 필터링 지원 데이터 테이블)
- `Tabs` (탭 네비게이션)
- `Input` (텍스트 입력창)
- `Switch` (다크모드 및 토글 스위치)
- `Avatar` (사용자 프로필 이미지 및 아바타 그룹)
- `Separator` (구분선)

### 새로운 shadcn 컴포넌트 추가
필요한 컴포넌트를 언제든 아래 명령어로 추가할 수 있습니다:
```bash
npx shadcn@latest add [컴포넌트명]

# 예시:
npx shadcn@latest add accordion sheet tooltip toast
```

---

## 📁 프로젝트 구조

```text
├── src/
│   ├── app/
│   │   ├── globals.css         # Tailwind v4 @import 및 테마 토큰(oklch)
│   │   ├── layout.tsx          # Geist 폰트 및 루트 레이아웃
│   │   └── page.tsx            # 인터랙티브 대시보드 메인 페이지
│   ├── components/
│   │   └── ui/                 # shadcn/ui 소스 컴포넌트
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       └── ...
│   └── lib/
│       └── utils.ts            # cn() 유틸리티 (clsx + tailwind-merge)
├── components.json             # shadcn/ui 설정 파일
├── package.json
└── tsconfig.json
```

---

## ✨ 주요 구현 기능

1. **실시간 프로젝트 관리 테이블**:
   - 실시간 검색/필터링
   - Dialog 모달을 통한 새 프로젝트 동적 추가
   - 상태 변경 및 행 삭제 액션
2. **반응형 대시보드 지표 카드**:
   - 활성 멤버, 배포 성공률, 서버 응답 시간 카드
3. **다크 모드 / 라이트 모드 전환**:
   - 상단 헤더의 Switch를 통해 실시간 테마 토글 지원
4. **shadcn 컴포넌트 갤러리**:
   - 탭 2에서 주요 컴포넌트들의 다양한 변형(Variants) 확인 가능
5. **React 19 클라이언트 상태 데모**:
   - 초고속 HMR 및 Client Component 인터랙션
