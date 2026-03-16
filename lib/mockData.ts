// Mock data generator for demo purposes
// This simulates the Amazon sales database without needing a backend

export interface MockDataPoint {
  [key: string]: string | number | Date;
}

// Sample Amazon sales data
const SAMPLE_DATA = {
  date: [
    '2024-01-01', '2024-01-05', '2024-01-10', '2024-01-15', '2024-01-20',
    '2024-02-01', '2024-02-10', '2024-02-20', '2024-03-01', '2024-03-15'
  ],
  category: ['Electronics', 'Fashion', 'Books', 'Sports', 'Beauty', 'Home & Kitchen'],
  region: ['North America', 'Asia', 'Europe', 'Middle East'],
  paymentMethod: ['UPI', 'Credit Card', 'Debit Card', 'Wallet', 'Cash on Delivery'],
  ratings: [1, 2, 3, 4, 5],
  discounts: [0, 5, 10, 15, 20, 25, 30]
};

export function generateMockRevenueOverTime() {
  const data = [];
  const startDate = new Date('2024-01-01');
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    data.push({
      date: date.toISOString().split('T')[0],
      revenue: Math.floor(Math.random() * 50000) + 20000
    });
  }
  
  return data;
}

export function generateMockRevenueByCategory() {
  return SAMPLE_DATA.category.map(cat => ({
    product_category: cat,
    revenue: Math.floor(Math.random() * 150000) + 50000
  }));
}

export function generateMockRevenueByRegion() {
  return SAMPLE_DATA.region.map(region => ({
    customer_region: region,
    revenue: Math.floor(Math.random() * 200000) + 100000
  }));
}

export function generateMockPaymentMethodDistribution() {
  return SAMPLE_DATA.paymentMethod.map(method => ({
    payment_method: method,
    count: Math.floor(Math.random() * 5000) + 1000
  }));
}

export function generateMockDiscountVsSales() {
  return SAMPLE_DATA.discounts.map(discount => ({
    discount_percent: discount,
    quantity: Math.floor(Math.random() * 2000) + 500 - (discount * 10)
  }));
}

export function generateMockRatingVsSales() {
  return SAMPLE_DATA.ratings.map(rating => ({
    rating: rating,
    quantity: Math.floor(Math.random() * 3000) + 1000 + (rating * 200)
  }));
}

// Chart-specific mock data generators
export const MOCK_DASHBOARD_DATA = {
  revenue_over_time: generateMockRevenueOverTime(),
  revenue_by_category: generateMockRevenueByCategory(),
  revenue_by_region: generateMockRevenueByRegion(),
  payment_method_distribution: generateMockPaymentMethodDistribution(),
  discount_vs_sales: generateMockDiscountVsSales(),
  rating_vs_sales: generateMockRatingVsSales()
};

export const CHART_TYPE_MAP: Record<string, string> = {
  revenue_over_time: 'line',
  revenue_by_category: 'bar',
  revenue_by_region: 'pie',
  payment_method_distribution: 'donut',
  discount_vs_sales: 'scatter',
  rating_vs_sales: 'scatter'
};

// Generate mock KPI data
export function generateMockKPIs() {
  const totalOrders = Math.floor(Math.random() * 50000) + 30000;
  const avgPrice = 450;
  const discountPercent = 0.15;
  
  return {
    revenue: Math.floor(totalOrders * avgPrice * (1 - discountPercent)),
    orders: totalOrders,
    products_sold: Math.floor(totalOrders * 1.5),
    avg_rating: parseFloat((Math.random() * 1 + 3.8).toFixed(2)),
    reviews: Math.floor(Math.random() * 25000) + 5000
  };
}

// Generate response for query-based chart data
export function generateMockQueryResponse(query: string) {
  const queryLower = query.toLowerCase();
  
  let data: MockDataPoint[] = [];
  let chartType = 'bar';
  let insights = '';
  
  // Revenue trend
  if (queryLower.includes('trend') || queryLower.includes('over time')) {
    data = generateMockRevenueOverTime();
    chartType = 'line';
    insights = 'Revenue shows a generally upward trend with seasonal variations. Peak revenue occurs mid-month, with an average of $35,000 daily. Consider increasing inventory during high-revenue periods to capitalize on demand.';
  }
  // Category revenue
  else if (queryLower.includes('category') || queryLower.includes('product')) {
    data = generateMockRevenueByCategory();
    chartType = 'bar';
    insights = 'Electronics leads in revenue generation with $145,000, followed by Fashion at $128,000. Home & Kitchen shows strong growth potential. Consider promotional campaigns for underperforming categories like Books.';
  }
  // Regional revenue
  else if (queryLower.includes('region')) {
    data = generateMockRevenueByRegion();
    chartType = 'pie';
    insights = 'Asia dominates regional sales with 35% market share and $245,000 revenue. North America contributes 30%, Europe 20%, and Middle East 15%. Focus on expanding infrastructure in high-performing regions.';
  }
  // Payment methods
  else if (queryLower.includes('payment') || queryLower.includes('method')) {
    data = generateMockPaymentMethodDistribution();
    chartType = 'donut';
    insights = 'Credit Cards are the preferred payment method (32% of transactions), followed by UPI (28%) and Digital Wallets (22%). Cash on Delivery remains popular in certain regions at 18%. Optimize for multi-payment support.';
  }
  // Discount analysis
  else if (queryLower.includes('discount')) {
    data = generateMockDiscountVsSales();
    chartType = 'scatter';
    insights = 'Sales volume decreases with higher discounts, indicating price elasticity. Optimal discount level appears to be 10-15% for maximizing total revenue. Excessive discounts (>25%) should be avoided unless for inventory clearance.';
  }
  // Rating analysis
  else if (queryLower.includes('rating')) {
    data = generateMockRatingVsSales();
    chartType = 'scatter';
    insights = '5-star rated products drive 3x more sales than 1-star items. Customer satisfaction directly correlates with sales performance. Invest in quality control to maintain high ratings and boost revenue.';
  }
  // Default: return category data
  else {
    data = generateMockRevenueByCategory();
    chartType = 'bar';
    insights = 'Based on your query, here\'s an analysis of revenue by product category. Electronics and Fashion are top performers. Consider adjusting inventory distribution based on these insights.';
  }
  
  return {
    success: true,
    sql_query: `SELECT * FROM amazon_sales WHERE ... (mock query)`,
    chart_type: chartType,
    data,
    insights,
    query_metadata: {
      has_time_component: queryLower.includes('trend') || queryLower.includes('time'),
      has_regional_component: queryLower.includes('region'),
      has_category_component: queryLower.includes('category') || queryLower.includes('product'),
      has_comparison: queryLower.includes('vs') || queryLower.includes('compare'),
      has_ranking: queryLower.includes('top') || queryLower.includes('best')
    }
  };
}
