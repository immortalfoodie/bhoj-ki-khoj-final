
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
  icon: React.ReactNode;
}

const StatCard = ({ title, value, change, description, icon }: StatCardProps) => {
  return (
    <Card className="border-green-100">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className="p-2 bg-green-50 rounded-full">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center">
          <span className="text-xs text-green-600">{change}</span>
          <p className="text-xs text-muted-foreground ml-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;
