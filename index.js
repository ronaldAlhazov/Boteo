const express = require("express");

const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));

app.post("/whatsapp", (req, res) => {
  const incomingMessage = req.body.Body.trim();
  const senderNumber = req.body.From;

  if (!incomingMessage) {
    client.messages
      .create({
        from: process.env.WHATSAPP_NUMBER,
        contentSid: "HX467eecf75bc96475ae1cf815990e51d6",
        contentVariables: JSON.stringify({
          1: "ברוך הבא לboteo! אנא בחר אפשרות",
          2: "לוגיסטיקה",
          3: "IT",
        }),
        to: senderNumber,
      })
      .then((message) => {
        console.log("Initial Message SID:", message.sid);
        res.status(200).send("Initial reply sent successfully");
      })
      .catch((error) => {
        console.error("Error sending initial reply:", error);
        res.status(500).send("Failed to send initial reply");
      });
  } else {
    if (incomingMessage === "לוגיסטיקה") {
      client.messages
        .create({
          from: process.env.WHATSAPP_NUMBER,
          contentSid: "HX8704fe946590fb7be428e4ceed4a5ceb", // Your Logistics template SID
          contentVariables: JSON.stringify({
            body: "בחר אחת מהאפשרויות ללוגיסטיקה:",
            listButton: "לוגיסטיקה",
            1: "נגמר החלב",
            "1Des": "נגמר החלב תיאור",
            2: "קוד לאוטו",
            "2Des": "קוד לאוטו",
            3: "קוד לחניוןב",
            "3Des": "נגמר החלב תיאור",
            4: "חסר קפה",
            "4Des": "נגמר החלב תיאור",
          }),
          to: senderNumber,
        })
        .then((message) => {
          console.log("Logistics Message SID:", message.sid);
          res.status(200).send("Logistics options sent successfully");
        })
        .catch((error) => {
          console.error("Error sending logistics reply:", error);
          res.status(500).send("Failed to send logistics reply");
        });
    } else if (incomingMessage === "IT") {
      // Send IT options
      client.messages
        .create({
          from: process.env.WHATSAPP_NUMBER,
          contentSid: "HX8704fe946590fb7be428e4ceed4a5ceb", // Your Logistics template SID
          contentVariables: JSON.stringify({
            body: "בחר אחת מהאפשרויות לit:",
            listButton: "לוגיסטיקה",
            1: "נגמר החלב",
            "1Des": "נגמר החלב תיאור",
            2: "קוד לאוטו",
            "2Des": "קוד לאוטו",
            3: "קוד לחניוןב",
            "3Des": "נגמר החלב תיאור",
            4: "חסר קפה",
            "4Des": "נגמר החלב תיאור",
          }),
          to: senderNumber,
        })
        .then((message) => {
          console.log("IT Message SID:", message.sid);
          res.status(200).send("IT options sent successfully");
        })
        .catch((error) => {
          console.error("Error sending IT reply:", error);
          res.status(500).send("Failed to send IT reply");
        });
    } else {
      client.messages
        .create({
          from: process.env.WHATSAPP_NUMBER,
          contentSid: "HX467eecf75bc96475ae1cf815990e51d6",
          contentVariables: JSON.stringify({
            1: "ברוך הבא לboteo! אנא בחר אפשרות",
            2: "לוגיסטיקה",
            3: "IT",
          }),
          to: senderNumber,
        })
        .then((message) => {
          console.log("Initial Message SID:", message.sid);
          res.status(200).send("Initial reply sent successfully");
        })
        .catch((error) => {
          console.error("Error sending initial reply:", error);
          res.status(500).send("Failed to send initial reply");
        });
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
