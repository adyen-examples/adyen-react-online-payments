const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { uuid } = require("uuidv4");
const { Client, Config, CheckoutAPI, Modification, hmacValidator } = require("@adyen/api-library");
// init app
const app = express();
// setup request logging
app.use(morgan("dev"));
// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Serve client from build folder
app.use(express.static(path.join(__dirname, "build")));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env",
});

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);
const modification = new Modification(client);
const validator = new hmacValidator();

// in memory store for transaction
const paymentStore = {};

/* ################# API ENDPOINTS ###################### */
app.get("/api/getPaymentDataStore", async (req, res) => res.json(paymentStore));

// Submitting a payment
app.post("/api/sessions", async (req, res) => {

  try {
    // unique ref for the transaction
    const orderRef = uuid();

    console.log("Received payment request for orderRef: " + orderRef);

    // Ideally the data passed here should be computed based on business logic
    const response = await checkout.sessions({
      amount: { currency: "EUR", value: 1000 }, // value is 10€ in minor units
      reference: orderRef, // required
      merchantAccount: process.env.MERCHANT_ACCOUNT, // required
      channel: "Web", // required
      returnUrl: `http://localhost:8080/redirect?orderRef=${orderRef}`, // required for 3ds2 redirect flow
    });

    // save transaction in memory
    paymentStore[orderRef] = {
      amount: { currency: "EUR", value: 1000 },
      reference: orderRef,
    };

    res.json([response, orderRef]); // sending a tuple with orderRef as well to inform about the unique order reference
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Cancel or Refund a payment
app.post("/api/cancelOrRefundPayment", async (req, res) => {
  // Create the payload for cancelling payment
  const payload = {
    merchantAccount: process.env.MERCHANT_ACCOUNT, // required
    reference: uuid(),
  };

  try {
    // Return the response back to client
    const response = await modification.reversals(paymentStore[req.query.orderRef].paymentRef, payload);
    paymentStore[req.query.orderRef].status = "Refund Initiated";
    paymentStore[req.query.orderRef].modificationRef = response.pspReference;
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Receive webhook notifications
app.post("/api/webhook/notification", async (req, res) => {
  // get the notification request from POST body
  const notificationRequestItems = req.body.notificationItems;

  notificationRequestItems.forEach(({ NotificationRequestItem }) => {
    console.info("Received webhook notification", NotificationRequestItem);
    // Process the notification based on the eventCode
    if (validator.validateHMAC(NotificationRequestItem, process.env.HMAC_KEY)) {
      const payment = paymentStore[NotificationRequestItem.merchantReference];
      if(payment){
        if (NotificationRequestItem.success === "true") {
          if (NotificationRequestItem.eventCode === "AUTHORISATION"){
            payment.status = "Authorised";
            payment.paymentRef = NotificationRequestItem.pspReference;
          }
          else if (NotificationRequestItem.eventCode === "CANCEL_OR_REFUND") {
            // update with additionalData.modification.action
            if (
              "modification.action" in NotificationRequestItem.additionalData &&
              "refund" === NotificationRequestItem.additionalData["modification.action"]
            ) {
              payment.status = "Refunded";
            } else {
              payment.status = "Cancelled";
            }
          } 
          else {
            // do nothing
            console.info("skipping non actionable webhook");
          }
        }
        else{
          // update with failure
          payment.status = `${NotificationRequestItem.eventCode} failed`;
        }
      }
      else {
        console.error("No valid payment found for notification");
    }
    }
    else {
        console.error("NotificationRequest with invalid HMAC key received");
    }

  });

  res.send("[accepted]");
});

/* ################# end API ENDPOINTS ###################### */

/* ################# CLIENT ENDPOINTS ###################### */

// Handles any requests that doesn't match the above
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

/* ################# end CLIENT ENDPOINTS ###################### */

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
