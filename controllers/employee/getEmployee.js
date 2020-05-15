const express = require("express");
const { userroleData } = require("../../Models/userRole.model");
const { employeeData } = require('../../Models/employee.model');
const auth = require('../../middleware/auth');

const app = express();

app.get("/", auth, async (req, res) => {
  const role = await getRole(req.user._id);
  if (role.role[0] !== '4') {
    var err = {
      success: false,
      msg: "access denied"
    }
    res.status(403).send(err)
  }
  try {
      res.send(req.user)
  } catch (error) {
      res.status(404).send()
  }
  
});

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}

module.exports = app;
