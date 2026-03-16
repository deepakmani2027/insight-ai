'use client';

import { MessageSquare, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConversationItem {
  id: string;
  query: string;
  timestamp: Date;
  chartType?: string;
  dataCount?: number;
}

interface ConversationHistoryProps {
  items: ConversationItem[];
  onSelectQuery: (query: string) => void;
  onClear: () => void;
}

export default function ConversationHistory({ items, onSelectQuery, onClear }: ConversationHistoryProps) {
  const sortedItems = [...items].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

  return (
    <Card className="bg-slate-900 border-slate-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold text-white text-sm">Conversation History</h3>
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-xs text-red-400 hover:text-red-300 hover:bg-slate-800"
          >
            <Trash2 className="w-3 h-3" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {sortedItems.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-4">No queries yet. Start by asking a question!</p>
        ) : (
          sortedItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectQuery(item.query)}
              className="w-full text-left p-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-300 text-xs transition-colors group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-slate-200 group-hover:text-white truncate font-medium">{item.query}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {item.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {item.chartType && (
                  <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded whitespace-nowrap">
                    {item.chartType}
                  </span>
                )}
              </div>
            </button>
          ))
        )}
      </div>
    </Card>
  );
}
