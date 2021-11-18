import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
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

  componentDidUpdate(prevProps) {
    const { sessionAndOrderRef, config, error } = this.props.payment;
    if (error && error !== prevProps.payment.error) {
      window.location.href = `/status/error?reason=${error}`;
      return;
    }

    const configWithSession = {
      ...config,
      session : sessionAndOrderRef[0],
      onPaymentCompleted : ((res, _) => {console.log("payment completed " + res); this.processPaymentResponse(res);}),
      onError : ((err, _) => {console.log("payment error " + err); ; this.processPaymentResponse(err);}),      
    }

    // @ts-ignore
    // eslint-disable-next-line no-undef
    this.checkout = new AdyenCheckout(configWithSession)
      .then(checkout => { checkout.create(this.props.type).mount(this.paymentContainer.current);});
  }

  processPaymentResponse(paymentRes) {
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

export const ConnectedCheckoutContainer = connect(mapStateToProps, mapDispatchToProps)(CheckoutContainer);
