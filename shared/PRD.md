# PRD (Product Requirements Document)

## 1. 핵심 기능 요구사항
### 1.1 계정 및 설정 관리
- **다중 플랫폼 지원:** Tistory, WordPress, Naver Blog, Blogger 계정 등록/삭제.
- **API 설정:** OpenAI API 키 및 각 블로그별 인증 정보(Access Token, App Password 등) 관리.
- **로컬 보안:** 모든 민감 정보는 로컬 SQLite DB에 저장.

### 1.2 콘텐츠 생성 (AI)
- **주제 및 키워드 추출:** 구글 검색어 트렌드 또는 사용자 지정 카테고리 기반 주제 선정.
- **자동 포스팅 생성:** 마크다운 형식을 지원하며 SEO 최적화된 본문 생성.
- **이미지 연동:** DALL-E 또는 무료 이미지 API를 통한 본문 이미지 자동 삽입.

### 1.3 발행 및 스케줄링
- **즉시 발행:** 생성된 글을 선택한 블로그에 즉시 업로드.
- **예약 발행:** 특정 날짜와 시간에 발행되도록 큐(Queue)에 등록.
- **발행 이력:** 성공/실패 로그 및 발행된 글의 URL 관리.

## 2. 기술적 요구사항
- **Cross-Platform:** Windows 환경 우선 지원 (Wails 활용).
- **CGO-Free:** GCC 설치 없이도 동작 가능하도록 CGO 의존성 제거 (Pure Go SQLite 드라이버 사용).
- **Modern UI:** Tailwind CSS v4 기반의 다크 모드 UI 제공.

## 3. 사용자 인터페이스(UI) 요구사항
- **Dashboard:** 전체 발행 현황 요약.
- **Account Manager:** 플랫폼별 계정 리스트 및 등록 폼.
- **Subject Manager:** 카테고리별 키워드 리스트 및 생성 관리.
- **Post Manager:** 작성된 글 목록 및 발행 상태 제어.
- **Settings:** API 키 및 앱 환경설정.
