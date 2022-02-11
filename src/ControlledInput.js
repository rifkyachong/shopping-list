import React, { useState, useEffect } from "react";

const ControlledInput = React.forwardRef((prop, ref) => {
  const [userInput, setUserInput] = useState("");

  return (
    <input
      {...prop}
      onInput={(e) => {
        setUserInput(e.target.value);
      }}
      ref={ref}
      value={userInput}
    />
  );
});

export default ControlledInput;
