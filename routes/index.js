var express = require("express");
const usersRouter = require("./users");
const passwordRouter = require("./resetPassword");
const CompanyRouter = require("./company");
const planRouter = require("./plan");
const paymentRouter = require("./payment");
const employeeRouter = require("./employee");
const serviceRouter = require("./service");
const saloonRouter = require("./saloon");
const postRouter = require("./posts");
const socialLinks = require("./socialLinks");

var app = express();
/* GET home page. */

app.use("/user", usersRouter);
app.use("/password", passwordRouter);
app.use("/company", CompanyRouter);
app.use("/plan", planRouter);
app.use("/payment", paymentRouter);
app.use("/employee", employeeRouter);
app.use("/service", serviceRouter);
app.use("/saloon", saloonRouter);
app.use("/post", postRouter);
app.use("/socialLinks", socialLinks);
module.exports = app;
