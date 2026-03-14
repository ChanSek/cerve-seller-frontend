import { convertDateInStandardFormat } from "../../../utils/formatting/date";

const returnFields = [
    {
        id: "orderId",
        label: "Order Id",
        minWidth: 120,
        align: "left",
    }, {
        id: "state",
        label: "Current State",
        minWidth: 120,
        align: "left",
    },
    {
        id: "createdAt",
        label: "Created On",
        minWidth: 180,
        format: (value) => convertDateInStandardFormat(value),
        align: "left",
    },
    {
        id: "updatedAt",
        label: "Modified On",
        minWidth: 180,
        format: (value) => convertDateInStandardFormat(value),
        align: "left",
    },
];

export default returnFields