# 수강생 / 관리자 API 연결

수강생 `/`, 관리자 `/admin`의 데이터는 프론트 `.env.local`의 `NEXT_PUBLIC_DATA_MODE`로 선택합니다. `api`는 실제 로그인/API, `mock`은 기존 목업 화면을 백엔드 없이 사용합니다. 두 모드의 URL은 동일하며 화면 전환 버튼은 없습니다. [환경변수 설정법](VERSIONS.md)을 확인하세요.

## 실행

백엔드 터미널:

```bash
cd /Users/hy/Desktop/해커톤/backend
./gradlew bootRun --args='--spring.profiles.active=local'
```

백엔드 `.env`에 설정한 `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_PASSWORD` 계정으로 로그인합니다. 고정 기본 계정은 없습니다. Java 17이 필요하면 먼저 `export JAVA_HOME=$(/usr/libexec/java_home -v 17)`을 실행하세요. 운영 DB는 기존 `mariadb` 프로필을 사용합니다.

프론트 터미널:

```bash
cd /Users/hy/Desktop/해커톤/frontend
npm run dev -- --port 3000
```

실제 API 연결에는 먼저 `NEXT_PUBLIC_DATA_MODE=api`를 설정하세요. 기본 백엔드는 `http://127.0.0.1:8080`입니다. 주소가 다르면 프론트 `.env.local`의 **서버 전용** `BACKEND_URL`을 변경하고 Next.js를 재시작하세요. `NEXT_PUBLIC_` 접두사는 사용하지 않습니다.

## 인증과 권한

- 로그인한 서버 세션으로 수강생 / 관리자 화면을 전환합니다. ADMIN만 관리자 화면과 관리자 회원 API에 접근할 수 있습니다.
- Next.js `/api/[...path]`가 Spring Boot에 요청하고 액세스·갱신 토큰은 HttpOnly, SameSite=Lax 쿠키로 보관합니다. 브라우저 JSON·localStorage에는 토큰을 노출하지 않습니다.
- 인증 만료 시 서버에서 갱신 토큰을 회전하고 요청을 한 번 재시도합니다. 동시 요청은 갱신을 공유합니다. 변경 요청은 다른 Origin을 거부합니다.
- 프로덕션 쿠키는 HTTPS용 Secure가 기본입니다. 로컬 `npm run start`를 HTTP로 검증할 때만 `COOKIE_SECURE=false`를 지정합니다.
- 기수가 없으면 관리자에서 교육 과정 → 기수 → 회원 배정 순서로 등록합니다. 기수에 배정되지 않은 회원도 마이페이지를 이용할 수 있습니다.

## 연결 화면

- 수강생: 대시보드 집계, 월별 일정·출결·소명, 공지·FAQ·학습질문/댓글, 과제·첨부·재제출·피드백·수정 잠금, 평가 응시/답안/채점/해설·복습 영상, AI 백지/퀴즈, 알림·읽음 처리, 개인정보·비밀번호 변경
- 관리자: 계정·발급 이력, 교육 과정·기수·회원 배정, 교육 일정·출결·소명, 게시판·첨부·Discord 전송, 영상·챕터·커리큘럼, 과제·제출 파일·채점, 평가·문항·복습 매핑·기수 성적 요약
- 공개 공지: `/public/notices/{slug}`는 PUBLIC인 과정/시스템 공지만 익명 조회합니다.
- 백엔드의 기존 API에서 없던 영상·커리큘럼·복습 매핑·AI·Discord 서비스는 이번 백엔드 브랜치에 추가했습니다. 두 저장소의 변경을 함께 사용해야 합니다.

## 외부 서비스 설정

백엔드 환경변수:

- `OPENAI_API_KEY`, `OPENAI_MODEL`: AI 피드백과 순차 퀴즈 생성. 공식 Responses API의 JSON Schema 출력을 사용하며 키·모델을 임의 기본값으로 넣지 않습니다. 키/모델이 없으면 503과 설정 안내를 반환하고 백지 피드백 실패 상태를 보존합니다. 퀴즈 정답/해설은 답안 제출 전 숨깁니다. 복습 내용과 학습 주제만 AI 요청에 포함하며 사용자 이름·이메일은 보내지 않습니다.
- `DISCORD_WEBHOOK_URL`: 서버 전용 Discord 공지 채널 Webhook. 설정이 없으면 전송 이력을 FAILED로 저장합니다. 확실한 실패는 재시도할 수 있지만 전송 결과가 불명확하면 PENDING으로 두어 중복 전송을 막습니다.
- `PUBLIC_BASE_URL`: Discord에 노출할 프론트 공개 주소 (기본 `http://localhost:3000`).

외부 AI/Discord 실서비스 호출은 키 없이 실행하지 않았습니다. AI 정상 흐름은 모의 생성 응답으로 회귀 검증했습니다. AWS 계정·수당 계좌 저장과 자리이탈감지 서비스는 원래 백엔드의 제공 범위가 아니므로 실제 연동을 가장하지 않고 미제공 상태를 안내합니다.

공식 AI 요청 형식: https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses

## 검증

- 프론트: `npx tsc --noEmit`, `npm run lint`, `NEXT_DIST_DIR=.next-integration npm run build`
- 백엔드: `./gradlew test` (별도 테스트 DB)
- OpenAPI: `python scripts/generate-docs.py`가 실제 컨트롤러 경로와 문서의 일치를 확인합니다.
- 실제 프록시 통합 검증: **격리된 로컬 테스트 DB**에만 아래 스크립트를 실행하세요. 합성 계정·과제·출결 등을 생성합니다. 환경변수에 해당 테스트 서버의 관리자 자격을 넣습니다.

```bash
VERIFY_ADMIN_EMAIL=... VERIFY_ADMIN_PASSWORD=... node scripts/verify-integration.mjs http://127.0.0.1:3110
```

검증 항목: HttpOnly 쿠키·토큰 비공개, CSRF 출처 차단, 동시 갱신, 계정 발급 이력, 권한, 공개/비공개 자료, 과제 multipart와 파일 다운로드, 채점 잠금, 소명 승인, 평가 답안과 해설 공개 시점, AI 설정 누락의 실패 상태, 개인정보·알림·로그아웃. 테스트 계정과 파일은 일반 로컬 데이터에 넣지 않았습니다.

2026-11-10 최종 검증: 백엔드 46개 테스트(실패 0), 프록시 통합 검증 24개, 프론트 타입/린트/프로덕션 빌드 통과. 실제 브라우저에서 관리자 로그인·과목 저장/재조회, 수강생 로그인·과제 피드백/첨부/수정 잠금을 확인했습니다. 검증용 18080/3110 서버는 종료했습니다.
