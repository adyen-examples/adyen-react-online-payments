import React from "react";
import { setBilling } from "../../app/paymentSlice";
import { useDispatch, useSelector } from "react-redux";

export function CustomerForm() {
  const dispatch = useDispatch();
  const billingAddress = useSelector(state => state.payment.billingAddress);

  const handleChange = event => {
    const target = event.target;
    const name = target.name;
    const value = name === "enableBilling" ? target.checked : target.value;

    dispatch(
      setBilling({
        [name]: value
      })
    );
  };
  return (
    <div className="customer-form">
      <div className="address">
        <div className="billing_header">
          <div className="billing_header_title">
            <span className="billing_header_radio">
              <input type="checkbox" checked={billingAddress.enableBilling} name="enableBilling" onChange={handleChange} />
            </span>
            <span className="billing_header_title_name"> Enable Billing Information for 3DS2</span>
          </div>
        </div>
        <form className="addressForm" action="/destination" method="get">
          <div className="addressLine">
            <div className="addressInput">
              <label className="addressLabel" htmlFor="firstName">
                First Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="First Name"
                name="firstName"
                value={billingAddress.firstName}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
            <div className="addressInput">
              <label className="addressLabel" htmlFor="lastName">
                Last Name
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Last Name"
                name="lastName"
                value={billingAddress.lastName}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
          </div>
          <div className="addressLine">
            <div className="addressInput">
              <label className="addressLabel" htmlFor="houseNumberOrName">
                House number
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="House number"
                name="houseNumberOrName"
                value={billingAddress.houseNumberOrName}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
            <div className="addressInput">
              <label className="addressLabel" htmlFor="street">
                Street
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Street"
                name="street"
                value={billingAddress.street}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
          </div>
          <div className="addressLine">
            <div className="addressInput fullWidth">
              <label className="addressLabel" htmlFor="city">
                City
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="City"
                name="city"
                value={billingAddress.city}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
          </div>
          <div className="addressLine">
            <div className="addressInput">
              <label className="addressLabel" htmlFor="state">
                State
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="State"
                name="stateOrProvince"
                value={billingAddress.stateOrProvince}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
            <div className="addressInput">
              <label className="addressLabel" htmlFor="zipcode">
                Zip Code
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Zip Code"
                name="postalCode"
                value={billingAddress.postalCode}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
            <div className="addressInput">
              <label className="addressLabel" htmlFor="country">
                Country
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="Country"
                name="country"
                value={billingAddress.country}
                onChange={handleChange}
                disabled={!billingAddress.enableBilling}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
