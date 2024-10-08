// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");

const app = express();

const path = require("path");

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const hostRoutes = require("./routes/host.routes");
app.use("/auth/host", hostRoutes);

const guestRoutes = require("./routes/auth.routes");
app.use("/auth", guestRoutes);

const accommodationRoutes = require("./routes/accommodation.routes");
app.use("/api/accommodation", accommodationRoutes);

const bookingRoutes = require("./routes/booking.routes");
app.use("/api/booking", bookingRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

module.exports = app;

//hola
