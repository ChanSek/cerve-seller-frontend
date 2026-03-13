import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCall, postCall } from "../../../Api/axios";
import dayjs from "dayjs";
import OrderDetailsTooltip from "../Order/OrderDetailsTooltip";
import OrderDetailsDialog from "../Order/OrderDetailsDialog";
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    MenuItem,
    Button,
    IconButton,
    Tooltip,
    Popover,
    FormControl,
    InputLabel,
    Select,
    Box,
    Stack,
    Typography,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Divider,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Card,
    CardMedia,
    CardContent
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import cogoToast from "cogo-toast";
import { EditOutlined } from "@mui/icons-material";
import { RETURN_REJECT_REASONS } from "./return-reject-reasons";
import { PICKUP_REJECT_REASONS } from "./pickup-failed-reason";

const getTagValue = (tags, tagCode, key) => tags.find(t => t.code === tagCode)?.list?.find(l => l.code === key)?.value || "-";
const getQuoteTrails = tags => tags.filter(t => t.code === "quote_trail");

const RETURN_ORDER_STATUS = {
    Return_Initiated: "Return Initiated",
    Return_Rejected: "Return Rejected",
    Liquidated: "Liquidated",
    Reject: "Rejected",
    Rejected: "Rejected",
    Return_Approved: "Accepted",
    Return_Picked: "Picked",
    Return_Pick_Failed: "Pick up Failed",
    Return_Failed: "Return Failed",
    Return_Delivered: "Delivered"
};

const ActionMenu = ({ row, fetchReturns, actionName, isBulk }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [orderStatus, setOrderStatus] = useState(null);
    const [reasonId, setReasonId] = useState(null);
    const [inlineError, setInlineError] = useState({ selected_status_error: "", reason_error: "" });

    const handleClick = e => { e.stopPropagation(); setOrderStatus(null); setAnchorEl(e.currentTarget); };
    const handleClose = () => { setOrderStatus(null); setAnchorEl(null); };

    const checkIsOrderStatus = () => {
        if (!orderStatus) {
            setInlineError(err => ({ ...err, selected_status_error: "Please select status" }));
            return false;
        }
        return true;
    };

    const checkReason = () => {
        if (!reasonId) {
            setInlineError(err => ({ ...err, reason_error: "Please select reason" }));
            return false;
        }
        return true;
    };

    const updateReturnState = () => {
        let url = `/api/v1/seller/order/${row.order}/return`;
        const data = {
            fulfillmentIds: !isBulk ? [row._id] : [],
            returnState: orderStatus,
            ...(orderStatus === RETURN_ORDER_STATUS.Reject ||
                orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed ||
                orderStatus === RETURN_ORDER_STATUS.Return_Failed ? { reasonId } : {})
        };

        postCall(url, data)
            .then(() => {
                cogoToast.success("Status updated successfully");
                handleClose();
                fetchReturns();
            })
            .catch(error => {
                console.error(error);
                cogoToast.error(error.response?.data?.error || error.message);
            });
    };

    const availableStatuses = {
        Return_Initiated: ["Liquidated", "Reject", "Return_Approved"],
        Return_Approved: ["Return_Picked", "Return_Pick_Failed", "Return_Failed"],
        Return_Pick_Failed: ["Return_Picked", "Return_Pick_Failed", "Return_Failed"],
        Return_Picked: ["Return_Delivered"]
    }[row.state] || [];

    return (
        <>
            <Tooltip title={actionName}>
                <IconButton
                    color="primary"
                    onClick={handleClick}
                    onMouseDown={e => e.stopPropagation()}
                    disabled={!availableStatuses.length}
                    sx={{ border: "1px solid #1976d2", borderRadius: 1, backgroundColor: "white", '&:hover': { backgroundColor: "#e3f2fd" } }}
                >
                    <EditOutlined />
                </IconButton>
            </Tooltip>

            <Popover
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            >
                <Box sx={{ width: 400, p: 2 }}>
                    <Stack spacing={2}>
                        <FormControl fullWidth>
                            <InputLabel>Select Status</InputLabel>
                            <Select
                                value={orderStatus || ""}
                                label="Select Status"
                                onClick={e => e.stopPropagation()}
                                onMouseDown={e => e.stopPropagation()}
                                onChange={e => {
                                    e.stopPropagation();
                                    setInlineError({ ...inlineError, selected_status_error: "" });
                                    setOrderStatus(e.target.value);
                                }}
                            >
                                {availableStatuses.map(status => (
                                    <MenuItem key={status} value={RETURN_ORDER_STATUS[status]}>{RETURN_ORDER_STATUS[status]}</MenuItem>
                                ))}
                            </Select>
                            {inlineError.selected_status_error && <Typography color="error" variant="subtitle2" ml={1}>{inlineError.selected_status_error}</Typography>}
                        </FormControl>

                        {["Reject", "Return_Pick_Failed", "Return_Failed"].includes(orderStatus) && (
                            <FormControl fullWidth>
                                <InputLabel>Select Reason</InputLabel>
                                <Select
                                    value={reasonId || ""}
                                    label="Select Reason"
                                    onClick={e => e.stopPropagation()}
                                    onMouseDown={e => e.stopPropagation()}
                                    onChange={e => {
                                        e.stopPropagation();
                                        setInlineError({ ...inlineError, reason_error: "" });
                                        setReasonId(e.target.value);
                                    }}
                                >
                                    {(orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed ? PICKUP_REJECT_REASONS : RETURN_REJECT_REASONS).map((reason, idx) => (
                                        <MenuItem key={idx} value={reason.key}>{reason.value}</MenuItem>
                                    ))}
                                </Select>
                                {inlineError.reason_error && <Typography color="error" variant="subtitle2" ml={1}>{inlineError.reason_error}</Typography>}
                            </FormControl>
                        )}

                        <Stack direction="row" justifyContent="flex-end" spacing={1}>
                            <Button size="small" variant="outlined" onClick={e => { e.stopPropagation(); handleClose(); }}>Cancel</Button>
                            <Button size="small" variant="contained" onClick={e => {
                                e.stopPropagation();
                                const checks = [checkIsOrderStatus()];
                                if ([RETURN_ORDER_STATUS.Reject, RETURN_ORDER_STATUS.Return_Pick_Failed, RETURN_ORDER_STATUS.Return_Failed].includes(orderStatus)) checks.push(checkReason());
                                if (checks.every(Boolean)) updateReturnState();
                            }}>Update</Button>
                        </Stack>
                    </Stack>
                </Box>
            </Popover>
        </>
    );
};

