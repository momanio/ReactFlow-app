import type { Edge, EdgeTypes } from "@xyflow/react";

export const initialEdges: Edge[] = [{ id: "A-B", source: "A", target: "B" }];

export const edgeTypes = {
  // Add your custom edge types here!
} satisfies EdgeTypes;
