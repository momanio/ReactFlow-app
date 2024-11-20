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
  getIncomers,
  getOutgoers,
  getConnectedEdges,
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

import "@xyflow/react/dist/style.css";

let id = 1;
const getId = () => `${id++}`;
const gender = [
  { key: 1, name: "male", value: "#ff0000" },
  { key: 2, name: "female", value: "#0000ff" },
];
const ColorModeFlow = () => {
  const [colorMode, setColorMode] = useState<ColorMode>("system");
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [newNodeName, setNewNodeName] = useState(""); // New node name
  const [nextNodeId, setNextNodeId] = useState(1); // Track node IDs
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

        const position = screenToFlowPosition({
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
        backgroundColor: newNodeGender,
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
    console.log("Gender", newNodeGender);
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
  const addNode = () => {
    if (!newNodeName) return; // Avoid creating a node without a name

    const newNode: Node = {
      id: `node-${nextNodeId}`,
      position: { x: Math.random() * 50, y: Math.random() * 50 }, // Random position within view
      data: { label: newNodeName },
    };

    console.log(newNode);
    setNodes((nds) => [...nds, newNode]);
    setNextNodeId(nextNodeId + 1); // Increment for unique ID
    setNewNodeName(""); // Clear input field after creation
  };

  // Track the selected node
  const handleNodeSelect = useCallback((changes: NodeChange[]) => {
    const selectedNode = changes.find((change) => change.selected)?.id || null;
    setSelectedNodeId(selectedNode);
  }, []);

  const onNodesDelete = useCallback(
    (deleted) => {
      setEdges(
        deleted.reduce((acc, node) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge) =>
              !connectedEdges.find(
                (connectedEdge) => connectedEdge.id === edge.id
              )
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges, setEdges, setNodes]
  );

  const deleteSelectedNode = useCallback(
    (connectionState) => {
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
      console.log("Deleted node and its sub-tree:");

      // Clear the selected node
      setSelectedNodeId(null);
    },
    [selectedNodeId, setNodes, setEdges, nodes, edges]
  );

  return (
    <div style={{ height: "100vh", backgroundColor: "black" }}>
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
        onNodesDelete={onNodesDelete}
        colorMode={colorMode}
        onConnect={onConnect}
        onConnectEnd={onConnectEnd}
        fitView
        fitViewOptions={{ padding: 2 }}
        style={{ backgroundColor: "#fff" }}
      >
        <MiniMap />
        <Background />
        <Controls />
        {/* Modal for entering node name */}
        <Modal
          isOpen={isNameModalOpen}
          onOpenChange={setIsNameModalOpen}
          placement="top-center"
          className="flex flex-col items-center flex-grow justify-center bg-slate-400 opacity-80"
        >
          <ModalContent>
            <ModalBody>
              <Input
                placeholder="Enter node name"
                value={nodeName}
                onChange={(e) => setNodeName(e.target.value)}
              />
              <Select
                label="Select Gender"
                className="max-w-xs"
                onChange={(e) => setNewNodeGender(e)}
              >
                {gender.map((g) => (
                  <SelectItem key={g.key}>{g.name}</SelectItem>
                ))}
              </Select>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="flat"
                onPress={() => {
                  setIsNameModalOpen(false);
                  setNodeName("");
                }}
              >
                Cancel
              </Button>
              <Button color="primary" onPress={createNodeWithName}>
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
          <Input
            className="rounded-lg display-block mb-2"
            type="text"
            placeholder="Enter node name"
            radius="lg"
            value={newNodeName}
            onChange={(e) => setNewNodeName(e.target.value)}
          />
          <Button onPress={addNode}>Add Node</Button>
          <Button onClick={deleteSelectedNode} hidden={!selectedNodeId}>
            Delete Node{" "}
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export default ColorModeFlow;
