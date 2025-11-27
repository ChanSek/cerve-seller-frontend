import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    MenuItem,
    CircularProgress,
    Stack,
    Select,
    InputLabel,
    FormControl,
    Box,
    Divider,
} from "@mui/material";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { DELIVERY_FULFILLMENT_STATUS, RTO_FULFILLMENT_STATUS } from "./order-fulfillment-status";
import { RTO_REASONS } from "./rto-reasons";

const RTO_INITIATED = "RTO-Initiated";

const UpdateOrderStatusModal = ({
    showModal,
    handleCloseModal,
    deliveryData,
    rtoData,
    order,
    setloading,
    loading,
    onOrderUpdate
}) => {
    const [statusOptions, setStatusOptions] = useState([]);
    const [status, setStatus] = useState("");
    const [reason, setReason] = useState("");

    useEffect(() => {
        if (deliveryData) {
            const currentSeq = DELIVERY_FULFILLMENT_STATUS.find(
                (status) => status.fulfillmentStatus === deliveryData?.state?.descriptor.code
            )?.seq;

            if (currentSeq) {
                const options = DELIVERY_FULFILLMENT_STATUS.filter(
                    (status) => status.seq > currentSeq
                );
                setStatusOptions(options);
                setStatus(options[0]?.fulfillmentStatus || "");
            }
        }
    }, [deliveryData]);

    useEffect(() => {
        if (rtoData) {
            const currentSeq = RTO_FULFILLMENT_STATUS.find(
                (status) => status.fulfillmentStatus === rtoData?.state?.descriptor.code
            )?.seq;

            if (currentSeq) {
                const options = RTO_FULFILLMENT_STATUS.filter(
                    (status) => status.seq > currentSeq
                );
                setStatusOptions(options);
                setStatus(options[0]?.fulfillmentStatus || "");
            }
        }
    }, [rtoData]);

    const updateFulfillmentState = async (url, payload) => {
        try {
            const response = await postCall(url, payload);
            return { success: true, data: response };
        } catch (error) {
            console.error("Error updating fulfillment state:", error);
            return { success: false, error };
        }
    };

    const updateFulfilment = async () => {
        if (!status) return;
        if (status === RTO_INITIATED && !reason) return;

        // setloading((prev) => ({ ...prev, update_order_loading: true }));

        const selectedStatus = statusOptions.find(
            (s) => s.fulfillmentStatus === status
        );

        const fulfillmentId =
            status === RTO_INITIATED || selectedStatus?.fulfillmentType === "Delivery"
                ? deliveryData?.id
                : rtoData?.id;

        const payload = {
            fulfillmentId,
            fulfillmentType: selectedStatus?.fulfillmentType || "Delivery",
            newState: status,
            reasonId: reason || undefined,
        };

        const url = `/api/v1/seller/fulfillment/${order?.orderId}/state`;
        const { success } = await updateFulfillmentState(url, payload);

        if (success) {
            cogoToast.success("Fulfillment state updated successfully.");
            onOrderUpdate();
            handleCloseModal();
        } else {
            cogoToast.error("Failed to update fulfillment state.");
        }

        // setloading((prev) => ({ ...prev, update_order_loading: false }));
    };

    return (
        <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ fontWeight: 600 }}>Update Order Status</DialogTitle>
            <DialogContent>
                <Stack spacing={2} mt={1} divider={<Divider flexItem />}>
                    <Box>
                        <Typography variant="body2" fontWeight={500} gutterBottom>
                            Delivery To:
                        </Typography>
                        <Typography variant="body2">
                            <b>{deliveryData?.end?.person?.name || "N/A"}</b>
                        </Typography>
                    </Box>

                    <Box>
                        <FormControl size="small" fullWidth>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={status}
                                label="Status"
                                onChange={(e) => setStatus(e.target.value)}
                            >
                                {statusOptions.map((s) => (
                                    <MenuItem
                                        key={s.fulfillmentStatus}
                                        value={s.fulfillmentStatus}
                                    >
                                        {s.label || s.fulfillmentStatus}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {status === RTO_INITIATED && (
                            <Box mt={2}>
                                <FormControl size="small" fullWidth>
                                    <InputLabel id="reason-label">Select Reason</InputLabel>
                                    <Select
                                        labelId="reason-label"
                                        value={reason}
                                        label="Select Reason"
                                        onChange={(e) => setReason(e.target.value)}
                                    >
                                        {RTO_REASONS.map((r) => (
                                            <MenuItem key={r.key} value={r.key}>
                                                {r.value}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        )}
                    </Box>
                </Stack>
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button onClick={handleCloseModal}>Cancel</Button>
                <Button
                    onClick={updateFulfilment}
                    variant="contained"
                    disabled={loading.update_order_loading}
                >
                    {loading.update_order_loading ? (
                        <CircularProgress size={18} sx={{ color: "white" }} />
                    ) : (
                        "Update"
                    )}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UpdateOrderStatusModal;
