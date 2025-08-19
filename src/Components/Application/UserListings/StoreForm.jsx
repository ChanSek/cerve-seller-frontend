import React from "react";
import RenderInput from "../../../utils/RenderInput";
import { GeoAddressSection } from "./GeoAddressSection";

const StoreForm = ({ storeDetailFields, storeDetails, setStoreDetails, errors }) => {
  return (
    <>
      {/* Address Section */}
      <GeoAddressSection
        fields={storeDetailFields}
        storeDetails={storeDetails}
        setStoreDetails={setStoreDetails}
        errors={errors}
      />

      {/* Remaining fields */}
      {storeDetailFields
        .filter(
          (item) =>
            ![
              "location",
              "country",
              "state",
              "city",
              "building",
              "street",
              "area_code",
              "locality",
            ].includes(item.id)
        )
        .map((item) => (
          <RenderInput
            key={item.id}
            item={{
              ...item,
              error: !!errors?.[item.id],
              helperText: errors?.[item.id] || "",
            }}
            state={storeDetails}
            stateHandler={setStoreDetails}
          />
        ))}
    </>
  );
};

export default StoreForm;
