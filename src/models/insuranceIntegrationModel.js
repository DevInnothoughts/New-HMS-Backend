const { createPool } = require("../../dbconfig");

// Define your database connections
const conDP = createPool("hmsDPDB");
const conAndheri = createPool("hmsAndheriDB");
const conBaner = createPool("hmsBanerDB");
const conBangalore = createPool("hmsBangaloreDB");
const conBelgavi = createPool("hmsBelagaviDB");
const conChakan = createPool("hmsChakanDB");
const conDighi = createPool("hmsDighiDB");
const conGurgaon14 = createPool("hmsGurgaon14DB");
const conGurgaon49 = createPool("hmsGurgaon49DB");
const conHSR = createPool("hmsHSRDB");
const conHyderabad = createPool("hmsHyderabadDB");
const conIndiranagar = createPool("hmsIndiranagarDB");
const conIndore = createPool("hmsIndoreDB");
const conkc = createPool("hmskcDB");
const conKolhapur = createPool("hmsKolhapurDB");
const conLatur = createPool("hmsLaturDB");
const conLudhiana = createPool("hmsLudhianaDB");
const conMysore = createPool("hmsMysoreDB");
const conNashik = createPool("hmsNashikDB");
const conNM = createPool("hmsNMDB");
const conPC = createPool("hmsPCDB");
const conSahakarnagar = createPool("hmsSahakarnagarDB");
const conSecunderabad = createPool("hmsSecunderabadDB");
const conSurat = createPool("hmsSuratDB");
const conSV = createPool("hmsSVDB");
const conThane = createPool("hmsThaneDB");
const conTilakroad = createPool("hmsTilakroadDB");
const conUndri = createPool("hmsUndriDB");
const conVashi = createPool("hmsVashiDB");
const conHinjewadi = createPool("hmsHinjewadiDB");
const conLucknow = createPool("hmsLucknowDB");
const conKalaburagi = createPool("hmsKalaburagiDB");
const conRajajiNagar = createPool("hmsRajajinagarDB");
const conSarjapura = createPool("hmsSarjapuraDB");
const conKatraj = createPool("hmsKatrajDB");
const conLead = createPool("hhc_appointments");

const providerMap = {
  HHC101: { locationName: "Hyderabad", connection: conHyderabad },
  HHC102: { locationName: "DP Road", connection: conDP },
  HHC103: { locationName: "Surat", connection: conSurat },
  HHC104: { locationName: "Ludhiana", connection: conLudhiana },
  HHC105: { locationName: "Indiranagar", connection: conIndiranagar },
  HHC106: { locationName: "Dighi", connection: conDighi },
  HHC107: { locationName: "Thane", connection: conThane },
  HHC108: { locationName: "Belagavi", connection: conBelgavi },
  HHC109: { locationName: "HSR", connection: conHSR },
  HHC110: { locationName: "Bangalore", connection: conBangalore },
  HHC111: { locationName: "Navi-Mumbai", connection: conNM },
  HHC112: { locationName: "Pimpri-Chinchwad", connection: conPC },
  HHC113: { locationName: "Nashik", connection: conNashik },
  HHC114: { locationName: "Salunkhe-Vihar", connection: conSV },
  HHC115: { locationName: "Chakan", connection: conChakan },
  HHC116: { locationName: "Baner", connection: conBaner },
  HHC117: { locationName: "Kolhapur", connection: conKolhapur },
  HHC118: { locationName: "Secunderabad", connection: conSecunderabad },
  HHC119: { locationName: "Andheri", connection: conAndheri },
  HHC120: { locationName: "Sahakarnagar", connection: conSahakarnagar },
  HHC121: { locationName: "Gurgaon-14", connection: conGurgaon14 },
  HHC122: { locationName: "Gurgaon-49", connection: conGurgaon49 },
  HHC123: { locationName: "Kemps-Corner", connection: conkc },
  HHC124: { locationName: "Latur", connection: conLatur },
  HHC125: { locationName: "Indore", connection: conIndore },
  HHC126: { locationName: "Mysore", connection: conMysore },
  HHC127: { locationName: "Undri", connection: conUndri },
  HHC128: { locationName: "Vashi", connection: conVashi },
  HHC129: { locationName: "Hinjewadi", connection: conHinjewadi },
  HHC130: { locationName: "Lucknow", connection: conLucknow },
  HHC131: { locationName: "Kalaburagi", connection: conKalaburagi },
  HHC132: { locationName: "Rajaji Nagar", connection: conRajajiNagar },
  HHC133: { locationName: "Sarjapura", connection: conSarjapura },
  HHC134: { locationName: "Katraj", connection: conKatraj },
  HHC135: { locationName: "Lead", connection: conLead },
};

const getConnectionByProviderId = (providerId) => {
  const entry = providerMap[providerId];

  if (entry) {
    return { connection: entry.connection, location: entry.locationName };
  } else {
    return { connection: null, location: null };
  }
};

