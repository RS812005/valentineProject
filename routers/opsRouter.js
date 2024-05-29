const express = require("express");
const router = express.Router();
const { dashboardGET, dashboardPOST,dashboardtimepassGet } = require("../controllers/user");

router.get("/", dashboardGET);
router.post("/", dashboardPOST);
router.get("/timepass",dashboardtimepassGet)
module.exports = router;
