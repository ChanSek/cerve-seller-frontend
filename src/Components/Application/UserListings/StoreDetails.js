import React, { useState } from "react";
import { Button, FormControl, FormControlLabel, Radio, RadioGroup, Modal } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RenderInput from "../../../utils/RenderInput";
import { areObjectsEqual, isEmailValid, isNumberOnly, isPhoneNoValid } from "../../../utils/validations";
import { useEffect } from "react";
import { getCall, postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import moment from "moment";
import StoreTimingsRenderer from "./StoreTimingsRenderer";
import Fulfillments from "./Fulfillments";
import { PRODUCT_CATEGORY, DELIVERY_TYPE_LIST } from "../../../utils/constants";
import PolygonMap from "../../PolygonMap/PolygonMap";
import { useTheme } from "@mui/material/styles";

const categoriesList = Object.entries(PRODUCT_CATEGORY).map(([key, value]) => {
    return { key: value, value: key };
});

const deliveryTypeList = Object.entries(DELIVERY_TYPE_LIST).map(([key, value]) => {
    return { key: value, value: key };
});

let storeFields = [
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
        id: "category",
        title: "Supported Product Categories",
        placeholder: "Please Select Supported Product Categories",
        options: categoriesList,
        type: "select",
        required: true,
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
        id: "default_cancellable",
        title: "Default Cancellable Setting",
        options: [
            { key: "Cancellable", value: "true" },
            { key: "Non-Cancellable", value: "false" },
        ],
        type: "radio",
        required: true,
    },
    {
        id: "default_returnable",
        title: "Default Returnable Setting",
        options: [
            { key: "Returnable", value: "true" },
            { key: "Non-Returnable", value: "false" },
        ],
        type: "radio",
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
        id: "state",
        title: "State",
        placeholder: "State",
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
        id: "building",
        title: "Building",
        placeholder: "Building",
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
        id: "locality",
        title: "Locality",
        placeholder: "Locality",
        type: "input",
        required: true,
    },
    {
        id: "logo",
        file_type: "logo",
        title: "Logo",
        type: "upload",
        required: false,
        fontColor: "#ffffff",
    }
];

const defaultStoreTimings = [
    {
        daysRange: { from: 1, to: 5 },
        timings: [{ start: "00:00", end: "00:00" }],
    },
];

