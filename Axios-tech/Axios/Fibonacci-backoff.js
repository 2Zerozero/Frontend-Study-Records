const axios = require('axios');

let attemptCounter = 0; // 시뮬레이션을 위한 현재 시도 추적

/*
 * 주어진 인덱스에 대한 피보나치 수를 계산합니다. 피보나치 수열은 보통 0과 1의 시작으로 각각의 수가 앞의 두 수의 합이 되는 수열입니다.
 *
 * - index: 피보나치수열의 위치
 */
const calculateFibonacciNumber = (index) => {
  if (index <= 1) return index;
  let previous = 0,
    current = 1,
    temp;
  for (let i = 2; i <= index; i++) {
    temp = previous + current;
    previous = current;
    current = temp;
  }
  return current;
};

/*
 * axios를 사용하여 HTTP GET 요청에 대한 피보나치 백오프 전략을 기반한 재시도를 수행합니다.
 * 처음 몇 번의 시도에서 네트워크 실패를 시뮬레이션하여, 피보나치수열을 기반한 지연 시간이 증가하는 재시도 전략을 사용함으로써 애플리케이션이 어떻게 다시 정상 작동하게 되는지 보여줍니다.
 * - url: 요청 보낼 URL
 * - retries: 실패 전 허용된 재시도 횟수
 * - baseDelay: 피보나치 백오프 계산을 위한 기본 지연 시간(밀리초)
 */
const fetchData = async (url, retries, baseDelay) => {
  try {
    attemptCounter++;

    if (attemptCounter <= 2) {
      throw new Error('Simulated network failure');
    }

    const response = await axios.get(url);
    console.log(`Success: ${response.status}`);

    return response.data;
  } catch (error) {
    console.log(`Attempt ${attemptCounter} failed with error: ${error.message}. Waiting for the next attempt.`);
    if (retries > 0) {
      const delay = calculateFibonacciNumber(5 - retries + 1) * baseDelay;
      console.log(`Waiting ${delay} ms before retrying.`);
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchData(url, retries - 1, baseDelay);
    } else {
      throw new Error('All retries failed after ' + attemptCounter + ' attempts');
    }
  }
};

const url = 'https://jsonplaceholder.typicode.com/posts/1';
fetchData(url, 5, 100).catch(console.error);

/*
 * 결과물:
 * 시도 1 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 100 밀리초를 기다립니다.
 * 시도 2 실패 오류: 시뮬레이션한 네트워크 실패. 재시도 전 100 밀리초를 기다립니다.
 * 성공: 200
 */
