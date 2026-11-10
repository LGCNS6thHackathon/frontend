# 관리자 UI

관리자 주소는 `/admin`입니다. `NEXT_PUBLIC_DATA_MODE=api|mock`으로 실제 API와 목업을 선택합니다.

- **API 모드**는 백엔드 develop에 있는 계정·과정·기수·배정·일정·출결·소명·게시판·과제·첨부·채점·평가·영상 API를 사용합니다.
- 커리큘럼/챕터 편집·AI·공개 링크은 현재 API 미제공 상태로 안내하며 서버 요청을 보내지 않습니다.
- 계정 발급 이력은 DB 기록과 API 응답이 다릅니다. 기존 응답에 없는 필드는 `API 미제공`으로 표시합니다.
- 평가 결과는 수강생 선택 후 기존 assessment-report API로 조회합니다.
- 과제 등록 시 로그인한 관리자를 담당자로 자동 지정합니다. 선택 드롭다운 대신 담당자 이름을 읽기 전용으로 표시하며, 기존 과제를 수정할 때는 담당자와 등록자를 유지합니다. API 모드는 ADMIN 담당자 연결을 지원하는 backend develop `e04fcc1` 이상을 사용합니다.
- **Mock 모드**는 기존 6개 메뉴와 CRUD·출결 충돌 재현·Discord 시뮬레이션·영상/커리큘럼/복습 매핑 화면을 유지합니다. 변경은 브라우저에 저장하고 데이터 설정에서 초기화할 수 있습니다.
- 모든 목록의 빈 상태 토글·검색·필터, 액션 토스트를 유지합니다.

[실행 및 연결 계약](API_INTEGRATION.md) · [환경변수](VERSIONS.md)

추가 develop API 연동(영상 CRUD·문항 개념/챕터 ID 지정·관리자 게시판 경로)은 [DEVELOP_API_INTEGRATION.md](DEVELOP_API_INTEGRATION.md)를 참고하세요.
