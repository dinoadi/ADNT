import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Lock, User, ArrowRight, ChevronLeft } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate network delay for effect
    setTimeout(() => {
        try {
            if (username === 'admin' && password === 'admin') {
              localStorage.setItem('token', 'demo-token');
              navigate('/dashboard');
            } else {
              alert('Username atau password salah');
            }
          } catch (error) {
            console.error(error);
            alert('Login gagal');
          } finally {
            setIsLoading(false);
          }
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-purple-200/40 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-indigo-200/40 rounded-full blur-[100px]" />
      </div>

      <div className="absolute top-8 left-8 z-20">
        <button 
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
        >
          <ChevronLeft size={20} /> Kembali
        </button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md transform transition-all border border-white/50 relative z-10">
        <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/30 mb-4">
                A
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Selamat Datang Kembali</h2>
            <p className="text-slate-500 text-sm mt-2">Masuk untuk mengelola dashboard Anda</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Username</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1">Password</label>
             <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="password"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-slate-800 font-medium"
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-slate-900 text-white py-3.5 rounded-xl font-bold shadow-xl hover:bg-slate-800 hover:shadow-2xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group mt-2"
          >
            {isLoading ? 'Memproses...' : (
                <>
                    Masuk Aplikasi <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-400">
                &copy; {new Date().getFullYear()} ADNT App. <span className="mx-1">•</span> Privacy Policy
            </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
