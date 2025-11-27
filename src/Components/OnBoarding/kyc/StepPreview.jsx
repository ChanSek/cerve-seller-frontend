import React, { useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Divider,
  Card,
  CardContent,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CloseIcon from "@mui/icons-material/Close";
import { LoadCanvasTemplate } from "react-simple-captcha";
import RenderInput from "../../../utils/RenderInput";

import kycFields from "../provider-kyc-fields";
import kycDocumentFields from "../provider-kyc-doc-fields";
import bankDetailFields from "../provider-bank-details-fields";

// --- Utility: Get clean file path (remove query params from signed URLs) ---
const getFilePath = (url) => {
  if (!url) return "";
  try {
    const urlObject = new URL(url);
    return urlObject.pathname;
  } catch {
    return url.split("?")[0];
  }
};

const StepPreview = ({ formValues, setFormValues, errors, fieldValidate }) => {
  const [openPreview, setOpenPreview] = useState(false);
  const [currentFileUrl, setCurrentFileUrl] = useState(null);
  const [currentFileTitle, setCurrentFileTitle] = useState("");

  const handleOpenPreview = (fileUrl, fileTitle) => {
    setCurrentFileUrl(fileUrl);
    setCurrentFileTitle(fileTitle);
    setOpenPreview(true);
  };

  const handleClosePreview = () => {
    setOpenPreview(false);
    setCurrentFileUrl(null);
    setCurrentFileTitle("");
  };

  const handleChange = (e, item) => {
    const value = e.target.value;
    setFormValues((prev) => ({ ...prev, [item.id]: value }));
    fieldValidate(item.id, value);
  };

  // --- Document Preview Dialog ---
  const DocumentPreviewDialog = () => {
    if (!currentFileUrl) return null;

    const filePath = getFilePath(currentFileUrl);
    const isImage = /\.(jpg|jpeg|png|gif|avif|webp|bmp|tif|tiff|svg|ico)$/i.test(filePath);
    const isPdf = /\.pdf$/i.test(filePath);

    let content = (
      <Typography color="error">
        Preview not available for this file type.
      </Typography>
    );

    if (isImage) {
      content = (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "70vh",
            overflow: "hidden",
          }}
        >
          <img
            src={currentFileUrl}
            alt={currentFileTitle}
            style={{
              maxWidth: "100%",
              maxHeight: "70vh",
              objectFit: "contain",
              borderRadius: "8px",
              border: "1px solid #ddd",
            }}
          />
        </Box>
      );
    } else if (isPdf) {
      content = (
        <Box sx={{ height: "70vh" }}>
          <iframe
            src={currentFileUrl}
            title={currentFileTitle}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          ></iframe>
        </Box>
      );
    }

    return (
      <Dialog
        open={openPreview}
        onClose={handleClosePreview}
        maxWidth="md"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{ m: 0, p: 2 }}>
          Preview: {currentFileTitle}
          <IconButton
            aria-label="close"
            onClick={handleClosePreview}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>{content}</DialogContent>
      </Dialog>
    );
  };

  // --- Field Renderer ---
  const renderFieldGroup = (title, fields) => (
    <Card
      sx={{
        mb: 4,
        borderRadius: 2,
        boxShadow: 3,
        borderLeft: title.includes("Document")
          ? "5px solid #ff9800"
          : "5px solid #1976d2",
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          sx={{
            mb: 2,
            fontWeight: 700,
            color: title.includes("Document") ? "#ff9800" : "#1976d2",
          }}
        >
          {title}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        <Grid container spacing={3}>
          {fields.map((field) => {
            const value = formValues[field.id];

            if (field.type === "fileUpload" || field.type === "upload") {
              return (
                <Grid item xs={12} sm={6} md={4} key={field.id}>
                  <Typography
                    variant="subtitle1"
                    fontWeight={600}
                    color="text.primary"
                    gutterBottom
                  >
                    {field.title}
                  </Typography>
                  {value ? (
                    <Button
                      size="small"
                      variant="contained"
                      color="info"
                      startIcon={<VisibilityIcon />}
                      onClick={() => handleOpenPreview(value, field.title)}
                    >
                      View File
                    </Button>
                  ) : (
                    <Chip label="No File Uploaded" color="warning" size="small" />
                  )}
                </Grid>
              );
            }

            return (
              <Grid item xs={12} sm={6} md={4} key={field.id}>
                <Typography
                  variant="subtitle1"
                  fontWeight={600}
                  color="text.primary"
                  gutterBottom
                >
                  {field.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{ wordWrap: "break-word" }}
                >
                  {value || (
                    <span style={{ fontStyle: "italic", color: "#9e9e9e" }}>
                      Not Provided
                    </span>
                  )}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 3 },
        maxHeight: "50vh",
        overflowY: "auto",
        bgcolor: "#fafafa",
      }}
    >
      {renderFieldGroup("KYC Details", kycFields)}
      {renderFieldGroup("KYC Documents", kycDocumentFields)}
      {renderFieldGroup("Bank Details", bankDetailFields)}
      {/* --- Captcha Section for Final Submission --- */}
      <Box sx={{ my: 3 }}>
        <Box sx={{ py: 1 }}>
          <LoadCanvasTemplate />
        </Box>
        <RenderInput
          item={{
            id: "captcha",
            placeholder: "Enter Captcha Value",
            type: "input",
            error: !!errors?.captcha,
    helperText: errors?.captcha,
            fullWidth: true,
          }}
          state={formValues}
          handleChange={handleChange}
          stateHandler={setFormValues}
        />
      </Box>

      <DocumentPreviewDialog />
    </Box>
  );
};

export default StepPreview;
