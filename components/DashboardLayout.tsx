'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import QueryInput from '@/components/QueryInput';
import KpiCards from '@/components/KpiCards';
import ChartContainer from '@/components/ChartContainer';
import InsightsPanel from '@/components/InsightsPanel';
import AIStoryPanel from '@/components/AIStoryPanel';
import CSVUpload from '@/components/CSVUpload';
import ConversationHistory from '@/components/ConversationHistory';
import QueryStatus from '@/components/QueryStatus';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QueryResult {
  success: boolean;
  sql_query: string | null;
  chart_type: string;
  data: any[];
  insights: string | null;
  error: string | null;
  query_metadata?: any;
}

interface KPIData {
  revenue: number;
  orders: number;
  products_sold: number;
  avg_rating: number;
  reviews: number;
}

interface ConversationItem {
  id: string;
  query: string;
  timestamp: Date;
  chartType?: string;
  dataCount?: number;
}

type DashboardChartKey =
  | 'revenue_over_time'
  | 'revenue_by_category'
  | 'revenue_by_region'
  | 'payment_method_distribution'
  | 'top_products'
  | 'discount_vs_sales'
  | 'rating_vs_sales';

type MenuItem = 'dashboard' | 'features' | 'data' | 'analytics' | 'bonus' | 'settings';

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeMenu, setActiveMenu] = useState<MenuItem>('dashboard');
  const [activeSubmenu, setActiveSubmenu] = useState<string>('overview');

  const [isLoading, setIsLoading] = useState(false);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [displayedKpis, setDisplayedKpis] = useState<KPIData | null>(null);
  const [chartData, setChartData] = useState<any[]>([]);
  const [chartType, setChartType] = useState<string>('bar');
  const [insights, setInsights] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [queryStatus, setQueryStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [sqlQuery, setSqlQuery] = useState<string>('');
  const [queryMetadata, setQueryMetadata] = useState<any>(null);

  const [conversationHistory, setConversationHistory] = useState<ConversationItem[]>([]);
  const [kpiLoading, setKpiLoading] = useState(true);
  const [dashboardInsights, setDashboardInsights] = useState<string | null>(null);
  const [dashboardInsightsLoading, setDashboardInsightsLoading] = useState(false);
  const [dashboardCharts, setDashboardCharts] = useState<Record<DashboardChartKey, { data: any[]; chartType: string; loading: boolean }>>({
    revenue_over_time: { data: [], chartType: 'line', loading: true },
    revenue_by_category: { data: [], chartType: 'bar', loading: true },
    revenue_by_region: { data: [], chartType: 'pie', loading: true },
    payment_method_distribution: { data: [], chartType: 'donut', loading: true },
    top_products: { data: [], chartType: 'bar', loading: true },
    discount_vs_sales: { data: [], chartType: 'scatter', loading: true },
    rating_vs_sales: { data: [], chartType: 'scatter', loading: true },
  });

  const deriveKpisFromData = (data: any[], fallback: KPIData | null): KPIData | null => {
    if (!data || data.length === 0) return fallback;

    const safeNumber = (v: any) => (typeof v === 'number' ? v : Number(v) || 0);

    const revenue = data.reduce((sum, row) => sum + (safeNumber(row.total_revenue) || safeNumber(row.revenue) || 0), 0);
    const orders = data.length;
    const products_sold = data.reduce((sum, row) => sum + (safeNumber(row.quantity_sold) || 0), 0);
    const ratings = data.map((row) => safeNumber(row.rating)).filter((v) => v > 0);
    const avg_rating = ratings.length ? ratings.reduce((a, b) => a + b, 0) / ratings.length : fallback?.avg_rating || 0;
    const reviews = data.reduce((sum, row) => sum + (safeNumber(row.review_count) || 0), 0) || fallback?.reviews || 0;

    // If nothing meaningful calculated, keep fallback
    const hasMeaningful = revenue > 0 || products_sold > 0 || orders > 0;
    if (!hasMeaningful) return fallback;

    return {
      revenue,
      orders,
      products_sold,
      avg_rating,
      reviews,
    };
  };

  const loadKPIs = async () => {
    try {
      setKpiLoading(true);
      const response = await fetch('/api/kpis');
      if (response.ok) {
        const data = await response.json();
        setKpiData(data);
        setDisplayedKpis(data);
      }
    } catch (err) {
      console.error('Failed to load KPIs:', err);
    } finally {
      setKpiLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      setKpiLoading(true);

      // Mark all charts as loading before fetch
      setDashboardCharts((prev) => {
        const updated: typeof prev = { ...prev };
        Object.keys(updated).forEach((key) => {
          const typedKey = key as DashboardChartKey;
          updated[typedKey] = { ...updated[typedKey], loading: true };
        });
        return updated;
      });

      const response = await fetch('/api/dashboard-data');
      if (!response.ok) throw new Error('Failed to load dashboard data');

      const payload = await response.json();

      // KPIs
      if (payload?.kpis) {
        setKpiData(payload.kpis);
        setDisplayedKpis(payload.kpis);
      }

      // Charts
      const chartMappings: Record<DashboardChartKey, { key: string; fallbackType: string }> = {
        revenue_over_time: { key: 'revenue_trend', fallbackType: 'line' },
        revenue_by_category: { key: 'category_sales', fallbackType: 'bar' },
        revenue_by_region: { key: 'region_sales', fallbackType: 'pie' },
        payment_method_distribution: { key: 'payment_methods', fallbackType: 'donut' },
        top_products: { key: 'top_products', fallbackType: 'bar' },
        discount_vs_sales: { key: 'discount_sales', fallbackType: 'scatter' },
        rating_vs_sales: { key: 'rating_sales', fallbackType: 'scatter' },
      };

      setDashboardCharts((prev) => {
        const next: typeof prev = { ...prev };

        (Object.keys(chartMappings) as DashboardChartKey[]).forEach((id) => {
          const mapping = chartMappings[id];
          const chartFromPayload = payload?.charts?.[id];
          const chartData = chartFromPayload?.data ?? payload?.[mapping.key] ?? [];
          const chartType = chartFromPayload?.chart_type ?? mapping.fallbackType;
          next[id] = { data: chartData || [], chartType, loading: false };
        });

        return next;
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setKpiLoading(false);
    }
  };

  // Load KPIs and charts on mount
  useEffect(() => {
    loadDashboardData();
    loadDashboardInsights();
  }, []);

  const loadDashboardCharts = async () => {
    const chartIds: DashboardChartKey[] = [
      'revenue_over_time',
      'revenue_by_category',
      'revenue_by_region',
      'payment_method_distribution',
      'top_products',
      'discount_vs_sales',
      'rating_vs_sales',
    ];

    // Mark all charts as loading
    setDashboardCharts((prev) => {
      const updated = { ...prev };
      chartIds.forEach((id) => {
        updated[id] = { ...prev[id], loading: true };
      });
      return updated;
    });

    await Promise.all(
      chartIds.map(async (chartId) => {
        try {
          const response = await fetch('/api/dashboard-chart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ chart_id: chartId }),
          });

          if (!response.ok) {
            throw new Error(`Backend error for ${chartId}`);
          }

          const result = await response.json();
          setDashboardCharts((prev) => ({
            ...prev,
            [chartId]: {
              data: result.data || [],
              chartType: result.chart_type || prev[chartId]?.chartType || 'bar',
              loading: false,
            },
          }));
        } catch (err) {
          console.error(`Failed to load chart ${chartId}:`, err);
          setDashboardCharts((prev) => ({
            ...prev,
            [chartId]: { ...prev[chartId], loading: false },
          }));
        }
      })
    );
  };

  const loadDashboardInsights = async () => {
    try {
      setDashboardInsightsLoading(true);
      const response = await fetch('/api/dashboard-insights');
      if (!response.ok) throw new Error('Failed to fetch insights');
      const data = await response.json();
      if (data?.insights && Array.isArray(data.insights)) {
        setDashboardInsights(data.insights.join('\n'));
      } else {
        setDashboardInsights(null);
      }
    } catch (err) {
      console.error('Failed to load dashboard insights:', err);
      setDashboardInsights(null);
    } finally {
      setDashboardInsightsLoading(false);
    }
  };

  const chartSections: {
    title: string;
    charts: { id: DashboardChartKey; title: string; fallbackType: string }[];
  }[] = [
    {
      title: 'Sales Analysis',
      charts: [
        { id: 'revenue_over_time', title: 'Revenue Trend', fallbackType: 'line' },
        { id: 'revenue_by_category', title: 'Revenue by Category', fallbackType: 'bar' },
      ],
    },
    {
      title: 'Customer Analysis',
      charts: [
        { id: 'revenue_by_region', title: 'Revenue by Region', fallbackType: 'pie' },
        { id: 'payment_method_distribution', title: 'Payment Method Usage', fallbackType: 'donut' },
      ],
    },
    {
      title: 'Product Analysis',
      charts: [
        { id: 'top_products', title: 'Top Products', fallbackType: 'bar' },
        { id: 'rating_vs_sales', title: 'Rating vs Sales', fallbackType: 'scatter' },
      ],
    },
    {
      title: 'Discount Analysis',
      charts: [
        { id: 'discount_vs_sales', title: 'Discount vs Sales', fallbackType: 'scatter' },
      ],
    },
  ];

  const getChartProps = (id: DashboardChartKey, fallbackType: string) => {
    const chart = dashboardCharts[id];
    return {
      data: chart?.data || [],
      chartType: chart?.chartType || fallbackType,
      isLoading: chart?.loading ?? false,
    };
  };

  const handleQuery = async (query: string, isFollowup: boolean = false) => {
    setIsLoading(true);
    setQueryStatus('loading');
    setError(null);

    try {
      const response = await fetch('/api/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, is_followup: isFollowup }),
      });

      if (!response.ok) {
        throw new Error('Failed to process query');
      }

      const result: QueryResult = await response.json();

      if (result.success) {
        setChartData(result.data || []);
        setChartType(result.chart_type || 'bar');
        setInsights(result.insights || null);
        setSqlQuery(result.sql_query || '');
        setQueryMetadata(result.query_metadata || null);
        setQueryStatus('success');

        // Derive KPIs from the current query result; fall back to backend KPIs
        const derived = deriveKpisFromData(result.data || [], kpiData);
        setDisplayedKpis(derived || kpiData);

        // Add to conversation history
        const newItem: ConversationItem = {
          id: Date.now().toString(),
          query,
          timestamp: new Date(),
          chartType: result.chart_type,
          dataCount: result.data?.length || 0,
        };
        setConversationHistory((prev) => [newItem, ...prev]);
      } else {
        setError(result.error || 'Failed to process query');
        setQueryStatus('error');
        setDisplayedKpis(kpiData);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      setQueryStatus('error');
      setDisplayedKpis(kpiData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigate = (menu: string, submenu?: string) => {
    setActiveMenu(menu as MenuItem);
    if (submenu) {
      setActiveSubmenu(submenu);
    }
  };

  const handleSelectFromHistory = (query: string) => {
    handleQuery(query, true);
  };

  const handleClearHistory = () => {
    setConversationHistory([]);
  };

  // Content rendering based on active menu
  const renderContent = () => {
    switch (activeMenu) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-white">Dashboard</h1>
                <p className="text-slate-400 mt-1">AI-powered business intelligence for your data</p>
              </div>
              <Button
                onClick={() => {
                  loadDashboardData();
                  loadDashboardInsights();
                }}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Query Input and Status */}
            <div className="space-y-4">
              <QueryInput onSubmit={handleQuery} isLoading={isLoading} lastQuery={'Sample Query'} />
              <QueryStatus
                status={queryStatus}
                message="Processing your query..."
                error={error}
                metadata={queryMetadata}
                sqlQuery={sqlQuery}
              />
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-white font-semibold">Upload CSV</h3>
                    <p className="text-slate-400 text-sm">Ingest a new dataset directly from the dashboard.</p>
                  </div>
                </div>
                <CSVUpload />
              </div>
            </div>

            {/* KPI Cards */}
            <KpiCards kpiData={displayedKpis} isLoading={kpiLoading} />

            {/* Ad-hoc Query Results */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <ChartContainer
                  data={chartData}
                  chartType={chartType}
                  title="Query Results"
                  isLoading={isLoading}
                />
              </div>
              <div className="space-y-4">
                <InsightsPanel insights={insights} isLoading={isLoading && queryStatus === 'loading'} />
                {chartData.length > 0 && (
                  <AIStoryPanel data={chartData} query={sqlQuery} isLoading={isLoading} />
                )}
              </div>
            </div>

            {/* Structured Dashboard Sections */}
            {chartSections.map((section) => (
              <div key={section.title} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">{section.title}</h2>
                  <span className="text-xs text-slate-400">Amazon Sales dataset</span>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {section.charts.map((chart) => {
                    const chartProps = getChartProps(chart.id, chart.fallbackType);
                    return (
                      <ChartContainer
                        key={chart.id}
                        data={chartProps.data}
                        chartType={chartProps.chartType}
                        title={chart.title}
                        isLoading={chartProps.isLoading}
                      />
                    );
                  })}
                </div>
              </div>
            ))}

            {/* AI Insights Panel */}
            <InsightsPanel insights={dashboardInsights} isLoading={dashboardInsightsLoading} />

            {/* Conversation History */}
            <ConversationHistory
              items={conversationHistory}
              onSelectQuery={handleSelectFromHistory}
              onClear={handleClearHistory}
            />
          </div>
        );

      case 'data':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Data Management</h1>
              <p className="text-slate-400 mt-1">Upload and manage your datasets</p>
            </div>

            {activeSubmenu === 'upload' && <CSVUpload />}
            {activeSubmenu === 'schema' && (
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
                <h2 className="text-xl font-bold text-white mb-4">Database Schema</h2>
                <div className="bg-slate-800 rounded-lg p-4">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left text-slate-300 py-2">Column</th>
                        <th className="text-left text-slate-300 py-2">Type</th>
                        <th className="text-left text-slate-300 py-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-400">
                      <tr className="border-b border-slate-700">
                        <td className="py-2">order_id</td>
                        <td>INT</td>
                        <td>Unique order identifier</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2">order_date</td>
                        <td>DATE</td>
                        <td>Date of the order</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2">product_category</td>
                        <td>TEXT</td>
                        <td>Product category</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2">total_revenue</td>
                        <td>FLOAT</td>
                        <td>Total revenue amount</td>
                      </tr>
                      <tr className="border-b border-slate-700">
                        <td className="py-2">customer_region</td>
                        <td>TEXT</td>
                        <td>Customer region</td>
                      </tr>
                      <tr>
                        <td className="py-2">rating</td>
                        <td>FLOAT</td>
                        <td>Product rating</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );

      case 'bonus':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Bonus Features</h1>
              <p className="text-slate-400 mt-1">Advanced AI capabilities</p>
            </div>

            {activeSubmenu === 'storytelling' && chartData.length > 0 && (
              <AIStoryPanel data={chartData} query={sqlQuery} isLoading={isLoading} />
            )}

            {activeSubmenu === 'storytelling' && chartData.length === 0 && (
              <Alert className="bg-blue-500/10 border-blue-500/30">
                <AlertCircle className="w-4 h-4 text-blue-400" />
                <AlertDescription className="text-blue-300 ml-2">
                  Run a query first to generate AI storytelling from your latest results.
                </AlertDescription>
              </Alert>
            )}
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Settings</h1>
              <p className="text-slate-400 mt-1">Configure your dashboard</p>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-white font-semibold mb-2">API Configuration</h3>
                  <p className="text-slate-400 text-sm">Backend API is running on http://localhost:8000</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Database</h3>
                  <p className="text-slate-400 text-sm">SQLite database: amazon_sales.db</p>
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-2">Features</h3>
                  <ul className="text-slate-400 text-sm space-y-1">
                    <li>✓ Conversational Query Engine</li>
                    <li>✓ Dynamic Dashboard Generator</li>
                    <li>✓ AI Chart Selection</li>
                    <li>✓ KPI Metrics Engine</li>
                    <li>✓ Interactive Charts</li>
                    <li>✓ AI Insights Generator</li>
                    <li>✓ Follow-up Query System</li>
                    <li>✓ CSV Upload Data Engine</li>
                    <li>✓ Voice Query</li>
                    <li>✓ AI Storytelling</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-white">Select a section to continue</h2>
            <p className="text-slate-400 mt-2">Use the sidebar to navigate</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-950">
      {/* Sidebar */}
      <Sidebar onNavigate={handleNavigate} isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main Content */}
      <div
        className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}
        style={{ overflow: 'auto' }}
      >
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
