const express = require("express");
const router = express();

router.use("/api/users", require("./UserRoutes"));
router.use("/api/photos", require("./PhotoRoutes"));


// TEST ROUTE
router.get("/", (req, res) => {
    res.send("API WORKING!");
})

module.exports = router;