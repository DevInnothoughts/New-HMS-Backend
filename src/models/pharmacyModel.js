const { getConnectionByLocation } = require("../../databaseUtils");

async function getPrescriptionsService(from, to, location) {
  console.log("Location:", location);
  const { connection } = getConnectionByLocation(location);

  if (!connection) {
    throw new Error("Invalid location");
  }

  const executeQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  // Fetch prescriptions joined with doctor name
  const prescriptionQuery = `
    SELECT 
      p.prescription_id,
      p.creation_timestamp,
      p.patient_id,
      p.doctor_id,
      d.name AS doctor_name,
      pt.name AS patient_name,
      p.prescription_type,
      p.medicine_id,
      p.medicine_name,
      m.medicine_type,
      p.medicine_quantity,
      p.medicine_time,
      p.medicine_days
    FROM prescription p
    LEFT JOIN doctor d ON d.doctor_id = p.doctor_id
    LEFT JOIN patient pt ON pt.patient_id = p.patient_id
    LEFT JOIN medicine m ON m.medicine_id = p.medicine_id
    WHERE p.creation_timestamp >= ? 
      AND p.creation_timestamp <= ?
      AND p.is_deleted != 1
    ORDER BY p.patient_id, p.creation_timestamp
  `;

  const prescriptions = await executeQuery(prescriptionQuery, [from, to]);

  // Group by patient_id + creation_timestamp
  const grouped = {};
  prescriptions.forEach((row) => {
    const key = `${row.patient_id}_${row.creation_timestamp}`;
    if (!grouped[key]) {
      grouped[key] = {
        patient_id: row.patient_id,
        patient_name: row.patient_name,
        date: row.creation_timestamp,
        doctor_id: row.doctor_id,
        doctor_name: row.doctor_name,
        prescription_type: row.prescription_type,
        medicines: [],
      };
    }

    grouped[key].medicines.push({
      medicine_id: row.medicine_id,
      medicine_name: row.medicine_name,
      medicine_type: row.medicine_type,
      quantity: row.medicine_quantity,
      time: row.medicine_time,
      days: row.medicine_days,
    });
  });

  //console.log(grouped);

  return Object.values(grouped);
}

async function getMedicinesService(location) {
  console.log("Location:", location);
  const { connection } = getConnectionByLocation(location);

  if (!connection) {
    throw new Error("Invalid location");
  }

  const executeQuery = (query, values = []) => {
    return new Promise((resolve, reject) => {
      connection.query(query, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  };

  const query = `
    SELECT 
      medicine_id, 
      name,
      medicine_type
    FROM medicine 
    WHERE is_deleted != 1
    ORDER BY name ASC
  `;

  const medicines = await executeQuery(query);
  return medicines;
}

module.exports = { getPrescriptionsService, getMedicinesService };
