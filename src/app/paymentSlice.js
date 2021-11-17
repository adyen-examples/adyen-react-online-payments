import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "payment",
  initialState: {
    error: "",
    sessionAndOrderRef: null,
    paymentRes: null,
    paymentDetailsRes: null,
    paymentDataStoreRes: null,
    config: {
      paymentMethodsConfiguration: {
        ideal: {
          showImage: true,
        },
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          name: "Credit or debit card",
          amount: {
            value: 1000, // 10€ in minor units
            currency: "EUR",
          },
        },
      },
      locale: "en_US",
      showPayButton: true,
      clientKey: process.env.REACT_APP_CLIENT_KEY,
      environment: "test",
    },
  },
  reducers: {
    paymentSession: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.sessionAndOrderRef = res;
      }
    },
    payments: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentRes = res;
      }
    },
    paymentDetails: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentDetailsRes = res;
      }
    },
    paymentDataStore: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentDataStoreRes = res;
      }
    },
  },
});

export const { payments, paymentSession, paymentDetails, paymentDataStore } = slice.actions;

export const initiateCheckout = () => async (dispatch) => {
  const response = await fetch("/api/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(paymentSession([await response.json(), response.status]));
};

export const initiatePayment = (data) => async (dispatch) => {
  const response = await fetch("/api/initiatePayment", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(payments([await response.json(), response.status]));
};

export const submitAdditionalDetails = (data, orderRef) => async (dispatch) => {
  const response = await fetch(`/api/submitAdditionalDetails?orderRef=${orderRef}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(paymentDetails([await response.json(), response.status]));
};

export const getPaymentDataStore = () => async (dispatch) => {
  const response = await fetch("/api/getPaymentDataStore");
  dispatch(paymentDataStore([await response.json(), response.status]));
};

export const cancelOrRefundPayment = (orderRef) => async (dispatch) => {
  await fetch(`/api/cancelOrRefundPayment?orderRef=${orderRef}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(getPaymentDataStore());
};

export default slice.reducer;
