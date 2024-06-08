const axios = require('axios');

let attemptCounter = 0; // 네트워크 실패를 시뮬레이션하기 위해 현재 시도 횟수 추적.

/*
 * 실패 시 즉각적인 재시도 전략을 사용하여 axios를 사용한 HTTP GET 요청을 실행합니다.
 * 이 접근법은 초반에 몇 번의 시도를 통해 네트워크 실패를 시뮬레이션하여, 빠르게 해결할 수 있는 일시적인 문제를 어떻게 애플리케이션이 지연 없이 즉시 재시도하여 적용되는지 설명합니다.
 *
 * 즉각적인 재시도는 오류가 일시적일 가능성이 높고 지연을 적용하지 않고 해결될 수 있는 상황에서 사용됩니다. 이는 네트워크 안정성이 변동하는 환경에서 성공적인 요청 가능성에서 효과적입니다.
 *
 * - url: HTTP GET 요청을 위한 엔드포인트 URL
 * - retries: 종료 전 재시도 횟수
 */
const fetchData = async (url, retries) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);

    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}.`);
    if (retries > 0) {
      console.log('Retrying immediately.');
      return fetchData(url, retries - 1);
    } else {
      throw new Error(`All retries failed after ${attemptCounter} attempts`);
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 5).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 즉시 재시도.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 즉시 재시도.
 * 시도 3 실패 오류: 시뮬레이션한 네트워크 실패. 즉시 재시도.
 * 성공: 200
 */
