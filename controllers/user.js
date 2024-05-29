const SECRET_KEY = "rishabh$@$";
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
let info = {};

function signupRender(req, res) {
  res.render("signup");
}

async function signupPOST(req, res) {
  try {
    let { name, email, password, rollNo } = req.body;
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
  } catch (error) {
    console.error("Signup error:", error);
    res.send("An error occurred during signup. Please try again.");
  }
}

function loginGET(req, res) {
  res.render("login");
}

async function loginPOST(req, res) {
  try {
    let { email, password } = req.body;
    let result = await User.findOne({
      email: email,
      password: password,
    });
    if (!result) {
      return res.send("Invalid email or password. Please try again.");
    }
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
    info = {
      name: result.name,
      id: result._id,
      heartsRemaining: result.heartsRemaining,
      heartsRecived: result.heartsRecived,
      matches: result.matches,
      matchedName: result.matchedName,
      matchedRollNo: result.matchedRollNo,
      rollNo: result.rollNo,
      sendTo: result.sendTo,
    };
    console.log("LoginGet==>", info);
    res.redirect("/dashboard/timepass");
  } catch (error) {
    console.error("Login error:", error);
    res.send("An error occurred during login. Please try again.");
  }
}

function dashboardGET(req, res) {
  console.log("Dashboard Get==>", info);
  res.render("dashboard", info);
}

async function dashboardPOST(req, res) {
  try {
    let { rollNo } = req.body;
    let email = req.user.email;

    let result = await User.findOneAndUpdate(
      { rollNo: rollNo },
      { $inc: { heartsRecived: 1 }, $push: { sendBy: req.user.id } },
      { new: true }
    );

    if (!result) {
      return res.send("User with the specified roll number not found.");
    }

    let update = await User.findOneAndUpdate(
      { email: email },
      {
        $inc: { heartsRemaining: -1 },
        $push: { sendTo: result.rollNo },
      },
      { new: true }
    );

    if (!update) {
      return res.send("Error updating the current user's data.");
    }

    let z = update.matches;
    let matchedName = update.matchedName;
    let matchedRollNo = update.matchedRollNo;

    for (let i = 0; i < update.sendBy.length; i++) {
      if (update.sendBy[i] == result._id) {
        let newUpdate = await User.findOneAndUpdate(
          { email: email },
          {
            $inc: { matches: 1 },
            $push: {
              matchedName: result.name,
              matchedRollNo: result.rollNo,
            },
          },
          { new: true }
        );

        if (!newUpdate) {
          return res.send("Error updating the current user's match data.");
        }

        let newResult = await User.findOneAndUpdate(
          { rollNo: rollNo },
          {
            $inc: { matches: 1 },
            $push: {
              matchedName: update.name,
              matchedRollNo: update.rollNo,
            },
          },
          { new: true }
        );

        if (!newResult) {
          return res.send("Error updating the matched user's data.");
        }

        z = newUpdate.matches;
        matchedName = newUpdate.matchedName;
        matchedRollNo = newUpdate.matchedRollNo;
        break;
      }
    }

    info = {
      name: req.user.name,
      id: req.user.id,
      rollNo: req.user.rollNo,
      heartsRecived: req.user.heartsRecived,
      heartsRemaining: update.heartsRemaining,
      matches: z,
      sendTo: update.sendTo,
      matchedName: matchedName,
      matchedRollNo: matchedRollNo,
    };

    res.redirect("/dashboard/timepass");
  } catch (error) {
    console.error("Dashboard POST error:", error);
    res.send("An error occurred while processing your request. Mostly(99.9%), the rollNo doesnt exist in our database");
  }
}

function dashboardtimepassGet(req, res) {
  res.redirect("/dashboard");
}

module.exports = {
  signupRender,
  signupPOST,
  loginGET,
  loginPOST,
  dashboardGET,
  dashboardPOST,
  dashboardtimepassGet,
};
