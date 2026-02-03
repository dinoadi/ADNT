import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, CheckCircle, Smartphone, ArrowRight, Zap, BarChart3, Lock, Users, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/30">A</div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">ADNT</span>
            </div>
            <button 
              onClick={() => navigate('/login')}
              className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
            >
              Masuk
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full bg-white">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8 animate-fade-in-up">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
              </span>
              ADNT - Automated Due Notice Tool
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
              Kelola Penagihan dengan <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Hati & Teknologi</span>
            </h1>
            
            <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Platform manajemen keuangan yang mengedepankan nilai profesionalisme, dipadukan dengan kecanggihan teknologi <span className="font-semibold text-slate-800">Automated Due Notice Tool (ADNT)</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => navigate('/login')}
                className="group px-8 py-4 bg-slate-900 text-white rounded-full font-bold text-lg shadow-xl hover:bg-slate-800 transition-all hover:scale-105 flex items-center gap-2"
              >
                Mulai Sekarang 
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all hover:border-slate-300">
                Pelajari Lebih Lanjut
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-12 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">100+</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Nasabah Aktif</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">99%</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Akurasi Data</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Sistem Online</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">0</div>
              <div className="text-sm text-slate-500 font-medium uppercase tracking-wider">Kesalahan Hitung</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Fitur Unggulan</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Dirancang khusus untuk memudahkan operasional harian Anda dengan fitur-fitur yang relevan dan powerful.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Keamanan Terjamin",
                desc: "Data nasabah dilindungi dengan enkripsi standar industri. Privasi adalah prioritas utama kami.",
                color: "indigo"
              },
              {
                icon: Smartphone,
                title: "WhatsApp Gateway",
                desc: "Kirim notifikasi tagihan dan bukti pembayaran langsung ke WhatsApp nasabah secara otomatis.",
                color: "green"
              },
              {
                icon: BarChart3,
                title: "Analitik Real-time",
                desc: "Pantau performa penagihan dan arus kas melalui dashboard interaktif yang mudah dipahami.",
                color: "purple"
              },
              {
                icon: Zap,
                title: "Proses Cepat",
                desc: "Input data dan proses pembayaran dalam hitungan detik. Hemat waktu, tingkatkan produktivitas.",
                color: "amber"
              },
              {
                icon: Users,
                title: "Manajemen Nasabah",
                desc: "Database nasabah yang rapi, lengkap dengan riwayat pembayaran dan status terkini.",
                color: "blue"
              },
              {
                icon: Lock,
                title: "Integritas Data",
                desc: "Sistem pencatatan yang akurat meminimalisir kesalahan manusia dan manipulasi data.",
                color: "rose"
              }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 group hover:-translate-y-1">
                <div className={`w-14 h-14 rounded-xl bg-${feature.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon size={28} className={`text-${feature.color}-600`} />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-sm">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center relative overflow-hidden shadow-2xl">
            {/* Decorative circles */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>
            
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6 relative z-10">Siap Mengelola Keuangan dengan Lebih Baik?</h2>
            <p className="text-slate-300 mb-10 max-w-2xl mx-auto relative z-10">Bergabunglah dengan ADNT sekarang dan rasakan kemudahan manajemen penagihan yang sesungguhnya.</p>
            <button 
              onClick={() => navigate('/login')}
              className="px-10 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-lg relative z-10"
            >
              Mulai Sekarang
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">A</div>
                <span className="text-xl font-bold text-slate-800">ADNT</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Sistem penagihan yang mengutamakan efisiensi dan transparansi. Dibangun untuk memudahkan operasional Anda.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Produk</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Fitur</a></li>
                <li><a href="#" className="hover:text-indigo-600">Harga</a></li>
                <li><a href="#" className="hover:text-indigo-600">Integrasi</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Perusahaan</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Tentang Kami</a></li>
                <li><a href="#" className="hover:text-indigo-600">Karir</a></li>
                <li><a href="#" className="hover:text-indigo-600">Kontak</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-800 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#" className="hover:text-indigo-600">Privasi</a></li>
                <li><a href="#" className="hover:text-indigo-600">Syarat & Ketentuan</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-400 text-sm">© {new Date().getFullYear()} ADNT App. By Ariefadn.</p>
            <div className="flex gap-4">
              {/* Social icons could go here */}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
