import { useEffect } from "react";
import { Node, Edge } from "@xyflow/react";

const LOCAL_STORAGE_KEY = "ColorModeFlowState";

export const useLocalStorage = (
  nodes: Node[],
  edges: Edge[],
  colorMode: "light" | "dark"
) => {
  useEffect(() => {
    const state = {
      savedNodes: nodes,
      savedEdges: edges,
      savedColorMode: colorMode,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [nodes, edges, colorMode]);

  const loadFromLocalStorage = () => {
    const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedState) {
      try {
        return JSON.parse(savedState) as {
          savedNodes: Node[];
          savedEdges: Edge[];
          savedColorMode: "light" | "dark";
        };
      } catch (error) {
        console.error("Failed to load saved state:", error);
      }
    }
    return null;
  };

  return { loadFromLocalStorage };
};
