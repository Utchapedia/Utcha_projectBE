const morgan = require("morgan");
const Logger = require("../config/Logger"); // ./와 ../의 차이가 뭘까?
// Logger 모듈을 불러온다.

// 다음 명령을 통해 stream 메서드를 재정의 한다.
// Morgan이 console.log를 대신해 사용자 지정 로거를 사용하게 된다.
const stream = {
  // 원글에선 const stream: StreamOptions = { } 이런식인데
  // StreamOptions는 ts에서만 사용가능하다.
  // Use the http severity
  write: (message) => Logger.http(message),
};

// 모든 Morgan http log를 건너 뛴다.
// 응용 프로그램이 개발모드에서 실행되고 있지 않다.
// This method는 여기서 진짜로 필요한 것은 아니다.
// 우리는 이미 logger에게 출력해야 한다고 했기 때문이다.
// 경고 및 에러메세지만 production에서 볼 수 있다.
const skip = () => {
  const env = process.env.NODE_ENV || "development";
  return env !== "development";
};

// status 컬러 색깔 조정
morgan.token("status", (req, res) => {
  let color; // 재할당 해야해서 const는 안됨,
  if (res.statusCode < 300) {
    color = "\x1B[32m"; //green
  } else if (res.statusCode < 400) {
    color = "\x1B[36m"; //cyan 옥색
  } else if (res.statusCode < 500) {
    color = "\x1B[33m"; //yellow
  } else if (res.statusCode < 600) {
    color = "\x1B[31m"; //red
  } else {
    color = "\033[0m" /*글자색 초기화*/
  }

  return color + res.statusCode + "\033[35m" /*보라색*/; 
});

//morgan에 로깅하는데 post의 body도 나오게,
morgan.token("request", (req, res) => {
    return "Request_" + JSON.stringify(req.body); //JavaScript 값이나 객체를 JSON 문자열로 변환
});
// 아직 body값이 없어서 undefined


// 모건 미들웨어 구축
const morganMiddleware = morgan(
  // 메세지 형식 문자열을 Define한다(기본 문자열로),
  // 메세지 형식은 토큰으로 만들어지며,
  // 각 토큰은 모건 라이브러리 내에 Define되있다.
  // 이것을 사용하는 당신은 사용자 지정 토큰을 만들어 요청에서 원하는 내용을 표시할 수 있다.
  ":method :url :request :status :res[content-length] - :response-time ms",
  // Options: 이 케이스의 경우, Stream과 skip logic을 덮어썼다.
  // 위의 방법을 참조하면,
  { stream, skip }
);

//   export default morganMiddleware;
module.exports = morganMiddleware;


//https://chan180.tistory.com/164 morgan.token의 포맷에 관한글