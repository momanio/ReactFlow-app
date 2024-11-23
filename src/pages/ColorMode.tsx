import { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  addEdge,
  useNodesState,
  useEdgesState,
  MiniMap,
  Background,
  Controls,
  Panel,
  type OnConnect,
  useReactFlow,
  OnConnectEnd,
  XYPosition,
  FinalConnectionState,
  NodeChange,
  ColorMode,
} from "@xyflow/react";

import { initialNodes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";

import NodeModal from "../components/NodeModal";
import ColorModeToggle from "../components/ColorModeToggle";

import { AppNode } from "../nodes/types";
import { DeleteNodeModal } from "../components/DeleteNodeModal";
import { useColorMode } from "../hooks/useColorMode";
import "@xyflow/react/dist/style.css";
import { PositionLoggerNode } from "../nodes/PositionLoggerNode";
import CustomNode from "../components/CustomNode";
const LOCAL_STORAGE_KEY = "ColorModeFlowState";

let id = 1;
const getId = () => `${id++}`;

// load data from local storage
const loadFromLocalStorage = () => {
  const savedState = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (savedState) {
    try {
      const { savedNodes, savedEdges, savedColorMode } = JSON.parse(savedState);
      id =
        Math.max(
          ...savedNodes
            .map((node: AppNode) => parseInt(node.id, 10))
            .filter((n: number) => !isNaN(n)),
          id
        ) + 1;
      return { savedNodes, savedEdges, savedColorMode };
    } catch (error) {
      console.error("Failed to load saved state:", error);
    }
  }
  return {
    savedNodes: initialNodes,
    savedEdges: initialEdges,
    savedColorMode: "dark",
  };
};

const ColorModeFlow = () => {
  const { savedNodes, savedEdges, savedColorMode } = loadFromLocalStorage();

  // custom hook to manage colorMode
  const { colorMode, setColorMode } = useColorMode(savedColorMode);

  const [nodes, setNodes, onNodesChange] = useNodesState(savedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(savedEdges);

  const { screenToFlowPosition } = useReactFlow();
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Modal State
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [nodeName, setNodeName] = useState("");
  const [newNodePosition, setNewNodePosition] = useState<XYPosition>({
    x: 0,
    y: 0,
  });
  const [newConnectionState, setNewConnectionState] = useState<
    Partial<FinalConnectionState>
  >({
    fromNode: null,
    isValid: false,
  });

  const [newNodeGender, setNewNodeGender] = useState("");

  const onConnect: OnConnect = useCallback(
    (params) => {
      if (params.source && params.target) {
        setEdges((eds) => addEdge(params, eds));
      }
    },
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
        setIsNameModalOpen(true);
      }
    },
    [screenToFlowPosition]
  );

  const createNodeWithName = () => {
    if (!nodeName.trim()) return;

    const id = getId();
    const newNode: AppNode = {
      id,
      type: "custom",
      position: newNodePosition,
      data: { label: nodeName },
      internals: {
        positionAbsolute: newNodePosition,
        z: 1,
        userNode: {
          id,
          data: { label: nodeName },
          position: {
            x: 0,
            y: 0,
          },
        },
      },
      style: {
        backgroundColor: newNodeGender === "1" ? "#4078F9" : "#E09595",
        color: "black",
        borderRadius: "20px",
      },
    };

    setNodes((nds) => [...nds, newNode]);

    if (newConnectionState?.fromNode) {
      setEdges((eds) =>
        eds.concat({
          id: `edge-${newConnectionState.fromNode!.id}-${id}`,
          source: newConnectionState.fromNode!.id,
          target: id,
        })
      );
    }

    setNodeName("");
    setNewNodePosition({ x: 0, y: 0 });
    setNewConnectionState({ fromNode: null, isValid: false });
    setIsNameModalOpen(false);
  };

  const handleNodeSelect = useCallback((changes: NodeChange[]) => {
    const selectedNode =
      changes.find((change) => "selected" in change && change.selected)?.id ||
      null;
    setSelectedNodeId(selectedNode);
  }, []);

  const deleteNodeOnly = useCallback(() => {
    if (!selectedNodeId) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNodeId));
    setEdges((eds) =>
      eds.filter(
        (edge) =>
          edge.source !== selectedNodeId && edge.target !== selectedNodeId
      )
    );

    setSelectedNodeId(null);
    setIsDeleteModalOpen(false);
  }, [selectedNodeId, setNodes, setEdges]);

  const deleteNodeAndChildren = useCallback(() => {
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
    setIsDeleteModalOpen(false);
  }, [selectedNodeId, setNodes, setEdges, nodes]);

  // Save state to local storage on change
  useEffect(() => {
    const state = {
      savedNodes: nodes,
      savedEdges: edges,
      savedColorMode: colorMode,
    };
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state));
  }, [nodes, edges, colorMode]);

  return (
    <div style={{ height: "100vh", backgroundColor: "#fff" }}>
      <ReactFlow
        nodes={nodes}
        nodeTypes={{
          "position-logger": PositionLoggerNode,
          custom: CustomNode,
        }}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onNodesChange={(changes) => {
          onNodesChange(changes);
          handleNodeSelect(changes);
        }}
        colorMode={colorMode as ColorMode}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
      >
        <MiniMap />
        <Background />
        <Controls />

        <NodeModal
          isOpen={isNameModalOpen}
          nodeName={nodeName}
          onNodeNameChange={setNodeName}
          onGenderChange={setNewNodeGender}
          onClose={() => setIsNameModalOpen(false)}
          onSubmit={createNodeWithName}
        />

        <DeleteNodeModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onDeleteNodeOnly={deleteNodeOnly}
          onDeleteNodeAndChildren={deleteNodeAndChildren}
        />

        <Panel position="top-right">
          <ColorModeToggle
            colorMode={colorMode}
            onChange={(mode) => setColorMode(mode as ColorMode)}
          />
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ColorModeFlow;
