var express = require('express');
const usersRouter = require('./users');
const passwordRouter = require('./resetPassword');
const CompanyRouter = require('./company');
const planRouter = require('./plan');
const paymentRouter = require('./payment');
const employeeRouter = require('./employee');
const serviceRouter = require('./service')
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/company',CompanyRouter);
app.use('/plan',planRouter);
app.use('/payment',paymentRouter);
app.use('/employee', employeeRouter )
app.use('/service', serviceRouter )
module.exports = app;
