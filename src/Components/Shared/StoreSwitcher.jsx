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
    console.log("merchantId ", merchantId);
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
  }, [merchantId]); // Dependency array includes merchantId

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
  console.log("stores ", stores);
  console.log("selectedStore ", selectedStore);
  if (!selectedStore) {
    return null;
  }
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: { xs: 1, sm: 2 }, // Reduced gap on small screens
        flexDirection: { xs: "column", sm: "row" }, // Stack vertically on small screens
        width: { xs: '100%', sm: 'auto' }, // Full width on small screens
        justifyContent: { xs: 'center', sm: 'flex-start' }, // Center items when stacked
        mt: { xs: 1, sm: 0 }, // Add top margin on small screens when stacked
      }}
    >
      <Typography
        sx={{
          color: "#fff",
          fontWeight: 600,
          fontSize: { xs: "0.8rem", sm: "0.95rem" }, // Smaller font on small screens
          px: 1,
          py: 0.5,
          borderRadius: "4px",
          textTransform: "uppercase",
          letterSpacing: "0.5px",
          whiteSpace: "nowrap", // Prevent text wrapping
          alignItems: "center", // Align items when display is flex
          // Combined display property to avoid duplication warning
          display: { xs: 'none', sm: 'flex' }, // Hide on extra-small, show as flex on small and above
        }}
      >
        Current Store
        <ChevronRightIcon sx={{ ml: 0.5, fontSize: "1.1rem" }} />
      </Typography>

      {/* Store Dropdown */}
      {/* Store Dropdown */}
      <FormControl
        size="small"
        sx={{
          minWidth: { xs: '80%', sm: 180 },
          width: { xs: '100%', sm: 'auto' },
          maxWidth: { xs: 200, sm: 'auto' },
        }}
        disabled={stores.length === 1} // 🔹 disable if only one store
      >
        <Select
          value={selectedStoreId || ""}
          onChange={handleStoreChange}
          displayEmpty
          sx={{
            color: "#fff",
            "& .MuiSelect-select": {
              color: "#fff", // normal state
            },
            "&.Mui-disabled .MuiSelect-select": {
              color: "#fff !important",   // 🔹 force white when disabled
              WebkitTextFillColor: "#fff", // 🔹 Safari fix
            },
            "& .MuiSvgIcon-root": { color: "#fff" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "rgba(255,255,255,0.6)",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#fff",
            },
          }}
        >
          <MenuItem value="">Select Store</MenuItem>
          {stores.map((store) => (
            <MenuItem key={store.storeId} value={store.storeId} sx={{ color: "#000" }}>
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
            color: "#fff",
            "& .MuiSelect-select": {
              color: "#fff",
            },
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
          }}
        >
          <MenuItem value="">Select Category</MenuItem>
          {selectedStore?.categories.map((cat) => (
            <MenuItem key={cat.category} value={cat.category} sx={{ color: "#000" }}>
              {cat.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

    </Box>
  );
};

export default StoreSwitcher;
