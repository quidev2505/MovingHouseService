import React from "react";
import LoadingOverlay from "react-loading-overlay";

function LoadingOverlayComponent(props) {
  return (
    <LoadingOverlay
      active={props.status}
      spinner
      text="Vui lòng đợi giây lát..."
      styles={{
        spinner: (base) => ({
          ...base,
          width: "100px",
          "& svg circle": {
            stroke: "rgba(255, 0, 0, 0.5)",
          },
        }),
      }}
    >
      {props.children}
    </LoadingOverlay>
  );
}

export default LoadingOverlayComponent;
