import {
  Modal,
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";

export const DeleteNodeModal = ({
  isOpen,
  onClose,
  onDeleteNodeOnly,
  onDeleteNodeAndChildren,
}: {
  isOpen: boolean;
  onClose: () => void;
  onDeleteNodeOnly: () => void;
  onDeleteNodeAndChildren: () => void;
}) => (
  <Modal open={isOpen} onClose={onClose}>
    <ModalHeader>
      <h3>Delete Node</h3>
    </ModalHeader>
    <ModalBody>
      <p>
        Do you want to delete the node only or delete the node and all its
        children?
      </p>
    </ModalBody>
    <ModalFooter>
      <Button onClick={onDeleteNodeOnly}>Delete Node Only</Button>
      <Button onClick={onDeleteNodeAndChildren} color="error">
        Delete Node and Children
      </Button>
    </ModalFooter>
  </Modal>
);
