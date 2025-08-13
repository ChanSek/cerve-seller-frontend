import React, { useEffect, useState } from 'react';
import {
    Typography,
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Checkbox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
    Tooltip
} from '@mui/material';
import cogoToast from "cogo-toast";
import { postCall } from "../../../Api/axios";
import ViewProductDetails from '../Product/ViewProductDetails';

const PartialCancellation = ({ orderId, quote, category, allowPartialCancel, onOrderUpdate, isSuperAdmin }) => {
    const [selectedItems, setSelectedItems] = useState([]);
    const [quantityDialog, setQuantityDialog] = useState({ open: false, item: null });
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false);

    useEffect(() => {
        if (!allowPartialCancel) {
            setSelectedItems([]);
        }
    }, [allowPartialCancel]);

    const cancelItems = async () => {
        if (!selectedItems || selectedItems.length === 0) {
            cogoToast.warn("No items selected to cancel.");
            return;
        }

        const url = `/api/v1/seller/order/${orderId}/item/cancel`;
        const DEFAULT_CANCELLATION_REASON = "002";

        const payload = {
            cancelItems: selectedItems
                .filter(item => item.itemId && item.quantity)
                .map((item) => ({
                    cancellation_reason_id: DEFAULT_CANCELLATION_REASON,
                    id: item.itemId,
                    quantity: item.quantity,
                })),
        };

        setIsCancelling(true); // 🔄 Start loading
        try {
            await postCall(url, payload);
            await new Promise(resolve => setTimeout(resolve, 1000));
            onOrderUpdate();
            cogoToast.success("Products cancelled successfully!");
        } catch (error) {
            console.error("Error cancelling items:", error);
            cogoToast.error("Failed to cancel products. Please try again.");
        } finally {
            setIsCancelling(false); // ✅ Stop loading
            setSelectedItems([]);   // ✅ Clear selected
            setSelectedProductId(null);
        }
    };


    const handleCheckboxChange = (item, isChecked) => {
        if (isChecked) {
            setQuantityDialog({ open: true, item: { ...item, quantity: 1 } });
        } else {
            setSelectedItems((prev) => prev.filter((i) => i.itemId !== item.itemId));
        }
    };

    const handleQuantityConfirm = () => {
        const { item } = quantityDialog;

        setSelectedItems((prev) => {
            const existingItemIndex = prev.findIndex((i) => i.itemId === item.itemId);
            const updatedItem = { ...item, quantity: Math.min(item.quantity, item.availableQuantity) };

            if (existingItemIndex > -1) {
                const updatedList = [...prev];
                updatedList[existingItemIndex] = updatedItem;
                return updatedList;
            }
            return [...prev, updatedItem];
        });

        setQuantityDialog({ open: false, item: null });
    };

    const handleProductClick = (itemId) => {
        setSelectedProductId(itemId);
        setDialogOpen(true);
    };

    const handleClose = () => {
        setDialogOpen(false);
        setSelectedProductId(null);
    };

    return (
        <>
            <Typography variant="body2" color="text.secondary">
                {quote && (
                    <>
                        <Divider sx={{ my: 3, borderColor: 'divider' }} />
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            {/* Hover Link */}
                            <Box>
                                {selectedItems.length > 0 && (
                                    <Tooltip
                                        title={
                                            <Box sx={{ maxWidth: 300 }}>
                                                <Typography variant="subtitle2">Selected Items</Typography>
                                                <Divider sx={{ my: 1 }} />
                                                {selectedItems.map((item) => (
                                                    <Box key={item.itemId} sx={{ mb: 1 }}>
                                                        <Typography variant="body2">
                                                            {item.title} - Qty: {item.quantity}
                                                        </Typography>
                                                    </Box>
                                                ))}
                                            </Box>
                                        }
                                        arrow
                                        placement="bottom-start"
                                    >
                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            sx={{ cursor: 'pointer', textDecoration: 'underline' }}
                                        >
                                            Cancellation Items
                                        </Typography>
                                    </Tooltip>
                                )}
                            </Box>

                            {/* Partial Cancel Button */}
                            {!isSuperAdmin && <Button
                                variant="contained"
                                color="primary"
                                onClick={cancelItems}
                                disabled={selectedItems.length <= 0 || isCancelling}
                            >
                                {isCancelling ? "Cancelling..." : "Cancel Items"}
                            </Button>}
                        </Box>

                        <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
                            <Table size="small" aria-label="invoice table">
                                <TableHead sx={{ bgcolor: 'action.hover' }}>
                                    <TableRow>
                                        {!isSuperAdmin && <TableCell sx={{ fontWeight: 'bold' }}>Select</TableCell>}
                                        <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Qty</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Unit Price (₹)</TableCell>
                                        <TableCell align="right" sx={{ fontWeight: 'bold' }}>Total (₹)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {quote.breakup?.map((item) => {
                                        const {
                                            title,
                                            price: { value: totalValue = "0" } = {},
                                            item: {
                                                price: { value: unitPriceValue = "0" } = {},
                                            } = {},
                                            "@ondc/org/item_quantity": { count: availableQuantity = "" } = {},
                                            "@ondc/org/item_id": itemId,
                                            "@ondc/org/title_type": titleType,
                                        } = item;

                                        const itemTotal = parseFloat(totalValue);
                                        const unitPrice = parseFloat(unitPriceValue);
                                        const canSelect = allowPartialCancel && titleType === "item" && itemTotal > 0;

                                        return (
                                            <TableRow key={itemId}>
                                                {!isSuperAdmin && <TableCell>
                                                    <Checkbox
                                                        checked={selectedItems.some((i) => i.itemId === itemId)}
                                                        onChange={(e) =>
                                                            handleCheckboxChange(
                                                                { itemId, title, availableQuantity },
                                                                e.target.checked
                                                            )
                                                        }
                                                        disabled={!canSelect}
                                                    />
                                                </TableCell>}
                                                {titleType === "item" && <TableCell><a
                                                    href="#"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        handleProductClick(itemId);
                                                    }}
                                                    style={{ color: "blue" }}
                                                >
                                                    {title}
                                                </a>
                                                </TableCell>}
                                                {titleType !== "item" && <TableCell>{title}</TableCell>}
                                                <TableCell align="right">{availableQuantity}</TableCell>
                                                <TableCell align="right">{unitPrice.toFixed(2)}</TableCell>
                                                <TableCell align="right">{itemTotal.toFixed(2)}</TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        {/* Product Details Dialog */}
                        {selectedProductId && (
                            <Dialog open={dialogOpen} onClose={handleClose} maxWidth="md" fullWidth>
                                <DialogTitle>
                                    Product Details
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
                                <DialogContent>
                                    <ViewProductDetails productId={selectedProductId} category={category} prodType="Item" />
                                </DialogContent>
                                <DialogActions></DialogActions>
                            </Dialog>
                        )}
                    </>
                )}
            </Typography>

            {/* Quantity Dialog */}
            <Dialog
                open={quantityDialog.open}
                onClose={() => setQuantityDialog({ open: false, item: null })}
                maxWidth="xs"
                fullWidth
            >
                <DialogTitle>Select Quantity for Cancellation</DialogTitle>
                <DialogContent>
                    <Typography variant="subtitle1" gutterBottom>
                        <strong>Item:</strong> {quantityDialog.item?.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        <strong>Ordered Quantity:</strong> {quantityDialog.item?.availableQuantity}
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{ textAlign: 'center', fontWeight: 'bold', mt: 2 }}
                    >
                        Cancel Quantity: {quantityDialog.item?.quantity || 1}
                    </Typography>

                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 1,
                            mt: 2,
                        }}
                    >
                        <Button
                            variant="outlined"
                            onClick={() =>
                                setQuantityDialog((prev) => ({
                                    ...prev,
                                    item: {
                                        ...prev.item,
                                        quantity: Math.max((prev.item?.quantity || 1) - 1, 1),
                                    },
                                }))
                            }
                            disabled={quantityDialog.item?.quantity === 1}
                        >
                            -
                        </Button>
                        <Typography
                            variant="h6"
                            sx={{
                                mx: 2,
                                textAlign: 'center',
                                width: 40,
                            }}
                        >
                            {quantityDialog.item?.quantity || 1}
                        </Typography>
                        <Button
                            variant="outlined"
                            onClick={() =>
                                setQuantityDialog((prev) => ({
                                    ...prev,
                                    item: {
                                        ...prev.item,
                                        quantity: Math.min(
                                            (prev.item?.quantity || 1) + 1,
                                            quantityDialog.item?.availableQuantity
                                        ),
                                    },
                                }))
                            }
                            disabled={
                                quantityDialog.item?.quantity === quantityDialog.item?.availableQuantity
                            }
                        >
                            +
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setQuantityDialog({ open: false, item: null })}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleQuantityConfirm} color="primary">
                        Add To Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default PartialCancellation;
