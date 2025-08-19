import React from "react";
import { FormControl, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import RenderInput from "../../../utils/RenderInput";
import StoreTimingsRenderer from "./StoreTimingsRenderer";

const StoreTimingSection = ({
  storeStatus,
  setStoreStatus,
  storeTimings,
  setStoreTimings,
  temporaryClosedTimings,
  setTemporaryClosedTimings,
  temporaryClosedDays,
  setTemporaryClosedDays,
  errors,
}) => {
  return (
    <>
      <p className="text-2xl font-semibold mb-4">Store Timing</p>

      {/* Store Status */}
      <div className="py-1 flex flex-col">
        <FormControl component="fieldset">
          <label className="text-sm py-2 ml-1 font-medium text-left text-[#606161] inline-block">
            Store Status<span className="text-[#FF0000]"> *</span>
          </label>
          <RadioGroup
            value={storeStatus}
            onChange={(e) => setStoreStatus(e.target.value)}
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              {[
                { key: "Enabled", value: "enabled" },
                { key: "Temporarily Closed", value: "closed" },
                { key: "Disabled", value: "disabled" },
              ].map((radioItem) => (
                <FormControlLabel
                  key={radioItem.value}
                  value={radioItem.value}
                  control={<Radio size="small" checked={radioItem.value === storeStatus} />}
                  label={<div className="text-sm font-medium text-[#606161]">{radioItem.key}</div>}
                />
              ))}
            </div>
          </RadioGroup>
        </FormControl>
      </div>

      {/* Holidays */}
      {storeStatus === "enabled" && (
        <div className="mt-4">
          <RenderInput
            item={{
              id: "holidays",
              title: "Holidays",
              placeholder: "Holidays",
              type: "days-picker",
              required: false,
              format: "YYYY-MM-DD",
              error: !!errors?.["holidays"],
              helperText: errors?.["holidays"] || "",
            }}
            state={{ holidays: [] }}
            stateHandler={() => {}}
          />
        </div>
      )}

      {/* Timings */}
      <div className="mt-6">
        <StoreTimingsRenderer
          errors={errors}
          storeStatus={storeStatus}
          storeTimings={storeTimings}
          setStoreTimings={setStoreTimings}
          temporaryClosedTimings={temporaryClosedTimings}
          setTemporaryClosedTimings={setTemporaryClosedTimings}
          temporaryClosedDays={temporaryClosedDays}
          setTemporaryClosedDays={setTemporaryClosedDays}
        />
      </div>
    </>
  );
};

export default StoreTimingSection;
