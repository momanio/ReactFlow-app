import { useCallback, useState, type ChangeEventHandler } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Controls,
  Panel,
  Position,
  type Node,
  type Edge,
  type ColorMode,
  type OnConnect,
  SelectionMode,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import DarkModeToggle from "./components/DarkModeToggle";

const nodeDefaults = {
  sourcePosition: Position.Bottom,
  targetPosition: Position.Top,
  Animation: true,
  selectionMode: SelectionMode.Full,
};

const initialNodes: Node[] = [
  {
    id: "A",
    type: "input",
    position: { x: 400, y: 100 },
    data: { label: "A👋" },
    className: "node-animated",
  },
];

const initialEdges: Edge[] = [{ id: "A-B", source: "A", target: "B" }];
const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState(""); // New node name
  const [nextNodeId, setNextNodeId] = useState(1); // Track node IDs

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  /* const onConnectEnd: OnConnectEnd = useCallback(
    (event) => {
      const targetIsPane = event.target.classList.contains("react-flow__pane");

      if (targetIsPane) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const { top, left } = reactFlowWrapper.current.getBoundingClientRect();
        const id = getId();
        const newNode = {
          id,
          // we are removing the half of the node width (75) to center the new node
          position: project({
            x: event.clientX - left - 75,
            y: event.clientY - top
          }),
          data: { label: `Node ${id}` }
        };

        setNodes((nds) => nds.concat(newNode));
        setEdges((eds) =>
          eds.concat({ id, source: connectingNodeId.current, target: id })
        );
      }
    },
    [project]
  ); */

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  // Add new node function
  const addNode = () => {
    if (!newNodeName) return; // Avoid creating a node without a name

    const newNode: Node = {
      id: `node-${nextNodeId}`,
      position: { x: Math.random() * 300, y: Math.random() * 300 }, // Random position within view
      data: { label: newNodeName },
      ...nodeDefaults,
    };

    setNodes((nds) => [...nds, newNode]);
    setNextNodeId(nextNodeId + 1); // Increment for unique ID
    setNewNodeName(""); // Clear input field after creation
  };

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        colorMode={colorMode}
        fitView
      >
        <MiniMap />
        <Background />
        <Controls />

        {/* Color Mode Panel */}
        <Panel position="top-right">
          <select onChange={onChange} data-testid="colormode-select">
            <option value="dark">dark</option>
            <option value="light">light</option>
            <option value="system">system</option>
          </select>
          <DarkModeToggle />
        </Panel>

        {/* New Node Panel */}
        <Panel position="top-left">
          <input
            type="text"
            placeholder="Enter node name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
          />
          <button onClick={addNode}>Add Node</button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ColorModeFlow;
