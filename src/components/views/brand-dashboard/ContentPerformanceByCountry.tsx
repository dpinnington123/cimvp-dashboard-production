
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { demoData } from "@/assets/avatars";
import { Globe } from "lucide-react";

const ContentPerformanceByCountry: React.FC = () => {
  return <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Content by Country</CardTitle>
              <CardDescription>Performance across markets</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="top" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="table">Table</TabsTrigger>
            <TabsTrigger value="top">Top Performers</TabsTrigger>
          </TabsList>
          
          <TabsContent value="table" className="w-full">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Country</TableHead>
                    <TableHead className="text-right">Quality Score</TableHead>
                    <TableHead className="text-right">Customer Centricity</TableHead>
                    <TableHead className="text-right">Engagement</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {demoData.contentPerformance.byCountry.map((item, index) => <TableRow key={index} className="group transition-colors" style={{
                  animationDelay: `${index * 0.1}s`,
                  opacity: 0,
                  animation: 'fade-in 0.5s ease-out forwards'
                }}>
                      <TableCell className="font-medium">{item.country}</TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${item.quality >= 85 ? 'text-emerald-600' : ''}`}>
                          {item.quality}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${item.centricity >= 80 ? 'text-emerald-600' : ''}`}>
                          {item.centricity}%
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${item.engagement >= 75 ? 'text-emerald-600' : ''}`}>
                          {item.engagement}%
                        </span>
                      </TableCell>
                    </TableRow>)}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          <TabsContent value="top">
            <div className="space-y-4">
              {demoData.contentPerformance.byCountry.sort((a, b) => b.quality - a.quality).slice(0, 3).map((item, index) => <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 text-primary p-2 rounded-full">
                        <Globe className="h-4 w-4" />
                      </div>
                      <span className="font-medium">{item.country}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Quality</div>
                        <div className="font-medium">{item.quality}%</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-muted-foreground">Centricity</div>
                        <div className="font-medium">{item.centricity}%</div>
                      </div>
                    </div>
                  </div>)}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
};
export default ContentPerformanceByCountry;
