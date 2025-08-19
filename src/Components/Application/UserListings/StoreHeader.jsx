import React from "react";

const StoreHeader = ({ theme }) => {
  return (
    <div className="mb-4 flex flex-col md:flex-row justify-between items-left">
      <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
        Store Details
      </label>
    </div>
  );
};

export default StoreHeader;
