import React, { useEffect, useState } from "react";
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { getCall } from "../../Api/axios";
import cogoToast from "cogo-toast";
import { useStore } from "../../Router/StoreContext";

const StoreSwitcher = () => {
  const [storeGroups, setStoreGroups] = useState([]); // merchants with storeName + stores
  const [selectedStoreName, setSelectedStoreName] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const { updateStore } = useStore();
  const merchantId = localStorage.getItem("organization_id");

  useEffect(() => {
    const hasMerchant =
      merchantId && merchantId !== "undefined" && merchantId.trim() !== "";
    const api = hasMerchant
      ? `/api/v1/seller/store/list?merchantId=${merchantId}`
      : `/api/v1/seller/store/list`;

    getCall(api)
      .then((res) => {
        if (res?.status === 200 && Array.isArray(res.data)) {
          setStoreGroups(res.data);

          // Load previous selection
          const storedStoreId = localStorage.getItem("store_id");
          const storedCategory = localStorage.getItem("store_category");
          const storedLabel = localStorage.getItem("store_label");
          const storedStoreName = localStorage.getItem("store_name");

          if (storedStoreId && storedCategory) {
            setSelectedStoreId(storedStoreId);
            setSelectedCategory(storedCategory);
            setSelectedStoreName(storedStoreName);
            updateStore({
              storeId: storedStoreId,
              category: storedCategory,
              label: storedLabel,
              storeName: storedStoreName,
            });
          } else if (res.data.length > 0) {
            // Default to first storeName → first store → first category
            const firstGroup = res.data[0];
            const firstStore = firstGroup.stores[0];
            const firstCategory = firstStore.categories[0] || {};

            const initialStoreObj = {
              storeId: firstStore.storeId,
              category: firstCategory.category || "",
              label: firstCategory.label || "",
              storeName: firstGroup.storeName,
            };

            setSelectedStoreName(firstGroup.storeName);
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

  // Filter selected storeName group
  const currentGroup = storeGroups.find(
    (g) => g.storeName === selectedStoreName
  );
  const currentStores = currentGroup?.stores || [];
  const selectedStore = currentStores.find((s) => s.storeId === selectedStoreId);

  // --- Handlers ---
  const handleStoreNameChange = (event) => {
    const newStoreName = event.target.value;
    setSelectedStoreName(newStoreName);
    setSelectedStoreId("");
    setSelectedCategory("");

    const group = storeGroups.find((g) => g.storeName === newStoreName);
    if (group && group.stores.length > 0) {
      const firstStore = group.stores[0];
      const firstCategory = firstStore.categories[0] || {};

      const storeObj = {
        storeId: firstStore.storeId,
        category: firstCategory.category || "",
        label: firstCategory.label || "",
        storeName: group.storeName,
      };
      setSelectedStoreId(firstStore.storeId);
      setSelectedCategory(storeObj.category);
      updateStore(storeObj);
    }
  };

  const handleStoreChange = (event) => {
    const newStoreId = event.target.value;
    setSelectedStoreId(newStoreId);

    const store = currentStores.find((s) => s.storeId === newStoreId);
    if (store) {
      const firstCategory = store.categories[0] || {};
      const storeObj = {
        storeId: store.storeId,
        category: firstCategory.category || "",
        label: firstCategory.label || "",
        storeName: selectedStoreName,
      };
      setSelectedCategory(storeObj.category);
      updateStore(storeObj);
    }
  };

  const handleCategoryChange = (event) => {
    const newCategory = event.target.value;
    setSelectedCategory(newCategory);

    const category =
      selectedStore?.categories.find((c) => c.category === newCategory) || {};
    updateStore({
      storeId: selectedStoreId,
      category: category.category || "",
      label: category.label || "",
      storeName: selectedStoreName,
    });
  };

  if (storeGroups.length === 0) return null;

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 },
        flexDirection: { xs: "column", sm: "row" },
        width: { xs: "100%", sm: "auto" },
        justifyContent: { xs: "center", sm: "flex-start" },
        mt: { xs: 1, sm: 0 },
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 600,
          fontSize: { xs: "0.8rem", sm: "0.95rem" },
          px: 1,
          py: 0.5,
          borderRadius: "4px",
          textTransform: "uppercase",
          display: { xs: "none", sm: "flex" },
        }}
      >
        Current Store
        <ChevronRightIcon sx={{ ml: 0.5, fontSize: "1.1rem" }} />
      </Typography>

      {/* Store Name Dropdown */}
      <FormControl
        size="small"
        sx={{ minWidth: 160 }}
        disabled={storeGroups.length === 1}
      >
        <Select
          value={selectedStoreName || ""}
          onChange={handleStoreNameChange}
          displayEmpty
          sx={dropdownStyle}
          variant="standard"
        >
          <MenuItem value="">Select Store</MenuItem>
          {storeGroups.map((group) => (
            <MenuItem key={group.storeName} value={group.storeName} sx={{ color: "#000" }}>
              {group.storeName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* CityCode Dropdown */}
      <FormControl
        size="small"
        sx={{ minWidth: 160 }}
        disabled={!currentStores.length}
      >
        <Select
          value={selectedStoreId || ""}
          onChange={handleStoreChange}
          displayEmpty
          sx={dropdownStyle}
          variant="standard"
        >
          <MenuItem value="">Select Store Location</MenuItem>
          {currentStores.map((store) => (
            <MenuItem key={store.storeId} value={store.storeId} sx={{ color: "#000" }}>
              {store.cityCode}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Category Dropdown */}
      <FormControl
        size="small"
        sx={{ minWidth: 160 }}
        disabled={!selectedStore || !selectedStore.categories?.length}
      >
        <Select
          value={selectedCategory || ""}
          onChange={handleCategoryChange}
          displayEmpty
          sx={dropdownStyle}
          variant="standard"
        >
          <MenuItem value="">Select Category</MenuItem>
          {selectedStore?.categories?.map((cat) => (
            <MenuItem key={cat.category} value={cat.category} sx={{ color: "#000" }}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

const dropdownStyle = {
  color: "#fff",
  "& .MuiSelect-select": { color: "#fff" },
  "&.Mui-disabled .MuiSelect-select": {
    color: "#fff !important",
    WebkitTextFillColor: "#fff",
  },
  "& .MuiSvgIcon-root": { color: "#fff" },
  "& .MuiOutlinedInput-notchedOutline": {
    borderColor: "rgba(255,255,255,0.6)",
  },
  "&:hover .MuiOutlinedInput-notchedOutline": {
    borderColor: "#fff",
  },
};

export default StoreSwitcher;
