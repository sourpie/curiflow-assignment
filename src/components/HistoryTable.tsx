import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "./ui/button";
import {
  ChevronDown,
  ChevronUp,
  ThumbsUp,
  ThumbsDown,
  Edit,
  Check,
} from "lucide-react";
// import JSONPretty from 'react-json-pretty';
import ReactJson from "react-json-view";

// Define the data type for our table rows
interface ExecutionRecord {
  executionId: string;
  executedBy: string;
  status: string;
  latency: number;
  input: object; // Changed to object for JSON
  output: object; // Changed to object for JSON
  feedback: "like" | "dislike" | null;
  expanded?: boolean;
}

function HistoryTable() {
  // Create some dummy data
  const [data, setData] = useState<ExecutionRecord[]>([
    {
      executionId: "exe_7391f5a2",
      executedBy: "tarak@curiflow.com",
      status: "Completed",
      latency: 2.3,
      input: {
        action: "Process",
        target: "customer_data",
        filters: { region: "APAC", category: "Enterprise" },
      },
      output: {
        status: "success",
        processed: 158,
        details: {
          created: 42,
          updated: 116,
          failed: 0,
          logs: [
            "Started processing at 2025-03-01T09:15:22",
            "Connecting to database...",
            "Processing batch #1 (50 records)",
            "Processing batch #2 (50 records)",
            "Processing batch #3 (50 records)",
            "Processing batch #4 (8 records)",
            "Finalizing results...",
            "Operation completed at 2025-03-01T09:15:24",
          ],
        },
      },
      feedback: "like",
      expanded: false,
    },
    {
      executionId: "exe_45e2b18c",
      executedBy: "sara@curiflow.com",
      status: "Failed",
      latency: 5.7,
      input: {
        action: "Generate",
        target: "monthly_report",
        parameters: { month: "February", year: 2025 },
      },
      output: {
        status: "error",
        message: "Missing data source",
        details: {
          errorCode: "DATA_SRC_404",
          location: "ReportGenerator.js:126",
          trace:
            "at ReportGenerator.fetchData (ReportGenerator.js:126)\nat ReportGenerator.generate (ReportGenerator.js:58)\nat processQueue (Worker.js:24)",
        },
      },
      feedback: "dislike",
      expanded: false,
    },
    {
      executionId: "exe_d873fe1e",
      executedBy: "tarak@curiflow.com",
      status: "Completed",
      latency: 1.2,
      input: {
        action: "Update",
        target: "user_profiles",
        ids: [101, 102, 103, 104],
      },
      output: {
        status: "success",
        updated: 47,
        skipped: 0,
      },
      feedback: null,
      expanded: false,
    },
    {
      executionId: "exe_9a42b67d",
      executedBy: "alex@curiflow.com",
      status: "Completed",
      latency: 3.8,
      input: { action: "Validate", target: "customer_data", level: "complete" },
      output: {
        status: "success",
        valid: true,
        checks: {
          schema: "passed",
          relationships: "passed",
          consistency: "passed",
          duplicates: "passed",
        },
      },
      feedback: null,
      expanded: false,
    },
    {
      executionId: "exe_9a43467d",
      executedBy: "alex@curiflow.com",
      status: "Completed",
      latency: 3.8,
      input: { action: "Validate", target: "customer_data", level: "complete" },
      output: {
        status: "success",
        valid: true,
        checks: {
          schema: "passed",
          relationships: "passed",
          consistency: "passed",
          duplicates: "passed",
        },
      },
      feedback: null,
      expanded: false,
    },
    {
      executionId: "exe_9a42e67d",
      executedBy: "alex@curiflow.com",
      status: "Completed",
      latency: 3.8,
      input: { action: "Validate", target: "customer_data", level: "complete" },
      output: {
        status: "success",
        valid: true,
        checks: {
          schema: "passed",
          relationships: "passed",
          consistency: "passed",
          duplicates: "passed",
        },
      },
      feedback: null,
      expanded: false,
    },
    {
      executionId: "exe_942fv67d",
      executedBy: "alex@curiflow.com",
      status: "Completed",
      latency: 3.8,
      input: { action: "Validate", target: "customer_data", level: "complete" },
      output: {
        status: "success",
        valid: true,
        checks: {
          schema: "passed",
          relationships: "passed",
          consistency: "passed",
          duplicates: "passed",
        },
      },
      feedback: null,
      expanded: false,
    },
    {
      executionId: "exe_9a42b6dd",
      executedBy: "alex@curiflow.com",
      status: "Completed",
      latency: 3.8,
      input: { action: "Validate", target: "customer_data", level: "complete" },
      output: {
        status: "success",
        valid: true,
        checks: {
          schema: "passed",
          relationships: "passed",
          consistency: "passed",
          duplicates: "passed",
        },
      },
      feedback: null,
      expanded: false,
    },
  ]);

  // Handle row expansion
  const handleExpand = (executionId: string) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.executionId === executionId
          ? { ...row, expanded: !row.expanded }
          : row
      )
    );
  };

  // Handle feedback setting
  const [editingFeedback, setEditingFeedback] = useState<string | null>(null);

  const setFeedback = (executionId: string, feedback: "like" | "dislike") => {
    setData((prevData) =>
      prevData.map((row) =>
        row.executionId === executionId ? { ...row, feedback } : row
      )
    );
    setEditingFeedback(null);
  };

  // Define columns with proper typing
  const columns: ColumnDef<ExecutionRecord>[] = [
    {
      accessorKey: "executionId",
      header: "Execution ID",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <div>{row.original.executionId}</div>
          <Button
            variant="ghost"
            size="sm"
            className="ml-2 text-black p-0 h-8 w-8"
            onClick={() => handleExpand(row.original.executionId)}
          >
            {row.original.expanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
      ),
    },
    {
      accessorKey: "executedBy",
      header: "Executed By",
      cell: ({ row }) => (
        <div className="capitalize">{row.original.executedBy}</div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        return (
          <div
            className={`px-2 py-1 rounded-full text-xs font-medium inline-block
              ${
                row.original.status === "Completed"
                  ? "bg-green-100 text-green-800"
                  : row.original.status === "Failed"
                  ? "bg-red-100 text-red-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
          >
            {row.original.status}
          </div>
        );
      },
    },
    {
      accessorKey: "latency",
      header: "Latency (sec)",
      cell: ({ row }) => (
        <div className="text-center font-medium">
          {row.original.latency.toFixed(1)}
        </div>
      ),
    },
    {
      accessorKey: "input",
      header: "Input",
      cell: ({ row }) => {
        // Show simplified input (just the action and target)
        const input = row.original.input as any;
        const simplifiedInput =
          input.action && input.target
            ? `${input.action} ${input.target}`
            : JSON.stringify(input).substring(0, 30) +
              (JSON.stringify(input).length > 30 ? "..." : "");

        return (
          <p className="text-sm rounded-lg  p-2 text-center font-medium truncate max-w-xs">
            {simplifiedInput}
          </p>
        );
      },
    },
    {
      accessorKey: "output",
      header: "Output",
      cell: ({ row }) => {
        // Show simplified output (just the status and a key result)
        const output = row.original.output as any;
        let simplifiedOutput = "";

        if (output.status === "success") {
          const keyMetric =
            output.processed || output.updated || (output.valid ? "Valid" : "");
          simplifiedOutput = `Success: ${keyMetric || ""}`;
        } else if (output.status === "error") {
          simplifiedOutput = `Error: ${output.message || ""}`;
        } else {
          simplifiedOutput =
            output.message || JSON.stringify(output).substring(0, 30) + "...";
        }

        return (
          <p className="text-sm rounded-lg p-2 text-center font-medium truncate max-w-xs">
            {simplifiedOutput}
          </p>
        );
      },
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => {
        const executionId = row.original.executionId;
        const isEditing = editingFeedback === executionId;

        // If currently editing this feedback
        if (isEditing) {
          return (
            <div className="flex justify-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeedback(executionId, "like")}
                className="text-green-600 p-0 h-8 w-8"
              >
                <ThumbsUp className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFeedback(executionId, "dislike")}
                className="text-red-600 p-0 h-8 w-8"
              >
                <ThumbsDown className="h-4 w-4" />
              </Button>
            </div>
          );
        }

        // Display current feedback or edit button
        if (row.original.feedback === "like") {
          return (
            <div className="flex justify-center">
              <ThumbsUp className="h-4 w-4 text-green-600" />
            </div>
          );
        } else if (row.original.feedback === "dislike") {
          return (
            <div className="flex justify-center">
              <ThumbsDown className="h-4 w-4 text-red-600" />
            </div>
          );
        } else {
          return (
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditingFeedback(executionId)}
                className="text-blue-600 p-0 h-8 w-8"
              >
                <Edit className="h-4 w-4" />
              </Button>
            </div>
          );
        }
      },
    },
  ];

  // Set up the table
  const table = useReactTable({
    data,
    columns,
    initialState: {
      pagination: {
        pageSize: 6,
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="w-full pr-4" style={{ maxWidth: "calc(100vw - 270px)" }}>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <React.Fragment key={row.id}>
                  <TableRow data-state={row.getIsSelected() && "selected"}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                  {row.original.expanded && (
                    <TableRow className="bg-gray-50">
                      <TableCell colSpan={columns.length} className="p-4">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                          <h3 className="font-medium text-lg mb-2">
                            Execution Details
                          </h3>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Full Input:
                              </p>
                              <ReactJson
                                src={row.original.input}
                                theme="rjv-default"
                                name={false}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                collapseStringsAfterLength={80} 
                                style={{
                                  fontSize: "0.875rem",
                                  backgroundColor: "transparent",
                                  wordBreak: "break-word", 
                                  whiteSpace: "pre-wrap", 
                                }}
                              />
                            </div>
                            <div>
                              <p className="text-sm text-gray-500 mb-1">
                                Full Output:
                              </p>
                              <ReactJson
                                src={row.original.output}
                                theme="rjv-default"
                                name={false}
                                displayDataTypes={false}
                                displayObjectSize={false}
                                collapseStringsAfterLength={80} 
                                style={{
                                  fontSize: "0.875rem",
                                  backgroundColor: "transparent",
                                  wordBreak: "break-word", 
                                  whiteSpace: "pre-wrap", 
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </div>
  );
}

export default HistoryTable;
