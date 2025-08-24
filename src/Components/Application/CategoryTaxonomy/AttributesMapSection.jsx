import React, { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Box,
    Button,
    Dialog,
    DialogContent,
    IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import { Tooltip } from "@mui/material";

const AttributesMatrix = ({ activeCategory }) => {
    const [attributesMap, setAttributesMap] = useState([]);
    const [loading, setLoading] = useState(false);
    const [allAttributes, setAllAttributes] = useState([]);
    const [fullscreen, setFullscreen] = useState(false);

    useEffect(() => {
        if (!activeCategory) return;

        setLoading(true);
        axios
            .get(`/api/v1/seller/reference/attributesMap/${activeCategory}`)
            .then((res) => {
                const data = res.data?.data || [];
                setAttributesMap(data);

                const attributesSet = new Set();
                data.forEach((subcat) => {
                    subcat.attributes.forEach((attr) => {
                        attributesSet.add(
                            attr.type === "list" ? `${attr.attribute}*` : attr.attribute
                        );
                    });
                });
                setAllAttributes(Array.from(attributesSet));
            })
            .catch((err) => {
                console.error("Error fetching attributes map:", err);
            })
            .finally(() => setLoading(false));
    }, [activeCategory]);

    const renderTable = () => (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: "75vh",
                width: "100%",
            }}
        >
            <Table stickyHeader size="small" sx={{ minWidth: 650, border: "1px solid #ccc" }}>
                <TableHead>
                    <TableRow sx={{ height: 28 }}>
                        <TableCell
                            sx={{
                                position: "sticky",
                                left: 0,
                                zIndex: 3,
                                backgroundColor: "#fff",
                                fontWeight: "bold",
                                whiteSpace: "nowrap",
                                padding: "2px 8px",
                                border: "1px solid #ccc",
                                fontSize: "0.8rem",
                            }}
                        >
                            Sub Category\Attribute
                        </TableCell>
                        {allAttributes.map((attr, idx) => (
                            <TableCell
                                key={idx}
                                sx={{
                                    fontWeight: "bold",
                                    whiteSpace: "nowrap",
                                    padding: "2px 8px",
                                    border: "1px solid #ccc",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {attr}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>

                <TableBody>
                    {attributesMap.map((subcat, idx) => (
                        <TableRow key={idx} sx={{ height: 28 }}>
                            <TableCell
                                sx={{
                                    position: "sticky",
                                    left: 0,
                                    zIndex: 2,
                                    backgroundColor: "#fafafa",
                                    fontWeight: "bold",
                                    padding: "2px 8px",
                                    border: "1px solid #ccc",
                                    fontSize: "0.8rem",
                                }}
                            >
                                {subcat.name}
                            </TableCell>
                            {allAttributes.map((attr, j) => {
                                const found = subcat.attributes.find(
                                    (a) =>
                                        (a.type === "list" ? `${a.attribute}*` : a.attribute) === attr
                                );
                                return (
                                    <TableCell
                                        key={j}
                                        align="center"
                                        sx={{
                                            padding: "2px 8px",
                                            border: "1px solid #ccc",
                                            fontSize: "0.8rem",
                                            color: found?.mandatory ? "red" : "inherit",
                                        }}
                                    >
                                        {found ? (found.mandatory ? "M" : "O") : "-"}
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );

    return (
        <Box sx={{ width: "100%", p: { xs: 1, sm: 2 } }}>
            {loading ? (
                <CircularProgress />
            ) : (
                <>
                    {/* Fullscreen button */}
                    <Box sx={{ mb: 1, display: "flex", justifyContent: "flex-end" }}>
                        <Tooltip title="Click to full screen">
                            <IconButton onClick={() => setFullscreen(true)}>
                                <FullscreenIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    {/* Normal table */}
                    {renderTable()}

                    {/* Fullscreen Dialog */}
                    <Dialog
                        fullScreen
                        open={fullscreen}
                        onClose={() => setFullscreen(false)}
                    >
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "flex-end",
                                p: 1,
                                background: "#f5f5f5",
                            }}
                        >
                            <IconButton onClick={() => setFullscreen(false)}>
                                <CloseIcon />
                            </IconButton>
                        </Box>
                        <DialogContent>{renderTable()}</DialogContent>
                    </Dialog>
                </>
            )}
        </Box>
    );
};

export default AttributesMatrix;
