# Wails Project Guidelines

이 규칙은 Blogramer 프로젝트(Wails v2 기반)의 코드 품질과 일관성을 유지하기 위해 AI 에이전트가 반드시 준수해야 하는 지침입니다.

## 1. Backend (Go) Guidelines
- **Project Structure**:
  - `backend/api/`: Wails 앱에 바인딩되는 함수 정의.
  - `backend/models/`: DB 모델(GORM) 정의.
  - `backend/database/`: DB 연결 및 마이그레이션 관리.
  - `backend/platforms/`: 외부 블로그 플랫폼 통신 로직.
- **Naming**: PascalCase (Public), camelCase (Private).
- **Error Handling**: 에러 발생 시 로그를 남기고, 프론트엔드가 이해할 수 있는 명확한 에러 메시지를 반환해야 함.
- **Dependency**: **CGO를 절대 사용하지 않음.** SQLite는 `github.com/glebarez/sqlite`를 사용해야 함.

## 2. Frontend (React/TypeScript) Guidelines
- **Coding Style**:
  - React 함수형 컴포넌트 선언 방식 준수.
  - TypeScript의 엄격한 타입 체크 활용. (임시 해결을 위한 `any` 사용 지양)
- **Styling**: **Tailwind CSS v4** 사용. `@tailwindcss/postcss` 설정에 따른 최신 문법 준수.
- **Components**: UI 구성 요소는 `frontend/src/components/`에, 페이지 단위는 `frontend/src/pages/`에 위치.

## 3. Communication (Wails Bindings)
- **Data Transfer**: 백엔드와 프론트엔드 간의 데이터 교환 시 타입 안전성을 보장하기 위해 가능한 DTO(Data Transfer Object) 패턴 권장.
- **Runtime API**: Wails 런타임 API(Events, Window 등) 사용 시 `wailsjs/runtime`을 올바르게 임포트하여 사용.

## 4. Documentation
- 모든 중요 로직 변경이나 아키텍처 결정은 `shared/MEMORY.md`의 ADR 섹션에 기록함.
- 복잡한 로직에는 반드시 JSDoc(TS) 또는 GoDoc(Go) 스타일의 주석을 추가함.
