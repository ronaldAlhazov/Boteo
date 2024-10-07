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
  const incomingMessage = req.body.Body;
  const senderNumber = req.body.From;

  let replyMessage = "";
  if (incomingMessage.toLowerCase().includes("hello")) {
    replyMessage = "Hi! How can I help you today?";
  } else if (incomingMessage.toLowerCase().includes("bye")) {
    replyMessage = "Goodbye! Have a great day!";
  } else {
    replyMessage = "I didn't understand that. Can you please clarify?";
  }

  client.messages
    .create({
      from: process.env.WHATSAPP_NUMBER,
      contentSid: "HX8c34529e9fdbd104c19da05da7628706",
      contentVariables: JSON.stringify({
        1: "Body", // Replaces {{1}}
        2: "Option 2 Text", // Replaces {{2}}
        3: "Option 3 Text", // Replaces {{3}}
        4: "Option 4 Text", // Replaces {{4}}
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
