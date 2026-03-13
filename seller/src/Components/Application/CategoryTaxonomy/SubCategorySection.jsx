import React, { useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
  TextField,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const SubCategorySection = ({ subCategories, loading, onAdd, onRemove }) => {
  const [newSubCategory, setNewSubCategory] = useState("");

  const handleAdd = () => {
    if (newSubCategory.trim() !== "") {
      onAdd(newSubCategory.trim());
      setNewSubCategory("");
    }
  };

  return (
    <Box sx={{ width: "100%" }}>
      {/* Sub Categories Table */}
      <TableContainer
        component={Paper}
        elevation={1}
        sx={{
          width: "100%", // matches parent Box width (30%)
          maxHeight: "66vh",
          overflow: "auto",
          mb: "20px",
        }}
      >
        <Table stickyHeader size="small" aria-label="subcategory table">
          <TableHead sx={{ bgcolor: "action.hover" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", p: "4px 8px" }}>#</TableCell>
              <TableCell sx={{ fontWeight: "bold", p: "4px 8px" }}>
                Sub Category Name
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold", p: "4px 8px" }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ p: "6px" }}>
                  Loading...
                </TableCell>
              </TableRow>
            ) : subCategories.length > 0 ? (
              subCategories.map((sub, index) => (
                <TableRow key={index} sx={{ "& td": { p: "4px 8px" } }}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{sub}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => onRemove(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ p: "6px" }}>
                  No Sub Categories Found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default SubCategorySection;
