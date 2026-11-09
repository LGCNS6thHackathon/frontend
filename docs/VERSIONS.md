# 프론트 데이터 모드

프론트 `.env.local`의 환경변수로 선택합니다. URL은 두 모드 모두 **수강생 `/`**, **관리자 `/admin`**으로 동일합니다. 화면에 버전 전환 버튼은 없습니다.

목업 버전:

```env
NEXT_PUBLIC_DATA_MODE=mock
```

- 기존 `src/components/views/*`, `src/lib/lms-data.ts`와 목업 헤더·사이드바를 사용합니다.
- 로그인 없이 수강생·관리자 화면을 시연할 수 있습니다. 실제 세션 Provider와 백엔드 조회를 실행하지 않습니다.
- 관리자 목업 CRUD는 `inspire-admin-demo-v1` localStorage에 저장하며 데이터 설정에서 초기화할 수 있습니다.
- 목업 빌드의 `/api/*` 프록시는 `503 MOCK_MODE`를 반환하므로 실제 서버 데이터를 변경하지 않습니다.

백엔드 연결 버전:

```env
NEXT_PUBLIC_DATA_MODE=api
BACKEND_URL=http://127.0.0.1:8080
```

- 발급된 계정으로 로그인해 실제 서버 데이터를 사용합니다.
- 서버 연결 실패 시 목업으로 자동 전환하지 않습니다.
- 실제 API 설정과 실행법은 [API_INTEGRATION.md](API_INTEGRATION.md)를 확인하세요.

설정 변경 후 실행 중인 개발 서버를 종료하고 재시작하세요:

```bash
cd /Users/hy/Desktop/해커톤/frontend
npm run dev -- --port 3000
```

`NEXT_PUBLIC_*` 값은 빌드 시 고정됩니다. 배포에서는 값을 바꾼 뒤 `npm run build`로 다시 빌드해야 합니다. 값이 없으면 `api`가 기본이며 `mock`/`api` 외의 값은 설정 오류로 처리합니다. `.env.example`은 `mock` 예시이며, 실제 모드는 로컬 `.env.local`의 값에 따릅니다.

이전 임시 미리보기 주소 `/mock`, `/mock/admin`은 각각 `/`, `/admin`으로 리다이렉트하며 모드를 변경하지 않습니다.
