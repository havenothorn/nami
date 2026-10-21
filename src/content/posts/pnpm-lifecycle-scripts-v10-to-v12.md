---
id: pnpm-lifecycle-scripts-v10-to-v12
title: "pnpm v10의 breaking change는 어떻게 v11의 표준이 되었나 (v10 → v12, 2026 업데이트)"
excerpt: "pnpm v10에서 기본 차단된 라이프사이클 스크립트 정책이 v11과 v12에서 어떻게 바뀌고 자리잡았는지 정리합니다."
category: Engineering
tags:
  - pnpm
  - Supply Chain Security
  - JavaScript
date: "2026-10-21"
readTime: "10 min read"
imageUrl: ""
author:
  name: "Nami"
  avatarUrl: ""
  role: "Author"
engagementScore: "0%"
recommendedPostIds: []
---

2025년 3월 15일, pnpm이 v10에서 라이프사이클 스크립트를 차단한 이유와 설정 방법에 대한 [글](https://nami-socket.tistory.com/63)을 썼다. 그때 해결 방법으로 소개한 설정은 이제 더 이상 쓰이지 않는다. 업데이트된 사항을 알아보자!

회사에서 쓰던 pnpm을 v10에서 v12로 올렸더니 배포 단계에서 에러가 났다. 원인을 확인해 보니 라이프사이클 스크립트를 허용하는 방식이 바뀌어 있었다. v10 글을 써 놓고도 v11, v12로 넘어오며 바뀐 부분을 놓친 것을 반성했고, 이번에 확실히 정리하려고 이 글을 쓴다.

### Too Long; Didn't Read

- **v10 (2025.01)**: 의존성의 라이프사이클 스크립트를 기본 차단. 허용은 `package.json`의 `pnpm.onlyBuiltDependencies`. 승인되지 않은 빌드는 경고를 출력하고 `approve-builds` 명령어를 통해 허용 처리할 수 있다.
- **v11 (2026.04)**: 허용 설정이 `pnpm-workspace.yaml`의 `allowBuilds` 하나로 통합. 승인되지 않은 빌드가 있으면 설치 자체가 에러로 끝난다 (`strictDepBuilds` 기본값 true).
- **v12 (현재)**: 내부 구현이 바뀌었을 뿐, 이 정책은 v11 그대로 유지된다.

## 2025년 3월, v10

pnpm을 v10으로 올린 뒤 bcrypt 모듈을 찾을 수 없다는 에러가 났다. GitHub에 같은 증상의 이슈([#9042](https://github.com/pnpm/pnpm/issues/9042))가 있었고, 릴리스 노트에 원인이 명시되어 있었다.

> 종속성의 라이프사이클 스크립트는 기본적으로 설치 중에 실행되지 않습니다. 이는 보안을 강화하기 위한 획기적인 변경입니다. 특정 종속성의 라이프사이클 스크립트를 허용하려면 package.json의 pnpm.onlyBuiltDependencies 필드에 해당 종속성을 나열해야 합니다.

설치는 성공했지만, bcrypt가 설치 단계에서 진행해야 할 네이티브 바인딩 빌드(C++ 코드를 Node.js가 읽을 수 있는 파일로 만드는 작업)가 건너뛰어졌다. 그래서 실행할 때 모듈을 찾을 수 없다는 에러가 난 것이다.

## Lifecycle Script란

`package.json`의 `scripts` 필드에는 개발자가 정해둔 스크립트(`dev`, `build` 등)뿐 아니라 미리 정해진 스크립트가 있다. 패키지의 **생애 주기 중 특정 시점에 자동으로 실행**되기 때문에 라이프사이클 스크립트라고 부른다.

```json
{
  "name": "namis-log",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "postinstall": "node scripts/setup.js"
  },
  "dependencies": {
    "@tanstack/react-router": "^1.170.45",
    "...": "...",
    "react": "^19.3.1",
    "react-dom": "^19.3.1"
  },
  "devDependencies": {
    "@tailwindcss/typography": "^0.5.20",
    "...": "...",
    "tailwindcss": "^4.3.3",
    "typescript": "~5.8.3",
    "vite": "^8.3.4"
  }
}
```

- `preinstall` (설치 직전)
- `install` (설치 시)
- `postinstall` (설치 직후)
- `prepublish` / `postpublish` (배포 전후, 패키지를 배포하는 쪽의 훅)

pnpm의 차단 대상은 내가 설치하는 의존성(전이 의존성 포함)의 `preinstall` / `install` / `postinstall`이다. 예를 들어 `node_modules/bcrypt/package.json`에 적힌 스크립트가 여기에 해당한다. 내 프로젝트의 `package.json`에 적은 scripts는 내가 쓴 코드이므로 그대로 실행된다.

## pnpm은 왜 막았을까

자동으로 실행된다는 특성 때문에 보안 위협이 된다. 사용자는 `pnpm install`만 했을 뿐인데, 내부적으로 남의 코드가 설치 직후 실행되어 데이터를 탈취하거나 악성코드를 심을 수 있다. `micro-username`, `@primeo/address`, `ovh-ui/oui-checkbox`, `node-hsf`, `alicov` 같은 패키지가 이런 시도를 했다.

pnpm 메인테이너 Zoltan Kochan은 Rspack 공급망 공격에 대한 대응으로 이 조치를 취했다고 밝혔다. `@rspack/core`, `@rspack/cli`가 설치될 때 `postinstall` 스크립트로 암호화폐 모네로 채굴용 XMRig 악성 코드를 배포한 사건이다.

![Rspack 공급망 공격 관련 pnpm 메인테이너 게시물](/images/posts/pnpm-lifecycle-20261020-220725.png)

> 이런 사건이 터질 때마다 사용자들은 라이프사이클 스크립트를 실행하기 어렵게 만들어달라는 요청을 쓰나미처럼 보내옵니다. X에 올린 설문을 보면 대부분의 사용자가 기본적으로 스크립트를 차단하는 걸 찬성하고 있는 것 같습니다. 하지만 솔직히 선택의 여지가 없다고 생각해요. Bun이 이미 라이프사이클 스크립트를 기본적으로 차단하기 때문에, Bun이 pnpm보다 더 안전하다고 주장할 수 있기 때문이죠. (Kochan의 X에서 인용)

## v10 때의 해결 방법 (지금은 legacy)

v10에서는 두 가지 방법이 있었다.

- `pnpm approve-builds`: 무시된 빌드를 대화형으로 개발자가 검토하고 승인. 승인하면 `onlyBuiltDependencies`에 자동으로 추가된다.
- `package.json`에 `pnpm.onlyBuiltDependencies`를 직접 지정한다.

![pnpm v10에서 빌드 스크립트를 승인하는 화면](/images/posts/pnpm-lifecycle-20261020-220822.png)

![pnpm v10의 onlyBuiltDependencies 설정 예시](/images/posts/pnpm-lifecycle-20261020-220830.png)

![pnpm v10에서 빌드 스크립트 승인 후 표시되는 화면](/images/posts/pnpm-lifecycle-20261020-220839.png)

그때는 승인되지 않은 빌드가 있으면 설치 끝에 경고가 떴고, 설치 자체는 성공했다.

## 지금 (v11, v12)의 해결 방법

1. **에러 형태가 바뀌었다.**  
   v11부터 `strictDepBuilds`가 기본값 `true`다. 승인 여부가 정해지지 않은 빌드 스크립트가 있으면 경고가 아니라 `ERR_PNPM_IGNORED_BUILDS` 에러로 설치가 비정상 종료된다. `strictDepBuilds: false`로 두면 예전처럼 경고만 출력되지만, 보안 측면에서는 권장하지 않는다.

2. **설정은 `allowBuilds` 하나로 통일되었다.**  
   `onlyBuiltDependencies`, `onlyBuiltDependenciesFile`, `neverBuiltDependencies`, `ignoredBuiltDependencies`, `ignoreDepScripts` 다섯 개가 v11에서 제거되고 `allowBuilds`로 통합됐다. 설정 위치도 `package.json`이 아니라 `pnpm-workspace.yaml`이다. v11은 `package.json`의 `pnpm` 필드 설정을 더 이상 읽지 않는다.

3. **승인 방법**
   - `pnpm approve-builds`: 무시된 빌드를 확인하고 승인 (결과는 `allowBuilds`에 기록)
   - `pnpm ignored-builds`: 무시된 빌드 목록 확인
   - `pnpm add`의 `--allow-build` 플래그로 추가하면서 승인
   - 설치 중 승인되지 않은 의존성은 `pnpm-workspace.yaml`의 `allowBuilds`에 placeholder 값으로 자동 추가되므로, `true` 또는 `false`를 채우면 된다.

```yaml
# pnpm-workspace.yaml
allowBuilds:
  bcrypt: true
  msw: true
  cypress: true
  '@sentry/cli': true
  '@scarf/scarf': false
```

![pnpm-workspace.yaml의 allowBuilds 설정 화면](/images/posts/pnpm-lifecycle-20261020-215712.png)

오타를 내보았는데 이렇게 설정된다. `false`로 거부한 패키지는 캐시에서 가져오는 경우에도 빌드되지 않는다.

![pnpm why 명령어의 의존성 조회 결과](/images/posts/pnpm-lifecycle-20261018-185446.png)

`pnpm why` 명령어를 통해 어떤 패키지가 해당 의존성을 요구하는지 알 수 있다.

## v10 → v11 마이그레이션

공식 codemod로 기존 설정을 자동 마이그레이션할 수 있다고 한다.

```bash
pnpx codemod run pnpm-v10-to-v11
```

## 달라진 점 정리

| 항목 | v10 | v11 이후 |
| --- | --- | --- |
| 허용 설정 | `pnpm.onlyBuiltDependencies` | `allowBuilds` |
| 설정 위치 | `package.json`의 pnpm 필드 | `pnpm-workspace.yaml` |
| 거부 설정 | `neverBuiltDependencies`, `ignoredBuiltDependencies` | `allowBuilds: false` |
| 미승인 빌드 | 경고 | 에러 (`strictDepBuilds` 기본값 true) |
| 승인/확인 명령 | `approve-builds` | `approve-builds`, `ignored-builds` 유지 |

## 배포 전 세팅하기

CI나 Docker 빌드처럼 로컬이 아닌 환경에서는 `approve-builds`를 실행할 수 없으니, `allowBuilds`를 미리 채워 두어야 한다. 이 설정이 커밋되지 않았거나 Dockerfile에서 `pnpm install` 전에 `pnpm-workspace.yaml`을 복사하지 않았다면, 로컬에서는 잘 되던 설치가 파이프라인에서 실패한다.

`bcrypt`처럼 네이티브 모듈을 쓰는 프로젝트라면 특히 그렇다. 네이티브 모듈은 JavaScript만이 아니라 C/C++로 짠 부분이 들어 있어서, 실행 환경(OS, CPU)에 맞는 바이너리(`.node` 파일)가 있어야 돌아간다. 설치할 때 `install` 스크립트가 이 바이너리를 컴파일하거나 미리 빌드된 파일을 내려받는데, 스크립트가 막히면 모듈이 아예 동작하지 않기 때문이다.

이전 회사에서 v10을 쓸 때 CI와 Docker 빌드에서 이 문제를 처음 겪었고, 지금 회사에서 v12로 올리면서 배포 단계에서 다시 마주쳤다.

## 안전 체크는 셀프

`allowBuilds`에 `true`를 적는 것은 이 패키지의 스크립트를 신뢰하겠다는 선언일 뿐, pnpm이 스크립트의 안전성을 검증해 주는 것이 아니다. 의존성을 승인하기 전에 어떤 스크립트를 실행하는지 한 번은 확인하는 습관이 필요하다.

## 단순 설정 방법만 바뀐 건 아니다

v10에서 pnpm이 막은 것은 설치 직후 자동으로 실행되는 스크립트 하나였다. 그런데 공급망 공격은 스크립트로만 들어오지 않는다. 그래서 v11에서는 설치되는 코드가 언제, 어디서 왔는지를 따지는 설정이 기본값으로 되어 있다.

- `minimumReleaseAge`: 배포된 지 일정 시간이 지나지 않은 버전은 설치하지 않는다. 기본값이 v10에서는 0(꺼짐)이었고 v11부터 1,440분(하루)이다. 악성 버전이 올라오자마자 자동화된 파이프라인이 그대로 설치해 버리는 일을 줄이려는 설정이다. 급히 최신 버전이 필요한 패키지는 `minimumReleaseAgeExclude`로 예외를 둘 수 있다.
- `blockExoticSubdeps`: 의존성의 의존성(전이 의존성)이 npm 레지스트리가 아니라 git 저장소나 tarball URL에서 코드를 가져오는 것을 막는다. 기본값이 v10에서는 `false`, v11부터 `true`다. (다만, 내가 `package.json`에 직접 적은 의존성은 제한 대상이 아니다.)

정리하면 v10은 **무엇을 실행하는지**를 막았고, v11은 거기에 **언제 나온 버전인지**, **어디서 온 코드인지**를 더했다. 스크립트 하나를 막던 것에서 이제는 설치되는 코드의 시점과 출처까지 따지는 쪽으로 범위가 넓어졌다.

## v12는?

v12는 pnpm을 Rust로 다시 작성한 버전이다. 공식 릴리스 노트는 업그레이드가 마이그레이션처럼 느껴지지 않아야 한다고 소개한다. 12.0의 breaking changes 목록에도 빌드 스크립트 정책에 대한 변경은 없어서, v11에서 쓰던 `allowBuilds`와 `strictDepBuilds` 기본값이 그대로 적용된다.

하나 알아둘 점은 v12부터 `pnpm-workspace.yaml`에서 인식하지 못하는 설정 키를 알려 준다는 것이다. 예전에는 `minimumReleaseAge`를 잘못 써도 조용히 무시됐는데, v12는 오타를 짚어 준다.

> pnpm은 이전에는 인식하지 못하는 설정을 무시했습니다. 예를 들어 `minimumReleaseAge`의 철자를 잘못 입력해도 해당 정책이 조용히 적용되지 않은 채 넘어갔습니다.  
> pnpm 12부터는 인식할 수 없는 키가 있으면 오류 메시지를 표시하며, 해당 키가 오타로 보이는 경우 가장 유사한 실제 설정 이름도 제안합니다.

흐름을 정리하면 이렇다. v10에서 차단이라는 파격적인 방향이 처음 나왔고, v11에서 설정이 `allowBuilds` 하나로 정리되며 기본값이 되었다. v12는 내부를 통째로 바꿨는데도 이 정책을 건드리지 않았다. 구현이 바뀌어도 정책이 유지됐다는 점에서, 이 차단은 일시적인 실험이 아니라 pnpm의 기본 입장이 되었다고 볼 수 있다.

## 마무리

2025년 3월의 글에 “여러 Package manager는 보안 강화를 위해 움직이고 있다.”고 썼다. pnpm은 v10에서 시작한 빌드 스크립트 차단을 v11에서 설정을 정리해 기본 정책으로 만들었고, v12에서도 그대로 유지하고 있다. 앞으로도 당연하게 사용하는 pnpm의 릴리스 노트는 꼼꼼히 확인해야겠다고 반성했다.

- [pnpm Build Settings](https://pnpm.io/settings/build)
- [pnpm 10.0.0 Blocks Lifecycle Scripts by Default (Socket)](https://socket.dev/blog/pnpm-10-0-0-blocks-lifecycle-scripts-by-default)
- [pnpm/pnpm #9042](https://github.com/pnpm/pnpm/issues/9042)
- [Rspack](https://rspack.dev/)
- [pnpm 12.0](https://pnpm.io/blog/releases/12.0#global-commands-refuse-to-run-under-sudo)
