'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Upload, AlertCircle, CheckCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface CSVUploadProps {
  onUploadSuccess?: (tableName: string, columns: string[]) => void;
}

interface UploadResult {
  success: boolean;
  table_name?: string;
  rows?: number;
  columns?: string[];
  message?: string;
  error?: string;
}

export default function CSVUpload({ onUploadSuccess }: CSVUploadProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setUploadResult({
        success: false,
        error: 'Please upload a CSV file',
      });
      return;
    }

    setIsUploading(true);
    setUploadResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload-csv', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setUploadResult(result);
        if (result.success && onUploadSuccess) {
          onUploadSuccess(result.table_name, result.columns);
        }
      } else {
        setUploadResult({
          success: false,
          error: 'Failed to upload file',
        });
      }
    } catch (error) {
      setUploadResult({
        success: false,
        error: 'An error occurred during upload',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        size="sm"
        className="gap-2 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
      >
        <Upload className="w-4 h-4" />
        Upload CSV
      </Button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="bg-slate-900 border-slate-700 w-full max-w-md p-6 relative">
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h2 className="text-xl font-semibold text-white mb-4">Upload CSV Data</h2>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-500/10'
                  : 'border-slate-600 bg-slate-800/50 hover:border-slate-500'
              }`}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-8 h-8 mx-auto mb-2 text-slate-400" />
              <p className="text-white font-medium">Drag CSV file here or click to select</p>
              <p className="text-xs text-slate-400 mt-1">Supported format: .csv</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInputChange}
                className="hidden"
              />
            </div>

            {isUploading && (
              <div className="mt-4 flex items-center justify-center gap-2 text-slate-300">
                <Spinner className="w-4 h-4" />
                <span>Uploading...</span>
              </div>
            )}

            {uploadResult && (
              <div className="mt-4">
                {uploadResult.success ? (
                  <Alert className="bg-green-950 border-green-800">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <AlertDescription className="text-green-200 text-sm">
                      <p className="font-semibold">{uploadResult.message}</p>
                      {uploadResult.columns && (
                        <p className="mt-1 text-xs">
                          Columns: {uploadResult.columns.join(', ')}
                        </p>
                      )}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert className="bg-red-950 border-red-800">
                    <AlertCircle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-200 text-sm">
                      {uploadResult.error}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <Button
                onClick={() => setIsOpen(false)}
                variant="outline"
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white border-slate-600"
              >
                Close
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
}
