// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
const {fetch} =require("node-fetch");
// The Firebase Admin SDK to access Firestore.
const cors = require("cors");
const corsHandler = cors({origin: true});
const {initializeApp} = require("firebase-admin/app");
const {getFirestore} = require("firebase-admin/firestore");
const {parseString} = require("xml2js");

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
exports.getLicenseList = onRequest((req, res)=>{
  corsHandler(req, res, async ()=>{
    const decode ="6PMqd5hBgTpaH/fWJRCMqwhHge5t9MGlec7L7PTtZT"+
    "jRnNeehtmtlT1BHq3axWF6vV//mdLc8g5grpS4EtNPrg==";
    const url = "http://openapi.q-net.or.kr/api/service/rest/InquiryListNationalQualifcationSVC/getList";
    const queryParams = "?" + encodeURIComponent("serviceKey") +
     "=" + encodeURIComponent(decode);

    try {
      const response = await fetch(url + queryParams);
      const xmlText = await response.text();
      parseString.parseString(xmlText, (error, result) =>{
        if (error) {
          res.status(500).send("Error parsing XML");
          return;
        }
        // XML을 JSON으로 변환, 결과 클라이언트에 전달.
        res.json(result);
      });
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

