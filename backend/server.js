const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const port = 4500;
const app = express();
app.use(express.json());
app.use(cors());
const sequelize = require("./utils/dbConfig");
const userRoute = require("./route/userRoute");
const saloonRoute = require("./route/saloonRoute");
const appointmentRoute = require("./route/appointmentRoute");
const hairCuttingRoute = require("./route/hairCuttingRoute");
const paymentsRoute = require("./route/paymentsRoute");
const appointmentReminderCron = require("./cron/appointmentReminderCron");
const reviewRoute = require("./route/reviewRoute");

app.get("/", (req, res) => {
  res.send("server is working");
});

appointmentReminderCron();
app.use("/", userRoute);
app.use("/", saloonRoute);
app.use("/", appointmentRoute);
app.use("/", hairCuttingRoute);
app.use("/", paymentsRoute);
app.use("/", reviewRoute);

sequelize
  .sync()
  .then(() => {
    app.listen(port, () => {
      console.log("server is connected");
    });
  })
  .catch((error) => {
    console.log(error);
  });
