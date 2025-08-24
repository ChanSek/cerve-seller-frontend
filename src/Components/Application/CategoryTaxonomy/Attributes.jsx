import React, { useEffect, useState } from "react";
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
    Divider,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { getCall } from "../../../Api/axios";

const Attributes = ({ activeCategory }) => {
    const [attributes, setAttributes] = useState([]);
    const [newAttribute, setNewAttribute] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchAttributes = async (categoryCode) => {
        setLoading(true);
        try {
            const res = await getCall(
                `/api/v1/seller/reference/category/attributes/${categoryCode}`
            );
            if (res?.data?.length > 0) {
                setAttributes(res.data);
            } else {
                setAttributes([]);
            }
        } catch (err) {
            console.error("Error fetching attributes", err);
            setAttributes([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAttribute = () => {
        if (newAttribute.trim() !== "") {
            setAttributes((prev) => [...prev, newAttribute.trim()]);
            setNewAttribute("");
        }
    };

    const handleRemoveAttribute = (index) => {
        setAttributes((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (activeCategory) {
            fetchAttributes(activeCategory);
        }
    }, [activeCategory]);

    return (
        <Box sx={{ width: "100%", mb: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Attributes
            </Typography>

            {/* Add Attribute */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="New Attribute"
                    variant="outlined"
                    size="small"
                    value={newAttribute}
                    onChange={(e) => setNewAttribute(e.target.value)}
                    sx={{ flex: 1 }}
                />
                <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddAttribute}
                >
                    Add
                </Button>
            </Box>

            {/* Attributes Table */}
            <TableContainer
                component={Paper}
                elevation={1}
                sx={{
                    width: "100%",
                    maxHeight: "60vh",
                    overflow: "auto",
                    mb: "20px",
                }}
            >
                <Table stickyHeader size="small" aria-label="attributes table">
                    <TableHead sx={{ bgcolor: "action.hover" }}>
                        <TableRow>
                            <TableCell sx={{ fontWeight: "bold", p: "4px 8px" }}>#</TableCell>
                            <TableCell sx={{ fontWeight: "bold", p: "4px 8px" }}>
                                Attribute Name
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
                        ) : attributes.length > 0 ? (
                            attributes.map((attr, index) => {
                                const isList = attr.includes("*"); // check for *
                                const cleanName = attr.replace("*", ""); // remove *

                                return (
                                    <TableRow key={index} sx={{ "& td": { p: "4px 8px" } }}>
                                        <TableCell>{index + 1}</TableCell>
                                        <TableCell>
                                            {cleanName}{" "}
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{ fontStyle: "italic" }}
                                            >
                                                ({isList ? "List" : "Text"})
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="right">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleRemoveAttribute(index)}
                                            >
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={3} align="center" sx={{ p: "6px" }}>
                                    No Attributes Found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
        </Box>
    );
};

export default Attributes;
