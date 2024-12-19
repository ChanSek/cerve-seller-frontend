import React, { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import {
  Button,
  FormControl,
  MenuItem,
  Modal,
  Select,
  TextField,
  Checkbox,
} from "@mui/material";
import { CANCELATION_REASONS } from "./cancelation-reasons";
import { getCall, postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";


const AddCustomizationGroup = (props) => {
  const { showModal, handleCloseModal, data, onOrderUpdate } = props;
  const [quantity, setQuantity] = useState(0);
  const [reason, setReason] = useState();

  useEffect(() => {
    setQuantity(data?.item?.quantity);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.data]);

  const cancelOrder = async (order_uuid) => {
    const url = `/api/v1/seller/order/${order_uuid}/item/cancel`;
    const resp = await postCall(`/api/v1/seller/${data?.order_id}/item/cancel`, {
      cancellation_reason_id: reason,
      id: data?.item.id,
      quantity: quantity,
    });
    handleCloseModal();
    await new Promise(resolve => setTimeout(resolve, 1000));
    onOrderUpdate();
    cogoToast.success("Product cancelled successfully!");
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
            <div className="flex space-between">
              <div className="mt-3 mr-3">Quantity to cancel:</div>
              <div>
                <TextField
                  value={quantity}
                  type="number"
                  onChange={(e) => {
                    let v = e.target.value;
                    if (!v) setQuantity("");
                    if (1 <= v && v <= data?.item?.quantity) {
                      setQuantity(v);
                    }
                  }}
                  InputProps={{
                    inputProps: {
                      max: data?.item?.quantity,
                      min: 1,
                    },
                  }}
                  style={{ width: 80 }}
                />
              </div>
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
              disabled={!quantity || !reason}
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

export default AddCustomizationGroup;
