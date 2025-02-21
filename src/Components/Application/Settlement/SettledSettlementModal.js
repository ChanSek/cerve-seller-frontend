import React, { useEffect, useState } from "react";
import { convertDateInStandardFormat } from "../../../utils/formatting/date.js";
import {
    Modal,
    Box,
    Typography,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Checkbox
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const SettledSettlementModal = ({ open, onClose, loading, settlementDetails, error }) => {
    const theme = useTheme();
    return (
        <Modal open={open} onClose={onClose}>
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
                ) : settlementDetails?.length > 0 ? (
                    <Box>
                        <div className="mb-4 flex flex-row justify-between items-center">
                            <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
                            Order Settled Details
                            </label>
                        </div>
                        <TableContainer
                            sx={{
                                maxHeight: 400,
                                overflowY: "auto",
                                display: "block",
                                whiteSpace: "nowrap",
                            }}
                        >
                            <Table sx={{ minWidth: 1200 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Order ID</TableCell>
                                        <TableCell title="Fulfilment State">FS</TableCell>
                                        <TableCell>Recon Accord</TableCell>
                                        <TableCell title="Recon Status">RS</TableCell>
                                        <TableCell title="Inter Participant Status">IPS</TableCell>
                                        <TableCell title="Self Status">SS</TableCell>
                                        <TableCell>Error</TableCell>
                                        <TableCell title="Total Amount">TA</TableCell>
                                        <TableCell title="Total Amount Difference">TAD</TableCell>
                                        <TableCell title="Self Amount">SA</TableCell>
                                        <TableCell title="Buyer Commission">BC</TableCell>
                                        <TableCell title="Buyer Commission Difference">BCD</TableCell>
                                        <TableCell title="Withholding Amount">WA</TableCell>
                                        <TableCell title="Withholding Amount Difference">WAD</TableCell>
                                        <TableCell title="Tax Deducted at Source">TDS</TableCell>
                                        <TableCell title="Tax Deducted at Source Difference">TDSD</TableCell>
                                        <TableCell title="Tax Collected at Source">TCS</TableCell>
                                        <TableCell title="Tax Collected at Source Difference">TCSD</TableCell>
                                        <TableCell>Created At</TableCell>
                                        <TableCell>Updated At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {settlementDetails.map((item) => (
                                        <TableRow key={item._id}>
                                            <TableCell>{item.orderId}</TableCell>
                                            <TableCell>{item.fulfilmentState}</TableCell>
                                            <TableCell>
                                                {item.reconAccord === true ? (
                                                    <Typography sx={{ color: "green", fontWeight: "bold" }}>Yes</Typography>
                                                ) : item.reconAccord === false ? (
                                                    <Typography sx={{ color: "red", fontWeight: "bold" }}>No</Typography>
                                                ) : (
                                                    <Typography>N/A</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>{item.reconStatus}</TableCell>
                                            <TableCell>{item.interParticipantStatus}</TableCell>
                                            <TableCell>{item.selfStatus}</TableCell>
                                            <TableCell>{item.errorMessage}</TableCell>
                                            <TableCell>{item.totalAmount?.toFixed(2)}</TableCell>
                                            <TableCell>{item.totalAmountDiff?.toFixed(2)}</TableCell>
                                            <TableCell>{item.selfAmount?.toFixed(2)}</TableCell>
                                            <TableCell>{item.buyerCommission?.toFixed(2)}</TableCell>
                                            <TableCell>{item.buyerCommissionDiff?.toFixed(2)}</TableCell>
                                            <TableCell>{item.withholdingAmount?.toFixed(2)}</TableCell>
                                            <TableCell>{item.withholdingAmountDiff?.toFixed(2)}</TableCell>
                                            <TableCell>{item.tds?.toFixed(2)}</TableCell>
                                            <TableCell>{item.tdsDiff?.toFixed(2)}</TableCell>
                                            <TableCell>{item.tcs?.toFixed(2)}</TableCell>
                                            <TableCell>{item.tcsDiff?.toFixed(2)}</TableCell>
                                            <TableCell>{convertDateInStandardFormat(item.entryDate)}</TableCell>
                                            <TableCell>{convertDateInStandardFormat(item.updateDate)}</TableCell>
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
    );
};

export default SettledSettlementModal;
