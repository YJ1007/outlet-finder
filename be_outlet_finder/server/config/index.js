const MONGO = {
  outletDb: {
    PROTO: "mongodb",
    USER: "outletDb",
    PASS: "outlet123!",
    HOST: "127.0.0.1",
    PORT: "27017",
    authStr: "/?authSource=outletDb",
  },
};

const SERVER_PORT = 9091;
const USE_CORS = true;

module.exports = {
  MONGO,
  USE_CORS,
  SERVER_PORT,
};