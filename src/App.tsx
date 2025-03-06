import React from "react";
import { Routes, Route } from "react-router-dom";
import FlowExecutionModal from "./components/FlowExecution";
import History from "./components/History";
import { Button } from "./components/ui/button";


const App: React.FC = () => {
  return (

      <Routes>
        {/* <div className="w-[100vw] h-[100vh] flex items-center justify-center"> */}
        <Route path="/" element={<FlowExecutionModal />} />
        {/* </div> */}
        <Route path="/history" element={<History />} />
        
      </Routes> 
  );
};

export default App;
