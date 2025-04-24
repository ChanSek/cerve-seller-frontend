import React, { useState } from "react";
import {
  Button,
  MenuItem,
  Modal,
  Select,
} from "@mui/material";
import { CANCELATION_REASONS } from "./order-cancelation-reason";
import { postCall } from "../../../Api/axios";
import { toast } from "react-toastify";

const CancelOrderModal = (props) => {
  const { showModal, handleCloseModal, data, onOrderCancel } = props;
  const [reason, setReason] = useState();

  const cancelOrder = async () => {
    const url = `/api/v1/seller/order/${data?.order_id}/cancel`;
    await postCall(url, { cancellation_reason_id: reason });
    toast.success("Order cancelled successfully!");
    handleCloseModal();
    await new Promise(resolve => setTimeout(resolve, 500));
    onOrderCancel();
  };

  return (
    <div>
      <Modal
        open={showModal}
        onClose={() => {
          handleCloseModal();
        }}
        width={100}
      >
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "24px 40px",
            borderRadius: 20,
          }}
        >
          <p className="font-semibold text-xl" style={{ marginBottom: 10 }}>
            Cancel Order
          </p>

          <div>
            <div className="mt-5">
              <b>{data?.title}</b>
            </div>
            <div className="flex justify-between mt-5">
              <div className="mt-3 mr-3">Reason:</div>
              <Select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                style={{ width: 400 }}
              >
                {CANCELATION_REASONS.map((r) => {
                  return <MenuItem value={r.key}>{r.value}</MenuItem>;
                })}
              </Select>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              variant="outlined"
              color="primary"
              onClick={cancelOrder}
              disabled={!reason}
            >
              Cancel Order
            </Button>
            <Button
              sx={{ marginLeft: 2 }}
              color="primary"
              onClick={() => {
                handleCloseModal();
              }}
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CancelOrderModal;
