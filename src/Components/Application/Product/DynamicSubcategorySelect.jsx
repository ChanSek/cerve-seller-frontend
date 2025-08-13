import React, { useEffect, useState } from "react";
import debounce from "lodash.debounce";
import { getCall } from "../../../Api/axios";
import {
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";


const DynamicSubcategorySelect = ({ item, value, onChange, error }) => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const getProductNames = async (keyword) => {
    try {
      const url = `/api/v1/seller/product/search?keyword=${encodeURIComponent(keyword)}`;
      const result = await getCall(url);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }
  const fetchOptions = async (keyword) => {
    setLoading(true);
    try {
      const response = getProductNames(keyword);
      const data = await response;
      if (Array.isArray(data)) {
        setOptions(data); // ✅ Correct format
      } else {
        console.warn("Unexpected data format:", data);
        setOptions([]);  // Fallback
      }
    } catch (err) {
      console.error("Failed to fetch options", err);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = React.useMemo(() => debounce(fetchOptions, 300), []);
  useEffect(() => () => debouncedFetch.cancel(), [debouncedFetch]);

  return (
    <Autocomplete
      disableClearable={item.disableClearable}
      options={options}
      loading={loading}
      value={value || null}
      getOptionLabel={(option) => option.name || ""}
      isOptionEqualToValue={(option, val) => option.id === val.id}
      onInputChange={(e, inputValue) => {
        if (inputValue) debouncedFetch(inputValue);
      }}
      onChange={(e, newValue) => {
        // store full object or just newValue.id based on use case
        onChange(newValue);
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label={item.title}
          variant={item.variant ? item.variant : "standard"}
          placeholder={item.placeholder}
          error={!!error}
          helperText={error}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading && <CircularProgress size={20} />}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
        />
      )}
    />
  );
};

export default DynamicSubcategorySelect;