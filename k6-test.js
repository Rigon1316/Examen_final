import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '10s', target: 10 }, // Ramp-up to 10 users
    { duration: '20s', target: 10 }, // Stay at 10 users
    { duration: '10s', target: 0 },  // Ramp-down
  ],
};

const BASE_URL = 'http://localhost:8080/api/docentes';
const AUTH_HEADER = {
    headers: { 'Authorization': 'Basic ' + String.bytes('admin:admin').toString('base64') } // Verify if K6 supports this encoding, usually easier to hardcode base64 for 'admin:admin' -> 'YWRtaW46YWRtaW4='
};
// Correct header with hardcoded base64 for admin:admin
const PARAMS = {
    headers: {
        'Authorization': 'Basic YWRtaW46YWRtaW4=',
        'Content-Type': 'application/json',
    },
};

export default function () {
  let res = http.get(BASE_URL, PARAMS);
  
  check(res, {
    'status is 200': (r) => r.status === 200,
    'interaction time < 200ms': (r) => r.timings.duration < 200,
  });

  sleep(1);
}
