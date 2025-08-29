"use client";

import { useState } from "react";
import { FileUpload } from "@/components/FileUpload";
import { ResultsTable } from "@/components/ResultsTable";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Upload, Brain, Download, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { classifyFile } from "../lib/api";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [results, setResults] = useState([]);
  const [isClassifying, setIsClassifying] = useState(false);

  const handleFileUpload = (file: File, data: any[]) => {
    setUploadedFile(file);
    setCsvData(data);
    setResults([]);
    toast.success(`File "${file.name}" uploaded successfully!`);
  };

  // ############ update 1

  const handleClassify = async () => {
    if (!uploadedFile || csvData.length === 0) {
      toast.error("Please upload a CSV file first");
      return;
    }

    setIsClassifying(true);
    try {
      // Call your custom backend API
      const response = await classifyFile(uploadedFile);

      if (!response) {
        throw new Error(`Classification failed: ${response.statusText}`);
      }

      setResults(response.results);
      toast.success(`Successfully classified ${response.results.length} rows`);
    } catch (error) {
      console.error("Classification error:", error);
      toast.error("Classification failed. Please check your backend API.");
    } finally {
      setIsClassifying(false);
    }
  };

  const handleExport = () => {
    if (results.length === 0) {
      toast.error("No results to export");
      return;
    }

    // Prepare CSV content
    const headers = [...Object.keys(results[0])];
    const csvContent = [
      headers.join(","),
      ...results.map((result) =>
        [
          ...Object.values(result).map((val) =>
            typeof val === "string" && val.includes(",") ? `"${val}"` : val
          ),
        ].join(",")
      ),
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `classification_results_${Date.now()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Results exported successfully!");
  };

  const handleClear = () => {
    setUploadedFile(null);
    setCsvData([]);
    setResults([]);
    toast.info("All data cleared");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            CSV Classification Platform
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload your CSV files, classify them using AI, and export the
            results seamlessly
          </p>
        </div>

        <div className="grid gap-8">
          {/* File Upload Section */}
          <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-blue-600" />
                Upload CSV File
              </CardTitle>
              <CardDescription>
                Select or drag and drop your CSV file to begin classification
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUpload onFileUpload={handleFileUpload} />

              {uploadedFile && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-blue-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-blue-700">
                        {csvData.length} rows •{" "}
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleClassify}
                        disabled={isClassifying}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        <Brain className="h-4 w-4 mr-2" />
                        {isClassifying ? "Classifying..." : "Classify"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleClear}
                        className="border-red-300 text-red-600 hover:bg-red-50"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Clear
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Results Section */}
          {results.length > 0 && (
            <Card className="shadow-lg border-0 bg-white/70 backdrop-blur-sm">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Brain className="h-5 w-5 text-purple-600" />
                      Classification Results
                    </CardTitle>
                    <CardDescription>
                      {results.length} rows classified • Click export to
                      download results
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleExport}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <ResultsTable results={results} />
              </CardContent>
            </Card>
          )}

          {/* Instructions */}
          {!uploadedFile && (
            <Card className="shadow-lg border-0 bg-gradient-to-r from-blue-50 to-purple-50">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Get Started with CSV Classification
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Upload your CSV file using the upload area above to begin
                    the classification process
                  </p>

                  <div className="grid md:grid-cols-3 gap-4 text-left max-w-2xl mx-auto">
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Upload</p>
                        <p className="text-sm text-gray-600">
                          Select your CSV file
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Classify</p>
                        <p className="text-sm text-gray-600">
                          AI processes your data
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">Export</p>
                        <p className="text-sm text-gray-600">
                          Download your results
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
