import React, { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import ActivityTable from "./ActivityTable";
import { Tab, Tabs } from "@mui/material";
import { getCall } from "../../../Api/axios";
import useNavigation from "../../../hooks/useNavigation";
import useQueryParams from "../../../hooks/useQueryParams";
import { useTheme } from "@mui/material/styles";

const tabs = [
    { value: "transactions", label: "All Transactions" },
    { value: "rejection", label: "Catalog Rejection" },
    { value: "apiFailed", label: "Failed Transactions" },
];

const activityCols = [
    { id: "bapId", label: "BAP Id" },
    { id: "transactionId", label: "Transaction Id" },
    { id: "transactionDate", label: "Transaction Date" },
    { id: "Action", label: "Action" },
];

const Activity = () => {
    const theme = useTheme();
    const queryParams = useQueryParams();
    const [view, setView] = useState(queryParams.view || "transactions");
    const [activity, setActivity] = useState([]);
    const [page, setPage] = useState(0); // This will be reset on tab change
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const navigation = useNavigation();
    const location = useLocation();

    const handleChange = (event, newValue) => {
        setView(newValue);
        setPage(0);  // Reset page to 0 when tab changes
        setRowsPerPage(10); // Reset rows per page (if necessary)
        setTotalRecords(0); // Reset total records (if necessary)
    };

    const fetchGatewayActivities = async () => {
        const url = `/api/v1/seller/activity/${view}?pageSize=${rowsPerPage}&fromIndex=${page}`;
        try {
            const res = await getCall(url);
            setActivity(res.content);
            setTotalRecords(res.totalElements);
        } catch (error) {
            toast.error(error.response.data.error);
        }
    };

    useEffect(() => {
        fetchGatewayActivities();
    }, [view, page, rowsPerPage]);

    return (
        <div>
            <div className="container mx-auto my-8">
                <div className="mb-4 flex flex-row justify-between items-center">
                    <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
                        Gateway Activity
                    </label>
                </div>

                <div className="flex flex-row justify-between items-center">
                    <Tabs
                        style={{ marginBottom: 30 }}
                        value={view}
                        onChange={handleChange}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        {tabs.map((tab) => (
                            <Tab key={tab.value} value={tab.value} label={tab.label} />
                        ))}
                    </Tabs>
                </div>

                <ActivityTable
                    view={view}
                    columns={activityCols}
                    data={activity}
                    totalRecords={totalRecords}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handlePageChange={(val) => setPage(val)}
                    handleRowsPerPageChange={(val) => setRowsPerPage(val)}
                />
            </div>
        </div>
    );
};

export default Activity;
