import React from 'react';

const LeadershipBanner = () => {
  return (
    <div className="glass-panel p-6 mb-8 border-t-4 border-t-orange-500 relative overflow-hidden bg-white/60">
      {/* Decorative background element */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-orange-400/10 rounded-full blur-3xl"></div>
      
      <div className="flex flex-col md:flex-row items-center justify-around gap-10">
        
        {/* Coal Minister */}
        <div className="flex items-center gap-5 text-center md:text-left z-10">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-orange-400 to-amber-600 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-stone-100">
              <img src="/minister.jpg" alt="Shri G. Kishan Reddy" className="w-full h-full object-cover" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-base uppercase tracking-wide">Shri G. Kishan Reddy</h4>
            <p className="text-xs text-orange-600 font-bold mb-1">Hon'ble Minister of Coal, Govt. of India</p>
            <p className="text-xs text-stone-500 font-serif italic max-w-[240px] leading-relaxed border-l-2 border-orange-200 pl-3">"Safety of our miners and sustainable extraction is the paramount priority of the nation."</p>
          </div>
        </div>

        <div className="hidden md:block w-px h-24 bg-gradient-to-b from-transparent via-stone-300 to-transparent"></div>

        {/* BCCL CMD */}
        <div className="flex items-center gap-5 text-center md:text-left z-10">
          <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-sky-400 to-blue-600 shadow-lg shrink-0">
            <div className="w-full h-full rounded-full border-2 border-white overflow-hidden bg-stone-100">
              <img src="/cmd.jpg" alt="CMD BCCL" className="w-full h-full object-cover object-top" />
            </div>
          </div>
          <div>
            <h4 className="font-bold text-stone-800 text-base uppercase tracking-wide">Shri Manoj Kumar Agarwal</h4>
            <p className="text-xs text-sky-600 font-bold mb-1">CMD, Bharat Coking Coal Limited</p>
            <p className="text-xs text-stone-500 font-serif italic max-w-[240px] leading-relaxed border-l-2 border-sky-200 pl-3">"Committed to zero-harm operations, modern technology, and welfare across all our collieries."</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default LeadershipBanner;
