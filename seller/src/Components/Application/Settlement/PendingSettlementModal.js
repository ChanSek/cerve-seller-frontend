import React, { useState } from "react";
import {
  Paper,
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
  Tooltip,
  Divider,
  FormControlLabel,
  Switch,
  TablePagination
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { convertDateInStandardFormat } from "../../../utils/formatting/date";
import cogoToast from "cogo-toast";
import { postCall } from "../../../Api/axios.js";
import { useTheme } from "@mui/material/styles";
import OrderDetailsDialog from "../Order/OrderDetailsDialog";

const PendingSettlementModal = ({ open, onClose, loading, settlementDetails, error, handleSettlementRefresh,view }) => {
  const theme = useTheme();
  const [isMockCall, setIsMockCall] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleSettlement = (settlementId, action) => {
    let userInput = "";
    const validInputs = ["NP-NP", "MISC", "NIL"];
    if (action === "settle") {
      userInput = prompt(`Please enter any of the settlement type ${validInputs} before proceeding:`, "");
      if (!userInput) {
        cogoToast.warn("Action cancelled: Type input is required.");
        return;
      }
      if (!validInputs.includes(userInput.trim())) {
        cogoToast.warn("Action cancelled: Valid settle type is required.");
        return;
      }
    }
    postCall(`/api/v1/seller/${settlementId}/${action}?type=${userInput}&isMockCall=${isMockCall}`, {})
      .then((resp) => {
        if (resp?.status === 200) {
          cogoToast.success("Action taken successfully");
          handleSettlementRefresh();
        } else {
          cogoToast.error(resp.message);
        }
      })
      .catch((error) => {
        console.error(error);
        cogoToast.error(error.response.data.message);
      });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const stickyCellStyle = {
    position: "sticky",
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: 2,
  };

  const paginatedData = settlementDetails?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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
        ) : settlementDetails && settlementDetails.length > 0 ? (
          <Box>
           {view == "pending" &&  <Typography variant="h5" color="primary" gutterBottom>
              Pending Settlement Details
            </Typography>}
            {view == "settled" &&  <Typography variant="h5" color="primary" gutterBottom>
              Settlement Details
            </Typography>}
            {view == "pending" && <Box
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
              gap={2}
              mb={2}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={isMockCall}
                    onChange={(e) => setIsMockCall(e.target.checked)}
                    color="primary"
                  />
                }
                label="Mock Call"
              />
              <Button
                variant="outlined"
                size="small"
                startIcon={<RefreshIcon />}
                onClick={() => handleSettlementRefresh()}
              >
                Refresh
              </Button>
            </Box>}

            <TableContainer component={Paper} elevation={1} sx={{ mb: 2 }}>
              <Table sx={{ minWidth: 1200 }} size="small">
                <TableHead sx={{ bgcolor: 'action.hover' }}>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Settlement Id</TableCell>
                    <TableCell>Settlement Tranaction Id</TableCell>
                    <TableCell>Collector</TableCell>
                    <TableCell>Recon Accord</TableCell>
                    <TableCell>Error</TableCell>
                    <TableCell>Created On</TableCell>
                    <TableCell>Modified On</TableCell>
                    {view == "pending" && <TableCell sx={{ ...stickyCellStyle, zIndex: 3, bgcolor: 'action.hover' }}>Actions</TableCell>}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.map((item) => (
                    <TableRow key={item._id}>
                      <TableCell>
                        <OrderDetailsDialog
                          orderId={item.orderId}
                          triggerComponent={
                            <Typography
                              sx={{
                                color: "#1565c0",
                                cursor: "pointer",
                                "&:hover": { textDecoration: "underline" },
                              }}
                            >
                              {item.orderId}
                            </Typography>
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <Tooltip
                          title={
                            <Box
                              sx={{
                                padding: 2,
                                borderRadius: 2,
                                backgroundColor: theme.palette.background.default,
                                boxShadow: theme.shadows[4],
                                maxWidth: 300,
                                color: theme.palette.text.primary,
                              }}
                            >
                              <Typography
                                variant="h6"
                                gutterBottom
                                align="center"
                                sx={{ color: theme.palette.primary.main }}
                              >
                                Order Settlement Details
                              </Typography>
                              <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                                {[
                                  { label: "Recon Status:", value: item.reconStatus || "N/A" },
                                  { label: "Settled Status:", value: item.interParticipantStatus || "N/A" },
                                  { label: "Self Status:", value: item.selfStatus || "N/A" },
                                  { label: "Reference No.:", value: item.referenceNo || "N/A" },
                                  <Divider key="divider-1" sx={{ my: 3, borderColor: 'primary.main' }} />,
                                  { label: "Self Amount:", value: item.selfAmount?.toFixed(2) || "N/A" },
                                  { label: "Total Amount:", value: item.totalAmount?.toFixed(2) || "N/A" },
                                  { label: "Buyer Commission:", value: item.buyerCommission?.toFixed(2) || "N/A" },
                                  { label: "Withholding Amount:", value: item.withholdingAmount?.toFixed(2) || "N/A" },
                                  { label: "TDS:", value: item.tds?.toFixed(2) || "N/A" },
                                  { label: "TCS:", value: item.tcs?.toFixed(2) || "N/A" },
                                  <Divider key="divider-2" sx={{ my: 3, borderColor: 'primary.main' }} />,
                                  { label: "Buyer Comm. Diff:", value: item.buyerCommissionDiff?.toFixed(2) || "N/A" },
                                  { label: "Withholding Diff:", value: item.withholdingAmountDiff?.toFixed(2) || "N/A" },
                                  { label: "TDS Diff:", value: item.tdsDiff?.toFixed(2) || "N/A" },
                                  { label: "TCS Diff:", value: item.tcsDiff?.toFixed(2) || "N/A" },
                                  { label: "Total Amount Diff:", value: item.totalAmountDiff?.toFixed(2) || "N/A" },
                                ].map((row, index) =>
                                  typeof row === "object" ? (
                                    <Box key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                                      <Typography variant="body2" fontWeight="bold">
                                        {row.label}
                                      </Typography>
                                      <Typography variant="body2">{row.value}</Typography>
                                    </Box>
                                  ) : row
                                )}
                              </Box>
                            </Box>
                          }
                          arrow
                          placement="right"
                        >
                          <Box
                            component="span"
                            sx={{
                              color: theme.palette.primary.main,
                              cursor: "pointer",
                              "&:hover": {
                                color: theme.palette.primary.dark,
                              },
                            }}
                          >
                            {item._id}
                          </Box>
                        </Tooltip>
                      </TableCell>
                      <TableCell>{item.transactionId}</TableCell>
                      <TableCell>{item.collectorAppId}</TableCell>
                      <TableCell>
                        {item.reconAccord === true ? (
                          <Typography sx={{ color: "green", fontWeight: "bold" }}>Yes</Typography>
                        ) : item.reconAccord === false ? (
                          <Typography sx={{ color: "red", fontWeight: "bold" }}>No</Typography>
                        ) : (
                          <Typography>N/A</Typography>
                        )}
                      </TableCell>
                      <TableCell>{item.errorMessage}</TableCell>
                      <TableCell>{convertDateInStandardFormat(item.entryDate)}</TableCell>
                      <TableCell>{convertDateInStandardFormat(item.updateDate)}</TableCell>
                      {view == "pending" && <TableCell sx={stickyCellStyle}>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="info"
                            onClick={() => handleSettlement(item._id, "recon")}
                          >
                            RECON
                          </Button>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleSettlement(item._id, "settle")}
                          >
                            SETTLE
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleSettlement(item._id, "report")}
                          >
                            REPORT
                          </Button>
                        </Box>
                      </TableCell>}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              component="div"
              count={settlementDetails.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 25, 50]}
              sx={{ mt: 2 }}
            />
          </Box>
        ) : (
          <Typography>No details available.</Typography>
        )}
      </Box>
    </Modal>
  );
};

export default PendingSettlementModal;
