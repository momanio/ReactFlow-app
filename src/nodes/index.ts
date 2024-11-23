import type { NodeTypes } from "@xyflow/react";
import { PositionLoggerNode } from "./PositionLoggerNode";
import CustomNode from "../components/CustomNode";
import { AppNode } from "./types";

export const initialNodes: AppNode[] = [
  {
    id: "A0",
    type: "position-logger",
    position: { x: 0, y: 0 },
    data: { label: "Root" },
  },
];

export const nodeTypes = {
  "position-logger": PositionLoggerNode,
  custom: CustomNode, // Register CustomNode
} satisfies NodeTypes;
