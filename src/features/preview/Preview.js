import React from "react";
import { Link, useParams } from "react-router-dom";

export function Preview() {
  let { type } = useParams();

  return (
    <main className="whole-preview">
      <section className="cart">
        <h2>Cart</h2>
        <div className="order-summary">
          <ul className="order-summary__list">
            <li className="order-summary__list__list-item">
              <img src="/images/sunglasses.png" className="order-summary__list__list-item__image" alt="" />
              <p className="order-summary__list__list-item__title">Sunglasses</p>
              <p className="order-summary__list__list-item__price">5.00</p>
            </li>
            <li className="order-summary__list__list-item">
              <img src="/images/headphones.png" className="order-summary__list__list-item__image" alt="" />
              <p className="order-summary__list__list-item__title">Headphones</p>
              <p className="order-summary__list__list-item__price">5.00</p>
            </li>
          </ul>
        </div>
        <div className="cart__footer">
          <span className="cart__footer__label">Total:</span>
          <span className="cart__footer__amount">10.00</span>
          <Link to={`/checkout/${type}`}>
            <p className="button">Continue to checkout</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
