import { Link } from 'react-router-dom';
import { HardHat, Bell } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="glass-card m-4 px-6 py-4 flex items-center justify-between sticky top-4 z-50">
      <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
        <div className="w-12 h-12 shrink-0 group">
          <img 
            src="/coal_logo_v4.png" 
            alt="BCCL MineGuard Logo" 
            className="w-full h-full object-cover rounded-xl shadow-sm group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-stone-800 tracking-tight">
            BCCL MineGuard
          </h1>
          <span className="text-[10px] font-bold text-orange-600 tracking-wider uppercase">Coal India Limited</span>
        </div>
      </Link>
      
      <div className="flex items-center gap-6">
        <div className="hidden md:flex items-center gap-2 bg-green-50/80 px-3 py-1.5 rounded-lg border border-green-200">
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-xs text-green-700 font-bold tracking-wide">SYSTEM LIVE</span>
        </div>
        <button className="relative p-2.5 bg-white/60 rounded-xl hover:bg-white/90 border border-white/80 transition-all text-stone-600 hover:text-orange-500 shadow-sm">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
