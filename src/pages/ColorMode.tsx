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
  type ColorMode,
  type OnConnect,
  useReactFlow,
  NodeChange,
  OnConnectEnd,
  XYPosition,
} from "@xyflow/react";

import { Button } from "@nextui-org/react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import "@xyflow/react/dist/style.css";
import { AppNode } from "../nodes/types";
import NodeModal from "../components/NodeModal";

let id = 1;
const getId = () => `${id++}`;

const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("dark");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const { screenToFlowPosition } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modal State
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");
  const [newNodePosition, setNewNodePosition] = useState(null);
  const [newConnectionState, setNewConnectionState] = useState(null);
  const [newNodeGender, setNewNodeGender] = useState("");
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onConnectEnd: OnConnectEnd = useCallback(
    (event, connectionState) => {
      if (!connectionState.isValid) {
        const { clientX, clientY } =
          "changedTouches" in event ? event.changedTouches[0] : event;

        const position: XYPosition = screenToFlowPosition({
          x: clientX,
          y: clientY,
        });

        setNewNodePosition(position);
        setNewConnectionState(connectionState);
        setIsNameModalOpen(true); // Open modal for node name input
      }
    },
    [screenToFlowPosition]
  );

  const createNodeWithName = () => {
    if (!nodeName) return; // Ensure a name is provided

    const id = getId();
    const newNode: Node = {
      id,
      position: newNodePosition!,
      data: { label: nodeName },
      style: {
        backgroundColor: newNodeGender === "1" ? "#4078F9" : "#E09595",
        color: "black",
        borderRadius: "20px",
      },
    };
    console.log(newNodeGender);

    setNodes((nds) => [...nds, newNode as AppNode]);

    if (newConnectionState) {
      setEdges((eds) =>
        eds.concat({
          id: `edge-${id}`,
          source: newConnectionState.fromNode?.id,
          target: id,
        })
      );
    }

    console.log("Parent Node id:", newConnectionState!.fromNode.id);
    // Reset modal state
    setNodeName("");
    setNewNodePosition(null);
    setNewConnectionState(null);
    setIsNameModalOpen(false);
  };
  const onChange: ChangeEventHandler<HTMLSelectElement> = (evt) => {
    setColorMode(evt.target.value as ColorMode);
  };

  // Add new node function

  // Track the selected node
  const handleNodeSelect = useCallback((changes: NodeChange[]) => {
    const selectedNode = changes.find((change) => change.selected)?.id || null;
    setSelectedNodeId(selectedNode);
    console.log("Selected node:", selectedNode);
  }, []);

  const deleteSelectedNode = useCallback(() => {
    if (!selectedNodeId) return;

    const nodesToRemove = new Set<string>();
    const traverseNodes = (id: string) => {
      nodesToRemove.add(id);
      nodes.forEach((node) => {
        if (node.parentId === id) traverseNodes(node.id);
      });
    };

    traverseNodes(selectedNodeId);

    setNodes((nds) => nds.filter((node) => !nodesToRemove.has(node.id)));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          !nodesToRemove.has(edge.source) && !nodesToRemove.has(edge.target)
      )
    );

    setSelectedNodeId(null);
  }, [selectedNodeId, setNodes, setEdges, nodes]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#fff" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={nodeTypes}
        edges={edges}
        edgeTypes={edgeTypes}
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
        {/* Modal for entering node name */}

        <NodeModal
          isOpen={isNameModalOpen}
          nodeName={nodeName}
          onNodeNameChange={setNodeName}
          onGenderChange={setNewNodeGender}
          onClose={() => setIsNameModalOpen(false)}
          onSubmit={createNodeWithName}
        />
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
          <Button onClick={deleteSelectedNode} disabled={!selectedNodeId}>
            Delete Node{" "}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ColorModeFlow;
