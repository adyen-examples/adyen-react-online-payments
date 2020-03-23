import React from "react";

export function ComponentContainer() {
  return (
    <div id="whole-page">
      <div id="container">
        {/* {{customerform}}
        {{!-- The Checkout integration type will be conditionally rendered below. --}}
        {{!-- Note: A custom helper function (./util/helpers.js) was used to implement conditionals in Handlebars. --}}
        {{#ifeq type "dropin" }}
        {{!--   * Drop-in includes styling out-of-the-box, so no additional CSS classes are needed. --}}
        <div id="dropin"></div>
        {{else}}
        <div class="payment-container">
        <div id={{type}} class="payment"></div>
        </div>
        {{/ifeq}} */}
      </div>
    </div>
  );
}
