const { getConnectionByLocation } = require("../../databaseUtils");

// Parses common formats SendPulse sends. Returns 'YYYY-MM-DD' or null.
function parsePreferredDate(raw) {
  if (!raw) return null;
  const value = String(raw).trim();

  // YYYY-MM-DD or YYYY/MM/DD
  let m = value.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (m) {
    return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
  }

  // DD-MM-YYYY or DD/MM/YYYY (Indian format — day first)
  m = value.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (m) {
    return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
  }

  // Fallback: let JS try ("12 Oct 2026", ISO timestamps, etc.)
  const d = new Date(value);
  if (!isNaN(d.getTime())) {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
      d.getDate(),
    ).padStart(2, "0")}`;
  }

  return null;
}

async function saveMumbaiBotLeads(Lead) {
  const leadData = Array.isArray(Lead) ? Lead[0] : Lead;
  console.log("MUMBAI BOT LEAD:", JSON.stringify(leadData));

  if (!leadData || !leadData.contact) {
    const err = new Error("Invalid payload: contact object missing");
    err.status = 400;
    throw err;
  }

  const variables = leadData.contact.variables || {};

  // SendPulse variable names arrive with spaces or underscores depending on flow setup
  const pick = (...keys) => {
    for (const k of keys) {
      if (
        variables[k] !== undefined &&
        variables[k] !== null &&
        variables[k] !== ""
      ) {
        return variables[k];
      }
    }
    return "";
  };

  const name = pick("Name") || leadData.contact.name || "";
  const contact = pick("Phone", "Contact") || leadData.contact.phone || "";
  const chatWhatsappBranch = pick(
    "Chat on Whatsapp",
    "Chat_on_Whatsapp",
    "Chat on WhatsApp",
  );
  const query = pick("Query");
  const preferredDateRaw = pick(
    "Preferred Date",
    "Preferred_Date",
    "PreferredDate",
  );
  const preferredDateParsed = parsePreferredDate(preferredDateRaw);

  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location at mumbai bot lead save function");
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) return reject(err);

      const sql = `
        INSERT INTO chatbot_leads
        (datetime, lead_source, name, location, branch, contact, email, disease,
         chat_whatsapp_branch, consultation_type, query, preferred_date, preferred_date_parsed)
        VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        "mumbai_chatbot", // lead_source flag
        name,
        "Mumbai", // location
        "", // branch — not sent by this flow
        contact,
        "", // email — not sent by this flow
        "", // disease — not sent by this flow
        chatWhatsappBranch,
        "", // consultation_type — not sent by this flow
        query,
        String(preferredDateRaw || ""),
        preferredDateParsed,
      ];

      console.log("Executing SQL:", sql, values);

      tempCon.query(sql, values, function (error, result) {
        tempCon.release();
        if (error) {
          console.log("Error while adding Mumbai lead!");
          return reject(error);
        }
        console.log("Mumbai Lead Added!", result.insertId);
        resolve({ message: "Mumbai lead added!", id: result.insertId });
      });
    });
  });
}

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

  let leadSource = "";

  if (service === "live_chat") {
    // ...existing assignments...
    leadSource = "website_chatbot";
  } else if (service === "whatsapp") {
    // ...existing assignments...
    leadSource = "whatsapp_chatbot";
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
        (datetime,lead_source, name, location, branch, contact, email, disease, chat_whatsapp_branch, consultation_type, query)
        VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        leadSource,
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

async function saveReferredPatientDetails(body) {
  const Lead = body[0];
  console.log("Lead:", Lead.contact.last_message_data);
  console.log("Advertise Lead:", Lead.contact.variables);
  //let dateTime = Lead.date_time || "";
  let doctorsName = Lead.contact.name || "";
  let patientsName = Lead.contact.variables.Name || "";
  let location = Lead.contact.variables.Location || "";
  let doctorsContact = Lead.contact.phone || "";
  let patientsContact = Lead.contact.variables.Contact || "";
  let disease = Lead.contact.variables.Disease || "";
  let doc_url = Lead.contact.variables["doc_url"] || "";

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
        INSERT INTO referredPatients 
        (doctorsName, dateTime, patientsName, doctorsContact, patientsContact, disease, location, doc_url)
        VALUES ( ?, ?, ?, ?, ?, ?, ?,?)
      `;

      const values = [
        doctorsName,
        new Date(),
        patientsName,
        doctorsContact,
        patientsContact,
        disease,
        location,
        doc_url,
      ];

      console.log("Executing SQL:", sql, values);

      tempCon.query(sql, values, function (error, result) {
        tempCon.release();
        if (error) {
          console.log("Error while adding lead!");
          return reject(error);
        }
        console.log("Referred patient Added!", result);
        resolve("Referred patient Added!");
      });
    });
  });
}

async function saveGPDetails(body) {
  const Lead = body[0];
  //console.log("Lead:", Lead);
  //console.log("Advertise Lead:", Lead.contact.variables);
  //let dateTime = Lead.date_time || "";
  let doctorsName = Lead.contact.variables["Doctor Name"] || "";
  let location = Lead.contact.variables["Doctor Location"] || "";
  let degree = Lead.contact.variables.Qualifications || "";
  let doctorsContact = Lead.contact.phone || "";
  let speciality = Lead.contact.variables.Specialization || "";
  let pro = Lead.contact.variables.pro || "";

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
        INSERT INTO GPData 
        (doctorsName, phoneNumber, degree, speciality, location, pro)
        VALUES ( ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        doctorsName,
        doctorsContact,
        degree,
        speciality,
        location,
        pro,
      ];

      console.log("Executing SQL:", sql, values);

      tempCon.query(sql, values, function (error, result) {
        tempCon.release();
        if (error) {
          console.log("Error while adding lead!");
          return reject(error);
        }
        console.log("GP Added!", result);
        resolve("GP Added!");
      });
    });
  });
}

module.exports = {
  getLeads,
  updateStatus,
  saveBotLeads,
  saveAdvertiseLeads,
  saveReferredPatientDetails,
  saveGPDetails,
  saveMumbaiBotLeads,
};
