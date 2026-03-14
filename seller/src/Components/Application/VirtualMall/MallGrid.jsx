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
    <Container maxWidth="lg" sx={{ p: "30px 20px" }}>
      {/* Header Section */}
      <Box
        sx={{
          textAlign: "center",
          mb: 4,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          {storeName && (
            <Typography
              variant="h4"
              sx={{
                fontWeight: 400,
                fontSize: "2.0rem",
                color: "#8888aa",
                "& span": { color: "#6c5ce7", fontWeight: 600 },
              }}
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
                  <Card sx={{
                    borderRadius: 4,
                    p: "24px 16px",
                    cursor: "pointer",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    height: "100%",
                    justifyContent: "space-between",
                    textAlign: "center",
                    overflow: "hidden",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                    "&:hover": { boxShadow: "0 10px 24px rgba(0, 0, 0, 0.12)" },
                  }}>
                    <Box sx={{ display: "flex", justifyContent: "center", mb: 1, minHeight: "60px" }}>
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
                              categoryColorMap[c] || "#6c5ce7",
                            color: "#fff",
                            fontWeight: 500,
                            borderRadius: "16px",
                            px: 1,
                            "&:hover": { backgroundColor: "#5a4bd6" },
                          }}
                        />
                      ))}
                    </Box>

                    {/* Only Button is Clickable */}
                    <Button
                      variant="contained"
                      startIcon={<Edit />}
                      sx={{
                        background: "#6c5ce7",
                        color: "#fff",
                        fontWeight: 500,
                        p: "8px 20px",
                        borderRadius: 2,
                        mt: 1.5,
                        transition: "box-shadow 0.3s ease",
                        "&:hover": {
                          background: "#5a4bd6",
                          boxShadow: "0 6px 16px rgba(108, 92, 231, 0.4)",
                        },
                      }}
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
