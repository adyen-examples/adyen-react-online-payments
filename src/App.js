import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Payment } from "./features/payment/Payment";
import { Preview } from "./features/preview/Preview";
import { Status } from "./features/status/Status";
import { Cancel } from "./features/cancel/Cancel";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/preview/:type">
          <Preview />
        </Route>
        <Route path="/checkout/:type">
          <Payment />
        </Route>
        <Route path="/status/:type">
          <Status />
        </Route>
        <Route path="/cancel">
          <Cancel />
        </Route>
        <Route path="/">
          <div className="main-container">
            <div className="info">
              <h1>Select a demo</h1>
              <p>Click to view an interactive example of a PCI-compliant React UI integration for online payments.</p>
              <p>
                Make sure the payment method you want to use are enabled for your account. Refer{" "}
                <a href="https://docs.adyen.com/payment-methods#add-payment-methods-to-your-account">the documentation</a> to add missing
                payment methods.
              </p>
              <p>
                To learn more about client-side integration solutions, check out{" "}
                <a href="https://docs.adyen.com/checkout">Online payments.</a>
              </p>
            </div>
            <ul className="integration-list">
              <li className="integration-list-item">
                <Link to="/preview/dropin" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">Drop-in</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/card" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">Card</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/ideal" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">iDEAL</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/giropay" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">giropay</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/dotpay" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">Dotpay</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/eps" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">EPS</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/directEbanking" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">Sofort</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/bcmc" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">Bancontact card</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link to="/preview/paysafecard" className="integration-list-item-link">
                  <div className="title-container">
                    <p className="integration-list-item-title">PaySafe card</p>
                  </div>
                </Link>
              </li>
            </ul>
            <div className="mt-5">
              <Link to="/cancel" className="button text-light">
                Cancel and Refund a payment
              </Link>
            </div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
