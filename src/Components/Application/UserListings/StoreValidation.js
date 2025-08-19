// StoreValidation.js
import { isEmailValid, isNumberOnly, isPhoneNoValid } from "../../../utils/validations";

export const validateStore = ({
    storeDetails = {},
    storeStatus = "",
    polygonPoints = [],
    temporaryClosedTimings = {},
}) => {
    const formErrors = {
        ...validateBasicFields(storeDetails),
        ...validateLocationAvailability(storeDetails, polygonPoints),
        ...validateStoreStatus(storeStatus, storeDetails.storeTimings, temporaryClosedTimings),
    };

    const hasErrors = Object.values(formErrors).some((val) =>
        typeof val === "object"
            ? Object.values(val).some((v) => v !== "")
            : val !== ""
    );

    return {
        isValid: !hasErrors,
        formErrors,
    };
};

export const validateBasicFields = (storeDetails = {}) => ({
    email: !storeDetails.email?.trim()
        ? "Support Email is required"
        : !isEmailValid(storeDetails.email)
        ? "Please enter a valid email address"
        : "",

    mobile: !storeDetails.mobile?.trim()
        ? "Support Mobile Number is required"
        : !isPhoneNoValid(storeDetails.mobile)
        ? "Please enter a valid mobile number"
        : "",

    category: !storeDetails.category?.trim() ? "Supported Product Category is required" : "",
    country: !storeDetails.country?.trim() ? "Country is required" : "",
    state: !storeDetails.state?.trim() ? "State is required" : "",
    street: !storeDetails.street?.trim() ? "Street is required" : "",
    city: !storeDetails.city?.trim() ? "City is required" : "",
    building: !storeDetails.building?.trim() ? "Building is required" : "",
    area_code: !storeDetails.area_code?.trim() ? "PIN Code is required" : "",
    locality: !storeDetails.locality?.trim() ? "Locality is required" : "",
    logo: !storeDetails.logo?.trim() ? "Logo is required" : "",
});

export const validateLocationAvailability = (storeDetails = {}, polygonPoints = []) => {
    switch (storeDetails.location_availability) {
        case "city":
            return {
                cities: !storeDetails.cities || storeDetails.cities.length === 0
                    ? "City is required"
                    : "",
            };

        case "custom_area":
            return {
                customArea: polygonPoints.length === 0 ? "Please mark the polygon" : "",
                radius: "", // irrelevant in this mode
            };

        case "radius":
            return {
                radius: !storeDetails.radius?.trim()
                    ? "Serviceable Radius/Circle is required"
                    : !isNumberOnly(storeDetails.radius)
                    ? "Please enter only digit"
                    : "",
                customArea: "", // irrelevant in this mode
            };

        default:
            return {};
    }
};

export const validateStoreStatus = (
    storeStatus = "",
    storeTimings = [],
    temporaryClosedTimings = {}
) => {
    const errors = {};

    if (storeStatus === "enabled") {
        const storeTimesError = getStoreTimesErrors(storeTimings);
        if (storeTimesError) {
            errors.storeTimes = storeTimesError;
        }
    } else if (storeStatus === "closed") {
        const { start, end } = temporaryClosedTimings;

        if (start === end && start && end) {
            errors.temporaryClosedTimings = "Opening and closing times cannot be the same";
        } else if (!start || isInvalidDate(start)) {
            errors.temporaryClosedTimings = "Please provide a valid opening time";
        } else if (!end || isInvalidDate(end)) {
            errors.temporaryClosedTimings = "Please provide a valid closing time";
        } else {
            errors.temporaryClosedTimings = "";
        }
    }

    return errors;
};

const getStoreTimesErrors = (storeTimings = []) => {
    const allValues = storeTimings.reduce((acc, timing) => {
        acc.push(timing.daysRange?.from || "");
        acc.push(timing.daysRange?.to || "");
        (timing.timings || []).forEach((slot) => {
            acc.push(slot.start || "");
            acc.push(slot.end || "");
        });
        return acc;
    }, []);

    return allValues.some((val) => val === "") ? "Please fix all details of timings!" : "";
};

// Helper for cleaner date validation
const isInvalidDate = (value) =>
    typeof value === "string" && value.toLowerCase().includes("invalid");
