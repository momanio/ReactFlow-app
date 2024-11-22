import React from "react";
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
import { Gender } from "../constants";

interface NodeModalProps {
  isOpen: boolean;
  nodeName: string;
  onNodeNameChange: (value: string) => void;
  onGenderChange: (value: string) => void;
  onClose: () => void;
  onSubmit: () => void;
}

const NodeModal: React.FC<NodeModalProps> = ({
  isOpen,
  nodeName,
  onNodeNameChange,
  onGenderChange,
  onClose,
  onSubmit,
}) => (
  <Modal
    isOpen={isOpen}
    onOpenChange={onClose}
    placement="top-center"
    className="flex flex-col items-center flex-grow justify-center mt-20 pt-5 bg-[#585E5B] opacity-90"
  >
    <ModalContent>
      <ModalBody>
        <Input
          placeholder="Enter Node Name"
          value={nodeName}
          onChange={(e) => onNodeNameChange(e.target.value)}
          className="w-full"
        />
        <Select
          label="Select Gender"
          className="w-full"
          onChange={(e) => onGenderChange(e.target.value)}
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
          onPress={onClose}
        >
          Cancel
        </Button>
        <Button
          color="primary"
          className="bg-gradient-to-r from-teal-400 to-blue-500 hover:from-pink-500 hover:to-orange-500 text-white shadow-lg"
          onPress={onSubmit}
        >
          Add Node
        </Button>
      </ModalFooter>
    </ModalContent>
  </Modal>
);

export default NodeModal;
