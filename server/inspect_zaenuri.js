const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.get("SELECT * FROM customers WHERE nama LIKE '%ZAENURI%'", [], (err, row) => {
    if (err) throw err;
    console.log("Zaenuri Data:");
    console.log(row);
});
