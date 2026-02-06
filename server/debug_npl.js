const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.all("SELECT no_rek, nama, saldo_akhir, kolek FROM customers LIMIT 20", [], (err, rows) => {
    if (err) {
        throw err;
    }
    console.log("Sample Data:");
    console.table(rows);
    
    // Calculate NPL manually on this sample (or all if we query all)
    db.all("SELECT no_rek, nama, saldo_akhir, kolek, tunggakan_pokok, tunggakan_bunga FROM customers", [], (err, allRows) => {
        let totalOutstanding = 0;
        let nplOutstanding = 0;
        
        console.log("\n--- NPL Candidates (Kolek > 2) ---");
        let nplTunggakan = 0;
        allRows.forEach(row => {
            const saldo = Number(row.saldo_akhir) || 0;
            const tunggakan = Number(row.tunggakan_pokok) || 0;
            
            let k = 1;
            const strKolek = String(row.kolek).toUpperCase();
            const match = strKolek.match(/\d+/);
            if (match) k = parseInt(match[0]);
            
            if (k > 2) {
                nplOutstanding += saldo;
                nplTunggakan += tunggakan;
                console.log(`[${k}] ${row.nama}: Saldo=${saldo.toLocaleString()}, Tunggakan=${tunggakan.toLocaleString()}`);
            } else if (k === 2) {
                console.log(`[${k}] (Potential?) ${row.nama}: Saldo=${saldo.toLocaleString()}`);
            }
            
            // Search for ~12.6M in Kolek 1
            if (k === 1 && Math.abs(saldo - 12682125) < 1000000) {
                 console.log(`[${k}] (Suspicious 12M) ${row.nama}: Saldo=${saldo.toLocaleString()}`);
            }
        });
        
        console.log(`\nNPL Outstanding: ${nplOutstanding.toLocaleString()}`);
        console.log(`NPL Tunggakan Pokok: ${nplTunggakan.toLocaleString()}`);
        
        console.log(`NPL Ratio (Saldo): ${(nplOutstanding / totalOutstanding * 100).toFixed(5)}%`);
        console.log(`NPL Ratio (Tunggakan): ${(nplTunggakan / totalOutstanding * 100).toFixed(5)}%`);
        
        console.log("--- Breakdown by Kolek ---");
        const breakdown = {};
        
        allRows.forEach(row => {
            const saldo = Number(row.saldo_akhir) || 0;
            let k = 1;
            const strKolek = String(row.kolek).toUpperCase();
            const match = strKolek.match(/\d+/);
            if (match) k = parseInt(match[0]);
            
            // Text fallback logic (same as before)
            if (!match) {
                 if (strKolek.includes('KURANG LANCAR') || strKolek.includes('KL')) k = 3;
                else if (strKolek.includes('DIRAGUKAN')) k = 4;
                else if (strKolek.includes('MACET')) k = 5;
                else if (strKolek.includes('DPK') || strKolek.includes('PERHATIAN')) k = 2;
            }

            if (!breakdown[k]) breakdown[k] = { count: 0, outstanding: 0 };
            breakdown[k].count++;
            breakdown[k].outstanding += saldo;
        });
        
        console.table(breakdown);
        
        const npl345 = (breakdown[3]?.outstanding || 0) + (breakdown[4]?.outstanding || 0) + (breakdown[5]?.outstanding || 0);
        const npl2345 = (breakdown[2]?.outstanding || 0) + npl345;
        
        console.log(`NPL (3+4+5): ${(npl345 / totalOutstanding * 100).toFixed(5)}%`);
        console.log(`NPL (2+3+4+5): ${(npl2345 / totalOutstanding * 100).toFixed(5)}%`);
    });
});
