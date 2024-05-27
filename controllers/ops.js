const User = require("../models/userSchema");
let info = {};

function dashboardGET(req, res) {
  res.render("dashboard", info);
}

async function dashboardPOST(req, res) {
 
    let rollNo = req.body.rollNo;
    let email = req.user.email;

    let result = await User.findOneAndUpdate(
      { rollNo: rollNo },
      { $inc: { heartsRecived: 1 }, $push: { sendBy: req.user.id } },
      { new: true }
    );

    if (!result) {
     res.alert("User not found!")
    }
  
    let update = await User.findOneAndUpdate(
      { email: email },
      {
        $inc: { heartsRemaining: -1 },
        $push: {
          sendTo: result.rollNo,
        },
      },
      { new: true }
    );

    if (!update) {
      
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

        if (!newUpdate || !newResult) {
          
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
  
}

function dashboardtimepassGet(req, res) {
  res.redirect("/dashboard");
}

module.exports = {
  dashboardGET,
  dashboardPOST,
  dashboardtimepassGet,
};
