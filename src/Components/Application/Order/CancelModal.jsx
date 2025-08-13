import React, { useState } from "react";
import {
  Button,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Select,
  InputLabel,
  FormControl,
  CircularProgress,
} from "@mui/material";
import { CANCELATION_REASONS } from "./order-cancelation-reason";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";

const CancelModal = (props) => {
  const { showModal, handleCloseModal, data, onOrderCancel } = props;
  const [reason, setReason] = useState();
  const [loading, setLoading] = useState(false); // ← add loading state

  const cancelOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/v1/seller/order/${data?.order_id}/cancel`;
      await postCall(url, { cancellation_reason_id: reason });
      cogoToast.success("Order cancelled successfully!");
      handleCloseModal();
      await new Promise((resolve) => setTimeout(resolve, 500));
      onOrderCancel();
    } catch (error) {
      cogoToast.error("Failed to cancel the order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={showModal} onClose={handleCloseModal} maxWidth="xs" fullWidth>
      <DialogTitle>Cancel Order</DialogTitle>
      <DialogContent>
        <div className="mt-2">
          <p><b>{data?.title}</b></p>
          <div className="mt-4">
            <FormControl fullWidth size="small">
              <InputLabel id="cancel-reason-label">Reason</InputLabel>
              <Select
                labelId="cancel-reason-label"
                value={reason}
                label="reason"
                onChange={(e) => setReason(e.target.value)}
                disabled={loading}
              >
                {CANCELATION_REASONS.map((r) => (
                  <MenuItem key={r.key} value={r.key}>
                    {r.value}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
        </div>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          color="primary"
          onClick={cancelOrder}
          disabled={!reason || loading}
        >
          {loading ? (
            <CircularProgress size={20} color="inherit" />
          ) : (
            "Cancel Order"
          )}
        </Button>
        <Button onClick={handleCloseModal} color="primary" disabled={loading}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CancelModal;
