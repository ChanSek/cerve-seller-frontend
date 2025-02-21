import moment from "moment"

export const convertDateInStandardFormat = (value) => {
    return moment(value).format("DD-MM-YYYY hh:mm A")
}

export const convertDateOnly = (value) => {
    return moment(value).format("DD-MM-YYYY");
}
