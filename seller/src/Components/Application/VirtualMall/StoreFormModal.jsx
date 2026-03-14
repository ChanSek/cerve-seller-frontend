import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from "@mui/material";

const StoreFormModal = ({ store, onClose, onSave }) => {
  const [form, setForm] = useState({
    name: store.name || "",
    category: store.category || "",
  });

  const handleChange = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value });
  };

  const handleSubmit = () => {
    onSave({ ...store, ...form });
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>{store.isNew ? "Add Store" : "Edit Store"}</DialogTitle>
      <DialogContent sx={{ minWidth: 300 }}>
        <TextField
          fullWidth
          label="Store Name"
          value={form.name}
          onChange={handleChange("name")}
          sx={{ mt: 2 }}
        />
        <TextField
          select
          fullWidth
          label="Category"
          value={form.category}
          onChange={handleChange("category")}
          sx={{ mt: 2 }}
        >
          <MenuItem value="grocery">Grocery</MenuItem>
          <MenuItem value="fashion">Fashion</MenuItem>
          <MenuItem value="electronics">Electronics</MenuItem>
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default StoreFormModal;
