const express = require("express");
const { userroleData } = require("../../Models/userRole.model");
const { UserData } = require('../../Models/user.model');
const { employeeData } = require('../../Models/employee.model');
const auth = require('../../middleware/auth');

const app = express();

app.get("/", auth, async (req, res) => {
    var employee = [];
  const role = await getRole(req.user._id);
  if (role.role[0] === '4' ) {
    var err = {
      success: false,
      msg: "access denied"
    }
    res.status(403).send(err)
  }
  try{
  var allEmployee = await employeeData.find();
for(var i = 0 ; i < allEmployee.length;i++){
    var user = await UserData.findById(allEmployee[i].userId).select('-password');
    employee.push({...allEmployee[i]._doc,...{user:user}})
    
    
  }
  var data= {
      success:true,
      msg:"employees found",
      data:employee
  }
res.send(data)
}
catch(err){
    res.status(403).send({success:false,msg:err})
} 
});

async function getRole(data) {
  const role = await userroleData.findOne({ userId: data });
  return role;
}

module.exports = app;
