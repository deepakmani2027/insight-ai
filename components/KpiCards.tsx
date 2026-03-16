'use client';

import { Card } from '@/components/ui/card';
import { TrendingUp, Package, Star, MessageSquare, DollarSign } from 'lucide-react';

interface KPI {
  revenue: number;
  orders: number;
  products_sold: number;
  avg_rating: number;
  reviews: number;
}

interface KpiCardsProps {
  kpiData: KPI | null;
  isLoading: boolean;
}

export default function KpiCards({ kpiData, isLoading }: KpiCardsProps) {
  const formatCurrency = (value?: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(Number(value) || 0);

  const formatNumber = (value?: number) =>
    new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Number(value) || 0);

  const kpis = [
    {
      label: 'Total Revenue',
      value: formatCurrency(kpiData?.revenue),
      icon: DollarSign,
      color: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Total Orders',
      value: formatNumber(kpiData?.orders),
      icon: Package,
      color: 'from-green-500 to-green-600',
    },
    {
      label: 'Products Sold',
      value: formatNumber(kpiData?.products_sold),
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
    },
    {
      label: 'Avg Rating',
      value:
        kpiData?.avg_rating !== undefined && kpiData?.avg_rating !== null
          ? `${typeof kpiData.avg_rating === 'number' ? kpiData.avg_rating.toFixed(1) : parseFloat(String(kpiData.avg_rating)).toFixed(1)} ⭐`
          : '0 ⭐',
      icon: Star,
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, idx) => {
        const Icon = kpi.icon;
        return (
          <Card
            key={idx}
            className="p-6 bg-slate-800 border-slate-700 overflow-hidden relative group"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${kpi.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-slate-400">{kpi.label}</p>
                <div className={`p-2 rounded-lg bg-gradient-to-br ${kpi.color}`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold text-white">
                {isLoading ? '...' : kpi.value}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
