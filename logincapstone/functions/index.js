// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
// const fetch =require("node-fetch");
// The Firebase Admin SDK to access Firestore.
const axios = require("axios");
const cors = require("cors");
const corsHandler = cors({origin: true});
const {initializeApp} = require("firebase-admin/app");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const {getFirestore} = require("firebase-admin/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { event } = require("firebase-functions/v1/analytics");

initializeApp();

// Firestore 데이터베이스 인스턴스를 가져옵니다.
const db = getFirestore();
const auth = getAuth();

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest((req, res) => {
  corsHandler(req, res, async () =>{
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await getFirestore()
        .collection("messages")
        .add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${writeResult.id} added.`});
  });
});

/**사용자에게 시험일정에 대해 알람을 보내는 함수. 하루에 한번 호출되며, 날짜 비교 후, 당일, 3일전에 사용자에게 알람을 보냄. */
exports.sendSceduleNotification = onSchedule("every day 00:00", async (event)=>{
  //오늘 날짜와 3일 후의 날짜를 계산함. 
  const today = new Date();
  const threeDaysLater = new Date();
  threeDaysLater.setDate(today.getDate() + 3);

   // Firestore의 'users' 컬렉션에서 모든 사용자 문서를 가져옵니다.
   const usersSnapshot = await db.collection('user').get();
   // Firestore의 배치 작업을 시작합니다.
   const notificationsBatch = db.batch()

  // Firestore의 users 컬렉션에서 모든 사용자 문서 가져옴 
  for (const doc of usersSnapshot.docs){
    const user = doc.data(); // 사용자 데이터 가져오기
    const userId = doc.id(); //사용자 ID를 가져옵니다. 
    const jmcds = user.jmcds; //사용자의 관심 자격증 코드 배열을 가져옵니다. 

    //각 자격증 코드에 대해 공공데이터 API를 호출합니다. 
    for(const jmcd of jmcds){
      if(jmcd=="empty"){//empty는 회원이 관심있는 자격증이 없는 경우므로 함수를 시행하지 않음. 

      }//if 
      else{ // 관심 있는 자격증이 있음. 
        
      
      }//else 

    }//for End jmcd


  }//forEnd usersSnapshot


})

// 공공데이터 포탈에서 자격증 종류들을 가져옵니다.
exports.getExamSchedule = onRequest((req, res)=>{
  corsHandler(req, res, async ()=>{
    console.log("Called 자격증시험일정");
    const jmcd = req.body.data.jmcd;
    console.log("jmcd값: ", jmcd);
    const decode ="Pg7aPFuf7Do381nW4BcQYu7RHCbBL9h55UUWHX"+
    "wR7p7KkAMDct7GQMOPhzvqbblI+ITj2xF+en4Q6k6xxIzLOQ==";
    const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList";
    let queryParams = "?" + encodeURIComponent("serviceKey") +
     "=" + encodeURIComponent(decode);
    queryParams += "&" + encodeURIComponent("jmCd") +
    "=" + encodeURIComponent(jmcd);
    try {
      const response = await axios.get(url + queryParams, {
        responseType: "text"});
      const dataText = response.data;
      console.log("가져온데이터: ", dataText);
      res.json({data: {dataText}});
    } catch (error) {
      console.error("Error fetching data", error);
      res.status(500).send("Error fetching data");
    }
  });
});

exports.getExamFee = onRequest((req, res)=>{
  corsHandler(req, res, async ()=>{
    console.log("Called 자격증 응시료");
    const jmcd = req.body.data.jmcd;
    const decode ="Pg7aPFuf7Do381nW4BcQYu7RHCbBL9h55UUWHX"+
    "wR7p7KkAMDct7GQMOPhzvqbblI+ITj2xF+en4Q6k6xxIzLOQ==";
    const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getFeeList";
    let queryParams = "?" + encodeURIComponent("serviceKey") +
     "=" + encodeURIComponent(decode);
    queryParams += "&" + encodeURIComponent("jmCd") +
    "=" + encodeURIComponent(jmcd);
    try {
      const response = await axios.get(url + queryParams, {
        responseType: "text"});
      const dataText = response.data;
      console.log("가져온데이터: ", dataText);
      res.json({data: {dataText}});
    } catch (error) {
      console.error("Error fetching data", error);
      res.status(500).send("Error fetching data");
    }
  });
});

exports.getLicenseInfo = onRequest((req, res)=>{
  corsHandler(req, res, async ()=>{
    console.log("Called 자격증 정보 가져오기");
    const jmcd = req.body.data.jmcd;
    const decode ="Pg7aPFuf7Do381nW4BcQYu7RHCbBL9h55UUWHX"+
    "wR7p7KkAMDct7GQMOPhzvqbblI+ITj2xF+en4Q6k6xxIzLOQ==";
    const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryInformationTradeNTQSVC/getList";
    let queryParams = "?" + encodeURIComponent("serviceKey") +
     "=" + encodeURIComponent(decode);
    queryParams += "&" + encodeURIComponent("jmCd") +
    "=" + encodeURIComponent(jmcd);
    try {
      const response = await axios.get(url + queryParams, {
        responseType: "text"});
      const dataText = response.data;
      console.log("가져온데이터: ", dataText);
      res.json({data: {dataText}});
    } catch (error) {
      console.error("Error fetching data", error);
      res.status(500).send("Error fetching data");
    }
  });
});


exports.getLicenseList2 = onRequest((req, res)=>{
  corsHandler(req, res, async ()=>{
    console.log("Called getLicenseList2");
    const decode ="Pg7aPFuf7Do381nW4BcQYu7RHCbBL9h55UUWHX"+
    "wR7p7KkAMDct7GQMOPhzvqbblI+ITj2xF+en4Q6k6xxIzLOQ==";
    const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList";
    const queryParams = "?" + encodeURIComponent("serviceKey") +
     "=" + encodeURIComponent(decode);
    try {
      const response = await axios.get(url + queryParams, {
        responseType: "text"});
      const xmlData = response.data;
      console.log("response의 타입-->", typeof response);
      console.log("XML데이터 타입은 --> ", typeof xmlData);
      console.log("XML Data입니다: ", xmlData);
      res.json({data: {xmlData}});
    } catch (error) {
      console.error("Error fetching data", error);
      res.status(500).send("Error fetching data");
    }
  });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
  // Grab the current value of what was written to Firestore.
  const original = event.data.data().original;

  // Access the parameter `{documentId}` with `event.params`
  logger.log("Uppercasing", event.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing
  // asynchronous tasks inside a function
  // such as writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return event.data.ref.set({uppercase}, {merge: true});
});

