import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from "./App";
import store from "./app/store";
import { Provider } from "react-redux";
import "./index.css";
import { BrowserRouter } from "react-router-dom";

const root = createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>,
  </StrictMode>
);
