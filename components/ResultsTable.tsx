"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  FileText,
} from "lucide-react";

export function ResultsTable({ results }: { results: any[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;

  // Reset to page 1 when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Dynamically get all unique columns from all rows (including classification/confidence/timestamp)
  const allColumns =
    results.length > 0
      ? Array.from(
          new Set([...results.flatMap((result) => Object.keys(result))])
        )
      : [];

  // Filter and sort data
  const filteredResults = results.filter((row) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return Object.values(row).some((value) =>
      String(value).toLowerCase().includes(searchLower)
    );
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (!sortColumn) return 0;
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    // Handle undefined values: undefined always sorts last
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedResults.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const paginatedResults = sortedResults.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const getConfidenceBadgeColor = (confidence: number) => {
    if (confidence >= 0.8)
      return "bg-green-100 text-green-800 border-green-300";
    if (confidence >= 0.6)
      return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return "bg-red-100 text-red-800 border-red-300";
  };

  const getClassificationBadgeColor = (classification: string) => {
    const colors = [
      "bg-blue-100 text-blue-800 border-blue-300",
      "bg-purple-100 text-purple-800 border-purple-300",
      "bg-green-100 text-green-800 border-green-300",
      "bg-orange-100 text-orange-800 border-orange-300",
      "bg-pink-100 text-pink-800 border-pink-300",
    ];
    const hash = classification
      ? classification
          .split("")
          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
      : 0;
    return colors[hash % colors.length];
  };

  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Results Yet
        </h3>
        <p className="text-gray-600">
          Upload a CSV file and click classify to see results here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search results..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="text-sm text-gray-600">
          {filteredResults.length} of {results.length} results
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg overflow-auto bg-white">
        <Table className="w-full border-collapse">
          <TableHeader>
            <TableRow className="bg-gray-50">
              {allColumns.map((col) => (
                <TableHead key={col} className="font-semibold">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(col)}
                    className="h-auto p-0 font-semibold text-gray-700 hover:text-gray-900"
                  >
                    {col.charAt(0).toUpperCase() + col.slice(1)}
                    <ArrowUpDown className="ml-1 h-3 w-3" />
                  </Button>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedResults.map((row, i) => (
              <TableRow key={i} className="hover:bg-gray-50 transition-colors">
                {allColumns.map((col) => (
                  <TableCell
                    key={col}
                    className="max-w-xs p-2 border align-top"
                  >
                    {col === "classification" && row[col] ? (
                      <Badge
                        variant="outline"
                        className={getClassificationBadgeColor(row[col])}
                      >
                        {row[col]}
                      </Badge>
                    ) : col === "confidence" && typeof row[col] === "number" ? (
                      <Badge
                        variant="outline"
                        className={getConfidenceBadgeColor(row[col])}
                      >
                        {(row[col] * 100).toFixed(1)}%
                      </Badge>
                    ) : col === "timestamp" && row[col] ? (
                      <span title={row[col]}>
                        {new Date(row[col]).toLocaleString()}
                      </span>
                    ) : (
                      <div className="truncate" title={String(row[col] ?? "")}>
                        {String(row[col] ?? "")}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + rowsPerPage, sortedResults.length)} of{" "}
            {sortedResults.length} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <div className="flex items-center gap-1">
              {/* First page */}
              <Button
                key={1}
                variant={currentPage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(1)}
                className="w-8 h-8 p-0"
              >
                1
              </Button>
              {/* Left ellipsis */}
              {currentPage > 3 && totalPages > 5 && (
                <span className="text-gray-400">...</span>
              )}
              {/* Dynamic middle pages */}
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((pageNum) => {
                  if (pageNum === 1 || pageNum === totalPages) return false;
                  if (totalPages <= 5) return true;
                  if (currentPage <= 3) return pageNum <= 5;
                  if (currentPage >= totalPages - 2)
                    return pageNum >= totalPages - 4;
                  return Math.abs(pageNum - currentPage) <= 1;
                })
                .map((pageNum) => (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                ))}
              {/* Right ellipsis */}
              {currentPage < totalPages - 2 && totalPages > 5 && (
                <span className="text-gray-400">...</span>
              )}
              {/* Last page */}
              {totalPages > 1 && (
                <Button
                  key={totalPages}
                  variant={currentPage === totalPages ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(totalPages)}
                  className="w-8 h-8 p-0"
                >
                  {totalPages}
                </Button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
