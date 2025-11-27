import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import RenderInput from "../../../utils/RenderInput";
import { areObjectsEqual } from "../../../utils/validations";
import { useEffect } from "react";
import { getCall, postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import moment from "moment";
import { useTheme } from "@mui/material/styles";
import { storeFields } from "./StoreFields";
import { validateStore } from "./StoreValidation";
import { GeoAddressSection } from "./GeoAddressSection";
import StoreTimingSection from "./StoreTimingSection";
import { PRODUCT_CATEGORY_OPTIONS } from "../../../utils/constants";

const defaultStoreTimings = [
    {
        daysRange: { from: 1, to: 7 },
        timings: [{ start: "00:00", end: "23:59" }],
    },
];

const StoreDetails = ({ isFromUserListing = false, storeId }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const params = useParams();

    const [supportedFulfillments, setSupportedFulfillments] = useState({
        delivery: true,
        selfPickup: false,
        deliveryAndSelfPickup: false,
    });
    const [fulfillmentDetails, setFulfillmentDetails] = useState({});

    const [storeDetailFields, setStoreDetailFields] = useState(storeFields);
    const [storeStatus, setStoreStatus] = useState("enabled");
    const [temporaryClosedTimings, setTemporaryClosedTimings] = useState({ start: "00:00", end: "23:59" });
    const [temporaryClosedDays, setTemporaryClosedDays] = useState({ from: 1, to: 5 });
    const [storeTimings, setStoreTimings] = useState([...defaultStoreTimings]);
    const [holidays, setHolidays] = useState({"holidays":[]});
    const [originalStoreTimings, setOriginalStoreTimings] = useState([...defaultStoreTimings]);
    const [cityInfo, setCityInfo] = useState([]);
    const [storeDetails, setStoreDetails] = useState({
        location: {},
        categories: [],
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
        building: "",
        area_code: "",
        locality: "",
        logo: "",
        logo_path: "",
        radius: "",
        onNetworkLogistics: "true",
        logisticsBppId: "",
        logisticsDeliveryType: "",
        deliveryTime: ""
    });

    const [errors, setErrors] = useState(null);
    const [polygonPoints, setPolygonPoints] = useState([]);
    const [defaultStoreDetails, setDefaultStoreDetails] = useState({
        location: {},
        categories: [],
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
        building: "",
        area_code: "",
        locality: "",
        logo: "",
        logo_path: "",
        radius: "",
        logisticsBppId: "",
        logisticsDeliveryType: "",
        onNetworkLogistics: "true",
        deliveryTime: "",
        custom_area: [],
    });

    const [isValid, setIsValid] = useState(false);

    const runValidation = () => {
        const { isValid, formErrors } = validateStore({
            storeDetails,
            storeStatus,
            polygonPoints,
            temporaryClosedTimings,
        });
        setErrors(formErrors);
        setIsValid(isValid);
        return isValid;
    };

    const getAvailableFulfillments = (fulfillments) => {
        let hasF1 = false;
        let hasF2 = false;
        let hasF3 = false;
        let deliveryEmail = "";
        let deliveryMobile = "";

        let deliveryStoreTimings = [...defaultStoreTimings];

        fulfillments?.forEach((fulfillment) => {
            if (fulfillment.id === "f1") {
                hasF1 = true;
                deliveryEmail = fulfillment.contact.email;
                deliveryMobile = fulfillment.contact.phone;
                deliveryStoreTimings = fulfillment.storeTimings;
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
            let url = `/api/v1/seller/merchantId/${id}/merchant?providerDetails=Y`;
            if (storeId) {
                url = `/api/v1/seller/merchantId/${id}/merchant?providerDetails=Y&storeId=${storeId}`;
            }
            const result = await getCall(url);
            const res = result.data;
            if (res?.providerDetail?.storeDetails?.deliveryTime) {
                // Get the number of hours from the duration object
                const duration = moment.duration(res.providerDetail.storeDetails.deliveryTime);
                const hours = duration.asHours();
                res.providerDetail.storeDetails.deliveryTime = String(hours);
            }
            let storeData = {};
            if (!res.providerDetail.storeDetails) {
                storeData = {
                    storeName: res.providerDetail?.storeName || "",
                    email: res.providerDetail?.contactEmail || "",
                    mobile: res.providerDetail?.contactMobile || "",
                    "default_returnable": "false",
                    "default_cancellable": "false",
                    "location_availability": "radius",
                    "onNetworkLogistics": "false",
                    "cities": [],
                    "categories": []
                };
            } else {
                storeData = {
                    storeName: res.providerDetail.storeName || "",
                    email: res.providerDetail.storeDetails?.supportEmail || "",
                    mobile: res.providerDetail.storeDetails?.supportMobile || "",
                    categories: PRODUCT_CATEGORY_OPTIONS.filter(opt =>
                        res?.providerDetail?.storeDetails?.categories?.includes(opt.value)
                    ),
                    location: res?.providerDetail?.storeDetails?.location || "",
                    location_availability: res?.providerDetail?.storeDetails?.storeAvailability,
                    cities: res?.providerDetail?.storeDetails?.city || [],
                    default_cancellable: res?.providerDetail?.storeDetails?.defaultCancellable + "" || "",
                    default_returnable: res?.providerDetail?.storeDetails?.defaultReturnable + "" || "",
                    country: res.providerDetail?.storeDetails?.address?.country || "",
                    state: res.providerDetail?.storeDetails?.address?.state || "",
                    city: res.providerDetail?.storeDetails?.address.city || "",
                    building: res.providerDetail?.storeDetails?.address?.building || "",
                    area_code: res.providerDetail?.storeDetails?.address?.area_code || "",
                    locality: res.providerDetail?.storeDetails?.address?.locality || "",
                    street: res.providerDetail?.storeDetails?.address?.street || "",
                    logo: res?.providerDetail?.storeDetails?.logoUrl || "",
                    //logo_path: res?.providerDetail?.storeDetails?.logo?.path || "",

                    
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

            }
            setStoreDetails(Object.assign({}, JSON.parse(JSON.stringify(storeData))));
            setHolidays({"holidays":res?.providerDetail?.storeDetails?.storeTimes?.holidays || []});
            setDefaultStoreDetails(Object.assign({}, JSON.parse(JSON.stringify(storeData))));
            setStoreTimings(res?.providerDetail?.storeDetails?.storeTimes?.enabled || defaultStoreTimings);
            setOriginalStoreTimings(res?.providerDetail?.storeDetails?.storeTimes?.enabled || defaultStoreTimings);
        } catch (error) {
            console.log(error);
        }
    };

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


    function addAfter(array, index, newItem) {
        return [...array.slice(0, index), newItem, ...array.slice(index)];
    }

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
                type: "Delivery"
            };
            fulfillments.push(deliveryDetails);
        }

        return fulfillments;
    };

    const getStoreTimingsPayloadFormat = () => {
        let storeTiming = {};
        storeTiming.status = storeStatus;
        storeTiming.holidays = holidays.holidays;
        storeTiming.enabled = storeTimings;
        storeTiming.closed = temporaryClosedTimings;
        storeTiming.closedDays = temporaryClosedDays;
        return storeTiming;
    };

    const startWithHttpRegex = new RegExp("^http");

    const onUpdate = () => {
        const isFormValid = runValidation();
        if (!isFormValid) return;
        if (!anyChangeInData()) return;
        const provider_id = params?.id;
        let url = `/api/v1/seller/merchantId/${provider_id}/store`;
        if (storeId) {
            url += "?storeId=" + storeId
        }
        const {
            categories,
            location_availability,
            default_cancellable,
            default_returnable,
            mobile,
            email,
            cities,
            street,
            building,
            state,
            city,
            country,
            area_code,
            location,
            locality = "",
        } = storeDetails;

        const locationAvailability = location_availability === "pan_india" ? true : false;
        const addressDetails = {
            street: street,
            building: building,
            city: city,
            state: state,
            country: country,
            area_code: area_code,
            locality: locality,
        };
        let iso8601;
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
            categories: categories.map(item => item.value),
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
            logisticsDeliveryType: storeDetails.logisticsDeliveryType ? storeDetails.logisticsDeliveryType : "Standard Delivery",
            deliveryTime: storeDetails.onNetworkLogistics === 'false' ? storeDetails.deliveryTime : '',
        };
        if (location) {
            payload.location = location;
            delete payload.location._id;
        } else {
        }
        if (locationAvailability === false) {
            payload["city"] = cities;
        } else {
        }
        payload["custom_area"] = polygonPoints;
        payload["logoUrl"] = storeDetails.logo;

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
                cogoToast.error(error.response.data.message);
            });

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
                        if (ci.city !== "" && ci.city !== "null") {
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
        <Box
            sx={{
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                padding: '24px',
                backgroundColor: '#fff',
                boxShadow: 2,
                marginTop: '20px',
            }}
        >
            {/* Grouped Location & Address Section */}
            <GeoAddressSection
                fields={storeDetailFields}
                storeDetails={storeDetails}
                setStoreDetails={setStoreDetails}
                errors={errors}
            />

            {/* Remaining fields */}
            {storeDetailFields
                .filter(
                    (item) =>
                        ![
                            "location",
                            "country",
                            "state",
                            "city",
                            "building",
                            "street",
                            "area_code",
                            "locality",
                        ].includes(item.id)
                )
                .map((item) => (
                    <RenderInput
                        key={item.id}
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
                <StoreTimingSection
                    storeStatus={storeStatus}
                    setStoreStatus={setStoreStatus}
                    storeTimings={storeTimings}
                    setStoreTimings={setStoreTimings}
                    temporaryClosedTimings={temporaryClosedTimings}
                    setTemporaryClosedTimings={setTemporaryClosedTimings}
                    temporaryClosedDays={temporaryClosedDays}
                    setTemporaryClosedDays={setTemporaryClosedDays}
                    holidays={holidays}
                    setHolidays={setHolidays}
                    errors={errors}
                />
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
        </Box>
    );
};

export default StoreDetails;
