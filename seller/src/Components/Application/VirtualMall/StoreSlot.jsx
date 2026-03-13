import React from "react";
import { Paper, Typography, Box } from "@mui/material";
import { ShoppingCart, Checkroom, Devices, Add } from "@mui/icons-material";

const categoryIcons = {
  grocery: <ShoppingCart />,
  fashion: <Checkroom />,
  electronics: <Devices />,
};

const StoreSlot = ({ store, onClick, index }) => {
  const isEmpty = !store;

  return (
    <Paper
      elevation={4}
      onClick={onClick}
      sx={{
        height: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        borderRadius: 4,
        backgroundColor: isEmpty ? "#f5f5f5" : "#ffffff",
        border: isEmpty ? "2px dashed #aaa" : "1px solid #ddd",
        "&:hover": {
          boxShadow: 6,
        },
      }}
    >
      {isEmpty ? (
        <>
          <Add fontSize="large" />
          <Typography>Add Store</Typography>
        </>
      ) : (
        <>
          {categoryIcons[store.category]}
          <Typography variant="subtitle1" sx={{ mt: 1 }}>
            {store.name}
          </Typography>
          <Typography variant="caption">{store.category}</Typography>
        </>
      )}
    </Paper>
  );
};

export default StoreSlot;
