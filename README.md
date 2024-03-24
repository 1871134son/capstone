# capstone 







파일 설명 

functions/index.js 파일

--> firebase cloud functions 에서 사용하는 함수들을 작성하는 공간입니다. 

```react
export.functionName = onRequest((req,res)=>{
//함수 작성 
});

//전부 다 작성 하시고, 터미널에 입력하시면 cloud functions에 함수 등록됩니다.
firebase deploy --only functions 
```







# ***사용한 라이브러리 목록*** 

사용법들은 엥간하면 구글 검색하면 나오는데, 잘 설명되어있는 문서 있으면 링크 달아놓을게요 

### 리엑트 부트스트랩(컴포넌트 라이브러리)

```
npm install react-bootstrap bootstrap
```

https://react-bootstrap.netlify.app/  << 들어가서 getStarted 하고 원하는 form들 컴포넌트들 검색해서 복붙 하시면 이쁘게 사용 됩니다. 



### **리엑트 라우터(페이지 전환)**

```
npm install react-router-dom@6 
```



### 아이콘 라이브러리 (로그인 버튼아래, 페이스북, 구글 로고 아이콘)

```
npm install react-icons
```



### Redux toolkit외부 라이브러리.(props 대신 사용가능)

```
npm install @reduxjs/toolkit@1.8.1 react-redux
```



### firebase (firestore db, authentication)

```
npm install firebase
```



### firebase cloud functions(CLI설치)

```
npm install -g firebase-tools
```



### Axios(Cloud fuctions 사용)

```
npm install axios
```



### Cors(통신 권한 허용)

```
npm install cors
```



