import axios from 'axios';
import axiosRetry from 'axios-retry';

// 자동 재시도 요청을 위한 axios-retry 구성
axiosRetry(axios, {
  retries: 3, // 재시도 횟수
  retryDelay: axiosRetry.exponentialDelay, // 재시도 사이에 지수 백오프 지연 사용
});

// 실패 시 재시도되는 axios 요청
axios
  .get('https://jsonplaceholder.typicode.com/posts/1')
  .then((response) => console.log(response.data))
  .catch((error) => console.error(error));
