import React, { useCallback, useRef } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  Connection,
  Edge,
  Node,
} from "reactflow";

const initialNodes: Node[] = [
  {
    id: "0",
    type: "input",
    data: { label: "Root" },
    position: { x: 0, y: 50 },
  },
];

let id = 1;
const getId = (): string => `${id++}`;

const fitViewOptions = {
  padding: 3,
};

export const Flow: React.FC = () => {
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const connectingNodeId = useRef<string | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const { project } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectStart = useCallback(
    (_: React.MouseEvent, { nodeId }: { nodeId: string }) => {
      connectingNodeId.current = nodeId;
    },
    []
  );

  const onConnectEnd = useCallback(
    (event: MouseEvent) => {
      if (!reactFlowWrapper.current) return;

      const targetIsPane = (event.target as HTMLElement).classList.contains(
        "react-flow__pane"
      );

      if (targetIsPane) {
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode: Node = {
          id,
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top,
          }),
          data: { label: `Node ${id}` },
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current!, target: id })
        );
      }
    },
    [project, setNodes, setEdges]
  );

  return (
    <div className="wrapper" ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onConnectStart={onConnectStart}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={fitViewOptions}
      />
    </div>
  );
};
