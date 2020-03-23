import React from "react";

export function CustomerForm() {
  return (
    <div id="customer-form">
      <div className="address" id="address">
        <div className="billing_header">
          <div className="billing_header_title">
            <span className="billing_header_radio">
              <input type="radio" checked disabled />
            </span>
            <span className="billing_header_title_name">Enter Billing Information</span>
          </div>
        </div>
        <form className="addressForm" action="/destination" method="get">
          <div className="addressLine1" id="addressLine">
            <div className="addressInput" id="first">
              <label className="addressLabel" htmlFor="firstName">
                First Name
              </label>
              <input type="text" className="form-control" placeholder="First Name" name="firstName" value="Joe" readOnly />
            </div>
            <div className="addressInput" id="last">
              <label className="addressLabel" htmlFor="lastName">
                Last Name
              </label>
              <input type="text" className="form-control" placeholder="Last Name" name="lastName" value="Bob" readOnly />
            </div>
          </div>
          <div className="addressLine2" id="addressLine">
            <div className="addressInput" id="street">
              <label className="addressLabel" htmlFor="street">
                Street
              </label>
              <input type="text" className="form-control" placeholder="Street" name="street" value="274 Brannan Street" readOnly />
            </div>
          </div>
          <div className="addressLine3" id="addressLine">
            <div className="addressInput" id="city">
              <label className="addressLabel" htmlFor="city">
                City
              </label>
              <input type="text" className="form-control" placeholder="City" name="city" value="San Francisco" readOnly />
            </div>
          </div>
          <div className="addressLine4" id="addressLine">
            <div className="addressInput" id="state">
              <label className="addressLabel" htmlFor="state">
                State
              </label>
              <input type="text" className="form-control" placeholder="State" name="stateOrProvince" value="California" readOnly />
            </div>
            <div className="addressInput" id="zip">
              <label className="addressLabel" htmlFor="zipcode">
                Zip Code
              </label>
              <input type="text" className="form-control" placeholder="Zip Code" name="postalCode" value="94107" readOnly />
            </div>
            <div className="addressInput" id="country">
              <label className="addressLabel" htmlFor="country">
                Country
              </label>
              <input type="text" className="form-control" placeholder="Country" name="country" value="United States" readOnly />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