const ReturnItemCard = ({ returnItem }) => {
    const tags = returnItem.request.tags || [];
    const quoteTrails = getQuoteTrails(tags);
    const images = (getTagValue(tags, "return_request", "images") || "")
        .replaceAll("&comma;", ",")
        .split(",")
        .map((imgUrl) => imgUrl.trim())
        .filter((imgUrl) => imgUrl.length > 0 && /^https?:\/\//i.test(imgUrl));
    return (
        <Paper variant="elevation" elevation={4} sx={{ p: { xs: 2, md: 4 }, mb: 3, borderRadius: 2 }}>
            <Stack spacing={4}>
                {/* Section 1: Product & Return Reason */}
                <Box>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 400, color: 'primary.main' }}>
                        Return Details for {returnItem.item.productName}
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={3} alignItems="flex-start">
                        <Grid item xs={12} md={images.length > 0 ? 6 : 12}>
                            <Stack spacing={1.5}>
                                <Typography variant="body1">
                                    <strong>Reason:</strong> <span style={{ color: '#d32f2f', fontWeight: 600 }}>{returnItem.reason}</span>
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Description:</strong> {getTagValue(tags, "return_request", "reason_desc")}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Quantity:</strong> {getTagValue(tags, "return_request", "item_quantity")}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Requested On:</strong> {dayjs(returnItem.createdAt).format("DD MMM YYYY, hh:mm A")}
                                </Typography>
                                <Typography variant="body2">
                                    <strong>Last Updated:</strong> {dayjs(returnItem.updatedAt).format("DD MMM YYYY, hh:mm A")}
                                </Typography>
                            </Stack>
                        </Grid>
                        {images.length > 0 && (
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                                    Associated Images
                                </Typography>
                                <Box display="flex" gap={2} overflow="auto">
                                    {(getTagValue(tags, "return_request", "images") || "")
                                        .replaceAll("&comma;", ",")
                                        .split(",")
                                        .map((imgUrl) => imgUrl.trim())
                                        .filter((imgUrl) => imgUrl.length > 0 && /^https?:\/\//i.test(imgUrl))
                                        .map((imgUrl, index) => (
                                            <Box key={index} className="image-preview-container">
                                                <Box
                                                    component="img"
                                                    src={imgUrl}
                                                    alt={`Return image ${index + 1}`}
                                                    sx={{
                                                        width: 60,
                                                        height: 60,
                                                        objectFit: "cover",
                                                        borderRadius: 2,
                                                        boxShadow: 0,
                                                    }}
                                                />
                                                <Box
                                                    component="img"
                                                    src={imgUrl}
                                                    alt={`Zoomed Return image ${index + 1}`}
                                                    className="image-preview-large"
                                                />
                                            </Box>
                                        ))}
                                </Box>
                            </Grid>
                        )}
                    </Grid>
                </Box>

                {/* <Divider sx={{ my: 2 }} /> */}

                {/* Section 2: Pickup and Drop-off Details */}
                {returnItem?.request?.end && <Box>
                    <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 400, color: 'primary.main' }}>
                        Pickup & Delivery Information
                    </Typography>
                    <Divider sx={{ my: 2 }} />
                    <Grid container spacing={4}>
                        {/* Start Details */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderColor: 'grey.300' }}>
                                <CardContent>
                                    <Typography variant="h7" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                        From Details (Pickup)
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        <Typography variant="body2"><strong>Name:</strong> {returnItem?.request?.start?.person?.name}</Typography>
                                        <Typography variant="body2"><strong>Phone:</strong> {returnItem?.request?.start?.contact?.phone}</Typography>
                                        <Typography variant="body2"><strong>Email:</strong> {returnItem?.request?.start?.contact?.email}</Typography>
                                        <Typography variant="subtitle2" mt={1}>Address:</Typography>
                                        <Stack pl={2} spacing={0.5}>
                                            <Typography variant="body2">{returnItem?.request?.start?.location?.address?.building}</Typography>
                                            <Typography variant="body2">{returnItem?.request?.start?.location?.address?.locality}, {returnItem?.request?.start?.location?.address?.city}</Typography>
                                            <Typography variant="body2">{returnItem?.request?.start?.location?.address?.state}, {returnItem?.request?.start?.location?.address?.country} - {returnItem?.request?.start?.location?.address?.area_code}</Typography>
                                        </Stack>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Expected Pickup:</strong> {dayjs(returnItem?.request?.start?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                                            {" - "}
                                            {dayjs(returnItem?.request?.start?.time?.range?.end).format("hh:mm A")}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Picked On:</strong> {returnItem?.request?.start?.time?.timestamp ? dayjs(returnItem?.request?.start?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ''}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* End Details */}
                        <Grid item xs={12} md={6}>
                            <Card variant="outlined" sx={{ height: '100%', borderRadius: 2, borderColor: 'grey.300' }}>
                                <CardContent>
                                    <Typography variant="h7" gutterBottom sx={{ fontWeight: 500, color: 'text.secondary' }}>
                                        To Details (Drop-off)
                                    </Typography>
                                    <Divider sx={{ my: 2 }} />
                                    <Stack spacing={1}>
                                        <Typography variant="body2"><strong>Name:</strong> {returnItem?.request?.end?.location?.descriptor?.name}</Typography>
                                        <Typography variant="body2"><strong>Phone:</strong> {returnItem?.request?.end?.contact?.phone}</Typography>
                                        <Typography variant="body2"><strong>Email:</strong> {returnItem?.request?.end?.contact?.email}</Typography>
                                        <Typography variant="subtitle2" mt={1}>Address:</Typography>
                                        <Stack pl={2} spacing={0.5}>
                                            <Typography variant="body2">{returnItem?.request?.end?.location?.address?.building}</Typography>
                                            <Typography variant="body2">{returnItem?.request?.end?.location?.address?.locality}, {returnItem?.request?.end?.location?.address?.city}</Typography>
                                            <Typography variant="body2">{returnItem?.request?.end?.location?.address?.state}, {returnItem?.request?.end?.location?.address?.country} - {returnItem?.request?.end?.location?.address?.area_code}</Typography>
                                        </Stack>
                                        <Typography variant="body2" mt={1}>
                                            <strong>Expected Delivery:</strong> {dayjs(returnItem?.request?.end?.time?.range?.start).format("DD MMM YYYY, hh:mm A")}
                                            {" - "}
                                            {dayjs(returnItem?.request?.end?.time?.range?.end).format("hh:mm A")}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Delivered On:</strong> {returnItem?.request?.end?.time?.timestamp ? dayjs(returnItem?.request?.end?.time?.timestamp).format("DD MMM YYYY, hh:mm A") : ''}
                                        </Typography>
                                    </Stack>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>}

                {/* Section 3: Refund Details */}
                {quoteTrails && quoteTrails.length > 0 && (
                    <>
                        <Box>
                            <Typography variant="h6" component="h2" gutterBottom sx={{ fontWeight: 400, color: 'primary.main' }}>
                                Refund Breakdown
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Table size="medium" aria-label="refund breakdown table">
                                <TableHead sx={{ backgroundColor: 'grey.100' }}>
                                    <TableRow>
                                        <TableCell sx={{ fontWeight: 'bold' }}>Type</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quoteTrails.map((trail, idx) => (
                                        <TableRow key={idx} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                            <TableCell>{trail.list.find(i => i.code === "type")?.value}</TableCell>
                                            <TableCell align="right">{trail.list.find(i => i.code === "value")?.value}</TableCell>
                                        </TableRow>
                                    ))}
                                    <TableRow sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Total Refund</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold', fontSize: '1.1rem', color: 'success.main' }}>
                                            {
                                                quoteTrails.reduce((sum, trail) => {
                                                    const valueItem = trail.list.find(i => i.code === "value");
                                                    const value = parseFloat(valueItem?.value || '0');
                                                    return sum + value;
                                                }, 0).toFixed(2)
                                            }
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </Box>
                    </>
                )}
            </Stack>
        </Paper>
    );
};

