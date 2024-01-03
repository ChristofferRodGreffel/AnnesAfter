import React from "react";

// Udviklet fælles i gruppen

// Bruges til admin-siderne
const AdminContentWrapper = ({ children }) => {
  return <div className="overflow-x-hidden px-16 py-14 w-full">{children}</div>;
};

export default AdminContentWrapper;
