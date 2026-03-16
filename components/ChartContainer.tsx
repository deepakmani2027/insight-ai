'use client';

import { Card } from '@/components/ui/card';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';

interface ChartContainerProps {
  chartType: string;
  data: any[];
  title: string;
  isLoading?: boolean;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#14B8A6', '#6366F1'];

export default function ChartContainer({
  chartType,
  data,
  title,
  isLoading = false,
}: ChartContainerProps) {
  if (isLoading) {
    return (
      <Card className="p-6 bg-slate-800 border-slate-700 h-96 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
          <p className="text-slate-400">Generating chart...</p>
        </div>
      </Card>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="p-6 bg-slate-800 border-slate-700 h-96 flex items-center justify-center">
        <div className="text-center text-slate-400">
          <p>No data available</p>
        </div>
      </Card>
    );
  }

  const renderChart = () => {
    const keys = data.length > 0 ? Object.keys(data[0]) : [];
    const xKey = keys[0] || 'name';
    const yKey = keys.length > 1 ? keys[1] : 'value';

    switch (chartType) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey={yKey}
                stroke="#2563EB"
                strokeWidth={2}
                dot={{ fill: '#2563EB', r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={yKey}
                nameKey={xKey}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                label
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E2E8F0' }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart
              margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              data={data}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#94A3B8" />
              <YAxis dataKey={yKey} stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Scatter name="Data" data={data} fill="#2563EB" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default: // bar
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={xKey} stroke="#94A3B8" />
              <YAxis stroke="#94A3B8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: '1px solid #475569',
                  borderRadius: '8px',
                }}
                labelStyle={{ color: '#E2E8F0' }}
              />
              <Legend />
              <Bar dataKey={yKey} fill="#2563EB" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
    }
  };

  return (
    <Card className="p-6 bg-slate-800 border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {renderChart()}
    </Card>
  );
}
