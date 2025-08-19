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
import { useStore } from "../../Router/StoreContext"; // adjust path if needed

const StoreSwitcher = () => {
    const [categories, setCategories] = useState([]);
    const [localSelected, setLocalSelected] = useState("");
    const merchantId = localStorage.getItem("organization_id");

    const { store, updateStore } = useStore();

    useEffect(() => {
        getCall(`/api/v1/seller/merchantId/${merchantId}/store/list`)
            .then((res) => {
                if (res?.status === 200 && Array.isArray(res.data)) {
                    const validStores = res.data.filter((store) => store.status === "Yes");

                    if (validStores.length > 0) {
                        setCategories(validStores);

                        const savedId = localStorage.getItem("store_id");
                        const savedCategory = localStorage.getItem("store_category");

                        const previouslySelected = validStores.find(
                            (store) => store.storeId === savedId && store.category === savedCategory
                        );

                        const selectedStore = previouslySelected || validStores[0];
                        setLocalSelected(selectedStore.label);
                        updateStore(selectedStore);
                    } else {
                        cogoToast.warn("No active stores available");
                    }
                }
            })
            .catch((err) => {
                cogoToast.error("Failed to load store list");
                console.error(err);
            });
    }, [merchantId]);

    const handleCategoryChange = (event) => {
        const selectedLabel = event.target.value;
        const selectedStore = categories.find((store) => store.label === selectedLabel);

        if (selectedStore) {
            setLocalSelected(selectedStore.label);
            updateStore(selectedStore);
        }
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Typography
                sx={{
                    color: "#fff",
                    fontWeight: 600,
                    fontSize: "0.95rem",
                    px: 1,
                    py: 0.5,
                    borderRadius: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                Current Store
                <ChevronRightIcon
                    sx={{
                        ml: 0.5,
                        fontSize: "1.1rem",
                        verticalAlign: "middle",
                    }}
                />
            </Typography>

            <FormControl
  variant="outlined"
  size="small"
  sx={{
    minWidth: 160,
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgba(255,255,255,0.15)",
      borderRadius: 1,
      color: "#fff",
      "& fieldset": {
        borderColor: "rgba(255,255,255,0.3)",
      },
      "&:hover fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#fff",
      },
      "&.Mui-disabled": {
        backgroundColor: "rgba(255, 255, 255, 0.2) !important",
        color: "#fff !important",
        WebkitTextFillColor: "#fff !important", // <-- fixes text color in WebKit when disabled
      },
    },
    "& .MuiSelect-select.Mui-disabled": {
      color: "#fff !important",
      WebkitTextFillColor: "#fff !important",
    },
    "& .MuiSvgIcon-root": {
      color: "#fff",
    },
  }}
>
  <Select
    value={localSelected}
    onChange={handleCategoryChange}
    displayEmpty
    disabled={categories.length === 1}
  >
    {categories.map((item) => (
      <MenuItem key={item.storeId} value={item.label}>
        {item.label}
      </MenuItem>
    ))}
  </Select>
</FormControl>


        </Box>
    );
};

export default StoreSwitcher;
