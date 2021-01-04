# web_ide_Community-Front

## 환경설정

    REACT_APP_API_SERVER=http://localhost:8080/
    REACT_APP_IDE_ADDR=http://localhost:3050/
 
 - 참고 영상: https://www.youtube.com/watch?v=CnjuYCq2kho&t=1294s


## 설치 및 실행 방법
 
    git clone https://github.com/donghyo8/web_ide_2020
    cd web-ide-front
    npm install
    npm start


## 빌드 방법

    npm run build
    cd ./build
    npm install -g serve # serve 패키지가 글로벌로 설치되었을 시에 무시
    serve .


## 주요패키지

    React
    React-Redux
    React-Router-Dom
    Axios
    Socket.io-client

 - React Application개발을 위한 React 패키지
 - API-Server와 연동을 위한 Axios 패키지


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

 - 수강 신청
 - 프로젝트 관리
 - 문제 리스트
