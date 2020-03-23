import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { ComponentContainer } from "./features/component/Component";
import { DropIn } from "./features/dropin/DropIn";
import "./App.css";

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/dropin-preview">
          <DropIn />
        </Route>
        <Route path="/component-preview">
          <ComponentContainer />
        </Route>
        <Route path="/">
          <div className="main-container">
            <div className="info">
              <h1>Select a demo</h1>
              <p>
                Click to view an interactive example of a PCI-compliant UI
                integration for online payments.
              </p>
              <p>
                To learn more about client-side integration solutions, check out{" "}
                <a href="https://docs.adyen.com/checkout">Online payments.</a>
              </p>
            </div>
            <ul className="integration-list">
              <li className="integration-list-item">
                <Link
                  to="/dropin-preview"
                  className="integration-list-item-link"
                >
                  <div className="title-container">
                    <p className="integration-list-item-title">Drop-in</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link
                  to="/component-preview?type=card"
                  className="integration-list-item-link"
                >
                  <div className="title-container">
                    <p className="integration-list-item-title">Card</p>
                  </div>
                </Link>
              </li>
              <li className="integration-list-item">
                <Link
                  to="/component-preview?type=ideal"
                  className="integration-list-item-link"
                >
                  <div className="title-container">
                    <p className="integration-list-item-title">iDEAL</p>
                  </div>
                </Link>
              </li>
            </ul>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
