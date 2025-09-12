const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const {
  searchPatient,
  savePatientStatusUpdate,
} = require("../models/insuranceIntegrationModel");

// Middleware to check AccessToken
router.use((req, res, next) => {
  const accessToken = req.headers["accesstoken"];
  if (!accessToken) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "AccessToken does not exist in the API header",
      // identifier: uuidv4(),
      response: null,
    });
  }
  next();
});

router.post("/v1/PatientSearch", async (req, res) => {
  const { ProviderID, UHID, MobileNumber } = req.body;
  //const identifier = uuidv4();

  if (!ProviderID || (!UHID && !MobileNumber)) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "No key to search",
      // identifier,
      response: null,
    });
  }

  try {
    const patientData = await searchPatient(ProviderID, UHID, MobileNumber);

    if (!patientData || patientData.length === 0) {
      return res.status(404).json({
        isSuccess: false,
        errorMessage: "No matching patient record found",
        //identifier,
        response: null,
      });
    }

    const patient = patientData[0];

    const responsePayload = {
      isSuccess: true,
      errorMessage: null,
      //identifier,
      response: {
        hospitalId: `${HospitalID}`,
        patientDetails: {
          patientName: patient.name || null,
          mobileNumber: patient.phone || null,
          insurerName: patient.InsurerName || null,
          payer: patient.PayerTPA || null,
          patientAge: patient.age || null,
          patientGender: patient.sex || null,
          dateOfBirth: patient.birth_date, // Populate if available
        },
        treatmentDetails: {
          dateOfAdmission: patient.DateOfAdmission
            ? new Date(patient.DateOfAdmission).getTime().toString()
            : null,
          dateOfDischarge: patient.DateOfDischarge
            ? new Date(patient.DateOfDischarge).getTime().toString()
            : null,
        },
      },
    };

    res.status(200).json(responsePayload);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      isSuccess: false,
      errorMessage: "Internal Error",
      identifier,
      response: null,
    });
  }
});

// Callback API - Patient Status Update
router.post("/v1/patientStatusUpdate", async (req, res) => {
  const {
    HospitalID,
    UHID,
    IPNumber,
    MobileNumber,
    StatusID,
    ClaimNumber,
    StatusName,
    ClaimedAmount,
    ApprovedAmount,
    SettledAmount,
    UTRNo,
    Letters,
    Remarks,
  } = req.body;

  // HospitalID is required
  if (!HospitalID) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "HospitalID is required",
      response: null,
    });
  }

  // At least one patient identifier is required
  if (!UHID && !IPNumber && !MobileNumber) {
    return res.status(400).json({
      isSuccess: false,
      errorMessage: "At least one patient identifier is required",
      response: null,
    });
  }

  try {
    // Save/Update into DB
    await savePatientStatusUpdate({
      HospitalID,
      UHID,
      IPNumber,
      MobileNumber,
      StatusID,
      ClaimNumber,
      StatusName,
      ClaimedAmount,
      ApprovedAmount,
      SettledAmount,
      UTRNo,
      Letters,
      Remarks,
    });

    // Response according to screenshot
    res.status(200).json({
      HospitalID,
      UHID: UHID || null,
      IPNumber: IPNumber || null,
      MobileNumber: MobileNumber || null,
      StatusName: StatusName || "Success",
      StatusID: StatusID || "200",
      Message: "Saved Successfully",
    });
  } catch (err) {
    console.error("Error in patientStatusUpdate:", err);
    res.status(500).json({
      HospitalID,
      StatusName: "Failure",
      StatusID: "500",
      Message: "Internal Error",
    });
  }
});

module.exports = router;

//Sample Request
// POST https://<HospitalIntegrationSystem>:4040/ivr/insurance/v1/PatientSearch
// Headers:
//   accesstoken: <YourAccessToken>

// Body (JSON):
// {
//   "ProviderID": "HOSP12345",
//   "UHID": "UHID987654321",
//   "MobileNumber": "9876543210"
// }

//CallBack API
//Body: {
//   "HospitalID": 102,
//   "UHID": "UH1234",
//   "StatusID": "ST01",
//   "StatusName": "Approved",
//   "ClaimedAmount": 5000,
//   "ApprovedAmount": 4500,
//   "Remarks": "Partially Approved"
// }

//Response: {
//   "HospitalID": 102,
//   "UHID": "UH1234",
//   "IPNumber": null,
//   "MobileNumber": null,
//   "ABHAAddress": null,
//   "ABHANumber": null,
//   "StatusName": "Approved",
//   "StatusID": "ST01",
//   "Message": "Saved Successfully"
// }
