const express = require("express");

const bodyParser = require("body-parser");
require("dotenv").config();
const app = express();
const port = 3000;

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

app.use(bodyParser.urlencoded({ extended: false }));
async function createQuickReplyTemplate(userName) {
  console.log("ina");

  const twilioText = {
    body: `שלום ${userName}, תודה על פניתך לתמיכה של Owl Air. כיצד נוכל לעזור?`,
  };

  const actions = [
    {
      type: "quick_reply",
      title: "צור קשר", // "Contact Us" in Hebrew
      id: "contact_us",
    },
    {
      type: "quick_reply",
      title: "בדוק מספר שער", // "Check Gate Number" in Hebrew
      id: "gate_id_1",
    },
    {
      type: "quick_reply",
      title: "שיחה עם סוכן", // "Speak with an Agent" in Hebrew
      id: "agent_id_1",
    },
  ];

  const contentRequest = {
    friendlyName: "owl_air_qr",
    variables: {
      1: userName, // Placeholder variable
    },
    types: {
      twilioText: twilioText,
      twilioQuickReply: {
        body: "Owl Air Support",
        actions: actions,
      },
    },
    language: "abcd", // Specify Hebrew as the language
  };

  // Create the Quick Reply template
  try {
    console.log("in");
    const content = await client.content.v1.contents.create(contentRequest);
    return content.sid; // Return the SID of the created content
  } catch (error) {
    console.error("Error creating Quick Reply template:", error);
    throw error; // Rethrow the error to be handled in the calling function
  }
}

// Endpoint to send the Quick Reply template
app.post("/send-template", async (req, res) => {
  const userName = "משתמש"; // Replace with the user's name
  const senderNumber = req.body.From;
  console.log("in template");
  try {
    const templateSid = await createQuickReplyTemplate(userName);

    await client.messages.create({
      from: process.env.WHATSAPP_NUMBER,
      to: senderNumber,
      contentSid: templateSid,
      contentVariables: JSON.stringify({ 1: userName }), // Variables for the template
    });

    console.log(`Template message sent to ${senderNumber}`);
    res.send("Template message with buttons sent!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending template message.");
  }
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
