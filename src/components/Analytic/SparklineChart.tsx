
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip } from 'recharts';

interface SparklineChartProps {
  data: { value: number }[];
  color: string;
}

const SparklineChart: React.FC<SparklineChartProps> = ({ data, color }) => {
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={data}>
        <Tooltip
          contentStyle={{
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderColor: color,
            color: '#fff',
            fontSize: '12px',
            padding: '4px 8px',
          }}
          labelFormatter={() => ''}
          formatter={(value: number) => [value, 'Rank']}
        />
        <Line type="monotone" dataKey="value" stroke={color} strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SparklineChart;
