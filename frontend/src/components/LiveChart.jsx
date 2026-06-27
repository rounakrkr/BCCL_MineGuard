import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/80 backdrop-blur-xl border border-white/90 p-4 rounded-xl shadow-lg">
        <p className="text-stone-500 text-xs mb-3 font-semibold uppercase tracking-wider">{new Date(label).toLocaleTimeString()}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-sm mb-1.5">
            <div className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: entry.color }}></div>
            <span className="text-stone-600 font-medium">{entry.name}:</span>
            <span className="text-stone-900 font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const LiveChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="h-64 flex items-center justify-center text-stone-400 glass-panel">No historical data available</div>;
  }

  return (
    <div className="h-80 w-full glass-panel p-6">
      <h3 className="text-lg font-bold text-stone-800 mb-6 flex items-center gap-2">
        <div className="w-2 h-6 bg-orange-400 rounded-full"></div>
        Historical Trends
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" vertical={false} />
          <XAxis 
            dataKey="recorded_at" 
            stroke="#a8a29e" 
            tickFormatter={(tick) => {
              const d = new Date(tick);
              return isNaN(d.getTime()) ? '' : d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }}
            tick={{ fontSize: 12, fill: '#a8a29e' }}
            tickMargin={12}
            axisLine={false}
          />
          <YAxis yAxisId="left" stroke="#a8a29e" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="right" orientation="right" stroke="#a8a29e" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#fdba74', strokeWidth: 1, strokeDasharray: '4 4' }} />
          <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="circle" />
          
          <Line yAxisId="left" type="monotone" dataKey="methane_ppm" name="Methane (PPM)" stroke="#f97316" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
          <Line yAxisId="left" type="monotone" dataKey="co_ppm" name="CO (PPM)" stroke="#e11d48" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
          <Line yAxisId="right" type="monotone" dataKey="temperature_c" name="Temp (°C)" stroke="#0ea5e9" strokeWidth={3} dot={false} activeDot={{ r: 6, strokeWidth: 0 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default LiveChart;
