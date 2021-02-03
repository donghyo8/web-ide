# web-ide API-server

## 환경설정

    MYSQL_HOST=					# DB 주소 설정 필요
	MYSQL_PORT=3306
	MYSQL_ID=					# 설정 필요
	MYSQL_PASS=					# 설정 필요
	PORT=3003
	ROOT_PATH=DEBUG_FILES
	TRASH_PATH=TRASH_FILESsp
	TOKEN_SECRET=					# 설정 필요
 
 - 참고 영상: https://www.youtube.com/watch?v=CnjuYCq2kho&t=1294s

## 설치 및 실행 방법
 
    git clone https://github.com/donghyo8/web_ide_2020
    cd web-ide-server
    npm install
	npm start
  
  
## 빌드 방법

    npm run build
    cd ./build
    npm install -g serve 	# serve 패키지가 글로벌로 설치되었을 시에 무시
    serve .


## 주요패키지

    React
    React-Router-Dom
    Jsonwebtoken
    Express-jwt
	Express-session
	Mysql2

 - React Application개발을 위한 React 패키지
 - 웹 토큰 생성과 관리를 위한 Express-jwt, Jsonwebtoken 패키지
 - 웹 세션 유지를 위한 Express-session 패키지


## web-ide-server 디렉토리 구조
    .
    ├── node_modules
    ├── bin
    ├── modules			# 기능별 모듈
    ├── routes			# 라우팅 하기 위한 API
    ├── sql				# DB 데이터를 불러오기 위한 sql문
    ├── upload
    ├── app.js
    ├── package.json

## 주요기능

 - API 목록
