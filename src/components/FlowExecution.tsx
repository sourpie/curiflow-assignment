import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Check,
  X,
  RefreshCw,
  Copy,
  Download,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

type ExecutionStatus = "success" | "running" | "pending" | "error";

interface ExecutionStage {
  id: string | null;
  name: string | null;
  status: ExecutionStatus;
  timestamp: string | null;
  details: string | null;
}

interface ExecutionOutput {
  status: "success" | "error";
  deployment: string;
  stages: Array<{
    name: string | null;
    status: ExecutionStatus;
    details: string | null;
  }>;
  timestamp: string;
  error?: string;
}

const FlowExecutionModal = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const [isPayloadOpen, setIsPayloadOpen] = useState(true);
  const [isOutputExpanded, setIsOutputExpanded] = useState(false);
  const [executionStages, setExecutionStages] = useState<ExecutionStage[]>([]);
  const [jsonOutput, setJsonOutput] = useState<ExecutionOutput | null>(null);
  const [deploymentName, setDeploymentName] = useState("v2");
  const [requestPayload, setRequestPayload] = useState("");
  const [showLogs, setShowLogs] = useState(true);
  const scrollAreaRef = useRef(null);

  // When the payload is opened, collapse the logs
  useEffect(() => {
    if (isPayloadOpen && showLogs) {
      setShowLogs(false);
    }
  }, [isPayloadOpen, showLogs]);

  const initialStages: ExecutionStage[] = [
    {
      id: "document-parser",
      name: "Document Parser",
      status: "pending" as ExecutionStatus,
      timestamp: null,
      details: null,
    },
    {
      id: "llm-processor",
      name: "LLM Processor",
      status: "pending" as ExecutionStatus,
      timestamp: null,
      details: null,
    },
    {
      id: "data-validation",
      name: "Data Validation",
      status: "pending" as ExecutionStatus,
      timestamp: null,
      details: null,
    },
    {
      id: "output-generation",
      name: "Output Generation",
      status: "pending" as ExecutionStatus,
      timestamp: null,
      details: null,
    },
  ];

  const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
      case "success":
        return <Check className="text-green-500 w-4 h-4" />;
      case "running":
        return <RefreshCw className="text-blue-500 w-4 h-4 animate-spin" />;
      case "pending":
        return <div className="w-4 h-4 bg-gray-300 rounded-full"></div>;
      case "error":
        return <X className="text-red-500 w-4 h-4" />;
      default:
        return null;
    }
  };

  const handleExecute = () => {
    if (!requestPayload.trim()) {
      toast.error("Please enter a request payload");
      return;
    }

    setIsExecuting(true);
    setJsonOutput(null);
    setExecutionStages([]);
    setIsPayloadOpen(false);
    setShowLogs(true);

    // Simulate error if payload contains the word "error"
    const shouldSimulateError = requestPayload.toLowerCase().includes("error");
    const errorStageIndex = shouldSimulateError
      ? Math.floor(Math.random() * 3) + 1
      : -1;

    // Create simulated execution timeouts
    const timeouts: number[] = [];

    // Simulate flow execution with progressive loading
    const executeFlow = () => {
      const progressStages = [...initialStages];

      progressStages.forEach((_stage, index) => {
        const timeout = setTimeout(() => {
          // If we've already encountered an error, don't process any more stages
          if (jsonOutput && jsonOutput.status === "error") {
            return;
          }

          // If this is the stage where an error occurs
          if (index === errorStageIndex) {
            // Update stages up to the error point
            const errorStages = [...progressStages.slice(0, index + 1)].map(
              (s, i) => {
                if (i < index) {
                  return {
                    ...s,
                    status: "success",
                    timestamp: s.timestamp || new Date().toLocaleTimeString(),
                    details: `Processed ${Math.random()
                      .toString(36)
                      .substring(7)}`,
                  };
                } else if (i === index) {
                  return {
                    ...s,
                    status: "error",
                    timestamp: new Date().toLocaleTimeString(),
                    details: `Error: Failed to process data. Invalid schema detected.`,
                  };
                } else {
                  return s;
                }
              }
            );

            setExecutionStages(errorStages);

            // Clear all pending timeouts to prevent further execution
            timeouts.forEach(clearTimeout);

            // Set error output immediately
            setJsonOutput({
              status: "error",
              deployment: deploymentName,
              stages: errorStages.map((stage) => ({
                name: stage.name,
                status: stage.status,
                details: stage.details,
              })),
              timestamp: new Date().toISOString(),
              error:
                "Execution failed: Unable to validate input schema at stage " +
                _stage.name,
            });

            setIsExecuting(false);
            setShowLogs(false); // Hide logs and show output immediately
            toast.error("Flow execution failed");
            return;
          }

          // Update stages progressively (normal flow)
          const updatedStages = [...progressStages.slice(0, index + 1)].map(
            (s, i) =>
              i === index
                ? {
                    ...s,
                    status: "running",
                    timestamp: new Date().toLocaleTimeString(),
                  }
                : i < index
                ? {
                    ...s,
                    status: "success",
                    timestamp: s.timestamp || new Date().toLocaleTimeString(),
                    details: `Processed ${Math.random()
                      .toString(36)
                      .substring(7)}`,
                  }
                : s
          );

          setExecutionStages(updatedStages);

          // Mark stage as complete after a delay
          const completeTimeout = setTimeout(() => {
            const finalStages = updatedStages.map((s, i) =>
              i === index
                ? {
                    ...s,
                    status: "success",
                    timestamp: new Date().toLocaleTimeString(),
                    details: `Processed ${Math.random()
                      .toString(36)
                      .substring(7)}`,
                  }
                : s
            );

            setExecutionStages(finalStages);

            // If last stage, set final output
            if (index === progressStages.length - 1) {
              setJsonOutput({
                status: "success",
                deployment: deploymentName,
                stages: finalStages.map((stage) => ({
                  name: stage.name,
                  status: stage.status,
                  details: stage.details,
                })),
                timestamp: new Date().toISOString(),
              });
              setIsExecuting(false);
              setShowLogs(false);
            }
          }, 2000);

          timeouts.push(completeTimeout);
        }, index * 3000);

        timeouts.push(timeout);
      });
    };

    executeFlow();

    // Cleanup function to clear any remaining timeouts if component unmounts
    return () => {
      timeouts.forEach(clearTimeout);
    };
  };

  const handleCopyOutput = () => {
    if (jsonOutput) {
      navigator.clipboard.writeText(JSON.stringify(jsonOutput, null, 2));
      toast.success("Output copied to clipboard");
    }
  };

  const handleDownloadOutput = () => {
    if (jsonOutput) {
      const blob = new Blob([JSON.stringify(jsonOutput, null, 2)], {
        type: "application/json",
      });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "flow_execution_output.json";
      link.click();
      toast.success("Output downloaded");
    }
  };

  const handleOutputExpand = () => {
    setIsOutputExpanded(true);
    setIsPayloadOpen(false);
    setShowLogs(false);
  };

  const renderOutputPreview = () => {
    if (!jsonOutput) return null;

    const outputLines = JSON.stringify(jsonOutput, null, 2).split("\n");
    const previewLines = outputLines.slice(0, 5);

    return (
      <div className="relative">
        <pre
          className={`p-3 pt-10 rounded-lg text-xs overflow-hidden max-h-[100px] ${
            jsonOutput.status === "error" ? "bg-red-50" : "bg-gray-100"
          }`}
        >
          {previewLines.join("\n")}
          {outputLines.length > 5 && "..."}
          {outputLines.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 text-blue-600"
              onClick={handleOutputExpand}
            >
              Expand <ChevronDown className="h-4 w-4" />
            </Button>
          )}
        </pre>
      </div>
    );
  };

  const renderFullOutput = () => {
    if (!jsonOutput || !isOutputExpanded) return null;

    return (
      <div className="mt-2">
        <pre
          className={`p-3 rounded-lg text-xs max-h-[27vh] overflow-y-auto text-wrap overflow-x-hidden relative ${
            jsonOutput.status === "error" ? "bg-red-50" : "bg-gray-100"
          }`}
        >
          {JSON.stringify(jsonOutput, null, 2)}
          <div className="absolute top-2 right-2 flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleCopyOutput}>
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={handleDownloadOutput}
            >
              <Download className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOutputExpanded(false)}
            >
              <ChevronUp className="h-4 w-4" />
            </Button>
          </div>
        </pre>
      </div>
    );
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="border-1 border-black">Run Flow</Button>
        </DialogTrigger>
        <DialogContent className="p-6 h-[85vh] relative max-w-full w-[700px] flex flex-col overflow-hidden">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">
              Execute Flow
            </DialogTitle>
            <DialogDescription>
              Enter the Deployment Name and Request payload to execute the flow.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <div className="flex flex-col relative gap-4 overflow-hidden h-full text-sm">
              {/* Deployment Selection */}
              <div className="flex gap-4 items-center">
                <label htmlFor="deployment Name" className="font-medium">
                  Deployment Name
                </label>
                <Select
                  value={deploymentName}
                  onValueChange={setDeploymentName}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select deployment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="v1">v1</SelectItem>
                    <SelectItem value="v2">v2</SelectItem>
                    <SelectItem value="v3">v3</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Collapsible Request Payload */}
              <Collapsible
                open={isPayloadOpen}
                onOpenChange={(open) => {
                  setIsPayloadOpen(open);
                  if (open) {
                    if (isOutputExpanded) {
                      setIsOutputExpanded(false);
                    }
                    if (showLogs) {
                      setShowLogs(false);
                    }
                  }
                }}
                className="flex gap-2 flex-col"
              >
                <div className="flex items-center justify-between">
                  <label htmlFor="payload" className="font-medium">
                    Request Payload
                  </label>

                  <CollapsibleTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-fit flex items-center justify-center"
                    >
                      {isPayloadOpen ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent>
                  <Textarea
                    id="payload"
                    placeholder="Enter JSON payload (include 'error' to simulate failure)"
                    className="min-h-[80px]"
                    value={requestPayload}
                    onChange={(e) => setRequestPayload(e.target.value)}
                  />
                </CollapsibleContent>
              </Collapsible>

              {/* Execution Stages with Fixed Height */}
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Logs</h3>
                {(showLogs || executionStages.length > 0) && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-center"
                    onClick={() => {
                      setShowLogs(!showLogs);
                      if (!showLogs && isPayloadOpen) {
                        setIsPayloadOpen(false);
                      }
                      if (!showLogs && jsonOutput) {
                        setIsOutputExpanded(false);
                      }
                    }}
                  >
                    {showLogs ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </Button>
                )}
              </div>

              {/* Progress bar */}
              <div className="w-[98%] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    executionStages.some((stage) => stage.status === "error")
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                  style={{
                    width: `${
                      (executionStages.filter(
                        (stage) =>
                          stage.status === "success" || stage.status === "error"
                      ).length /
                        initialStages.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              {/* Logs section */}
              <ScrollArea
                ref={scrollAreaRef}
                className={`w-full rounded-md border p-1 overflow-scroll ${
                  !showLogs ? "hidden" : "max-h-[33vh]"
                }`}
              >
                {executionStages.length > 0 ? (
                  executionStages.map((stage) => (
                    <div
                      key={stage.id}
                      className={`flex items-center space-x-4 p-3 rounded-lg mb-2 last:mb-0 ${
                        stage.status === "error" ? "bg-red-50" : "bg-gray-50"
                      }`}
                    >
                      <div className="w-6 h-6 flex items-center justify-center">
                        {getStatusIcon(stage.status)}
                      </div>
                      <div className="flex justify-between gap-2 items-center w-full">
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {stage.name}
                          </span>

                          {stage.details && (
                            <p
                              className={`text-xs mt-1 ${
                                stage.status === "error"
                                  ? "text-red-600"
                                  : "text-gray-500"
                              }`}
                            >
                              {stage.details}
                            </p>
                          )}
                        </div>
                        <div className="flex justify-center items-center gap-1">
                          <Badge
                            variant={
                              stage.status === "success"
                                ? "default"
                                : stage.status === "running"
                                ? "secondary"
                                : stage.status === "error"
                                ? "destructive"
                                : "outline"
                            }
                          >
                            {stage.status}
                          </Badge>
                          <div className="text-xs text-gray-500">
                            {stage.timestamp || "Pending"}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="h-full min-h-[200px] flex items-center justify-center text-gray-500">
                    Execute to see logs
                  </div>
                )}
              </ScrollArea>

              {/* JSON Output */}
              {jsonOutput && (
                <div className={`mt-4 ${showLogs ? "hidden" : ""}`}>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold flex items-center gap-2">
                      Execution Output
                      {jsonOutput.status === "error" && (
                        <AlertTriangle className="text-red-500 h-4 w-4" />
                      )}
                    </h3>
                    {jsonOutput.status === "error" && (
                      <Badge variant="destructive">
                        Error: Execution Failed
                      </Badge>
                    )}
                  </div>
                  {!isOutputExpanded
                    ? renderOutputPreview()
                    : renderFullOutput()}
                </div>
              )}
            </div>
            {/* Actions */}
            <div className="flex absolute bottom-5 right-6 justify-end space-x-2 mt-4">
              <Button
                onClick={handleExecute}
                className="bg-green-500 hover:bg-green-700 rounded-full border-2 border-white"
                disabled={isExecuting}
              >
                {isExecuting ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Executing
                  </>
                ) : (
                  "Execute Flow"
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Link to={"/history"}>
        <Button>To History Page</Button>
      </Link>
    </>
  );
};

export default FlowExecutionModal;
