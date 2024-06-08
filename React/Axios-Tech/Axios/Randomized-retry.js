const axios = require('axios');

let attemptCounter = 0; // 시도 횟수 추적 및 네트워크 오류 시뮬레이션.

/*
 * 무작위 지연을 포함한 재시도와 함께 axios를 사용하여 HTTP GET 요청을 수행합니다.
 * 네트워크 오류 시뮬레이션 전략은 특정 최소 범위와 최대 범위 사이의 임의 지연을 재시도하여 복구할 방법을 설명합니다.
 * 재시도 간격의 랜덤화는 부하 분산과 시스템 피크 압력 감소에 도움이 됩니다.
 *
 * - url: HTTP GET 요청을 위한 엔드포인트 URL
 * - retries: 종료 전 재시도 횟수
 * - minDelay: 재시도 전 최소 지연 시간(밀리초)
 * - maxDelay: 재시도 전 최대 지연 시간(밀리초)
 */
const fetchData = async (url, retries, minDelay, maxDelay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);

    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}.`); // 시도 횟수 출력
    if (retries > 0) {
      const randomDelay = Math.random() * (maxDelay - minDelay) + minDelay; // 임의 지연 시간 계산
      console.log(`Waiting ${Math.round(randomDelay)} ms before retrying.`);
      await new Promise((resolve) => setTimeout(resolve, Math.round(randomDelay)));
      return fetchData(url, retries - 1, minDelay, maxDelay);
    } else {
      throw new Error(`All retries failed after ${attemptCounter} attempts`);
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 3, 500, 1500).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1487 밀리초를 기다립니다.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 777 밀리초를 기다립니다.
 * 성공: 200
 */
