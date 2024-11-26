"use client";

import { Node, ReactFlow, useReactFlow } from "@xyflow/react";
import Select, { SingleValue } from "react-select";

import {
  ChangeEvent,
  FormEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import "@xyflow/react/dist/style.css";
import { HourglassEmpty, PlayArrow } from "@mui/icons-material";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import { arrayUnion, doc, getDoc, updateDoc } from "firebase/firestore";
import { EdgeType, NodeType } from "./WorkflowList";
import usePopToast from "@/hooks/usePopToast";
import usePostData from "@/hooks/usePostData";

type SelectInfoType = {
  value: string;
  option: string;
};
const Workflow = () => {
  const { id } = useParams();
  const [nodes, setNodes] = useState<NodeType[]>([]);
  const [edges, setEdges] = useState<EdgeType[]>([]);
  const { getViewport } = useReactFlow();
  const [currentNode, setCurrentNode] = useState<string | null>(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [currentMenu, setCurrentMenu] = useState("");
  const [selectInfo, setSelectInfo] = useState<SelectInfoType>({
    value: "",
    option: "",
  });
  const { popToast } = usePopToast();
  const { postDataToSheet, status } = usePostData();

  const options = useMemo(
    () => [
      { value: "name", label: "name" },
      { value: "color", label: "color" },
      { value: "count", label: "count" },
    ],
    []
  );

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

    // update firebase
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

  const addData = (e: FormEvent) => {
    e.preventDefault();
    updateData(selectInfo);
    setCurrentNode(null);
  };

  const handleSelectChange = (
    selectedOption: SingleValue<{ value: string; label: string }>
  ) => {
    setSelectInfo((prev) => ({ ...prev, option: selectedOption?.value ?? "" }));
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSelectInfo((prev) => ({ ...prev, value: e.target.value }));
  };

  const onPlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (nodes.at(-1)?.data.label.includes("SET DATA")) {
      postDataToSheet(selectInfo);
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
        popToast({ type: "success", title: "새로운 리스트를 추가했습니다 !" });
      } catch (e) {
        popToast({ type: "error", title: `에러 : ${e}` });
      }
    },
    [id, popToast]
  );

  const updateData = async (Data: SelectInfoType) => {
    if (!id) return;
    try {
      const listRef = doc(db, "lists", String(id));
      await updateDoc(listRef, {
        Data,
      });
      popToast({ type: "success", title: "데이터 업데이트에 성공했습니다 !" });
    } catch (e) {
      popToast({ type: "error", title: `에러 : ${e}` });
    }
  };

  const getList = useCallback(async () => {
    if (!id) return;
    try {
      const listRef = doc(db, "lists", String(id));
      const docSnap = await getDoc(listRef);
      if (docSnap.exists()) {
        const { Flow, Edge, Data } = docSnap.data();
        setNodes(Flow);
        setEdges(Edge);
        setSelectInfo(Data);
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

  const currentSelect = useMemo(
    () => options.filter((item) => item.label === selectInfo?.option),
    [options, selectInfo?.option]
  );

  const isProcessing = useMemo(() => status === "pending", [status]);

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
                value={currentSelect}
              />
              <input
                className="h-9 px-2"
                onChange={handleInputChange}
                defaultValue={selectInfo.value}
              />
              <button className="btn" type="submit">
                Set Data
              </button>
            </form>
          )}
          {currentMenu === "add_rows" && (
            <button className="btn" onClick={setData}>
              Set Data
            </button>
          )}
          {+currentNode !== 1 && (
            <button className="btn !bg-[red]" onClick={deleteNode}>
              Delete
            </button>
          )}
          {currentMenu !== "add_rows" && (
            <button className="btn" onClick={addRows}>
              Add rows
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
        className={`absolute bottom-10 right-10 flex gap-1 p-2 bg-blue-100 rounded hover:bg-blue-300 ${
          isProcessing ? "cursor-wait" : ""
        }`}
        disabled={isProcessing}
        onClick={onPlay}
      >
        {isProcessing ? (
          <>
            <p>Processing..</p>
            <HourglassEmpty className="animate-spin" />
          </>
        ) : (
          <>
            <p>Run once</p>
            <PlayArrow />
          </>
        )}
      </button>
    </div>
  );
};

export default Workflow;
