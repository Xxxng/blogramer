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

- **2026-04-12 (6)**: 프론트엔드 빌드(TS) 에러 해결.
  - **App.tsx**: 누락되었던 `PostEditor` 컴포넌트 임포트 추가.
  - **Accounts.tsx**: Wails 생성 모델에서 지원되지 않는 `models.Platform` 타입 캐스팅 제거 (string으로 대체).
  - **Posts.tsx**: 누락되었던 `useNavigate` 훅 선언 추가하여 `navigate` 에러 해결.
  - **Validation**: `npm run build`를 통해 모든 타입 체크와 빌드가 정상 통과됨을 확인함.

- **2026-04-12 (7)**: Wails 바인딩 경고 해결 및 전체 DTO 패턴 적용 완료.
  - **Cleanup**: `Category`, `Subject` 모델에 대한 전용 DTO(`CategoryResponse`, `SubjectResponse`)를 신설하여 `time.Time` 및 `gorm.DeletedAt` 관련 바인딩 경고 제거.
  - **Consistency**: 모든 API 메서드(`GetCategories`, `GetSubjects` 등)가 DTO를 반환하도록 `app.go` 및 백엔드 로직 수정.
  - **Final Sync**: `wails generate module` 성공 및 바인딩 파일 최신화 완료.

- **2026-04-12 (8)**: 리소스 빌드 에러 해결 및 첫 번째 UI 테스트 통과.
  - **Bug Fix**: `wails.json` 설정 변경으로 발생한 `Blogramer-res.syso` 누락 문제를 `wails build`를 통한 리소스 재생성으로 해결.
  - **UI Testing**: Playwright를 이용한 네비게이션 테스트(`navigation.spec.ts`)를 실행하여 모든 항목(대시보드, 계정, 포스팅, 설정) 통과 확인.
  - **Mandate Check**: "No Pass, No Push" 원칙에 따라 테스트 성공 후 푸시 프로세스 진행.

- **2026-04-12 (9)**: 대시보드 동적 데이터 연결 및 AI 포스팅 생성 버그 수정.
  - **Dashboard**: `GetDashboardStats` API를 구현하여 계정 수, 발행 포스트 수, 초안 수 및 최근 활동 내역을 실시간으로 표시하도록 개선.
  - **AI Generation**: `GeneratePostWithKeyword` API를 신설하여 프론트엔드에서 입력한 키워드가 실제 AI 프롬프트에 반영되지 않고 하드코딩된 ID(1)를 참조하던 버그 해결.
  - **Type Safety**: 신규 DTO(`DashboardStats`) 정의 및 Wails 바인딩 갱신을 통해 프론트엔드-백엔드 간 타입 일관성 유지.
  - **Validation**: `npm run build`를 통해 프론트엔드 타입 체크 완료 및 백엔드 컴파일 확인.

- **2026-04-12 (10)**: 예약 발행 스케줄러(Post Scheduler) 엔진 및 UI 구현.
  - **Engine**: 백그라운드 워커(`StartScheduler`)를 구현하여 매분마다 예약 건을 확인하고 발행 프로세스 수행.
  - **Offline Handling**: 앱 종료 등으로 예약 시간을 놓친 경우, PRD 명세에 따라 자동으로 +24시간 연기하는 "오프라인 보상 로직" 구현.
  - **API**: `AddSchedule`, `GetSchedules`, `CancelSchedule` 등의 API를 신설하여 예약 관리 워크플로우 완성.
  - **Frontend UI**: `PostEditor.tsx`에 예약 발행 버튼 및 모달(datetime picker)을 추가하여 사용자가 원하는 시간에 포스팅을 예약할 수 있도록 구현.
  - **Validation**: `wails build`를 통해 전체 빌드 성공 확인 및 Playwright 네비게이션 테스트(4/4) 통과.
