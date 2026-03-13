import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Box, CircularProgress, Typography, Alert, Container } from "@mui/material";
import { completeShopifyOnboarding } from "../../../Api/shopify";
import cogoToast from "cogo-toast";

/**
 * ShopifyCallback Component
 *
 * Handles the OAuth callback from Shopify after user authorization.
 * This page is redirected to by Shopify with authorization code.
 *
 * Expected URL parameters:
 * - code: Authorization code from Shopify
 * - shop: Shopify store domain
 * - hmac: HMAC signature for validation
 * - timestamp: Request timestamp
 * - state: State parameter for CSRF protection
 */
const ShopifyCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing"); // processing, success, error
  const [message, setMessage] = useState("Connecting to Shopify...");

  useEffect(() => {
    handleCallback();
  }, []);

  const handleCallback = async () => {
    try {
      // Get URL parameters from backend redirect
      const shop = searchParams.get("shop");
      const sessionCode = searchParams.get("sessionCode");

      // Strip params from browser history immediately — sessionCode is single-use but shouldn't linger
      window.history.replaceState({}, document.title, window.location.pathname);

      // Validate required parameters
      if (!shop || !sessionCode) {
        throw new Error("Missing required authorization parameters");
      }

      setMessage("Completing Shopify store connection...");

      // Get merchant and store IDs from localStorage
      const merchantId = localStorage.getItem("shopify_merchant_id") || localStorage.getItem("organization_id");
      const storeId = localStorage.getItem("shopify_store_id") || localStorage.getItem("store_id");

      if (!merchantId || !storeId) {
        throw new Error("Missing merchant or store information");
      }

      // Exchange sessionCode for completed onboarding — the access token stays server-side
      const response = await completeShopifyOnboarding(sessionCode, merchantId, storeId);

      if (response && response.success && response.data?.shopifyStoreId) {
        // Store the Shopify store ID for future sync operations
        localStorage.setItem("shopify_store_id", response.data.shopifyStoreId);

        // Clean up temporary storage
        localStorage.removeItem("shopify_merchant_id");

        setStatus("success");
        setMessage("Shopify store connected successfully!");
        cogoToast.success("Shopify store connected! You can now sync products.");

        setTimeout(() => {
          navigate("/application/inventory");
        }, 2000);
      } else {
        throw new Error("Failed to complete store connection");
      }
    } catch (error) {
      console.error("Shopify callback error:", error);
      setStatus("error");
      setMessage(error.message || "Failed to connect Shopify store");
      cogoToast.error("Failed to connect Shopify store");

      // Redirect to inventory page after 5 seconds even on error
      setTimeout(() => {
        navigate("/application/inventory");
      }, 5000);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        {status === "processing" && (
          <>
            <CircularProgress size={60} />
            <Typography variant="h6" sx={{ mt: 3 }}>
              {message}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Please wait while we connect your Shopify store...
            </Typography>
          </>
        )}

        {status === "success" && (
          <Alert severity="success" sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              {message}
            </Typography>
            <Typography variant="body2">
              Redirecting to inventory page...
            </Typography>
          </Alert>
        )}

        {status === "error" && (
          <Alert severity="error" sx={{ width: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Connection Failed
            </Typography>
            <Typography variant="body2">
              {message}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Redirecting to inventory page...
            </Typography>
          </Alert>
        )}
      </Box>
    </Container>
  );
};

export default ShopifyCallback;
