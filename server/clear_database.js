const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("DELETE FROM customers", (err) => {
        if (err) {
            console.error("Error clearing customers:", err);
            return;
        }
        console.log("All customer data has been cleared.");
        
        // Reset sequence if needed (optional for SQLite)
        db.run("DELETE FROM sqlite_sequence WHERE name='customers'", (err) => {
             if (!err) console.log("Auto-increment sequence reset.");
        });
    });

    db.get("SELECT COUNT(*) as count FROM customers", (err, row) => {
        if (err) console.error(err);
        else console.log(`Current customer count: ${row.count}`);
    });
});
