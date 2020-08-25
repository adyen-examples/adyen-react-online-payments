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
      locale: "en_NL",
      showPayButton: true,
    },
    billingAddress: {
      enableBilling: false,
      firstName: "Joe",
      lastName: "Bob",
      houseNumberOrName: "274",
      street: "Brannan Street",
      city: "San Francisco",
      stateOrProvince: "California",
      postalCode: "94107",
      country: "US",
    },
  },
  reducers: {
    setBilling: (state, action) => {
      state.billingAddress = {
        ...state.billingAddress,
        ...action.payload,
      };
    },
    config: (state, action) => {
      state.config = {
        ...state.config,
        ...action.payload,
      };
    },
    paymentMethods: (state, action) => {
      const [res, status] = action.payload;
      if (status >= 300) {
        state.error = res;
      } else {
        res.paymentMethods = res.paymentMethods.filter((it) =>
          ["eps", "scheme", "dotpay", "giropay", "ideal", "directEbanking", "bcmc", "paysafecard"].includes(it.type)
        );
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
    },
  },
});

export const { setBilling, config, paymentMethods, payments, paymentDetails } = slice.actions;

export const getAdyenConfig = () => async (dispatch) => {
  const response = await fetch("/api/config");
  dispatch(config(await response.json()));
};

export const getPaymentMethods = () => async (dispatch) => {
  const response = await fetch("/api/getPaymentMethods", {
    method: "POST",
  });
  dispatch(paymentMethods([await response.json(), response.status]));
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

export const submitAdditionalDetails = (data) => async (dispatch) => {
  const response = await fetch("/api/submitAdditionalDetails", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  dispatch(paymentDetails([await response.json(), response.status]));
};

export default slice.reducer;
