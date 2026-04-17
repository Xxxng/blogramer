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
- **개발 사이클 준수 (MUST)**: 모든 기능 개발 후에는 반드시 다음 순서를 따르며, **테스트가 통과하지 않으면 절대 푸시하지 않습니다.**
  1. **UI/로직 테스트**: `npx playwright test`를 실행하여 검증. 실패 시 디버깅 후 재테스트.
  2. **Pass 확인**: 모든 테스트가 'Green' 상태임을 확인.
  3. **메모리 정리**: `shared/MEMORY.md`에 작업 내용 및 ADR 기록.
  4. **깃 푸쉬**: 테스트 통과가 확인된 변경 사항만 `origin master`에 푸시.
- **규칙 우선**: 모든 코딩은 `.gemini/rules/wails-guidelines.md`에 명시된 규칙을 절대적으로 준수합니다.

## 4. 참조 문서 (Key References)
- `shared/CPS.md`: 프로젝트 배경, 문제 정의 및 해결책 (Why & What)
- `shared/PRD.md`: 상세 기능 요구사항 및 기술 사양 (Requirements)
- `shared/MEMORY.md`: 개발 기록 및 의사결정 로그 (History)
- `.gemini/rules/`: 코딩 스타일 및 아키텍처 규칙
