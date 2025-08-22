import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
  Container,
  Divider,
} from "@mui/material";
import { AddCircleOutline, Edit, Close } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { getCall } from "../../../Api/axios";
import useStyles from "./style";
import clsx from "clsx";
import StoreDetails from "./StoreDetails";

const categoryLabelMap = {
  RET10: "Grocery",
  RET12: "Fashion",
  RET14: "Electronics",
  RET15: "Appliances",
  RET16: "Home & Kitchen",
  RET18: "Health & Wellness",
};

const categoryColorMap = {
  RET10: "#ff7043",
  RET12: "#7e57c2",
  RET14: "#42a5f5",
  RET15: "#8d6e63",
  RET16: "#ffca28",
  RET18: "#66bb6a",
};

// 🔹 Group by city + state + area_code
const groupStoresByCityStateAndArea = (stores) => {
  return stores.reduce((acc, store) => {
    const { city, state, area_code } = store.address || {};
    const key = `${city},${state}-${area_code}`;
    if (!acc[key]) {
      acc[key] = {
        city,
        state,
        area_code,
        stores: [],
      };
    }
    acc[key].stores.push(store);
    return acc;
  }, {});
};

const MallGrid = ({ handleClick }) => {
  const { id: merchantId } = useParams();
  const [groupedStores, setGroupedStores] = useState({});
  const [storeName, setStoreName] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const classes = useStyles();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getCall(
          `/api/v1/seller/merchantId/${merchantId}/stores`
        );
        const data = res?.data || {};
        setStoreName(data.storeName || "");
        setGroupedStores(
          groupStoresByCityStateAndArea(data.storesDetails || [])
        );
      } catch (err) {
        console.error("Failed to fetch store list", err);
      }
    };

    if (merchantId) fetchData();
  }, [merchantId]);

  const openStoreDialog = (storeId) => {
    setSelectedStoreId(storeId);
    setOpenDialog(true);
  };

  const closeStoreDialog = () => {
    setOpenDialog(false);
    setSelectedStoreId(null);
  };

  const handleCardClick = (categoryName, categoryKey, isAvailable, storeId) => {
    openStoreDialog(storeId);
  };

  return (
    <Container maxWidth="lg" className={classes.pageContainer}>
      {/* Header Section */}
      <Box
        className={classes.headerWrapper}
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {storeName && (
            <Typography
              variant="h4"
              className={classes.subHeader}
              sx={{ color: (theme) => theme.palette.primary.main }}
            >
              {storeName}
            </Typography>
          )}
        </Box>

        {/* 🔹 Common Add Store Button */}
        <Button
          variant="contained"
          startIcon={<AddCircleOutline />}
          onClick={() =>
            (handleClick || handleCardClick)("New Store", null, false, null)
          }
          sx={{ borderRadius: "8px" }}
        >
          Add New Store
        </Button>
      </Box>

      {/* 🔹 Grouped Stores Rendering */}
      {Object.entries(groupedStores).map(([key, group]) => (
        <Box key={key} sx={{ mb: 6 }}>
          {/* City, State + Area Header */}
          <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
            {group.city}, {group.state} - {group.area_code}
          </Typography>
          <Divider sx={{ width: "250px", mb: 3 }} />

          <Grid container spacing={{ xs: 2, md: 4 }}>
            {group.stores.map((store) => {
              const { logo, categories = [], storeId } = store;
              const categoryName = categories
                .map((c) => categoryLabelMap[c] || c)
                .join(", ");

              return (
                <Grid item xs={12} sm={6} md={4} key={storeId}>
                  <Card className={clsx(classes.cardBase)}>
                    <Box className={classes.imageContainer}>
                      <img
                        src={logo}
                        alt="Store Logo"
                        style={{
                          maxHeight: "100px",
                          maxWidth: "100%",
                          objectFit: "contain",
                          borderRadius: "8px",
                        }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src =
                            "https://placehold.co/100x100/CCCCCC/666666?text=No+Logo";
                        }}
                      />
                    </Box>

                    {/* Categories as Chips */}
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                        mt: 1,
                        mb: 2,
                      }}
                    >
                      {categories.map((c, i) => (
                        <Chip
                          key={i}
                          label={categoryLabelMap[c] || c}
                          size="small"
                          sx={{
                            backgroundColor:
                              categoryColorMap[c] || "#1976d2",
                            color: "#fff",
                            fontWeight: 500,
                            borderRadius: "16px",
                            px: 1,
                            "&:hover": { backgroundColor: "#1565c0" },
                          }}
                        />
                      ))}
                    </Box>

                    {/* Only Button is Clickable */}
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      className={clsx(
                        classes.buttonBase,
                        classes.updateButton
                      )}
                      onClick={() =>
                        (handleClick || handleCardClick)(
                          categoryName,
                          categories[0],
                          true,
                          storeId
                        )
                      }
                    >
                      Update Store
                    </Button>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      ))}

      {/* Store Details Dialog */}
      <Dialog
        open={openDialog}
        onClose={closeStoreDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Store Details
          <IconButton
            aria-label="close"
            onClick={closeStoreDialog}
            sx={{ position: "absolute", right: 8, top: 8 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <StoreDetails storeId={selectedStoreId} />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeStoreDialog} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default MallGrid;
