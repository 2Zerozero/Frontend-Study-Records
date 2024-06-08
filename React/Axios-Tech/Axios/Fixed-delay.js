const axios = require('axios');

let attemptCounter = 0; // 시나리오 시뮬레이션을 위한 시도 횟수

/*
 * axios를 사용하여 HTTP 요청에 대한 고정 지연 재시도 전략을 구현하는 방법을 시도합니다.
 * 초기 시도에 대한 실패를 시뮬레이션하여 고정 지연 재시도가 시도 횟수에 상관없이 재시도 전에 미리 계산된 시간을 대기함으로써 일시적인 오류를 효과적으로 관리할 방법을 설명합니다.
 *
 * 고정 지연 방식은 재시도 간격을 일정하게 유지하여 시스템 복구 및 오류 해결을 다음 시도 전에 가능하게 하는 간단하고 예측 가능한 방법을 제공합니다. 이 전략은 복구 예상 시간이 일정한 상황에서 특히 유용합니다.
 *
 * 매개변수:
 * - url: HTTP GET 요청을 위한 엔드포인트 URL
 * - retries: 종료 전 재시도 횟수
 * - delay: 재시도 전 대기하는 고정 시간(밀리초)
 */
const fetchData = async (url, retries, delay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 3) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);
    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting ${delay} ms before retrying.`);
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, delay);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 4, 1000).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1000 밀리초를 기다립니다.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1000 밀리초를 기다립니다.
 * 시도 3 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1000 밀리초를 기다립니다.
 * 성공: 200
 */
