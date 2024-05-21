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
const { event } = require("firebase-functions/v1/analytics");
const { getAuth } = require('firebase-admin/auth');


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
exports.sendScheduleNotification = onSchedule("every day 00:00", async (event)=>{
  console.log('called sendScheduleNotification');
  //오늘 날짜와 3,7일 후의 날짜를 계산함. 
const today = new Date();
const threeDaysLater = new Date();
const sevenDaysLater = new Date();

threeDaysLater.setDate(today.getDate() + 3);
sevenDaysLater.setDate(today.getDate() + 7);

const fieldToMessageTemplate = {
  docExamStartDt: '필기시험 시작일',
  docExamEndDt: '필기시험 종료일',
  docPassDt: '필기시험 합격자 발표일',
  docRegEndDt: '필기시험 원서접수 종료일',
  docReStartDt: '필기시험 원서접수 시작일',
  docSubmitEndDt: '응시자격서류 제출 종료일',
  docSubmitStartDt: '응시자격서류 제출 시작일',
  pracExamEndDt: '실기시험 종료일',
  pracExamStartDt: '실기시험 시작일',
  pracPassEndDt: '실기시험 합격자 발표 종료일',
  pracPassStartDt: '실기시험 합격자 발표 시작일',
  pracCreEndDt: '실기시험 원서접수 종료일',
  pracCreStartDt: '실기시험 원서접수 시작일'  };

 // Firestore의 'users' 컬렉션에서 모든 사용자 문서를 가져옵니다.
 const usersSnapshot = await db.collection('user').get();
 console.log('Total users:', usersSnapshot.size);

 // Firestore의 배치 작업을 시작합니다.
 const notifications = [];



 for (const userDoc of usersSnapshot.docs){
  const userId = userDoc.id;
  console.log('Processing user:', userId);

  const examScheduleSnapshot = await db.collection(`user/${userId}/examSchedule`).get();
  console.log('Exam schedules for user:', userId, 'Total exams:', examScheduleSnapshot.size);

    if (examScheduleSnapshot.empty) {
      console.log('No exam schedules found for user:', userId); 
      continue;
    }

  for(const examDoc of examScheduleSnapshot.docs){
    const jmcd = examDoc.id; // 자격증 코드
    const schedulesSnapshot = await db.collection(`user/${userId}/examSchedule/${jmcd}/examSchedule`).get();
    console.log('for examDoc',jmcd);


    for(const scheduleDoc of schedulesSnapshot.docs){
      const schedule = scheduleDoc.data();
      console.log('for scheduleDoc',schedule);
      for(const [key, value] of Object.entries(schedule)){

        if(typeof value === 'string'){ // 값이 문자열일때만 
          console.log(`Field: ${key}, Value: ${value}`);
          const date = new Date(value); // 일정을 Date 객체로 변환
          console.log('check2');

          if(!isNaN(date)){// 유효한날인지 확인
            const messageTemplate = fieldToMessageTemplate[key];
            console.log('check3');

            if(messageTemplate) { //템플릿에 있는 날이면. 
              console.log('check4');

              if(date.toDateString() === today.toDateString()){ //당일날이면 
                console.log('check5-1');
                notifications.push({ //userId -> 이걸 가지고, 어떤 유저의 알람인지 알 수 있음. 꼭 넣어야함.
                  userId,
                  message: `${schedule.nameOfLicense} ${schedule.nameOfExam} 오늘입니다!!!`
                }); 
              }// if today check 
              if(date.toDateString() === sevenDaysLater.toDateString()){ //7일전이면 
                console.log('check5-2');
                notifications.push({ //userId -> 이걸 가지고, 어떤 유저의 알람인지 알 수 있음. 꼭 넣어야함.
                  userId,
                  message: `${schedule.nameOfLicense} ${schedule.nameOfExam} 일주일 전 입니다!`
                }); 
              }// if sevenday check
              else if(date.toDateString() === threeDaysLater.toDateString()){ //3일전
                console.log('check5-3');
                notifications.push({ //userId -> 이걸 가지고, 어떤 유저의 알람인지 알 수 있음. 꼭 넣어야함.
                  userId,
                  message: `${schedule.nameOfLicense} ${schedule.nameOfExam} 3일 전 입니다!!`
                }); 
              }// else if 
            } // if messageTemplate 
            console.log('알람 순회');

          }//if isNan

        }// if value

      }// for key, value
     
    }//for scheduleDoc

  }//for examDoc

 }//for userDoc
 
 //notifications를 해당하는 사용자의 알람 창에 넣어줌. 
 await Promise.all(notifications.map(async (notification) => {
  await db.collection(`user/${notification.userId}/notifications`).add({
    type: `reminder`,
    message: notification.message,
    date: new Date(),
    seen: false
  });
 }));
 
 /*알람*/
 console.log(new Date() + 'Notifications sent successfully');
 return null;

});






