# Project: Blogramer

이 프로젝트는 Wails(Go + React) 기반의 블로그 자동화 및 대량 생산 도구입니다.
모든 에이전트는 세션 시작 시 다음 문서들을 반드시 읽고 프로젝트의 맥락과 기술적 가이드를 준수해야 합니다.

## 핵심 문서 (반드시 읽을 것)
1. **shared/CPS.md**: 프로젝트의 배경, 문제 정의 및 해결책 (Context, Problem, Solution)
2. **shared/PRD.md**: 상세 기능 요구사항 및 기술 사양 (Product Requirements Document)
3. **shared/CODE_GUIDE.md**: 프로젝트 구조, 코딩 컨벤션, 핵심 로직 및 라이브러리 가이드
4. **shared/MEMORY.md**: 개발 기록, 주요 이슈 해결 과정 및 현재 진행 상태

## 에이전트 행동 지침
- 새로운 기능을 추가하거나 버그를 수정하기 전, `shared/CODE_GUIDE.md`의 구조와 컨벤션을 확인하십시오.
- 구현 중 마주치는 이슈와 해결 방법은 `shared/MEMORY.md`에 기록하여 지식을 자산화하십시오.
- 모든 기능은 `shared/PRD.md`에 정의된 요구사항을 바탕으로 구현되어야 합니다.
- 민감한 정보(API Key 등)는 반드시 로컬 DB에 안전하게 관리되도록 구현하십시오.
