# 프론트 API 연동 — 기존 백엔드 main 기준

프론트는 **백엔드 main에 이미 존재하는 74개 API 작업의 계약**만 사용합니다. 백엔드 코드를 추가하거나 수정할 필요가 없습니다. `src/lib/backend-routes.json`은 기존 OpenAPI의 경로·메서드 목록이고, Next.js 프록시는 목록에 없는 요청을 백엔드에 보내지 않고 `501 API_NOT_SUPPORTED`로 처리합니다.

## 실행 모드

프론트 `.env.local`:

```env
NEXT_PUBLIC_DATA_MODE=api
BACKEND_URL=http://127.0.0.1:8080
```

`NEXT_PUBLIC_DATA_MODE=mock`이면 기존 목업 화면을 그대로 사용하며 백엔드 요청을 차단합니다. URL은 두 모드 모두 `/`, `/admin`입니다. 값 변경 후 개발 서버 재시작, 배포에서는 재빌드가 필요합니다. [모드 설명](VERSIONS.md)

```bash
cd /Users/hy/Desktop/해커톤/frontend
npm run dev -- --port 3000
```

백엔드는 팀의 기존 main 서버를 사용하세요. 이 프론트 작업에서 백엔드 저장소나 실행 설정을 변경하지 않습니다. 고정 로그인 계정은 없으며 해당 서버에서 발급한 계정으로 로그인합니다.

## 실제 연결 범위

- 인증: 로그인·로그아웃·내 정보, 만료 시 갱신. Next.js 프록시에서 HttpOnly/SameSite 쿠키로 토큰을 관리하며 브라우저 JSON/localStorage에는 노출하지 않습니다.
- 수강생: 대시보드, 월별 일정·출결·소명, 공지·FAQ·학습질문/댓글, 과제 제출·재제출·첨부·평가·잠금, 역량평가 응시·답안 저장·채점·성적, 알림·읽음 처리, 이름·전화번호·비밀번호 변경.
- 관리자: 계정 발급·권한/상태, 교육 과정·기수·회원 배정, 일정·출결·소명 승인/반려·409, 게시판·댓글·첨부, 과제·제출물 파일·채점, 평가·문항·선택지·정답·해설.
- 관리자 성적 조회: 기존 `GET /api/cohorts/{id}/assessment-report?userId=...`로 선택한 수강생의 점수와 해당 평가의 기수 평균을 표시합니다. 별도의 전체 기수 집계 API를 가정하지 않습니다.
- 출결 PUT은 수정 시에도 userId/date/status 등 필수 필드와 기존 입퇴실 시각을 전달합니다. PATCH는 실제 변경값만 보냅니다.

## 기존 main에서 제공하지 않는 기능

| 기능 | API 모드의 처리 |
|---|---|
| 영상·챕터·커리큘럼 | 조회/저장 요청 없이 미제공 안내, 관리자 등록 버튼 없음 |
| AI 복습 | 생성/세션 요청 없이 미제공 안내 |
| Discord 전송 | PR #11 계약의 전송 POST·단건 GET·기수 상태 GET 사용 |
| 공지 공개 범위·슬러그·공개 상세 | 편집 필드/요청 제거, 기존 기수 공지로만 저장. 공개 상세 페이지는 미제공 안내 |
| 문항 핵심 개념·복습 챕터 매핑 | API 모드에서 필드/요청 제거. 일반 문항·정답·해설은 정상 관리 |
| 회원 발급자·발급 시각 | 기존 응답에서 생략된 필드는 `API 미제공`으로 표시. 발급 이력이 없다고 단정하지 않음 |
| AWS·수당 계좌·자리이탈감지 | 실제 연결하지 않고 미제공 안내 |

위 기능의 기존 목업 UI/데이터는 유지합니다. API 모드에서 지원되지 않는 필드를 보내고 성공한 것처럼 표시하지 않습니다. AI 키만 설정해서 기능이 활성화되는 구조도 아닙니다.

## 검증

```bash
node scripts/verify-backend-contract.mjs
npm run lint
NEXT_PUBLIC_DATA_MODE=api NEXT_DIST_DIR=.next-existing-main npm run build
```

계약 검사는 로컬 sibling `backend/docs/openapi.json`을 읽기만 하며 프론트의 경로 목록과 비교합니다. 관리자 어댑터의 PUT 필수값 보존, 미제공 리소스의 네트워크 요청 차단, 허용된 게시글/문항 payload도 검증합니다.

실제 프록시 통합 검증은 기존 백엔드 main의 **임시 사본·격리된 메모리 DB**에서만 실행합니다. 실제 사용자 DB에 실행하지 마세요.

```bash
VERIFY_ADMIN_EMAIL=... VERIFY_ADMIN_PASSWORD=... node scripts/verify-integration.mjs http://127.0.0.1:3115
```

기존 main의 로그인·권한·기수·일정·게시판·첨부·과제·채점·출결 소명·평가·성적·알림·로그아웃 계약을 확인합니다. 백엔드에 새 API를 추가하거나 backend-hy.md를 staging/commit하지 않습니다.

검증 결과: 기존 백엔드 main의 임시 사본과 메모리 DB에서 프록시 통합 검증 23개 통과. 계약 검사, 프론트 린트·타입 검사·API 모드 빌드 통과. 브라우저에서 로그인 후 미제공 기능 안내와 게시글 필드 제한을 확인했습니다. 원본 백엔드와 backend-hy.md는 변경하지 않았습니다.
