var express = require('express');
const usersRouter = require('./users');
const passwordRouter = require('./resetPassword');
var app = express();
/* GET home page. */

app.use('/user', usersRouter);
app.use('/password', passwordRouter);
module.exports = app;
