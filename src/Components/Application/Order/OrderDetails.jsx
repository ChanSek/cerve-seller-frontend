import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Button,
} from "@mui/material";
import { getCall, postCall } from "../../../Api/axios";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import UpdateOrderStatusModal from "./UpdateOrderStatusModal";
import { getFulfillmentData } from "../../../utils/orders";
import cogoToast from "cogo-toast";
import CancelModal from "./CancelModal";
import InvoiceCard from "./InvoiceCard";
import OrderSummaryCard from "./OrderSummaryCard";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState({});
  const [deliveryData, setDeliveryData] = useState(null);
  const [rtoData, setRtoData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allowPartialCancel, setAllowPartialCancel] = useState(false);

  const fulfillments = order?.fulfillments;
  const mainDelivery = fulfillments?.find((f) => f.type === "Delivery");

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    if (order?.fulfillments) {
      const fulfillmentState = getFulfillmentData(order.fulfillments, "Delivery")?.state?.descriptor?.code;
      setAllowPartialCancel(["Pending", "Packed", "Agent-assigned"].includes(fulfillmentState));
    } else {
      setAllowPartialCancel(false); // Fallback for undefined or invalid fulfillments
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const resp = await getCall(`/api/v1/seller/${id}/order`);
      setOrder(resp.data);

      const deliveryInfo = getFulfillmentData(resp.data.fulfillments, "Delivery");
      const rtoInfo = getFulfillmentData(resp.data.fulfillments, "RTO");

      setDeliveryData(deliveryInfo);
      setRtoData(rtoInfo);
    } catch (error) {
      cogoToast.error("Failed to fetch order details.");
    }
  };

  const handleAccept = async (orderId) => {
    setLoading((prev) => ({ ...prev, accept_order_loading: true }));
    try {
      await postCall(`/api/v1/seller/order/${orderId}/status`, { status: "Accepted" });
      await fetchOrder();
      cogoToast.success("Order accepted successfully");
    } finally {
      setLoading((prev) => ({ ...prev, accept_order_loading: false }));
    }
  };

  const handleCancel = () => setShowCancelModal(true);
  const handleUpdate = () => setShowUpdateModal(true);

  if (!order) {
    return (
      <Box p={4} display="flex" justifyContent="center" alignItems="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={4}>
      <BackNavigationButton onClick={() => navigate("/application/orders")} />

      <OrderSummaryCard
        allowPartialCancel={allowPartialCancel}
        order={order}
        quote={order?.quote}
        stateTransition={order?.stateTransition}
        mainDelivery={mainDelivery}
        onAccept={handleAccept}
        onCancel={handleCancel}
        onUpdate={handleUpdate}
        loading={loading}
        fetchOrder={fetchOrder}
      />

      <InvoiceCard
        billing={order?.billing}
        mainDelivery={mainDelivery}
      />

      <CancelModal
        showModal={showCancelModal}
        handleCloseModal={() => setShowCancelModal(false)}
        onOrderCancel={fetchOrder}
        data={{ order_id: order?._id }}
      />

      <UpdateOrderStatusModal
        showModal={showUpdateModal}
        handleCloseModal={() => setShowUpdateModal(false)}
        deliveryData={deliveryData}
        order={order}
        rtoData={rtoData}
        setLoading={setLoading}
        loading={loading}
        onOrderUpdate={fetchOrder}
      />
    </Box>
  );
};

export default OrderDetails;
