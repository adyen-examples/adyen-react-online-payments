import React from "react";
import { connect } from "react-redux";
import { useParams } from "react-router-dom";
import { CustomerForm } from "../customer/CustomerForm";
import { getAdyenConfig, getPaymentMethods, initiatePayment, submitAdditionalDetails } from "../../app/paymentSlice";

export function Checkout() {
  let { type } = useParams();
  return (
    <div id="whole-page">
      <div id="container">
        <CustomerForm />
        <ConnectedComponentContainer type={type} />
      </div>
    </div>
  );
}

class ComponentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.paymentContainer = React.createRef();
    this.paymentComponent = null;
    this.onSubmit = this.onSubmit.bind(this);
    this.onAdditionalDetails = this.onAdditionalDetails.bind(this);
  }

  componentDidMount() {
    this.props.getAdyenConfig();
    this.props.getPaymentMethods();
  }

  componentDidUpdate(prevProps) {
    const { paymentMethodsRes: paymentMethodsResponse, config, paymentRes } = this.props.payment;
    if (
      paymentMethodsResponse &&
      config &&
      (paymentMethodsResponse !== prevProps.payment.paymentMethodsRes || (config && config !== prevProps.payment.config))
    ) {
      // @ts-ignore
      // eslint-disable-next-line no-undef
      this.checkout = new AdyenCheckout({
        ...config,
        paymentMethodsResponse,
        onAdditionalDetails: this.onAdditionalDetails,
        onSubmit: this.onSubmit
      });

      this.checkout.create(this.props.type).mount(this.paymentContainer.current);
    }
    if (paymentRes && paymentRes !== prevProps.payment.paymentRes) {
      if (paymentRes.action) {
        this.paymentComponent.handleAction(paymentRes.action);
      } else {
        switch (paymentRes.resultCode) {
          case "Authorised":
            window.location.href = "/status/success";
            break;
          case "Pending":
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
  }

  onSubmit(state, component) {
    if (state.isValid) {
      this.props.initiatePayment(state.data);
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

const mapStateToProps = state => ({
  payment: state.payment
});

const mapDispatchToProps = { getAdyenConfig, getPaymentMethods, initiatePayment, submitAdditionalDetails };

export const ConnectedComponentContainer = connect(mapStateToProps, mapDispatchToProps)(ComponentContainer);
