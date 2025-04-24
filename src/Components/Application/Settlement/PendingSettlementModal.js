import React from "react";
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
} from "@mui/material";
import { toast } from "react-toastify";
import { postCall } from "../../../Api/axios.js";
import { useTheme } from "@mui/material/styles";

const PendingSettlementModal = ({ open, onClose, loading, settlementDetails, error }) => {
  const theme = useTheme();

  // Handle settlement actions (settle, report, recon) for a given settlementId
  const handleSettlement = (settlementId, action) => {
    let userInput = "";
    const validInputs = ["NP-NP", "MISC", "NIL"];
    if (action === "settle") {
      userInput = prompt(
        "Please enter any of the settlement type " + validInputs + " before proceeding:",
        ""
      );
      if (!userInput) {
        toast.warn("Action cancelled: Type input is required.");
        return;
      }
      if (!validInputs.includes(userInput.trim())) {
        toast.warn("Action cancelled: Valid settle type is required.");
        return;
      }
    }
    postCall(`/api/v1/seller/${settlementId}/${action}?type=${userInput}`, {})
      .then((resp) => {
        if (resp?.status === 200) {
          toast.success("Action taken successfully");
        } else {
          toast.error(resp.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.error);
      });
  };

  // Assign a settlement for a given row by its id
  const handleAssignForSettlement = (itemId) => {
    postCall(`/api/v1/seller/assign`, [itemId])
      .then((resp) => {
        if (resp?.status === 200) {
          toast.success("Assigned successfully");
        } else {
          toast.error(resp.message);
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response.data.error);
      });
  };

  // Define sticky styling for the Actions column cells
  const stickyCellStyle = {
    position: "sticky",
    right: 0,
    backgroundColor: theme.palette.background.paper,
    // Increase zIndex for header cell so it stays above other cells
    zIndex: 2,
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%", // Center vertically
          left: "50%", // Center horizontally
          transform: "translate(-50%, -50%)", // Adjust to center the modal
          width: "85vw", // 85% of the viewport width
          height: "85vh", // 85% of the viewport height
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto", // Allows scrolling if needed
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : settlementDetails && settlementDetails.length > 0 ? (
          <Box>
            <div className="mb-4 flex flex-row justify-between items-center">
              <label style={{ color: theme.palette.primary.main }} className="font-semibold text-2xl">
                Pending Settlement Details
              </label>
            </div>

            <TableContainer
              sx={{
                maxHeight:"70vh",
                overflowY: "auto",
                overflowX: "auto", // Enables horizontal scrolling
                display: "block",
                whiteSpace: "nowrap", // Prevents cells from wrapping
              }}
            >
              <Table sx={{ minWidth: 1200 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Collector</TableCell>
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
                    <TableCell sx={{ ...stickyCellStyle, zIndex: 3 }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {settlementDetails.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>{item.collectorAppId}</TableCell>
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
                      <TableCell sx={stickyCellStyle}>
                        {/* For unassigned rows, show an assign button; for assigned ones, show action buttons */}
                        {!item.settlementId ? (
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleAssignForSettlement(item._id)}
                          >
                            ASSIGN
                          </Button>
                        ) : (
                          <Box sx={{ display: "flex", gap: 1 }}>
                            <Button
                              variant="contained"
                              color="success"
                              onClick={() => handleSettlement(item.settlementId, "settle")}
                            >
                              SETTLE
                            </Button>
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSettlement(item.settlementId, "report")}
                            >
                              REPORT
                            </Button>
                            <Button
                              variant="contained"
                              color="info"
                              onClick={() => handleSettlement(item.settlementId, "recon")}
                            >
                              RECON
                            </Button>
                          </Box>
                        )}
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
  );
};

export default PendingSettlementModal;
