import type { Node, XYPosition } from "@xyflow/react";

// Define PositionLoggerNode
export type PositionLoggerNode = Node<{ label: string }, "position-logger">;

// Define CustomNodeBase
export interface CustomNodeBase<
  Data extends Record<string, unknown>,
  Type extends string
> extends Node<Data, Type> {
  id: string;
  position: XYPosition;
  type?: Type;
}

// Extend Node to include necessary internal properties
export interface ExtendedNode
  extends CustomNodeBase<{ label: string }, string> {
  internals: {
    positionAbsolute: XYPosition;
    z: number;
    userNode: CustomNodeBase<{ label: string }, string>;
  };
}

// Union type for AppNode
export type AppNode = PositionLoggerNode | ExtendedNode;
