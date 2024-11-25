import Workflow from "@/components/WorkFlow/Workflow";
import React from "react";
import { ReactFlowProvider } from "@xyflow/react";
const page = () => {
  return (
    <ReactFlowProvider>
      <div className="center">
        <Workflow />
      </div>
    </ReactFlowProvider>
  );
};

export default page;
