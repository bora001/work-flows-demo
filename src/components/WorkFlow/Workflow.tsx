"use client";

import { Node, ReactFlow, useReactFlow } from "@xyflow/react";
import Select, { SingleValue } from "react-select";
import axios from "axios";
import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import "@xyflow/react/dist/style.css";
import { PlayArrow } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { EdgeType, NodeType } from "./WorkflowList";

const Workflow = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
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
    setCurrentMenu(String(node.data.type));
    const { x, y, zoom } = getViewport();
    const adjustedX = node.position.x * zoom + x;
    const adjustedY = node.position.y * zoom + y;
    setMenuPosition({ x: adjustedX, y: adjustedY });
  };

  const clickBackground = () => {
    setCurrentNode(null);
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

    // firebase
    updateList(newNode, newEdge);
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

  const setData = () => {
    const newNodeId =
      nodes.filter((node) => node.data.label.includes("SET DATA")).length + 1;
    addNode({ label: `SET DATA ${newNodeId}`, type: "set_data" });
  };

  const [selectInfo, setSelectInfo] = useState({ value: "", option: "" });
  const addData = (e: FormEvent) => {
    e.preventDefault();
    setCurrentNode(null);
  };

  const options = [
    { value: "name", label: "name" },
    { value: "color", label: "color" },
    { value: "count", label: "count" },
  ];

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectInfo((prev) => ({ ...prev, option: selectedOption?.value ?? "" }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectInfo((prev) => ({ ...prev, value: e.target.value }));
  };

  const postData = async () => {
    const { option, value } = selectInfo;
    try {
      const response = await axios.post(process.env.NEXT_PUBLIC_ADD_ROW ?? "", {
        [option]: value,
      });
      console.log(response.data);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const onPlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (nodes.at(-1)?.data.label.includes("SET DATA")) {
      postData();
    }
  };

  const updateList = useCallback(
    async (node: NodeType, edge: EdgeType) => {
      if (!id) return;
      try {
        const listRef = doc(db, "lists", String(id));
        await updateDoc(listRef, {
          Flow: arrayUnion(node),
          Edge: arrayUnion(edge),
        });
        console.log("List updated successfully");
      } catch (e) {
        console.error("Error updating document: ", e);
      }
    },
    [id]
  );

  const getList = useCallback(async () => {
    if (!id) return;

    try {
      const listRef = doc(db, "lists", String(id));
      const docSnap = await getDoc(listRef);
      if (docSnap.exists()) {
        const { Flow, Edge } = docSnap.data();
        setNodes(Flow);
        setEdges(Edge);
        return;
      } else {
        console.log("No such document!");
      }
    } catch (e) {
      console.error("Error getting document: ", e);
    }
  }, [id]);

  useEffect(() => {
    // get list from firebase
    if (id) {
      getList();
    }
  }, [getList, id]);

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
          {currentMenu === "set_data" && (
            <form onSubmit={addData} className="flex flex-col gap-3 mb-5">
              <Select
                options={options}
                onChange={handleSelectChange}
                inputValue={selectInfo.option}
              />
              <input
                className="h-9 px-2"
                onChange={handleInputChange}
                defaultValue={selectInfo.value}
              />
              <button className="btn" type="submit">
                ADD DATA
              </button>
            </form>
          )}
          {currentMenu === "add_rows" && (
            <button className="btn" onClick={setData}>
              SET DATA
            </button>
          )}
          {+currentNode !== 1 && (
            <button className="btn !bg-[red]" onClick={deleteNode}>
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
      <button
        className="absolute  bottom-10 right-10 flex gap-1 p-2 bg-blue-100 rounded hover:bg-blue-300"
        onClick={onPlay}
      >
        <p>RUN ONCE</p>
        <PlayArrow />
      </button>
    </div>
  );
};

export default Workflow;