/** 사용자가 가입하면, 해당 유저의 jmcd값을 바탕으로 시험일정을 업데이트 해주는 함수  */ 
exports.updateExamSchedule = onDocumentCreated(`user/{userId}`,  async(event) => {
  const snap = event.data; // 이벤트 데이터 접근
  const context = event;
  const userData = snap.data(); // DocumentSnapshot의 데이터 접근
  const userId = context.params.userId;


  /**jmcds 배열. jmcd값들이 있고 만약 값이 empty라면 호출안해도됨. 해줘야함 */
  const jmcds = userData.jmcds;
  // JMCD 값들에 대해 API 호출 및 데이터 업데이트
  const updatePromises = jmcds.map(async jmcd => {
    console.log('이번에 해당하는건 -> ',jmcd);
    let scheduleList =[]; //자격증들에 대한 시험정보를 담는 배열. schedule 로 이루어짐. 
    if(jmcd != 'empty'){
    try {
        const decode ="Pg7aPFuf7Do381nW4BcQYu7RHCbBL9h55UUWHX"+
         "wR7p7KkAMDct7GQMOPhzvqbblI+ITj2xF+en4Q6k6xxIzLOQ==";
         const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryTestInformationNTQSVC/getJMList";
         let queryParams = "?" + encodeURIComponent("serviceKey") +
         "=" + encodeURIComponent(decode);
         queryParams += "&" + encodeURIComponent("jmCd") +
         "=" + encodeURIComponent(jmcd);
          const response = await axios.get(url + queryParams, {
          responseType: "text"});
          const scheduleData = response.data; 
          const jsonData = JSON.parse(scheduleData);//JSON에서 자바스크립트 객체로 파싱.


          const items = jsonData.response?.body?.items?.item;
          const normalizedItems = Array.isArray(items) ? items : [items];
          

          if(!jsonData.response?.body?.items?.item){
            //return []; //빈 배열 리턴 
          }
          else{ //자격증마다 비어있는 필드가 있어서 예외처리를 해줍니다. 
            const schedule = normalizedItems.map(item =>({ //schedule -> 자격증 1개에 대한 정보. 
              /**필기시험종료일자*/
              docExamEndDt: item.docexamenddt ? String(item.docexamenddt): " ",
              /**필기시험시작일자*/
              docExamStartDt: item.docexamstartdt ? String(item.docexamstartdt):" ",
              /**필기시험 합격(예정)자 발표일자*/
              docPassDt: item.docpassdt ? String(item.docpassdt):" ",
              /**필기시험원서접수 종료일자*/
              docRegEndDt: item.docregenddt ? String(item.docregenddt):" ",
              /**필기시험원서접수 시작일자*/
              docReStartDt: item.docregstartdt ? String(item.docregstartdt):" ",
              /**응시자격서류제출 종료일자*/
              docSubmitEndDt: item.docsubmitenddt ? String(item.docsubmitenddt):" ",
              /**응시자격서류제출 시작일자*/
              docSubmitStartDt: item.docsubmitstartdt ? String(item.docsubmitstartdt):" ",
              /**시험 회차정보 ex.2024년 정기 기사 1회 */
              nameOfExam: item.implplannm ? String(item.implplannm):" ",
              /**자격증 이름 */
              nameOfLicense: item.jmfldnm ? String(item.jmfldnm):" ",
              /**중직무분야 코드 ex.211 */
              mdobligfldCode: item.mdobligfldcd ? String(item.mdobligfldcd):" ",
              /**중직무분야 이름 ex. 정보기술 */
              mdobloffldName: item.mdobloffldnm ? String(item.mdobloffldnm):" ",
              /**대직무분야 코드 ex. 21 */
              obligfldCode: item.obligfldcd ? String(item.obligfldcd):" ",
              /**대직무분야 이름 ex. 정보통신  */
              obligfldName: item.obligfldnm ? String(item.obligfldnm):" ",
              /**실기시험 종료 일자 */
              pracExamEndDt: item.pracexamenddt ? String(item.pracexamenddt):" ",
              //**실기시험 시작 일자 */
              pracExamStartDt: item.pracexamstartdt ? String(item.pracexamstartdt):" ",
              /**합격자발표 종료일자 */
              pracPassEndDt: item.pracpassenddt ? String(item.pracpassenddt):" ",
              /**합격자발표 시작일자 */
              pracPassStartDt: item.pracpassstartdt ? String(item.pracpassstartdt):" ",
              /**실기시험원서접수 종료일자*/
              pracCreEndDt: item.pracregenddt ? String(item.pracregenddt):" ",
              /**실기시험원서접수 시작일자 */
              pracCreStartDt: item.pracregstartdt ? String(item.pracregstartdt):" "
            }));
            

            for(let i=0; i<schedule.length; i++){//시험의 횟수만큼 반복 1,2,3차.. 등 
              
              const examNumber = i + 1; //시험 차수 
              const examScheduleRef = db.collection(`user/${userId}/examSchedule/${jmcd}/examSchedule`).doc(`${examNumber}`);
              console.log("횟수->",schedule.length);

              await examScheduleRef.set({
                docExamEndDt: schedule[i].docExamEndDt || "",
                docExamStartDt: schedule[i].docExamStartDt || "",
                docPassDt: schedule[i].docPassDt || "",
                docReStartDt: schedule[i].docReStartDt || "",
                docRegEndDt: schedule[i].docRegEndDt || "",
                docSubmitEndDt: schedule[i].docSubmitEndDt || "",
                docSubmitStartDt: schedule[i].docSubmitStartDt || "",
                mdobligfldCode: schedule[i].mdobligfldCode || "",
                mdobloffldName: schedule[i].mdobloffldName || "",
                nameOfExam: schedule[i].nameOfExam || "",
                nameOfLicense: schedule[i].nameOfLicense || "",
                obligfldCode: schedule[i].obligfldCode || "",
                obligfldName: schedule[i].obligfldName || "",
                pracCreEndDt: schedule[i].pracCreEndDt || "",
                pracCreStartDt: schedule[i].pracCreStartDt || "",
                pracExamEndDt: schedule[i].pracExamEndDt || "",
                pracExamStartDt: schedule[i].pracExamStartDt || "",
                pracPassEndDt: schedule[i].pracPassEndDt || "",
                pracPassStartDt: schedule[i].pracPassStartDt || ""
              });
              console.log("데이터 추가 완료->",schedule.docExamEndDt);
            }//for ScheduleList


          }//else
          
      console.log(`Exam schedule updated for jmcd: ${jmcd}`);
    } catch (error) {
      console.error(`Error updating exam schedule for jmcd: ${jmcd}`, error);
    }
  }//if end 
  
}

);
await Promise.all(updatePromises); // 모든 jmcd에 대한 작업 완료 대기
});



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

