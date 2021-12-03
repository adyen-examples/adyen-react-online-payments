import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import { PaymentContainer } from "./features/payment/Payment";
import { RedirectContainer } from "./features/redirect/Redirect";
import { PreviewContainer } from "./features/preview/Preview";
import { StatusContainer } from "./features/status/Status";
import { CancelContainer } from "./features/cancel/Cancel";
import "./App.css";
import { Home } from "./features/home/Home";

const App = () => (
  <>
    <header id="header">
      <Link to="/">
        <img src="/images/mystore-logo.svg" alt="" />
      </Link>
    </header>
    <div className="container">
      <Routes>
        <Route path="/preview/:type" element={<PreviewContainer />} />
        <Route path="/checkout/:type" element={<PaymentContainer />} />
        <Route path="/status/:type" element={<StatusContainer />} />
        <Route path="/cancel" element={<CancelContainer />} />
        <Route path="/redirect" element={<RedirectContainer />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  </>
);

export default App;
