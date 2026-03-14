import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import io from 'socket.io-client';
import CustomerTable from '../components/CustomerTable';
import CalendarView from '../components/CalendarView';
import { 
  Users, CheckCircle, XCircle, Activity, LogOut, 
  Calendar, LayoutDashboard, QrCode, RefreshCw, ChevronRight,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, Menu, X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:3001');
const socket = io(API_URL);

const Dashboard = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard' | 'calendar'
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);

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

  const handleDateSelect = (date: string) => {
      setSelectedDate(date);
      setIsDateModalOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  }

  // Stats Logic
  const totalCustomers = (customers || []).length;
  
  // Payment Status Counts
  const doneCustomers = (customers || []).filter(c => c && ['DONE', 'POTONG MANUAL'].includes(c.payment_status)).length;
  const pendingCustomers = (customers || []).filter(c => c && c.payment_status === 'BELUM BAYAR').length;
  
  // Repayment Rate Logic (Kolektabilitas 1 / Total Outstanding)
  const kol1Outstanding = (customers || [])
    .filter(c => {
      if (!c) return false;
      const strKolek = String(c.kolek || '');
      const match = strKolek.match(/\d+/);
      const k = match ? parseInt(match[0]) : 1; 
      return k === 1;
    })
    .reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);

  const totalOutstanding = (customers || []).reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);
  const repaymentRate = totalOutstanding > 0 ? (kol1Outstanding / totalOutstanding) * 100 : 0;

  const today = fmt(new Date());
  const isDue = (c: any, dateStr: string) => {
    if (!c || !c.tanggal_jt) return false;
    const baseDay = parseInt(c.tanggal_jt.slice(-2), 10);
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    return d.getDate() === baseDay;
  };
  const dueToday = (customers || []).filter(c => isDue(c, today));
  
  // Robust NPL Calculation
  const nplOutstanding = (customers || [])
      .filter(c => {
        if (!c) return false;
        const strKolek = String(c.kolek || '');
        const match = strKolek.match(/\d+/);
        const k = match ? parseInt(match[0]) : 1;
        return k > 2; // Kolek 3, 4, 5
      })
      .reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);
      
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
    <div className={`relative p-6 rounded-2xl shadow-lg shadow-slate-200/50 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 overflow-hidden group bg-white border border-slate-100`}>
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${gradient} opacity-10 rounded-bl-full transition-transform duration-500 group-hover:scale-110 blur-2xl`}></div>
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3.5 rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg ${colors.shadow} ring-4 ring-white`}>
            <Icon size={24} className="text-white" />
          </div>
          {subValue && (
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${colors.bg} ${colors.text} border ${colors.border} flex items-center gap-1`}>
              {subValue} {subLabel}
            </span>
          )}
        </div>
        <h3 className="text-slate-500 text-sm font-bold tracking-wide mb-1 uppercase opacity-80">{title}</h3>
        <p className="text-3xl font-black text-slate-800 tracking-tight">{value}</p>
      </div>
    </div>
  )};

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans flex text-slate-800 selection:bg-indigo-100 selection:text-indigo-700">
        {/* Mobile Overlay */}
        {isMobileMenuOpen && (
            <div 
                className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
                onClick={() => setIsMobileMenuOpen(false)}
            />
        )}

        {/* Modern Dark Sidebar with Glassmorphism */}
        <aside className={`w-72 bg-[#0F172A] flex flex-col fixed h-full z-50 shadow-2xl shadow-indigo-900/20 text-slate-300 transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} border-r border-slate-800`}>
            <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none"></div>
            <div className="p-8 pb-4 relative z-10">
                {/* Mobile Close Button */}
                <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="absolute top-4 right-4 md:hidden p-2 text-slate-400 hover:text-white bg-white/5 rounded-lg backdrop-blur-sm transition-colors"
                >
                    <X size={20} />
                </button>

                <div className="flex items-center gap-3 mb-10">
                  <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 rounded-full"></div>
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/30 text-white font-bold text-2xl relative z-10 border border-white/10">
                        A
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">ADNT</h1>
                    <p className="text-[10px] text-indigo-200/60 font-bold tracking-widest uppercase">Automated Tool</p>
                  </div>
                </div>

                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-2">Menu Utama</div>
                <nav className="space-y-2">
                    <button 
                        onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === 'dashboard' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        {activeTab === 'dashboard' && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
                        <LayoutDashboard size={20} className={activeTab === 'dashboard' ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} /> 
                        <span className="font-medium relative z-10">Dashboard</span>
                        {activeTab === 'dashboard' && <ChevronRight size={16} className="ml-auto opacity-80" />}
                    </button>
                    <button 
                        onClick={() => { setActiveTab('calendar'); setIsMobileMenuOpen(false); }}
                        className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden ${activeTab === 'calendar' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'hover:bg-white/5 hover:text-white'}`}
                    >
                        {activeTab === 'calendar' && <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>}
                        <Calendar size={20} className={activeTab === 'calendar' ? 'text-white' : 'text-slate-400 group-hover:text-white transition-colors'} /> 
                        <span className="font-medium relative z-10">Kalender</span>
                        {activeTab === 'calendar' && <ChevronRight size={16} className="ml-auto opacity-80" />}
                    </button>
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-slate-800/50 bg-[#0F172A]">
                <button 
                    onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    className="flex items-center gap-3 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 w-full px-4 py-3 rounded-xl transition-all duration-200 font-medium group border border-transparent hover:border-rose-500/20"
                >
                    <LogOut size={20} className="text-slate-500 group-hover:text-rose-400 transition-colors" /> 
                    <span>Keluar Aplikasi</span>
                </button>
            </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 md:ml-72 p-4 md:p-8 bg-[#F8FAFC] min-h-screen overflow-x-hidden">
            {/* Header */}
            <header className="flex flex-row justify-between items-center mb-6 md:mb-8 gap-4 sticky top-0 z-30 py-3 md:py-4 bg-[#F8FAFC]/80 backdrop-blur-xl -mx-4 px-4 md:-mx-8 md:px-8 border-b border-slate-200/50 transition-all duration-300">
                <div className="flex items-center gap-3 md:gap-4">
                    <button 
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="md:hidden p-2 rounded-xl bg-white shadow-sm text-slate-600 border border-slate-200"
                    >
                        <Menu size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600">
                            {activeTab === 'dashboard' ? 'Overview' : 'Kalender'}
                        </h2>
                        <p className="text-slate-500 font-medium text-xs md:text-base hidden md:block">
                            Pantau performa penagihan hari ini
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                   <div className="hidden md:flex bg-white px-5 py-2.5 rounded-2xl shadow-sm border border-slate-200/60 text-sm font-bold text-slate-600 items-center gap-3">
                      <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
                      {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                   </div>
                   <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full border-2 md:border-4 border-white shadow-lg shadow-indigo-100 flex items-center justify-center overflow-hidden ring-1 ring-slate-100">
                      <div className="w-full h-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white text-xs md:text-sm">
                        AD
                      </div>
                   </div>
                </div>
            </header>

            {activeTab === 'dashboard' && (
              <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Stats Grid - Mobile Scroll / Desktop Grid */}
                <div className="flex md:grid md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatCard 
                          title="Total Nasabah" 
                          value={totalCustomers} 
                          icon={Users} 
                          colorClass="indigo"
                          gradient="from-indigo-500 to-blue-500"
                        />
                    </div>
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatCard 
                          title="Sudah Bayar" 
                          value={doneCustomers} 
                          icon={CheckCircle} 
                          colorClass="emerald"
                          gradient="from-emerald-500 to-teal-500" 
                          subValue={`${repaymentRate.toFixed(1)}%`}
                          subLabel="Repayment Rate"
                        />
                    </div>
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatCard 
                          title="Belum Bayar" 
                          value={pendingCustomers} 
                          icon={XCircle} 
                          colorClass="rose"
                          gradient="from-rose-500 to-red-500" 
                        />
                    </div>
                    <div className="min-w-[85%] md:min-w-0 snap-center">
                        <StatCard 
                          title="Jatuh Tempo" 
                          value={dueToday.length} 
                          icon={Activity} 
                          colorClass="amber"
                          gradient="from-amber-500 to-orange-500" 
                          subValue="Hari Ini"
                          subLabel=""
                        />
                    </div>
                    <div className="min-w-[85%] md:min-w-0 snap-center">
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
                </div>

                {/* Due Today Section */}
                <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-slate-100 p-4 md:p-8">
                  <CustomerTable 
                    customers={customers} 
                    onStatusUpdate={handleStatusUpdate}
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
                       onDateChange={handleDateSelect} 
                     />
                 </div>
              </div>
            )}

            {/* Calendar Date Details Modal */}
            {isDateModalOpen && activeTab === 'calendar' && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col relative">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white z-10 sticky top-0">
                             <div>
                                 <h3 className="text-xl font-bold text-slate-800">Tagihan: {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</h3>
                                 <p className="text-sm text-slate-500">Daftar nasabah yang harus ditagih</p>
                             </div>
                             <button onClick={() => setIsDateModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                                <X size={24} className="text-slate-400 hover:text-slate-600" />
                            </button>
                        </div>
                        
                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-4 bg-[#F8FAFC]">
                             <CustomerTable 
                               customers={customers.filter(c => isDue(c, selectedDate))} 
                               onStatusUpdate={handleStatusUpdate}
                               selectedDate={selectedDate}
                               fetchCustomers={fetchCustomers}
                               isCompact={true}
                             />
                        </div>
                    </div>
                </div>
            )}
        </main>
    </div>
  );
};

export default Dashboard;