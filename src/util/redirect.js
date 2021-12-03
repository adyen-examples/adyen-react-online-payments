/**
 * Converts a result code from the Adyen API to a url which can be used to redirect.
 * @param {string} resultCode Result code obtained from Adyen API.
 * @returns A url to redirect to.
 */
export const getRedirectUrl = (resultCode) => {
  switch (resultCode) {
    case "Authorised":
      return "/status/success";
    case "Pending":
    case "Received":
      return "/status/pending";
    case "Refused":
      return "/status/failed";
    default:
      return "/status/error";
  }
}