const SECRET_KEY = "rishabh$@$";
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
function signupRender(req, res) {
  res.render("signup");
}
async function signupPOST(req, res) {
  let name = req.body.name;
  let email = req.body.email;
  let password = req.body.password;
  let rollNo = req.body.rollNo;
  await User.create({
    name: name,
    email: email,
    password: password,
    rollNo: rollNo,
    heartsRemaining: 3,
    heartsRecived: 0,
    matches: 0,
    sendBy: [],
    sendTo: [],
    matchedName: [],
    matchedRollNo: []
  });
  res.redirect("/users/login");
}
function loginGET(req, res) {
  res.render("login");
}
async function loginPOST(req, res) {
  let email = req.body.email;
  let password = req.body.password;
  let result = await User.findOne({
    email: email,
    password: password,
  });
  if (result == null) {
    res.render("login");
  }
  if (result != null) {
    const token = jwt.sign(
      {
        email: result.email,
        rollNo: result.rollNo,
        name: result.name,
        id: result._id,
        heartsRecived: result.heartsRecived,
        heartsRemaining: result.heartsRemaining,
        matches: result.matches,
      },
      SECRET_KEY
    );
    res.cookie("token", token);
    info={
      name: result.name,
      id: result._id,
      heartsRemaining: result.heartsRemaining,
      heartsRecived: result.heartsRecived,
      matches: result.matches,
      matchedName: result.matchedName,
      matchedRollNo: result.matchedRollNo,
      rollNo: result.rollNo,
      sendTo: result.sendTo,
    }
    res.render("dashboard",info);
  }
}

module.exports = {
  signupRender,
  signupPOST,
  loginGET,
  loginPOST,
};
