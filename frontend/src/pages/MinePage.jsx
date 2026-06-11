import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, HardHat, Server, AlertTriangle } from 'lucide-react';
import { getMineDetails, getMineAlerts } from '../api';
import SensorGauge from '../components/SensorGauge';
import LiveChart from '../components/LiveChart';
import AIInsightBox from '../components/AIInsightBox';

const MinePage = () => {
  const { id } = useParams();
  const [mine, setMine] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [mineRes, alertRes] = await Promise.all([
        getMineDetails(id),
        getMineAlerts(id)
      ]);
      setMine(mineRes.data);
      setAlerts(alertRes.data.alerts);
    } catch (err) {
      console.error("Failed to fetch mine details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading && !mine) {
    return <div className="flex justify-center mt-32"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  if (!mine) {
    return <div className="glass-card text-center mt-32 py-10 text-rose-500 font-semibold max-w-lg mx-auto">Mine not found</div>;
  }

  const latest = mine.readings && mine.readings.length > 0 ? mine.readings[mine.readings.length - 1] : {};

  return (
    <div className="max-w-7xl mx-auto px-2 space-y-6">
      {/* Header */}
      <div className="glass-card p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link to="/" className="p-2.5 bg-white/50 hover:bg-white/80 rounded-xl transition-colors text-stone-500 hover:text-orange-500 shadow-sm border border-white/60">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-stone-800 flex items-center gap-2">
              <HardHat className="text-orange-500 w-6 h-6" /> {mine.mine_name}
              <span className="text-xs bg-stone-100/50 text-stone-600 border border-stone-200/50 px-2 py-0.5 rounded font-mono font-normal ml-2">{mine.mine_code}</span>
            </h2>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/50 border border-white/60 px-4 py-2 rounded-xl shadow-sm">
            <div className={`w-3 h-3 rounded-full ${latest.status === 'DANGER' ? 'bg-rose-500 animate-pulse' : latest.status === 'WARNING' ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
            <span className="text-xs font-bold tracking-wider text-stone-700">{latest.status || 'UNKNOWN'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Info Column */}
        <div className="space-y-6">
          <div className="glass-panel p-6">
            <h3 className="text-lg font-bold text-stone-800 mb-5 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-orange-400" /> Sector Details
            </h3>
            <ul className="space-y-4 text-sm">
              <li className="flex justify-between border-b border-stone-200/50 pb-3">
                <span className="text-stone-500">Location</span>
                <span className="font-medium text-stone-800 text-right">{mine.location}</span>
              </li>
              <li className="flex justify-between border-b border-stone-200/50 pb-3">
                <span className="text-stone-500">Depth</span>
                <span className="font-medium text-stone-800">{mine.depth_meters} meters</span>
              </li>
              <li className="flex justify-between border-b border-stone-200/50 pb-3">
                <span className="text-stone-500">Active Personnel</span>
                <span className="font-bold text-orange-600">{mine.active_workers} miners</span>
              </li>
              <li className="flex justify-between">
                <span className="text-stone-500 flex items-center gap-1"><Server className="w-4 h-4" /> Telemetry Unit</span>
                <span className="font-mono text-stone-600 bg-white/50 px-2 py-0.5 rounded border border-white/60">{mine.device_id}</span>
              </li>
            </ul>
          </div>
          
          <AIInsightBox mineData={{...mine, latest_reading: latest}} />
        </div>

        {/* Data Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Gauges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <SensorGauge 
              type="Methane" 
              value={Number(latest.methane_ppm) || 0} 
              unit="PPM" 
              status={latest.methane_ppm >= 5000 ? 'DANGER' : latest.methane_ppm >= 2500 ? 'WARNING' : 'SAFE'} 
              max={10000} 
            />
            <SensorGauge 
              type="Carbon Monoxide" 
              value={Number(latest.co_ppm) || 0} 
              unit="PPM" 
              status={latest.co_ppm >= 100 ? 'DANGER' : latest.co_ppm >= 50 ? 'WARNING' : 'SAFE'} 
              max={200} 
            />
            <SensorGauge 
              type="Temperature" 
              value={Number(latest.temperature_c) || 0} 
              unit="°C" 
              status={latest.temperature_c >= 40 ? 'DANGER' : latest.temperature_c >= 35 ? 'WARNING' : 'SAFE'} 
              max={50} 
            />
            <SensorGauge 
              type="Humidity" 
              value={Number(latest.humidity_percent) || 0} 
              unit="%" 
              status={latest.humidity_percent >= 95 ? 'DANGER' : latest.humidity_percent >= 90 ? 'WARNING' : 'SAFE'} 
              max={100} 
            />
          </div>

          {/* Chart */}
          <LiveChart data={mine.readings || []} />
          
          {/* Recent Alerts */}
          {alerts && alerts.length > 0 && (
            <div className="glass-panel overflow-hidden">
              <div className="bg-rose-50/80 border-b border-rose-100/80 p-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-500" />
                <h3 className="font-bold text-rose-700 text-sm tracking-wider uppercase">Critical Incident Log</h3>
              </div>
              <ul className="divide-y divide-stone-100/50">
                {alerts.map(alert => (
                  <li key={alert.id} className="p-4 hover:bg-white/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="font-semibold text-stone-800 text-sm">{alert.alert_type.replace('_', ' ')}</p>
                      <p className="text-xs text-stone-500 mt-1">Value peaked at: <strong className="text-rose-500">{alert.sensor_value}</strong> (Safe Limit: {alert.threshold_value})</p>
                    </div>
                    <span className="text-xs text-stone-400 font-mono bg-white/60 px-2.5 py-1 rounded-md border border-white/80">{new Date(alert.triggered_at).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MinePage;
