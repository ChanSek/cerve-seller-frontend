import { PRODUCT_CATEGORY} from "../../../utils/constants";

const categoriesList = Object.entries(PRODUCT_CATEGORY).map(([key, value]) => {
    return { key: value, value: key };
});

export const storeFields = [
    {
        id: "storeName",
        title: "Store Name",
        placeholder: "Enter Store Name",
        type: "input",
        email: true,
        required: true,
        isDisabled: true
    },
    {
        id: "email",
        title: "Support Email",
        placeholder: "Enter your Support Email",
        type: "input",
        required: true,
    },
    {
        id: "mobile",
        title: "Support Mobile Number",
        placeholder: "Enter your Support Mobile Number",
        type: "input",
        required: true,
        maxLength: 10,
        value: "+91",
        prefix: "+91",
    },
    {
        id: "location",
        title: "Store Location",
        placeholder: "Store Location",
        type: "location-picker",
        required: true,
    },
    {
        id: "location_availability",
        title: "Location Availability",
        options: [
            { key: "PAN India", value: "pan_india" },
            { key: "City", value: "city" },
            { key: "Radius", value: "radius" },
        ],
        type: "radio",
        required: true,
    },
    {
        id: "building",
        title: "Building",
        placeholder: "Building",
        type: "input",
        required: true,
    },
    {
        id: "street",
        title: "Street",
        placeholder: "Street",
        type: "input",
        required: true,
    },
    {
        id: "locality",
        title: "Locality",
        placeholder: "Locality",
        type: "input",
        required: true,
    },
    {
        id: "city",
        title: "City",
        placeholder: "City",
        type: "input",
        required: true,
    },
    {
        id: "state",
        title: "State",
        placeholder: "State",
        type: "input",
        required: true,
    },
    {
        id: "country",
        title: "Country",
        placeholder: "Country",
        type: "input",
        required: true,
    },
    {
        id: "area_code",
        title: "PIN Code",
        placeholder: "PIN code",
        type: "input",
        required: true,
    },
    {
        id: "logo",
        file_type: "product_image",
        title: "Logo",
        type: "upload",
        required: true,
        fontColor: "#ffffff",
    }
];