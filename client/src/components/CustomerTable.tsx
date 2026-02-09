import React, { useState, useRef } from 'react';
import axios from 'axios';
import { 
  MessageCircle, Phone, Search, Filter, Check, X, 
  AlertCircle, Edit2, Plus, Upload, Download, Trash2, 
  ChevronDown, ChevronUp, Save
} from 'lucide-react';
import { read, utils } from 'xlsx';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');

const CustomerTable = ({ customers, onStatusUpdate, waReady, selectedDate, fetchCustomers, isCompact = false }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kolekFilter, setKolekFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('default');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkKolek, setBulkKolek] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formData, setFormData] = useState({
    no_rek: '',
    no_cif: '',
    nama: '',
    no_hp: '',
    tagihan_pokok: 0,
    tagihan_bunga: 0,
    tunggakan_pokok: 0,
    tunggakan_bunga: 0,
    tanggal_jt: '',
    saldo_awal: 0,
    saldo_akhir: 0,
    payment_status: 'BELUM BAYAR',
    kolek: 1
  });

  const [importPreview, setImportPreview] = useState<any[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const filteredCustomers = customers.filter((c: any) => {
    const matchesSearch = c.nama.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.no_rek.includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || c.payment_status === statusFilter;
    const matchesKolek = kolekFilter === 'ALL' || String(c.kolek || 1) === kolekFilter;
    return matchesSearch && matchesStatus && matchesKolek;
  }).sort((a: any, b: any) => {
    if (sortBy === 'date_day') {
        const getDay = (dateStr: string) => {
           if (!dateStr) return 99;
           const parts = dateStr.split('-');
           if (parts.length === 3) return parseInt(parts[2]);
           return new Date(dateStr).getDate();
        };
        return getDay(a.tanggal_jt) - getDay(b.tanggal_jt);
    }
    return 0;
  });

  // Bulk Selection Handlers
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setSelectedIds(filteredCustomers.map((c: any) => c.no_rek));
      } else {
          setSelectedIds([]);
      }
  };

  const handleSelectOne = (no_rek: string) => {
      setSelectedIds(prev => 
          prev.includes(no_rek) 
            ? prev.filter(id => id !== no_rek)
            : [...prev, no_rek]
      );
  };

  const handleBulkUpdateKolek = async () => {
      if (selectedIds.length === 0) return;
      if (!window.confirm(`Ubah kolektibilitas ${selectedIds.length} nasabah menjadi Kol ${bulkKolek}?`)) return;

      try {
          await axios.post(`${API_URL}/api/customers/bulk-kolek`, {
              no_reks: selectedIds,
              kolek: bulkKolek
          });
          alert('Berhasil memperbarui data kolektibilitas!');
          setSelectedIds([]);
          fetchCustomers();
      } catch (error) {
          console.error('Bulk update failed:', error);
          alert('Gagal melakukan update massal.');
      }
  };

  const handleBulkDelete = async () => {
      if (selectedIds.length === 0) return;
      if (!window.confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} data nasabah yang dipilih? Tindakan ini tidak dapat dibatalkan.`)) return;

      try {
          await axios.post(`${API_URL}/api/customers/bulk-delete`, {
              no_reks: selectedIds
          });
          alert('Berhasil menghapus data terpilih!');
          setSelectedIds([]);
          fetchCustomers();
      } catch (error) {
          console.error('Bulk delete failed:', error);
          alert('Gagal melakukan hapus massal.');
      }
  };

  const handleDelete = async (customer: any) => {
      if (!window.confirm(`Apakah Anda yakin ingin menghapus data nasabah ${customer.nama} (${customer.no_rek})?`)) return;

      try {
          await axios.delete(`${API_URL}/api/customers/${customer.no_rek}`);
          alert('Data nasabah berhasil dihapus');
          fetchCustomers();
      } catch (error) {
          console.error('Delete failed:', error);
          alert('Gagal menghapus data nasabah');
      }
  };

  const computeAmount = (c: any, dateStr?: string) => {
    const jt = c.tanggal_jt ? new Date(c.tanggal_jt).getDate() : null;
    const selectedDay = dateStr ? new Date(dateStr).getDate() : null;
    if (c.kolek && c.kolek > 1) {
      let amt = (c.tunggakan_pokok || 0) + (c.tunggakan_bunga || 0);
      if (jt != null && selectedDay != null && selectedDay >= jt) {
        amt += (c.tagihan_pokok || 0);
      }
      return amt;
    }
    return c.tagihan_pokok || 0;
  };

  const sendWhatsApp = async (customer: any) => {
    if (!waReady) {
      alert('WhatsApp belum terkoneksi! Scan QR Code terlebih dahulu.');
      return;
    }
    const bill = computeAmount(customer, selectedDate).toLocaleString();
    const message = `Yth. Bpk/Ibu ${customer.nama}, Tagihan Anda sebesar Rp ${bill} jatuh tempo pada ${customer.tanggal_jt}. Mohon segera melakukan pembayaran. Terima kasih.`;
    
    try {
      let number = customer.no_hp.replace(/\D/g, '');
      if (number.startsWith('0')) number = '62' + number.substring(1);
      
      await axios.post(`${API_URL}/api/wa/send`, {
        number: number,
        message: message
      });
      alert(`Pesan terkirim ke ${customer.nama}`);
    } catch (error) {
      console.error('Failed to send WA:', error);
      alert('Gagal mengirim pesan WhatsApp');
    }
  };

  const handleStatusChange = (customer: any, newStatus: string) => {
      const confirmMessage = `Konfirmasi Perubahan Status:\n\nNasabah: ${customer.nama}\nStatus Baru: ${newStatus}\n\nApakah Anda yakin ingin mengubah status ini?`;
      if (window.confirm(confirmMessage)) {
          onStatusUpdate(customer.no_rek, newStatus);
      }
  };

  // --- Modal & Form Handlers ---

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({
      no_rek: '',
      no_cif: '',
      nama: '',
      no_hp: '',
      tagihan_pokok: 0,
      tagihan_bunga: 0,
      tunggakan_pokok: 0,
      tunggakan_bunga: 0,
      tanggal_jt: new Date().toISOString().split('T')[0],
      saldo_awal: 0,
      saldo_akhir: 0,
      payment_status: 'BELUM BAYAR',
      kolek: 1
    });
    setIsModalOpen(true);
  };

  const openEditModal = (customer: any) => {
    setIsEditMode(true);
    setCurrentCustomer(customer);
    setFormData({
      ...customer,
      tanggal_jt: customer.tanggal_jt || ''
    });
    setIsModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'no_rek' || name === 'no_cif' || name === 'nama' || name === 'no_hp' || name === 'tanggal_jt' || name === 'payment_status' 
        ? value 
        : parseFloat(value) || 0
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`${API_URL}/api/customers/${currentCustomer.no_rek}`, formData);
        alert('Data nasabah berhasil diperbarui');
      } else {
        await axios.post(`${API_URL}/api/customers`, formData);
        alert('Nasabah baru berhasil ditambahkan');
      }
      setIsModalOpen(false);
      fetchCustomers();
    } catch (error) {
      console.error('Submit failed:', error);
      alert('Gagal menyimpan data: ' + (error as any).message);
    }
  };

  // --- Import Handler ---

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = utils.sheet_to_json(ws);

        // Map Excel columns to DB fields if necessary, or assume matching keys
        // Assuming the user provides a template matching our DB or the previous data.json structure
        const mappedData = data.map((row: any) => {
            // Helper to find value case-insensitively and handle variations
            const findVal = (searchTerms: string[], allowPartial: boolean = false) => {
                const rowKeys = Object.keys(row);
                for (const term of searchTerms) {
                    // Exact match (case insensitive) ignoring whitespace
                    const foundKey = rowKeys.find(k => k.trim().toLowerCase() === term.toLowerCase());
                    if (foundKey) return row[foundKey];
                    
                    // Partial match if enabled (key contains term)
                    if (allowPartial) {
                        const partialKey = rowKeys.find(k => k.toLowerCase().includes(term.toLowerCase()));
                        if (partialKey) return row[partialKey];
                    }
                }
                return undefined;
            };

            // Parse kolek specifically to handle "1 - Lancar" etc
            // Use partial match for 'KOLEK' to catch "Status Kolek", "Kolektibilitas", etc.
            let rawKolek = findVal(['KOLEK', 'KOLEKTIBILITAS', 'KOL', 'COL'], true);
            let parsedKolek = 1;
            
            // Log for debugging (will appear in browser console)
            if (rawKolek !== undefined) {
                // console.log('Found Kolek:', rawKolek); 
            }

            if (rawKolek !== undefined && rawKolek !== null) {
                if (typeof rawKolek === 'string') {
                    const match = rawKolek.match(/\d+/);
                    if (match) parsedKolek = parseInt(match[0]);
                } else if (typeof rawKolek === 'number') {
                    parsedKolek = rawKolek;
                }
            }

            // Parse Date
            const rawDate = findVal(['TANGGAL_JT', 'TANGGAL JT', 'TGL_JT', 'JATUH_TEMPO', 'DUE_DATE'], true);
            let parsedDate = null;
            if (rawDate) {
                if (typeof rawDate === 'number') {
                    // Excel serial date
                    // Excel base date is Dec 30 1899 (25569). Unix is Jan 1 1970.
                    // But typically 25567 is used for 1900 system adjustment?
                    // Standard formula: new Date(Math.round((excelDate - 25569)*86400*1000))
                    // Let's use a robust conversion
                    const dateObj = new Date((rawDate - 25569) * 86400 * 1000);
                    parsedDate = dateObj.toISOString().split('T')[0];
                } else if (typeof rawDate === 'string') {
                    // Try parsing string YYYY-MM-DD or other formats
                    const dateObj = new Date(rawDate);
                    if (!isNaN(dateObj.getTime())) {
                        parsedDate = dateObj.toISOString().split('T')[0];
                    }
                }
            }

            // Helper to parse numbers (handling ID/EN formats)
            const parseNumber = (val: any) => {
                if (typeof val === 'number') return val;
                if (typeof val === 'string') {
                    // Remove currency symbols and whitespace
                    let clean = val.replace(/[Rp\sIDR]/g, '');
                    
                    // Handle "1.000.000,00" (ID) vs "1,000,000.00" (EN)
                    // If multiple dots, they are thousands separators -> remove them
                    if ((clean.match(/\./g) || []).length > 1) {
                        clean = clean.replace(/\./g, '');
                        clean = clean.replace(',', '.'); // Comma becomes decimal
                    } 
                    // If multiple commas, they are thousands separators -> remove them
                    else if ((clean.match(/,/g) || []).length > 1) {
                        clean = clean.replace(/,/g, '');
                    }
                    // Single dot and Single comma
                    else if (clean.includes('.') && clean.includes(',')) {
                        if (clean.lastIndexOf(',') > clean.lastIndexOf('.')) {
                            // 1.000,00 -> ID
                            clean = clean.replace(/\./g, '').replace(',', '.');
                        } else {
                            // 1,000.00 -> EN
                            clean = clean.replace(/,/g, '');
                        }
                    }
                    // Ambiguous cases (single dot or single comma)
                    else if (clean.includes('.')) {
                        // "10.000" -> 10000 (ID) or 10 (EN)?
                        // Assume ID format for money if it looks like integer
                        clean = clean.replace(/\./g, '');
                    }
                    else if (clean.includes(',')) {
                        // "10,5" -> 10.5
                        clean = clean.replace(',', '.');
                    }
                    
                    return parseFloat(clean) || 0;
                }
                return 0;
            };

            return {
                no_rek: findVal(['NO_REK', 'REK', 'ACCOUNT', 'LOAN_ID', 'NOMOR_REKENING']) || '',
                nama: findVal(['NM_SINGKAT', 'NAMA', 'NAME', 'CUSTOMER_NAME', 'DEBITUR', 'NAMA_NASABAH']) || '',
                no_cif: String(findVal(['NO_CIF', 'CIF', 'CUSTOMER_ID', 'NOMOR_CIF']) || ''),
                saldo_awal: parseNumber(findVal(['SALDO_AWAL', 'OS_AWAL', 'INITIAL_BALANCE']) || findVal(['SALDO_AKHIR', 'OS_AKHIR', 'BAKI_DEBET', 'OUTSTANDING'])),
                saldo_akhir: parseNumber(findVal(['SALDO_AKHIR', 'OS_AKHIR', 'BAKI_DEBET', 'OUTSTANDING'])),
                tagihan_pokok: parseNumber(findVal(['TAGIHAN_POKOK', 'ANGSURAN_POKOK', 'PRINCIPAL_DUE'])),
                tagihan_bunga: parseNumber(findVal(['TAGIHAN_BUNGA', 'ANGSURAN_BUNGA', 'INTEREST_DUE'])),
                tunggakan_pokok: parseNumber(findVal(['TUNGGAKAN_POKOK', 'POKOK_TUNGGAKAN', 'ARREARS_PRINCIPAL'])),
                tunggakan_bunga: parseNumber(findVal(['TUNGGAKAN_BUNGA', 'BUNGA_TUNGGAKAN', 'ARREARS_INTEREST'])),
                kolek: parsedKolek,
                tanggal_jt: parsedDate,
                status_pinjaman: findVal(['STATUS', 'KET', 'STATUS_REKENING', 'KETERANGAN']) || '',
                payment_status: (() => {
                    const statusVal = String(findVal(['STATUS', 'KET', 'STATUS_REKENING', 'KETERANGAN', 'STATUS_BAYAR', 'PEMBAYARAN']) || '').toUpperCase();
                    if (statusVal.includes('LUNAS') || statusVal.includes('SUDAH') || statusVal.includes('DONE') || statusVal.includes('PAID')) {
                        return 'DONE';
                    }
                    // Also check if saldo_akhir is 0, assume DONE? No, maybe just closed.
                    // Let's stick to text status for now.
                    return 'BELUM BAYAR';
                })(),
                no_hp: String(findVal(['NO_HP', 'HP', 'PHONE', 'MOBILE', 'TELP', 'TELEPON', 'CONTACT', 'NO_TELP']) || '')
            };
        });

        setImportPreview(mappedData);
        setIsPreviewOpen(true);
      } catch (error) {
        console.error('Import failed:', error);
        alert('Gagal membaca file Excel.');
      }
    };
    reader.readAsBinaryString(file);
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const confirmImport = async () => {
    try {
        await axios.post(`${API_URL}/api/customers/bulk`, importPreview);
        alert(`Berhasil mengimpor ${importPreview.length} data nasabah!`);
        setIsPreviewOpen(false);
        fetchCustomers();
    } catch (error) {
        console.error('Import save failed:', error);
        alert('Gagal menyimpan data import.');
    }
  };

  const downloadTemplate = () => {
    // Create a dummy array for template
    const template = [
      {
        NO_REK: "1234567890",
        NO_CIF: "88888",
        NM_SINGKAT: "Contoh Nama",
        NO_HP: "081234567890",
        TAGIHAN_POKOK: 500000,
        TAGIHAN_BUNGA: 50000,
        TUNGGAKAN_POKOK: 0,
        TUNGGAKAN_BUNGA: 0,
        SALDO_AKHIR: 10000000,
        TANGGAL_JT: "2024-02-20",
        KOLEK: 1,
        STATUS: "LANCAR"
      }
    ];
    const ws = utils.json_to_sheet(template);
    const wb = utils.book_new();
    utils.book_append_sheet(wb, ws, "Template");
    // Write to file (trigger download)
    // Since we are in browser, we use writeFile from xlsx
    // But writeFile works in node, in browser we might need writeFileXLSX or similar
    // Actually xlsx.writeFile works in browser too by creating a download link
    import('xlsx').then(xlsx => {
        xlsx.writeFile(wb, "Template_Nasabah_ADNT.xlsx");
    });
  };

    if (isCompact) {
      return (
        <div className="space-y-2">
            {filteredCustomers.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                    Tidak ada data nasabah
                </div>
            ) : (
                filteredCustomers.map((c: any) => {
                    const amount = computeAmount(c, selectedDate).toLocaleString();
                    const isSelected = selectedIds.includes(c.no_rek);
                    const statusColor = (c.kolek || 1) === 1 ? 'bg-emerald-500' :
                                      (c.kolek || 1) === 2 ? 'bg-amber-500' : 'bg-rose-500';
                    const statusBg = (c.kolek || 1) === 1 ? 'bg-emerald-50' :
                                      (c.kolek || 1) === 2 ? 'bg-amber-50' : 'bg-rose-50';

                    return (
                        <div key={c.no_rek} className={`flex items-center p-3 rounded-xl border ${isSelected ? 'border-indigo-200 bg-indigo-50/50' : 'border-slate-100 bg-white'} shadow-sm transition-all hover:shadow-md`}>
                            <div className={`w-1 self-stretch rounded-full ${statusColor} mr-3`}></div>
                            <div className="flex-1 min-w-0 mr-2">
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-slate-800 text-sm truncate pr-2">{c.nama}</h4>
                                    <span className="font-mono text-xs font-bold text-slate-700 whitespace-nowrap">Rp {amount}</span>
                                </div>
                                <div className="flex justify-between items-center mt-0.5">
                                        <span className="text-[10px] text-slate-400 font-mono truncate">{c.no_cif}</span>
                                        <div className="flex items-center gap-1.5">
                                        {waReady && (
                                            <button 
                                                onClick={() => sendWhatsApp(c)}
                                                className="p-1 rounded-full text-emerald-600 hover:bg-emerald-100 transition-colors"
                                                title="Kirim WA"
                                            >
                                                <MessageCircle size={14} />
                                            </button>
                                        )}
                                        <select
                                            className={`text-[10px] font-bold rounded px-1.5 py-0.5 border-none focus:ring-1 cursor-pointer ${
                                                c.payment_status === 'DONE' ? 'bg-emerald-100 text-emerald-700' : 
                                                c.payment_status === 'JANJI BAYAR' ? 'bg-amber-100 text-amber-700' :
                                                'bg-rose-100 text-rose-700'
                                            }`}
                                            value={c.payment_status}
                                            onChange={(e) => handleStatusChange(c, e.target.value)}
                                        >
                                            <option value="BELUM BAYAR">BELUM</option>
                                            <option value="JANJI BAYAR">JANJI</option>
                                            <option value="DONE">LUNAS</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
      );
    }

    return (
      <div>
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h3 className="text-xl font-bold text-slate-800">Daftar Nasabah</h3>
           <p className="text-slate-500 text-sm font-medium">Kelola data nasabah dan status pembayaran</p>
        </div>
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Bulk Action Bar - Only Visible when items selected */}
            {selectedIds.length > 0 && (
                <div className="flex items-center gap-2 mr-2 bg-indigo-50 px-3 py-1.5 rounded-xl border border-indigo-100 animate-in fade-in slide-in-from-top-2">
                    <span className="text-xs font-bold text-indigo-700">{selectedIds.length} Dipilih</span>
                    <div className="h-4 w-px bg-indigo-200 mx-1"></div>
                    <select 
                        className="text-xs font-bold bg-white border-indigo-200 text-indigo-700 rounded-lg py-1 px-2 focus:ring-indigo-500"
                        value={bulkKolek}
                        onChange={(e) => setBulkKolek(Number(e.target.value))}
                    >
                        <option value={1}>Set Kol 1</option>
                        <option value={2}>Set Kol 2</option>
                        <option value={3}>Set Kol 3</option>
                        <option value={4}>Set Kol 4</option>
                        <option value={5}>Set Kol 5</option>
                    </select>
                    <button 
                        onClick={handleBulkUpdateKolek}
                        className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        title="Update Kolektibilitas Terpilih"
                    >
                        <Check size={14} />
                    </button>
                    <div className="h-4 w-px bg-indigo-200 mx-1"></div>
                    <button 
                        onClick={handleBulkDelete}
                        className="p-1.5 bg-rose-100 text-rose-600 rounded-lg hover:bg-rose-200 transition-colors"
                        title="Hapus Data Terpilih"
                    >
                        <Trash2 size={14} />
                    </button>
                </div>
            )}

            <div className="relative flex-1 md:w-48 group">
                <select 
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                    value={kolekFilter}
                    onChange={(e) => setKolekFilter(e.target.value)}
                >
                    <option value="ALL">Semua Kolek</option>
                    <option value="1">Kolek 1 - Lancar</option>
                    <option value="2">Kolek 2 - DPK</option>
                    <option value="3">Kolek 3 - Kurang Lancar</option>
                    <option value="4">Kolek 4 - Diragukan</option>
                    <option value="5">Kolek 5 - Macet</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-slate-500" />
            </div>

            <div className="relative flex-1 md:w-48 group">
                <select 
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium appearance-none cursor-pointer"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                >
                    <option value="default">Urutan Default</option>
                    <option value="date_day">Tgl Jatuh Tempo (1-31)</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 text-slate-500" />
            </div>

            <div className="relative flex-1 md:w-64 group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4 group-focus-within:text-indigo-500 transition-colors" />
                <input
                    type="text"
                    placeholder="Cari Nama / No Rek..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-700 font-medium"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            
            <button 
                onClick={openAddModal}
                className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all"
            >
                <Plus size={16} /> Tambah
            </button>
            
            <div className="flex gap-2">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".xlsx, .xls, .csv"
                />
                <button 
                    onClick={handleImportClick}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    title="Import Excel"
                >
                    <Upload size={16} /> Import
                </button>
                <button 
                    onClick={downloadTemplate}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors"
                    title="Download Template"
                >
                    <Download size={16} />
                </button>
            </div>
        </div>
      </div>

      <div className="space-y-4">
        {/* Select All Checkbox Header (Only visible if there are items) */}
        {filteredCustomers.length > 0 && (
            <div className="flex items-center gap-3 px-5 py-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 mb-2">
                <input 
                    type="checkbox" 
                    className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                    checked={selectedIds.length === filteredCustomers.length && filteredCustomers.length > 0}
                    onChange={handleSelectAll}
                />
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Pilih Semua ({filteredCustomers.length})</span>
            </div>
        )}

        {filteredCustomers.map((c: any) => {
            // Determine status colors
            let statusColor = 'bg-rose-500';
            let statusBg = 'bg-rose-50';
            let statusText = 'text-rose-700';
            
            if (c.payment_status === 'DONE') {
                statusColor = 'bg-emerald-500';
                statusBg = 'bg-emerald-50';
                statusText = 'text-emerald-700';
            } else if (c.payment_status === 'POTONG MANUAL') {
                statusColor = 'bg-amber-500';
                statusBg = 'bg-amber-50';
                statusText = 'text-amber-700';
            }

            const isSelected = selectedIds.includes(c.no_rek);

            return (
            <div key={c.no_rek} className={`bg-white p-5 rounded-2xl shadow-sm border transition-all duration-300 group relative overflow-hidden ${isSelected ? 'border-indigo-400 shadow-md ring-1 ring-indigo-400' : 'border-slate-100 hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-indigo-100'}`}>
                {/* Left Colored Strip */}
                <div className={`absolute top-0 left-0 w-1.5 h-full ${statusColor}`}></div>
                
                {/* Mobile View Layout */}
                <div className="md:hidden w-full space-y-4 pl-3">
                    <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                            <input 
                                type="checkbox" 
                                className="w-5 h-5 mt-1 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                checked={isSelected}
                                onChange={() => handleSelectOne(c.no_rek)}
                            />
                            <div>
                                <h4 className="font-bold text-slate-800 text-lg leading-tight">{c.nama}</h4>
                                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-1.5">
                                    <span className="font-mono bg-slate-50 px-2 py-0.5 rounded border border-slate-100">{c.no_rek}</span>
                                    {c.no_hp && (
                                        <span className="flex items-center gap-1"><Phone size={10} /> {c.no_hp}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <span className={`px-2 py-1 text-[10px] font-extrabold rounded-lg tracking-wide shrink-0 ${
                            (c.kolek || 1) === 1 ? 'bg-emerald-100 text-emerald-600' :
                            (c.kolek || 1) === 2 ? 'bg-amber-100 text-amber-600' :
                            'bg-rose-100 text-rose-600'
                        }`}>
                            KOL {c.kolek || 1}
                        </span>
                    </div>

                    <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Tagihan</p>
                            <p className="font-mono font-bold text-slate-700 text-xl tracking-tight">Rp {computeAmount(c, selectedDate).toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Jatuh Tempo</p>
                             <p className="text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100 inline-block">{c.tanggal_jt}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <div className="relative flex-1">
                             <select 
                                className={`w-full py-3 pl-3 pr-8 rounded-xl text-xs font-bold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 border-none shadow-sm ${statusBg} ${statusText}`}
                                value={c.payment_status}
                                onChange={(e) => handleStatusChange(c, e.target.value)}
                            >
                                <option value="BELUM BAYAR">BELUM BAYAR</option>
                                <option value="DONE">SUDAH BAYAR</option>
                                <option value="POTONG MANUAL">POTONG MANUAL</option>
                            </select>
                            <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 ${statusText}`} />
                        </div>
                        
                        <button 
                            onClick={() => sendWhatsApp(c)}
                            className="p-3 bg-emerald-100 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm"
                        >
                            <MessageCircle size={18} />
                        </button>
                        <button 
                            onClick={() => openEditModal(c)}
                            className="p-3 bg-indigo-100 text-indigo-600 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm"
                        >
                             <Edit2 size={18} />
                        </button>
                    </div>
                </div>

                {/* Desktop View Layout */}
                <div className="hidden md:flex items-center gap-4 pl-2">
                    {/* Checkbox */}
                    <div className="pr-2 border-r border-slate-100 mr-2 flex items-center justify-center">
                        <input 
                            type="checkbox" 
                            className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                            checked={isSelected}
                            onChange={() => handleSelectOne(c.no_rek)}
                        />
                    </div>

                    {/* Customer Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-1.5">
                            <h4 className="font-bold text-slate-800 truncate text-lg">{c.nama}</h4>
                            <span className={`px-2.5 py-1 text-[10px] font-extrabold rounded-lg tracking-wide ${
                                (c.kolek || 1) === 1 ? 'bg-emerald-100 text-emerald-600' :
                                (c.kolek || 1) === 2 ? 'bg-amber-100 text-amber-600' :
                                'bg-rose-100 text-rose-600'
                            }`}>
                                KOL {c.kolek || 1}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
                            <span className="font-mono bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100 text-slate-600" title="No Rekening">{c.no_rek}</span>
                            {c.no_cif && (
                                <span className="font-mono bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 text-indigo-600" title="No CIF">CIF: {c.no_cif}</span>
                            )}
                            <div className="flex items-center gap-1.5">
                                <Phone size={14} className="text-slate-400" /> {c.no_hp || '-'}
                            </div>
                        </div>
                    </div>

                    {/* Amount Info */}
                    <div className="flex flex-col items-end md:items-start min-w-[160px] bg-slate-50/50 p-3 rounded-xl border border-slate-50">
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-0.5">Total Tagihan</span>
                        <span className="font-mono font-bold text-slate-700 text-lg tracking-tight">
                            Rp {computeAmount(c, selectedDate).toLocaleString()}
                        </span>
                        <span className="text-xs text-indigo-500 font-medium mt-0.5">JT: {c.tanggal_jt}</span>
                    </div>

                    {/* Status & Action */}
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <select 
                                className={`pl-4 pr-10 py-2.5 rounded-xl text-xs font-bold appearance-none cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-offset-1 border-none shadow-sm ${statusBg} ${statusText}`}
                                value={c.payment_status}
                                onChange={(e) => handleStatusChange(c, e.target.value)}
                            >
                                <option value="BELUM BAYAR">BELUM BAYAR</option>
                                <option value="DONE">SUDAH BAYAR</option>
                                <option value="POTONG MANUAL">POTONG MANUAL</option>
                            </select>
                            <ChevronDown size={14} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-60 ${statusText}`} />
                        </div>
                        
                        <div className="flex gap-2">
                            <button 
                                onClick={() => sendWhatsApp(c)}
                                className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-emerald-500/30"
                                title="Kirim WhatsApp"
                            >
                                <MessageCircle size={18} />
                            </button>
                            <button 
                                onClick={() => openEditModal(c)}
                                className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-500 hover:text-white transition-all shadow-sm hover:shadow-indigo-500/30"
                                title="Edit Data"
                            >
                                <Edit2 size={18} />
                            </button>
                            <button 
                                onClick={() => handleDelete(c)}
                                className="p-2.5 bg-rose-50 text-rose-600 rounded-xl hover:bg-rose-500 hover:text-white transition-all shadow-sm hover:shadow-rose-500/30"
                                title="Hapus Data"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )})}

        {filteredCustomers.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <Search size={32} />
                </div>
                <h3 className="text-slate-800 font-bold text-lg mb-1">Tidak ada data ditemukan</h3>
                <p className="text-slate-500 text-sm">Coba kata kunci lain atau filter status yang berbeda</p>
            </div>
        )}
      </div>

      {/* Import Preview Modal */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">Preview Data Import</h3>
                        <p className="text-sm text-slate-500">Periksa data sebelum disimpan ke database</p>
                    </div>
                    <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>
                
                <div className="flex-1 overflow-auto p-6">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                            <tr>
                                <th className="px-4 py-3 rounded-tl-lg">No Rek</th>
                                <th className="px-4 py-3">Nama</th>
                                <th className="px-4 py-3">Tagihan</th>
                                <th className="px-4 py-3">Kolektibilitas</th>
                                <th className="px-4 py-3 rounded-tr-lg">Jatuh Tempo</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {importPreview.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                    <td className="px-4 py-3 font-mono text-slate-600">{row.no_rek}</td>
                                    <td className="px-4 py-3 font-medium text-slate-800">{row.nama}</td>
                                    <td className="px-4 py-3 font-mono">Rp {((row.tagihan_pokok || 0) + (row.tagihan_bunga || 0)).toLocaleString()}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            (row.kolek || 1) === 1 ? 'bg-emerald-100 text-emerald-600' :
                                            (row.kolek || 1) === 2 ? 'bg-amber-100 text-amber-600' :
                                            'bg-rose-100 text-rose-600'
                                        }`}>
                                            KOL {row.kolek || 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">{row.tanggal_jt}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                    <button 
                        onClick={() => setIsPreviewOpen(false)}
                        className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                    >
                        Batal
                    </button>
                    <button 
                        onClick={confirmImport}
                        className="px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                    >
                        <Check size={18} />
                        Simpan {importPreview.length} Data
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border border-white/20">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">
                            {isEditMode ? 'Edit Data Nasabah' : 'Tambah Nasabah Baru'}
                        </h3>
                        <p className="text-sm text-slate-500">Pastikan data yang diinput sudah benar</p>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <X size={24} className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>
                <form onSubmit={handleFormSubmit} className="p-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No Rekening</label>
                            <input 
                                name="no_rek"
                                value={formData.no_rek}
                                onChange={handleFormChange}
                                disabled={isEditMode}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all disabled:opacity-60"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No CIF</label>
                            <input 
                                name="no_cif"
                                value={formData.no_cif}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nama Lengkap</label>
                            <input 
                                name="nama"
                                value={formData.nama}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">No HP (WhatsApp)</label>
                            <input 
                                name="no_hp"
                                value={formData.no_hp}
                                onChange={handleFormChange}
                                placeholder="08xxx"
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal Jatuh Tempo</label>
                            <input 
                                type="date"
                                name="tanggal_jt"
                                value={formData.tanggal_jt}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tagihan Pokok</label>
                            <input 
                                type="number"
                                name="tagihan_pokok"
                                value={formData.tagihan_pokok}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Tagihan Bunga</label>
                            <input 
                                type="number"
                                name="tagihan_bunga"
                                value={formData.tagihan_bunga}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                         <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saldo Akhir</label>
                            <input 
                                type="number"
                                name="saldo_akhir"
                                value={formData.saldo_akhir}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Kolektibilitas</label>
                            <select 
                                name="kolek"
                                value={formData.kolek}
                                onChange={handleFormChange}
                                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                            >
                                <option value="1">1 - Lancar</option>
                                <option value="2">2 - Dalam Perhatian Khusus</option>
                                <option value="3">3 - Kurang Lancar</option>
                                <option value="4">4 - Diragukan</option>
                                <option value="5">5 - Macet</option>
                            </select>
                        </div>
                    </div>
                    <div className="pt-4 flex gap-3 justify-end border-t border-gray-100 mt-6">
                        <button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="px-6 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-50 transition-colors"
                        >
                            Batal
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-3 rounded-xl font-bold bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <Save size={18} />
                            {isEditMode ? 'Simpan Perubahan' : 'Tambah Nasabah'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;