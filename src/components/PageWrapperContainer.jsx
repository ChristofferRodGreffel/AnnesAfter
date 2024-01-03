import React from "react";

const PageWrapperContainer = ({ children }) => {
  // Udviklet fælles i gruppen
  // Bruges til at indramme content
  return <main className="content-grid bg-white">{children}</main>;
};

export default PageWrapperContainer;
