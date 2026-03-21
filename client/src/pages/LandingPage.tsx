import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Shield, BarChart3, Lock, Users, ArrowRight, 
  Check, TrendingUp, Globe, Cpu, ChevronRight,
  Database, Zap, MousePointer2, Sparkles, Target,
  Rocket, Layers, Code2, Terminal
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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
    <div className="min-h-screen bg-[#0a0a0f] font-sans text-white selection:bg-indigo-500/50 selection:text-white overflow-x-hidden">
      
      {/* Dynamic Grid Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a0a0f_0%,#1a1a2e_50%,#0a0a0f_100%)]" />
        <div className="absolute inset-0 opacity-20" style={{
          backgroundImage: `
            linear-gradient(rgba(99,102,241,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(99,102,241,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }} />
        {/* Animated gradient orbs */}
        <motion.div 
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute bottom-[20%] left-[10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[80px]"
        />
        {/* Mouse follower glow */}
        <motion.div
          animate={{
            x: mousePosition.x - 250,
            y: mousePosition.y - 250
          }}
          transition={{ type: "spring", stiffness: 500, damping: 28 }}
          className="w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[150px] pointer-events-none"
        />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-4 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-indigo-500/20' : 'py-6 bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-3 group cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-2xl shadow-2xl shadow-indigo-500/30 border border-white/20 group-hover:scale-110 transition-transform">
                A
              </div>
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-1 border-2 border-indigo-500/30 rounded-xl"
              />
            </div>
            <span className="text-2xl font-black text-white tracking-tighter">ADNT<span className="text-indigo-500">.</span></span>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="flex items-center gap-6"
          >
            <button 
              onClick={() => navigate('/login')}
              className="hidden md:block text-sm font-bold text-slate-400 hover:text-white transition-colors tracking-wide"
            >
              Log In
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="group relative px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-bold text-sm overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10 flex items-center gap-2">
                Get Started
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold mb-12 backdrop-blur-md"
          >
            <Sparkles size={16} className="fill-indigo-400" />
            V3.0 IS NOW LIVE • NEXT GEN ANALYTICS
          </motion.div>

          <motion.h1 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-white mb-8 leading-[0.95]"
          >
            Transform Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Financial Future.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl md:text-2xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed font-medium px-4"
          >
            Stop chasing payments. Start automating collections. ADNT delivers enterprise-grade analytics with zero infrastructure overhead.
          </motion.p>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
          >
            <button 
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-12 py-5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-black text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(99,102,241,0.5)] flex items-center justify-center gap-3"
            >
              <Rocket size={24} />
              Launch Dashboard
              <ArrowRight size={24} />
            </button>
            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-12 h-12 rounded-lg border-2 border-[#1a1a2e] bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center text-xs font-bold shadow-lg">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-sm font-bold text-slate-500">
                <div className="text-indigo-400">200+</div>
                <div>Companies Trust Us</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Hero Visual Mockup */}
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="mt-24 max-w-6xl mx-auto px-6"
        >
          <div className="relative group">
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 0px rgba(99,102,241,0)",
                  "0 0 60px rgba(99,102,241,0.3)",
                  "0 0 0px rgba(99,102,241,0)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl blur opacity-50"
            />
            <div className="relative bg-[#0f0f1a] rounded-2xl border border-indigo-500/20 shadow-2xl overflow-hidden aspect-[16/9] md:aspect-[21/9]">
              {/* Fake UI Elements */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent" />
              <div className="h-14 border-b border-indigo-500/10 flex items-center px-6 gap-4">
                <div className="flex gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-500/30"></div>
                  <div className="w-4 h-4 rounded-full bg-yellow-500/30"></div>
                  <div className="w-4 h-4 rounded-full bg-green-500/30"></div>
                </div>
                <div className="flex-1 h-3 bg-indigo-500/10 rounded-full"></div>
                <div className="flex gap-2">
                  <div className="w-8 h-8 rounded bg-indigo-500/20"></div>
                  <div className="w-8 h-8 rounded bg-purple-500/20"></div>
                </div>
              </div>
              <div className="p-8 grid grid-cols-3 gap-6">
                <div className="col-span-2 space-y-6">
                  <div className="h-48 rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/10 animate-pulse"></div>
                  <div className="h-72 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/10 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>
                <div className="space-y-6">
                  <div className="h-full rounded-xl bg-gradient-to-br from-pink-500/10 to-indigo-500/5 border border-pink-500/10 animate-pulse" style={{ animationDelay: '1s' }}></div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { value: '99.9%', label: 'Uptime', icon: Zap },
              { value: '200+', label: 'Companies', icon: Users },
              { value: '1M+', label: 'Transactions', icon: Database },
              { value: '24/7', label: 'Support', icon: Shield }
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 hover:border-indigo-500/30 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                    <stat.icon size={28} />
                  </div>
                  <div className="text-4xl font-black text-white">{stat.value}</div>
                </div>
                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">ADNT?</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Built for scale. Designed for speed. Engineered for security.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: BarChart3, title: 'Advanced Analytics', desc: 'Real-time insights into your collection performance and repayment rates with predictive analytics.' },
              { icon: Database, title: 'Supabase Integration', desc: 'Enterprise-grade cloud database ensuring your data is always safe, accessible, and scalable.' },
              { icon: Lock, title: 'Secure Operations', desc: 'Bank-level encryption for all sensitive customer and financial information with SOC 2 compliance.' },
              { icon: Target, title: 'Smart Collections', desc: 'AI-powered collection strategies that optimize your recovery rates and reduce NPL.' },
              { icon: Layers, title: 'Seamless Integration', desc: 'Connect with your existing systems through our robust API and webhook support.' },
              { icon: Code2, title: 'Developer First', desc: 'Built with modern tech stack, fully documented, and easy to customize.' }
            ].map((f, i) => (
              <motion.div 
                key={i}
                initial={{ y: 30, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="p-10 rounded-2xl bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-500/10 hover:border-indigo-500/30 hover:from-indigo-500/10 hover:to-purple-500/10 transition-all group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white mb-8 shadow-lg shadow-indigo-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all">
                  <f.icon size={32} />
                </div>
                <h3 className="text-2xl font-black text-white mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed font-medium">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-6 md:px-12 text-center">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <motion.div 
              animate={{ 
                boxShadow: [
                  "0 0 0px rgba(99,102,241,0)",
                  "0 0 80px rgba(99,102,241,0.4)",
                  "0 0 0px rgba(99,102,241,0)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -inset-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-50"
            />
            <div className="relative bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-16 border border-white/10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Transform Your Operations?
              </h2>
              <p className="text-xl text-indigo-200 mb-10 max-w-2xl mx-auto">
                Join 200+ companies already using ADNT to streamline their financial operations.
              </p>
              <button 
                onClick={() => navigate('/login')}
                className="group px-12 py-5 bg-white text-indigo-600 rounded-xl font-black text-lg transition-all hover:scale-105 hover:shadow-2xl flex items-center justify-center gap-3 mx-auto"
              >
                <Terminal size={24} />
                Get Started Now
                <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-indigo-500/10 relative z-10 bg-[#0a0a0f]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-lg shadow-lg shadow-indigo-500/20">A</div>
              <span className="text-xl font-bold text-white">ADNT<span className="text-indigo-500">.</span></span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-slate-500 uppercase tracking-widest">
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
