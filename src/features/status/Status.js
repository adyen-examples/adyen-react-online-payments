import React from "react";
import { Link, useParams } from "react-router-dom";

const getMessage = type => {
  let msg = <span>Your order has been successfully placed.</span>;
  let img = "success";
  switch (type) {
    case "pending":
      msg = <span>Your order has been received! Payment completion pending.</span>;
      break;
    case "failed":
      msg = <span>The payment was refused. Please try a different payment method or card.</span>;
      img = "failed";
      break;
    case "error":
      msg = (
        <span>
          Error! Please review response in console and refer to{" "}
          <a href="https://docs.adyen.com/development-resources/response-handling">Response handling.</a>
        </span>
      );
      img = "failed";
      break;
    default:
      break;
  }

  return (
    <>
      <img src={`/images/${img}.svg`} className="status-image" alt="" />
      {["failed", "error"].includes(type) ? <img src="/images/thank-you.svg" className="status-image" alt="" /> : null}
      <p className="status-message">{msg}</p>
    </>
  );
};

export function Status() {
  let { type } = useParams();

  return (
    <div className="status-container">
      <div className="status">
        {getMessage(type)}
        <Link to="/" className="button">
          Return Home
        </Link>
      </div>
    </div>
  );
}
