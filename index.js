const express = require("express");

const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
app.post("/send-template", (req, res) => {
  const userName = "משתמש"; // Replace with the user's name
  const senderNumber = req.body.From;

  // Sending a message with buttons
  client.messages
    .create({
      from: process.env.WHATSAPP_NUMBER,
      to: senderNumber,
      body: `היי ${userName}, איך אתה רוצה שניצור קשר?`, // Message body
      // Use the `interactive` field for buttons
      interactive: {
        type: "button",
        body: {
          text: `איך אתה רוצה שניצור קשר?`,
        },
        action: {
          buttons: [
            {
              type: "reply",
              reply: {
                id: "1",
                title: "טלפון",
              },
            },
            {
              type: "reply",
              reply: {
                id: "2",
                title: 'דוא"ל',
              },
            },
          ],
        },
      },
    })
    .then((message) => {
      console.log(`Message sent: ${message.sid}`);
      res.send("Template message with buttons sent!");
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error sending template message.");
    });
});

app.post("/whatsapp", (req, res) => {
  const incomingMessage = req.body.Body;
  const senderNumber = req.body.From;

  let replyMessage = "";

  client.messages
    .create({
      from: process.env.WHATSAPP_NUMBER,
      contentSid: "HX8c34529e9fdbd104c19da05da7628706",
      contentVariables: JSON.stringify({
        1: "ברוך הבא לboteo! אנא בחר אפשרות",
        2: "פתיחת פנייה", // Replaces {{2}}
        3: "שאלות נפוצות", // Replaces {{3}}
      }),
      to: senderNumber,
    })
    .then((message) => {
      console.log("Message SID:", message.sid);
      res.status(200).send("Reply sent successfully");
    })
    .catch((error) => {
      console.error("Error sending reply:", error);
      res.status(500).send("Failed to send reply");
    });
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
