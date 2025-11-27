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
      const code = searchParams.get("code");
      const shop = searchParams.get("shop");
      const hmac = searchParams.get("hmac");
      const timestamp = searchParams.get("timestamp");
      const state = searchParams.get("state");
      const accessToken = searchParams.get("accessToken");
      const scope = searchParams.get("scope");

      // Validate required parameters
      // Backend sends either 'code' (for manual flow) or 'accessToken' (for automatic flow)
      if (!shop || (!code && !accessToken)) {
        throw new Error("Missing required authorization parameters");
      }

      setMessage("Completing Shopify store connection...");

      // Get merchant and store IDs from localStorage
      const merchantId = localStorage.getItem("shopify_merchant_id") || localStorage.getItem("organization_id");
      const storeId = localStorage.getItem("shopify_store_id") || localStorage.getItem("store_id");

      if (!merchantId || !storeId) {
        throw new Error("Missing merchant or store information");
      }

      // Backend automatically exchanges the code for an access token and provides it in URL params
      if (accessToken) {
        // Complete onboarding with the provided access token
        const response = await completeShopifyOnboarding(
          shop,
          accessToken,
          scope || "read_products,write_products",
          merchantId,
          storeId
        );

        if (response && response.success && response.data?.shopifyStoreId) {
          // Store the Shopify store ID for future sync operations
          localStorage.setItem("shopify_store_id", response.data.shopifyStoreId);

          // Clean up temporary storage
          localStorage.removeItem("shopify_merchant_id");

          setStatus("success");
          setMessage("Shopify store connected successfully!");
          cogoToast.success("Shopify store connected! You can now sync products.");

          // Redirect to inventory page after 2 seconds
          setTimeout(() => {
            navigate("/application/inventory");
          }, 2000);
        } else {
          throw new Error("Failed to complete store connection");
        }
      } else {
        // If no access token in params, the backend should have already handled the callback
        // Just show success and redirect
        setStatus("success");
        setMessage("Shopify authorization received. Completing setup...");

        cogoToast.info("Shopify authorization successful. Please sync your products.");

        // Redirect to inventory page after 2 seconds
        setTimeout(() => {
          navigate("/application/inventory");
        }, 2000);
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
