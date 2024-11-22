import React from "react";

interface ColorModeToggleProps {
  colorMode: string;
  onChange: (value: string) => void;
}

const ColorModeToggle: React.FC<ColorModeToggleProps> = ({
  colorMode,
  onChange,
}) => {
  const handleChange: React.ChangeEventHandler<HTMLSelectElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <select
        onChange={handleChange}
        value={colorMode}
        data-testid="colormode-select"
      >
        <option value="dark">dark</option>
        <option value="light">light</option>
        <option value="system">system</option>
      </select>
    </div>
  );
};

export default ColorModeToggle;
