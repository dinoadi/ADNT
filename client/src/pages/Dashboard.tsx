import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import { QRCodeSVG } from 'qrcode.react';
import CustomerTable from '../components/CustomerTable';
import CalendarView from '../components/CalendarView';
import { 
  Users, CheckCircle, XCircle, Activity, Smartphone, LogOut, 
  Calendar, LayoutDashboard, QrCode, RefreshCw, ChevronRight,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');
const socket = io(API_URL);

const Dashboard = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [waReady, setWaReady] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'calendar' | 'whatsapp'
  const navigate = useNavigate();
  const [loadingQr, setLoadingQr] = useState(false);
  const [showQrScanner, setShowQrScanner] = useState(false);

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));

  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/customers`);
      setCustomers(res.data);
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchCustomers();
    
    socket.on('wa_qr', (qr) => {
      setLoadingQr(true);
      // Artificial delay for smoother transition
      setTimeout(() => {
        setQrCode(qr);
        setWaReady(false);
        setLoadingQr(false);
      }, 800);
    });

    socket.on('wa_ready', () => {
      setWaReady(true);
      setQrCode('');
    });

    axios.get(`${API_URL}/api/wa/status`).then(res => {
      if (res.data.ready) setWaReady(true);
      else if (res.data.qr) setQrCode(res.data.qr);
    });

    return () => {
      socket.off('wa_qr');
      socket.off('wa_ready');
    };
  }, []);

  const handleStatusUpdate = async (no_rek: string, newStatus: string) => {
    try {
      const res = await axios.post(`${API_URL}/api/customers/${no_rek}/payment`, { status: newStatus });
      setCustomers(prev => prev.map(c => c.no_rek === no_rek ? res.data : c));
    } catch (error) {
      console.error('Update failed:', error);
      alert('Failed to update status');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  const handleDisconnect = async () => {
    if (window.confirm('Apakah Anda yakin ingin memutuskan koneksi WhatsApp?')) {
       try {
           await axios.post(`${API_URL}/api/wa/logout`);
           setWaReady(false);
           setQrCode('');
           setShowQrScanner(false);
           alert('Koneksi WhatsApp diputus. Silakan scan ulang jika ingin menghubungkan kembali.');
       } catch (error) {
           console.error('Logout failed', error);
           // Force client side reset even if server fails
           setWaReady(false);
           setQrCode('');
           setShowQrScanner(false);
       }
    }
  };

  // Stats Logic
  const totalCustomers = customers.length;
  const doneCustomers = customers.filter(c => ['DONE', 'POTONG MANUAL'].includes(c.payment_status)).length;
  const pendingCustomers = customers.filter(c => c.payment_status === 'BELUM BAYAR').length;
  
  const today = fmt(new Date());
  const isDue = (c: any, dateStr: string) => {
    if (!c.tanggal_jt) return false;
    const baseDay = parseInt(c.tanggal_jt.slice(-2), 10);
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    return d.getDate() === baseDay;
  };
  const dueToday = customers.filter(c => isDue(c, today));

  const totalOutstanding = customers.reduce((sum, c) => sum + (Number(c.saldo_akhir) || 0), 0);
  const nplOutstanding = customers
      .filter(c => (Number(c.kolek) || 1) > 2)
      .reduce((sum, c) => sum + (Number(c.saldo_akhir) || 0), 0);
  const nplRatio = totalOutstanding > 0 ? (nplOutstanding / totalOutstanding) * 100 : 0;

  const colorMap: any = {
    indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600', border: 'border-indigo-100', shadow: 'shadow-indigo-500/20' },
    emerald: { bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100', shadow: 'shadow-emerald-500/20' },
    rose: { bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-100', shadow: 'shadow-rose-500/20' },
    amber: { bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100', shadow: 'shadow-amber-500/20' },
    red: { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-100', shadow: 'shadow-red-500/20' }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, subValue, subLabel, gradient }: any) => {
    const colors = colorMap[colorClass] || colorMap.indigo;
    
    return (
    <div className={`relative p-6 rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.1)] hover:-translate-y-1 overflow-hidden group bg-white border border-slate-100`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transition-transform group-hover:scale-110`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${colors.shadow}`}>
            <Icon size={24} className="text-white" />
          </div>
          {subValue && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${colors.bg} ${colors.text} border ${colors.border} flex items-center gap-1`}>
              {subValue} {subLabel}
            </span>
          )}
        </div>
        <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  )};

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex text-slate-800">
        {/* Modern Dark Sidebar */}
        <aside className="w-72 bg-[#0F172A] hidden md:flex flex-col fixed h-full z-20 shadow-2xl text-slate-300">
            <div className="p-8 pb-4">
                <div className="flex items-center gap-3 mb-10">
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 text-white font-bold text-xl">
                    A
                  </div>
                  <div>
                    <h1 className="text-xl font-extrabold text-white tracking-tight">ADNT</h1>
                    <p className="text-xs text-slate-400 font-medium">Automated Due Notice Tool</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
                <nav className="space-y-2">
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white'} /> 
                        <span className="font-medium">Dashboard</span>
                        {activeTab === 'dashboard' && <ChevronRight size={16} className="ml-auto opacity-80" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('calendar')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <Calendar size={20} className={activeTab === 'calendar' ? 'text-white' : 'text-slate-400 group-hover:text-white'} /> 
                        <span className="font-medium">Kalender</span>
                        {activeTab === 'calendar' && <ChevronRight size={16} className="ml-auto opacity-80" />}
                    </button>
                    <button 
                        onClick={() => setActiveTab('whatsapp')}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 group ${activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        <Smartphone size={20} className={activeTab === 'whatsapp' ? 'text-white' : 'text-slate-400 group-hover:text-white'} /> 
                        <span className="font-medium">WhatsApp Connect</span>
                        <div className={`ml-auto w-2 h-2 rounded-full ${waReady ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'bg-rose-500'}`}></div>
                    </button>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800/50">
                <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium group"
                >
                    <LogOut size={20} className="text-slate-500 group-hover:text-rose-400" /> 
                    <span>Keluar Aplikasi</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-8 bg-[#F1F5F9] min-h-screen">
            {/* Header */}
            <header className="flex justify-between items-center mb-10">
                <div>
                    <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">
                        {activeTab === 'dashboard' ? 'Overview' : activeTab === 'calendar' ? 'Kalender Penagihan' : 'WhatsApp Connection'}
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">
                        {activeTab === 'whatsapp' ? 'Kelola koneksi WhatsApp Gateway' : 'Pantau performa penagihan hari ini'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200 text-sm font-bold text-slate-600 flex items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>
                   <div className="w-12 h-12 bg-white rounded-full border-2 border-white shadow-md flex items-center justify-center overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-sm">
                        AD
                      </div>
                   </div>
                </div>
            </header>

            {activeTab === 'dashboard' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    <StatCard 
                      title="Total Nasabah" 
                      value={totalCustomers} 
                      icon={Users} 
                      colorClass="indigo"
                      gradient="from-indigo-500 to-blue-500"
                    />
                    <StatCard 
                      title="Sudah Bayar" 
                      value={doneCustomers} 
                      icon={CheckCircle} 
                      colorClass="emerald"
                      gradient="from-emerald-500 to-teal-500" 
                      subValue={`${totalCustomers ? ((doneCustomers/totalCustomers)*100).toFixed(0) : 0}%`}
                      subLabel="Rate"
                    />
                    <StatCard 
                      title="Belum Bayar" 
                      value={pendingCustomers} 
                      icon={XCircle} 
                      colorClass="rose"
                      gradient="from-rose-500 to-red-500" 
                    />
                    <StatCard 
                      title="Jatuh Tempo Hari Ini" 
                      value={dueToday.length} 
                      icon={Activity} 
                      colorClass="amber"
                      gradient="from-amber-500 to-orange-500" 
                      subValue="Prioritas"
                      subLabel=""
                    />
                    <StatCard 
                      title="NPL Ratio" 
                      value={`${nplRatio.toFixed(2)}%`} 
                      icon={AlertTriangle} 
                      colorClass="rose"
                      gradient="from-rose-600 to-red-600" 
                      subValue={`Rp ${(nplOutstanding / 1000000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}Jt`}
                      subLabel="Bad Debt"
                    />
                </div>

                {/* Due Today Section */}
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-8">
                  <CustomerTable 
                    customers={customers} 
                    onStatusUpdate={handleStatusUpdate}
                    waReady={waReady}
                    selectedDate={selectedDate}
                    fetchCustomers={fetchCustomers}
                  />
                </div>
              </div>
            )}

            {activeTab === 'calendar' && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8">
                    <CalendarView 
                       customers={customers} 
                       selectedDate={selectedDate} 
                       onDateChange={setSelectedDate} 
                     />
                 </div>

                 {/* List of customers due on selected date */}
                 <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-8">
                     <div className="mb-6">
                         <h3 className="text-lg font-bold text-slate-800">Tagihan Jatuh Tempo: {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                         <p className="text-sm text-slate-500">Daftar nasabah yang harus ditagih pada tanggal ini</p>
                     </div>
                     <CustomerTable 
                       customers={customers.filter(c => isDue(c, selectedDate))} 
                       onStatusUpdate={handleStatusUpdate}
                       waReady={waReady}
                       selectedDate={selectedDate}
                       fetchCustomers={fetchCustomers}
                     />
                 </div>
              </div>
            )}

            {activeTab === 'whatsapp' && (
              <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-100 bg-gradient-to-r from-emerald-50/50 to-white">
                    <div className="flex items-center gap-4">
                      <div className={`p-4 rounded-2xl ${waReady ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-600'}`}>
                        <Smartphone size={32} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Status Koneksi WhatsApp</h3>
                        <p className={`text-sm font-medium mt-1 ${waReady ? 'text-emerald-600' : 'text-slate-500'}`}>
                          {waReady ? 'Terhubung & Siap Mengirim Pesan' : 'Belum Terhubung / Terputus'}
                        </p>
                      </div>
                      <div className="ml-auto">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${waReady ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          <div className={`w-2 h-2 rounded-full ${waReady ? 'bg-emerald-600' : 'bg-rose-600'}`}></div>
                          {waReady ? 'CONNECTED' : 'DISCONNECTED'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-12 flex flex-col items-center justify-center min-h-[400px]">
                    {!waReady ? (
                      !showQrScanner ? (
                         <div className="text-center space-y-6 max-w-md">
                            <div className="w-24 h-24 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-indigo-100 rotate-3">
                               <QrCode size={48} />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-800">Hubungkan WhatsApp</h3>
                            <p className="text-slate-500">
                               Klik tombol di bawah untuk memunculkan QR Code dan mulai menghubungkan perangkat Anda.
                            </p>
                            <button 
                               onClick={() => setShowQrScanner(true)}
                               className="px-8 py-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-600/30 transition-all transform hover:-translate-y-1"
                            >
                               Tampilkan QR Code
                            </button>
                         </div>
                      ) : (
                        <div className="flex flex-col md:flex-row items-center gap-12 w-full animate-in fade-in zoom-in duration-300">
                            <div className="flex-1 space-y-8">
                            <div className="flex items-center gap-4 mb-2">
                                <button onClick={() => setShowQrScanner(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
                                    <ChevronRight className="rotate-180" size={24} />
                                </button>
                                <h4 className="text-2xl font-bold text-slate-800">Scan QR Code</h4>
                            </div>
                            <ol className="space-y-6 text-slate-600">
                                <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">1</span>
                                <div className="pt-1">
                                    <span className="font-bold text-slate-800 block mb-1">Buka WhatsApp</span>
                                    Buka aplikasi WhatsApp di HP Anda
                                </div>
                                </li>
                                <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">2</span>
                                <div className="pt-1">
                                    <span className="font-bold text-slate-800 block mb-1">Buka Menu Perangkat</span>
                                    Ketuk Menu (Android) atau Settings (iPhone)
                                </div>
                                </li>
                                <li className="flex items-start gap-4">
                                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">3</span>
                                <div className="pt-1">
                                    <span className="font-bold text-slate-800 block mb-1">Tautkan Perangkat</span>
                                    Pilih "Linked Devices" lalu "Link a Device"
                                </div>
                                </li>
                            </ol>
                            </div>
                            <div className="flex-shrink-0 relative">
                            <div className="p-6 bg-white rounded-3xl border-2 border-dashed border-indigo-200 shadow-xl shadow-indigo-50 relative">
                                {qrCode ? (
                                    <QRCodeSVG value={qrCode} size={260} level="H" />
                                ) : (
                                    <div className="w-[260px] h-[260px] bg-slate-50 flex flex-col items-center justify-center text-slate-400 gap-4 rounded-xl">
                                    <RefreshCw className="animate-spin text-indigo-400" size={40} />
                                    <span className="text-sm font-medium">Menunggu Server...</span>
                                    </div>
                                )}
                                
                                {/* Loading Overlay when refreshing QR */}
                                {loadingQr && (
                                    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center rounded-xl z-10 transition-all">
                                    <div className="flex flex-col items-center gap-3">
                                        <RefreshCw className="animate-spin text-indigo-600" size={32} />
                                        <span className="text-xs font-bold text-indigo-600">Memperbarui QR...</span>
                                    </div>
                                    </div>
                                )}
                            </div>
                            <p className="text-center text-xs text-slate-400 mt-6 font-medium">QR Code diperbarui otomatis setiap beberapa detik</p>
                            </div>
                        </div>
                      )
                    ) : (
                      <div className="text-center space-y-8 animate-in zoom-in duration-500">
                        <div className="w-32 h-32 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-[0_0_0_12px_rgba(16,185,129,0.1)]">
                          <CheckCircle size={64} />
                        </div>
                        <div>
                            <h3 className="text-3xl font-extrabold text-slate-800 mb-2">WhatsApp Terhubung!</h3>
                            <p className="text-slate-500 max-w-md mx-auto text-lg">
                            Sistem siap mengirim pesan tagihan otomatis ke nasabah.
                            </p>
                        </div>
                        <button 
                          onClick={handleDisconnect}
                          className="px-8 py-4 bg-white border-2 border-rose-100 text-rose-600 font-bold rounded-2xl hover:bg-rose-50 hover:border-rose-200 hover:shadow-lg hover:shadow-rose-500/10 transition-all transform hover:-translate-y-1 flex items-center gap-2 mx-auto"
                        >
                          <LogOut size={20} />
                          Putuskan Koneksi
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
        </main>
    </div>
  );
};

export default Dashboard;