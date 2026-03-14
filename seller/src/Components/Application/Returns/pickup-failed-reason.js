export const PICKUP_REJECT_REASONS = [
    {
        key: "001",
        value: "Seller not available",
    },
    {
        key: "002",
        value: "Seller phone no not contactable",
    },
    {
        key: "003",
        value: "Address incorrect",
    },
    {
        key: "004",
        value: "Shipment not ready",
        isApplicableForCancellation: true,
    },
    {
        key: "005",
        value: "Pickup request cancelled by Seller",
    },
    {
        key: "006",
        value: "Pick failed due to dangerous goods",
    },
    {
        key: "007",
        value: "Product packaging issue",
    },
    {
        key: "008",
        value: "Bar Code issue",
    },
    {
        key: "009",
        value: "Vehicle issue e.g. malfunctioning vehicle, space constraint in vehicle, etc",
    },
    {
        key: "010",
        value: "Buyer not available",
    },
];
