import React from "react";
import ReactDOM from "react-dom";
import SamurayApp from "./App";
it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<SamurayApp />, div);
  ReactDOM.unmountComponentAtNode(div);
});
