import { useState } from "react";

function useToggle(initialState = false) {
  const [state, setState] = useState(initialState);

  const toggle = (value) => {
    setState(typeof value === "boolean" ? value : !state);
  };

  const open = () => {
    setState(true);
  };

  const close = () => {
    setState(false);
  };

  return [state, toggle, open, close];
}

export default useToggle;
