'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { ArrowRight, Mic, Upload } from 'lucide-react';

interface QueryInputProps {
  onSubmit: (query: string, isFollowup?: boolean) => Promise<void>;
  isLoading: boolean;
  lastQuery?: string;
}

export default function QueryInput({ onSubmit, isLoading, lastQuery }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !isLoading) {
      const isFollowup = lastQuery && lastQuery !== query;
      await onSubmit(query, isFollowup);
      setQuery('');
    }
  };

  const startVoiceRecognition = () => {
    if (!isVoiceSupported) return;

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsVoiceSupported(false);
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);

      recognitionRef.current.onresult = (event: any) => {
        let interim_transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            setQuery(transcript);
          } else {
            interim_transcript += transcript;
          }
        }
      };

      recognitionRef.current.onerror = () => {
        setIsListening(false);
      };
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="w-full">
        <div className="flex gap-2 items-center">
          <div className="flex-1">
            <Input
              placeholder="Ask your data anything... (e.g., 'Show revenue by region')"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              disabled={isLoading}
              className="h-12 text-base bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
            />
          </div>

          {isVoiceSupported && (
            <Button
              type="button"
              onClick={startVoiceRecognition}
              disabled={isLoading}
              variant={isListening ? 'destructive' : 'outline'}
              className="h-12 px-4 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              title="Voice Query (Click to start/stop listening)"
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-pulse' : ''}`} />
            </Button>
          )}

          <Button
            type="submit"
            disabled={isLoading || !query.trim()}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" />
                Generating...
              </>
            ) : (
              <>
                <ArrowRight className="w-4 h-4 mr-2" />
                Generate
              </>
            )}
          </Button>
        </div>
      </form>

      {isListening && (
        <div className="flex items-center gap-2 text-blue-400 text-sm">
          <div className="flex gap-1">
            <div className="w-1 h-3 bg-blue-400 animate-bounce" style={{ animationDelay: '0s' }} />
            <div className="w-1 h-3 bg-blue-400 animate-bounce" style={{ animationDelay: '0.1s' }} />
            <div className="w-1 h-3 bg-blue-400 animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          Listening...
        </div>
      )}

      {lastQuery && (
        <div className="text-xs text-slate-400">
          Last query: <span className="text-slate-300">{lastQuery}</span>
          <span className="ml-2 text-blue-400 cursor-pointer hover:text-blue-300">
            (Ask a follow-up)
          </span>
        </div>
      )}
    </div>
  );
}
