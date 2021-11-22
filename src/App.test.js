import React from "react";
import { render } from "@testing-library/react";
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

// @ts-ignore
test("renders Select a demo", () => {
  const { getByText } = render(
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  );

  // @ts-ignore
  expect(getByText(/Select a demo/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByText(/Drop-in/i)).toBeInTheDocument();
  // @ts-ignore
  expect(getByText(/Dotpay/i)).toBeInTheDocument();
});
