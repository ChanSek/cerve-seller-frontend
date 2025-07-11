import React, { useEffect, useState, useCallback } from "react";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Box,
    Stack,
    Typography,
    Divider,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Card,
    CardContent
} from "@mui/material";
import { getCall } from "../../../Api/axios";
import dayjs from "dayjs";
import FulfilmentState from "./FulfilmentState";

const formatString = (str) => {
    if (!str) return "N/A";
    return str
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");
};
const OrderDetailsDialog = ({ orderId, triggerComponent }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [error, setError] = useState(null);
    const fetchOrderDetails = useCallback(async () => {
        console.log("orderId ", orderId);
        if (!orderId || orderDetails) return;
        setLoading(true);
        setError(null);
        try {
            const response = await getCall(`/api/v1/seller/${orderId}/order/details`);
            setOrderDetails(response.data);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
            setError("Failed to load order details.");
        } finally {
            setLoading(false);
        }
    }, [orderId, orderDetails]);

    useEffect(() => {
        if (open) {
            fetchOrderDetails();
        }
    }, [open, fetchOrderDetails]);

    useEffect(() => {
        console.log(`open changed to: ${open}`);
    }, [open]);

    const handleClose = () => {
        setOpen(false);
    };

    const renderContent = () => {
        if (loading) {
            return (
                <Box display="flex" alignItems="center" justifyContent="center" minHeight={200}>
                    <CircularProgress />
                </Box>
            );
        }

        if (error) {
            return (
                <Typography color="error" sx={{ textAlign: "center", p: 2 }}>
                    {error}
                </Typography>
            );
        }

        if (!orderDetails) {
            return (
                <Typography sx={{ textAlign: "center", p: 2 }}>
                    No order details available.
                </Typography>
            );
        }

        const { transactionId, state, createdAt, updatedAt, billing, payment, fulfillments, quote, stateTransition } = orderDetails;
        const mainDelivery = fulfillments?.find(f => f.type === 'Delivery');
        const returnFulfillment = fulfillments?.find(f => f.type === 'Return');
        const refundDetails = payment && payment["@ondc/org/settlement_details"].filter(
            (detail) => detail.settlement_phase === "refund"
        );

        const grandTotal = refundDetails && refundDetails.reduce(
            (total, detail) => total + parseFloat(detail.settlement_amount || 0),
            0
        );
        return (
            <Paper sx={{ p: 2, borderRadius: 1, maxHeight: "75vh", overflowY: "auto" }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                    Order Summary
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'divider' }} />
                <Grid container spacing={3}>
                    {/* Order Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Order Details
                        </Typography>
                        <Stack spacing={1.5}>
                            <Typography variant="body2">
                                <strong>Order Status:</strong>{' '}
                                <Typography
                                    component="span"
                                    variant="body2"
                                    sx={{ fontWeight: 500, color: 'success.main' }}
                                >
                                    {formatString(state)}
                                </Typography>
                            </Typography>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <Typography
                                    variant="body2"
                                    sx={{ fontWeight: 'bold', marginRight: '0.5rem' }}
                                >
                                    Fulfillment State:
                                </Typography>
                                <Typography
                                    variant="body2"
                                >
                                    <FulfilmentState data={stateTransition} currentState={formatString(mainDelivery?.state?.descriptor?.code)} />
                                </Typography>
                            </div>
                            {/* <FulfilmentState anchorEl={anchorEl} handleClose={handlePopoverClose} data={stateTransition} /> */}
                            <Typography variant="body2">
                                <strong>Created On:</strong> {createdAt ? dayjs(createdAt).format('MMMM D, YYYY h:mm A') : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Modified On:</strong> {updatedAt ? dayjs(updatedAt).format('MMMM D, YYYY h:mm A') : 'N/A'}
                            </Typography>
                        </Stack>
                    </Grid>

                    {/* Customer Details */}
                    <Grid item xs={12} md={6}>
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                            Customer Details
                        </Typography>
                        <Stack spacing={1.5}>
                            <Typography variant="body2">
                                <strong>Name:</strong> {billing?.name || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Email:</strong> {billing?.email || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Phone:</strong> {billing?.phone || 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Address:</strong>{' '}
                                {billing?.address
                                    ? `${billing.address.building || ''}, ${billing.address.locality || ''}, ${billing.address.city || ''} - ${billing.address.area_code || ''}`
                                        .replace(/,\s*,/g, ', ')
                                        .replace(/^,\s*/, '')
                                        .replace(/,\s*$/, '')
                                    : 'N/A'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>

                {/* --- Invoice Representation from Quote --- */}
                {quote && (
                    <>
                        <Divider sx={{ my: 3, borderColor: 'divider' }} />
                        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>
                            Qutotation Details
                        </Typography>

                        <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
                            <Table size="small" aria-label="invoice table">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price (₹)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total (₹)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quote.breakup?.map((item, index) => {
                                        const quantity = item['@ondc/org/item_quantity']?.count || (item['@ondc/org/title_type'] === 'item' ? 1 : null); // Default to 1 for items
                                        const unitPrice = parseFloat(item.item?.price?.value || '0'); // Unit price should come from item.item.price
                                        const itemTotal = parseFloat(item.price?.value || '0');

                                        return (
                                            <TableRow key={index}>
                                                <TableCell component="th" scope="row">
                                                    {item.title}
                                                </TableCell>
                                                <TableCell align="right">{quantity !== null ? quantity : '-'}</TableCell>
                                                <TableCell align="right">
                                                    {item['@ondc/org/title_type'] === 'item' ? `${unitPrice.toFixed(2)}` : '-'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {itemTotal.toFixed(2)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* Grand Total */}
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                            <Stack spacing={0.5} sx={{ width: '100%', maxWidth: 250 }}> {/* Increased max-width for total section */}
                                <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark', display: 'flex', justifyContent: 'space-between' }}>
                                    <span>Order Total:</span>
                                    <span>₹ {parseFloat(quote.price?.value || '0').toFixed(2)}</span>
                                </Typography>
                            </Stack>
                        </Box>
                    </>
                )}
                {/* --- End Invoice Representation --- */}

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Payment Details
                </Typography>
                <Grid item xs={12} md={12}>
                    <Stack spacing={1.5}>
                        <Typography variant="body2">
                            <strong>Amount:</strong> {payment?.params?.currency || ''} {payment?.params?.amount || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Status:</strong> {formatString(payment?.status) || 'N/A'}
                        </Typography>
                        {payment?.['@ondc/org/settlement_details']?.length > 0 && (
                            <Typography variant="body2">
                                <strong>Settlement Bank:</strong> {payment['@ondc/org/settlement_details'][0]?.bank_name || 'N/A'}
                            </Typography>
                        )}
                    </Stack>
                </Grid>
                {refundDetails && refundDetails.length > 0 && (<>
                    <Divider sx={{ my: 3, borderColor: 'divider' }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Refund Details
                    </Typography>
                    <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
                        <Table size="small" aria-label="invoice table">
                            <TableHead sx={{ bgcolor: 'action.hover' }}>
                                <TableRow>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Counterparty</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Timestamp</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount (₹)</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {refundDetails.map((detail, index) => {
                                    return (
                                        <TableRow key={index}>
                                            <TableCell component="th" scope="row">
                                                {detail.settlement_counterparty || "N/A"}
                                            </TableCell>
                                            <TableCell align="right">
                                                {detail.settlement_type || "N/A"}
                                            </TableCell>
                                            <TableCell align="right">
                                                {new Date(detail.settlement_timestamp).toLocaleString()}
                                            </TableCell>
                                            <TableCell align="right">{detail.settlement_amount}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Grand Total */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                        <Stack spacing={0.5} sx={{ width: '100%', maxWidth: 250 }}> {/* Increased max-width for total section */}
                            <Typography variant="h6" sx={{ fontWeight: 700, color: 'primary.dark', display: 'flex', justifyContent: 'space-between' }}>
                                <span>Refund Total:</span>
                                <span>₹ {parseFloat(grandTotal || '0').toFixed(2)}</span>
                            </Typography>
                        </Stack>
                    </Box>
                </>
                )}
                {mainDelivery && <Box>
                    <Divider sx={{ my: 3, borderColor: 'divider' }} />
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Delivery Status
                    </Typography>
                    <Grid container spacing={4}>
                        {/* Start Details */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderColor: 'grey.300' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                        From Details (Pickup)
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        <Typography variant="body2"><strong>Name:</strong> {mainDelivery?.start?.location?.descriptor?.name}</Typography>
                                        <Typography variant="body2"><strong>Phone:</strong> {mainDelivery?.start?.contact?.phone}</Typography>
                                        <Typography variant="body2"><strong>Email:</strong> {mainDelivery?.start?.contact?.email}</Typography>
                                        <Typography variant="subtitle2" mt={1}>Address:</Typography>
                                        <Stack pl={2} spacing={0.5}>
                                            <Typography variant="body2">{mainDelivery?.start?.location?.address?.building}</Typography>
                                            <Typography variant="body2">{mainDelivery?.start?.location?.address?.locality}, {mainDelivery?.start?.location?.address?.city}</Typography>
                                            <Typography variant="body2">{mainDelivery?.start?.location?.address?.state}, {mainDelivery?.start?.location?.address?.country} - {mainDelivery?.start?.location?.address?.area_code}</Typography>
                                        </Stack>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Expected Pickup:</strong> {dayjs(mainDelivery?.start?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                                            {" - "}
                                            {dayjs(mainDelivery?.start?.time?.range?.end).format("hh:mm A")}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Picked On:</strong> {mainDelivery?.start?.time?.timestamp ? dayjs(mainDelivery?.start?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ''}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* End Details */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderColor: 'grey.300' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                        To Details (Drop-off)
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        <Typography variant="body2"><strong>Name:</strong> {mainDelivery?.end?.person?.name}</Typography>
                                        <Typography variant="body2"><strong>Phone:</strong> {mainDelivery?.end?.contact?.phone}</Typography>
                                        <Typography variant="body2"><strong>Email:</strong> {mainDelivery?.end?.contact?.email}</Typography>
                                        <Typography variant="subtitle2" mt={1}>Address:</Typography>
                                        <Stack pl={2} spacing={0.5}>
                                            <Typography variant="body2">{mainDelivery?.end?.location?.address?.building}</Typography>
                                            <Typography variant="body2">{mainDelivery?.end?.location?.address?.locality}, {mainDelivery?.end?.location?.address?.city}</Typography>
                                            <Typography variant="body2">{mainDelivery?.end?.location?.address?.state}, {mainDelivery?.end?.location?.address?.country} - {mainDelivery?.end?.location?.address?.area_code}</Typography>
                                        </Stack>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Expected Delivery:</strong> {dayjs(mainDelivery?.end?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                                            {" - "}
                                            {dayjs(mainDelivery?.end?.time?.range?.end).format("hh:mm A")}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Delivered On:</strong> {mainDelivery?.end?.time?.timestamp ? dayjs(mainDelivery?.end?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ''}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>}
            </Paper>
        );
    };

    return (
        <>
            <Box onClick={() => setOpen(true)} style={{ cursor: "pointer" }}>
                {triggerComponent}
            </Box>

            <Dialog
                open={open}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    Order Details - {orderId}
                    <Button
                        onClick={handleClose}
                        style={{
                            position: "absolute",
                            right: "16px",
                            top: "8px",
                        }}
                        size="small"
                        variant="text"
                    >
                        Close
                    </Button>
                </DialogTitle>

                <DialogContent dividers>
                    {renderContent()}
                </DialogContent>
            </Dialog>
        </>
    );

};

export default OrderDetailsDialog;