async function searchPatient(providerID, uhid, mobile) {
  const { connection } = getConnectionByProviderId(providerID);
  if (!connection) {
    throw new Error("Invalid ProviderID");
  }

  return new Promise((resolve, reject) => {
    connection.getConnection((err, tempCon) => {
      if (err) return reject(err);

      console.log("Searching Patient for ProviderID:", providerID);

      let query = `
        SELECT 
          p.phone,
          p.name,
          p.age,
          p.birth_date,
          p.sex,
          p.uid_no AS uhid,
          ic.companyname AS InsurerName,
          tpa.companyname AS PayerName,
          inv.creation_date AS DateOfAdmission,
          inv.due_date AS DateOfDischarge,
          inv.admission_no AS ipNumber
        FROM patient p
        LEFT JOIN invoice inv ON p.patient_id = inv.patient_id
        LEFT JOIN insurance_company ic ON inv.insurancecompany = ic.comapny_id
        LEFT JOIN insurance_company tpa ON inv.tpa = tpa.comapny_id
        WHERE p.ConfirmPatient = 1`;

      const params = [];

      if (uhid) {
        query += " AND p.Uid_no = ?";
        params.push(uhid);
      }

      if (mobile) {
        query += " AND p.phone = ?";
        params.push(mobile);
      }

      // Return only the latest invoice
      query += " ORDER BY inv.creation_date DESC LIMIT 1";

      tempCon.query(query, params, (error, rows) => {
        tempCon.release();
        if (error) return reject(error);

        resolve(rows);
      });
    });
  });
}

async function savePatientStatusUpdate(payload) {
  const { hospitalID } = payload;
  const { connection } = getConnectionByProviderId(hospitalID);

  if (!connection) {
    throw new Error("Invalid HospitalID / Provider");
  }

  return new Promise((resolve, reject) => {
    connection.getConnection((err, tempCon) => {
      if (err) return reject(err);

      const {
        uhid,
        ipNumber,
        mobileNumber,
        statusId,
        claimNumber,
        statusName,
        claimedAmount,
        approvedAmount,
        settledAmount,
        utrNo,
        remarks,
      } = payload;

      // Build dynamic WHERE condition based on available identifiers
      const identifiers = [];
      const identifierValues = [];

      if (uhid) {
        identifiers.push("uhid = ?");
        identifierValues.push(uhid);
      }
      if (ipNumber) {
        identifiers.push("ip_number = ?");
        identifierValues.push(ipNumber);
      }
      if (mobileNumber) {
        identifiers.push("mobile_number = ?");
        identifierValues.push(mobileNumber);
      }

      if (identifiers.length === 0) {
        return reject(new Error("At least one identifier must be provided"));
      }

      const whereClause = identifiers.join(" OR ");

      // Build the new status update object
      // const statusUpdateObject = {
      //   timestamp: new Date().toISOString(),
      //   statusId: statusId,
      //   statusName: statusName,
      //   claimNumber: claimNumber,
      //   claimedAmount: claimedAmount,
      //   approvedAmount: approvedAmount,
      //   settledAmount: settledAmount,
      //   utrNo: utrNo,
      //   remarks: remarks,
      // };

      // Start transaction
      tempCon.beginTransaction(async (err) => {
        if (err) return reject(err);

        try {
          // Step 1: Update patient_status_updates JSON column
          // const updateStatusSql = `
          //   UPDATE patient_status_updates
          //   SET status = JSON_ARRAY_APPEND(
          //     IFNULL(status, JSON_ARRAY()),
          //     '$',
          //     CAST(? AS JSON)
          //   )
          //   WHERE ${whereClause}
          // `;

          // await new Promise((res, rej) => {
          //   tempCon.query(
          //     updateStatusSql,
          //     [JSON.stringify(statusUpdateObject), ...identifierValues],
          //     (error) => (error ? rej(error) : res())
          //   );
          // });

          // Step 2: If ipNumber and settledAmount are provided, update insurance_invoice
          if (ipNumber && settledAmount != null) {
            // Get invoice_id from invoice table
            const invoiceIdResult = await new Promise((res, rej) => {
              tempCon.query(
                `SELECT invoice_id FROM invoice WHERE admission_no = ? LIMIT 1`,
                [ipNumber],
                (error, rows) => (error ? rej(error) : res(rows))
              );
            });

            console.log("Invoice ID Result:", invoiceIdResult);

            if (invoiceIdResult && invoiceIdResult.length > 0) {
              const invoiceId = invoiceIdResult[0].invoice_id;

              // Update insurance_invoice.receivedamt
              const invoiceResult = await new Promise((res, rej) => {
                tempCon.query(
                  // `UPDATE insurance_invoice
                  //  SET receivedamt = ?, paymentdate= NOW()
                  //  WHERE invoiceid = ?`,
                  "SELECT * FROM insurance_invoice WHERE invoiceid = ?",
                  [invoiceId],
                  //[settledAmount, invoiceId],
                  (error, rows) => (error ? rej(error) : res(rows))
                );
              });
              //console.log("Update Result:", invoiceResult);
            }
          }

          // Commit transaction
          tempCon.commit((err) => {
            tempCon.release();
            if (err) return reject(err);
            resolve({
              success: true,
              message: "Patient status updated successfully",
            });
          });
        } catch (e) {
          // Rollback on error
          tempCon.rollback(() => {
            tempCon.release();
            reject(e);
          });
        }
      });
    });
  });
}

module.exports = { searchPatient, savePatientStatusUpdate };

//Sample response
// [
//   {
//     HospitalID: 101,
//     MobileNumber: "9876543210",
//     PatientName: "John Doe",
//     PatientAge: 45,
//     PatientGender: "Male",
//     InsurerName: "ABC Insurance Co.",
//     PayerTPA: "XYZ TPA Ltd.",
//     DateOfAdmission: "2025-09-01",
//     DateOfDischarge: "2025-09-05",
//   },
// ];
