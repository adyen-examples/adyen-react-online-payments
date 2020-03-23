import React from "react";
import { useParams } from "react-router-dom";
import { CustomerForm } from "../customer/CustomerForm";
import { ComponentContainer } from "../component/Component";
import { DropIn } from "../dropin/DropIn";

export function Checkout() {
  let { type } = useParams();
  return (
    <div id="whole-page">
      <div id="container">
        <CustomerForm />
        {type === "dropin" ? <DropIn /> : <ComponentContainer type={type} />}
      </div>
    </div>
  );
}
