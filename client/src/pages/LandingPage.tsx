import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, BarChart3, Lock, Users, ArrowRight, 
  Check, TrendingUp, Globe, Cpu, ChevronRight,
  Database, Zap, MousePointer2
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen bg-[#030712] font-sans text-slate-300 selection:bg-indigo-500/30 selection:text-indigo-200 overflow-x-hidden">
      
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[1000px] h-[1000px] bg-indigo-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none"></div>
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-500 ${scrolled ? 'py-4 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 shadow-2xl shadow-black/50' : 'py-8 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-2xl shadow-indigo-500/20 border border-white/10 group-hover:scale-110 transition-transform">
              A
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">ADNT<span className="text-indigo-500">.</span></span>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-8"
          >
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-6 py-3 bg-white text-black rounded-full font-black text-sm overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-48 pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/5 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-10 backdrop-blur-md"
          >
            <Zap size={14} className="fill-indigo-400" />
            V3.0 IS NOW LIVE • NEXT GEN ANALYTICS
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95]"
          >
            Elevate Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400">Financial Ops.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
          >
            Leave manual tracking behind. ADNT provides a high-performance ecosystem for modern financial management and automated collection intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:row gap-6 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-full font-black text-lg hover:bg-indigo-500 transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(79,70,229,0.4)] flex items-center justify-center gap-3"
            >
              Start Experience
              <ArrowRight size={22} />
            </button>
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-[#030712] bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                  {String.fromCharCode(64 + i)}
                </div>
              ))}
              <div className="pl-6 text-sm font-bold text-slate-500 flex items-center">
                Joined by 200+ companies
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-32 max-w-6xl mx-auto px-6"
        >
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-[#0F172A] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              {/* Fake UI Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
              <div className="h-12 border-b border-white/5 flex items-center px-6 gap-3">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                </div>
                <div className="w-48 h-4 bg-white/5 rounded-full"></div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="h-40 rounded-2xl bg-white/5 border border-white/5 animate-pulse"></div>
                  <div className="h-64 rounded-2xl bg-white/5 border border-white/5 animate-pulse"></div>
                </div>
                <div className="space-y-6">
                  <div className="h-full rounded-2xl bg-indigo-500/10 border border-indigo-500/10 animate-pulse"></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time insights into your collection performance and repayment rates.' },
              { icon: Database, title: 'Supabase Integration', desc: 'Enterprise-grade cloud database ensuring your data is always safe and accessible.' },
              { icon: Lock, title: 'Secure Operations', desc: 'Bank-level encryption for all sensitive customer and financial information.' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -10 }}
                className="p-10 rounded-[2rem] bg-white/5 border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all group"
              >
                <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-400 mb-8 group-hover:scale-110 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 border-t border-white/5 relative z-10 bg-[#030712]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black">A</div>
              <span className="text-xl font-bold text-white">ADNT<span className="text-indigo-500">.</span></span>
            </div>
            <div className="flex gap-12 text-sm font-bold text-slate-500 uppercase tracking-widest">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Security</a>
              <a href="#" className="hover:text-white transition-colors">Contact</a>
            </div>
            <div className="text-slate-600 text-xs font-medium">
              © 2026 ADNT INC. ALL RIGHTS RESERVED.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
