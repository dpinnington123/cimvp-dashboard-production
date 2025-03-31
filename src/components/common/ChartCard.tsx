import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  description?: string; // Optional description for the chart
  children: React.ReactNode; // The chart component itself will be passed here
  className?: string;
}

export default function ChartCard({
  title,
  description,
  children,
  className
}: ChartCardProps) {
  return (
    <Card className={cn("h-full flex flex-col", className)}> {/* Ensure card can flex vertically */}
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      {/* Make content area flexible to allow chart to take available space */}
      <CardContent className="flex-grow flex items-center justify-center h-full">
          {/* Ensure children (the chart) can fill the content area */}
          {/* You might need specific wrappers or sizing logic here depending on the chart library */}
          {children}
      </CardContent>
    </Card>
  );
} 