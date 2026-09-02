import ThemeToggle from "./ThemeToggle";
import { Search } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-16 bg-white/80 dark:bg-[#2b2c40]/80 backdrop-blur-md sticky top-0 z-20 border-b border-[#ebe9f1] dark:border-slate-700/60 px-6 flex items-center justify-between transition-colors">
      <div className="relative w-72">
        <input
          type="text"
          placeholder="Search clients, models..."
          className="w-full pl-9 pr-4 py-1.5 rounded-lg bg-slate-50 dark:bg-[#1f2233] border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:border-brand-500 dark:text-white"
        />
        <Search size={14} className="absolute left-3 top-2.5 text-slate-400" />
      </div>

      <div className="flex items-center gap-3">
        <ThemeToggle />
        <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-slate-700 pl-3">
          <img
            src="https://i.pravatar.cc/100?img=33"
            alt="Profile"
            className="w-8 h-8 rounded-lg object-cover ring-2 ring-brand-500/20"
          />
          <div className="text-left leading-tight hidden sm:block">
            <p className="text-xs font-semibold text-[#5d596c] dark:text-white">Tanvir Ahmed</p>
            <p className="text-[10px] text-slate-400">Founder & CEO</p>
          </div>
        </div>
      </div>
    </header>
  );
}