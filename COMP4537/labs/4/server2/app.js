const path = require('path');
const http = require("http");
const mysql = require("mysql2");
const url = require("url");
const dotenv = require('dotenv');

// Try default .env first, then fall back to parent directory
dotenv.config();
if (!process.env.DB_ADMIN_PASSWORD) {
    dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
}

const portNumber = 3001;

// I'm using two different connections to MySQL so that users cant just use
// whatever commands they want.

// Admin is for the update data button

// Admin connection (For creating tables and inserting data)
// Uses the main root/admin credentials
const adminConn = mysql.createConnection({
    host: "localhost",
    user: "lab_admin",       // The admin DB user
    password: process.env.DB_ADMIN_PASSWORD, // The admin DB password from .env file
    database: "lab4"
});

// Restricted connection (For executing user queries)
const readOnlyConn = mysql.createConnection({
    host: "localhost",
    user: "readonly_user",
    password: "password123",
    database: "lab4"
});

const server = http.createServer((req, res) => {
    // Handle CORS (Allowing requests from the client origin)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") {
        res.writeHead(204);
        res.end();
        return;
    }

    const parsedUrl = url.parse(req.url, true);

    // POST route, (Insert Data)
    // Requirement: Check if table exists, create if not, then insert rows.
    if (req.method === "POST" && parsedUrl.pathname === "/insert") {

        // SQL to create table (Engine=InnoDB as said in lab outline)
        const createTableSQL = `
            CREATE TABLE IF NOT EXISTS patient (
                patientid INT(11) AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(100),
                dateOfBirth DATETIME
            ) ENGINE=InnoDB;
        `;

        // SQL to insert default data (4 rows as said in lab outline)
        const insertDefaultData = `
            INSERT INTO patient (name, dateOfBirth) VALUES 
            ('Sara Brown', '1901-01-01'), 
            ('John Smith', '1941-01-01'), 
            ('Jack Ma', '1961-01-30'), 
            ('Elon Musk', '1999-01-01');
        `;

        // USE ADMIN CONNECTION
        // First, ensure the table exists. If it already exists, this will do nothing because of "IF NOT EXISTS".
        adminConn.query(createTableSQL, (err) => {
            if (err) {
                res.writeHead(500);
                return res.end("Error creating table: " + err.message);
            }

            // After ensuring the table exists, insert the default data
            adminConn.query(insertDefaultData, (err, result) => {
                if (err) {
                    res.writeHead(500);
                    return res.end("Error inserting data: " + err.message);
                }
                res.writeHead(200, { "Content-Type": "text/plain" });
                res.end("Table checked and default data inserted successfully.");
            });
        });
    }

    // GET route, (Run SQL Query)
    // Requirement: Accept SQL from client, execute safely.
    else if (req.method === "GET" && parsedUrl.pathname === "/query") {

        // Get the custom SQL query from the URL parameter
        // e.g. /query?sql=SELECT * FROM patient
        const userQuery = parsedUrl.query.sql;

        // If no SQL query is provided, return an error
        if (!userQuery) {
            res.writeHead(400);
            return res.end("No SQL query provided");
        }

        // USE READ-ONLY CONNECTION
        // If the user sent "DELETE FROM patient", this connection will reject it
        // because 'readonly_user' only has SELECT privileges.
        readOnlyConn.query(userQuery, (err, results) => {
            if (err) {
                // Send the DB error back to client (e.g., "DELETE command denied")
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ error: err.message }));
            }

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(results));
        });
    } else { // If the route is not recognized, return 404 Not Found
        res.writeHead(404);
        res.end("Not Found");
    }
});

// Start the server and listen on the specified port
server.listen(portNumber, () => {
    console.log("Server running on port:" + portNumber);
});