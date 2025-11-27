import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import cogoToast from "cogo-toast";
import { getCall } from "../../../Api/axios";

import {
    defaultStoreObject,
    generateDynamicFields,
    getFulfillmentsPayloadFormat,
    getStoreTimingsPayloadFormat,
    getTemporaryClosedTimingsPayloadFormat,
    getTemporaryClosedDaysPayloadFormat,
} from "./storeHelpers";
import { validateStore } from "./StoreValidation";

const useStoreDetails = (isFromUserListing = false) => {
    const navigate = useNavigate();
    const { id: providerId } = useParams();
    const userRole = localStorage.getItem("userRole");

    // ✅ State
    const [storeDetails, setStoreDetails] = useState(defaultStoreObject);
    const [storeDetailFields, setStoreDetailFields] = useState(generateDynamicFields());
    const [storeStatus, setStoreStatus] = useState("active");
    const [storeTimings, setStoreTimings] = useState({});
    const [temporaryClosedTimings, setTemporaryClosedTimings] = useState({});
    const [temporaryClosedDays, setTemporaryClosedDays] = useState([]);
    const [polygonPoints, setPolygonPoints] = useState([]);
    const [errors, setErrors] = useState({});
    const [openPolygonMap, setOpenPolygonMap] = useState(false);

    const [originalData, setOriginalData] = useState(null);

    // ✅ Base URL (replace with your actual API)
    const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

    // ✅ Fetch store details
    const getOrgDetails = useCallback(async () => {
        try {
            const url = `/api/v1/seller/merchantId/${providerId}/merchant?providerDetails=Y`;
            const result = await getCall(url);
            const data = result.data;
            setStoreDetails(data?.providerDetail?.storeDetails);
            setStoreStatus(data.status || "active");
            setStoreTimings(data.timings || {});
            setTemporaryClosedTimings(data.tempClosedTimings || {});
            setTemporaryClosedDays(data.tempClosedDays || []);
            setPolygonPoints(data.polygonPoints || []);
            setOriginalData(data);
        } catch (error) {
            console.error("Error fetching org details:", error);
            cogoToast.error("Failed to fetch store details");
        }
    }, [providerId]);

    // ✅ Update store details
    const onUpdate = async () => {
        const validationErrors = validateStore(storeDetails, storeDetailFields);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            cogoToast.error("Please correct the errors before updating");
            return;
        }

        try {
            const payload = {
                ...storeDetails,
                status: storeStatus,
                timings: getStoreTimingsPayloadFormat(storeTimings),
                tempClosedTimings: getTemporaryClosedTimingsPayloadFormat(temporaryClosedTimings),
                tempClosedDays: getTemporaryClosedDaysPayloadFormat(temporaryClosedDays),
                polygonPoints,
                fulfillments: getFulfillmentsPayloadFormat(storeDetails.fulfillments),
            };

            await axios.put(`${API_BASE}/org/update/${providerId}`, payload);

            cogoToast.success("Store details updated successfully");
            setOriginalData(payload);
        } catch (error) {
            console.error("Error updating store details:", error);
            cogoToast.error("Failed to update store details");
        }
    };

    // ✅ Check if data changed
    const anyChangeInData = useCallback(() => {
        if (!originalData) return false;
        return JSON.stringify(originalData) !== JSON.stringify({
            ...storeDetails,
            status: storeStatus,
            timings: storeTimings,
            tempClosedTimings: temporaryClosedTimings,
            tempClosedDays: temporaryClosedDays,
            polygonPoints,
        });
    }, [originalData, storeDetails, storeStatus, storeTimings, temporaryClosedTimings, temporaryClosedDays, polygonPoints]);

    // ✅ Generate dynamic fields on storeDetails change
    useEffect(() => {
        if (storeDetails.location_availability) {
            setStoreDetailFields(generateDynamicFields(storeDetails.location_availability));
        }
    }, [storeDetails.location_availability]);

    // ✅ Fetch details on mount
    useEffect(() => {
        getOrgDetails();
    }, [getOrgDetails]);

    return {
        storeDetails,
        setStoreDetails,
        storeDetailFields,
        storeStatus,
        setStoreStatus,
        storeTimings,
        setStoreTimings,
        temporaryClosedTimings,
        setTemporaryClosedTimings,
        temporaryClosedDays,
        setTemporaryClosedDays,
        polygonPoints,
        setPolygonPoints,
        openPolygonMap,
        setOpenPolygonMap,
        errors,
        onUpdate,
        anyChangeInData,
        userRole,
    };
};

export default useStoreDetails;
