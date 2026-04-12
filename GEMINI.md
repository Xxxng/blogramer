# GEMINI (Onboarding Guide)

**Blogramer: Wails 기반 블로그 대량 생산 자동화 도구**

이 문서는 Blogramer 프로젝트의 통합 온보딩 가이드입니다. 모든 AI 에이전트는 세션 시작 시 이 문서를 필독하고, 프로젝트의 아키텍처와 요구사항을 깊이 이해한 상태에서 작업을 수행해야 합니다.

## 1. 프로젝트 개요 (Core Purpose)
Blogramer는 사용자가 로컬 환경에서 다수의 블로그(Tistory, WordPress, Naver 등)를 통합 관리하고, AI(OpenAI/Claude)를 활용해 양질의 콘텐츠를 대량으로 생성 및 발행할 수 있도록 돕는 데스크톱 애플리케이션입니다.

## 2. 핵심 기술 스택 (Tech Stack)
- **Backend**: Go 1.23+ (Wails v2, GORM, SQLite)
- **Frontend**: React 18 (TypeScript, Tailwind CSS v4, Lucide React)
- **Intelligence**: OpenAI API / Claude API 연동
- **Database**: 로컬 SQLite (CGO-free driver 사용)

## 3. 에이전트 행동 지침 (Agent Mandates)
- **규칙 우선**: 모든 코딩은 `.gemini/rules/wails-guidelines.md`에 명시된 규칙을 절대적으로 준수합니다.
- **문서 동기화**: 주요 기능 구현이나 아키텍처 결정 시 `shared/MEMORY.md`에 ADR 형식으로 기록합니다.
- **보안 최우선**: 사용자의 API Key, 액세스 토큰 등 민감한 정보는 절대로 로그에 출력하거나 외부로 노출하지 않으며, 로컬 DB(`Setting` 모델)를 통해서만 관리합니다.
- **검증 필수**: 코드 변경 후에는 `wails dev` 환경에서 정상 작동 여부를 확인하고, 가능하다면 테스트 코드를 추가합니다.

## 4. 참조 문서 (Key References)
- `shared/CPS.md`: 프로젝트 배경, 문제 정의 및 해결책 (Why & What)
- `shared/PRD.md`: 상세 기능 요구사항 및 기술 사양 (Requirements)
- `shared/MEMORY.md`: 개발 기록 및 의사결정 로그 (History)
- `.gemini/rules/`: 코딩 스타일 및 아키텍처 규칙
