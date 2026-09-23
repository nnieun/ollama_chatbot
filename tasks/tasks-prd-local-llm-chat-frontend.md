# 작업 목록: Local LLM Chat 프론트엔드

## Relevant Files

- `tasks/prd-local-llm-chat-frontend.md` — 승인된 요구사항과 FR 번호
- `docs/ui설계도.png` — 화면 설계 기준
- `frontend/vite-project/src/main.jsx` — React 진입점
- `frontend/vite-project/src/App.jsx` — 현재 단일 화면 컴포넌트
- `frontend/vite-project/src/App.css` — 화면별 스타일
- `frontend/vite-project/src/index.css` — 기존 CSS 토큰과 전역 스타일
- `frontend/vite-project/package.json` — 스크립트와 의존성
- `frontend/vite-project/.oxlintrc.json` — Oxlint 설정

## Constraints

- React + JavaScript만 사용한다.
- `.jsx` 또는 `.js`만 사용하고 `.ts`, `.tsx` 파일은 생성·수정하지 않는다.
- TypeScript 설정·패키지·타입 검사 작업을 추가하지 않는다.
- 백엔드, 데이터베이스, 인프라, API URL·메서드·필드·인증 방식을 변경하지 않는다.
- UI 기준은 `ui설계.jpg`가 아닌 실제 파일 `docs/ui설계도.png`이다.
- 새 패키지는 설치하지 않는다. 필요 시 작업을 Blocked로 표시한다.
- 한 번에 하나의 승인된 하위 작업만 구현한다.

## Context7 References

- React 실제 해석 버전: `19.3.0`
- Vite 실제 해석 버전: `8.3.0`
- Context7 상태: 현재 세션에서 도구를 사용할 수 없어 라이브러리 ID 및 JavaScript 문서를 조회하지 못했다.
- 구현 전 React 또는 외부 라이브러리 API가 필요하면 설치 버전을 다시 확인하고 Context7 JavaScript 문서를 조회한다.
- Context7 확인이 불가능한 API는 사용하지 않는다.

## Tasks

### T-001 — 구현 범위와 미확정 계약 확인

- 상태: Blocked
- 연결 FR: FR-011, FR-013, FR-015, FR-017
- 예상 파일: 없음
- 작업:
  - `POST /chat` 응답 메시지 필드가 `message`인지 `ai_message`인지 확정한다.
  - 채팅 요청 중 상태의 표시 방식과 중복 전송 방지 기준을 확정한다.
- 차단 사유:
  - 백엔드 선언 응답 모델과 실제 반환 필드가 불일치한다.
  - API 계약을 임의로 해석하거나 변경할 수 없다.

### T-002 — 화면 골격과 설계도 기반 스타일 구현

- 상태: Planned
- 연결 FR: FR-001, FR-003, FR-004, FR-005, FR-006
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.jsx`
  - 수정: `frontend/vite-project/src/App.css`
  - 수정: `frontend/vite-project/src/index.css`
- 작업:
  - Vite 기본 화면을 좌측 설정 패널·우측 헤더·대화 영역·입력 영역 구조로 교체한다.
  - 설계도에서 확인되는 텍스트, 카드, 색상 계층, 정렬, 둥근 모서리와 그림자를 반영한다.
  - 기존 CSS 커스텀 속성을 우선 재사용한다.
  - 사용자와 AI 메시지의 시각적 구분을 반영한다.

### T-003 — 설정 컨트롤과 접근성 구현

- 상태: Planned
- 연결 FR: FR-002, FR-008, FR-019, FR-020, FR-021, FR-022
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.jsx`
  - 수정: `frontend/vite-project/src/App.css`
- 작업:
  - 모델 선택, 시스템 프롬프트, Temperature, Top P, Num Predict 입력 컨트롤을 구현한다.
  - 각 컨트롤을 React 로컬 상태로 관리한다.
  - `label` 또는 동등한 접근 가능한 이름을 제공한다.
  - 키보드 조작과 비활성 상태 전달을 구현한다.
  - 색상 외의 수단으로 메시지 주체와 상태를 구분한다.

### T-004 — 대화 입력 및 초기화 동작 구현

