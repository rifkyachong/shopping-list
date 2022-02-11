import React, { useState } from "react";

const useForceRender = () => {
  const [, setValue] = useState(0);
  return () => setValue((value) => value + 1);
};

export default useForceRender;
