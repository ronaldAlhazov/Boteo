const express = require("express");

const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID; // Use the environment variable
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

// Middleware to parse the body of incoming requests
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint to handle incoming WhatsApp messages from Twilio
app.post("/whatsapp", (req, res) => {
  const incomingMessage = req.body.Body; // The message from the user
  const senderNumber = req.body.From; // The sender's WhatsApp number

  let replyMessage = "";

  // Basic chatbot logic
  if (incomingMessage.toLowerCase().includes("hello")) {
    replyMessage = "Hi! How can I help you today?";
  } else if (incomingMessage.toLowerCase().includes("bye")) {
    replyMessage = "Goodbye! Have a great day!";
  } else {
    replyMessage = "I didn't understand that. Can you please clarify?";
  }

  // Send a reply message back to the user
  client.messages
    .create({
      from: process.env.WHATSAPP_NUMBER,
      body: replyMessage, // The response message
      to: senderNumber, // The sender's WhatsApp number
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

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
