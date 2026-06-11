import { Thermometer, Wind, AlertTriangle, Droplets } from 'lucide-react';

const SensorGauge = ({ type, value, unit, status, max }) => {
  const isDanger = status === 'DANGER';
  const isWarning = status === 'WARNING';
  
  // Calculate percentage for the gauge
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  let colorClass = "text-emerald-500 stroke-emerald-500";
  let badgeClass = "bg-emerald-100/50 text-emerald-700 border-emerald-200/50";
  if (isWarning) {
    colorClass = "text-amber-500 stroke-amber-500";
    badgeClass = "bg-amber-100/50 text-amber-700 border-amber-200/50";
  }
  if (isDanger) {
    colorClass = "text-rose-500 stroke-rose-500";
    badgeClass = "bg-rose-100/50 text-rose-700 border-rose-200/50";
  }

  const icons = {
    Methane: <Wind className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />,
    'Carbon Monoxide': <AlertTriangle className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />,
    Temperature: <Thermometer className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />,
    Humidity: <Droplets className={`w-5 h-5 ${colorClass.split(' ')[0]}`} />
  };

  return (
    <div className={`glass-panel flex flex-col items-center justify-center p-6 relative overflow-hidden transition-all hover:shadow-lg ${isDanger ? 'border-rose-300/80 bg-rose-50/20' : ''}`}>
      <div className={`absolute top-0 left-0 w-full h-1 ${colorClass.split(' ')[0].replace('text-', 'bg-')}`}></div>
      <div className="absolute top-4 left-4">
        {icons[type]}
      </div>
      
      {/* SVG Circular Gauge */}
      <div className="relative w-28 h-28 flex items-center justify-center mb-5 mt-2">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="40" 
            className="stroke-stone-200/50" 
            strokeWidth="8" fill="none" 
          />
          <circle 
            cx="50" cy="50" r="40" 
            className={`${colorClass.split(' ')[1]} transition-all duration-1000 ease-out`} 
            strokeWidth="8" fill="none" 
            strokeDasharray={`${percentage * 2.51} 251`} 
            strokeLinecap="round" 
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-700">{value.toFixed(1)}</span>
          <span className="text-[10px] text-stone-400 font-bold tracking-wider">{unit}</span>
        </div>
      </div>
      
      <div className="text-center">
        <h4 className="text-sm font-semibold uppercase tracking-wider text-stone-500 mb-2">{type}</h4>
        <div className={`inline-block px-3 py-0.5 rounded-full border text-[10px] font-bold tracking-widest backdrop-blur-sm ${badgeClass}`}>
          {status}
        </div>
      </div>
    </div>
  );
};

export default SensorGauge;
