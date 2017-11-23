# jQuery에 기여하기

1. [참여](#getting-involved)
2. [질문 및 토론](#questions-and-discussion)
3. [버그를 보고하는 방법](#how-to-report-bugs)
4. [버그 패치를 위한 팁](#tips-for-bug-patching)


이 프로젝트 및 기타 jQuery 조직 프로젝트에 기여하는 방법에 대한 자세한 내용은 contrib.jquery.org (https://contribute.jquery.org)를 참조하십시오. 오픈 소스 (https://contribute.jquery.org/open-source/)에서 확정 & 풀 요청 가이드 (https://contribute.jquery.org/commits-and-pull-requests/) 및 스타일 가이드 (https://contribute.jquery.org/style-guide/)를 참조하십시오. 포크를 유지하고 패치를 제출하는 방법은 여기를 참조하십시오. 풀 요청을 병합하기 전에 [기여자 라이센스 계약 (https://contribute.jquery.org/cla/)에 서명해야합니다.


참고: *jQuery Core* 코드 개발 저장소 입니다. issue를 제기하거나 pull request를 하기 전에 올바른 위치에 있는지 확인하십시오.
* jQuery 플러그인 문제는 플러그인 작성자에게 보고해야합니다.
* jQuery Core API 문서의 문제는 [API repo](https://github.com/jquery/api.jquery.com/issues)로 제출할 수 있습니다.
* 기타 jQuery 조직 프로젝트의 버그 또는 제안은, 각각의 저장소 [their respective repos](https://github.com/jquery/)에 제출해야 합니다.

## 참여

[API 설계 원칙](https://github.com/jquery/jquery/wiki/API-design-guidelines)

우리는 항상 버그를 식별하는 방법[identifying bugs](#how-to-report-bugs)에 대한 도움을 찾고 있고, 테스트 케이스를 작성하여 줄이거 나 문서를 개선하고 있습니다. 새로운 기능은 드물지만, 우리들의 가이드라인 [guidelines](https://github.com/jquery/jquery/wiki/Adding-new-features) 을 통과해야만 합니다.

이 프로젝트 및 기타 jQuery 조직 프로젝트에 기여하는 방법에 대한 자세한 내용은 [contribute.jquery.org](https://contribute.jquery.org)를 참조하고, [getting started with open source](https://contribute.jquery.org/open-source/) 여기에는 오픈 소스 시작하기에 대한 팁, 트릭 및 아이디어가 담긴 간단한 안내서가 포함되어 있습니다. fork를 유지하고 패치를 제출하는 방법에 대한 지침은 우리의 commit 및 pull request 가이드 [commit & pull request guide](https://contribute.jquery.org/commits-and-pull-requests/)와 스타일 가이드 [style guides](https://contribute.jquery.org/style-guide/)를 참조하십시오. pull request를 병합하기 전에, 기여자 라이센스 계약 [contributor license agreement](https://contribute.jquery.org/cla/)에 서명을 해야합니다.


## 질문 및 토록

### 포럼과 IRC

jQuery는 많은 개발자들이 기능과 한계에 대한 지식을 갖고 있는 만큼 대중적입니다. jQuery 사용에 관한 대부분의 질문은 [Stack Overflow](https://stackoverflow.com)와 같은 인기있는 포럼에서 답변을 얻을 수 있습니다. 당신이 버그를 발견했더라도 거기에 질문을 하십시오. jQuery Core 팀은 [jQuery Development Forum](https://forum.jquery.com/developing-jquery-core)을 보고 있습니다. Stack Overflow와 같은 장소에서 답을 얻을 수 없는 긴 게시물이나 질문이 있으면 언제든지 질문하십시오. 버그를 발견했다고 생각되면 bug tracker[file it in the bug tracker](#how-to-report-bugs)에 올려주십시오. jQuery Core 팀은 [#jquery-dev](https://webchat.freenode.net/?channels=jquery-dev) irc.freenode.net의  IRC 채널에서 찾을 수 있습니다.


### 주간 상황 회의

jQuery Core 팀은 현재 작업의 진행 상황을 논의하기 위해 주 1 회 회의가 있습니다. 이 회의는 월요일 [#jquery-meeting](https://webchat.freenode.net/?channels=jquery-meeting) irc.freenode.net의 IRC 채널의 Noon EST[Noon EST](https://www.timeanddate.com/worldclock/fixedtime.html?month=1&day=17&year=2011&hour=12&min=0&sec=0&p1=43)에서 열립니다.

[jQuery Core Meeting Notes](https://meetings.jquery.org/category/core/)


## 버그를 보고하는 방법

### jQuery 버그인지 확인하십시오.

bug tracker에 보고 된 대부분의 버그는 실제로 jQuery 코드가 아닌 사용자 코드의 버그입니다. 당신의 코드로 인해 jQuery 내부에서 오류가 발생했다고 해도 jQuery 버그가 아님을 염두하십시오.

jQuery 포럼 [Using jQuery Forum](https://forum.jquery.com/using-jquery) 또는 Stack Overflow [Stack Overflow](https://stackoverflow.com/)와 같은 토론 포럼에서 먼저 도움을 요청하십시오. 훨씬 더 빨리 지원을 받을 수 있을 것이고, 당신의 잘못된 버그 보고로 jQuery 팀을 묶어두는 것을 피할 수 있습니다.


### 브라우저 확장 기능을 비활성화 했는지 확인하십시오.

모든 브라우저 확장 기능 및 추가 기능을 비활성화하여 버그를 재현했는지 확인하십시오. 때로는 재미 있고 예측할 수없는 방법으로 버그가 발생할 수 있습니다. 시크릿 모드 스텔스 모드 또는 익명 브라우징 모드를 사용해보십시오.

### jQuery의 최신 버전을 사용해보십시오.

이전 버전의 jQuery에서 버그가 이미 수정되었을 수 있습니다. 알려진 문제를 보고하지 않으려면 항상 최신 빌드 [latest build](https://code.jquery.com/jquery.js)를 테스트해야 합니다. jQuery의 새로운 버전에서 버그가 수정 된 경우 이전 버전 파일의 버그를 수정 할 수 없습니다.

### 테스트 케이스를 단순화 하십시오.

문제가 발생한 경우, 문제를 재현하는 데 필요한 최소한으로 코드를 축소[reduce your code](https://webkit.org/quality/reduction.html) 하십시오. 이렇게 하면, 문제가 되는 코ㅡ를 쉽게 분리하고 수정할 수 있습니다. 테스트 케이스를 줄이지 않고 보고가 수정 될 때까지 평균 9001%의 시간이 소요되므로 가능한 한 이를 수행하십시오.

### 관련 문제 또는 중복 문제를 검색하십시오.

[jQuery Core issue tracker](https://github.com/jquery/jquery/issues)로 이동하여 문제가 아직 보고되지 않았는지 확인하십시오. 그렇지 않은 경우 여기에 새로운 문제를 작성하고 테스트 케이스를 포함하십시오.

## 버그 패치를 위한 팁

사람들이 발견 한 버그를 패치하여 프로젝트에 기여했을 때 우리는 좋아합니다. 많은 사람들이 jQuery를 사용하기 때문에, 우리는 수락하는 패치에 대해 신중하고 매일 jQuery를 사용하는 수백만 명의 사람들에게 부정적인 영향을 미치지 않도록하고 싶습니다. 따라서 제안 된 패치가 review 및 release를 진행하는 데 어느 정도 시간이 걸릴 수 있습니다. 당신이 해결한 문제가 수백만의 사이트 및 수십 억회의 방문을 위해 개선될 것이라는 점을 알게됩니다.

### jQuery의 로컬 복사본 만들기

https://github.com/jquery/jquery에서 github의 jQuery 저장소를 fork합니다.

다음과 같이, 디렉토리를 web root directory로 변경합니다 :

```bash
$ cd /path/to/your/www/root/
```
로컬로 작업하기 위해 jQuery 포크를 복사합니다.

```bash
$ git clone git@github.com:username/jquery.git
```

새로 만든 jquery/ 디렉토리로 변경합니다.

```bash
$ cd jquery
```

jQuery master를 remote로 추가한다. 여기서는 label을 "upstream"로 정했다.

```bash
$ git remote add upstream git://github.com/jquery/jquery.git
```

jQuery가 새로운 commit을 받으면 최신 상태를 유지하기 위해 "upstream" master를 사용하는 습관을 가지십시오.

```bash
$ git pull upstream master
```
빌드 스크립트 실행

```bash
$ npm run build
```

이제 브라우저에서 http://localhost/test로 jQuery 테스트를 엽니다. port가 있는 경우 port를 포함해야 합니다.

성공! jQuery를 빌드하여 테스트했습니다!


### 테스트를 위한 팁...

패치를 쓰는 과정에서 테스트를 여러 번 실행합니다. 테스트의 제목을 더블 클릭하거나 URL에 추가하여 실행중인 테스트를 테스트하는 모듈을 수정하면 프로세스 속도를 높일 수 있습니다 .다음 예제에서는 로컬 호스트 서버에서 호스트되는 로컬 저장소에서 작업하고 있다고 가정합니다.

Example:

http://localhost/test/?module=css

이렇게하면 "css"모듈 테스트 만 실행됩니다. 이것은 개발 및 디버깅 속도를 크게 향상시킵니다.

**COMMITE과 PATCH를 하기 전에 항상 전체 패키지를 실행하십시오!**


#### 테스트 페이지의 변경 사항 로드하기

변경을 할 때마다 jQuery를 `grunt` 에서 재구성하는 것이 아니라, `grunt watch` 작업을 사용하여 파일이 저장 될 때마다 배포 파일을 다시 빌드할 수 있습니다.

```bash
$ grunt watch
```

또는 다시 빌드 할 필요가 없도록, **AMD에서 테스트를 로드** 할 수 있습니다.

테스트 페이지를 로드 한 후 "Load with AMD"를 클릭하십시오.


### Repo 조직

jQuery 소스는 AMD 모듈로 구성되어 빌드시에 연결되고 컴파일됩니다.

또한, jQuery에는 "var 모듈"이라고하는 특수 모듈이 들어 있으며 "var"라는 폴더에 저장됩니다. 빌드시 이 작은 모듈은 간단한 var 문으로 컴파일됩니다. 이렇게하면 모듈간에 변수를 쉽게 공유 할 수 있습니다. 예제를 보려면 "src"폴더를 찾으십시오.

### 브라우저 지원

jQuery는 여러 브라우저 및 버전을 지원하고 있습니다. 기여한 코드는 모든 코드에서 작동해야합니다. 현재 지원되는 브라우저 목록은 [browser support page](https://jquery.com/browser-support/)를 참조하십시오.
