const axios = require('axios');

let attemptCounter = 0; // 시도 횟수

/*
 * 시물레이션된 실패와 axios를 사용하여 주어진 URL로부터 데이터를 가져오기 위해 시도합니다.
 * 이 함수는 오류를 던져 처음 두 번의 시도에 대한 네트워크 실패를 시뮬레이션하여 재시도 메커니즘이 어떻게 일시적인 오류를 처리하는지 보여줍니다.
 * 매개변수:
 * - url: 데이터를 가져올 URL
 * - retries: 재시도 허용 횟수
 * - delay: 재시도 전 초기 지연 시간, 재시도 시 두 배
 *
 * 이 함수는 재시도 사이에서 발생한 지연을 위해 지수 백오프를 사용하고, 복구 시간을 제공하여 일시적인 네트워크 문제를 효과적으로 처리합니다.
 */
const fetchData = async (url, retries, delay) => {
  try {
    attemptCounter++;
    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting ${delay} ms before retrying.`);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, delay * 2);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 3, 1000).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1000 밀리초를 기다립니다.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 2000 밀리초를 기다립니다.
 * 성공: 200
 */
