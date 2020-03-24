import { configureStore } from "@reduxjs/toolkit";
import paymentReducer from "./paymentSlice";

export default configureStore({
  reducer: {
    payment: paymentReducer
  }
});
