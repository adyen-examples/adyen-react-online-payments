import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { useLocation, useNavigate } from "react-router";
import { getRedirectUrl } from "../../util/redirect";

// This class is used to finalize redirect flows for some payment methods
export const RedirectContainer = () => {
  const location = useLocation();

  const payment = useSelector(state => state.payment);

  const navigate = useNavigate();

  useEffect(() => {
    const { config } = payment;

    const sessionId = new URLSearchParams(location.search).get('sessionId');
    const redirectResult = new URLSearchParams(location.search).get('redirectResult');

    const createCheckout = async () => {
      const checkout = await AdyenCheckout({
        ...config,
        session: { id: sessionId },
        onPaymentCompleted: (response, _component) =>
          navigate(getRedirectUrl(response.resultCode), { replace: true }),
        onError: (error, _component) => {
          console.error(error);
          navigate(`/status/error?reason=${error.message}`, { replace: true });
        },
      });
      checkout.submitDetails({ details: { redirectResult } }); // we finalize the redirect flow with the reeived payload
    };

    createCheckout();
  }, [payment, navigate, location.search])

  return (
    <div id="redirect-page"></div>
  );
}
