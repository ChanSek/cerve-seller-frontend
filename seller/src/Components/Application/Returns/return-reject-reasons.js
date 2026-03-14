export const RETURN_REJECT_REASONS = [
  {
    key: "001",
    value:
      "Product is damaged",
    isApplicableForCancellation: false,
  },
  {
    key: "002",
    value: "Product packaging is damaged",
    isApplicableForCancellation: false,
  },
  {
    key: "003",
    value: "Product has been used and / or tags have been removed",
    isApplicableForCancellation: false,
  },
  {
    key: "004",
    value: "Product is not the same as what was ordered and / or is not complete, i.e. without accessories which were included",
    isApplicableForCancellation: true,
  },
  {
    key: "005",
    value: "Product delivered is different from what was shown and ordered",
    isApplicableForCancellation: false,
  },
  {
    key: "006",
    value: "Return beyond return window",
    isApplicableForCancellation: false,
  },
  {
    key: "007",
    value: "Final sale",
    isApplicableForCancellation: false,
  },
  {
    key: "008",
    value: "Duplicate return request",
    isApplicableForCancellation: false,
  },
];
