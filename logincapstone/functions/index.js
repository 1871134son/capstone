// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated, onDocumentUpdated} = require("firebase-functions/v2/firestore");
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

threeDaysLater.setDate(today.getDate() + 3); //테스ㅡㅌ때문에 잠시 5일로 변경
sevenDaysLater.setDate(today.getDate() + 7);

const converDate = function (dateNum){ //공공데이터에선 날짜를 20230509 이런 식으로 반환함. 이를 Date객체로 만들어 리턴해주는 함수. 
    const dateString = dateNum.toString();// 숫자를 문자열로 변환 -- 데이터 타입 확인해보고 문자면 이건 주석처리

    const year = parseInt(dateString.substring(0,4), 10); //0~3까지 10진수로 변환 
    const month = parseInt(dateString.substring(4,6),10) -1 ; //4~5까지 10진수로 변환, -1 하는 이유는 JS에서 month는 0부터 시작
    const day = parseInt(dateString.substring(6,8),10); // 6~7까지 10진수 변환. 

    return new Date(year, month, day);
}//

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
 
  const notifications = [];

  for (const userDoc of usersSnapshot.docs) {
    const userId = userDoc.id;
    //console.log(`Processing user: ${userId}`);

    const jmcdsRef = db.collection(`user/${userId}/examSchedule1`);

    // 각 사용자의 모든 jmcd 문서를 순회
    const jmcdsSnapshot = await jmcdsRef.get();
    //console.log(`Found ${jmcdsSnapshot.size} jmcd documents for user ${userId}`);


    for (const jmcdDoc of jmcdsSnapshot.docs) {
      const jmcd = jmcdDoc.id;
      const examSchedulesRef = db.collection(`user/${userId}/examSchedule1/${jmcd}/examSchedule2`);
      const schedulesSnapshot = await examSchedulesRef.get();

      for (const scheduleDoc of schedulesSnapshot.docs) {
        const schedule = scheduleDoc.data();
       // console.log("정보---> ", schedule);
        //여기서 부터 뭔가 안되고 있는듯. 일단 하나는 해결했으니 이따가 시행
        for (const [key, value] of Object.entries(schedule)) {
          //console.log("key -> ", key);
          //console.log("value -> ", value);
          if (typeof value === 'string') {
            const date = converDate(value);
           // console.log("검사할 날짜는 -> ",date);
            if (!isNaN(date)) {
              const messageTemplate = fieldToMessageTemplate[key];
             // console.log("isNan 통과");
              if (messageTemplate) {
             //   console.log("messageTemplate 에 맞는 일정입니다.");
                if (date.toDateString() === today.toDateString()) {
                  notifications.push({
                    userId,
                    message: `${schedule.nameOfLicense} ${schedule.nameOfExam} ${messageTemplate} 오늘입니다!!!`
                  });
                  console.log("알람이 추가됨_당일");

                }//if 당일날

                if (date.toDateString() === sevenDaysLater.toDateString()) {
                  notifications.push({
                    userId,
                    message: `${schedule.nameOfLicense} ${schedule.nameOfExam} ${messageTemplate} 일주일 전 입니다!`
                  });
                  console.log("알람이 추가됨_7일전");

                }//if 7일전 

                if (date.toDateString() === threeDaysLater.toDateString()) {
                  notifications.push({
                    userId,
                    message: `${schedule.nameOfLicense} ${schedule.nameOfExam} ${messageTemplate} 3일 전 입니다!!`
                  });
                  console.log("알람이 추가됨_3일전");
                }//if 3일전 

              }//if message Temp

            }//if isNan 

          }// if type 

        }//for key,value 

      }//for scheduleDoc

    }//for jmcdDoc
    console.log(`Processing user: ${userId} 에 대한 알림 순회 성공`);
  }//for useDoc

  // 알람 저장
  await Promise.all(notifications.map(async (notification) => {
    await db.collection(`user/${notification.userId}/notifications`).add({
      type: `reminder`,
      message: notification.message,
      date: new Date(),
      seen: false
    });
    console.log(new Date() + ' Notifications sent successfully');
  }));

  return null;
});


/** 사용자가 관심있는 학과 업데이트 시, 시험일정을 다시 받아와서 저장하는함수. */
exports.updatedUserInfo = onDocumentUpdated('user/{userId}', async(event) => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
    const context = event;
    const userId = context.params.userId;


    // 관심 자격증 목록을 가져옵니다.
    const beforeJmcds = beforeData.jmcds || [];
    const afterJmcds = afterData.jmcds || [];

    //console.log("beforJMCDS: ",beforeJmcds);
    //console.log("afterJmcds: ",afterJmcds);


     // 이전과 새로운 자격증 목록을 비교하여 변경된 경우, 기존 스케줄을 삭제합니다.
     if (JSON.stringify(beforeJmcds) !== JSON.stringify(afterJmcds)) {
      const examScheduleRef = db.collection(`user/${userId}/examSchedule1`);
      const snapshot = await examScheduleRef.get();
      snapshot.forEach(doc => {
        doc.ref.delete(); // 각 자격증 문서 삭제
      });

      const updatePromises = afterJmcds.map(async jmcd => {
        console.log('이번에 해당하는건 -> ',jmcd);
        let scheduleList =[]; //자격증들에 대한 시험정보를 담는 배열. schedule 로 이루어짐. 
        if(jmcd != 'empty'){
        try {
            // 가상 문서가 되지 않게 아무값이나 추가. 이걸 안하면, 스냅샷을 인식 할 수없음. 해도 안에 있는 문서를 읽어올수가없음. 
            const jmcdDocRef = db.collection(`user/${userId}/examSchedule1`).doc(jmcd);
            await jmcdDocRef.set({ initialized: true }, { merge: true });
    
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
                  const examScheduleRef = db.collection(`user/${userId}/examSchedule1/${jmcd}/examSchedule2`).doc(`${examNumber}`);
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
      
    }//
    
    );

    await Promise.all(updatePromises); // 모든 jmcd에 대한 작업 완료 대기

    }//if JSON

      
});//updatedUserInfo




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
        // 가상 문서가 되지 않게 아무값이나 추가. 이걸 안하면, 스냅샷을 인식 할 수없음. 해도 안에 있는 문서를 읽어올수가없음. 
        const jmcdDocRef = db.collection(`user/${userId}/examSchedule1`).doc(jmcd);
        await jmcdDocRef.set({ initialized: true }, { merge: true });

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
              const examScheduleRef = db.collection(`user/${userId}/examSchedule1/${jmcd}/examSchedule2`).doc(`${examNumber}`);
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
  
}//

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