- 상태: Planned
- 연결 FR: FR-009, FR-010, FR-012
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.jsx`
  - 수정: `frontend/vite-project/src/App.css`
- 작업:
  - 메시지 입력과 현재 설정값 수집을 구현한다.
  - 대화 초기화 버튼으로 화면의 메시지 상태를 초기화한다.
  - API 연동 전까지는 API 호출과 응답 필드 처리를 추가하지 않는다.
- 참고:
  - Enter 키 동작과 초기 빈 대화 UI는 미확정이므로 Open Questions 해결 전 임의로 추가하지 않는다.

### T-005 — 모델 목록 및 채팅 API 연동

- 상태: Blocked
- 연결 FR: FR-007, FR-010, FR-011, FR-013, FR-014, FR-015, FR-016, FR-017, FR-018
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.jsx`
  - 선택적 생성: `frontend/vite-project/src/api/chat.js`
- 작업:
  - 기존 `GET http://localhost:8000/models` 호출을 추가한다.
  - 기존 `POST http://localhost:8000/chat`에 승인된 요청 필드만 전송한다.
  - 확정된 응답 필드로 AI 메시지를 표시한다.
  - 인증 헤더를 새로 추가하지 않는다.
- 차단 사유:
  - T-001의 응답 필드 계약 확정이 필요하다.
  - 오류·로딩 상태 정책이 확정되지 않았다.

### T-006 — 로딩·빈 결과·오류 상태 구현

- 상태: Blocked
- 연결 FR: FR-007, FR-011, FR-013
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.jsx`
  - 수정: `frontend/vite-project/src/App.css`
- 작업:
  - 모델 목록 로딩·빈 결과·오류 상태를 구현한다.
  - 채팅 전송 중·실패·서버 연결 불가 상태를 구현한다.
- 차단 사유:
  - 설계도에 상태별 UI, 문구, 재시도 정책이 없다.

### T-007 — 반응형 레이아웃 구현

- 상태: Blocked
- 연결 FR: FR-001, FR-004, FR-005
- 예상 파일:
  - 수정: `frontend/vite-project/src/App.css`
  - 필요 시 수정: `frontend/vite-project/src/App.jsx`
- 작업:
  - 사이드바와 메인 영역의 태블릿·모바일 배치 규칙을 구현한다.
- 차단 사유:
  - 설계도는 데스크톱 화면만 제공하며 반응형 동작이 확정되지 않았다.

### T-008 — 검증 실행 및 결과 보고

- 상태: Planned
- 연결 FR: FR-001~FR-022, AC-001~AC-008
- 예상 파일: 없음
- 작업:
  - `npm run lint`를 실행한다.
  - 프로젝트에 테스트 도구와 테스트 스크립트가 있는지 재확인한다.
  - 테스트 명령이 없으면 미실행 사유를 보고하고 통과했다고 표현하지 않는다.
  - `npm run build`를 실행한다.
  - 실제 실행 결과와 실패 항목을 보고한다.
- 제외:
  - TypeScript 타입 검사
  - 승인되지 않은 테스트 도구 또는 패키지 설치

## Requirement Traceability

| FR | 작업 |
| --- | --- |
| FR-001~FR-006 | T-002 |
| FR-007 | T-005, T-006 |
| FR-008 | T-003 |
| FR-009~FR-010 | T-004, T-005 |
| FR-011 | T-001, T-005, T-006 |
| FR-012 | T-004 |
| FR-013 | T-001, T-005, T-006 |
| FR-014~FR-018 | T-001, T-005 |
| FR-019~FR-022 | T-003 |
| AC-001~AC-008 | T-008 |

## Blocked / Open Questions

1. `POST /chat`의 응답 메시지 필드는 `message`와 `ai_message` 중 무엇인가?
2. 모델 목록과 채팅 요청의 로딩·빈 결과·오류 UI 및 문구는 무엇인가?
3. 채팅 실패 시 재시도 기능이 필요한가?
4. Enter 키와 `Shift+Enter`의 구체적 동작은 무엇인가?
5. 빈 대화 초기 상태에는 무엇을 표시하는가?
6. 모바일·태블릿에서 사이드바와 입력 영역은 어떻게 배치하는가?
7. 외부 API 응답의 런타임 검증이 필요한가? 필요 시 패키지 도입은 별도 승인 대상이다.
8. Context7이 연결된 세션에서 React 19.3.0과 Vite 8.3.0의 JavaScript 사용법을 확인할 수 있는가?
