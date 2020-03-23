import React from "react";

export function ComponentContainer({ type }) {
  return (
    <div className="payment-container">
      <div id={type} className="payment"></div>
    </div>
  );
}
