import { useState, useEffect } from 'react';
import { getMines } from '../api';
import MineCard from '../components/MineCard';
import LeadershipBanner from '../components/LeadershipBanner';
import { RefreshCw, Activity } from 'lucide-react';

const Home = () => {
  const [mines, setMines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchMines = async () => {
    try {
      const res = await getMines();
      setMines(res.data.mines);
      setLastUpdate(new Date());
    } catch (err) {
      console.error("Failed to fetch mines:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMines();
    const interval = setInterval(fetchMines, 2000);
    return () => clearInterval(interval);
  }, []);

  const safeCount = mines.filter(m => m.latest_reading?.status === 'SAFE').length;
  const warningCount = mines.filter(m => m.latest_reading?.status === 'WARNING').length;
  const dangerCount = mines.filter(m => m.latest_reading?.status === 'DANGER').length;

  return (
    <div className="max-w-7xl mx-auto px-2">
      <LeadershipBanner />
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 mt-4">
        <div>
          <h2 className="text-3xl font-bold text-stone-800 mb-2 flex items-center gap-3">
            <Activity className="w-8 h-8 text-orange-500" />
            Live Dashboard
          </h2>
          <p className="text-stone-500">Real-time safety telemetry across all active sectors.</p>
        </div>
        
        <div className="glass-panel px-4 py-2 flex items-center gap-3">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-orange-500' : 'text-stone-400'}`} />
          <span className="text-xs text-stone-500 font-medium">
            Last updated: <span className="font-bold text-stone-700">{lastUpdate.toLocaleTimeString()}</span>
          </span>
        </div>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="glass-card p-6">
          <p className="text-xs text-stone-400 font-bold mb-1 uppercase tracking-wider">Total Mines</p>
          <p className="text-4xl font-bold text-stone-700">{mines.length}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-emerald-400">
          <p className="text-xs text-stone-400 font-bold mb-1 uppercase tracking-wider">Safe</p>
          <p className="text-4xl font-bold text-emerald-600">{safeCount}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-amber-400">
          <p className="text-xs text-stone-400 font-bold mb-1 uppercase tracking-wider">Warning</p>
          <p className="text-4xl font-bold text-amber-600">{warningCount}</p>
        </div>
        <div className="glass-card p-6 border-b-4 border-b-rose-400 bg-rose-50/20">
          <p className="text-xs text-stone-400 font-bold mb-1 uppercase tracking-wider">Danger</p>
          <p className="text-4xl font-bold text-rose-600">{dangerCount}</p>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mines.map(mine => (
          <MineCard key={mine.id} mine={mine} />
        ))}
      </div>
      
      {mines.length === 0 && !loading && (
        <div className="glass-card text-center py-24 text-stone-500 mt-8 border-dashed border-2">
          <p className="text-lg">No telemetry data found.</p>
        </div>
      )}
    </div>
  );
};

export default Home;
