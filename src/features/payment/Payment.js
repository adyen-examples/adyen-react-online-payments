import React from "react";
import { connect } from "react-redux";
import { useParams, withRouter } from "react-router-dom";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { initiateCheckout } from "../../app/paymentSlice";

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

    this.processPaymentResponse = this.processPaymentResponse.bind(this);
  }

  componentDidMount() {
    this.props.initiateCheckout(this.props.type);
  }

  async componentDidUpdate(prevProps) {
    const { session, config, error } = this.props.payment;
    if (error && error !== prevProps.payment.error) {
      this.props.history.replace(`/status/error?reason=${error}`);
      return;
    }

    const configWithSession = {
      ...config,
      session,
      onPaymentCompleted : ((res, _) => {this.processPaymentResponse(res);}),
      onError : ((err, _) => {this.processPaymentResponse(err);}),      
    }

    const checkout = await AdyenCheckout(configWithSession);
    checkout.create(this.props.type).mount(this.paymentContainer.current);
  }

  processPaymentResponse(paymentRes) {
    switch (paymentRes.resultCode) {
      case "Authorised":
        this.props.history.replace("/status/success");
        break;
      case "Pending":
      case "Received":
        this.props.history.replace("/status/pending");
        break;
      case "Refused":
        this.props.history.replace("/status/failed");
        break;
      default:
        this.props.history.replace("/status/error");
        break;
    }
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

const mapDispatchToProps = { initiateCheckout };

export const ConnectedCheckoutContainer = connect(mapStateToProps, mapDispatchToProps)(withRouter(CheckoutContainer));
