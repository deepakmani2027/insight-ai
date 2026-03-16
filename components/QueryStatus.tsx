'use client';

import { AlertCircle, CheckCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface QueryMetadata {
  detected_intent?: string;
  entities?: string[];
  timeframe?: string;
  aggregation_type?: string;
}

interface QueryStatusProps {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
  error?: string;
  metadata?: QueryMetadata;
  sqlQuery?: string;
}

export default function QueryStatus({ status, message, error, metadata, sqlQuery }: QueryStatusProps) {
  if (status === 'idle') return null;

  return (
    <div className="space-y-2">
      {status === 'loading' && (
        <Alert className="bg-blue-500/10 border-blue-500/30">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <AlertDescription className="text-blue-300">{message || 'Processing your query...'}</AlertDescription>
          </div>
        </Alert>
      )}

      {status === 'error' && error && (
        <Alert className="bg-red-500/10 border-red-500/30">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <AlertDescription className="text-red-300 ml-2">{error}</AlertDescription>
        </Alert>
      )}

      {status === 'success' && (
        <>
          <Alert className="bg-green-500/10 border-green-500/30">
            <CheckCircle className="w-4 h-4 text-green-400" />
            <AlertDescription className="text-green-300 ml-2">Query processed successfully!</AlertDescription>
          </Alert>

          {metadata && (
            <Card className="bg-slate-800/50 border-slate-700 p-3 text-xs">
              <div className="space-y-2">
                {metadata.detected_intent && (
                  <div>
                    <span className="text-slate-400">Intent: </span>
                    <span className="text-slate-200">{metadata.detected_intent}</span>
                  </div>
                )}
                {metadata.aggregation_type && (
                  <div>
                    <span className="text-slate-400">Aggregation: </span>
                    <span className="text-slate-200">{metadata.aggregation_type}</span>
                  </div>
                )}
                {metadata.timeframe && (
                  <div>
                    <span className="text-slate-400">Timeframe: </span>
                    <span className="text-slate-200">{metadata.timeframe}</span>
                  </div>
                )}
                {metadata.entities && metadata.entities.length > 0 && (
                  <div>
                    <span className="text-slate-400">Data Points: </span>
                    <span className="text-slate-200">{metadata.entities.join(', ')}</span>
                  </div>
                )}
              </div>
            </Card>
          )}

          {sqlQuery && (
            <Card className="bg-slate-800/50 border-slate-700 p-3 text-xs">
              <div className="text-slate-400 mb-1">Generated SQL:</div>
              <code className="text-slate-300 block overflow-x-auto bg-slate-900/50 p-2 rounded text-xs break-words">
                {sqlQuery}
              </code>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
