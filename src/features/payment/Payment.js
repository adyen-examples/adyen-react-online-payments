import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { getPaymentMethods, initiatePayment, submitAdditionalDetails } from "../../app/paymentSlice";

export function Payment() {
  const { type } = useParams();
  return (
    <div id="payment-page">
      <div className="container">
        <ConnectedCheckoutContainer type={type} />
      </div>
    </div>
  );
}

class CheckoutContainer extends React.Component {
  constructor(props) {
    super(props);
    this.paymentContainer = React.createRef();
    this.paymentComponent = null;

    this.onSubmit = this.onSubmit.bind(this);
    this.onAdditionalDetails = this.onAdditionalDetails.bind(this);
    this.processPaymentResponse = this.processPaymentResponse.bind(this);
  }

  componentDidMount() {
    this.props.getPaymentMethods();
  }

  componentDidUpdate(prevProps) {
    const { paymentMethodsRes: paymentMethodsResponse, config, paymentRes, paymentDetailsRes, error } = this.props.payment;
    if (error && error !== prevProps.payment.error) {
      window.location.href = `/status/error?reason=${error}`;
      return;
    }
    if (
      paymentMethodsResponse &&
      config &&
      (paymentMethodsResponse !== prevProps.payment.paymentMethodsRes || config !== prevProps.payment.config)
    ) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      this.checkout = new AdyenCheckout({
        ...config,
        paymentMethodsResponse,
        onAdditionalDetails: this.onAdditionalDetails,
        onSubmit: this.onSubmit,
      });

      this.checkout.create(this.props.type).mount(this.paymentContainer.current);
    }
    if (paymentRes && paymentRes !== prevProps.payment.paymentRes) {
      this.processPaymentResponse(paymentRes);
    }
    if (paymentRes && paymentDetailsRes !== prevProps.payment.paymentDetailsRes) {
      this.processPaymentResponse(paymentDetailsRes);
    }
  }

  processPaymentResponse(paymentRes) {
    if (paymentRes.action) {
      this.paymentComponent.handleAction(paymentRes.action);
    } else {
      switch (paymentRes.resultCode) {
        case "Authorised":
          window.location.href = "/status/success";
          break;
        case "Pending":
        case "Received":
          window.location.href = "/status/pending";
          break;
        case "Refused":
          window.location.href = "/status/failed";
          break;
        default:
          window.location.href = "/status/error";
          break;
      }
    }
  }

  onSubmit(state, component) {
    if (state.isValid) {
      this.props.initiatePayment({
        ...state.data,
        origin: window.location.origin,
      });
      this.paymentComponent = component;
    }
  }

  onAdditionalDetails(state, component) {
    this.props.submitAdditionalDetails(state.data);
    this.paymentComponent = component;
  }

  render() {
    return (
      <div className="payment-container">
        <div ref={this.paymentContainer} className="payment"></div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});

const mapDispatchToProps = { getPaymentMethods, initiatePayment, submitAdditionalDetails };

export const ConnectedCheckoutContainer = connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
