
import React from 'react';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer
} from 'recharts';

interface ChartData {
  [key: string]: any;
}

interface AnalyticsChartProps {
  data: ChartData[];
  type: 'line' | 'bar';
  dataKey: string;
  xAxisKey?: string;
  color?: string;
  height?: number;
}

const AnalyticsChart = ({ 
  data, 
  type, 
  dataKey, 
  xAxisKey = 'name', 
  color = "#10B981", 
  height = 300 
}: AnalyticsChartProps) => {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        {type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey={dataKey}
              stroke={color}
              strokeWidth={2}
              dot={{ stroke: color, strokeWidth: 2, r: 4 }}
              activeDot={{ stroke: color, strokeWidth: 2, r: 6 }}
            />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey={xAxisKey} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default AnalyticsChart;
