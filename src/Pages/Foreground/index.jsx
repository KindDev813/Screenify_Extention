import React from "react";
import ReactDOM from "react-dom/client";
import ForegroundApp from "./ForegroundApp";

const root = document.createElement("div");
root.id = "foreground-root";
document.body.append(root);

ReactDOM.createRoot(document.getElementById("foreground-root")).render(
  <React.StrictMode>
    <ForegroundApp />
  </React.StrictMode>
);
