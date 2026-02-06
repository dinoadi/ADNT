const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.all("SELECT no_rek, nama, tagihan_pokok, tagihan_bunga, payment_status FROM customers", [], (err, rows) => {
    if (err) throw err;
    
    let totalTarget = 0;
    let totalCollected = 0;
    
    rows.forEach(row => {
        const tagihan = (Number(row.tagihan_pokok) || 0) + (Number(row.tagihan_bunga) || 0);
        totalTarget += tagihan;
        
        if (['DONE', 'POTONG MANUAL', 'SUDAH BAYAR', 'LUNAS'].includes(row.payment_status)) {
            totalCollected += tagihan;
        }
    });
    
    console.log(`Total Target: ${totalTarget.toLocaleString()}`);
    console.log(`Total Collected: ${totalCollected.toLocaleString()}`);
    console.log(`Repayment Rate: ${(totalTarget > 0 ? (totalCollected / totalTarget) * 100 : 0).toFixed(2)}%`);
});
