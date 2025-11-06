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
const conTest = createPool("medixpress-demo");

const providerMap = {
  HHC000: { locationName: "Test", connection: conTest },
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

const insuranceCompanies = [
  { id: 516571, name: "Aditya Birla Health Insurance Co. Limited" },
  { id: 516572, name: "Medi Assist Insurance TPA India Pvt Ltd" },
  { id: 522771, name: "MD India Healthcare (TPA) Services (Pvt.) Ltd." },
  { id: 523192, name: "Heritage Health Insurance TPA Private Limited" },
  { id: 523194, name: "Genins India Insurance TPA Limited" },
  { id: 523195, name: "Health India Insurance TPA Services Private Limited" },
  { id: 523196, name: "Safeway Insurance TPA Private Limited" },
  { id: 523197, name: "Health Insurance TPA of India Limited" },
  { id: 523207, name: "MedSave Health Insurance TPA Limited" },
  { id: 523375, name: "GOOD HEALTH INSURANCE TPA LIMITED" },
  { id: 523376, name: "Universal Sompo General Insurance Co Ltd" },
  { id: 523377, name: "PARK MEDICLAIM TPA PVT LTD" },
  { id: 523378, name: "Ericson Insurance TPA Pvt. Ltd" },
  { id: 523677, name: "Raksha Health Insurance TPA Pvt Ltd" },
  { id: 523678, name: "Vidal Health Insurance TPA Private Limited" },
  {
    id: 523679,
    name: "Paramount Health Services & Insurance TPA Private Limited",
  },
  { id: 523680, name: "ICICI Lombard General Insurance" },
  { id: 523681, name: "Family Health Plan Insurance TPA Limited" },
  { id: 523843, name: "Bajaj Allianz General Insurance" },
  { id: 523844, name: "HDFC ERGO General Insurance" },
  { id: 523845, name: "Niva Bupa Health Insurance" },
  { id: 523846, name: "Volo Health Insurance TPA Pvt Limited(East West)" },
  { id: 523847, name: "Future Generali India Insurance Company (Corporate)" },
  { id: 523848, name: "IFFCO-TOKIO General Insurance Co. Limited" },
  { id: 523849, name: "Liberty General Insurance Limited" },
  { id: 523850, name: "Reliance General Insurance Co. Ltd" },
  { id: 523893, name: "Cholamandalam MS General Insurance" },
  { id: 523894, name: "Star Health and Allied Insurance Co Ltd" },
  { id: 524231, name: "Care Health Insurance" },
  { id: 524232, name: "United Healthcare Parekh TPA Private Limited" },
  { id: 524800, name: "Medvantage Insurance TPA Private Limited" },
  { id: 526981, name: "Tata AIG General Insurance" },
  { id: 526989, name: "SBI General Insurance" },
];

const getConnectionByProviderId = (providerId) => {
  const entry = providerMap[providerId];

  if (entry) {
    return { connection: entry.connection, location: entry.locationName };
  } else {
    return { connection: null, location: null };
  }
};

async function searchPatient(providerID, uhid, mobile) {
  console.log("searchPatient called with:", { providerID, uhid, mobile });
  const { connection } = getConnectionByProviderId("HHC000");
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

        if (rows.length === 0) return resolve([]);

        // ✅ Match with your insurance data
        const enhancedRows = rows.map((row) => {
          // Find matching insurance by name (case-insensitive)
          const matchedInsurance = insuranceCompanies.find(
            (ins) =>
              ins.name.toLowerCase().trim() ===
              (row.InsurerName || "").toLowerCase().trim()
          );

          // Add insurance company id if found
          return {
            ...row,
            insurerId: matchedInsurance ? matchedInsurance.id : null,
          };
        });

        resolve(enhancedRows);
      });
    });
  });
}

async function savePatientStatusUpdate(payload) {
  const { hospitalID } = payload;
  const { connection } = getConnectionByProviderId("HHC000"); //getConnectionByProviderId(hospitalID);

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
          let patientId, invoiceId;

          if (ipNumber) {
            // Fetch invoice using admission_no
            const invoiceResult = await new Promise((res, rej) => {
              tempCon.query(
                `SELECT invoice_id, patient_id FROM invoice WHERE admission_no = ? LIMIT 1`,
                [ipNumber],
                (error, rows) => (error ? rej(error) : res(rows))
              );
            });
            console.log(invoiceResult);
            if (invoiceResult && invoiceResult.length > 0) {
              invoiceId = invoiceResult[0].invoice_id;
              patientId = invoiceResult[0].patient_id;
            }
          } else {
            // Fetch patient_id using uhid or mobileNumber
            if (uhid) {
              const patientResult = await new Promise((res, rej) => {
                tempCon.query(
                  `SELECT patient_id FROM patient WHERE Uid_no = ? LIMIT 1`,
                  [uhid],
                  (error, rows) => (error ? rej(error) : res(rows))
                );
              });
              console.log(patientResult);
              if (patientResult && patientResult.length > 0) {
                patientId = patientResult[0].patient_id;
              }
            } else if (mobileNumber) {
              const patientResult = await new Promise((res, rej) => {
                tempCon.query(
                  `SELECT patient_id FROM patient WHERE phone = ? LIMIT 1`,
                  [mobileNumber],
                  (error, rows) => (error ? rej(error) : res(rows))
                );
              });
              console.log(patientResult);
              if (patientResult && patientResult.length > 0) {
                patientId = patientResult[0].patient_id;
              }
            }

            // Fetch invoice using patient_id
            if (patientId) {
              const invoiceResult = await new Promise((res, rej) => {
                tempCon.query(
                  `SELECT invoice_id FROM invoice WHERE patient_id = ? LIMIT 1`,
                  [patientId],
                  (error, rows) => (error ? rej(error) : res(rows))
                );
              });
              console.log(invoiceResult);
              if (invoiceResult && invoiceResult.length > 0) {
                invoiceId = invoiceResult[0].invoice_id;
              }
            }
          }

          // Update insurance_invoice if possible
          if (invoiceId && patientId && settledAmount != null) {
            await new Promise((res, rej) => {
              tempCon.query(
                `UPDATE insurance_invoice
                 SET receivedamt = ?, paymentdate = NOW()
                 WHERE invoiceid = ? AND patientid = ?`,
                [settledAmount, invoiceId, patientId],
                (error, rows) => (error ? rej(error) : res(rows))
              );
            });
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
