"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface FileUploadProps {
  onFileUpload: (file: File, data: any[]) => void;
}

export function FileUpload({ onFileUpload }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const parseCSV = useCallback((text: string) => {
    const lines = text.split("\n").filter((line) => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0]
      .split(",")
      .map((header) => header.trim().replace(/"/g, ""));
    const data = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i]
        .split(",")
        .map((value) => value.trim().replace(/"/g, ""));
      const row: Record<string, any> = {};

      headers.forEach((header, index) => {
        row[header] = values[index] || "";
      });

      data.push(row);
    }

    return data;
  }, []);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }

      if (file.size > 10 * 1024 * 1024) {
        // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }

      setIsProcessing(true);

      try {
        const text = await file.text();
        const data = parseCSV(text);

        if (data.length === 0) {
          toast.error("The CSV file appears to be empty or invalid");
          return;
        }

        onFileUpload(file, data);
      } catch (error) {
        console.error("Error processing file:", error);
        toast.error("Error processing the CSV file");
      } finally {
        setIsProcessing(false);
      }
    },
    [parseCSV, onFileUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        handleFile(files[0]);
      }
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        handleFile(files[0]);
        // Reset input value so selecting the same file again triggers onChange
        e.target.value = "";
      }
    },
    [handleFile]
  );

  return (
    <div className="w-full">
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200
          ${
            isDragging
              ? "border-blue-400 bg-blue-50 scale-105"
              : "border-gray-300 hover:border-gray-400 bg-gray-50/50"
          }
          ${isProcessing ? "opacity-50 pointer-events-none" : ""}
        `}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <input
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
        />

        <div className="space-y-4">
          <div
            className={`transition-transform duration-200 ${
              isDragging ? "scale-110" : ""
            }`}
          >
            {isProcessing ? (
              <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
            ) : (
              <Upload className="w-12 h-12 mx-auto text-gray-400" />
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {isProcessing ? "Processing file..." : "Upload your CSV file"}
            </h3>
            <p className="text-gray-600 mb-4">
              Drag and drop your file here, or click to browse
            </p>

            <Button
              variant="outline"
              disabled={isProcessing}
              className="mx-auto"
            >
              <FileText className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p>Supported format: CSV files only</p>
            <p>Maximum file size: 10MB</p>
          </div>
        </div>

        {isDragging && (
          <div className="absolute inset-0 bg-blue-100/80 rounded-xl flex items-center justify-center">
            <div className="text-blue-600 font-semibold">
              Drop your CSV file here!
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
