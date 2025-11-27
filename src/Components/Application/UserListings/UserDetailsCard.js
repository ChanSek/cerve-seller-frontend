import React, { useState } from "react";
// Assuming RenderInput, verficationFields, useForm, putCall, cogoToast, and validation utilities are available
import RenderInput from "../../../utils/RenderInput";
import verficationFields from "./seller-verification-fields";
import useForm from "../../../hooks/useForm";
import { putCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import { useParams } from "react-router-dom";
import {
  Button,
  Grid,
  Typography,
  Box,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Link,
  CircularProgress,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
// Import your validation functions
// ... (Your validation function imports)

// Helper function to format labels
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const StatusChip = ({ status }) => {
  let color = "grey";
  let text = status || "Pending";
  let Icon = null;

  switch (status) {
    case true:
    case "Approved":
      color = "success.main";
      text = "Approved";
      Icon = CheckCircleIcon;
      break;
    case false:
    case "Rejected":
      color = "error.main";
      text = "Rejected";
      Icon = CancelIcon;
      break;
    default:
      color = "warning.main";
      text = status === 'false' ? 'No' : (status === 'true' ? 'Yes' : (status || 'Pending'));
      break;
  }

  // Handle boolean values (Seller Active)
  if (typeof status === 'boolean') {
    text = status ? 'Yes' : 'No';
    color = status ? 'success.main' : 'warning.main';
    Icon = status ? CheckCircleIcon : CancelIcon;
  }

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        backgroundColor: `${color}10`, // Light background color
        color: color,
        borderRadius: 1,
        px: 1,
        py: 0.5,
        fontWeight: 'bold',
        fontSize: '0.85rem'
      }}
    >
      {Icon && <Icon sx={{ fontSize: 16, mr: 0.5 }} />}
      {text}
    </Box>
  );
};

