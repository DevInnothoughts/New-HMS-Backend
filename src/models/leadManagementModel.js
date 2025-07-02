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
  console.log("BOT LEAD:", Lead[0]);
  const vars = Lead[0].contact.variables;

  const name = vars.Name || "";
  const location = vars.Location || "";
  const branch = vars.Branch || "";
  const contact = vars.Contact || data.phone || "";
  const disease = vars.Disease || "";
  const chatWhatsappBranch = vars.Chat_on_Whatsapp || "";
  const consultationType = vars.Online_consultation || "";
  const query = vars.Query || "";

  const { connection } = getConnectionByLocation("lead");
  if (!connection) {
    const err = new Error("Invalid location at bot lead save function");
    err.status = 404;
    throw err;
  }

  return new Promise((resolve, reject) => {
    connection.getConnection(function (err, tempCon) {
      if (err) {
        return reject(err);
      }

      const sql = `
    INSERT INTO chatbot_leads 
    (datetime, name, location, branch, contact, disease, chat_whatsapp_branch, consultation_type, query)
    VALUES (NOW(), ?, ?, ?, ?, ?, ?, ?, ?)
  `;

      const values = [
        name,
        location,
        branch,
        contact,
        disease,
        chatWhatsappBranch,
        consultationType,
        query,
      ];

      console.log(sql, values);

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

module.exports = { getLeads, updateStatus, saveBotLeads };
