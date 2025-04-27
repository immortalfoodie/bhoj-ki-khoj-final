
import React from 'react';

interface Alert {
  id: number;
  type: string;
  message: string;
  time: string;
}

interface AlertsListProps {
  alerts: Alert[];
}

const AlertsList = ({ alerts }: AlertsListProps) => {
  return (
    <div className="space-y-4">
      {alerts.map(alert => (
        <div key={alert.id} className="flex items-start border-b border-gray-100 pb-3 last:border-0">
          <div className="w-2 h-2 mt-1.5 bg-amber-400 rounded-full mr-3"></div>
          <div>
            <p className="text-sm font-medium">{alert.type}</p>
            <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
            <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
          </div>
        </div>
      ))}
      {alerts.length === 0 && (
        <div className="text-center py-4 text-sm text-gray-500">
          No alerts to display
        </div>
      )}
    </div>
  );
};

export default AlertsList;
