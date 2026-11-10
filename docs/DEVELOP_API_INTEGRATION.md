# Backend develop API 연결

기준: backend develop `6db3a25` (2026-11-10). 프론트 작업 브랜치 `codex/develop-api-integration`.
백엔드는 origin/develop을 fast-forward pull했으며 코드·설정 파일은 수정하지 않았습니다.

## 추가 연결

- 관리자 영상: `/api/admin/cohorts/{cohortId}/lecture-videos` 목록·등록, `/api/admin/lecture-videos/{videoId}` 수정·삭제. 날짜, 교시, YouTube URL, 공개 상태, 선택 길이(초). 중복 교시/검증 오류는 기존 토스트로 안내합니다.
- 관리자 게시판은 `/api/admin/.../posts` 전용 경로로 이동했습니다. 첨부 업로드와 Discord 전송 경로는 유지합니다.
- 수강생 캘린더는 `/api/cohorts/{cohortId}/attendance/calendar?month=YYYY-MM`의 일정·출결·최신 소명을 함께 사용합니다. 소명 버튼은 서버의 availableRequestedStatuses를 따릅니다.
- 다시보기 날짜 API로 캘린더에 버튼을 표시합니다. 날짜 선택 → 교시별 영상·챕터 → 서버 playback API → 시작 시점 iframe과 YouTube 대체 링크로 이어집니다.
- 최근 30개 강의일 아카이브와 페이지네이션 전체 영상 목록, 공개 영상 상세 조회를 연결했습니다. 빈 날짜/영상 없음, 로딩·오류·재조회 상태를 제공합니다.
- 역량평가 카드의 '문항별 복습 · 추천 영상'에서 review-guide / review-recommendations를 읽습니다. 서버의 reviewReleased 전에는 링크를 표시하지 않습니다. 분류 없음·연결 영상 없음·QUESTION/TOPIC 구분을 표시하고 챕터 playback으로 이동합니다. 응시 이력이 없는 경우 서버 권한 오류가 표시됩니다.
- 문항 저장에 topicId / chapterId를 연결했습니다. 개념·챕터 목록/편집 API는 없으므로 API 모드에서는 기존 ID를 선택 입력합니다. Mock 모드의 트리/챕터 관리와 선택 UI는 유지됩니다.
- 과제 선택 과목(subject) 저장, 파일만으로 제출하는 UI를 연결했습니다. 기존 제출 multipart 필드 별칭과 채점·잠금 정책을 유지합니다.
- DISCORD_NOT_CONFIGURED는 실제 백엔드 오류를 토스트로 안내하고 UNKNOWN으로 덮지 않습니다. 응답 유실은 기존 GET 결과 확인 정책을 유지합니다.

## 범위와 실행

`NEXT_PUBLIC_DATA_MODE=api`, 서버 환경의 `BACKEND_URL`을 사용합니다. Mock 모드와 기존 디자인은 유지합니다.
새 API가 실행 중인 백엔드에 반영되려면 백엔드 재시작/재배포가 필요합니다. Discord 웹후크는 백엔드 설정만 사용합니다.
AI 복습 생성, 커리큘럼/챕터 CRUD, 공개 공지 링크는 컨트롤러가 없어 실제 API로 활성화하지 않았습니다.

## 검증

- `node scripts/verify-backend-contract.mjs`: develop OpenAPI 97개 작업 경로 일치, 영상 CRUD 경로·payload, 문항 연결 ID, 출결 필수 값 보존 및 미지원 리소스 차단.
- `node scripts/verify-discord-delivery.mjs`: 전송 결과·네트워크 유실 복구·상태 병합·웹후크 미설정 오류 전달. 외부 전송 없음.
- `npm run lint`, `npx tsc --noEmit`, `npm run build`.

실제 DB 변경, Discord 전송, YouTube 외부 영상 재생은 검증 과정에서 수행하지 않습니다.
