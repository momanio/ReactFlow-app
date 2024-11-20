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
const Modal = () => {
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [nodeName, setNodeName] = useState("");
  const [newNodePosition, setNewNodePosition] = useState(null);
  const [newConnectionState, setNewConnectionState] = useState(null);
  const [newNodeGender, setNewNodeGender] = useState("");
  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );
  return (
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
  );
};

export default Modal;
