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
import { initiateShopifyOAuth } from "../../../Api/shopify";
import cogoToast from "cogo-toast";

const ConnectShopifyDialog = ({ open, onClose }) => {
  const [shopName, setShopName] = useState("");
  const [error, setError] = useState("");

  const handleConnect = () => {
    // Validate shop name
    if (!shopName || shopName.trim() === "") {
      setError("Please enter your Shopify store name");
      return;
    }

    // Remove any .myshopify.com if user entered it
    const cleanShopName = shopName
      .replace(".myshopify.com", "")
      .trim()
      .toLowerCase();

    // Basic validation
    if (!/^[a-z0-9-]+$/.test(cleanShopName)) {
      setError("Invalid shop name. Use only lowercase letters, numbers, and hyphens");
      return;
    }

    try {
      // Store merchant and store info in localStorage for callback handling
      const merchantId = localStorage.getItem("organization_id");
      const storeId = localStorage.getItem("store_id");

      if (merchantId) localStorage.setItem("shopify_merchant_id", merchantId);
      if (storeId) localStorage.setItem("shopify_store_id", storeId);

      // Initiate OAuth flow
      initiateShopifyOAuth(cleanShopName);

      // Close dialog - user will be redirected to Shopify
      onClose();
    } catch (err) {
      console.error("Failed to initiate Shopify connection:", err);
      cogoToast.error("Failed to connect to Shopify");
      setError("Failed to initiate connection. Please try again.");
    }
  };

  const handleClose = () => {
    setShopName("");
    setError("");
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
          <Typography variant="h6">Connect Shopify Store</Typography>
          <IconButton onClick={handleClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Alert severity="info" sx={{ mb: 3 }}>
            Enter your Shopify store name to connect and sync your products. You'll be redirected to Shopify to authorize the connection.
          </Alert>

          <TextField
            fullWidth
            label="Shopify Store Name"
            placeholder="mystore"
            value={shopName}
            onChange={(e) => {
              setShopName(e.target.value);
              setError("");
            }}
            error={!!error}
            helperText={error || "Enter your store name (without .myshopify.com)"}
            variant="outlined"
            autoFocus
            InputProps={{
              endAdornment: (
                <Typography variant="body2" color="text.secondary">
                  .myshopify.com
                </Typography>
              )
            }}
          />

          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Example: If your store URL is <strong>mystore.myshopify.com</strong>, enter <strong>mystore</strong>
            </Typography>
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConnect}
          variant="contained"
          disabled={!shopName}
        >
          Connect to Shopify
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConnectShopifyDialog;
