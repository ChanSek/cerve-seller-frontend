import React, { useState } from "react";
import {
  Modal,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { postCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  borderRadius: 1,
  boxShadow: 24,
  p: 4,
};

export default function InfoRequestModal({
  complaintId,
  open,
  handleClose,
  refreshComplaints,
}) {
  const [loading, setLoading] = useState(false);
  const [infoRequests, setInfoRequests] = useState([
    { name: "", info: "", errors: {} },
  ]);

  const handleChange = (index, field, value) => {
    const updatedRequests = [...infoRequests];
    updatedRequests[index][field] = value;
    updatedRequests[index].errors = {
      ...updatedRequests[index].errors,
      [field]: !value.trim() ? `${field} is required` : "",
    };
    setInfoRequests(updatedRequests);
  };

  const handleAdd = () => {
    if (infoRequests.length < 5) {
      setInfoRequests([
        ...infoRequests,
        { name: "", info: "", errors: {} },
      ]);
    }
  };

  const handleRemove = (index) => {
    if (infoRequests.length > 1) {
      setInfoRequests(infoRequests.filter((_, i) => i !== index));
    }
  };

  const validateRequests = () => {
    const updatedRequests = infoRequests.map((req) => ({
      ...req,
      errors: {
        name: !req.name.trim() ? "Name is required" : "",
        info: !req.info.trim() ? "Information is required" : "",
      },
    }));
    setInfoRequests(updatedRequests);
    return updatedRequests.every(
      (req) => !req.errors.name && !req.errors.info
    );
  };

  const handleSubmit = () => {
    if (!validateRequests()) {
      return;
    }

    setLoading(true);
    const requests = infoRequests.map(({ name, info }) => ({ name, info }));
    postCall(`/api/v1/seller/${complaintId}/infoRequests`, requests)
      .then((resp) => {
        setLoading(false);
        if (resp?.status === 200) {
          cogoToast.info(resp.message);
          refreshComplaints();
        } else {
          cogoToast.error(resp.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        cogoToast.error(error.response?.data?.error || "Error occurred");
      });
    handleClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="info-request-modal-title"
      aria-describedby="info-request-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="info-request-modal-title" variant="h6">
          Request More Information
        </Typography>
        {infoRequests.map((req, index) => (
          <Box
            key={index}
            sx={{
              mt: 2,
              border: "1px solid #ccc",
              p: 2,
              borderRadius: 1,
            }}
          >
            <Box display="flex" justifyContent="space-between">
              <Typography variant="subtitle1">
                Info Request {index + 1}
              </Typography>
              {infoRequests.length > 1 && (
                <IconButton
                  color="error"
                  onClick={() => handleRemove(index)}
                  size="small"
                >
                  <RemoveIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <TextField
              label={
                <span>
                  Name <span style={{ color: "red" }}>*</span>
                </span>
              }
              variant="standard"
              fullWidth
              margin="normal"
              value={req.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
              error={!!req.errors.name}
              helperText={req.errors.name}
            />
            <TextField
              label={
                <span>
                  Information <span style={{ color: "red" }}>*</span>
                </span>
              }
              variant="standard"
              fullWidth
              margin="normal"
              value={req.info}
              onChange={(e) => handleChange(index, "info", e.target.value)}
              error={!!req.errors.info}
              helperText={req.errors.info}
            />
          </Box>
        ))}
        {infoRequests.length < 5 && (
          <Button
            variant="outlined"
            color="secondary"
            startIcon={<AddIcon />}
            sx={{ mt: 2 }}
            onClick={handleAdd}
          >
            Add Another Request
          </Button>
        )}
        <Box mt={3} display="flex" justifyContent="flex-end">
          <Button onClick={handleClose} color="inherit" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            color="primary"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
