import { useState } from "react";

export const useColorMode = (savedColorMode: string = "dark") => {
  const [colorMode, setColorMode] = useState(savedColorMode);

  return {
    colorMode,
    setColorMode,
  };
};
