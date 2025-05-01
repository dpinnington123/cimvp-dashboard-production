import { useState } from "react";
import BrandProfile from "@/components/views/brand-strategy/BrandProfile";
import MarketAnalysis from "@/components/views/brand-strategy/MarketAnalysis";
import CustomerAnalysis from "@/components/views/brand-strategy/CustomerAnalysis";
import StrategicObjectives from "@/components/views/brand-strategy/StrategicObjectives";
import BrandMessages from "@/components/views/brand-strategy/BrandMessages";
import ResearchFiles from "@/components/views/brand-strategy/ResearchFiles";
import MarketingCampaigns from "@/components/views/brand-strategy/MarketingCampaigns";
import { Button } from "@/components/ui/button";

export default function BrandStrategyPage() {
  // State to keep track of the active tab
  const [activeTab, setActiveTab] = useState("Brand Profile");

  // List of tab options with their labels
  const tabs = [
    { id: "Brand Profile", label: "Brand Profile" },
    { id: "Market", label: "Market" },
    { id: "Customers", label: "Customers" },
    { id: "Strategy", label: "Strategy" },
    { id: "Messages", label: "Messages" },
    { id: "Research", label: "Research" }
  ];

  // Map to render the correct component based on the active tab
  const getTabContent = () => {
    switch (activeTab) {
      case "Brand Profile":
        return <BrandProfile />;
      case "Market":
        return <MarketAnalysis />;
      case "Customers":
        return <CustomerAnalysis />;
      case "Strategy":
        return <StrategicObjectives />;
      case "Messages":
        return <BrandMessages />;
      case "Research":
        return <ResearchFiles />;
      default:
        return <BrandProfile />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header with title and description */}
      <div className="flex flex-col items-center justify-center py-8 text-center bg-white border-b border-gray-200">
        <h1 className="text-3xl font-bold">Brand Strategy</h1>
        <p className="text-muted-foreground mt-2">
          A comprehensive visualization of our marketing plan and brand strategy
        </p>
      </div>
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200 mx-auto">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center md:justify-start space-x-4 md:space-x-10">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`px-4 py-2 rounded-none border-b-2 transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "bg-white text-primary border-primary hover:bg-white"
                    : "text-gray-600 border-transparent hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 container mx-auto py-6 px-4">
        {getTabContent()}
      </div>
    </div>
  );
} 