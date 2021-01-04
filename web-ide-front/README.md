# web_ide-IDE-Front


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
    npm install -g serve # serve 패키지가 글로벌로 설치되었을시 무시
    serve .


## 주요패키지

    React
    React-Redux
    React-Router-Dom
    Axios
    Socket.io-client

 - React Application개발을 위한 React 패키지
 - API-Server와 연동을 위한 Axios 패키지
 - IDE-Server의 실시간 통신을 위한 Socket.io


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


## 주요기능

 - 프로젝트 리스트 확인
 - 소스코드 편집을 위한 Editor
 - 소스코드 파일 리스트 확인
 - 서버 측에서 받은 Response를 보여줄 수 있는 Console