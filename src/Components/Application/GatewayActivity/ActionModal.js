import React, { useState } from "react";
import { Modal, Box, Typography, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import ReactJson from "react-json-view";
import { convertDateInStandardFormat } from "../../../utils/formatting/date.js";

const ActionModal = ({ open, onClose, loading, error, actions }) => {
    const theme = useTheme();
    const [jsonModalOpen, setJsonModalOpen] = useState(false);
    const [selectedJson, setSelectedJson] = useState(null);
    const [viewAsTable, setViewAsTable] = useState(false); // State to toggle view type

    const handleOpenJsonModal = (json, hasError) => {
        try {
            let parsedJson = json;
            if (!hasError) {
                parsedJson = typeof json === "string" ? JSON.parse(json) : json;
            } else {
                parsedJson = { "Error": parsedJson }
            }
            setSelectedJson(parsedJson);
            setJsonModalOpen(true);
        } catch (error) {
            console.error("Invalid JSON format", error);
        }
    };

    const handleCloseJsonModal = () => {
        setJsonModalOpen(false);
        setSelectedJson(null);
    };

    const downloadJson = (json) => {
        const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "data.json"; // Set the filename
        link.click();
    };

    // Function to render JSON as a table
    const renderJsonAsTable = (json) => {
        const flattenJson = (obj) => {
            let result = [];
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (typeof obj[key] === 'object' && !Array.isArray(obj[key]) && obj[key] !== null) {
                        result = [...result, ...flattenJson(obj[key])]; // Recursively flatten nested objects
                    } else {
                        result.push({ key, value: obj[key] });
                    }
                }
            }
            return result;
        };

        const flattenedJson = flattenJson(json);

        return (
            <Table sx={{ minWidth: 800 }}>
                <TableHead>
                    <TableRow>
                        <TableCell>Key</TableCell>
                        <TableCell>Value</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {flattenedJson.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell>{item.key}</TableCell>
                            <TableCell>
                                {typeof item.value === 'object' ? (
                                    <pre>{JSON.stringify(item.value, null, 2)}</pre> // Stringify the object value
                                ) : (
                                    item.value // Render as is if it's not an object
                                )}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        );
    };


    return (
        <><Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "85vw",
                    height: "85vh",
                    bgcolor: "background.paper",
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    overflow: "auto",
                }}
            >
                {loading ? (
                    <CircularProgress />
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : actions && actions.length > 0 ? (
                    <Box>
                        <div className="mb-4 flex flex-row justify-between items-center">
                            <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
                                Action Details
                            </label>
                        </div>
                        <TableContainer
                            sx={{
                                maxHeight: "calc(70vh - 100px)", // Adjust according to modal height minus some padding
                                overflowY: "auto",
                                display: "block",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Table stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell
                                            sx={{
                                                bgcolor: "primary.main", // Background color (use theme color or custom)
                                                color: "white", // Text color
                                                fontWeight: "bold", // Bold text
                                                textAlign: "left", // Center align text
                                            }}
                                        >
                                            Action Type
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                bgcolor: "primary.main",
                                                color: "white",
                                                fontWeight: "bold",
                                                textAlign: "left",
                                            }}
                                        >
                                            Timestamp
                                        </TableCell>
                                        <TableCell
                                            sx={{
                                                bgcolor: "primary.main",
                                                color: "white",
                                                fontWeight: "bold",
                                                textAlign: "left",
                                            }}
                                        >
                                            Details
                                        </TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {actions.map((action, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{action.payloadAction}</TableCell>
                                            <TableCell>{convertDateInStandardFormat(action.entryDate)}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex", // Align items in a row (default behavior)
                                                        gap: 2, // Space between buttons
                                                        justifyContent: "flex-start", // Align buttons to the left
                                                        alignItems: "center", // Center-align buttons vertically
                                                    }}
                                                >
                                                    <Button
                                                        variant="outlined"
                                                        onClick={() => handleOpenJsonModal(action.request, false)}
                                                        sx={{
                                                            textTransform: "none", // Keep text in original case
                                                            fontWeight: "bold", // Bold text
                                                            color: "primary.main", // Use primary color for text
                                                            borderColor: "primary.main", // Match border with primary color
                                                            "&:hover": {
                                                                backgroundColor: "primary.light", // Hover effect
                                                            },
                                                        }}
                                                    >
                                                        View Data
                                                    </Button>
                                                    {action.responseError && (
                                                        <Button
                                                            variant="outlined"
                                                            onClick={() => handleOpenJsonModal(action.responseError, true)}
                                                            sx={{
                                                                textTransform: "none",
                                                                fontWeight: "bold",
                                                                color: "error.main", // Use error color for text
                                                                borderColor: "error.main", // Match border with error color
                                                                "&:hover": {
                                                                    backgroundColor: "error.light", // Hover effect
                                                                },
                                                            }}
                                                        >
                                                            View Errors
                                                        </Button>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Box>
                ) : (
                    <Typography>No details available.</Typography>
                )}
            </Box>
        </Modal>

            {/* JSON Modal */}
            <Modal open={jsonModalOpen} onClose={handleCloseJsonModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: "70vw",
                        height: "70vh",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        overflow: "auto",
                    }}
                >
                    <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
                        JSON Data
                    </Typography>

                    {/* Button Group */}
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "flex-end", // Align buttons to the right
                            mb: 3,
                        }}
                    >
                        {/* Toggle View Button */}
                        <Button
                            variant="outlined"
                            onClick={() => setViewAsTable(!viewAsTable)}
                            sx={{ marginRight: 2 }}
                        >
                            {viewAsTable ? "View as JSON" : "View as Table"}
                        </Button>

                        {/* Save JSON Button */}
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => downloadJson(selectedJson)}
                            sx={{ marginRight: 2 }}
                        >
                            Download
                        </Button>

                        {/* Close Button */}
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCloseJsonModal}
                        >
                            Close
                        </Button>
                    </Box>

                    {/* JSON/Table View */}
                    {viewAsTable ? (
                        renderJsonAsTable(selectedJson) // Display JSON in a tabular format
                    ) : (
                        <ReactJson src={selectedJson} theme="monokai" iconStyle="circle" collapsed={false} /> // Display JSON in raw format
                    )}
                </Box>
            </Modal>
        </>
    );
};

export default ActionModal;
