import React, { useEffect, useState } from "react";
import {
  Box,
  FormControl,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useStore } from "../../Router/StoreContext";


const StoreSwitcher = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const merchantId = localStorage.getItem("organization_id");
  const { updateStore } = useStore();

  useEffect(() => {
    // Check if merchantId is available before making the call
    if (merchantId === undefined || merchantId === "undefined" || !merchantId || merchantId.trim() === "") {
      return;
    }
    getCall(`/api/v1/seller/merchantId/${merchantId}/store/list`)
      .then((res) => {
        if (res?.status === 200 && Array.isArray(res.data)) {
          setStores(res.data);

          const storedStoreId = localStorage.getItem("store_id");
          const storedCategory = localStorage.getItem("store_category");
          const storedLabel = localStorage.getItem("store_label");

          if (storedStoreId && storedCategory) {
            setSelectedStoreId(storedStoreId);
            setSelectedCategory(storedCategory);
            updateStore({
              storeId: storedStoreId,
              category: storedCategory,
              label: storedLabel,
            });
          } else if (res.data.length > 0) {
            // Automatically select the first store if nothing is stored
            const firstStore = res.data[0];
            const firstCategoryOfFirstStore = firstStore.categories[0] || {};
            const initialStoreObj = {
              storeId: firstStore.storeId,
              category: firstCategoryOfFirstStore.category || "",
              label: firstCategoryOfFirstStore.label || "",
            };
            setSelectedStoreId(firstStore.storeId);
            setSelectedCategory(initialStoreObj.category);
            updateStore(initialStoreObj);
          }
        }
      })
      .catch((err) => {
        cogoToast.error("Failed to load store list.");
        console.error("API error:", err);
      });
  }, [merchantId]);

  const handleStoreChange = (event) => {
    const newStoreId = event.target.value;
    setSelectedStoreId(newStoreId);

    const store = stores.find((s) => s.storeId === newStoreId);
    if (store) {
      const firstCategory = store.categories[0] || {};
      const storeObj = {
        storeId: store.storeId,
        category: firstCategory.category || "",
        label: firstCategory.label || "",
      };

      setSelectedCategory(storeObj.category);
      updateStore(storeObj);
    }
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    const store = stores.find((s) => s.storeId === selectedStoreId);
    if (store) {
      const category = store.categories.find((c) => c.category === newCategory) || {};
      const storeObj = {
        storeId: store.storeId,
        category: category.category || "",
        label: category.label || "",
      };

      updateStore(storeObj);
    }
  };

  const selectedStore = stores.find((s) => s.storeId === selectedStoreId) || null;
  if (!selectedStore) {
    return null;
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: "column", sm: "row" },
        width: { xs: '100%', sm: 'auto' },
        justifyContent: { xs: 'center', sm: 'flex-start' },
        mt: { xs: 1, sm: 0 },
      }}
    >
      <Typography
        sx={{
          color: "common.white",
          fontWeight: 600,
          fontSize: { xs: "0.8rem", sm: "0.95rem" },
          px: 1,
          py: 0.5,
          borderRadius: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap",
          alignItems: "center",
          display: { xs: 'none', sm: 'flex' },
        }}
      >
        Current Store
        <ChevronRightIcon sx={{ ml: 0.5, fontSize: "1.1rem" }} />
      </Typography>

      {/* Store Dropdown */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: '80%', sm: 180 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: 200, sm: 'auto' },
        }}
        disabled={stores.length === 1}
      >
        <Select
          value={selectedStoreId || ""}
          onChange={handleStoreChange}
          displayEmpty
          sx={{
            color: "common.white",
            "& .MuiSelect-select": {
              color: "common.white",
            },
            "&.Mui-disabled .MuiSelect-select": {
              WebkitTextFillColor: (theme) => theme.palette.common.white,
            },
            "& .MuiSvgIcon-root": { color: "common.white" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.6)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "common.white",
            },
          }}
        >
          <MenuItem value="">Select Store</MenuItem>
          {stores.map((store) => (
            <MenuItem key={store.storeId} value={store.storeId} sx={{ color: "text.primary" }}>
              {store.cityCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Category Dropdown */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: '80%', sm: 180 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: 200, sm: 'auto' },
        }}
        disabled={
          !selectedStore || (selectedStore.categories?.length === 1)
        }
      >
        <Select
          value={selectedCategory || ""}
          onChange={handleCategoryChange}
          displayEmpty
          sx={{
            color: "common.white",
            "& .MuiSelect-select": {
              color: "common.white",
            },
            "&.Mui-disabled .MuiSelect-select": {
              WebkitTextFillColor: (theme) => theme.palette.common.white,
            },
            "& .MuiSvgIcon-root": { color: "common.white" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.6)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "common.white",
            },
          }}
        >
          <MenuItem value="">Select Category</MenuItem>
          {selectedStore?.categories.map((cat) => (
            <MenuItem key={cat.category} value={cat.category} sx={{ color: "text.primary" }}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    </Box>
  );
};

export default StoreSwitcher;
