const envApiBase =
  typeof process !== "undefined" &&
  process.env &&
  process.env.REACT_APP_API_BASE_URL
    ? process.env.REACT_APP_API_BASE_URL
    : "";

const API_BASE =
  envApiBase ||
  (typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "http://localhost/bus_pariwisata/api"
    : "/api");

export default API_BASE;