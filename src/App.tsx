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
  type Node,
  type Edge,
  type ColorMode,
  type OnConnect,
  useReactFlow,
  ReactFlowProvider,
  NodeChange,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";

import { Input } from "@nextui-org/react";

let id = 1;
const getId = () => `${id++}`;

const initialNodes: Node[] = [
  {
    id: "A",
    type: "input",
    position: { x: 0, y: 0 },
    data: { label: "Root" },
  },
];

const initialEdges: Edge[] = [{ id: "A-B", source: "A", target: "B" }];
const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState(""); // New node name
  const [nextNodeId, setNextNodeId] = useState(1); // Track node IDs
  const { screenToFlowPosition } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectEnd = useCallback(
    (event, connectionState) => {
      // when a connection is dropped on the pane it's not valid
      if (!connectionState.isValid) {
        // we need to remove the wrapper bounds, in order to get the correct position
        const id = getId();
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;
        const newNode = {
          id,
          position: screenToFlowPosition({
            x: clientX,
            y: clientY,
          }),
          data: { label: `Node ${id}` },
          origin: [0.5, 0.0],
        };

        setNodes((nds) => [...nds, newNode]);
        setEdges((eds) =>
          eds.concat({ id, source: connectionState.fromNode.id, target: id })
        );
      }
      console.log(id);
    },
    [screenToFlowPosition]
  );

  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  // Add new node function
  const addNode = () => {
    if (!newNodeName) return; // Avoid creating a node without a name

    const newNode: Node = {
      id: `node-${nextNodeId}`,
      position: { x: Math.random() * 50, y: Math.random() * 50 }, // Random position within view
      data: { label: newNodeName },
    };

    setNodes((nds) => [...nds, newNode]);
    setNextNodeId(nextNodeId + 1); // Increment for unique ID
    setNewNodeName(""); // Clear input field after creation
  };

  // Track the selected node
  const handleNodeSelect = useCallback((changes: NodeChange[]) => {
    const selectedNode = changes.find((change) => change.selected)?.id || null;
    setSelectedNodeId(selectedNode);
    console.log("Selected node:", selectedNode);
  }, []);

  // Delete the selected node
  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;

    // Remove the node
    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));

    // Remove edges connected to the node
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );

    // Clear selection after deletion
    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges]);

  return (
    <div style={{ height: "100vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          handleNodeSelect(changes);
        }}
        colorMode={colorMode}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
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
        </Panel>

        {/* New Node Panel */}
        <Panel position="top-left">
          <Input
            type="text"
            placeholder="Enter node name"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
            onNodesChange={(changes: NodeChange) => {
              onNodesChange(changes);
              handleNodeSelect(changes); // Track node selection
            }}
            onConnectEnd={onConnectEnd}
          />
          <button onClick={addNode}>Add Node</button>
          <button onClick={deleteSelectedNode} disabled={!selectedNodeId}>
            Delete Node{" "}
          </button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default () => (
  <ReactFlowProvider>
    <ColorModeFlow />
  </ReactFlowProvider>
);
