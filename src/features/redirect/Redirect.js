import React from "react";
import { connect } from "react-redux";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { withRouter } from 'react-router-dom';


// This class is used to finalize redirect flows for some payment methods
class RedirectContainer extends React.Component {
  async componentDidMount() {
    const { config } = this.props.payment;

    const sessionId = new URLSearchParams(this.props.location.search).get('sessionId');
    const redirectResult = new URLSearchParams(this.props.location.search).get('redirectResult');

    const configWithSession = {
      ...config,
      session : {id: sessionId},
      onPaymentCompleted : ((res, _) => {this.processPaymentResponse(res);}),
      onError : ((err, _) => {this.processPaymentResponse(err);}),      
    }

    const checkout = await AdyenCheckout(configWithSession);
    checkout.submitDetails({details: {redirectResult}}); // we finalize the redirect flow with the reeived payload
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
    <div id="redirect-page">
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});

export const ConnectedRedirectContainer = connect(mapStateToProps)(withRouter(RedirectContainer));
