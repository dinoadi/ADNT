import React, { useState, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Phone, Search, Filter, Check, X, 
  AlertCircle, Edit2, Plus, Upload, Download, Trash2, 
  ChevronDown, ChevronUp, Save, RefreshCw, MoreVertical,
  User, CreditCard, Calendar, Info
} from 'lucide-react';
import { read, utils } from 'xlsx';
import { supabase } from '../supabase';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');

const CustomerTable = ({ customers, onStatusUpdate, selectedDate, fetchCustomers, isCompact = false }: any) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [kolekFilter, setKolekFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('nama');
  const [sortOrder, setSortOrder] = useState('asc');
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [importPreview, setImportPreview] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    no_rek: '',
    no_cif: '',
    nama: '',
    no_hp: '',
    tanggal_jt: '',
    tagihan_pokok: 0,
    tagihan_bunga: 0,
    saldo_awal: 0,
    saldo_akhir: 0,
    payment_status: 'BELUM BAYAR',
    kolek: 1
  });

  const filteredCustomers = (customers || []).filter((c: any) => {
    const matchesSearch = (c?.nama || '').toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (c?.no_rek || '').includes(searchTerm);
    const matchesStatus = statusFilter === 'ALL' || c?.payment_status === statusFilter;
    const matchesKolek = kolekFilter === 'ALL' || String(c?.kolek || 1) === kolekFilter;
    return matchesSearch && matchesStatus && matchesKolek;
  }).sort((a: any, b: any) => {
    const factor = sortOrder === 'asc' ? 1 : -1;
    if (sortBy === 'nama') return a.nama.localeCompare(b.nama) * factor;
    if (sortBy === 'tanggal_jt') return a.tanggal_jt.localeCompare(b.tanggal_jt) * factor;
    return 0;
  });

  const computeAmount = (c: any) => (Number(c.tagihan_pokok) || 0) + (Number(c.tagihan_bunga) || 0);

  const handleImportClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    if (supabase) {
      try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${new Date().getTime()}.${fileExt}`;
        await supabase.storage.from('excel-uploads').upload(`uploads/${fileName}`, file);
      } catch (err) { console.error('Upload failed', err); }
    }

    const reader = new FileReader();
    reader.onload = (evt) => {
      try {
        const wb = read(evt.target?.result, { type: 'binary' });
        const data = utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
        setImportPreview(data);
        setIsPreviewOpen(true);
      } catch (err) { alert('Gagal membaca Excel'); }
      finally { setIsUploading(false); }
    };
    reader.readAsBinaryString(file);
  };

  const confirmImport = async () => {
    try {
      await axios.post(`${API_URL}/api/customers/bulk`, importPreview);
      alert('Data berhasil diimport');
      setIsPreviewOpen(false);
      fetchCustomers();
    } catch (err) { alert('Gagal menyimpan data'); }
  };

  const handleStatusChange = async (c: any, status: string) => {
    if (window.confirm(`Ubah status ${c.nama} menjadi ${status}?`)) {
      await onStatusUpdate(c.no_rek, status);
    }
  };

  const handleDelete = async (c: any) => {
    if (window.confirm(`Hapus nasabah ${c.nama}?`)) {
      await axios.delete(`${API_URL}/api/customers/${c.no_rek}`);
      fetchCustomers();
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-white/50 p-4 rounded-3xl border border-slate-100 backdrop-blur-sm">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" placeholder="Cari nama atau no rekening..." 
            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-medium text-sm"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2 w-full md:w-auto">
          <select 
            className="px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 outline-none focus:ring-4 focus:ring-indigo-500/10"
            value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="ALL">Semua Status</option>
            <option value="BELUM BAYAR">Belum Bayar</option>
            <option value="DONE">Sudah Bayar</option>
          </select>

          <button 
            onClick={handleImportClick} disabled={isUploading}
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
          >
            {isUploading ? <RefreshCw className="animate-spin" size={18} /> : <Plus size={18} />}
            Import Data
          </button>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".xlsx,.xls" />
        </div>
      </div>

      {/* Modern Card List */}
      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredCustomers.map((c: any) => (
            <motion.div 
              layout key={c.no_rek}
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-center gap-6">
                {/* Profile Section */}
                <div className="flex items-center gap-4 flex-1">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-colors">
                    <User size={28} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-black text-slate-800 truncate text-lg">{c.nama}</h4>
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest uppercase ${c.kolek === 1 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                        KOL {c.kolek}
                      </span>
                    </div>
                    <p className="text-xs font-bold text-slate-400 flex items-center gap-2 uppercase tracking-tighter">
                      <CreditCard size={12} /> {c.no_rek} • <Phone size={12} /> {c.no_hp || '-'}
                    </p>
                  </div>
                </div>

                {/* Amount Section */}
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end px-6 md:border-x border-slate-100">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest md:mb-1">Total Tagihan</span>
                  <span className="text-xl font-black text-slate-900 tracking-tight">Rp {computeAmount(c).toLocaleString()}</span>
                </div>

                {/* Actions Section */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1 md:flex-none">
                    <select 
                      className={`w-full md:w-40 pl-4 pr-10 py-3 rounded-2xl text-xs font-black appearance-none cursor-pointer border-none shadow-inner transition-all ${c.payment_status === 'DONE' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}
                      value={c.payment_status} onChange={(e) => handleStatusChange(c, e.target.value)}
                    >
                      <option value="BELUM BAYAR">BELUM BAYAR</option>
                      <option value="DONE">SUDAH BAYAR</option>
                      <option value="POTONG MANUAL">POTONG MANUAL</option>
                    </select>
                    <ChevronDown size={14} className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40" />
                  </div>
                  
                  <button onClick={() => handleDelete(c)} className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-20 bg-white/50 rounded-[3rem] border-4 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
              <Info size={40} />
            </div>
            <h3 className="text-xl font-black text-slate-800">No records found</h3>
            <p className="text-slate-400 font-bold text-sm">Try adjusting your filters or search term</p>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <AnimatePresence>
        {isPreviewOpen && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsPreviewOpen(false)} />
            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="relative bg-white rounded-[2.5rem] w-full max-w-4xl overflow-hidden shadow-2xl">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h3 className="text-2xl font-black text-slate-800">Preview Import</h3>
                <button onClick={() => setIsPreviewOpen(false)} className="p-2 hover:bg-slate-100 rounded-full"><X size={24} /></button>
              </div>
              <div className="p-8 max-h-[60vh] overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
                    <tr>
                      <th className="pb-4">Nasabah</th>
                      <th className="pb-4">Tagihan</th>
                      <th className="pb-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {importPreview.map((row, i) => (
                      <tr key={i} className="text-sm">
                        <td className="py-4 font-bold text-slate-700">{row.nama}</td>
                        <td className="py-4 font-black">Rp {((row.tagihan_pokok || 0) + (row.tagihan_bunga || 0)).toLocaleString()}</td>
                        <td className="py-4 text-right"><Check className="ml-auto text-emerald-500" size={18} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-8 bg-slate-50 flex justify-end gap-4">
                <button onClick={() => setIsPreviewOpen(false)} className="px-8 py-4 rounded-2xl font-black text-slate-500 hover:text-slate-800">Batal</button>
                <button onClick={confirmImport} className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black shadow-xl shadow-indigo-200">Simpan {importPreview.length} Data</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomerTable;
