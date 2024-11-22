import React from "react";

interface PanelsProps {
  colorMode: string;
  setColorMode: (mode: string) => void;
  deleteNode: () => void;
  isDeleteDisabled: boolean;
}

const Panels: React.FC<PanelsProps> = ({
  colorMode,
  setColorMode,
  deleteNode,
  isDeleteDisabled,
}) => {
  return (
    <>
      {/* Color Mode Panel */}
      <div className="panel top-right">
        <select
          onChange={(e) => setColorMode(e.target.value)}
          value={colorMode}
        >
          <option value="dark">dark</option>
          <option value="light">light</option>
          <option value="system">system</option>
        </select>
      </div>

      {/* Delete Node Panel */}
      <div className="panel top-left">
        <button onClick={deleteNode} disabled={isDeleteDisabled}>
          Delete Node
        </button>
      </div>
    </>
  );
};

export default Panels;
