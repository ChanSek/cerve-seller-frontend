import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Tooltip,
  Link,
  Box
} from "@mui/material";
import PartialCancellation from "./PartialCancellation";
import { convertDateInStandardFormat } from "../../../utils/formatting/date";
import LogisticUpdates from "./LogisticUpdates";

const InfoRow = ({ label, value }) => (
  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
    <Typography variant="body2" fontWeight={500} sx={{ minWidth: 160, color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography variant="body2" fontWeight={400} sx={{ textAlign: "right", flex: 1 }}>
      {value || "-"}
    </Typography>
  </Stack>
);

const OrderSummaryCard = ({
  order,
  quote,
  category,
  stateTransition,
  mainDelivery,
  onAccept,
  onCancel,
  onUpdate,
  loading,
  allowPartialCancel,
  fetchOrder,
  isSuperAdmin,
  orderFulfilment
}) => {

  const lastFulfillment = order?.fulfillments?.length
    ? order.fulfillments[order.fulfillments.length - 1]
    : null;

  const isCancellable =
    order?.state !== "Completed" &&
    order?.state !== "Cancelled" &&
    lastFulfillment?.state?.descriptor?.code !== "Out-for-delivery";

  return (
    <Grid container spacing={3} mb={2}>
      {/* Order Summary Card (Left 50%) */}
      <Grid item xs={12} md={5}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Order Summary</Typography>
              {!isSuperAdmin && (
                <Stack direction="row" spacing={1}>
                  {order?.state === "Created" && (
                    <Button
                      variant="contained"
                      onClick={() => onAccept(order?.orderId, 'Accept')}
                      disabled={loading.accept_order_loading}
                    >
                      {loading.accept_order_loading
                        ? <CircularProgress size={18} sx={{ color: "white" }} />
                        : "Accept"}
                    </Button>
                  )}

                  {order?.state === "Accepted" && (
                    <Button
                      variant="contained"
                      onClick={() => onAccept(order?.orderId, 'Packed')}
                      disabled={loading.accept_order_loading}
                    >
                      {loading.accept_order_loading
                        ? <CircularProgress size={18} sx={{ color: "white" }} />
                        : "Packed"}
                    </Button>
                  )}

                  {order?.state === "In-progress" &&
                    !orderFulfilment?.awbNumber &&
                    !orderFulfilment?.sfxOrderId &&
                    lastFulfillment?.state?.descriptor?.code === "Packed" && (
                      <Button
                        variant="contained"
                        onClick={() => onAccept(order?.orderId, 'Request-Order-Pickup')}
                        disabled={loading.accept_order_loading}
                      >
                        {loading.accept_order_loading
                          ? <CircularProgress size={18} sx={{ color: "white" }} />
                          : "Request Pickup"}
                      </Button>
                    )}

                  {/* Cancel Button */}
                  {isCancellable && (
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => onCancel(order?._id)}
                      disabled={loading.cancel_order_loading}
                    >
                      {loading.cancel_order_loading
                        ? <CircularProgress size={18} sx={{ color: "white" }} />
                        : "Cancel"}
                    </Button>
                  )}
                </Stack>
              )}
            </Stack>

            {/* Order Details */}
            <InfoRow
              label="Order ID"
              value={<Typography fontWeight={600} color="primary.main">{order?.orderId}</Typography>}
            />
            <InfoRow label="Transaction ID" value={order?.transactionId} />
            <InfoRow label="Created On" value={convertDateInStandardFormat(order?.createdAt)} />
            <InfoRow label="Modified On" value={convertDateInStandardFormat(order?.updatedAt)} />
            <InfoRow
              label="Order Status"
              value={<Typography fontWeight={500} color="success.main">{order?.state}</Typography>}
            />
            <InfoRow
              label="Delivery State"
              value={<LogisticUpdates trackingDetails={orderFulfilment?.trackingDetails} statusDisplay={orderFulfilment?.statusDisplay} />}
            />

            {/* Shipment Tracking */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ minWidth: 160, color: "text.secondary" }}
              >
                Track Shipment
              </Typography>
              {orderFulfilment?.awbNumber || orderFulfilment?.sfxOrderId ? (
                orderFulfilment?.trackingUrl ? (
                  <Tooltip title="Click on Shipment Number to track">
                    <Link
                      href={orderFulfilment.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      underline="hover"
                      variant="body2"
                      sx={{
                        cursor: "pointer",
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {orderFulfilment.awbNumber || orderFulfilment.sfxOrderId}
                    </Link>
                  </Tooltip>
                ) : (
                  <Tooltip title="Generated Logistic Shipment Number">
                    <Typography
                      variant="body2"
                      sx={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {orderFulfilment.awbNumber || orderFulfilment.sfxOrderId}
                    </Typography>
                  </Tooltip>
                )
              ) : (
                <Typography variant="body2" color="text.disabled">—</Typography>
              )}
            </Box>

            <InfoRow label="Payment Method" value={order?.payment?.type} />
            <InfoRow label="Buyer Name" value={order?.billing?.name} />
          </CardContent>
        </Card>
      </Grid>

      {/* Quotation Details Card (Right 50%) */}
      <Grid item xs={12} md={7}>
        <Card sx={{ height: "100%" }}>
          <CardContent>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="h6">Quotation Details</Typography>
              <Typography variant="h6" color="primary">
                ₹ {parseFloat(quote?.price?.value || "0").toFixed(2)}
              </Typography>
            </Stack>
            <PartialCancellation
              orderId={order?.orderId}
              allowPartialCancel={allowPartialCancel}
              quote={quote}
              category={category}
              onOrderUpdate={fetchOrder}
              isSuperAdmin={isSuperAdmin}
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OrderSummaryCard;
