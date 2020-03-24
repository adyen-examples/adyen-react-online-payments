const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const app = express();

// Parse JSON bodies
app.use(express.json());
// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Parse cookie bodies, and allow setting/getting cookies
app.use(cookieParser());
// Serve client from build folder
app.use(express.static(path.join(__dirname, "build")));

// enables environment variables by
// parsing the .env file and assigning it to process.env
dotenv.config({
  path: "./.env"
});

// Adyen Node.js API library boilerplate (configuration, etc.)
const config = new Config();
config.apiKey = process.env.API_KEY;
const client = new Client({ config });
client.setEnvironment("TEST");
const checkout = new CheckoutAPI(client);

/* ################# CLIENT ENDPOINTS ###################### */

// Health check
app.get("/health", function(req, res) {
  return res.send("ok");
});

// Index (select a demo)
app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// // Checkout page (make a payment)
// app.get("/api/checkout/:type", async (req, res) => {
//   const response = await checkout.paymentMethods({
//     channel: "Web",
//     merchantAccount: process.env.MERCHANT_ACCOUNT
//   });
//   res.render("payment", {
//     type: req.params.type,
//     originKey: process.env.ORIGIN_KEY,
//     response: JSON.stringify(response)
//   });
// });

app.all("/handleShopperRedirect", (req, res) => {
  // Create the payload for submitting payment details
  let payload = {};
  payload["details"] = req.query;
  payload["paymentData"] = req.cookies["paymentData"];

  checkout.paymentsDetails(payload).then(response => {
    res.clearCookie("paymentData");
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect("/status/success");
        break;
      case "Pending":
        res.redirect("/status/pending");
        break;
      case "Refused":
        res.redirect("/status/failed");
        break;
      default:
        res.redirect("/status/error");
        break;
    }
  });
});

/* ################# end CLIENT ENDPOINTS ###################### */

/* ################# UTILS ###################### */

function findCurrency(type) {
  switch (type) {
    case "ideal":
    case "giropay":
    case "klarna_paynow":
    case "sepadirectdebit":
    case "directEbanking":
      return "EUR";
    case "wechatpayqr":
    case "alipay":
      return "CNY";
    case "dotpay":
      return "PLN";
    case "boletobancario":
      return "BRL";
    default:
      return "EUR";
  }
}

/* ################# end UTILS ###################### */

/* ################# API ENDPOINTS ###################### */

// Get Adyen configuration
app.get("/api/config", (req, res) => {
  return res.status(200).json({
    locale: "en_NL",
    environment: "test",
    originKey: process.env.ORIGIN_KEY
  });
});

// Get payment methods
app.post("/api/paymentMethods", async (req, res) => {
  const response = await checkout.paymentMethods({
    channel: "Web",
    merchantAccount: process.env.MERCHANT_ACCOUNT
  });
  return res.status(200).json(response);
});

// Submitting a payment
app.post("/api/payments", async (req, res) => {
  const currency = findCurrency(req.body.paymentMethod.type);
  const shopperIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Ideally the data passed here should be computed based on business logic
  const response = await checkout.payments({
    amount: { currency, value: 1000 }, // value is 10€ in minor units
    reference: `${Date.now()}`,
    merchantAccount: process.env.MERCHANT_ACCOUNT,
    // @ts-ignore
    shopperIP,
    channel: "Web",
    additionalData: {
      // @ts-ignore
      allow3DS2: true
    },
    returnUrl: "http://localhost:8080/handleShopperRedirect",
    browserInfo: req.body.browserInfo,
    paymentMethod: req.body.paymentMethod
  });
  let paymentMethodType = req.body.paymentMethod.type;
  let resultCode = response.resultCode;
  let redirectUrl = response.redirect !== undefined ? response.redirect.url : null;
  let action = null;

  if (response.action) {
    action = response.action;
    res.cookie("paymentData", action.paymentData, { maxAge: 900000, httpOnly: true });
  }

  res.status(200).json({ paymentMethodType, resultCode, redirectUrl, action });
});

app.post("/api/paymentDetails", (req, res) => {
  // Create the payload for submitting payment details
  let payload = {};
  payload["details"] = req.body.details;
  payload["paymentData"] = req.body.paymentData;

  // Return the response back to client
  // (for further action handling or presenting result to shopper)
  checkout.paymentsDetails(payload).then(response => {
    let resultCode = response.resultCode;
    let action = response.action || null;

    res.json({ action, resultCode });
  });
});

/* ################# end API ENDPOINTS ###################### */

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
