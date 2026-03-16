'use client';

import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Spinner } from '@/components/ui/spinner';
import { Card } from '@/components/ui/card';

interface DashboardChartsProps {
  isLoading?: boolean;
}

const COLORS = ['#2563EB', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#F97316'];

const chartConfigs = [
  {
    id: 'revenue_over_time',
    title: 'Revenue Over Time',
    description: 'Sales growth trend',
    type: 'line',
  },
  {
    id: 'revenue_by_category',
    title: 'Revenue by Product Category',
    description: 'Category-wise revenue distribution',
    type: 'bar',
  },
  {
    id: 'revenue_by_region',
    title: 'Revenue by Region',
    description: 'Regional sales performance',
    type: 'pie',
  },
  {
    id: 'payment_method_distribution',
    title: 'Payment Method Distribution',
    description: 'Popular payment methods',
    type: 'donut',
  },
  {
    id: 'top_products',
    title: 'Top Products by Revenue',
    description: 'Top 10 products driving revenue',
    type: 'bar',
  },
  {
    id: 'discount_vs_sales',
    title: 'Discount vs Sales Volume',
    description: 'Impact of discounts on sales',
    type: 'scatter',
  },
  {
    id: 'rating_vs_sales',
    title: 'Rating vs Sales Volume',
    description: 'Correlation between ratings and sales',
    type: 'scatter',
  },
];

export default function DashboardCharts({ isLoading = false }: DashboardChartsProps) {
  const [chartsData, setChartsData] = useState<{ [key: string]: any }>({});
  const [loadingCharts, setLoadingCharts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Load all dashboard charts on mount
    loadAllCharts();
  }, []);

  const loadAllCharts = async () => {
    const newData: { [key: string]: any } = {};
    const newLoading = new Set<string>();

    for (const chart of chartConfigs) {
      newLoading.add(chart.id);
    }
    setLoadingCharts(newLoading);

    for (const chart of chartConfigs) {
      try {
        const response = await fetch('/api/dashboard-chart', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ chart_id: chart.id }),
        });

        if (response.ok) {
          const result = await response.json();
          newData[chart.id] = result.data || [];
        }
      } catch (error) {
        console.error(`Failed to load chart ${chart.id}:`, error);
      }

      newLoading.delete(chart.id);
      setLoadingCharts(new Set(newLoading));
    }

    setChartsData(newData);
  };

  const renderChart = (config: any, data: any[]) => {
    if (!data || data.length === 0) return null;

    const getXAxisKey = () => Object.keys(data[0])[0];
    const getYAxisKey = () => Object.keys(data[0])[1] || 'value';

    switch (config.type) {
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={getXAxisKey()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey={getYAxisKey()}
                stroke="#2563EB"
                dot={false}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={getXAxisKey()} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={getYAxisKey()} fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={getYAxisKey()}
                nameKey={getXAxisKey()}
                cx="50%"
                cy="50%"
                outerRadius={80}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'donut':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                dataKey={getYAxisKey()}
                nameKey={getXAxisKey()}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
              >
                {data.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey={getXAxisKey()} />
              <YAxis dataKey={getYAxisKey()} />
              <Tooltip />
              <Legend />
              <Scatter name={getYAxisKey()} data={data} fill="#8B5CF6" />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {chartConfigs.map((config) => (
        <Card key={config.id} className="bg-slate-800 border-slate-700 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-white">{config.title}</h3>
            <p className="text-sm text-slate-400">{config.description}</p>
          </div>

          {loadingCharts.has(config.id) ? (
            <div className="flex items-center justify-center h-[300px]">
              <Spinner />
            </div>
          ) : (
            renderChart(config, chartsData[config.id] || [])
          )}
        </Card>
      ))}
    </div>
  );
}
