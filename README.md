# web_ide_2020

## 환경설정

[web_ide-Server]

    MYSQL_HOST=					# DB 주소 설정 필요
	MYSQL_PORT=3306
	MYSQL_ID=					# 설정 필요
	MYSQL_PASS=					# 설정 필요
	PORT=3003
	ROOT_PATH=DEBUG_FILES
	TRASH_PATH=TRASH_FILESsp
	TOKEN_SECRET=					# 설정 필요

[web_ide-front, Community-front-end, admin-front,end]
	
    REACT_APP_API_SERVER=http://localhost:8080/
    REACT_APP_IDE_ADDR=http://localhost:3050/
 
 - 참고 영상: https://www.youtube.com/watch?v=CnjuYCq2kho&t=1294s

## 설치 및 실행 방법
 
    git clone https://github.com/donghyo8/web_ide_2020
    cd web-ide-server, web-ide-front, community-front-end, admin-front-end, backend
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
	React-Redux
	Axios
	Socket.io-client
    Jsonwebtoken
    Express-jwt
	Express-session
	Mysql2
	
 - React Application개발을 위한 React 패키지
 - 웹 토큰 생성과 관리를 위한 Express-jwt, Jsonwebtoken 패키지
 - 웹 세션 유지를 위한 Express-session 패키지
 - API-Server와 연동을 위한 Axios 패키지
 - IDE-Server의 실시간 통신을 위한 Socket.io


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
	

## web-ide-front 디렉토리 구조
    .
    ├── public
    ├── src
        ├── actions      # redux action 모음
        ├── containers   # HOC의 View Components
        ├── modules      # 편리성을 위한 util Components 
        ├── reducers     # Store 생성을 위한 Components
        ├── routers      # HOC의 기능 Components
        ├── app.js
        ├── index.js
    ├── package.json
	

## community-front-end 디렉토리 구조
    .
    ├── node_modules
    ├── public
    ├── src
        ├── _actions     # redux action 모음
        ├── _utils       # axios setting 모음
        ├── _reducers    # redux reducers 모음
        ├── components   # HOC의 View Components
        ├── layout       # HOC의 View Components  
        ├── pages        # HOC의 View Components
        ├── resources    # CSS 모음
        ├── routers
        ├── app.js
        ├── index.js
    ├── package.json

## 주요기능

 - API 목록
 - 프로젝트 리스트 확인
 - 소스코드 편집을 위한 Editor
 - 소스코드 파일 리스트 확인
 - 서버 측에서 받은 Response를 보여줄 수 있는 Console
 - 수강 신청
 - 프로젝트 관리
 - 문제 은행 제공 및 채점