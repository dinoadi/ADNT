import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Zap, BarChart3, Lock, Users, ArrowRight, 
  Smartphone, Bell, Check, TrendingUp, Globe, Cpu 
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1120] font-sans text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[300px] md:w-[800px] h-[300px] md:h-[800px] bg-indigo-600/20 rounded-full blur-[80px] md:blur-[120px] animate-pulse-glow" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[250px] md:w-[600px] h-[250px] md:h-[600px] bg-purple-600/10 rounded-full blur-[60px] md:blur-[100px] animate-pulse-glow" style={{ animationDelay: '2s' }} />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass-nav py-3' : 'bg-transparent py-4 md:py-6'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg md:text-xl shadow-lg shadow-indigo-500/20 border border-white/10">
                A
              </div>
              <span className="text-lg md:text-xl font-bold text-white tracking-tight">ADNT<span className="text-indigo-500">.</span></span>
            </div>
            <div className="flex items-center gap-6">
              <button 
                onClick={() => navigate('/login')}
                className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Masuk
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 md:px-5 md:py-2.5 text-xs md:text-sm font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20 border border-indigo-500/50 hover:-translate-y-0.5"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-24 pb-12 md:pt-32 md:pb-20 lg:pt-48 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs md:text-sm font-medium mb-6 md:mb-8 animate-fade-in backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Sistem Penagihan Otomatis v2.0
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 md:mb-8 leading-[1.1]">
            Automasi Finansial <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Tanpa Batas.</span>
          </h1>
          
          <p className="text-base md:text-xl text-slate-400 mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed font-light px-4">
            Tinggalkan cara manual yang lambat. ADNT menghadirkan ekosistem penagihan cerdas yang terintegrasi langsung dengan WhatsApp Gateway untuk akselerasi arus kas bisnis Anda.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 justify-center items-center px-4">
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto group px-6 py-3.5 md:px-8 md:py-4 bg-white text-slate-900 rounded-xl font-bold text-sm md:text-lg hover:bg-indigo-50 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-xl shadow-white/5"
            >
              Coba Demo Gratis
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-6 py-3.5 md:px-8 md:py-4 glass-card text-white rounded-xl font-bold text-sm md:text-lg hover:bg-white/5 transition-all active:scale-95 flex items-center justify-center gap-2">
              <Globe size={18} className="text-slate-400" />
              Pelajari Fitur
            </button>
          </div>

          {/* Hero Visual - Adaptive */}
          <div className="mt-10 md:mt-20 relative max-w-5xl mx-auto px-4 md:px-0">
            
            {/* Mobile View: Simple, Clear, Focused */}
            <div className="block md:hidden">
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <Smartphone className="text-green-400" size={20} />
                    </div>
                    <div>
                      <div className="text-white font-bold">WhatsApp Gateway</div>
                      <div className="text-green-400 text-xs flex items-center gap-1">
                        <span className="relative flex h-2 w-2">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        Connected
                      </div>
                    </div>
                  </div>
                  <div className="text-slate-400 text-xs">v2.0</div>
                </div>
                
                <div className="space-y-3">
                   <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                          <Bell size={16} className="text-indigo-400" />
                        </div>
                        <div className="text-sm">
                          <div className="text-slate-200 font-medium">Tagihan Terkirim</div>
                          <div className="text-slate-500 text-xs">Baru saja</div>
                        </div>
                      </div>
                      <Check size={16} className="text-green-500" />
                   </div>
                   <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-xl border border-slate-800">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                          <BarChart3 size={16} className="text-blue-400" />
                        </div>
                        <div className="text-sm">
                          <div className="text-slate-200 font-medium">Laporan Harian</div>
                          <div className="text-slate-500 text-xs">Siap diunduh</div>
                        </div>
                      </div>
                      <ArrowRight size={16} className="text-slate-600" />
                   </div>
                </div>
              </div>
            </div>

            {/* Desktop View: Complex 3D Transform */}
            <div className="hidden md:block relative bg-[#0F172A] rounded-2xl border border-slate-700/50 shadow-2xl shadow-indigo-500/10 overflow-hidden transform rotate-x-12 hover:rotate-x-0 transition-transform duration-700 ease-out group perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 pointer-events-none"></div>
              
              {/* Fake UI Header */}
              <div className="h-10 md:h-12 bg-slate-900 border-b border-slate-800 flex items-center px-4 gap-2">
                <div className="flex gap-1.5 md:gap-2">
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/50"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/50"></div>
                  <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/50"></div>
                </div>
                <div className="ml-3 md:ml-4 w-32 md:w-64 h-4 md:h-6 bg-slate-800 rounded-lg opacity-50"></div>
              </div>

              {/* Fake UI Content */}
              <div className="p-4 md:p-8">
                {/* Mobile: Horizontal Scroll, Desktop: Grid */}
                <div className="flex md:grid md:grid-cols-3 gap-4 md:gap-6 overflow-x-auto md:overflow-visible pb-4 md:pb-0 snap-x snap-mandatory hide-scrollbar">
                  
                  {/* Card 1 */}
                  <div className="min-w-[85%] md:min-w-0 col-span-1 md:col-span-2 snap-center">
                    <div className="h-full space-y-4">
                      <div className="h-24 md:h-32 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 md:p-6 flex flex-col justify-between group-hover:bg-slate-800 transition-colors">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                           <BarChart3 className="text-indigo-400 w-5 h-5 md:w-6 md:h-6" />
                        </div>
                        <div className="space-y-2">
                          <div className="w-20 md:w-24 h-3 md:h-4 bg-slate-700 rounded"></div>
                          <div className="w-28 md:w-32 h-6 md:h-8 bg-slate-600 rounded"></div>
                        </div>
                      </div>
                      <div className="h-32 md:h-48 rounded-xl bg-slate-800/30 border border-slate-700/30 p-4 md:p-6">
                         <div className="flex justify-between mb-4 md:mb-6">
                            <div className="w-24 md:w-32 h-5 md:h-6 bg-slate-700 rounded"></div>
                            <div className="w-16 md:w-20 h-5 md:h-6 bg-slate-700 rounded"></div>
                         </div>
                         <div className="space-y-3">
                            <div className="w-full h-8 md:h-12 bg-slate-800 rounded-lg border border-slate-700/50 flex items-center px-3 md:px-4">
                               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-700 mr-3"></div>
                               <div className="w-24 md:w-32 h-3 md:h-4 bg-slate-700 rounded"></div>
                            </div>
                            <div className="w-full h-8 md:h-12 bg-slate-800 rounded-lg border border-slate-700/50 flex items-center px-3 md:px-4">
                               <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-slate-700 mr-3"></div>
                               <div className="w-24 md:w-32 h-3 md:h-4 bg-slate-700 rounded"></div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 (Hidden on mobile originally, now part of scroll) */}
                  <div className="min-w-[85%] md:min-w-0 col-span-1 md:block snap-center">
                     <div className="h-full rounded-xl bg-gradient-to-b from-slate-800/80 to-slate-800/20 border border-slate-700/50 p-6 relative overflow-hidden flex flex-col justify-center items-center">
                        <div className="absolute top-0 right-0 p-6">
                           <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                        </div>
                        <div className="text-center">
                          <div className="w-16 h-16 mx-auto rounded-full bg-green-500/10 flex items-center justify-center mb-4">
                            <Smartphone className="text-green-400" size={32} />
                          </div>
                          <div className="text-slate-300 font-bold">WhatsApp Gateway</div>
                          <div className="text-green-400 text-sm mt-1">Connected</div>
                        </div>
                     </div>
                  </div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bento Grid Features */}
      <div className="py-12 md:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10 md:mb-20 text-center md:text-left">
            <h2 className="text-2xl sm:text-3xl md:text-5xl font-black text-white mb-3 md:mb-6">Ekosistem Digital.</h2>
            <p className="text-slate-400 text-sm md:text-lg max-w-xl mx-auto md:mx-0">Dirancang untuk skalabilitas dan efisiensi. Satu platform untuk seluruh kebutuhan penagihan Anda.</p>
          </div>

          {/* Mobile Feature List - Simple & Readable */}
          <div className="block md:hidden space-y-4 mb-12">
            
            {/* Mobile Feature 1 */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center flex-shrink-0 text-indigo-400">
                <Zap size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Otomatisasi Penuh</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Notifikasi tagihan terkirim otomatis 24/7 tanpa perlu Anda pantau.</p>
              </div>
            </div>

            {/* Mobile Feature 2 */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center flex-shrink-0 text-green-400">
                <Smartphone size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">WhatsApp Gateway</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Terhubung langsung ke WhatsApp pribadi atau bisnis Anda.</p>
              </div>
            </div>

            {/* Mobile Feature 3 */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center flex-shrink-0 text-indigo-400">
                <Lock size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Aman & Terenkripsi</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Data nasabah dilindungi enkripsi AES-256 standar perbankan.</p>
              </div>
            </div>

            {/* Mobile Feature 4 */}
            <div className="flex gap-4 items-start p-4 rounded-2xl bg-slate-800/30 border border-slate-700/30">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center flex-shrink-0 text-blue-400">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">Analitik Harian</h3>
                <p className="text-slate-400 text-sm leading-relaxed">Pantau performa penagihan dan cashflow dari genggaman.</p>
              </div>
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-auto md:auto-rows-[300px] hidden md:grid">
            
            {/* Feature 1 - Large */}
            <div className="col-span-1 md:col-span-2 lg:col-span-2 row-span-1 glass-card rounded-3xl p-5 md:p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
              <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-500/20 transition-all"></div>
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                   <div className="w-12 h-12 rounded-xl bg-indigo-500/20 flex items-center justify-center mb-6 text-indigo-400 border border-indigo-500/30">
                     <Zap size={24} />
                   </div>
                   <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Real-time Automation</h3>
                   <p className="text-slate-400 text-sm md:text-base">Sistem bekerja 24/7 mengirimkan notifikasi tagihan secara otomatis tanpa intervensi manual.</p>
                </div>
                <div className="flex gap-2 mt-4 md:mt-0">
                   <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] md:text-xs text-indigo-300">Cron Jobs</span>
                   <span className="px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[10px] md:text-xs text-indigo-300">Instant Delivery</span>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-span-1 md:col-span-1 glass-card rounded-3xl p-5 md:p-8 relative overflow-hidden hover:bg-white/[0.05] transition-colors">
               <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-green-500/10 to-transparent"></div>
               <div className="relative z-10">
                 <Smartphone className="text-green-400 mb-4 md:mb-6" size={28} />
                 <h3 className="text-lg md:text-xl font-bold text-white mb-2">WA Gateway</h3>
                 <p className="text-slate-400 text-sm">Integrasi langsung ke WhatsApp pribadi atau bisnis.</p>
               </div>
            </div>

            {/* Feature 3 */}
            <div className="col-span-1 md:col-span-1 glass-card rounded-3xl p-5 md:p-8 flex flex-col justify-center items-center text-center hover:bg-white/[0.05] transition-colors">
               <div className="text-4xl md:text-5xl font-black text-white mb-2">99.9%</div>
               <div className="text-slate-400 font-medium text-sm md:text-base">Uptime Guarantee</div>
               <div className="mt-6 w-full h-1 bg-slate-700 rounded-full overflow-hidden">
                 <div className="h-full bg-green-500 w-[99%]"></div>
               </div>
            </div>

             {/* Feature 4 - Wide */}
             <div className="col-span-1 md:col-span-3 lg:col-span-2 glass-card rounded-3xl p-5 md:p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
               <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center h-full">
                  <div className="flex-1 text-center md:text-left">
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-2 md:mb-3">Keamanan Enkripsi</h3>
                    <p className="text-slate-400 mb-4 md:mb-6 text-sm md:text-base">Data nasabah dan transaksi dilindungi dengan protokol keamanan standar industri.</p>
                    <div className="flex justify-center md:justify-start items-center gap-4 text-slate-300 text-xs md:text-sm">
                       <div className="flex items-center gap-2"><Check size={14} className="text-green-400" /> AES-256</div>
                       <div className="flex items-center gap-2"><Check size={14} className="text-green-400" /> Daily Backup</div>
                    </div>
                  </div>
                  <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-slate-800 border-4 border-slate-700 flex items-center justify-center relative shadow-2xl shadow-indigo-500/20 flex-shrink-0">
                     <Lock size={32} className="text-indigo-400" />
                     <div className="absolute inset-0 rounded-full border border-indigo-500/30 animate-ping opacity-20"></div>
                  </div>
               </div>
             </div>

             {/* Feature 5 */}
             <div className="col-span-1 md:col-span-2 lg:col-span-2 glass-card rounded-3xl p-5 md:p-8 relative overflow-hidden hover:bg-white/[0.05] transition-colors">
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl"></div>
                <h3 className="text-xl md:text-xl font-bold text-white mb-4 md:mb-6">Live Analytics Dashboard</h3>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                   <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700">
                      <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mb-1">Total Nasabah</div>
                      <div className="text-lg md:text-2xl font-bold text-white">1,240</div>
                   </div>
                   <div className="bg-slate-800/50 p-3 md:p-4 rounded-xl border border-slate-700">
                      <div className="text-[10px] md:text-xs text-slate-500 uppercase tracking-wider mb-1">Recovery Rate</div>
                      <div className="text-lg md:text-2xl font-bold text-green-400">92%</div>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-12 md:py-20 relative z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-3xl p-6 md:p-12 text-center relative overflow-hidden border border-white/10 bg-gradient-to-b from-indigo-900/50 to-slate-900/50 backdrop-blur-xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white mb-4 md:mb-6 relative z-10 tracking-tight">Siap untuk Transformasi?</h2>
            <p className="text-slate-300 mb-8 md:mb-10 max-w-2xl mx-auto relative z-10 text-base md:text-lg">
              Bergabunglah dengan era baru manajemen keuangan. Efisien, aman, dan terpercaya.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="px-8 py-3 md:px-12 md:py-5 bg-white text-slate-900 rounded-xl font-bold text-lg md:text-xl hover:bg-indigo-50 transition-colors shadow-lg shadow-white/10 relative z-10"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 bg-[#050914] relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">A</div>
              <span className="text-lg font-bold text-slate-300">ADNT<span className="text-indigo-500">.</span></span>
           </div>
           <div className="text-slate-500 text-sm">
              © 2024 ADNT System. All rights reserved.
           </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
