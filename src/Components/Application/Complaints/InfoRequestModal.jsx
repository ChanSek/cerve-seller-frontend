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

export default function InfoRequestModal({ user, supportActionDetails, open, handleClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  // Start with one info request section
  const [infoRequests, setInfoRequests] = useState([{ name: "", info: "" }]);

  // Update a specific info request field
  const handleChange = (index, field, value) => {
    const updatedRequests = [...infoRequests];
    updatedRequests[index][field] = value;
    setInfoRequests(updatedRequests);
  };

  // Add a new info request section (max 5)
  const handleAdd = () => {
    if (infoRequests.length < 5) {
      setInfoRequests([...infoRequests, { name: "", info: "" }]);
    }
  };

  // Remove an info request section (ensure at least one remains)
  const handleRemove = (index) => {
    if (infoRequests.length > 1) {
      setInfoRequests(infoRequests.filter((_, i) => i !== index));
    }
  };

  // Handler for form submission
  const handleSubmit = () => {
    setLoading(true);
    postCall(`/api/v1/seller/${supportActionDetails._id}/infoRequests`,infoRequests)
      .then((resp) => {
        setLoading(false);
        if (resp?.status === 200) {
          // Call the onSuccess callback if provided
          if (onSuccess) {
            onSuccess(resp.message);
          }
        } else {
          cogoToast.error(resp.message);
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
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
        <Typography id="info-request-modal-title" variant="h6" component="h2">
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
              position: "relative",
            }}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center">
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
              label="Name"
              variant="outlined"
              fullWidth
              margin="normal"
              value={req.name}
              onChange={(e) => handleChange(index, "name", e.target.value)}
            />
            <TextField
              label="Information"
              variant="outlined"
              fullWidth
              margin="normal"
              value={req.info}
              onChange={(e) => handleChange(index, "info", e.target.value)}
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