import { Handle, Position } from "@xyflow/react";

interface NodeProps {
  data: {
    label: string;
  };
  id: string;
  selected?: boolean;
  onDelete: (nodeId: string) => void; // A prop to handle the delete action
}

const CustomNode = ({
  data,
  id,
  onDelete,
}: NodeProps & { onDelete?: (nodeId: string) => void }) => {
  return (
    <div style={{ padding: "10px", borderRadius: "8px", background: "#fff" }}>
      <div>{data.label}</div>

      {/* Delete button */}
      <button
        onClick={(e) => {
          e.stopPropagation(); // Prevent triggering the node selection on button click
          onDelete(id); // Call the delete handler passed from the parent
        }}
        style={{
          marginTop: "10px",
          padding: "5px 10px",
          backgroundColor: "red",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Delete
      </button>

      {/* Node Handle */}
      <Handle type="source" position={Position.Right} />
      <Handle type="target" position={Position.Left} />
    </div>
  );
};

export default CustomNode;
