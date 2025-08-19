export const defaultStoreObject = {
  name: "",
  address: "",
  location_availability: "city",
  fulfillments: [],
  // Add other default fields
};

export const generateDynamicFields = (locationType = "city") => {
  const baseFields = [
    { name: "name", label: "Store Name", required: true },
    { name: "address", label: "Address", required: true },
  ];

  if (locationType === "polygon") {
    baseFields.push({ name: "polygonPoints", label: "Polygon Area", required: true });
  }
  return baseFields;
};

export const getFulfillmentsPayloadFormat = (fulfillments) => {
  return fulfillments.map(f => ({
    type: f.type,
    time: f.time,
    capacity: f.capacity,
  }));
};

export const getStoreTimingsPayloadFormat = (timings) => timings;

export const getTemporaryClosedTimingsPayloadFormat = (timings) => timings;

export const getTemporaryClosedDaysPayloadFormat = (days) => days;
