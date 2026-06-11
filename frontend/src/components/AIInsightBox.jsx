import { Bot, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getGroqInsight } from '../api';

const AIInsightBox = ({ mineData }) => {
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchInsight = async () => {
    if (!mineData || !mineData.latest_reading) return;
    
    setLoading(true);
    try {
      const payload = {
        mine_name: mineData.mine_name,
        location: mineData.location,
        methane_ppm: mineData.latest_reading.methane_ppm,
        co_ppm: mineData.latest_reading.co_ppm,
        temperature_c: mineData.latest_reading.temperature_c,
        humidity_percent: mineData.latest_reading.humidity_percent,
        status: mineData.latest_reading.status,
        active_workers: mineData.active_workers
      };
      const res = await getGroqInsight(payload);
      setInsight(res.data.insight);
    } catch (err) {
      console.error(err);
      setInsight("Failed to generate AI insight. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (mineData) {
      fetchInsight();
    }
  }, [mineData?.id]);

  return (
    <div className="glass-panel p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-orange-400 to-amber-500"></div>
      <div className="flex items-center justify-between mb-5 pl-2">
        <div className="flex items-center gap-2 text-orange-600">
          <Bot className="w-6 h-6" />
          <h3 className="font-bold tracking-wider uppercase text-sm">AI Safety Analysis</h3>
        </div>
        <button 
          onClick={fetchInsight} 
          disabled={loading}
          className="text-stone-400 hover:text-orange-500 transition-colors bg-white/50 p-2 rounded-lg border border-white/60 shadow-sm"
          title="Regenerate Insight"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="text-stone-700 text-sm leading-relaxed min-h-[100px] pl-2 pb-5">
        {loading ? (
          <div className="animate-pulse space-y-3 pt-2">
            <div className="h-3 bg-stone-200/60 rounded-full w-full"></div>
            <div className="h-3 bg-stone-200/60 rounded-full w-5/6"></div>
            <div className="h-3 bg-stone-200/60 rounded-full w-4/6"></div>
          </div>
        ) : (
          <p className="font-medium">{insight || "Waiting for data..."}</p>
        )}
      </div>

      <div className="absolute bottom-3 right-5 text-[9px] text-stone-400 font-bold tracking-widest uppercase">
        Developed by Rounak
      </div>
    </div>
  );
};

export default AIInsightBox;