const ReturnDetails = ({ id, category, open, onClose }) => {
    const [returnData, setReturnData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const fetchReturns = async () => {
        try {
            const resp = await getCall(`/api/v1/seller/return/${category}/${id}`);
            setReturnData(resp.data);
        } catch (err) {
            console.error("Error fetching return data:", err);
            setError("Failed to fetch return data");
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        if (open) {
            fetchReturns();
        }
    }, [id, open]);

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                Return Details
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Alert severity="error">{error}</Alert>
                ) : returnData.length === 0 ? (
                    <Alert severity="info">No return requests available.</Alert>
                ) : (
                    <>
                        {/* ✅ Common Header */}
                        <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="center"
                            mb={2}
                            px={1}
                        >
                            {/* <Typography variant="h6">
                                {<OrderDetailsTooltip order={returnData[0]?.orderId} orderId={returnData[0]?.order} />}
                                <OrderDetailsDialog
                                    open={dialogOpen}
                                    onClose={() => setDialogOpen(false)}
                                    orderId="12345"
                                />;
                            </Typography> */}
                            <OrderDetailsDialog
                                orderId={returnData[0]?.orderId}
                                triggerComponent={<Typography
                                    variant="h6"
                                    sx={{
                                        color: "#1565c0", // Bluish text color
                                        cursor: "pointer", // Pointer cursor for hover effect
                                        "&:hover": {
                                            textDecoration: "underline", // Underline on hover for emphasis
                                        },
                                    }}
                                >
                                    {returnData[0]?.orderId}
                                </Typography>}
                            />
                            {!loading &&
                                returnData.length > 1 &&
                                returnData.every(
                                    item =>
                                        item.state === returnData[0].state &&
                                        [
                                            "Return_Initiated",
                                            "Return_Approved",
                                            "Return_Picked"
                                        ].includes(item.state)
                                ) && (
                                    <ActionMenu
                                        row={returnData[0]}
                                        fetchReturns={fetchReturns}
                                        actionName={"Take Complete Action"} isBulk={true}
                                    />
                                )}

                        </Box>

                        {/* ✅ Accordions */}
                        {returnData.map((item, idx) => (
                            <Accordion key={item._id} defaultExpanded={idx === 0}>
                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                    <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="center"
                                        width="100%"
                                    >
                                        <Typography>
                                            {item.state.replace(/_/g, ' ')} - {dayjs(item.updatedAt).format("DD MMM YYYY, hh:mm A")}
                                        </Typography>
                                        <ActionMenu row={item} fetchReturns={fetchReturns} actionName={"Take Action"} isBulk={false} />
                                    </Stack>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <ReturnItemCard returnItem={item} />
                                </AccordionDetails>
                            </Accordion>
                        ))}
                    </>
                )}
            </DialogContent>
        </Dialog>
    );
};


export default ReturnDetails;