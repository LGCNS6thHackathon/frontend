# Discord 공지 전송

백엔드 PR #11에서 전달받은 계약을 프론트에 연결했습니다. 백엔드 코드나 브랜치는 변경하지 않습니다. 해당 API가 배포된 백엔드가 필요합니다.

- `NEXT_PUBLIC_DATA_MODE=api`로 실행/빌드하고 `BACKEND_URL`을 설정합니다. Mock 모드의 기존 시연 동작은 유지합니다.
- COURSE/SYSTEM 게시글 저장은 전송하지 않습니다. Discord 전송 버튼만 본문 없이 `POST /api/posts/{postId}/discord-delivery`를 호출합니다.
- 목록은 `GET /api/cohorts/{cohortId}/discord-deliveries`의 ID별 상태를 합칩니다. 조회 실패는 UNKNOWN으로 표시합니다.
- 웹후크 미설정 오류는 서버 메시지로 안내합니다. 그 외 POST 실패 시 같은 경로의 GET으로 결과를 확인합니다. 자동 POST 재시도는 없습니다.
- PENDING/SENT/FAILED/UNKNOWN은 전송 버튼을 비활성화합니다. UNKNOWN이면 Discord 채널과 서버 기록을 확인해야 합니다. SENT만 성공 토스트를 표시합니다.
- 제목과 본문 전문이 외부 채널로 전달됩니다. API 모드에는 PUBLIC/공개 링크 설정이 필요하지 않습니다.
- 인증은 기존 HTTPOnly 세션과 서버 프록시를 사용합니다. 웹후크는 백엔드의 DISCORD_WEBHOOK_URL에만 설정합니다.

검증 중 실제 Discord 전송은 수행하지 않습니다.
