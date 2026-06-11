const Footer = () => {
  return (
    <footer className="mt-16 bg-stone-100/80 backdrop-blur-md border-t border-stone-200 py-8 text-center text-sm text-stone-500">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div>
          <h4 className="font-bold text-stone-700 mb-3 uppercase tracking-wide text-xs">Important Links</h4>
          <ul className="space-y-1.5 text-xs font-medium">
            <li><a href="https://coal.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">Ministry of Coal, Govt. of India</a></li>
            <li><a href="https://www.coalindia.in/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">Coal India Limited (CIL)</a></li>
            <li><a href="https://dgms.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">Directorate General of Mines Safety (DGMS)</a></li>
            <li><a href="https://bcclweb.in/?page_id=6355" target="_blank" rel="noopener noreferrer" className="hover:text-orange-600 transition-colors">Bastacolla Area (BCCL)</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-stone-700 mb-3 uppercase tracking-wide text-xs">Nodal Contact</h4>
          <p className="text-xs font-medium leading-relaxed">
            Central Control Room, BCCL HQ<br/>
            Koyla Bhawan, Koyla Nagar, Dhanbad - 826005<br/>
            Toll-Free: 1800-111-2222<br/>
            Email: safety.bccl@coalindia.in
          </p>
        </div>
        <div className="flex flex-col items-center justify-center">
          <div className="flex gap-4 items-center">
            {/* Fake logos using text/css for now */}
            <div className="text-[10px] font-bold border-2 border-green-600/30 p-2 rounded-lg text-green-700 bg-green-50 shadow-sm uppercase tracking-wider">Swachh Bharat<br/><span className="font-normal text-[8px]">Ek Kadam Swachhata Ki Ore</span></div>
            <div className="text-[10px] font-bold border-2 border-orange-500/30 p-2 rounded-lg text-orange-600 bg-orange-50 shadow-sm uppercase tracking-wider">Azadi Ka<br/>Amrit Mahotsav</div>
          </div>
        </div>
      </div>
      <div className="pt-6 border-t border-stone-200/60 flex flex-col items-center gap-3">
        <div className="bg-stone-200/40 px-4 py-2 rounded-full border border-stone-300/50 backdrop-blur-sm shadow-sm hover:shadow transition-shadow">
          <p className="text-[11px] font-medium text-stone-600 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]"></span>
            Developed under the esteemed guidance of <span className="font-bold text-stone-800">Mr. Arun</span>, AGM, Bastacolla Area
          </p>
        </div>
        <div className="text-xs font-medium text-stone-500">
          &copy; {new Date().getFullYear()} Bharat Coking Coal Limited (A Subsidiary of Coal India Limited). All Rights Reserved.<br/>
          <span className="text-[10px] text-stone-400 mt-1 block text-center">Maintained by IT Department, BCCL Dhanbad</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
