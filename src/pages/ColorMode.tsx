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

import {
  Modal,
  ModalContent,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  SelectItem,
} from "@nextui-org/react";
import { initialNodes, nodeTypes } from "../nodes";
import { initialEdges, edgeTypes } from "../edges";
import { Gender } from "../constants";
import "@xyflow/react/dist/style.css";

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

  const onConnectEnd = useCallback(
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
      position: newNodePosition,
      data: { label: nodeName },
      style: {
        backgroundColor: newNodeGender === "1" ? "#4078F9" : "#E09595",
        color: "black",
        borderRadius: "20px",
      },
    };
    console.log(newNodeGender);

    setNodes((nds) => [...nds, newNode]);

    setEdges((eds) =>
      eds.concat({
        id: `edge-${id}`,
        source: newConnectionState?.fromNode?.id,
        target: id,
      })
    );
    console.log("Parent", newConnectionState?.fromNode?.id);
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

  const deleteSelectedNode = useCallback(
    (connectionState: OnConnectEnd) => {
      if (!selectedNodeId) return;

      // Helper function to find all descendant nodes recursively
      const findDescendants = (nodeId: string, nodesList: Node[]): string[] => {
        const directChildren = nodesList
          .filter((node) => node.parentId === nodeId)
          .map((node) => node.id);

        return directChildren.reduce(
          (acc, childId) => [...acc, ...findDescendants(childId, nodesList)],
          directChildren
        );
      };

      // Find all descendant nodes starting from the selected node
      const descendantNodeIds = findDescendants(selectedNodeId, nodes);

      // Nodes to remove (selected node + its descendants)
      const nodesToRemove = [selectedNodeId, ...descendantNodeIds];

      // Filter out the nodes to remove
      setNodes((nds) => nds.filter((node) => !nodesToRemove.includes(node.id)));

      // Filter out edges connected to the nodes to remove
      setEdges((eds) =>
        eds.filter(
          (edge) =>
            !nodesToRemove.includes(edge.source) &&
            !nodesToRemove.includes(edge.target)
        )
      );
      setEdges((eds) =>
        eds.concat({
          id: getId(),
          source: connectionState.fromNode.id,
          target: getId(),
        })
      );
      setNodes((nds) => [...nds, newNode]);
      console.log("Deleted node and its sub-tree:");

      // Clear the selected node
      setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges, nodes, edges]
  );

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
        <Modal
          isOpen={isNameModalOpen}
          onOpenChange={setIsNameModalOpen}
          placement="top-center"
          className="flex flex-col items-center flex-grow justify-center mt-20 pt-5 bg-[#585E5B] opacity-90"
        >
          <ModalContent>
            <ModalBody>
              <Input
                placeholder="Enter Node Name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
                className="w-full"
              />
              <Select
                label="Select Gender"
                className="w-full"
                onChange={(e) => setNewNodeGender(e.target.value)}
              >
                {Gender.map((g) => (
                  <SelectItem key={g.key}>{g.name}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 hover:to-orange-500 text-white shadow-lg"
                onPress={() => {
                  setIsNameModalOpen(false);
                  setNodeName("");
                }}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white shadow-lg"
                onPress={createNodeWithName}
              >
                Add Node
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
