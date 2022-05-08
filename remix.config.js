/**
 * @type {import('@remix-run/dev').AppConfig}
 */
module.exports = {
  serverBuildTarget: "netlify",
  cacheDirectory: "./node_modules/.cache/remix",
  server: "./server.js",
  ignoredRouteFiles: [
    ".*",
    "**/*.css",
    "**/*.test.{js,jsx,ts,tsx}",
    "**/*.spec.{js,jsx,ts,tsx}",
  ],
  serverDependenciesToBundle: ["@headlessui/react", "@heroicons/react"],
};
