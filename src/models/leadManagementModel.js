const { getConnectionByLocation } = require("../../databaseUtils");

async function getLeads(location) {
  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location", location);
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) {
        return reject(err);
      }

      let query = `
        SELECT *
        FROM appointments 
        WHERE selected_area LIKE CONCAT('%', ?, '%') 
        ORDER BY appointment_id DESC
        LIMIT 100
      `;

      let queryParams = [location];

      if (location === "DP Road") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Tilak Road', '%')
            OR selected_area LIKE CONCAT('%', 'Dhole Patil Road', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Salunke Vihar") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Wanowrie', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Hinjewadi") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Hinjawadi', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "JP Nagar") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area = 'Bengaluru'
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Sarjapura") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Sarjapur', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Rajaji Nagar") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Rajajinagar', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Belgavi") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Belagavi', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Sahakar Nagar") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Sahakarnagar', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Gurgaon Sector 14") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Gurugram - Sector 14', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }
      if (location === "Gurgaon Sector 49") {
        query = `
          SELECT *
          FROM appointments 
          WHERE (
            selected_area LIKE CONCAT('%', ?) 
            OR selected_area LIKE CONCAT('%', 'Gurugram - Sector 49', '%')
          )
          ORDER BY appointment_id DESC
          LIMIT 100
        `;
      }

      tempCon.query(query, queryParams, function (error, rows) {
        tempCon.release();
        if (error) {
          return reject(error);
        }
        rows.forEach((row) => {
          row.selected_area = location;
        });
        //console.log(rows);
        resolve(rows);
      });
    });
  });
}

async function updateStatus(id, status) {
  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location");
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) {
        return reject(err);
      }

      const query = `
        UPDATE appointments
        SET status = ?
        WHERE appointment_id = ?
      `;

      tempCon.query(query, [status, id], function (error, rows) {
        tempCon.release();
        if (error) {
          return reject(error);
        }
        console.log(rows);
        resolve(rows);
      });
    });
  });
}

async function saveBotLeads(Lead) {
  const leadData = Array.isArray(Lead) ? Lead[0] : Lead;
  console.log("BOT LEAD:", leadData);

  const service = leadData.service;
  const variables = leadData.contact.variables || {};
  let name = "";
  let location = "";
  let branch = "";
  let contact = "";
  let disease = "";
  let chatWhatsappBranch = "";
  let consultationType = "";
  let query = "";
  let email = "";

  if (service === "live_chat") {
    name = variables.Name || "";
    location = variables.Location || "";
    branch = variables.Branch || "";
    contact = variables.Contact || leadData.contact.phone || "";
    disease = variables.Disease || "";
    chatWhatsappBranch = variables.Chat_on_Whatsapp || "";
    consultationType = variables.Online_consultation || "";
    query = variables.Query || "";
    email = variables.Email || "";
  } else if (service === "whatsapp") {
    name = leadData.contact.name || "";
    contact = leadData.contact.phone || "";
    location = ""; // Optional or default
    branch = ""; // Optional or default
    disease = ""; // Optional or default
    chatWhatsappBranch = variables["Chat on Whatsapp"] || "";
    consultationType = ""; // not provided in WhatsApp leads
    query = variables.Query || "";
    email = "";
  } else {
    throw new Error("Unsupported lead service type.");
  }

  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location at bot lead save function");
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) return reject(err);

      const sql = `
        INSERT INTO chatbot_leads 
        (datetime, name, location, branch, contact, email, disease, chat_whatsapp_branch, consultation_type, query)
        VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        name,
        location,
        branch,
        contact,
        email,
        disease,
        chatWhatsappBranch,
        consultationType,
        query,
      ];

      console.log("Executing SQL:", sql, values);

      tempCon.query(sql, values, function (error, result) {
        tempCon.release();
        if (error) {
          console.log("Error while adding lead!");
          return reject(error);
        }
        console.log("Lead Added!", result);
        resolve("Lead added!");
      });
    });
  });
}

async function saveAdvertiseLeads(Lead) {
  console.log("Advertise Lead:", Lead);
  let name = Lead.name || "";
  let city = Lead.city || "";
  let contact = Lead.contact || "";
  let disease = Lead.disease || "";

  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location at bot lead save function");
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) return reject(err);

      const sql = `
        INSERT INTO advertiseLeads 
        (name, contact, city, disease)
        VALUES ( ?, ?, ?, ?)
      `;

      const values = [name, contact, city, disease];

      console.log("Executing SQL:", sql, values);

      tempCon.query(sql, values, function (error, result) {
        tempCon.release();
        if (error) {
          console.log("Error while adding lead!");
          return reject(error);
        }
        console.log("Lead Added!", result);
        resolve("Lead added!");
      });
    });
  });
}

module.exports = { getLeads, updateStatus, saveBotLeads, saveAdvertiseLeads };
