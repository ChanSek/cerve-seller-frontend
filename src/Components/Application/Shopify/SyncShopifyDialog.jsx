import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  IconButton,
  Typography,
  Box,
  Alert,
  CircularProgress,
  LinearProgress,
  FormControlLabel,
  Checkbox,
  TextField,
  Divider,
  Chip,
  List,
  ListItem,
  ListItemText
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningIcon from "@mui/icons-material/Warning";
import { syncShopifyProducts, getShopifyStores } from "../../../Api/shopify";
import cogoToast from "cogo-toast";

const SyncShopifyDialog = ({ open, onClose, refreshProducts, merchantId, storeId }) => {
  const [syncing, setSyncing] = useState(false);
  const [syncAll, setSyncAll] = useState(true);
  const [limit, setLimit] = useState(50);
  const [syncStatus, setSyncStatus] = useState(null);
  const [shopifyStores, setShopifyStores] = useState([]);
  const [loadingStores, setLoadingStores] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [hasLocalStoreId, setHasLocalStoreId] = useState(false);

  useEffect(() => {
    if (open) {
      // Check for store ID in localStorage
      const localStoreId = localStorage.getItem("shopify_store_id");
      setHasLocalStoreId(!!localStoreId);

      if (merchantId) {
        fetchShopifyStores();
      }
    }
  }, [open, merchantId]);

  const fetchShopifyStores = async () => {
    setLoadingStores(true);
    try {
      const stores = await getShopifyStores(merchantId);
      setShopifyStores(stores);

      // Auto-select first store if available
      if (stores && stores.length > 0) {
        setSelectedStore(stores[0]);
      }
    } catch (error) {
      console.error("Failed to fetch Shopify stores:", error);
      // If endpoint doesn't exist yet, we'll handle it gracefully
      setShopifyStores([]);
    } finally {
      setLoadingStores(false);
    }
  };

  const handleSync = async () => {
    // Check for shopifyStoreId from selected store or localStorage
    const shopifyStoreId = selectedStore?.shopifyStoreId || localStorage.getItem("shopify_store_id");

    if (!shopifyStoreId) {
      cogoToast.error("No Shopify store connected. Please connect a store first.");
      return;
    }

    setSyncing(true);
    setSyncStatus(null);

    try {

      const response = await syncShopifyProducts(shopifyStoreId, syncAll, limit);

      if (response.success) {
        const hasIssues = response.data.skippedProducts > 0 || response.data.failedProducts > 0;
        setSyncStatus({
          type: hasIssues ? "warning" : "success",
          message: `Successfully synced ${response.data.syncedProducts} out of ${response.data.totalProducts} products`,
          details: response.data
        });

        cogoToast.success(`Synced ${response.data.syncedProducts} products successfully!`);

        // Refresh products list if provided
        if (refreshProducts) {
          setTimeout(() => {
            refreshProducts();
          }, 1000);
        }

        // Show warnings if there were skipped or failed products
        if (response.data.skippedProducts > 0) {
          cogoToast.warn(`${response.data.skippedProducts} products were skipped`);
        }
        if (response.data.failedProducts > 0) {
          cogoToast.warn(`${response.data.failedProducts} products failed to sync`);
        }
      } else {
        throw new Error(response.error || "Sync failed");
      }
    } catch (error) {
      console.error("Product sync failed:", error);
      setSyncStatus({
        type: "error",
        message: error.message || "Failed to sync products",
        details: error
      });
      cogoToast.error("Failed to sync products from Shopify");
    } finally {
      setSyncing(false);
    }
  };

  const handleClose = () => {
    if (!syncing) {
      setSyncStatus(null);
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Sync from Shopify Store</Typography>
          <IconButton onClick={handleClose} size="small" disabled={syncing}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ pt: 2 }}>
          {loadingStores ? (
            <Box display="flex" justifyContent="center" alignItems="center" py={4}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading Shopify stores...</Typography>
            </Box>
          ) : shopifyStores.length === 0 && !hasLocalStoreId ? (
            <Alert severity="warning" sx={{ mb: 2 }}>
              No Shopify store connected. Please connect your Shopify store first using the "Connect Shopify Store" button.
            </Alert>
          ) : (
            <>
              {/* Connected Stores */}
              {shopifyStores.length > 0 ? (
                <>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Connected Shopify Stores
                    </Typography>
                    <List dense>
                      {shopifyStores.map((store) => (
                        <ListItem
                          key={store.shopifyStoreId}
                          selected={selectedStore?.shopifyStoreId === store.shopifyStoreId}
                          button
                          onClick={() => setSelectedStore(store)}
                        >
                          <ListItemText
                            primary={store.shopDomain}
                            secondary={`Connected on ${new Date(store.onboardedAt).toLocaleDateString()}`}
                          />
                          {store.isActive && (
                            <Chip label="Active" color="success" size="small" />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Box>

                  <Divider sx={{ my: 2 }} />
                </>
              ) : hasLocalStoreId ? (
                <>
                  <Alert severity="info" sx={{ mb: 2 }}>
                    <Typography variant="body2" gutterBottom>
                      Shopify Store Connected
                    </Typography>
                    <Typography variant="caption">
                      Store ID: {localStorage.getItem("shopify_store_id")}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip label="Active" color="success" size="small" />
                    </Box>
                  </Alert>
                  <Divider sx={{ my: 2 }} />
                </>
              ) : null}

              {/* Sync Options */}
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Sync Options
                </Typography>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={syncAll}
                      onChange={(e) => setSyncAll(e.target.checked)}
                      disabled={syncing}
                    />
                  }
                  label="Sync all products (uncheck for incremental sync)"
                />

                <TextField
                  fullWidth
                  type="number"
                  label="Products per sync"
                  value={limit}
                  onChange={(e) => setLimit(Math.min(250, Math.max(1, parseInt(e.target.value) || 50)))}
                  disabled={syncing}
                  helperText="Maximum 250 products per sync request"
                  sx={{ mt: 2 }}
                  inputProps={{ min: 1, max: 250 }}
                />
              </Box>
            </>
          )}

          {/* Sync Progress */}
          {syncing && (
            <Box sx={{ my: 3 }}>
              <Typography variant="body2" gutterBottom>
                Syncing products from Shopify...
              </Typography>
              <LinearProgress />
            </Box>
          )}

          {/* Sync Status */}
          {syncStatus && (
            <Box sx={{ mt: 3 }}>
              <Alert
                severity={syncStatus.type}
                icon={
                  syncStatus.type === "success" ? <CheckCircleIcon /> :
                  syncStatus.type === "warning" ? <WarningIcon /> : <ErrorIcon />
                }
              >
                <Typography variant="body2" gutterBottom>
                  {syncStatus.message}
                </Typography>

                {syncStatus.details && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="caption" display="block">
                      Total Products: {syncStatus.details.totalProducts}
                    </Typography>
                    <Typography variant="caption" display="block">
                      Synced: {syncStatus.details.syncedProducts}
                    </Typography>
                    {syncStatus.details.skippedProducts > 0 && (
                      <Typography variant="caption" display="block" color="warning.main">
                        Skipped: {syncStatus.details.skippedProducts}
                      </Typography>
                    )}
                    {syncStatus.details.failedProducts > 0 && (
                      <Typography variant="caption" display="block" color="error">
                        Failed: {syncStatus.details.failedProducts}
                      </Typography>
                    )}
                    {syncStatus.details.errors && syncStatus.details.errors.length > 0 && (
                      <Box sx={{ mt: 1, maxHeight: 200, overflow: "auto" }}>
                        <Typography variant="caption" color="error">
                          Issues:
                        </Typography>
                        <ul style={{ margin: 0, paddingLeft: 20 }}>
                          {syncStatus.details.errors.map((error, idx) => (
                            <li key={idx}>
                              <Typography variant="caption" color="text.secondary">
                                {error}
                              </Typography>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}
                  </Box>
                )}
              </Alert>
            </Box>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" disabled={syncing}>
          {syncStatus ? "Close" : "Cancel"}
        </Button>
        <Button
          onClick={handleSync}
          variant="contained"
          disabled={syncing || (shopifyStores.length === 0 && !hasLocalStoreId)}
          startIcon={syncing ? <CircularProgress size={20} /> : <SyncIcon />}
        >
          {syncing ? "Syncing..." : "Sync Products"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SyncShopifyDialog;
