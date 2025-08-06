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
import AppErrorSnackbar from "../../../utils/AppErrorSnackbar";
import ConfirmationDialog from "../../Shared/ConfirmationDialog"; // <== NEW IMPORT

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderFulfilment, setOrderFulfilment] = useState(null);
  const [loading, setLoading] = useState({});
  const [deliveryData, setDeliveryData] = useState(null);
  const [rtoData, setRtoData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [allowPartialCancel, setAllowPartialCancel] = useState(false);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState("");
  const [pendingStatusData, setPendingStatusData] = useState(null);

  const fulfillments = order?.fulfillments;
  const [hasFetchedFulfillment, setHasFetchedFulfillment] = useState(false);
  const mainDelivery = fulfillments?.find((f) => f.type === "Delivery");
  const userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;
  const isSuperAdmin = userRole === "Super Admin";
  const [error, setError] = useState(null);

  const showError = (msg) => setError(msg);
  const hideError = () => setError(null);

  useEffect(() => {
    if (id) fetchOrder();
  }, [id]);

  useEffect(() => {
    const checkFulfillmentAndFetch = async () => {
      if (order?.fulfillments) {
        const fulfillmentState = getFulfillmentData(order.fulfillments, "Delivery")?.state?.descriptor?.code;
        setAllowPartialCancel(["Pending"].includes(fulfillmentState));
      } else {
        setAllowPartialCancel(false);
      }

      if (order?.state !== "Created" && order?.state !== "Accepted") {
        try {
          const resp = await getCall(`/api/v1/seller/order/${id}/fulfilment`);
          setOrderFulfilment(resp.data);
        } catch (err) {
          console.error("Failed to fetch fulfilment:", err);
        }
      }
    };

    if (order) {
      checkFulfillmentAndFetch();
    }
  }, [order, hasFetchedFulfillment]);


  useEffect(() => {
    if (order?.fulfillments) {
      const fulfillmentState = getFulfillmentData(order.fulfillments, "Delivery")?.state?.descriptor?.code;
      setAllowPartialCancel(["Pending"].includes(fulfillmentState));
    } else {
      setAllowPartialCancel(false);
    }
  }, [order]);

  const fetchOrder = async () => {
    try {
      const resp = await getCall(`/api/v1/seller/${id}/order/details`);
      setOrder(resp.data);

      const deliveryInfo = getFulfillmentData(resp.data.fulfillments, "Delivery");
      const rtoInfo = getFulfillmentData(resp.data.fulfillments, "RTO");

      setDeliveryData(deliveryInfo);
      setRtoData(rtoInfo);
    } catch (error) {
      cogoToast.error("Failed to fetch order details.");
    }
  };

  const handleAccept = (orderId, status) => {
    setConfirmMessage(
      <>
        Are you sure you want to update the order status to{" "}
        <strong style={{ color: "#1976d2" }}>{status}</strong>?
      </>
    );
    setPendingStatusData({ orderId, status });
    setShowConfirmDialog(true);
  };


  const proceedWithStatusUpdate = async () => {
    setShowConfirmDialog(false);

    const { orderId, status } = pendingStatusData;
    if (!orderId || !status) return;

    setLoading((prev) => ({ ...prev, accept_order_loading: true }));

    try {
      let resp;
      if (status === "Accept") {
        resp = await postCall(`/api/v1/seller/order/${orderId}/status`, {
          status: "Accepted",
        });
      } else if (status === "Packed" || status === "Request-Order-Pickup") {
        const payload = {
          fulfillmentId: "f1",
          fulfillmentType: "Delivery",
          newState: status,
        };
        const url = `/api/v1/seller/fulfillment/${orderId}/state`;
        resp = await updateFulfillmentState(url, payload);
      }

      if (resp?.status === 200) {
        cogoToast.success("Order status updated successfully");
        await fetchOrder();
      } else if (resp?.message) {
        cogoToast.error(resp.message, { hideAfter: 10 });
      }
    } catch (error) {
      cogoToast.error("Failed to update status.");
    } finally {
      setLoading((prev) => ({ ...prev, accept_order_loading: false }));
      setPendingStatusData(null);
    }
  };


  const updateFulfillmentState = async (url, payload) => {
    let response = {};
    try {
      response = await postCall(url, payload);
    } catch (error) {
      console.error("Error updating fulfillment state:", error);
    }
    return response;
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
    <div className="container mx-auto">
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
          isSuperAdmin={isSuperAdmin}
          orderFulfilment={orderFulfilment}
        />

        <InvoiceCard billing={order?.billing} mainDelivery={mainDelivery} />

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

        <ConfirmationDialog
          open={showConfirmDialog}
          title="Confirm Order Status"
          message={confirmMessage}
          onConfirm={proceedWithStatusUpdate}
          onCancel={() => setShowConfirmDialog(false)}
        />
      </Box>
    </div>
  );
};

export default OrderDetails;
