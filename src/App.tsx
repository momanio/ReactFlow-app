import { ReactFlowProvider } from "@xyflow/react";

import ColorModeFlow from "./pages/ColorMode";
import "./App.css";
function App() {
  return (
    <ReactFlowProvider>
      <ColorModeFlow />
    </ReactFlowProvider>
  );
}

export default App;