const StoreDetails = ({ isFromUserListing = false }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();

    const [supportedFulfillments, setSupportedFulfillments] = useState({
        delivery: false,
        selfPickup: false,
        deliveryAndSelfPickup: false,
    });
    const [fulfillmentDetails, setFulfillmentDetails] = useState({
        deliveryDetails: {
            deliveryEmail: "",
            deliveryMobile: "",
            storeTimings: [...defaultStoreTimings],
        },
        selfPickupDetails: {
            selfPickupEmail: "",
            selfPickupMobile: "",
            storeTimings: [...defaultStoreTimings],
        },
        deliveryAndSelfPickupDetails: {
            deliveryEmail: "",
            deliveryMobile: "",
            selfPickupEmail: "",
            selfPickupMobile: "",
            storeTimings: [...defaultStoreTimings],
        },
    });

    const [storeDetailFields, setStoreDetailFields] = useState(storeFields);
    const [storeStatus, setStoreStatus] = useState("enabled");
    const [temporaryClosedTimings, setTemporaryClosedTimings] = useState({ start: "00:00", end: "00:00" });
    const [temporaryClosedDays, setTemporaryClosedDays] = useState({ from: 1, to: 5 });
    const [storeTimings, setStoreTimings] = useState([...defaultStoreTimings]);
    const [originalStoreTimings, setOriginalStoreTimings] = useState([...defaultStoreTimings]);
    const [cityInfo, setCityInfo] = useState([]);
    const [storeDetails, setStoreDetails] = useState({
        location: {},
        category: "",
        location_availability: "",
        default_cancellable: "",
        default_returnable: "",
        cities: [
            { key: "Delhi", value: "delhi" },
            { key: "Pune", value: "pune" },
        ],
        country: "",
        state: "",
        city: "",
        address_city: "",
        building: "",
        area_code: "",
        locality: "",
        logo: "",
        logo_path: "",
        holidays: [],
        radius: "",
        onNetworkLogistics: "true",
        logisticsBppId: "",
        logisticsDeliveryType: "",
        deliveryTime: ""
    });

    const [errors, setErrors] = useState(null);
    const [openPolygonMap, setOpenPolygonMap] = useState(false);
    const [polygonPoints, setPolygonPoints] = useState([]);

    const [defaultStoreDetails, setDefaultStoreDetails] = useState({
        location: {},
        category: "",
        location_availability: "",
        default_cancellable: "",
        default_returnable: "",
        cities: [
            { key: "Delhi", value: "delhi" },
            { key: "Pune", value: "pune" },
        ],
        country: "",
        state: "",
        city: "",
        address_city: "",
        building: "",
        area_code: "",
        locality: "",
        logo: "",
        logo_path: "",
        holidays: [],
        radius: "",
        logisticsBppId: "",
        logisticsDeliveryType: "",
        onNetworkLogistics: "true",
        deliveryTime: "",
        custom_area: [],
    });

    const getAvailableFulfillments = (fulfillments) => {
        let hasF1 = false;
        let hasF2 = false;
        let hasF3 = false;
        let deliveryEmail = "";
        let deliveryMobile = "";
        let selfPickupEmail = "";
        let selfPickupMobile = "";
        let email_delivery = "";
        let mobile_delivery = "";
        let email_self = "";
        let mobile_self = "";

        let deliveryStoreTimings = [...defaultStoreTimings];
        let selfPickupStoreTimings = [...defaultStoreTimings];
        let deliveryAndSelfPickupStoreTimings = [...defaultStoreTimings];

        fulfillments?.forEach((fulfillment) => {
            if (fulfillment.id === "f1") {
                hasF1 = true;
                deliveryEmail = fulfillment.contact.email;
                deliveryMobile = fulfillment.contact.phone;
                deliveryStoreTimings = fulfillment.storeTimings;
            }

            if (fulfillment.id === "f2") {
                hasF2 = true;
                selfPickupEmail = fulfillment.contact.email;
                selfPickupMobile = fulfillment.contact.phone;
                selfPickupStoreTimings = fulfillment.storeTimings;
            }

            if (fulfillment.id === "f3") {
                hasF3 = true;
                email_delivery = fulfillment.contact.delivery.email;
                mobile_delivery = fulfillment.contact.delivery.phone;
                email_self = fulfillment.contact.pickup.email;
                mobile_self = fulfillment.contact.pickup.phone;
                deliveryAndSelfPickupStoreTimings = fulfillment.storeTimings;
            }
        });

        return {
            supportedFulfillments: {
                delivery: hasF1,
                selfPickup: hasF2,
                deliveryAndSelfPickup: hasF3,
            },
            fulfillmentDetails: {
                deliveryDetails: {
                    deliveryEmail,
                    deliveryMobile,
                    storeTimings: deliveryStoreTimings,
                },
                selfPickupDetails: {
                    selfPickupEmail,
                    selfPickupMobile,
                    storeTimings: selfPickupStoreTimings,
                },
                deliveryAndSelfPickupDetails: {
                    deliveryEmail: email_delivery,
                    deliveryMobile: mobile_delivery,
                    selfPickupEmail: email_self,
                    selfPickupMobile: mobile_self,
                    storeTimings:
                        deliveryAndSelfPickupStoreTimings && deliveryAndSelfPickupStoreTimings.length > 0
                            ? deliveryAndSelfPickupStoreTimings
                            : [...defaultStoreTimings],
                },
            },
        };
    };

    const getCityInfo = async () => {
        try {
            const url = `/api/v1/seller/reference/city`;
            const result = await getCall(url);
            setCityInfo(result.data);
        } catch (error) {
            console.log(error);
        }
    }

    const getOrgDetails = async (id) => {
        try {
            const url = `/api/v1/seller/merchantId/${id}/merchant`;
            const result = await getCall(url);
            const res = result.data;
            if (res?.providerDetail?.storeDetails?.deliveryTime) {
                // Get the number of hours from the duration object
                const duration = moment.duration(res.providerDetail.storeDetails.deliveryTime);
                const hours = duration.asHours();
                res.providerDetail.storeDetails.deliveryTime = String(hours);
            }

            let storeData = {
                storeName: res.providerDetail.storeName || "",
                email: res.providerDetail.storeDetails?.supportEmail || "",
                mobile: res.providerDetail.storeDetails?.supportMobile || "",
                category: res?.providerDetail?.storeDetails?.category || "",
                location: res?.providerDetail?.storeDetails?.location || "",
                location_availability: res?.providerDetail?.storeDetails?.storeAvailability,
                cities: res?.providerDetail?.storeDetails?.city || [],
                default_cancellable: res?.providerDetail?.storeDetails?.defaultCancellable + "" || "",
                default_returnable: res?.providerDetail?.storeDetails?.defaultReturnable + "" || "",
                country: res.providerDetail?.storeDetails?.address?.country || "",
                state: res.providerDetail?.storeDetails?.address?.state || "",
                city: res.providerDetail?.storeDetails?.address.city || "",
                address_city: res.providerDetail?.storeDetails?.address.city || "",
                building: res.providerDetail?.storeDetails?.address?.building || "",
                area_code: res.providerDetail?.storeDetails?.address?.area_code || "",
                locality: res.providerDetail?.storeDetails?.address?.locality || "",
                logo: res?.providerDetail?.storeDetails?.logoUrl || "",
                //logo_path: res?.providerDetail?.storeDetails?.logo?.path || "",

                holidays: res?.providerDetail?.storeDetails?.storeTimes?.holidays || [],
                radius: res?.providerDetail?.storeDetails?.radius || "",
                logisticsBppId: res?.providerDetail?.storeDetails?.logisticsBppId || "",
                logisticsDeliveryType: res?.providerDetail?.storeDetails?.logisticsDeliveryType || "",
                deliveryTime: res?.providerDetail?.storeDetails?.deliveryTime || "",
                onNetworkLogistics: JSON.stringify(res?.providerDetail?.storeDetails?.useNetworkLogistics) || "true",
            };

            const polygonPoints = res?.providerDetail?.storeDetails?.custom_area
                ? res?.providerDetail?.storeDetails?.custom_area
                : [];
            setPolygonPoints(polygonPoints);

            const fulfillments = res?.providerDetail?.storeDetails?.fulfillments;
            const { supportedFulfillments, fulfillmentDetails } = getAvailableFulfillments(fulfillments);

            setSupportedFulfillments(supportedFulfillments);
            setFulfillmentDetails((prevDetails) => ({
                ...prevDetails,
                ...fulfillmentDetails,
            }));

            const storeTimingDetails = res?.providerDetail?.storeDetails?.storeTimes;

            setStoreStatus(storeTimingDetails?.status);
            if (storeTimingDetails?.closed !== undefined)
                setTemporaryClosedTimings(storeTimingDetails?.closed);
            if (storeTimingDetails?.closedDays !== undefined)
                setTemporaryClosedDays(storeTimingDetails?.closedDays);
            setStoreDetails(Object.assign({}, JSON.parse(JSON.stringify(storeData))));
            setDefaultStoreDetails(Object.assign({}, JSON.parse(JSON.stringify(storeData))));
            setStoreTimings(res?.providerDetail?.storeDetails?.storeTimes?.enabled || defaultStoreTimings);
            setOriginalStoreTimings(res?.providerDetail?.storeDetails?.storeTimes?.enabled || defaultStoreTimings);
        } catch (error) {
            console.log(error);
        }
    };

    //   console.log("storeDetails=====>", storeDetails);
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        getCityInfo();
    }, []);

    useEffect(() => {
        let provider_id = params?.id;
        getOrgDetails(provider_id);
    }, []);

    useEffect(() => {
        if (openPolygonMap) {
            setStoreDetailFields((prevFields) => prevFields.filter((field) => field.id !== "location"));
        } else {
            setStoreDetailFields((prevFields) => {
                const locationFieldIndex = prevFields.findIndex((field) => field.id === "location");
                if (locationFieldIndex === -1) {
                    return addAfter(prevFields, 3, {
                        id: "location",
                        title: "Store Location",
                        placeholder: "Store Location",
                        type: "location-picker",
                        required: true,
                    });
                } else {
                    return prevFields;
                }
            });
        }
    }, [openPolygonMap]);

    function addAfter(array, index, newItem) {
        return [...array.slice(0, index), newItem, ...array.slice(index)];
    }

    const getStoreTimesErrors = () => {
        let values = storeTimings?.reduce((acc, storeTiming) => {
            acc.push(storeTiming.daysRange.from);
            acc.push(storeTiming.daysRange.to);
            storeTiming.timings.forEach((element) => {
                acc.push(element.start);
                acc.push(element.end);
            });
            return acc;
        }, []);
        return values?.some((value) => value === "") ? "Please fix all details of timings!" : "";
    };

    const getTimingErrors = (storeTimings) => {
        let values = storeTimings?.reduce((acc, storeTiming) => {
            console.log("storeTiming " + JSON.stringify(storeTiming));
            acc.push(storeTiming.daysRange.from);
            acc.push(storeTiming.daysRange.to);
            storeTiming.timings.forEach((element) => {
                acc.push(element.start);
                acc.push(element.end);
            });
            return acc;
        }, []);
        return values?.some((value) => value === "" || value === "Invalid date") ? "Please fix all details of timings!" : "";
    };

    const validate = () => {
        const formErrors = {};
        formErrors.email =
            storeDetails.email?.trim() === ""
                ? "Support Email is required"
                : !isEmailValid(storeDetails.email)
                    ? "Please enter a valid email address"
                    : "";
        formErrors.mobile =
            storeDetails.mobile?.trim() === ""
                ? "Support Mobile Number is required"
                : !isPhoneNoValid(storeDetails.mobile)
                    ? "Please enter a valid mobile number"
                    : "";

        formErrors.category = storeDetails.category?.trim() === "" ? "Supported Product Category is required" : "";
        formErrors.location = storeDetails.location === '' ? 'Location is required' : ''
        if (storeDetails.location_availability === "city") {
            formErrors.cities = storeDetails.cities.length === 0 ? "City is required" : "";
        } else {
        }
        formErrors.country = storeDetails.country?.trim() === "" ? "Country is required" : "";
        formErrors.state = storeDetails.state?.trim() === "" ? "State is required" : "";
        formErrors.address_city = storeDetails.address_city?.trim() === "" ? "City is required" : "";
        formErrors.building = storeDetails.building?.trim() === "" ? "Building is required" : "";
        formErrors.area_code = storeDetails.area_code?.trim() === "" ? "PIN Code is required" : "";
        formErrors.logo = storeDetails.logo?.trim() === "" ? "Logo is required" : "";

        if (!isFromUserListing) {
            if (storeStatus === "enabled") {
                //const length = storeDetails.holidays?.length;
                //formErrors.holidays = length === 0 || !length ? "Holidays are required" : "";
                formErrors.storeTimes = getStoreTimesErrors();
            } else {
                formErrors.holidays = "";
                formErrors.storeTimes = "";
            }
        } else {
        }

        formErrors.logisticsBppId = storeDetails.onNetworkLogistics === "true" ? storeDetails.logisticsBppId.trim() === "" ? "Logistics Bpp Id is required" : "" : "";
        formErrors.logisticsDeliveryType = storeDetails.logisticsDeliveryType.trim() === "" ? "Logistics Delivery Type is required" : "";
        formErrors.deliveryTime = storeDetails.onNetworkLogistics === "false" ? storeDetails.deliveryTime === "" ? "Delivery Time is required" : "" : "";
        // formErrors.logisticsBppId = "";
        // formErrors.logisticsDeliveryType = "";

        formErrors.deliveryEmail =
            supportedFulfillments.delivery !== false
                ? fulfillmentDetails.deliveryDetails?.deliveryEmail?.trim() === ""
                    ? "Delivery Email is required"
                    : !isEmailValid(fulfillmentDetails.deliveryDetails?.deliveryEmail)
                        ? "Please enter a valid email address"
                        : ""
                : "";

        formErrors.deliveryMobile =
            supportedFulfillments.delivery !== false
                ? fulfillmentDetails.deliveryDetails?.deliveryMobile?.trim() === ""
                    ? "Mobile Number is required"
                    : !isPhoneNoValid(fulfillmentDetails.deliveryDetails?.deliveryMobile)
                        ? "Please enter a valid mobile number"
                        : ""
                : "";

        formErrors.selfPickupEmail =
            supportedFulfillments.selfPickup !== false
                ? fulfillmentDetails.selfPickupDetails?.selfPickupEmail?.trim() === ""
                    ? "Delivery Email is required"
                    : !isEmailValid(fulfillmentDetails.selfPickupDetails?.selfPickupEmail)
                        ? "Please enter a valid email address"
                        : ""
                : "";

        formErrors.selfPickupMobile =
            supportedFulfillments.selfPickup !== false
                ? fulfillmentDetails.selfPickupDetails?.selfPickupMobile?.trim() === ""
                    ? "Mobile Number is required"
                    : !isPhoneNoValid(fulfillmentDetails.selfPickupDetails?.selfPickupMobile)
                        ? "Please enter a valid mobile number"
                        : ""
                : "";

        const deliveryStoreTimings = fulfillmentDetails.deliveryDetails.storeTimings;
        const selfDeliveryStoreTimings = fulfillmentDetails.selfPickupDetails.storeTimings;

        if (supportedFulfillments.delivery !== false) {
            formErrors.deliveryStoreTimings = getTimingErrors(deliveryStoreTimings);
        }

        if (supportedFulfillments.selfPickup !== false) {
            formErrors.selfPickupStoreTimings = getTimingErrors(selfDeliveryStoreTimings);
        }

        if (storeDetails.location_availability === "custom_area") {
            formErrors.customArea =
                storeDetails?.location_availability === "custom_area" && polygonPoints.length === 0
                    ? "Please mark the polygon"
                    : "";
            formErrors.radius = "";
        } else if (storeDetails.location_availability === "radius") {
            formErrors.radius =
                storeDetails.radius === ""
                    ? "Serviceable Radius/Circle is required"
                    : !isNumberOnly(storeDetails?.radius)
                        ? "Please enter only digit"
                        : "";
            formErrors.customArea = "";
        }

        if (supportedFulfillments.deliveryAndSelfPickup) {
            formErrors.deliveryAndSelfPickupDetails = {};

            const deliveryAndSelfPickupDetails = fulfillmentDetails?.deliveryAndSelfPickupDetails || {};
            const deliveryEmail = deliveryAndSelfPickupDetails.deliveryEmail?.trim();
            const deliveryMobile = deliveryAndSelfPickupDetails.deliveryMobile?.trim();
            const selfPickupEmail = deliveryAndSelfPickupDetails.selfPickupEmail?.trim();
            const selfPickupMobile = deliveryAndSelfPickupDetails.selfPickupMobile?.trim();
            const timings = deliveryAndSelfPickupDetails.storeTimings;

            formErrors.deliveryAndSelfPickupDetails.storeTimings = getTimingErrors(timings);

            formErrors.deliveryAndSelfPickupDetails.deliveryEmail = !deliveryEmail
                ? "Delivery Email is required"
                : !isEmailValid(deliveryEmail)
                    ? "Please enter a valid email address"
                    : "";

            formErrors.deliveryAndSelfPickupDetails.deliveryMobile = !deliveryMobile
                ? "Mobile Number is required"
                : !isPhoneNoValid(deliveryMobile)
                    ? "Please enter a valid mobile number"
                    : "";

            formErrors.deliveryAndSelfPickupDetails.selfPickupEmail = !selfPickupEmail
                ? "Delivery Email is required"
                : !isEmailValid(selfPickupEmail)
                    ? "Please enter a valid email address"
                    : "";

            formErrors.deliveryAndSelfPickupDetails.selfPickupMobile = !selfPickupMobile
                ? "Mobile Number is required"
                : !isPhoneNoValid(selfPickupMobile)
                    ? "Please enter a valid mobile number"
                    : "";

            // Check if all nested properties are empty, then delete the entire object from formErrors
            if (
                Object.keys(formErrors.deliveryAndSelfPickupDetails).every(
                    (key) => formErrors.deliveryAndSelfPickupDetails[key] === ""
                )
            ) {
                delete formErrors.deliveryAndSelfPickupDetails;
            }
        } else {
            delete formErrors.deliveryAndSelfPickupDetails;
        }

        if (storeStatus === "closed") {
            if (temporaryClosedTimings.start === temporaryClosedTimings.end && temporaryClosedTimings.start !== "Invalid Date") {
                formErrors.temporaryClosedTimings = "Opening and closing times cannot be the same";
            } else if (temporaryClosedTimings.start === "Invalid date") {
                formErrors.temporaryClosedTimings = "Please provide a valid opening time";
            } else if (temporaryClosedTimings.end === "Invalid date") {
                formErrors.temporaryClosedTimings = "Please provide a valid closing time";
            } else {
                formErrors.temporaryClosedTimings = "";
            }
        }

        setErrors(formErrors);
        if (Object.values(formErrors).some((val) => val !== "")) {
            if (formErrors.customArea && formErrors.customArea !== "") {
                cogoToast.error(formErrors.customArea);
            } else {
                cogoToast.error("Please fill in all required data!");
            }
        }
        return !Object.values(formErrors).some((val) => val !== "");
    };

    const anyChangeInData = () => {
        // TODO: debug following
        let is_form_updated = !areObjectsEqual(storeDetails, defaultStoreDetails);
        let is_store_time_updated = !areObjectsEqual(storeTimings, originalStoreTimings);
        //return is_form_updated || is_store_time_updated;
        return true;
    };

    const getFulfillmentsPayloadFormat = () => {
        let fulfillments = [];
        if (supportedFulfillments.delivery) {
            let deliveryDetails = {
                id: "f1",
                type: "Delivery",
                contact: {
                    email: fulfillmentDetails.deliveryDetails.deliveryEmail,
                    phone: fulfillmentDetails.deliveryDetails.deliveryMobile,
                },
                storeTimings: fulfillmentDetails.deliveryDetails.storeTimings,
            };
            fulfillments.push(deliveryDetails);
        }

        if (supportedFulfillments.selfPickup) {
            let selfPickupDetails = {
                id: "f2",
                type: "Self-Pickup",
                contact: {
                    email: fulfillmentDetails.selfPickupDetails.selfPickupEmail,
                    phone: fulfillmentDetails.selfPickupDetails.selfPickupMobile,
                },
                storeTimings: fulfillmentDetails.selfPickupDetails.storeTimings,
            };
            fulfillments.push(selfPickupDetails);
        }

        if (supportedFulfillments.deliveryAndSelfPickup) {
            let deliveryAndSelfPickupDetails = {
                id: "f3",
                type: "Delivery and Pickup",
                contact: {
                    delivery: {
                        email: fulfillmentDetails.deliveryAndSelfPickupDetails.deliveryEmail,
                        phone: fulfillmentDetails.deliveryAndSelfPickupDetails.deliveryMobile,
                    },
                    pickup: {
                        email: fulfillmentDetails.deliveryAndSelfPickupDetails.selfPickupEmail,
                        phone: fulfillmentDetails.deliveryAndSelfPickupDetails.selfPickupMobile,
                    },
                },
                storeTimings: fulfillmentDetails.deliveryAndSelfPickupDetails.storeTimings,
            };
            console.log("FULFILLMENT FOR D AND S", deliveryAndSelfPickupDetails);
            fulfillments.push(deliveryAndSelfPickupDetails);
        }

        return fulfillments;
    };

    const getStoreTimingsPayloadFormat = () => {
        let storeTiming = {};
        storeTiming.status = storeStatus;
        storeTiming.holidays = storeDetails.holidays;
        storeTiming.enabled = storeTimings;
        storeTiming.closed = temporaryClosedTimings;
        storeTiming.closedDays = temporaryClosedDays;
        return storeTiming;
    };

    const startWithHttpRegex = new RegExp("^http");

    const onUpdate = () => {
        if (anyChangeInData() && validate()) {
            const provider_id = params?.id;
            const url = `/api/v1/seller/merchantId/${provider_id}/store`;
            const {
                category,
                location_availability,
                default_cancellable,
                default_returnable,
                mobile,
                email,
                cities,
                building,
                state,
                address_city,
                country,
                area_code,
                location,
                locality = "",
            } = storeDetails;

            const locationAvailability = location_availability === "pan_india" ? true : false;
            const addressDetails = {
                building: building,
                city: address_city,
                state: state,
                country: country,
                area_code: area_code,
                locality: locality,
            };
            let iso8601 = "";
            if (storeDetails.frequency && storeDetails.StoreTimeType === "frequency") {
                // Create a duration object with the hours you want to convert
                const duration = moment.duration(parseInt(storeDetails.frequency), "hours");

                // Format the duration in ISO 8601 format
                iso8601 = duration.toISOString();
            } else {
            }

            if (storeDetails.deliveryTime) {
                const deliveryDuration = moment.duration(parseInt(storeDetails.deliveryTime), "hours");

                // Format the duration in ISO 8601 format
                const iso8601Delivery = deliveryDuration.toISOString();
                storeDetails.deliveryTime = iso8601Delivery;
            }

            let fulfillments = getFulfillmentsPayloadFormat();
            let storeTimes = getStoreTimingsPayloadFormat();

            let payload = {
                category: category,
                locationAvailabilityPANIndia: locationAvailability,
                storeAvailability: storeDetails.location_availability,
                defaultCancellable: eval(default_cancellable),
                defaultReturnable: eval(default_returnable),
                address: addressDetails,
                supportEmail: email,
                supportMobile: mobile,
                fulfillments,
                storeTimes,
                radius: storeDetails.radius || "",
                useNetworkLogistics: storeDetails.onNetworkLogistics,
                logisticsBppId: storeDetails.onNetworkLogistics === 'true' ? storeDetails.logisticsBppId : '',
                logisticsDeliveryType: storeDetails.logisticsDeliveryType,
                deliveryTime: storeDetails.onNetworkLogistics === 'false' ? storeDetails.deliveryTime : '',
            };
            if (location) {
                payload.location = location;
                delete payload.location._id;
            } else {
            }
            if (locationAvailability == false) {
                payload["city"] = cities;
            } else {
            }
            payload["custom_area"] = polygonPoints;
            payload["logoUrl"] = storeDetails.logo;
            // if (!startWithHttpRegex.test(storeDetails.logo)) {
            //   payload["logoUrl"] = storeDetails.logo;
            // } else {
            //   payload["logoUrl"] = logo_path;
            // }

            postCall(url, payload)
                .then((resp) => {
                    if (resp.status && resp.status !== 200) {
                        cogoToast.error(resp.message, { hideAfter: 5 });
                    }
                    if (resp.status && resp.status === 200) {
                        cogoToast.success("Store details updated successfully", { hideAfter: 5 });
                        getOrgDetails(provider_id);
                        navigate("/application/inventory");
                    }
                })
                .catch((error) => {
                    console.log(error);
                    cogoToast.error(error.response.data.error);
                });
        }
    };

    const CustomComponent = () => {
        return (
            <div>
                <p
                    style={{
                        fontSize: 16,
                        color: "blue",
                        textDecoration: "underline",
                        cursor: "pointer",
                        marginLeft: 12,
                        marginBottom: 12,
                    }}
                    onClick={() => {
                        setOpenPolygonMap(true);
                    }}
                >
                    Set Polygon Serviceability
                </p>

                <p style={{ marginLeft: 12, fontSize: 12, color: "red" }}>{errors?.customArea}</p>
            </div>
        );
    };

    useEffect(() => {
        if (storeDetails.location_availability === "city") {
            setStoreDetailFields((prevFields) => {
                const updatedFields = prevFields.filter(
                    (field) => field.id !== "cities" && field.id !== "radius" && field.type !== "custom-area"
                );

                const citiesFieldExists = updatedFields.some((field) => field.id === "cities");

                if (!citiesFieldExists) {
                    const cityOptions = [];
                    cityInfo?.forEach((ci) => {
                        if (ci.city !== "" && ci.city != "null") {
                            let city = { "key": ci.city, "value": ci.cityCode };
                            cityOptions.push(city);
                        }
                    });
                    let fieldsWithoutCustomMap = updatedFields.filter((field) => field.type !== "custom-component");
                    let fieldsWithCityInput = addAfter(fieldsWithoutCustomMap, 6, {
                        id: "cities",
                        title: "Select Cities",
                        placeholder: "Please Select Cities",
                        options: cityOptions,
                        type: "multi-select",
                        required: true
                    });

                    return fieldsWithCityInput;
                }

                return updatedFields;
            });
        } else if (storeDetails.location_availability === "custom_area") {
            setStoreDetailFields((prevFields) => {
                const updatedFields = prevFields.filter(
                    (field) => field.id !== "cities" && field.id !== "radius" && field.type !== "custom-area"
                );

                const existingCustomComponentIndex = updatedFields.findIndex((field) => field.type === "custom-component");

                if (existingCustomComponentIndex !== -1) {
                    // Remove existing custom component
                    let fieldsWithoutExistingCustomComponent = [...updatedFields];
                    fieldsWithoutExistingCustomComponent.splice(existingCustomComponentIndex, 1);

                    // Add new custom component
                    let fieldsWithCustomMapInput = addAfter(fieldsWithoutExistingCustomComponent, 5, {
                        id: "custom-component",
                        type: "custom-component",
                        component: <CustomComponent />,
                    });

                    return fieldsWithCustomMapInput;
                } else {
                    // If there is no existing custom component, simply add the new one
                    let fieldsWithCustomMapInput = addAfter(updatedFields, 5, {
                        id: "custom-component",
                        type: "custom-component",
                        component: <CustomComponent />,
                    });

                    return fieldsWithCustomMapInput;
                }
            });
        } else if (storeDetails.location_availability === "radius") {
            setStoreDetailFields((prevFields) => {
                const updatedFields = prevFields.filter((field) => {
                    if (field.id !== "cities" && field.id !== "custom-component") {
                        return field;
                    }
                });

                const radiusFieldExists = prevFields.some((field) => field.id === "radius");
                if (!radiusFieldExists) {
                    let fieldsWithRadiusInput = addAfter(updatedFields, 6, {
                        id: "radius",
                        title: "Serviceable Radius/Circle (in Kilometer)",
                        placeholder: "Serviceable Radius/Circle (in Kilometer)",
                        type: "input",
                        error: errors?.["radius"] ? true : false,
                        helperText: errors?.["radius"] || "",
                        required: true,
                    });
                    return fieldsWithRadiusInput;
                }
            });
        } else {
            setStoreDetailFields(storeFields);
        }
    }, [storeDetails.location_availability]);

    let userRole = 'Organization Admin';//JSON.parse(localStorage.getItem("user"))?.role?.name;

    return (
        <div>
            <div className="container mx-auto my-8">
                <div className="w-full bg-white px-4 py-4 rounded-md h-full overflow-auto" style={{ minHeight: "95%", maxHeight: "100%" }}>
                    <div className="m-auto w-10/12 md:w-3/4 h-max">
                        <BackNavigationButton
                            onClick={() => {
                                userRole === "Super Admin"
                                    ? navigate("/application/user-listings?view=provider")
                                    : navigate("/application/inventory");
                            }}
                        />
                        <div className="mb-4 flex flex-col md:flex-row justify-between items-left">
                            <label
                                style={{ color: theme.palette.primary.main }}
                                className="font-semibold text-2xl"
                            >
                                Store Details
                            </label>
                        </div>
                        {storeDetailFields.map((item) => (
                            <RenderInput
                                key={item.id} // Ensure unique key for list items
                                item={{
                                    ...item,
                                    error: !!errors?.[item.id],
                                    helperText: errors?.[item.id] || "",
                                }}
                                state={storeDetails}
                                stateHandler={setStoreDetails}
                            />
                        ))}

                        {!isFromUserListing && (
                            <>
                                <p className="text-2xl font-semibold mb-4 mt-14">Logistics Details</p>
                                <RenderInput
                                    item={{
                                        id: "onNetworkLogistics",
                                        title: "Network Logistics",
                                        options: [
                                            { key: "On", value: "true" },
                                            { key: "Off", value: "false" },
                                        ],
                                        type: "radio",
                                        required: true,
                                        error: !!errors?.["onNetworkLogistics"],
                                        helperText: errors?.["onNetworkLogistics"] || "",
                                    }}
                                    state={storeDetails}
                                    stateHandler={setStoreDetails}
                                />
                                <RenderInput
                                    item={{
                                        id: "logisticsDeliveryType",
                                        title: "Logistics Delivery Type",
                                        placeholder: "Logistics Delivery Type",
                                        error: !!errors?.["logisticsDeliveryType"],
                                        helperText: errors?.["logisticsDeliveryType"] || "",
                                        options: deliveryTypeList,
                                        type: "select",
                                    }}
                                    state={storeDetails}
                                    stateHandler={setStoreDetails}
                                />
                                {storeDetails.onNetworkLogistics === 'true' ? (
                                    <RenderInput
                                        item={{
                                            id: "logisticsBppId",
                                            title: "Logistics Bpp Id",
                                            placeholder: "Logistics Bpp Id",
                                            type: "input",
                                            error: !!errors?.["logisticsBppId"],
                                            helperText: errors?.["logisticsBppId"] || "",
                                        }}
                                        state={storeDetails}
                                        stateHandler={setStoreDetails}
                                    />
                                ) : (
                                    <RenderInput
                                        item={{
                                            id: "deliveryTime",
                                            title: "Delivery Time (in hours)",
                                            placeholder: "Delivery Time (in hours)",
                                            type: "number",
                                            error: !!errors?.["deliveryTime"],
                                            helperText: errors?.["deliveryTime"] || "",
                                        }}
                                        state={storeDetails}
                                        stateHandler={setStoreDetails}
                                    />
                                )}
                                <Fulfillments
                                    errors={errors}
                                    supportedFulfillments={supportedFulfillments}
                                    setSupportedFulfillments={setSupportedFulfillments}
                                    fulfillmentDetails={fulfillmentDetails}
                                    setFulfillmentDetails={setFulfillmentDetails}
                                />

                                <p className="text-2xl font-semibold mb-2 mt-14">Store Timing</p>
                                <div className="py-1 flex flex-col">
                                    <FormControl component="fieldset">
                                        <label className="text-sm py-2 ml-1 font-medium text-left text-[#606161] inline-block">
                                            Store Status
                                            <span className="text-[#FF0000]"> *</span>
                                        </label>
                                        <RadioGroup
                                            value={storeStatus}
                                            onChange={(e) => {
                                                setStoreStatus(e.target.value);
                                            }}
                                        >
                                            <div className="flex flex-row">
                                                {[
                                                    { key: "Enabled", value: "enabled" },
                                                    { key: "Temporarily Closed", value: "closed" },
                                                    { key: "Disabled", value: "disabled" },
                                                ].map((radioItem) => (
                                                    <FormControlLabel
                                                        key={radioItem.value}
                                                        value={radioItem.value}
                                                        control={<Radio size="small" checked={radioItem.value === storeStatus} />}
                                                        label={<div className="text-sm font-medium text-[#606161]">{radioItem.key}</div>}
                                                    />
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    </FormControl>
                                </div>

                                {storeStatus === "enabled" && (
                                    <>
                                        <RenderInput
                                            item={{
                                                id: "holidays",
                                                title: "Holidays",
                                                placeholder: "Holidays",
                                                type: "days-picker",
                                                required: false,
                                                format: "YYYY-MM-DD",
                                                error: !!errors?.["holidays"],
                                                helperText: errors?.["holidays"] || "",
                                            }}
                                            state={storeDetails}
                                            stateHandler={setStoreDetails}
                                        />
                                        <p
                                            style={{
                                                color: "#d32f2f",
                                                fontSize: "0.75rem",
                                                marginLeft: 12,
                                            }}
                                        >
                                            {errors?.["holidays"] || ""}
                                        </p>
                                    </>
                                )}

                                <StoreTimingsRenderer
                                    errors={errors}
                                    storeStatus={storeStatus}
                                    storeTimings={storeTimings}
                                    setStoreTimings={setStoreTimings}
                                    temporaryClosedTimings={temporaryClosedTimings}
                                    setTemporaryClosedTimings={setTemporaryClosedTimings}
                                    temporaryClosedDays={temporaryClosedDays}
                                    setTemporaryClosedDays={setTemporaryClosedDays}
                                />
                            </>
                        )}

                        <div className="flex mt-16">
                            <Button
                                style={{ marginRight: 10 }}
                                variant="contained"
                                onClick={onUpdate}
                                disabled={!anyChangeInData()}
                            >
                                Update Store
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal open={openPolygonMap} onClose={() => setOpenPolygonMap(false)}>
                <div
                    style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "#fff",
                        padding: "16px 20px",
                        borderRadius: 4,
                    }}
                >
                    <div style={{ width: "70vw" }}>
                        <div className="flex justify-between mb-4">
                            <h1 style={{ fontSize: 16, marginBottom: 10, fontWeight: 600 }}>
                                Mark Your Locations and Define a Custom Area
                            </h1>
                        </div>
                        <PolygonMap
                            openPolygonMap={openPolygonMap}
                            setOpenPolygonMap={setOpenPolygonMap}
                            polygonPoints={polygonPoints}
                            setPolygonPoints={setPolygonPoints}
                        />
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default StoreDetails;
