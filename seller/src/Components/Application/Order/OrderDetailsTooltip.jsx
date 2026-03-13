import React, { useEffect, useState, useCallback } from "react";
import { getCall } from "../../../Api/axios";
import dayjs from "dayjs";
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import {
    Paper,
    Card,
    CardContent,
    Tooltip,
    Box,
    Stack,
    Typography,
    Divider,
    CircularProgress,
    Grid,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";
dayjs.extend(duration);
dayjs.extend(relativeTime);


// Helper function to extract tags from a fulfillment or other arrays
const getTagValue = (tagsArray, code, key) => {
    if (!tagsArray || !Array.isArray(tagsArray)) return '';
    const tag = tagsArray.find(t => t.code === code);
    if (tag && tag.list && Array.isArray(tag.list)) {
        const item = tag.list.find(li => li.code === key);
        return item ? item.value : '';
    }
    return '';
};

const formatString = (str) => {
    if (!str) return '';
    return str.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

const OrderDetailsTooltip = ({ orderId, order }) => {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [tooltipData, setTooltipData] = useState(null);
    const [error, setError] = useState(null);

    const getOrder = useCallback(async () => {
        const url = `/api/v1/seller/${orderId}/order`;
        try {
            const resp = await getCall(url);
            return resp.data;
        } catch (err) {
            throw err;
        }
    }, [orderId]);

    const fetchOrderDetails = useCallback(async () => {
        if (!orderId || tooltipData) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const orderData = await getOrder();
            setTooltipData(orderData);
        } catch (err) {
            console.error("Failed to fetch order details:", err);
            setError("Failed to load order details. Please try again.");
            setTooltipData(null);
        } finally {
            setLoading(false);
        }
    }, [orderId, tooltipData, getOrder]);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        if (open && orderId) {
            fetchOrderDetails();
        }
    }, [open, orderId, fetchOrderDetails]);

    // Content to be displayed inside the tooltip
    const renderTooltipContent = () => {
        if (loading) {
            return (
                <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minWidth: 200, minHeight: 100 }}>
                    <CircularProgress size={24} sx={{ mb: 1 }} />
                    <Typography variant="body2">Loading details...</Typography>
                </Box>
            );
        }

        if (error) {
            return (
                <Box sx={{ p: 2, minWidth: 200 }}>
                    <Typography color="error">{error}</Typography>
                </Box>
            );
        }

        if (!tooltipData) {
            return (
                <Box sx={{ p: 2, minWidth: 200 }}>
                    <Typography variant="body2">No details available.</Typography>
                </Box>
            );
        }

        const { transactionId, state, createdAt, updatedAt, billing, payment, fulfillments, quote } = tooltipData;
        const mainDelivery = fulfillments?.find(f => f.type === 'Delivery');
        const returnFulfillment = fulfillments?.find(f => f.type === 'Return');

        return (
            <Paper elevation={6} sx={{
                p: 2,
                maxWidth: 800,
                borderRadius: 1,
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                bgcolor: 'background.paper',
                maxHeight: '75vh', // Subtract space for button or footer
                overflowY: 'auto', // Enable vertical scrolling
                overflowX: 'auto', // Enable horizontal scrolling
                // Optional: Customize scrollbar for better aesthetics
                '&::-webkit-scrollbar': {
                    width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                    background: '#f1f1f1',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb': {
                    background: '#888',
                    borderRadius: '10px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                    background: '#555',
                },
            }}>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 700, color: 'primary.main', mb: 2 }}>
                    Order Summary
                </Typography>
                <Divider sx={{ mb: 3, borderColor: 'divider' }} />
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Order Details
                </Typography>
                <Grid container spacing={3} alignItems="flex-start">
                    <Grid item xs={12} md={12}>
                        <Stack spacing={1.5}>
                            <Typography variant="body2">
                                <strong>Status:</strong>
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{ fontWeight: 600, color: 'success.main' }}
                                >
                                    {formatString(state)}
                                </Typography>
                            </Typography>
                            <Typography variant="body2">
                                <strong>Created On:</strong> {createdAt ? dayjs(createdAt).format('MMMM D, YYYY h:mm A') : 'N/A'}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Modified On:</strong> {updatedAt ? dayjs(updatedAt).format('MMMM D, YYYY h:mm A') : 'N/A'}
                            </Typography>
                        </Stack>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 3, borderColor: 'divider' }} />

                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Customer Details
                </Typography>
                {/* Billing Info: Consolidating Name, Email, Phone into a grid row */}
                <Grid item xs={12} md={12}>
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
                            <strong>Address:</strong> {billing?.address ? `${billing.address.building || ''}, ${billing.address.locality || ''}, ${billing.address.city || ''} - ${billing.address.area_code || ''}`.replace(/,\s*,/g, ', ').replace(/^,\s*/, '').replace(/,\s*$/, '') : 'N/A'}
                        </Typography>
                    </Stack>
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
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total</TableCell>
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
                                                    {item['@ondc/org/title_type'] === 'item' ? `${quote.price?.currency || ''} ${unitPrice.toFixed(2)}` : '-'}
                                                </TableCell>
                                                <TableCell align="right">
                                                    {quote.price?.currency || ''} {itemTotal.toFixed(2)}
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
                                    <span>Grand Total:</span>
                                    <span>{quote.price?.currency || ''} {parseFloat(quote.price?.value || '0').toFixed(2)}</span>
                                </Typography>
                            </Stack>
                        </Box>
                    </>
                )}
                {/* --- End Invoice Representation --- */}



                <Divider sx={{ my: 3, borderColor: 'divider' }} />

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
                <Divider sx={{ my: 3, borderColor: 'divider' }} />
                {mainDelivery && <Box>
                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: 'text.primary' }}>
                        Delivery Status
                    </Typography>
                    <Typography variant="body2">
                        <strong>Current State:</strong> {formatString(mainDelivery.state?.descriptor?.code) || 'N/A'}
                    </Typography><br />
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
        <Tooltip
            title={renderTooltipContent()}
            arrow
            placement="right"
            enterDelay={500}
            leaveDelay={200}
            onClose={handleClose}
            onOpen={handleOpen}
            interactive
            PopperProps={{
                sx: {
                    '& .MuiTooltip-popper': {
                        zIndex: 1500,
                    },
                    '& .MuiTooltip-tooltip': {
                        backgroundColor: 'transparent',
                        boxShadow: 'none',
                        maxWidth: 'none', // Important: let Paper's maxWidth control it
                    }
                }
            }}
        >
            <Typography
                variant="h6"
                component="span"
                sx={{
                    cursor: 'help',
                    color: 'primary.dark',
                    '&:hover': {
                        color: 'primary.main',
                    },
                    display: 'inline-block'
                }}
            >
                Order ID: {order || "-"}
            </Typography>
        </Tooltip>
    );
};

export default OrderDetailsTooltip;