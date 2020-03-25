import React from "react";
import { Link, useParams, useLocation } from "react-router-dom";

const Message = ({ type, reason }) => {
  let msg, img;
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
          Error! Reason: {reason || "Internal error"}, refer to&nbsp;
          <a href="https://docs.adyen.com/development-resources/response-handling">Response handling.</a>
        </span>
      );
      img = "failed";
      break;
    default:
      msg = <span>Your order has been successfully placed.</span>;
      img = "success";
  }

  return (
    <>
      <img src={`/images/${img}.svg`} className="status-image" alt="" />
      {["failed", "error"].includes(type) ? null : <img src="/images/thank-you.svg" className="status-image" alt="" />}
      <p className="status-message">{msg}</p>
    </>
  );
};

export function Status() {
  let { type } = useParams();
  let query = new URLSearchParams(useLocation().search);
  let reason = query ? query.get("reason") : "";

  return (
    <div className="status-container">
      <div className="status">
        <Message type={type} reason={reason} />
        <Link to="/" className="button">
          Return Home
        </Link>
      </div>
    </div>
  );
}
