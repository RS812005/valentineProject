const express = require("express");
const router = express.Router();
const {
  signupRender,
  signupPOST,
  loginGET,
  loginPOST,
} = require("../controllers/user");

router.get("/signup", signupRender);
router.post("/signup", signupPOST);
router.get("/login", loginGET);
router.post("/login", loginPOST);


module.exports = router;
