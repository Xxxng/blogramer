# MEMORY (ADR & Session Logs)

이 파일은 프로젝트의 주요 의사결정(ADR: Architecture Decision Record)과 세션별 진행 상황을 기록하는 공간으로 초기화되었습니다.

## 1. Architecture Decision Records (ADR)
- **ADR-001: ECC 익스텐션 기반 구조 개편 (2026-04-12)**
  - **상황**: 기존 `shared/` 문서 기반의 컨텍스트 관리가 AI의 자동화된 규칙 준수에는 한계가 있음.
  - **결정**: `.gemini/rules/` 및 `GEMINI.md` 진입점 체제로 전환하여 AI 에이전트의 강제성을 높임.
  - **결과**: AI가 작업을 시작할 때 명확한 룰을 우선적으로 로드하고, 불필요한 컨텍스트 혼선을 방지함.

- **ADR-002: API 통신을 위한 DTO(Data Transfer Object) 패턴 도입 (2026-04-12)**
  - **상황**: 백엔드의 GORM 모델을 프론트엔드에 직접 노출하여 타입 불일치 및 불필요한 필드(ID, CreatedAt 등) 노출 문제 발생.
  - **결정**: `models/dto.go`를 신설하고 `AccountRequest`, `AccountResponse`, `PostResponse` 등을 정의하여 API 계층에서만 사용하도록 함.
  - **결과**: Wails가 생성하는 TypeScript 타입의 정확도가 높아졌으며, 프론트엔드 코드에서 `any` 타입을 제거하여 타입 안정성을 확보함.

## 2. Session Logs
- **2026-04-12 (1)**: 워크스페이스 구조 전면 리팩토링 완료 및 `GEMINI.md` 진입점 구축.
- **2026-04-12 (2)**: AI 포스팅 생성 엔진 고도화 및 관리 UI 구현.
  - **AI Engine**: GPT-4o로 텍스트 생성 퀄리티 향상 및 DALL-E 3 연동을 통한 자동 이미지 삽입 기능 구현.
  - **Post Management**: `Posts.tsx` 신설 및 `GetPosts`, `DeletePost` API 연동을 통한 목록 관리 및 발행 프로세스 구축.
  - **Type Safety**: 프론트엔드-백엔드 간 DTO 패턴 적용으로 `any` 캐스팅 제거.

- **2026-04-12 (3)**: UI 테스트 환경 구축 및 개발 사이클 원칙(Mandate) 수립.
  - **UI Testing**: Playwright 설치 및 네비게이션 자동화 테스트(`navigation.spec.ts`) 작성.
  - **Work Principle**: "기능 개발 -> UI 테스트 -> 메모리 정리 -> 깃 푸쉬" 사이클을 `GEMINI.md`에 명시하고 강제화함.

- **2026-04-12 (4)**: Wails 바인딩 이슈 해결 및 DTO 동기화.
  - **Bug Fix**: `models/dto.go`에서 누락되었던 `ToAccountResponses` 함수 추가 및 백엔드 컴파일 에러 해결.
  - **Binding Sync**: `wails generate module` 명령을 통해 프론트엔드 바인딩 파일(`wailsjs/`) 강제 갱신 완료.
  - **Validation**: `GetPosts`, `DeletePost` 등이 정상적으로 TS 모델에 포함되었음을 확인함.

- **2026-04-12 (5)**: 마크다운 에디터 UI 구현 및 포스팅 관리 워크플로우 완성.
  - **Backend**: 포스팅 상세 조회(`GetPost`) 및 내용 수정(`UpdatePost`) API 구현. `PostResponse` DTO에 `Content` 필드 추가.
  - **Frontend**: `PostEditor.tsx` 신설 및 `textarea` 기반 편집/미리보기 기능 구현.
  - **Navigation**: `/posts/edit/:id` 라우트 등록 및 포스팅 목록 화면과 에디터 간 이동 연결 완료.
