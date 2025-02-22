import { kMaxLength } from "buffer";

export const deliveryFulfillmentFields = [
  {
    id: "deliveryEmail",
    title: "Delivery Email",
    placeholder: "Enter Delivery Email",
    type: "input",
    required: true,
  },
  {
    id: "deliveryMobile",
    title: "Delivery Contact Number",
    placeholder: "Enter Delivery Contact Number",
    type: "input",
    required: true,
    value: "+91",  
    prefix: "+91",
    maxLength: 10,
  },
];

export const selfPickupFulfillmentFields = [
  {
    id: "selfPickupEmail",
    title: "Self Pickup Email",
    placeholder: "Enter Self Pickup Email",
    type: "input",
    required: true,
  },
  {
    id: "selfPickupMobile",
    title: "Self Pickup Contact Number",
    placeholder: "Enter Self Pickup Contact Number",
    type: "input",
    required: true,
    value: "+91",  
    prefix: "+91",
    maxLength: 10,
  },
];
