import React, { useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const ShadowWrapper = ({ children, className }) => {
  const hostRef = useRef();

  useEffect(() => {
    const shadowRoot = hostRef.current.attachShadow({ mode: "open" });
    const container = document.createElement("div");
    if (className) container.className = className;
    shadowRoot.appendChild(container);
    ReactDOM.render(children, container);

    return () => ReactDOM.unmountComponentAtNode(container);
  }, [children, className]);

  return <div ref={hostRef}></div>;
};

export default ShadowWrapper;
