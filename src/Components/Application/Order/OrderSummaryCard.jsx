import React from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import FulfilmentState from "./FulfilmentState";
import PartialCancellation from "./PartialCancellation";
import { convertDateInStandardFormat } from "../../../utils/formatting/date";

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
  stateTransition,
  mainDelivery,
  onAccept,
  onCancel,
  onUpdate,
  loading,
  allowPartialCancel,
  fetchOrder,
}) => (
  <Grid container spacing={3} mb={2}>
    {/* Order Summary Card (Left 50%) */}
    <Grid item xs={12} md={5}>
      <Card sx={{ height: "100%" }}>
        <CardContent>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">Order Summary</Typography>
            <Stack direction="row" spacing={1}>
              {/* Accept Button — ONLY if state is 'Created' */}
              {order?.state === "Created" && (
                <Button
                  variant="contained"
                  onClick={() => onAccept(order?._id)}
                  disabled={loading.accept_order_loading}
                >
                  {loading.accept_order_loading
                    ? <CircularProgress size={18} sx={{ color: "white" }} />
                    : "Accept"}
                </Button>
              )}
              {/* Update Status — if NOT 'Created' or 'Completed' */}
              {(
                order?.state !== "Created" &&
                order?.state !== "Completed" &&
                order?.state !== "Cancelled"
              ) || order?.fulfillments?.[order.fulfillments.length - 1]?.state?.descriptor?.code === 'RTO-Initiated' ? (
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => onUpdate(order)}
                  disabled={loading.update_order_loading}
                >
                  {loading.update_order_loading
                    ? <CircularProgress size={18} sx={{ color: "white" }} />
                    : "Update Status"}
                </Button>
              ) : null}
              {/* Cancel — unless already cancelled */}
              {order?.state !== "Completed" && order?.state !== "Cancelled" && (
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
          </Stack>
          {/* Order Summary Info */}
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
            value={<FulfilmentState data={stateTransition} currentState={mainDelivery?.state?.descriptor?.code} />}
          />
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
            onOrderUpdate={fetchOrder}
          />
        </CardContent>
      </Card>
    </Grid>
  </Grid>
);

export default OrderSummaryCard;
