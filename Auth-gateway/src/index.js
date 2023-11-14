const express = require("express");
const {
  ServerConfig: { PORT },
  Logger,
  ServerConfig,
} = require("./config");
const apiRoutes = require("./routes");
const { Auth } = require("./utils/common");
const rateLimit = require("express-rate-limit");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 2 minutes
  max: 100, // limit each IP to 2 requests per 'window' (here , per 2 minutes)
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use(
  "/flightsService",
  createProxyMiddleware({
    target:ServerConfig.FLIGHT_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/flightsService': '/' },
  })
);
app.use(
  "/bookingService",
  createProxyMiddleware({
    target: ServerConfig.BOOKING_SERVICE,
    changeOrigin: true,
    pathRewrite: { '^/bookingService': '/' },
  })
);

app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(`Successfully started the server on PORT ${PORT} `);
  Logger.info("Successfully started server", " root ", {});
});

/**
 * user
 *  |
 *  v()
 *  localhost:5000.flightsService/api/v1/flights (API-Gateway ) --> localhost:3000/api/v1/flights
 *  |
 *  v
 *  localhost:4000/api/v1/bookings
 */
