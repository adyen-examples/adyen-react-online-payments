const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const { Client, Config, CheckoutAPI } = require("@adyen/api-library");
const app = express();

// setup request logging
app.use(morgan("dev"));
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

/* ################# API ENDPOINTS ###################### */

// Health check
app.get("/api/health", (req, res) => {
  return res.send("ok");
});

// Handle all redirects from payment type
app.all("/api/handleShopperRedirect", async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.method === "GET" ? req.query : req.body;
  payload["paymentData"] = req.cookies["paymentData"];
  const originalHost = req.cookies["originalHost"] || "";

  try {
    const response = await checkout.paymentsDetails(payload);
    res.clearCookie("paymentData");
    res.clearCookie("originalHost");
    // Conditionally handle different result codes for the shopper
    switch (response.resultCode) {
      case "Authorised":
        res.redirect(`${originalHost}/status/success`);
        break;
      case "Pending":
      case "Received":
        res.redirect(`${originalHost}/status/pending`);
        break;
      case "Refused":
        res.redirect(`${originalHost}/status/failed`);
        break;
      default:
        res.redirect(`${originalHost}/status/error?reason=${response.resultCode}`);
        break;
    }
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.redirect(`${originalHost}/status/error?reason=${err.message}`);
  }
});

// Get Adyen configuration
app.get("/api/config", (req, res) => {
  res.json({
    environment: "test",
    originKey: process.env.ORIGIN_KEY
  });
});

// Get payment methods
app.post("/api/paymentMethods", async (req, res) => {
  try {
    const response = await checkout.paymentMethods({
      channel: "Web",
      merchantAccount: process.env.MERCHANT_ACCOUNT
    });
    res.json(response);
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

// Submitting a payment
app.post("/api/payments", async (req, res) => {
  const currency = findCurrency(req.body.paymentMethod.type);
  const shopperIP = req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  try {
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
      returnUrl: "http://localhost:8080/api/handleShopperRedirect",
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
      const originalHost = new URL(req.headers["referer"]);
      originalHost && res.cookie("originalHost", originalHost.origin, { maxAge: 900000, httpOnly: true });
    }

    res.json({ paymentMethodType, resultCode, redirectUrl, action });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

app.post("/api/paymentDetails", async (req, res) => {
  // Create the payload for submitting payment details
  const payload = {};
  payload["details"] = req.body.details;
  payload["paymentData"] = req.body.paymentData;

  try {
    // Return the response back to client
    // (for further action handling or presenting result to shopper)
    const response = await checkout.paymentsDetails(payload);
    let resultCode = response.resultCode;
    let action = response.action || null;

    res.json({ action, resultCode });
  } catch (err) {
    console.error(`Error: ${err.message}, error code: ${err.errorCode}`);
    res.status(err.statusCode).json(err.message);
  }
});

/* ################# end API ENDPOINTS ###################### */

/* ################# CLIENT ENDPOINTS ###################### */

// Handles any requests that doesn't match the above
app.get("*", (req, res) => {
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

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
