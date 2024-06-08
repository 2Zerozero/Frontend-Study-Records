const retry = require('retry');
const axios = require('axios'); // axios가 HTTP 요청에 사용된다고 가정해봅시다.

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
      console.log('Data:', response.data);
    } catch (error) {
      console.log(`Attempt ${currentAttempt} failed: ${error.message}`);
      if (operation.retry(error)) {
        console.log(`Retrying...`);
        return;
      }
      console.error('Request failed after retries:', error.message);
    }
  });
}

fetchData('https://jsonplaceholder.typicode.com/posts/1');
