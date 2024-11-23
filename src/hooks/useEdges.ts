import { useCallback } from "react";
import { addEdge, useEdgesState } from "@xyflow/react";
import { initialEdges } from "../edges";

export const useEdges = (savedEdges = initialEdges) => {
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedEdges);

  const onConnect = useCallback(
    (params: any) => {
      if (params.source && params.target) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
    [setEdges]
  );

  const deleteEdgesConnectedToNode = useCallback(
    (nodeId: string) => {
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== nodeId && edge.target !== nodeId)
      );
    },
    [setEdges]
  );

  return {
    edges,
    setEdges,
    onEdgesChange,
    onConnect,
    deleteEdgesConnectedToNode,
  };
};
