import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

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
      const baseDay = parseInt(c.tanggal_jt.slice(-2), 10);
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
    <div>
        <div className="flex justify-between items-center mb-8">
            <div>
                <h3 className="text-xl font-bold text-slate-800">Kalender Jatuh Tempo</h3>
                <p className="text-sm text-slate-500">Jadwal penagihan bulan ini</p>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-xl p-1.5 border border-slate-200 shadow-sm">
                <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-slate-50 hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-indigo-600">
                    <ChevronLeft size={20} />
                </button>
                <span className="font-bold text-slate-700 w-36 text-center select-none text-sm">
                    {monthNames[month]} {year}
                </span>
                <button onClick={() => changeMonth(1)} className="p-2 hover:bg-slate-50 hover:shadow-sm rounded-lg transition-all text-slate-500 hover:text-indigo-600">
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-7 gap-3 text-center mb-4">
            {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map(day => (
            <div key={day} className="text-xs font-bold text-slate-400 uppercase tracking-wider py-2">
                {day}
            </div>
            ))}
        </div>

        <div className="grid grid-cols-7 gap-3">
            {days.map((date, idx) => {
            const count = date ? getDueCount(date) : 0;
            const isSelected = date && fmt(date) === selectedDate;
            const isToday = date && fmt(date) === fmt(new Date());
            
            return (
                <div 
                key={idx} 
                onClick={() => date && onDateChange(fmt(date))}
                className={`
                    relative h-24 rounded-2xl flex flex-col items-center justify-center cursor-pointer transition-all duration-200 border group
                    ${!date ? 'bg-transparent border-transparent cursor-default' : 'hover:scale-[1.02]'}
                    ${isSelected 
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 border-indigo-600' 
                        : date 
                            ? 'bg-white text-slate-700 border-slate-100 hover:border-indigo-200 hover:shadow-md' 
                            : ''
                    }
                    ${isToday && !isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''}
                `}
                >
                {date && (
                    <>
                        <span className={`text-xl font-bold ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                            {date.getDate()}
                        </span>
                        {count > 0 && (
                            <div className={`mt-2 px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 ${isSelected ? 'bg-white/20 text-white' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                                <div className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-rose-500 animate-pulse'}`}></div>
                                {count} Tagihan
                            </div>
                        )}
                        {!count && !isSelected && (
                            <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-slate-100"></div>
                        )}
                    </>
                )}
                </div>
            );
            })}
        </div>
    </div>
  );
};

export default CalendarView;
