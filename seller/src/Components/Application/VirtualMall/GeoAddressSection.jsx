import RenderInput from "../../../utils/RenderInput";

export const GeoAddressSection = ({ fields, storeDetails, setStoreDetails, errors }) => {
  const locationFields = ["building", "street", "locality", "city", "country", "state", "area_code"];
  const fullWidthFields = ["building", "street", "locality"];

  return (
    <div className="bg-[#f9f9f9] border border-gray-300 rounded-xl p-6 mb-6 shadow-sm">
      <p className="text-lg font-semibold mb-4 text-gray-700">Store Geo Location & Address</p>
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-3/4">
          {fields
            .filter((item) => item.id === "location")
            .map((item) => (
              <RenderInput
                key={item.id}
                item={{ ...item, error: !!errors?.[item.id], helperText: errors?.[item.id] || "" }}
                state={storeDetails}
                stateHandler={setStoreDetails}
              />
            ))}
        </div>
        <div className="w-full md:w-1/4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {fields
            .filter((item) => locationFields.includes(item.id))
            .map((item) => (
              <div key={item.id} className={fullWidthFields.includes(item.id) ? "col-span-2" : ""}>
                <RenderInput
                  item={{ ...item, error: !!errors?.[item.id], helperText: errors?.[item.id] || "" }}
                  state={storeDetails}
                  stateHandler={setStoreDetails}
                />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
