const express = require("express");
const bodyParser = require("body-parser");
const twilio = require("twilio");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));

// Endpoint for incoming messages
app.post("/incoming", (req, res) => {
  const messageBody = req.body.Body.trim();
  const fromNumber = req.body.From;

  // Create a response
  const twiml = new twilio.twiml.MessagingResponse();

  // Check the incoming message and respond with buttons
  if (messageBody.toLowerCase() === "menu") {
    twiml.message("Please choose an option:");
    twiml.message(
      new twilio.twiml.MessagingResponse()
        .addButton("IT Support", 'Reply with "IT Support"')
        .addButton("Logistics Support", 'Reply with "Logistics Support"')
        .addButton("FAQs", 'Reply with "FAQs"')
    );
  } else if (messageBody.toLowerCase() === "it support") {
    twiml.message("You selected IT Support. Please choose an option:");
    twiml.message(
      new twilio.twiml.MessagingResponse()
        .addButton(
          "Software Installation",
          'Reply with "Software Installation"'
        )
        .addButton("Network Issue", 'Reply with "Network Issue"')
        .addButton("Hardware Issue", 'Reply with "Hardware Issue"')
    );
  } else if (messageBody.toLowerCase() === "logistics support") {
    twiml.message("You selected Logistics Support. Please choose an option:");
    twiml.message(
      new twilio.twiml.MessagingResponse()
        .addButton("Track Shipment", 'Reply with "Track Shipment"')
        .addButton(
          "Request Transportation",
          'Reply with "Request Transportation"'
        )
    );
  } else if (messageBody.toLowerCase() === "faqs") {
    twiml.message("You selected FAQs. Please choose:");
    twiml.message(
      new twilio.twiml.MessagingResponse()
        .addButton("Company Wi-Fi Password", 'Reply with "Wi-Fi Password"')
        .addButton("Request New Software", 'Reply with "Request Software"')
    );
  } else {
    twiml.message(
      'I did not understand that. Reply with "menu" to see options.'
    );
  }

  // Send the response
  res.writeHead(200, { "Content-Type": "text/xml" });
  res.end(twiml.toString());
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
