import React from "react";
import { render } from "@testing-library/react";
import { Message } from "./Status";

// @ts-ignore
test("renders a success status by default", () => {
  const { getByText, getByAltText } = render(<Message type="" reason="" />);
  // @ts-ignore
  expect(getByText(/Your order has been successfully placed./i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/success/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/thank-you/i)).toBeInTheDocument();
});
// @ts-ignore
test("renders a pending status", () => {
  const { getByText, getByAltText } = render(<Message type="pending" reason="" />);
  // @ts-ignore
  expect(getByText(/Your order has been received! Payment completion pending./i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/success/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/thank-you/i)).toBeInTheDocument();
});
// @ts-ignore
test("renders a failed status", () => {
  const { getByText, getByAltText, queryByAltText } = render(<Message type="failed" reason="" />);
  // @ts-ignore
  expect(getByText(/The payment was refused. Please try a different payment method or card./i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/failed/i)).toBeInTheDocument();
  // @ts-ignore
  expect(queryByAltText(/thank-you/i)).not.toBeInTheDocument();
});
// @ts-ignore
test("renders an error status", () => {
  const { getByText, getByAltText, queryByAltText } = render(<Message type="error" reason="400 HTTP error" />);
  // @ts-ignore
  expect(getByText(/Error! Reason: 400 HTTP error, refer to/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/failed/i)).toBeInTheDocument();
  // @ts-ignore
  expect(queryByAltText(/thank-you/i)).not.toBeInTheDocument();
});
// @ts-ignore
test("renders a default error status", () => {
  const { getByText, getByAltText, queryByAltText } = render(<Message type="error" reason="" />);
  // @ts-ignore
  expect(getByText(/Error! Reason: Internal error, refer to/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByAltText(/failed/i)).toBeInTheDocument();
  // @ts-ignore
  expect(queryByAltText(/thank-you/i)).not.toBeInTheDocument();
});
