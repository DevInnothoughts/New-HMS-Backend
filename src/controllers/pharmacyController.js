const express = require("express");

const router = express.Router();
const {
  getPrescriptionsService,
  getMedicinesService,
} = require("../models/pharmacyModel");

// Middleware to check AccessToken
// router.use((req, res, next) => {
//   const accessToken = req.headers["accesstoken"];
//   if (
//     !accessToken ||
//     accessToken !== "76B3D4C3FEBA76666AB48416643B7B511AFDB70929A499"
//   ) {
//     return res.status(400).json({
//       isSuccess: false,
//       errorCode: "E101",
//       errorMessage: "AccessToken does not exist or invalid in the API header",
//       // identifier: uuidv4(),
//       response: null,
//     });
//   }
//   next();
// });

router.get("/v1/prescription", async (req, res) => {
  try {
    const { from, to, location } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        success: false,
        message: "from and to dates are required in YYYY-MM-DD format",
      });
    }

    const data = await getPrescriptionsService(from, to, location);

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in getPrescriptions controller:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
});

router.get("/v1/medicineList", async (req, res) => {
  try {
    const { location } = req.query;

    if (!location) {
      return res.status(400).json({ message: "Location is required" });
    }

    const medicines = await getMedicinesService(location);

    res.status(200).json({
      success: true,
      data: medicines,
    });
  } catch (error) {
    console.error("Error fetching medicines:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = router;
