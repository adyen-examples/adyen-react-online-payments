import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { initiateCheckout } from "../../app/paymentSlice";
import { getRedirectUrl } from "../../util/redirect";

export const PaymentContainer = () => {
  const { type } = useParams();

  return (
    <div id="payment-page">
      <div className="container">
        <Checkout type={type} />
      </div>
    </div>
  );
}

const Checkout = () => {
  const dispatch = useDispatch();
  const payment = useSelector(state => state.payment);

  const navigate = useNavigate();

  const paymentContainer = useRef(null);

  const { type } = useParams();

  useEffect(() => {
    dispatch(initiateCheckout(type));
  }, [dispatch, type])


  useEffect(() => {
    const { error } = payment;

    if (error) {
      navigate(`/status/error?reason=${error}`, { replace: true });
    }
  }, [payment, navigate])


  useEffect(() => {
    const { config, session } = payment;
    let ignore = false;

    if (!session || !paymentContainer.current) {
      // initiateCheckout is not finished yet.
      return;
    }

    const createCheckout = async () => {
      const checkout = await AdyenCheckout({
        ...config,
        session,
        onPaymentCompleted: (response, _component) =>
          navigate(getRedirectUrl(response.resultCode), { replace: true }),
        onError: (error, _component) => {
          console.error(error);
          navigate(`/status/error?reason=${error.message}`, { replace: true });
        },
      });

      if (paymentContainer.current && !ignore) {
        checkout.create(type).mount(paymentContainer.current);
      }
    }

    createCheckout();

    return () => {
      ignore = true;
    }
  }, [payment, type, navigate])

  return (
    <div className="payment-container">
      <div ref={paymentContainer} className="payment"></div>
    </div>
  );
}
