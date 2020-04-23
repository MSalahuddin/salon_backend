var express = require('express');
const usersRouter = require('./users');
const passwordRouter = require('./resetPassword');
const CompanyRouter = require('./company');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
app.use('/company',CompanyRouter);
module.exports = app;
