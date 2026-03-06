import React, { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Typography,
  Box,
  Alert
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { completeWooCommerceOnboarding } from "../../../Api/woocommerce";
import cogoToast from "cogo-toast";

const ConnectWooCommerceDialog = ({ open, onClose }) => {
  const [storeUrl, setStoreUrl] = useState("");
  const [consumerKey, setConsumerKey] = useState("");
  const [consumerSecret, setConsumerSecret] = useState("");
  const [error, setError] = useState("");
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    // Validate store URL
    if (!storeUrl || storeUrl.trim() === "") {
      setError("Please enter your WooCommerce store URL");
      return;
    }

    // Validate consumer key
    if (!consumerKey || consumerKey.trim() === "") {
      setError("Please enter your Consumer Key");
      return;
    }

    // Validate consumer secret
    if (!consumerSecret || consumerSecret.trim() === "") {
      setError("Please enter your Consumer Secret");
      return;
    }

    // Clean up store URL - remove protocol and trailing slashes
    let cleanStoreUrl = storeUrl
      .trim()
      .replace(/^https?:\/\//, "")
      .replace(/\/+$/, "")
      .toLowerCase();

    // Basic URL validation
    if (!/^[a-z0-9]+([\-\.][a-z0-9]+)*\.[a-z]{2,}(:[0-9]+)?(\/.*)?$/.test(cleanStoreUrl)) {
      setError("Invalid store URL. Please enter a valid domain (e.g., mystore.com)");
      return;
    }

    try {
      setConnecting(true);

      // Get merchant and store info from localStorage
      const merchantId = localStorage.getItem("organization_id");
      const storeId = localStorage.getItem("store_id");

      if (!merchantId) {
        setError("Merchant information not found. Please try again.");
        return;
      }

      // Complete onboarding with WooCommerce credentials
      const response = await completeWooCommerceOnboarding(
        cleanStoreUrl,
        consumerKey.trim(),
        consumerSecret.trim(),
        merchantId,
        storeId
      );

      if (response.success) {
        // Store WooCommerce store ID for future operations
        if (response.data?.wooCommerceStoreId) {
          localStorage.setItem("woocommerce_store_id", response.data.wooCommerceStoreId);
        }

        cogoToast.success("WooCommerce store connected successfully!");
        handleClose();
      } else {
        throw new Error(response.error || "Failed to connect store");
      }
    } catch (err) {
      console.error("Failed to connect WooCommerce store:", err);
      cogoToast.error("Failed to connect to WooCommerce");
      setError(err.message || "Failed to connect store. Please check your credentials and try again.");
    } finally {
      setConnecting(false);
    }
  };

  const handleClose = () => {
    setStoreUrl("");
    setConsumerKey("");
    setConsumerSecret("");
    setError("");
    setConnecting(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Connect WooCommerce Store</Typography>
          <IconButton onClick={handleClose} size="small" disabled={connecting}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Enter your WooCommerce store URL and REST API credentials to connect and sync your products.
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="WooCommerce Store URL"
            placeholder="mystore.com"
            value={storeUrl}
            onChange={(e) => {
              setStoreUrl(e.target.value);
              setError("");
            }}
            variant="outlined"
            autoFocus
            disabled={connecting}
            sx={{ mb: 2 }}
            helperText="Enter your store URL (e.g., mystore.com)"
          />

          <TextField
            fullWidth
            label="Consumer Key"
            placeholder="ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={consumerKey}
            onChange={(e) => {
              setConsumerKey(e.target.value);
              setError("");
            }}
            variant="outlined"
            disabled={connecting}
            sx={{ mb: 2 }}
            helperText="Found in WooCommerce > Settings > Advanced > REST API"
          />

          <TextField
            fullWidth
            label="Consumer Secret"
            placeholder="cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
            value={consumerSecret}
            onChange={(e) => {
              setConsumerSecret(e.target.value);
              setError("");
            }}
            variant="outlined"
            type="password"
            disabled={connecting}
            sx={{ mb: 2 }}
            helperText="Keep this secret - it provides access to your store"
          />

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              How to get your API credentials:
            </Typography>
            <Typography variant="caption" component="ol" sx={{ pl: 2, m: 0 }}>
              <li>Go to your WordPress admin dashboard</li>
              <li>Navigate to WooCommerce → Settings → Advanced → REST API</li>
              <li>Click "Add key" and create a new key with Read/Write permissions</li>
              <li>Copy the Consumer Key and Consumer Secret</li>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={connecting}>
          Cancel
        </Button>
        <Button
          onClick={handleConnect}
          variant="contained"
          disabled={!storeUrl || !consumerKey || !consumerSecret || connecting}
        >
          {connecting ? "Connecting..." : "Connect to WooCommerce"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectWooCommerceDialog;
