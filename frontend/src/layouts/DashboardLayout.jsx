import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        color: "white",
        padding: "30px",
      }}
    >
      {children}
    </div>
  );
};

export default DashboardLayout;
