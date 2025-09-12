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
  101: { locationName: "Hyderabad", connection: conHyderabad },
  102: { locationName: "DP Road", connection: conDP },
  103: { locationName: "Surat", connection: conSurat },
  104: { locationName: "Ludhiana", connection: conLudhiana },
  105: { locationName: "Indiranagar", connection: conIndiranagar },
  106: { locationName: "Dighi", connection: conDighi },
  107: { locationName: "Thane", connection: conThane },
  108: { locationName: "Belagavi", connection: conBelgavi },
  109: { locationName: "HSR", connection: conHSR },
  110: { locationName: "Bangalore", connection: conBangalore },
  111: { locationName: "Navi-Mumbai", connection: conNM },
  112: { locationName: "Pimpri-Chinchwad", connection: conPC },
  113: { locationName: "Nashik", connection: conNashik },
  114: { locationName: "Salunkhe-Vihar", connection: conSV },
  115: { locationName: "Chakan", connection: conChakan },
  116: { locationName: "Baner", connection: conBaner },
  117: { locationName: "Kolhapur", connection: conKolhapur },
  118: { locationName: "Secunderabad", connection: conSecunderabad },
  119: { locationName: "Andheri", connection: conAndheri },
  120: { locationName: "Sahakarnagar", connection: conSahakarnagar },
  121: { locationName: "Gurgaon-14", connection: conGurgaon14 },
  122: { locationName: "Gurgaon-49", connection: conGurgaon49 },
  123: { locationName: "Kemps-Corner", connection: conkc },
  124: { locationName: "Latur", connection: conLatur },
  125: { locationName: "Indore", connection: conIndore },
  126: { locationName: "Mysore", connection: conMysore },
  127: { locationName: "Undri", connection: conUndri },
  128: { locationName: "Vashi", connection: conVashi },
  129: { locationName: "Hinjewadi", connection: conHinjewadi },
  130: { locationName: "Lucknow", connection: conLucknow },
  131: { locationName: "Kalaburagi", connection: conKalaburagi },
  132: { locationName: "Rajaji Nagar", connection: conRajajiNagar },
  133: { locationName: "Sarjapura", connection: conSarjapura },
  134: { locationName: "Katraj", connection: conKatraj },
  135: { locationName: "Lead", connection: conLead },
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
          ${providerID} AS HospitalID,
          p.phone,
          p.name,
          p.age,
          p.birth_date,
          p.sex,
          ic.companyname AS InsurerName,
          tpa.companyname AS PayerTPA,
          inv.creation_date AS DateOfAdmission,
          inv.due_date AS DateOfDischarge
        FROM patient p
        LEFT JOIN invoice inv ON p.patient_id = inv.patient_id
        LEFT JOIN insurance_company ic ON inv.insurancecompany = ic.company_id
        LEFT JOIN insurance_company tpa ON inv.tpa = tpa.company_id
        WHERE p.ConfirmPatient = 1`;

      const params = [];

      if (uhid) {
        query += " AND p.uhid = ?";
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
  const { HospitalID } = payload;
  const { connection } = getConnectionByProviderId(HospitalID);

  if (!connection) {
    throw new Error("Invalid HospitalID / Provider");
  }

  return new Promise((resolve, reject) => {
    connection.getConnection((err, tempCon) => {
      if (err) return reject(err);

      const {
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
      } = payload;

      // Build dynamic WHERE condition based on available identifiers
      const identifiers = [];
      const identifierValues = [];

      if (UHID) {
        identifiers.push("uhid = ?");
        identifierValues.push(UHID);
      }
      if (IPNumber) {
        identifiers.push("ip_number = ?");
        identifierValues.push(IPNumber);
      }
      if (MobileNumber) {
        identifiers.push("mobile_number = ?");
        identifierValues.push(MobileNumber);
      }

      if (identifiers.length === 0) {
        return reject(new Error("At least one identifier must be provided"));
      }

      const whereClause = identifiers.join(" OR ");

      // Build the new status update object
      const statusUpdateObject = {
        timestamp: new Date().toISOString(),
        statusId: StatusID,
        statusName: StatusName,
        claimNumber: ClaimNumber,
        claimedAmount: ClaimedAmount,
        approvedAmount: ApprovedAmount,
        settledAmount: SettledAmount,
        utrNo: UTRNo,
        letters: Letters,
        remarks: Remarks,
      };

      const sql = `
        UPDATE patient_status_updates
        SET
          status = JSON_ARRAY_APPEND(
            IFNULL(status, JSON_ARRAY()),
            '$',
            CAST(? AS JSON)
          ),
        WHERE ${whereClause}
      `;

      const params = [JSON.stringify(statusUpdateObject), ...identifierValues];

      tempCon.query(sql, params, (error, result) => {
        tempCon.release();
        if (error) return reject(error);

        resolve(result);
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
