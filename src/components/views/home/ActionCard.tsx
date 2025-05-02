
import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  color: string;
  hoverColor: string;
}

const ActionCard = ({ title, description, icon, onClick, color, hoverColor }: ActionCardProps) => {
  return (
    <Card 
      className={cn(
        "p-6 cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-md flex flex-col items-center text-center",
        color,
        hoverColor
      )}
      onClick={onClick}
    >
      <div className="bg-white p-4 rounded-full mb-4 shadow-sm bg-gradient-to-br from-white to-gray-50 border border-gray-100">
        {icon}
      </div>
      
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </Card>
  );
};

export default ActionCard;
