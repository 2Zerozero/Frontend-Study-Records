const axios = require('axios');

let attemptCounter = 0; // 실패 시뮬레이션 시도 횟수

/*
 * 이 함수는 HTTP 요청에 대해 axios를 사용하는 선형 백오프 전략을 보여줍니다.
 * 초기 시도에서 네트워크 실패를 시뮬레이션한 다음 성공하여, 애플리케이션이 적절한 재시도 로직을 기반으로 일시적인 문제로부터 어떻게 회복할 수 있는지 보여줍니다.
 *
 * 선형 백오프 전략은 재시도 간의 지연 시간을 고정적으로 증가시켜 재시도 간격을 관리하는 균형 잡힌 접근 방식을 제공하며, 다음 시도 전에 시스템이 복구할 수 있는 시간을 제공합니다.
 *
 * 매개변수:
 * - url: 데이터를 가져올 URL
 * - retries: 재시도 허용 횟수
 * - delay: 첫 번째 재시도 전 초기 지연 시간
 * - increment: 재시도 후 지연 시간 증가량
 *
 * 실패 시, 이 함수는 지정된 지연 시간을 기다린 후 선형 백오프 계산을 기반으로 증가한 지연 시간으로 요청을 재시도 합니다.
 */
const fetchDataWithLinearBackoff = async (url, retries, delay, increment) => {
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
      return fetchDataWithLinearBackoff(url, retries - 1, delay + increment, increment);
    } else {
      throw new Error('All retries failed');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchDataWithLinearBackoff(url, 5, 1000, 2000).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 1000 밀리초를 기다립니다.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 3000 밀리초를 기다립니다.
 * 시도 3 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 5000 밀리초를 기다립니다.
 * 성공: 200
 */
