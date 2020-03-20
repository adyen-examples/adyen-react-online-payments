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
      break;
    case "wechatpayqr":
    case "alipay":
      return "CNY";
      break;
    case "dotpay":
      return "PLN";
      break;
    case "boletobancario":
      return "BRL";
      break;
    default:
      return "EUR";
      break;
  }
}

/* ################# end UTILS ###################### */

/* ################# API ENDPOINTS ###################### */

// Get payment methods
app.get("getPaymentMethods", (req, res) => {
  checkout
    .paymentMethods({
      channel: "Web",
      merchantAccount: process.env.MERCHANT_ACCOUNT
    })
    .then(response => {
      res.json(response);
    });
});

// Checkout page (make a payment)
app.get("/checkout/:type", (req, res) => {
  checkout
    .paymentMethods({
      channel: "Web",
      merchantAccount: process.env.MERCHANT_ACCOUNT
    })
    .then(response => {
      res.render("payment", {
        type: req.params.type,
        originKey: process.env.ORIGIN_KEY,
        response: JSON.stringify(response)
      });
    });
});

// Submitting a payment
app.post("/initiatePayment", (req, res) => {
  let currency = findCurrency(req.body.paymentMethod.type);

  checkout
    .payments({
      amount: { currency, value: 1000 },
      reference: "12345",
      merchantAccount: process.env.MERCHANT_ACCOUNT,
      shopperIP: "192.168.1.3",
      channel: "Web",
      additionalData: {
        allow3DS2: true
      },
      returnUrl: "http://localhost:8080/handleShopperRedirect",
      browserInfo: req.body.browserInfo,
      // riskData: req.body.riskData,
      paymentMethod: req.body.paymentMethod
    })
    .then(response => {
      let paymentMethodType = req.body.paymentMethod.type;
      let resultCode = response.resultCode;
      let redirectUrl =
        response.redirect !== undefined ? response.redirect.url : null;
      let action = null;

      if (response.action) {
        action = response.action;
        res.cookie("paymentData", action.paymentData);
      }

      res.json({ paymentMethodType, resultCode, redirectUrl, action });
    });
});

app.get("/handleShopperRedirect", (req, res) => {
  // Create the payload for submitting payment details
  let payload = {};
  payload["details"] = req.query;
  payload["paymentData"] = req.cookies["paymentData"];

  checkout.paymentsDetails(payload).then(response => {
    res.clearCookie("paymentData");
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect("/success");
        break;
      case "Pending":
        res.redirect("/pending");
        break;
      case "Refused":
        res.redirect("/failed");
        break;
      default:
        res.redirect("/error");
        break;
    }
  });
});

app.post("/handleShopperRedirect", (req, res) => {
  // Create the payload for submitting payment details
  let payload = {};
  payload["details"] = req.body;
  payload["paymentData"] = req.cookies["paymentData"];

  checkout.paymentsDetails(payload).then(response => {
    res.clearCookie("paymentData");
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect("/success");
        break;
      case "Pending":
        res.redirect("/pending");
        break;
      case "Refused":
        res.redirect("/failed");
        break;
      default:
        res.redirect("/error");
        break;
    }
  });
});

app.post("/submitAdditionalDetails", (req, res) => {
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