const UserDetailsCard = ({ selectedTab, details, onUpdateSuccess }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({});
  const [currentId, setCurrentId] = useState("");
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkContent, setLinkContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { formValues, setFormValues, errors, setErrors } = useForm({});
  const params = useParams();

  const getFieldById = (id) => {
    return verficationFields.find((field) => field.id === id);
  };

  const handleEditClick = (key, value, _id) => {
    const matchedField = getFieldById(key);
    setFormValues({
      [key]: value,
    });
    setErrors({}); // Clear previous errors
    setCurrentField(matchedField);
    setCurrentId(_id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({});
    setFormValues({});
    setErrors({});
  };

  const handleLinkClick = (url) => {
    setLinkContent(url);
    setIsLinkModalOpen(true);
  };

  const handleLinkModalClose = () => {
    setLinkContent("");
    setIsLinkModalOpen(false);
  };

  const validateFields = (formData) => {
    // ... (Your existing validation logic goes here, ensure to return the errors object)
    const errors = {};
    const key = Object.keys(formData)[0];
    const field = getFieldById(key);
    const value = formData[key];
    
    // (Existing validation implementation here)
    // ...
    
    // Example:
    if (field.required && !value) {
      errors[field.id] = `${field.title} is required`;
    }
    // ... other validation cases
    
    return errors;
  };


  const handleSubmit = async () => {
    const validationErrors = validateFields(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsSubmitting(true);
    setErrors({});

    try {
      const key = Object.keys(formValues)[0];
      const value = formValues[key];
      let data = {};

      // (Your existing data construction logic based on selectedTab)
      if (selectedTab === 'bank') {
        data = { updatedEntity: selectedTab, updatedField: key, account: { accountId: currentId, [key]: value } };
      } else if (selectedTab === 'review') {
        data = { updatedEntity: selectedTab, updatedField: key, merchantReview: { _id: currentId, [key]: value } };
      } else {
        data = { updatedEntity: selectedTab, updatedField: key, [key]: value };
      }

      const url = `/api/v1/seller/merchantId/${params?.id}/review`;
      const res = await putCall(url, data);

      if (res.status === 200) {
        cogoToast.success(formatLabel(key) + " updated successfully.", {
          hideAfter: 5,
        });
        onUpdateSuccess(); // Call the refresh function
      }
    } catch (error) {
      console.log("error", error);
      cogoToast.error(error.response?.data?.message || "An error occurred during update.");
    } finally {
      setIsSubmitting(false);
      handleModalClose();
    }
  };

  const getFileExtension = (url = "") => {
    try {
      const cleanUrl = url.split("?")[0];
      const parts = cleanUrl.split(".");
      return parts[parts.length - 1].toLowerCase();
    } catch {
      return "";
    }
  };

  const isEmpty = Object.keys(details).length === 0;

  return (
    <Box sx={{ p: 1 }}>
      {isEmpty ? (
        <Typography variant="body1">No details available</Typography>
      ) : (
        <Grid container spacing={3}>
          {Object.entries(details).map(([key, item]) => {
            const isLink = item.value && item.value.toString().startsWith("http");
            const isStatus = ['Approved', 'Rejected'].includes(item.value) || typeof item.value === 'boolean';
            
            return (
              <Grid item xs={12} sm={6} md={4} key={key}>
                <Box
                  sx={{
                    border: "1px solid #e0e0e0",
                    borderRadius: 2,
                    p: 2,
                    minHeight: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                    {item.title}
                  </Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mt: 1,
                    }}
                  >
                    <Typography
                      variant="body1"
                      component="span"
                      sx={{ fontWeight: "medium", flexGrow: 1 }}
                    >
                      {isStatus ? (
                        <StatusChip status={item.value} />
                      ) : isLink ? (
                        <Link
                          component="button"
                          variant="body1"
                          onClick={() => handleLinkClick(item.value)}
                          sx={{ display: 'flex', alignItems: 'center' }}
                        >
                          View Document
                          <VisibilityIcon sx={{ fontSize: 18, ml: 1 }} />
                        </Link>
                      ) : (
                        item.value || "Not Available"
                      )}
                    </Typography>
                    {item.editable && (
                      <Tooltip title={`Update ${item.title}`}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleEditClick(key, item.value, item._id)}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                </Box>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* Edit Modal (MUI Dialog) */}
      <Dialog open={isModalOpen} onClose={handleModalClose} fullWidth maxWidth="sm">
        <DialogTitle>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="h6">Update {currentField?.title}</Typography>
            <IconButton onClick={handleModalClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          {currentField && (
            <RenderInput
              item={{
                ...currentField,
                error: !!errors?.[currentField.id],
                helperText: errors?.[currentField.id] || "",
              }}
              state={formValues}
              stateHandler={setFormValues}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Updating...' : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Link/Document Preview Modal (MUI Dialog) */}
      <Dialog
        open={isLinkModalOpen}
        onClose={handleLinkModalClose}
        fullScreen // Use fullScreen for better doc viewing experience
        sx={{ '.MuiDialog-paperFullScreen': { backgroundColor: 'rgba(0, 0, 0, 0.9)' } }}
      >
        <DialogActions sx={{ justifyContent: "flex-end", p: 1 }}>
          <Button onClick={handleLinkModalClose} startIcon={<CloseIcon />} variant="contained" color="error">
            Close Preview
          </Button>
        </DialogActions>
        <DialogContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            p: 0,
          }}
        >
          {(() => {
            const fileType = getFileExtension(linkContent);
            const isImage = ["png", "jpg", "jpeg", "gif", "webp", "svg", "avif"].includes(fileType);
            const isPdf = fileType === "pdf";

            if (isPdf) {
              return (
                <iframe
                  src={linkContent}
                  title="PDF Preview"
                  style={{ width: "95vw", height: "95vh", border: "none" }}
                />
              );
            } else if (isImage) {
              return (
                <img
                  src={linkContent}
                  alt="Preview"
                  style={{
                    maxWidth: "95vw",
                    maxHeight: "95vh",
                    objectFit: "contain",
                    borderRadius: '8px',
                  }}
                />
              );
            } else {
              return (
                <Box sx={{ p: 4, textAlign: "center", background: 'white', borderRadius: 2 }}>
                  <Typography variant="h6" color="textPrimary" gutterBottom>
                    File preview not supported.
                  </Typography>
                  <Button
                    component={Link}
                    href={linkContent}
                    target="_blank"
                    rel="noopener noreferrer"
                    variant="contained"
                  >
                    Open in New Tab
                  </Button>
                </Box>
              );
            }
          })()}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default UserDetailsCard;