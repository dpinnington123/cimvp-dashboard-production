import React from "react";
import { cn } from "@/lib/utils";
interface LogoProps {
  variant?: "full" | "compact";
  className?: string;
}
const Logo: React.FC<LogoProps> = ({
  variant = "full",
  className
}) => {
  return <div className={cn("flex items-center", className)}>
      <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center shadow-md">
        <span className="text-lg font-bold text-white">C</span>
      </div>
      
      {variant === "full" && <div className="ml-3 leading-tight">
          
          
        </div>}
    </div>;
};
export default Logo;