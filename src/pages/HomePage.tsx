import React from 'react';
import { useNavigate } from 'react-router-dom';
import ActionCard from '@/components/views/home/ActionCard';
import { FileText, BarChart2, Grid } from 'lucide-react';
import chameleonImage from '@/assets/ChangeInfluence-character.png';
import Header from '@/components/layout/Header';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/layout/AppSidebar';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-b from-white to-slate-50">
        {/* Sidebar included but hidden on mobile */}
        <AppSidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <Header />
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
            <div className="flex flex-col items-center justify-center">
              {/* Logo and Welcome Section */}
              <div className="flex flex-col items-center mb-12 mt-8">
                <img 
                  src={chameleonImage} 
                  alt="Change Influence Chameleon" 
                  className="w-auto h-40 mb-8"
                />
                
                <div className="text-center">
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back, <span className="text-purple-600">Alex</span>!
                  </h1>
                  <p className="text-gray-600 text-lg">What would you like to do today?</p>
                </div>
              </div>
              
              {/* Action Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
                <ActionCard
                  title="Analyze Content"
                  description="Review and optimize your content performance across channels."
                  icon={<FileText className="w-6 h-6 text-blue-500" />}
                  onClick={() => navigate('/process-content')}
                  color="bg-blue-50"
                  hoverColor="hover:bg-blue-100"
                />
                
                <ActionCard
                  title="Campaign Dashboard"
                  description="Track and manage your ongoing marketing campaigns."
                  icon={<BarChart2 className="w-6 h-6 text-purple-500" />}
                  onClick={() => navigate('/campaign-planner')}
                  color="bg-purple-50"
                  hoverColor="hover:bg-purple-100"
                />
                
                <ActionCard
                  title="Brand Dashboard"
                  description="Monitor your brand health metrics and audience perception."
                  icon={<Grid className="w-6 h-6 text-orange-500" />}
                  onClick={() => navigate('/brand-dashboard')}
                  color="bg-orange-50"
                  hoverColor="hover:bg-orange-100"
                />
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 text-center text-gray-500 text-sm mt-12">
              © 2025 Change Influence Analytics. All rights reserved.
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default HomePage; 