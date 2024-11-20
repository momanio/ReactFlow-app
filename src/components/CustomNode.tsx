import { useReactFlow, NodeProps } from "@xyflow/react";

const CustomNode = ({ id, data }: NodeProps) => {
  const { setNodes, setEdges } = useReactFlow();

  const deleteNode = () => {
    setNodes((nds) => nds.filter((node) => node.id !== id));
    setEdges((eds) =>
      eds.filter((edge) => edge.source !== id && edge.target !== id)
    );
  };

  return (
    <div style={{ padding: "10px", borderRadius: "5px", background: "white" }}>
      <div>{data.label}</div>
      <div style={{ marginTop: "10px" }}>
        <button
          style={{
            padding: "5px",
            marginRight: "5px",
            background: "#ff6666",
            color: "white",
            border: "none",
            borderRadius: "3px",
          }}
          onClick={deleteNode}
        >
          Delete Node
        </button>
      </div>
    </div>
  );
};

export default CustomNode;
