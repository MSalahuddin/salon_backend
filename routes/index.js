var express = require('express');
const usersRouter = require('./users');
const passwordRouter = require('./resetPassword');
const CompanyRouter = require('./company');
const planRouter = require('./plan');
const paymentRouter = require('./payment');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/company',CompanyRouter);
app.use('/plan',planRouter);
app.use('/payment',paymentRouter);
module.exports = app;
