import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

// @ts-ignore
test("renders Select a demo", () => {
  const { getByText } = render(
    <Provider store={store}>
      <App />
    </Provider>
  );

  // @ts-ignore
  expect(getByText(/Select a demo/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByText(/Drop-in/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByText(/Dotpay/i)).toBeInTheDocument();
});
