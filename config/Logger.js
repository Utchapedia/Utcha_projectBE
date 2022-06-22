const winston = require("winston");
const winstonDaily = require('winston-daily-rotate-file');

// Define your severity levels, 각 수준은 심각도를 나타낸다.
// With them, 로그 파일을 만들 수 있다.
// 실행준인 env를 기준으로 수준을 보거나 숨길 수 있다.
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 이 메서드는 다음을 기준으로 심각도 수준을 정의한다.
// the current NODE_ENV: 모든로그 수준 표시
// 서버가 개발모드에서 실행된 경우와 그렇지 않은 경우
// 운영환경에서 실행된 경우 warn(경고)와 debug(오류)메세지를 표시한다.
const level = () => {
  const env = process.env.NODE_ENV || 'development'
  const isDevelopment = env === 'development'
  return isDevelopment ? 'debug' : 'warn'
}

// 각 수준에 대해서 다른 색상으로 정의한다.
// 로그 메세지를 더 잘보이고 구분되게 표시하게된다.
// 메시지에 초점을 맞추거나, 메세지를 무시하는 기능을 추가할 수 있다.
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
}

// winston에게 위에서 정의한 colors를 연결하고 싶다고 정의한다.
winston.addColors(colors)

function myTime() {
  return new Date().toString();
}

// 로그 형식을 사용자 정의에 따라 어떻게 보여줄지 선택한다.
const format = winston.format.combine(
  // 기본 형식을 사용하여 메세지에 타임스탬프 추가,
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  // winston에게 색을 입혀야 한다고 지정
  winston.format.colorize({ all: true }),
  // 타임스탬프, 그리고 심각도 수준, 메세지를 어떻게 표시할 것인지 Define
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
)

// logger가 메세지를 출력하는데 사용해야하는 전송양식을 Define
// 다음의 example에선 3가지 양식을 Define 한다.
const transports = [
  // 메세지를 출력하기 위해 console을 사용하는 것을 허락한다.
  new winston.transports.Console(),
  // error.log파일에 모든 수준의 메시지를 출력할 수 있게 한다.
  new winstonDaily({ // winston.trasports.winstonDaily가 아님
    level: 'info',
    filename: 'logs/info.log',
    datePattern: 'YYYY-MM-DD',
    maxFiles: '7',
    zippedArchive: true
  }),
  new winstonDaily({ //error 레벨 로그 
    level: 'error',
    maxFiles: '7', // 7일치 로그 저장
    filename: `logs/error.log`, //  %DATE% = 위에서 설정한 datePattern YYYY-MM-DD HH:mm:ss:ms
    zippedArchive: true
  }),
  new winstonDaily({
    level: 'debug',
    filename: 'logs/debug.log',
    maxFiles: '7',
  }),
  // all.log파일에 모든 오류 메세지를 출력할 수 있게 한다.
  // 또한 error.log(오류로그) 내부에도 인쇄된다.
  new winstonDaily({
    filename: 'logs/all.log',
    level: levels,
    maxFiles: '7'
  }),
]

// exports할 Logger 인스턴스를 생성한다.
// 메세지를 기록하는데 사용된다.
const Logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
})

//   export default Logger, ts파일에서 사용할 버전
module.exports = Logger // js에서는 이렇게 해야하는 것 같다.

