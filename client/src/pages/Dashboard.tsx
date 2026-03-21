import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar, Legend
} from 'recharts';
import { 
  Users, CheckCircle, XCircle, Activity, LogOut, 
  Calendar as CalendarIcon, LayoutDashboard, RefreshCw, ChevronRight,
  CreditCard, Wallet, ArrowUpRight, ArrowDownRight, AlertTriangle, 
  Menu, X, TrendingUp, Download, Filter, Search, Plus
} from 'lucide-react';
import CustomerTable from '../components/CustomerTable';
import CalendarView from '../components/CalendarView';
import { supabase } from '../supabase';

const Dashboard = () => {
  const [customers, setCustomers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };
  const [selectedDate, setSelectedDate] = useState(fmt(new Date()));

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching customers:', error);
      } else {
        setCustomers(data || []);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleStatusUpdate = async (no_rek: string, newStatus: string) => {
    try {
      // Get current customer data
      const { data: currentCustomer } = await supabase
        .from('customers')
        .select('*')
        .eq('no_rek', no_rek)
        .single();

      if (!currentCustomer) {
        console.error('Customer not found');
        return;
      }

      const isPaying = ['DONE', 'POTONG MANUAL'].includes(newStatus);
      const wasPaid = ['DONE', 'POTONG MANUAL'].includes(currentCustomer.payment_status);

      let newSaldo = currentCustomer.saldo_akhir;
      const effectiveBill = currentCustomer.tagihan_pokok || 0;

      if (isPaying && !wasPaid) {
        newSaldo = currentCustomer.saldo_akhir - effectiveBill;
      } else if (!isPaying && wasPaid) {
        newSaldo = currentCustomer.saldo_akhir + effectiveBill;
      }

      const { data, error } = await supabase
        .from('customers')
        .update({
          payment_status: newStatus,
          saldo_akhir: newSaldo,
          updated_at: new Date().toISOString()
        })
        .eq('no_rek', no_rek)
        .select()
        .single();

      if (error) {
        console.error('Update failed:', error);
      } else {
        setCustomers(prev => prev.map(c => c.no_rek === no_rek ? data : c));
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Stats Calculations
  const stats = useMemo(() => {
    const list = customers || [];
    const total = list.length;
    const done = list.filter(c => c && ['DONE', 'POTONG MANUAL'].includes(c.payment_status)).length;
    const pending = list.filter(c => c && c.payment_status === 'BELUM BAYAR').length;
    
    const kol1 = list.filter(c => {
      const k = parseInt(String(c?.kolek || '1').match(/\d+/)?.[0] || '1');
      return k === 1;
    }).reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);

    const totalOut = list.reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);
    const repaymentRate = totalOut > 0 ? (kol1 / totalOut) * 100 : 0;

    const npl = list.filter(c => {
      const k = parseInt(String(c?.kolek || '1').match(/\d+/)?.[0] || '1');
      return k > 2;
    }).reduce((sum, c) => sum + (Number(c?.saldo_akhir) || 0), 0);
    const nplRatio = totalOut > 0 ? (npl / totalOut) * 100 : 0;

    return { total, done, pending, repaymentRate, nplRatio, totalOut };
  }, [customers]);

  // Chart Data
  const chartData = useMemo(() => {
    const list = customers || [];
    // Group by Kolektibilitas
    const kolekGroups = [1, 2, 3, 4, 5].map(k => ({
      name: `KOL ${k}`,
      value: list.filter(c => parseInt(String(c?.kolek || '1').match(/\d+/)?.[0] || '1') === k).length
    }));

    // Dummy Trend Data (Since we don't have historical data in DB yet)
    const trendData = [
      { name: 'Mon', rate: 65 }, { name: 'Tue', rate: 70 }, { name: 'Wed', rate: 68 },
      { name: 'Thu', rate: 75 }, { name: 'Fri', rate: 82 }, { name: 'Sat', rate: 85 },
      { name: 'Sun', rate: stats.repaymentRate.toFixed(1) }
    ];

    return { kolekGroups, trendData };
  }, [customers, stats.repaymentRate]);

  const COLORS = ['#6366f1', '#8b5cf6', '#f59e0b', '#ef4444', '#b91c1c'];

  return (
    <div className="min-h-screen bg-[#F1F5F9] font-sans flex text-slate-900 overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={`fixed md:relative w-72 h-screen bg-white border-r border-slate-200 flex flex-col z-50 transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-200">A</div>
            <span className="text-2xl font-black tracking-tighter">ADNT<span className="text-indigo-600">.</span></span>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
              { id: 'calendar', label: 'Kalender', icon: CalendarIcon },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setIsMobileMenuOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === item.id ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-50'}`}
              >
                <item.icon size={20} />
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-rose-500 hover:bg-rose-50 transition-all"
          >
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto relative bg-[#F8FAFC]">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsMobileMenuOpen(true)} className="md:hidden p-2 hover:bg-slate-100 rounded-lg"><Menu size={20} /></button>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              {activeTab === 'dashboard' ? 'Analytics Dashboard' : 'Payment Calendar'}
            </h2>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-full text-xs font-bold text-slate-600">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}
             </div>
             <button onClick={fetchCustomers} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-transform active:rotate-180">
                <RefreshCw size={20} />
             </button>
          </div>
        </header>

        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {activeTab === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Total Nasabah', value: stats.total, icon: Users, color: 'indigo' },
                  { title: 'Sudah Bayar', value: stats.done, icon: CheckCircle, color: 'emerald' },
                  { title: 'Repayment Rate', value: `${stats.repaymentRate.toFixed(1)}%`, icon: TrendingUp, color: 'blue' },
                  { title: 'NPL Ratio', value: `${stats.nplRatio.toFixed(1)}%`, icon: AlertTriangle, color: 'rose' },
                ].map((stat, i) => (
                  <div key={i} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-600`}><stat.icon size={24} /></div>
                    </div>
                    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.title}</h3>
                    <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-8 flex items-center gap-2">
                    <Activity size={20} className="text-indigo-600" />
                    Repayment Trend
                  </h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData.trendData}>
                        <defs>
                          <linearGradient id="colorRate" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12, fontWeight: 600}} />
                        <Tooltip 
                          contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                          itemStyle={{fontWeight: 800, color: '#6366f1'}}
                        />
                        <Area type="monotone" dataKey="rate" stroke="#6366f1" strokeWidth={4} fillOpacity={1} fill="url(#colorRate)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
                  <h3 className="text-lg font-black text-slate-800 mb-8">Kolektibilitas</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={chartData.kolekGroups} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                          {chartData.kolekGroups.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Table Section */}
              <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-black text-slate-800">Daftar Tagihan Hari Ini</h3>
                </div>
                <CustomerTable 
                  customers={customers} 
                  onStatusUpdate={handleStatusUpdate}
                  selectedDate={selectedDate}
                  fetchCustomers={fetchCustomers}
                />
              </div>
            </motion.div>
          )}

          {activeTab === 'calendar' && (
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
              <CalendarView 
                customers={customers} 
                selectedDate={selectedDate} 
                onDateChange={(date: string) => { setSelectedDate(date); setIsDateModalOpen(true); }} 
              />
            </motion.div>
          )}
        </div>

        {/* Date Details Modal */}
        <AnimatePresence>
          {isDateModalOpen && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setIsDateModalOpen(false)} />
              <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <div>
                    <h3 className="text-2xl font-black text-slate-800">Tagihan {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long' })}</h3>
                  </div>
                  <button onClick={() => setIsDateModalOpen(false)} className="p-3 hover:bg-slate-100 rounded-full transition-colors"><X size={24} /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-8">
                  <CustomerTable 
                    customers={customers.filter(c => {
                      if (!c?.tanggal_jt) return false;
                      const day = parseInt(c.tanggal_jt.slice(-2));
                      return new Date(selectedDate).getDate() === day;
                    })} 
                    onStatusUpdate={handleStatusUpdate}
                    selectedDate={selectedDate}
                    fetchCustomers={fetchCustomers}
                    isCompact={true}
                  />
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Dashboard;
