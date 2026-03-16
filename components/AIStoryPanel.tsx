'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { BookOpen, RefreshCw } from 'lucide-react';

interface AIStoryPanelProps {
  data: any[];
  query: string;
  isLoading?: boolean;
}

export default function AIStoryPanel({ data, query, isLoading }: AIStoryPanelProps) {
  const [story, setStory] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (data && data.length > 0) {
      generateStory();
    }
  }, [data, query]);

  const generateStory = async () => {
    if (!data || data.length === 0) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, query }),
      });

      if (response.ok) {
        const result = await response.json();
        setStory(result.story);
      }
    } catch (error) {
      console.error('Failed to generate story:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!data || data.length === 0) return null;

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-emerald-900/20 border-slate-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">AI-Generated Insights</h3>
        </div>
        <Button
          onClick={generateStory}
          disabled={isGenerating || isLoading}
          size="sm"
          variant="outline"
          className="text-xs bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
        >
          {isGenerating ? (
            <>
              <Spinner className="w-3 h-3 mr-1" />
              Generating...
            </>
          ) : (
            <>
              <RefreshCw className="w-3 h-3 mr-1" />
              Regenerate
            </>
          )}
        </Button>
      </div>

      <div className="space-y-3">
        {isGenerating ? (
          <div className="flex items-center gap-3 py-4">
            <Spinner />
            <span className="text-slate-300">Analyzing data and generating insights...</span>
          </div>
        ) : story ? (
          <div className="prose prose-invert max-w-none">
            <p className="text-slate-200 leading-relaxed text-sm">{story}</p>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No story generated yet. Generate one to see AI insights.</p>
        )}
      </div>

      <div className="mt-4 pt-4 border-t border-slate-700">
        <p className="text-xs text-slate-400">
          💡 <span className="text-slate-300">This story was auto-generated based on your data query</span>
        </p>
      </div>
    </Card>
  );
}
