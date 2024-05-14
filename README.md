# 자바스크립트를 이용한 재시도 로직 구현 방법

프론트엔드 개발자로서 애플리케이션을 위한 데이터 패칭을 하거나 정보를 수정하기 위해 REST API와 마이크로 서비스에 의존합니다.
가끔 일시적인 오류와 불안정한 연결 또는 서비스 중단 시간과 같은 문제에 직면하게 되는데, 이러한 상황에 대한 해결 방안을 갖추고 있지 않는다면 실망스러운 사용자 경험을 제공하게 됩니다.

이를 개선하고 애플리케이션을 원할하게 실행되게 하려면 재시도 전략을 구현해야 합니다.

> 구현함으로서 얻는 이점
1. 애플리케이션 중단 현상을 우아하게 처리하여 안정성과 사용자 경험을 유지할 수 있습니다.
2. 실패한 작업을 현명하게 재시도할 수 있도록 준비하여 일반적인 네트워크 문제에 대한 복원력이 향상됩니다.

## 다양한 재시도 전략

1. 지수 백오프 - 시스템 로드와 실패 가능성을 줄이기 위해 각 재시도 후 대기 시간을 두 배로 늘립니다.
2. 선형 백오프 - 예측할 수 있는 지연 시간에 대해 매번 재시도 후 일정한 양만큼 대기 시간을 늘립니다.
3. 고정 지연 - 시도 횟수와 상관없이 재시도 간 대기 시간을 일정하게 유지합니다.
4. 피보나치 백오프 - 피보나치 수열을 사용하여 급격하거나 완화된 지연 사이의 균형을 유지하며 대기 시간을 결정합니다.
5. 무작위 재시도 - 시도를 분산하고 시스템 부하를 줄이기 위해 재시도 전임의 대기 시간을 선택합니다.
6. 즉시 재시도 - 지체 없이 즉시 재시도하므로, 신속하게 해결할 수 있는 문제에 이상적입니다.

## 재시도 로직을 위한 NPM 패키지

### axios-retry

axios 요청에 재시도 기능을 추가하는 간단한 방법을 제공합니다.
이 라이브러리는 네트워크 오류 또는 특정 HTTP 응답 코드와 같은 특정 조건에서 실패한 요청을 자동으로 재시도할 수 있고, 지수 백오프를 포함한 구성 가능한 재시도 전략을 지원합니다.

```javascript
npm install axios axios-retry
```

```javascript
import axios from "axios";
import axiosRetry from "axios-retry";

// 자동 재시도 요청을 위한 axios-retry 구성
axiosRetry(axios, {
  retries: 3, // 재시도 횟수
  retryDelay: axiosRetry.exponentialDelay, // 재시도 사이에 지수 백오프 지연 사용
});

// 실패 시 재시도되는 axios 요청
axios
  .get("https://jsonplaceholder.typicode.com/posts/1")
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
```
### retry

패키지는 코드에 재시도 기능을 추가한 유연한 방법을 제공하고, 실패 시 여러 번 시도하려는 비동기 연산이나 로직 처리에 적합합니다. <br>

```javascript
npm install retry
```

```javascript
const retry = require("retry");
const axios = require("axios"); // axios가 HTTP 요청에 사용된다고 가정해봅시다.

async function fetchData(url) {
  const operation = retry.operation({
    retries: 3, // 최대 재시도 횟수
    factor: 2, // 지연에 대한 지수 계수
    minTimeout: 1000, // 첫 번째 재시도를 시작하기 전의 시간(밀리초)
    maxTimeout: 2000, // 두 번째 재시도 사이의 최대 시간(밀리초)
  });

  operation.attempt(async (currentAttempt) => {
    try {
      const response = await axios.get(url);
      console.log("Data:", response.data);
    } catch (error) {
      console.log(`Attempt ${currentAttempt} failed: ${error.message}`);
      if (operation.retry(error)) {
        console.log(`Retrying...`);
        return;
      }
      console.error("Request failed after retries:", error.message);
    }
  });
}

fetchData("https://jsonplaceholder.typicode.com/posts/1");
```

> [원문](https://anu95.medium.com/implement-retry-logic-using-javascript-e502693e0b5c)

