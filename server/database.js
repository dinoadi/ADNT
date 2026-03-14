const { Sequelize, DataTypes } = require('sequelize');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Use Supabase/PostgreSQL if DATABASE_URL is provided, else fallback to SQLite
const isPostgres = !!process.env.DATABASE_URL;

const sequelize = isPostgres 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false // Required for some hosted DBs like Supabase/Render
        }
      },
      logging: false
    })
  : new Sequelize({
      dialect: 'sqlite',
      storage: './database.sqlite',
      logging: false
    });

const Customer = sequelize.define('Customer', {
  no_rek: {
    type: DataTypes.STRING,
    unique: true,
    primaryKey: true
  },
  nama: {
    type: DataTypes.STRING
  },
  no_cif: {
    type: DataTypes.STRING
  },
  saldo_awal: { // From Excel SALDO_AKHIR (Initial)
    type: DataTypes.FLOAT
  },
  saldo_akhir: { // Current calculated balance
    type: DataTypes.FLOAT
  },
  tagihan_pokok: {
    type: DataTypes.FLOAT
  },
  tagihan_bunga: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  tunggakan_pokok: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  tunggakan_bunga: {
    type: DataTypes.FLOAT,
    defaultValue: 0
  },
  kolek: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  tanggal_jt: {
    type: DataTypes.STRING // YYYY-MM-DD
  },
  status_pinjaman: { // Excel STATUS
    type: DataTypes.STRING
  },
  payment_status: {
    type: DataTypes.ENUM('BELUM BAYAR', 'DONE', 'POTONG MANUAL'),
    defaultValue: 'BELUM BAYAR'
  },
  no_hp: {
    type: DataTypes.STRING,
    defaultValue: ''
  }
});

const initDb = async () => {
  await sequelize.sync({ alter: true });
  
  try {
    const count = await Customer.count();
    if (count === 0) {
      const dataPath = path.join(__dirname, 'data.json');
    if (fs.existsSync(dataPath)) {
      const rawData = fs.readFileSync(dataPath);
      const jsonData = JSON.parse(rawData);
      
      const customers = jsonData.map(row => ({
        no_rek: row.NO_REK,
        nama: row.NM_SINGKAT ? row.NM_SINGKAT.trim() : '',
        no_cif: String(row.NO_CIF),
        saldo_awal: row.SALDO_AKHIR,
        saldo_akhir: row.SALDO_AKHIR,
        tagihan_pokok: row.TAGIHAN_POKOK,
        tagihan_bunga: row.TAGIHAN_BUNGA || 0,
        tunggakan_pokok: row.TUNGGAKAN_POKOK || 0,
        tunggakan_bunga: row.TUNGGAKAN_BUNGA || 0,
        kolek: row.KOLEK || 1,
        tanggal_jt: row.TANGGAL_JT ? row.TANGGAL_JT.split('T')[0] : null, // Handle if it has T time
        status_pinjaman: row.STATUS,
        payment_status: 'BELUM BAYAR',
        no_hp: '' 
      }));

      await Customer.bulkCreate(customers);
      console.log(`Seeded ${customers.length} customers.`);
    }
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
};

module.exports = { sequelize, Customer, initDb };
