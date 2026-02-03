const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');
const cors = require('cors');
const path = require('path');
const { sequelize, Customer, initDb } = require('./database');

const app = express();
const server = http.createServer(app);

// Serve Static Files from Client Build
app.use(express.static(path.join(__dirname, '../client/dist')));
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// WhatsApp Client
const waClient = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: true,
    args: ['--no-sandbox']
  }
});

let qrCodeData = null;
let isWaReady = false;

waClient.on('qr', (qr) => {
  qrCodeData = qr;
  isWaReady = false;
  io.emit('wa_qr', qr);
  console.log('QR Code received');
});

waClient.on('ready', () => {
  isWaReady = true;
  qrCodeData = null;
  io.emit('wa_ready', true);
  console.log('WhatsApp Client is ready!');
});

waClient.on('authenticated', () => {
    console.log('WhatsApp Authenticated');
});

waClient.on('disconnected', async (reason) => {
    console.log('WhatsApp was disconnected', reason);
    isWaReady = false;
    qrCodeData = null;
    io.emit('wa_ready', false); // Notify client
    
    // Destroy and re-initialize to allow new login
    try {
        await waClient.destroy();
    } catch (error) {
        console.error('Error destroying client:', error);
    }
    waClient.initialize();
});

waClient.initialize();

// API Endpoints

// Logout/Disconnect WhatsApp
app.post('/api/wa/logout', async (req, res) => {
    try {
        if (isWaReady) {
            await waClient.logout();
        } else {
             // If not ready (e.g. stuck or just QR visible), just reset
             await waClient.destroy();
             waClient.initialize();
        }
        isWaReady = false;
        qrCodeData = null;
        res.json({ success: true });
    } catch (error) {
        // If logout fails (e.g. already disconnected), force reset
        try {
            await waClient.destroy();
            waClient.initialize();
            isWaReady = false;
            qrCodeData = null;
            res.json({ success: true });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    }
});


// Login (Simple Mock)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demo
  if (username === 'admin' && password === 'admin') {
    res.json({ success: true, token: 'demo-token' });
  } else {
    res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
});

// Get Customers
app.get('/api/customers', async (req, res) => {
  try {
    const customers = await Customer.findAll();
    res.json(customers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Customer Payment Status
app.post('/api/customers/:no_rek/payment', async (req, res) => {
  const { no_rek } = req.params;
  const { status } = req.body; // 'DONE', 'POTONG MANUAL', 'BELUM BAYAR'
  
  try {
    const customer = await Customer.findByPk(no_rek);
    if (!customer) return res.status(404).json({ error: 'Customer not found' });

    const isPaying = ['DONE', 'POTONG MANUAL'].includes(status);
    const wasPaid = ['DONE', 'POTONG MANUAL'].includes(customer.payment_status);

    let newSaldo = customer.saldo_akhir;
    const effectiveBill = customer.tagihan_pokok || 0;

    if (isPaying && !wasPaid) {
      newSaldo = customer.saldo_awal - effectiveBill;
    } else if (!isPaying && wasPaid) {
      newSaldo = customer.saldo_awal; // Restore to initial
    }

    customer.payment_status = status;
    customer.saldo_akhir = newSaldo;
    await customer.save();

    res.json(customer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Customer Phone
app.post('/api/customers/:no_rek/phone', async (req, res) => {
    const { no_rek } = req.params;
    const { no_hp } = req.body;
    try {
        const customer = await Customer.findByPk(no_rek);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        customer.no_hp = no_hp;
        await customer.save();
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Customer Full Data
app.put('/api/customers/:no_rek', async (req, res) => {
    const { no_rek } = req.params;
    try {
        const customer = await Customer.findByPk(no_rek);
        if (!customer) return res.status(404).json({ error: 'Customer not found' });
        
        await customer.update(req.body);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Add New Customer
app.post('/api/customers', async (req, res) => {
    try {
        const customer = await Customer.create(req.body);
        res.json(customer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk Import Customers
app.post('/api/customers/bulk', async (req, res) => {
    try {
        const customers = req.body; // Array of customers
        if (!Array.isArray(customers)) {
            return res.status(400).json({ error: 'Input must be an array' });
        }
        
        // Use bulkCreate with updateOnDuplicate to handle existing records
        await Customer.bulkCreate(customers, {
            updateOnDuplicate: [
                'nama', 'saldo_awal', 'saldo_akhir', 'tagihan_pokok', 
                'tagihan_bunga', 'tunggakan_pokok', 'tunggakan_bunga', 
                'kolek', 'tanggal_jt', 'status_pinjaman', 'no_hp'
            ]
        });
        
        res.json({ success: true, count: customers.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Bulk Update Kolektibilitas
app.post('/api/customers/bulk-kolek', async (req, res) => {
    try {
        const { no_reks, kolek } = req.body;
        if (!Array.isArray(no_reks) || kolek === undefined) {
            return res.status(400).json({ error: 'Invalid input' });
        }
        
        await Customer.update({ kolek }, {
            where: {
                no_rek: no_reks
            }
        });
        
        res.json({ success: true, count: no_reks.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get WA Status
app.get('/api/wa/status', (req, res) => {
  res.json({ ready: isWaReady, qr: qrCodeData });
});

// Send WA Message
app.post('/api/wa/send', async (req, res) => {
  const { number, message } = req.body;
  if (!isWaReady) return res.status(400).json({ error: 'WhatsApp not ready' });

  try {
    // Format number: remove 0 or +, add 62, append @c.us
    let chatId = number.replace(/[^0-9]/g, '');
    if (chatId.startsWith('0')) chatId = '62' + chatId.slice(1);
    if (!chatId.endsWith('@c.us')) chatId += '@c.us';

    await waClient.sendMessage(chatId, message);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Catch-all route for SPA
app.get(/(.*)/, (req, res) => {
    // Check if request is for API, if so, return 404
    if (req.path.startsWith('/api')) {
        return res.status(404).json({ error: 'API endpoint not found' });
    }
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = 3001;
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await initDb();
});
