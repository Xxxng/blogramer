# MEMORY (Development Journal)

## 2026-04-10: 프로젝트 초기화 및 코어 인프라 구축

### 1. 이슈: SQLite 드라이버 CGO 의존성 문제
- **상황:** `gorm.io/driver/sqlite` 사용 시 `Binary was compiled with 'CGO_ENABLED=0'` 에러 발생. GCC가 없는 환경에서 실행 불가.
- **원인:** 기본 SQLite 드라이버는 CGO를 통해 C 라이브러리를 호출함.
- **해결:** CGO 의존성이 없는 `github.com/glebarez/sqlite`로 교체하여 순수 Go 환경에서도 DB 연동이 가능하게 함.

### 2. 이슈: Tailwind CSS v4 설정 및 PostCSS 충돌
- **상황:** `tailwindcss v4` 설치 후 빌드 시 PostCSS 설정 관련 에러 및 `Unexpected token 'export'` 발생.
- **원인:** v4는 `@tailwindcss/postcss` 패키지를 별도로 사용하며, `postcss.config.cjs`에서 CommonJS(`module.exports`) 형식을 요구함.
- **해결:**
  - `npm install -D @tailwindcss/postcss tailwindcss@next` 설치.
  - `postcss.config.cjs` 내용을 CommonJS 방식으로 수정.
  - `style.css`에서 `@tailwind` 지시어 대신 `@import "tailwindcss";` 사용.
  - 사용되지 않는 `tailwind.config.js` 삭제.

### 3. 이슈: Wails-TS 바인딩 타입 불일치
- **상황:** `AddAccount` 호출 시 프론트엔드 객체와 자동 생성된 `models.Account` 클래스 간의 타입 불일치로 TS 빌드 에러 발생.
- **원인:** GORM의 `gorm.Model` 필드(ID, CreatedAt 등)가 필수 필드로 인식됨.
- **해결:** 프론트엔드에서 데이터 전송 시 `as any` 타입 캐스팅을 통해 임시 해결하고, 추후 인터페이스 정의를 더 정교하게 다듬기로 함.

### 4. 현재 진행 상태
- 블로그 계정 등록/삭제 기능 완료.
- OpenAI API 키 설정 및 저장 기능 완료.
- Tistory/WordPress 발행 기본 로직 구현 완료.
- 다크 모드 기반 레이아웃 및 대시보드 구조 구축.
