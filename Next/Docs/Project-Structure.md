# Next.js 프로젝트 구조

Next.js 애플리케이션의 프로젝트 구조에 대한 개요를 제공.

여기에는 최상위 파일과 폴더, 구성 파일, 그리고 앱 디렉터리와 페이지 디렉터리 내의 라우팅 규칙이 포함된다.

## Top-level folders (최상위 폴더)

최상위 폴더는 애플리케이션의 코드와 정적 코드를 정리하는데 사용된다.

```

src : 애플리케이션의 주요 코드 작성
  - app : 앱 라우터
  - pages : 페이지 라우터

public : 정적 파일 관리

```

## Top-level files (최상위 파일)

최상위 파일들은 애플리케이션을 구성, 의존성을 관리, 미들웨어를 실행, 모니터링 도구를 통합, 환경 변수를 정의하는 데 사용된다.

- package.json : 프로젝트의 메타데이터를 포함하며, 의존성 관리, 스크립트 실행, 프로젝트 정보 제공 등에 사용
- .env : 환경 변수를 정의하여 애플리케이션에서 사용할 수 있도록 한다.
- next.config.js : Next.js 애플리케이션의 설정을 정의한다.
- babel.config.js : Babel 설정 파일로, ES6/ES7 코드 변환을 위한 설정을 정의한다.
- tsconfig.json : TypeScript 설정 파일로, TypeScript 컴파일러 옵션을 정의한다.
- jest.config.js : Jest 테스트 프레임워크 설정 파일로, 테스트 환경을 구성한다.
- middleware.js : 서버 사이드 미들웨어를 정의하여 요청을 가로채고 처리할 수 있다.
- monitoring.js : 모니터링 도구와의 통합을 설정하여 애플리케이션 상태를 모니터링한다.

## `app` Routing Conventions (앱 라우팅 규칙)

### Routing Files (라우팅 파일)

---

| 파일         | 파일 유형     | 역할                              |
| ------------ | ------------- | --------------------------------- |
| layout       | .js .jsx .tsx | 애플리케이션의 레이아웃을 정의    |
| page         | .js .jsx .tsx | 각각의 페이지 컴포넌트            |
| loading      | .js .jsx .tsx | 로딩 UI를 정의                    |
| not-found    | .js .jsx .tsx | "페이지를 찾을 수 없음" UI를 정의 |
| error        | .js .jsx .tsx | 에러 UI를 정의                    |
| global-error | .js .jsx .tsx | 전역 에러 UI를 정의               |
| route        | .js .ts       | API 엔드포인트                    |
| template     | .js .jsx .tsx | 다시 랜더링되는 레이아웃          |
| default      | .js .jsx .tsx | 병렬 경로의 폴백 페이지를 정의    |

---
