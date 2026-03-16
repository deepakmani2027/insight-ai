'use client';

import { Card } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface InsightsPanelProps {
  insights: string | null;
  isLoading?: boolean;
}

export default function InsightsPanel({ insights, isLoading = false }: InsightsPanelProps) {
  if (!insights && !isLoading) {
    return null;
  }

  return (
    <Card className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 border-slate-700">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600">
          <Lightbulb className="w-5 h-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-white">AI Insights</h3>
      </div>

      <div className="space-y-3">
        {isLoading ? (
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded animate-pulse" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-5/6" />
            <div className="h-4 bg-slate-700 rounded animate-pulse w-4/6" />
          </div>
        ) : insights ? (
          <div className="text-slate-300 whitespace-pre-wrap text-sm leading-relaxed">
            {insights}
          </div>
        ) : (
          <p className="text-slate-400 text-sm">
            Generate a query to see AI-powered insights about your data.
          </p>
        )}
      </div>
    </Card>
  );
}
