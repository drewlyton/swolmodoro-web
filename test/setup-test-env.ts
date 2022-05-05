import { installGlobals } from "@remix-run/node/globals";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { getRedirectURL } from "./helpers/getRedirectURL";

installGlobals();

expect.extend({
  toRedirectTo(received, url) {
    if (received.status !== 302) {
      return {
        pass: false,
        message: () => `Expected response to have status of 302`,
      };
    }
    if (getRedirectURL(received) === url) {
      return {
        pass: true,
        message: () => `Expected response to redirect to ${url}`,
      };
    } else {
      return {
        pass: false,
        message: () => `Expected ${getRedirectURL(received)} to match ${url}`,
      };
    }
  },
});
