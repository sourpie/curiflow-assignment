import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "./ui/badge";
import { TrashIcon } from "lucide-react";
import HistoryTable from "./HistoryTable";

function History() {

  const releaseData = {
    name: "v2",
    status: "COMPLETED",
    description: "No description",
    deployedOn: "21/02/2025, 18:56:43",
    tags: ["prod"]
  };

  return (
    <div className="grid grid-cols-[250px_1fr] h-screen">
      <div className="">
        <Card className="h-[95%] m-2 p-2">
          <CardHeader className="m-0 p-1">
            <CardTitle className="">Releases</CardTitle>
          </CardHeader>

          <CardContent className="m-0 p-1 mt-[-15px]">
            <Card className="flex flex-col bg-[rgb(236,234,255)] gap-1 m-0 p-1">
              <CardHeader className="flex flex-row m-0 p-1 justify-between items-center">
                <h1>v1</h1>
                <Badge className="bg-[rgb(190,149,196)]">prod</Badge>
              </CardHeader>
              <CardContent className="flex flex-col items-start text-xs text-gray-600 m-0 p-1">
                <span>22 Feb 2003</span>
                <span>12:11:10</span>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>

      <div className="">
        <Card className="flex flex-col gap-3 h-[28vh] m-2 px-4 py-1 border-1 ">
          <CardHeader className="flex flex-row justify-between items-center m-0 px-1">
            <CardTitle className="border-b-2 p-4">Release Info</CardTitle>
            <TrashIcon className="h-4 w-4 hover:cursor-pointer" />
          </CardHeader>
          <CardContent className="m-0 px-1">
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 p-4 text-sm w-full max-w-lg">
              {/* Left Column */}
              <div className="flex flex-col gap-1">
                <p className="font-semibold">
                  Name: <span className="font-normal text-gray-500">v2</span>
                </p>
                <p className="font-semibold flex items-center gap-1">
                  Description:{" "}
                  <span className="text-gray-500 font-normal">No description</span>
                  
                </p>
                <p className="font-semibold">
                  Deployed On:{" "}
                  <span className="font-normal text-gray-500">21/02/2025, 18:56:43</span>
                </p>
              </div>

              {/* Right Column */}
              <div className="flex flex-col gap-2">
                <p className="font-semibold">
                  Status:{" "}
                  <span className="text-gray-500 font-normal">COMPLETED</span>
                </p>
                <p className="font-semibold flex items-center gap-2">
                  Tags:
                  <Badge className="bg-[rgb(190,149,196)] text-white px-2 py-1 rounded-md text-xs">
                    prod
                  </Badge>
                  
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="m-2 px-2 py-1">
        <HistoryTable/>
        </div>
        
      </div>
    </div>
  );
}

export default History;
