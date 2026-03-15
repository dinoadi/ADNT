import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';

const CalendarView = ({ customers, onDateChange, selectedDate }: any) => {
  const current = new Date(selectedDate);
  const year = current.getFullYear();
  const month = current.getMonth();
  
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday
  
  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(new Date(year, month, i));
  }

  const fmt = (d: Date) => {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  };

  const getDueCount = (date: Date) => {
    if (!date) return 0;
    return (customers || []).filter((c: any) => {
      if (!c?.tanggal_jt) return false;
      // Handle various date formats (YYYY-MM-DD or other)
      const dayMatch = c.tanggal_jt.match(/\d+$/);
      const baseDay = dayMatch ? parseInt(dayMatch[0], 10) : 0;
      return date.getDate() === baseDay;
    }).length;
  };

  const changeMonth = (offset: number) => {
      const newDate = new Date(current);
      newDate.setMonth(current.getMonth() + offset);
      onDateChange(fmt(newDate));
  }

  const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
                <div className="flex items-center gap-3 mb-1">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <CalendarIcon size={20} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 tracking-tight">Jadwal Penagihan</h3>
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-11">Monitoring Jatuh Tempo</p>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 shadow-inner">
                <button 
                  onClick={() => changeMonth(-1)} 
                  className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600 active:scale-95"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="font-black text-slate-700 w-44 text-center select-none text-sm tracking-tight">
                    {monthNames[month]} {year}
                </div>
                <button 
                  onClick={() => changeMonth(1)} 
                  className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl transition-all text-slate-500 hover:text-indigo-600 active:scale-95"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div className="bg-slate-50/50 rounded-[2.5rem] p-4 md:p-8 border border-slate-100 shadow-inner">
          <div className="grid grid-cols-7 gap-2 md:gap-4 text-center mb-6">
              {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
              <div key={day} className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] py-2">
                  {day}
              </div>
              ))}
          </div>

          <div className="grid grid-cols-7 gap-2 md:gap-4">
              {days.map((date, idx) => {
              const count = date ? getDueCount(date) : 0;
              const isSelected = date && fmt(date) === selectedDate;
              const isToday = date && fmt(date) === fmt(new Date());
              
              return (
                  <motion.div 
                    key={idx} 
                    whileHover={date ? { y: -4, scale: 1.02 } : {}}
                    whileTap={date ? { scale: 0.98 } : {}}
                    onClick={() => date && onDateChange(fmt(date))}
                    className={`
                        relative h-20 md:h-28 rounded-2xl md:rounded-[2rem] flex flex-col items-center justify-center cursor-pointer transition-all duration-300 border
                        ${!date ? 'bg-transparent border-transparent cursor-default' : ''}
                        ${isSelected 
                            ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 border-indigo-500 z-10' 
                            : date 
                                ? 'bg-white text-slate-700 border-slate-200 hover:border-indigo-300 hover:shadow-lg group' 
                                : ''
                        }
                        ${isToday && !isSelected ? 'ring-2 ring-indigo-500 ring-offset-4' : ''}
                    `}
                  >
                  {date && (
                      <>
                          <span className={`text-lg md:text-2xl font-black ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                              {date.getDate()}
                          </span>
                          {count > 0 && (
                              <div className={`mt-2 px-2 md:px-3 py-1 rounded-full text-[9px] md:text-[10px] font-black flex items-center gap-1.5 ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600 border border-rose-100 shadow-sm'}`}>
                                  <div className={`w-1 md:w-1.5 h-1 md:h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500 animate-pulse'}`}></div>
                                  <span className="hidden md:inline">{count} Tagihan</span>
                                  <span className="md:hidden">{count}</span>
                              </div>
                          )}
                          {!count && !isSelected && (
                              <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-slate-100 group-hover:bg-indigo-100 transition-colors"></div>
                          )}
                      </>
                  )}
                  </motion.div>
              );
              })}
          </div>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 px-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-600 shadow-lg shadow-indigo-600/20"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Terpilih</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-white border-2 border-indigo-500"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Hari Ini</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500 animate-pulse shadow-lg shadow-rose-500/20"></div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ada Tagihan</span>
          </div>
        </div>
    </motion.div>
  );
};

export default CalendarView;
