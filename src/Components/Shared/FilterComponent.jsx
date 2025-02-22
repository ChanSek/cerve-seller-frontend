import React from "react";
import Button from "./Button";
import RenderInput from "../../utils/RenderInput";

const FilterComponent = (props) => {
  const { fields = [], state, stateHandler, onFilter, onReset } = props;

  return (
    <div className="mb-4 items-center mt-8">
      <div className="mr-12">
        <p className="text-xl font-semibold" style={{ color: "#1876D1", letterSpacing: ".2px" }}>
          Filters
        </p>
      </div>
      <div className="flex flex-col sm:flex-row">
        <div className="flex items-end flex-wrap">
          {fields.map((item) => {
            return (
              <RenderInput
                key={item.id}
                item={{ ...item }}
                state={state}
                stateHandler={stateHandler}
                inputStyles={{ width: "100%", minWidth: 240 }} // Responsive width
                containerClasses={"py-1 flex flex-col mr-4 mb-4 sm:mb-0"} // Add margin for spacing
              />
            );
          })}
        </div>
        <div className="flex items-end mb-1 mt-4 sm:mt-0 sm:ml-4">
          <Button title="Reset" variant="outlined" sx={{ fontSize: 12 }} onClick={onReset} />
          <Button title="Filter" variant="contained" sx={{ marginLeft: 2, fontSize: 12 }} onClick={onFilter} />
        </div>
      </div>
      <br/>
    </div>
  );
  
};

export default FilterComponent;
