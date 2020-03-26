import { createSlice } from "@reduxjs/toolkit";

export const slice = createSlice({
  name: "payment",
  initialState: {
    error: "",
    paymentMethodsRes: null,
    paymentRes: null,
    paymentDetailsRes: null,
    config: {
      paymentMethodsConfiguration: {
        ideal: {
          showImage: true
        },
        card: {
          hasHolderName: true,
          holderNameRequired: true,
          name: "Credit or debit card",
          amount: {
            value: 1000, // 10€ in minor units
            currency: "EUR"
          }
        }
      },
      locale: "en_NL",
      showPayButton: true
    }
  },
  reducers: {
    config: (state, action) => {
      state.config = {
        ...state.config,
        ...action.payload
      };
    },
    paymentMethods: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        state.paymentMethodsRes = res;
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
    }
  }
});

export const { config, paymentMethods, payments, paymentDetails } = slice.actions;

export const getAdyenConfig = () => async dispatch => {
  const response = await fetch("/api/config");
  dispatch(config(await response.json()));
};

export const getPaymentMethods = () => async dispatch => {
  const response = await fetch("/api/paymentMethods", {
    method: "POST"
  });
  dispatch(paymentMethods([await response.json(), response.status]));
};

export const initiatePayment = data => async dispatch => {
  const response = await fetch("/api/payments", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
  dispatch(payments([await response.json(), response.status]));
};

export const submitAdditionalDetails = () => async dispatch => {
  const response = await fetch("/api/paymentDetails", {
    method: "POST"
  });
  dispatch(paymentDetails([await response.json(), response.status]));
};

export default slice.reducer;
