import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPaymentDataStore, cancelOrRefundPayment } from "../../app/paymentSlice";

export function Cancel() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getPaymentDataStore());
  }, [dispatch]);

  const paymentDataStore = useSelector((state) => state.payment.paymentDataStoreRes);

  return (
    <main className="preview-page">
      <section className="cart">
        <h2>Payment Transactions</h2>
        <div className="order-summary">
          <ul className="order-summary-list">
            {paymentDataStore && Object.values(paymentDataStore).length > 0 ? (
              Object.values(paymentDataStore).map((val) =>
                val.paymentRef ? (
                  <li className="order-summary-list-list-item" key={val.reference}>
                    <p className="m-auto">Ref: {val.paymentRef}</p>
                    <p className="m-auto">{val.status}</p>
                    <p className="m-auto">
                      {val.amount.value / 100} {/* adjust for minor units */}
                      {val.amount.currency}
                    </p>
                    {val.status === "Authorised" ? (
                      <button className="button btn-info w-25 my-4" onClick={() => dispatch(cancelOrRefundPayment(val.reference))}>
                        Cancel
                      </button>
                    ) : null}
                  </li>
                ) : null
              )
            ) : (
              <p className="m-5">Please make a payment first</p>
            )}
          </ul>
        </div>
      </section>
    </main>
  );
}
