var express = require("express");
var router = express.Router();
const {
  getLeads,
  updateStatus,
  saveBotLeads,
  saveAdvertiseLeads,
  saveReferredPatientDetails,
  saveGPDetails,
} = require("../models/leadManagementModel");

router.get("/", async (req, res, next) => {
  try {
    const leads = await getLeads(req.query.location);
    res.status(200).send(leads);
  } catch (err) {
    next(err);
  }
});
router.post("/updateStatus", async (req, res, next) => {
  try {
    const { id } = req.query;
    const { status } = req.body;
    const leads = await updateStatus(id, status);
    res.status(200).send(leads);
  } catch (err) {
    next(err);
  }
});

router.post("/botLeads", async (req, res, next) => {
  try {
    const callingList = await saveBotLeads(req.body);
    res.status(200).send(callingList);
  } catch (err) {
    next(err);
  }
});

router.post("/advertiseLeads", async (req, res, next) => {
  try {
    const callingList = await saveAdvertiseLeads(req.body);
    res.status(200).send(callingList);
  } catch (err) {
    next(err);
  }
});

router.post("/referredPatients", async (req, res, next) => {
  try {
    const callingList = await saveReferredPatientDetails(req.body);
    res.status(200).send(callingList);
  } catch (err) {
    next(err);
  }
});

router.post("/gpDetails", async (req, res, next) => {
  try {
    const callingList = await saveGPDetails(req.body);
    res.status(200).send(callingList);
  } catch (err) {
    next(err);
  }
});
module.exports = router;
