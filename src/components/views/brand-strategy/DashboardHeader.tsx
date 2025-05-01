
import { Home, Settings, Bell, Search, User } from "lucide-react";

const DashboardHeader = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="container mx-auto flex justify-between items-center h-16 px-4">
        <div className="flex items-center space-x-1">
          <div className="w-8 h-8 bg-emerald-500 rounded-md flex items-center justify-center">
            <span className="text-white font-bold">E</span>
          </div>
          <span className="font-bold text-gray-800">EcoBrand Compass</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <a href="#" className="text-gray-800 hover:text-emerald-600 flex items-center gap-1.5">
            <Home size={18} />
            <span>Dashboard</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-emerald-600 flex items-center gap-1.5">
            <span>Brand Profile</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-emerald-600 flex items-center gap-1.5">
            <span>Market</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-emerald-600 flex items-center gap-1.5">
            <span>Strategy</span>
          </a>
          <a href="#" className="text-gray-500 hover:text-emerald-600 flex items-center gap-1.5">
            <span>Campaigns</span>
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 hover:text-gray-700">
            <Search size={20} />
          </button>
          <button className="text-gray-500 hover:text-gray-700 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">3</span>
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            <Settings size={20} />
          </button>
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User size={16} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
