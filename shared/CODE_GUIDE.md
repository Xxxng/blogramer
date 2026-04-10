# CODE_GUIDE (Development Guide)

## 1. 기술 스택 및 라이브러리
- **Backend:** Go 1.23+
  - `github.com/wailsapp/wails/v2`: 데스크톱 앱 프레임워크
  - `gorm.io/gorm`: ORM
  - `github.com/glebarez/sqlite`: CGO-free SQLite 드라이버
  - `github.com/sashabaranov/go-openai`: OpenAI API 클라이언트
- **Frontend:** React 18, TypeScript
  - `tailwindcss v4`: 스타일링 (@tailwindcss/postcss)
  - `lucide-react`: 아이콘
  - `react-router-dom`: 라우팅

## 2. 프로젝트 구조
- `/backend`: Go 백엔드 로직
  - `/api`: Wails Bind용 API 함수 (Account, Post, Subject, Setting)
  - `/database`: DB 초기화 및 연결 관리 (`db.go`)
  - `/models`: GORM 모델 정의 (`models.go`)
  - `/platforms`: 블로그 플랫폼별 Publisher 인터페이스 및 구현체
- `/frontend/src`: React 프론트엔드
  - `/components`: 공통 컴포넌트 (Layout 등)
  - `/pages`: 페이지 단위 컴포넌트 (Dashboard, Accounts, Settings 등)
  - `/wailsjs`: Wails 자동 생성 바인딩 코드

## 3. 핵심 데이터 모델 (Models)
- `Account`: 플랫폼, 계정명, 사이트URL, 액세스토큰, 앱비밀번호 등.
- `Post`: 제목, 본문, 태그, 상태(draft/published/failed), 발행일시, URL 등.
- `Subject`: 카테고리ID, 키워드, 사용여부 등.
- `Setting`: Key-Value 기반 앱 설정 (예: `openai_api_key`).

## 4. 코딩 가이드라인
- **Indentation:** Go (Tab), TS/CSS (2 Spaces).
- **Naming:** 
  - Go: PascalCase (Public), camelCase (Private).
  - TS: PascalCase (Component), camelCase (Function/Variable).
- **Error Handling:** Go 백엔드에서 에러 발생 시 프론트엔드에 명확한 메시지를 전달하도록 설계.
- **CGO Avoidance:** Windows 배포 편의성을 위해 CGO 사용을 지양하고 Pure Go 라이브러리 선호.
