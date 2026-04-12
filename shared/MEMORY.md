# MEMORY (ADR & Session Logs)

이 파일은 프로젝트의 주요 의사결정(ADR: Architecture Decision Record)과 세션별 진행 상황을 기록하는 공간으로 초기화되었습니다.

## 1. Architecture Decision Records (ADR)
- **ADR-001: ECC 익스텐션 기반 구조 개편 (2026-04-12)**
  - **상황**: 기존 `shared/` 문서 기반의 컨텍스트 관리가 AI의 자동화된 규칙 준수에는 한계가 있음.
  - **결정**: `.gemini/rules/` 및 `GEMINI.md` 진입점 체제로 전환하여 AI 에이전트의 강제성을 높임.
  - **결과**: AI가 작업을 시작할 때 명확한 룰을 우선적으로 로드하고, 불필요한 컨텍스트 혼선을 방지함.

## 2. Session Logs
- **2026-04-12**: 워크스페이스 구조 전면 리팩토링 진행 중.
