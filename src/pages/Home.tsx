import { ReactFlowProvider } from "@xyflow/react";

import ColorModeFlow from "./ColorMode";

const Home = () => {
  return (
    <ReactFlowProvider>
      <ColorModeFlow />
    </ReactFlowProvider>
  );
};

export default Home;
