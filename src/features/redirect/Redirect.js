import React from "react";
import { connect } from "react-redux";
import AdyenCheckout from "@adyen/adyen-web";
import "@adyen/adyen-web/dist/adyen.css";
import { withRouter } from 'react-router-dom';


// This class is used to finalize redirect flows for some payment methods
class RedirectContainer extends React.Component {
  componentDidMount() { 
    const { config } = this.props.payment;

    const sessionId = new URLSearchParams(this.props.location.search).get('sessionId');
    const redirectResult = new URLSearchParams(this.props.location.search).get('redirectResult');

    const configWithSession = {
      ...config,
      session : {id: sessionId},
      onPaymentCompleted : ((res, _) => {console.log("payment completed " + res); this.processPaymentResponse(res);}),
      onError : ((err, _) => {console.log("payment error " + err); ; this.processPaymentResponse(err);}),      
    }
    
    // @ts-ignore
    // eslint-disable-next-line no-undef
    this.checkout = new AdyenCheckout(configWithSession).then((checkout) => {
      checkout.submitDetails({details: {redirectResult}}); // we finalize the redirect flow with the reeived payload
    });
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
    <div id="redirect-page">
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  payment: state.payment,
});

export const ConnectedRedirectContainer = connect(mapStateToProps)(withRouter(RedirectContainer));
