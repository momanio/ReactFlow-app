import { useState, useCallback } from "react";
import { useNodesState } from "@xyflow/react";
import { initialNodes } from "../nodes";
import { AppNode } from "../nodes/types";

let id = 1;
const getId = () => `${id++}`;

export const useNodes = (savedNodes = initialNodes) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(savedNodes);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const handleNodeSelect = useCallback((changes: any[]) => {
    const selectedNode = changes.find((change) => change.selected)?.id || null;
    setSelectedNodeId(selectedNode);
  }, []);

  const addNode = useCallback(
    (nodeName: string, position: any, gender: string) => {
      if (!nodeName.trim()) return;

      const id = getId();
      const newNode: AppNode = {
        id,
        position,
        data: { label: nodeName },
        style: {
          backgroundColor: gender === "1" ? "#4078F9" : "#E09595",
          color: "black",
          borderRadius: "20px",
        },
      };
      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes]
  );

  return {
    nodes,
    setNodes,
    onNodesChange,
    selectedNodeId,
    setSelectedNodeId,
    handleNodeSelect,
    addNode,
  };
};
