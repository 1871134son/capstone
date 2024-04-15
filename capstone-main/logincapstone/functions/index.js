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
const {getFirestore} = require("firebase-admin/firestore");

initializeApp();

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
    const jmcd = "1320";
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
    const jmcd = "1320";
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

