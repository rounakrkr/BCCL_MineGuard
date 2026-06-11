import { Users, MapPin, Wind, Thermometer } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusBadge = ({ status }) => {
  const styles = {
    SAFE: "bg-emerald-100/50 text-emerald-700 border-emerald-200/50",
    WARNING: "bg-amber-100/50 text-amber-700 border-amber-200/50",
    DANGER: "bg-rose-100/50 text-rose-700 border-rose-200/50",
  };
  
  const dots = {
    SAFE: "bg-emerald-500",
    WARNING: "bg-amber-500",
    DANGER: "bg-rose-500 animate-pulse",
  };

  return (
    <div className={`px-2.5 py-1 rounded-full border backdrop-blur-sm flex items-center gap-1.5 ${styles[status] || styles.SAFE}`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dots[status] || dots.SAFE}`}></div>
      <span className="text-[10px] font-bold tracking-wider">{status || 'UNKNOWN'}</span>
    </div>
  );
};

const MineCard = ({ mine }) => {
  const reading = mine.latest_reading || {};
  const status = reading.status || 'UNKNOWN';
  
  const isDanger = status === 'DANGER';

  return (
    <Link 
      to={`/mine/${mine.id}`}
      className={`block glass-card p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 hover:border-orange-200
        ${isDanger ? 'border-rose-300 bg-rose-50/30' : 'border-white/70'}
      `}
    >
      <div className="flex justify-between items-start mb-5">
        <div>
          <h3 className="text-xl font-bold text-stone-800 mb-1 group-hover:text-orange-600 transition-colors">{mine.mine_name}</h3>
          <div className="flex items-center gap-2 text-stone-500 text-xs">
            <span className="px-1.5 py-0.5 bg-stone-100/50 rounded text-stone-600 font-medium">{mine.mine_code}</span>
            <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-orange-400" /> {mine.location.split(',')[0]}</span>
          </div>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-white/40 rounded-xl p-3 border border-white/50 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <Wind className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Methane</span>
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-bold text-stone-700 tracking-tight">{reading.methane_ppm ? Number(reading.methane_ppm).toFixed(1) : '--'}</span>
            <span className="text-[10px] text-stone-400 font-normal">PPM</span>
          </div>
        </div>
        <div className="bg-white/40 rounded-xl p-3 border border-white/50 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-1.5 text-stone-500 mb-1">
            <Thermometer className="w-4 h-4 text-orange-400" />
            <span className="text-[10px] uppercase tracking-wider font-bold">Temp</span>
          </div>
          <div className="flex items-baseline gap-1 whitespace-nowrap">
            <span className="text-xl sm:text-2xl font-bold text-stone-700 tracking-tight">{reading.temperature_c ? Number(reading.temperature_c).toFixed(1) : '--'}</span>
            <span className="text-[10px] text-stone-400 font-normal">°C</span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-stone-200/50 pt-4 mt-2">
        <div className="flex items-center gap-1.5 text-stone-500 text-xs">
          <Users className="w-4 h-4 text-stone-400" />
          <span><strong className="text-stone-700">{mine.active_workers}</strong> Workers</span>
        </div>
        <span className="text-orange-500 text-xs font-bold tracking-wide hover:text-orange-600">View Intel →</span>
      </div>
    </Link>
  );
};

export default MineCard;
