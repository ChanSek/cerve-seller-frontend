import { convertDateInStandardFormat } from "../../../utils/formatting/date";

const returnFields = [
    {
        id: "orderId",
        label: "Order Id",
        minWidth: 120,
        align: "center",
    }, {
        id: "state",
        label: "Current State",
        minWidth: 120,
        align: "center",
    },
    {
        id: "createdAt",
        label: "Created On",
        minWidth: 180,
        format: (value) => convertDateInStandardFormat(value),
        align: "center",
    },
    {
        id: "updatedAt",
        label: "Modified On",
        minWidth: 180,
        format: (value) => convertDateInStandardFormat(value),
        align: "center",
    },
];

export default returnFields