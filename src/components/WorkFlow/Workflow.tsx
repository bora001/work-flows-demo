"use client";

import { Node, ReactFlow, useReactFlow } from "@xyflow/react";

import { MouseEvent, useState } from "react";
import "@xyflow/react/dist/style.css";

const Workflow = () => {
  const initialNodes = [
    {
      id: "1",
      type: "default",
      data: { label: "START" },
      position: { x: 100, y: 100 }, // 초기 위치
    },
  ];

  const initialEdges = [
    {
      id: "edge",
      source: "1",
      target: "2",
      animated: true,
    },
  ];

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const { getViewport } = useReactFlow();

  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentMenu, setCurrentMenu] = useState("");
  const clickNode = (
    e: MouseEvent<Element, globalThis.MouseEvent>,
    node: Node
  ) => {
    e.stopPropagation();
    setCurrentNode(currentNode ? null : node.id);
    console.log("node,", node);
    setCurrentMenu(String(node.data.type));
    const { x, y, zoom } = getViewport();
    const adjustedX = node.position.x * zoom + x;
    const adjustedY = node.position.y * zoom + y;
    setMenuPosition({ x: adjustedX, y: adjustedY });
  };

  const clickBackground = () => {
    setCurrentNode(null);
    console.log("back");
  };

  const onNodeDrag = () => {
    setCurrentNode(null);
  };

  const addNode = ({ label, type }: { label: string; type: string }) => {
    setCurrentNode(null);
    const newNodeId = `${nodes.length + 1}`;
    const lastNode = nodes[nodes.length - 1];
    const newNode = {
      id: newNodeId,
      type: "default",
      data: { label: `${label}`, type },
      position: { x: lastNode.position.x + 200, y: lastNode.position.y }, // x축으로 150px 간격
    };

    setNodes((prevNodes) => [...prevNodes, newNode]);

    // 엣지도 자동으로 추가
    const newEdge = {
      id: `e${lastNode.id}-${newNodeId}`,
      source: lastNode.id,
      target: newNodeId,
      animated: true,
    };
    setEdges((prevEdges) => [...prevEdges, newEdge]);
  };

  const addRows = () => {
    const newNodeId =
      nodes.filter((node) => node.data.label.includes("ADD ROWS")).length + 1;
    addNode({ label: `ADD ROWS ${newNodeId}`, type: "add_rows" });
  };

  const deleteNode = () => {
    const nodeId = currentNode;
    setNodes((prevNodes) => prevNodes.filter((node) => node.id !== nodeId));
    setEdges((prevEdges) =>
      prevEdges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      )
    );
    setCurrentNode(null);
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} onClick={clickBackground}>
      {currentNode && (
        <div
          className="drop-shadow-lg bg-blue-200 absolute z-10 p-5 rounded-lg
          flex flex-col gap-3
          "
          style={{
            top: menuPosition.y - 10,
            left: menuPosition.x - 100,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {currentMenu === "add_rows" && (
            <button className="btn">SET DATA</button>
          )}
          {nodes.length > 0 && (
            <button className="btn" onClick={deleteNode}>
              DELETE
            </button>
          )}
          {currentMenu !== "add_rows" && (
            <button className="btn" onClick={addRows}>
              ADD ROWS
            </button>
          )}
        </div>
      )}
      <ReactFlow
        onViewportChange={onNodeDrag}
        onNodeClick={(e, node) => clickNode(e, node)}
        nodes={nodes}
        edges={edges}
        style={{ width: "100%", height: "100%" }}
      />
    </div>
  );
};

export default Workflow;
