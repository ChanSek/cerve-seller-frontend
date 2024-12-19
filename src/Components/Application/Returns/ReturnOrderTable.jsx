import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  MenuItem,
  Button,
  IconButton,
  Tooltip,
  Popover,
  FormControl,
  InputLabel,
  Select,
  Box,
  Stack,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { postCall } from "../../../Api/axios.js";
import cogoToast from "cogo-toast";
import { EditOutlined } from "@mui/icons-material";
import { RETURN_REJECT_REASONS } from "./return-reject-reasons.js";
import { PICKUP_REJECT_REASONS } from "./pickup-failed-reason.js";

const RETURN_ORDER_STATUS = {
  Return_Initiated: "Return Initiated",
  Return_Rejected: "Return Rejected",
  Liquidated: "Liquidated",
  Reject: "Rejected",
  Rejected: "Rejected",
  Return_Approved: "Accepted",
  Return_Picked: "Picked", 
  Return_Pick_Failed: "Pick up Failed",
  Return_Failed: "Return Failed", 
  Return_Delivered: "Delivered"
};

const StyledTableCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    fontWeight: "bold",
  },
});

const ActionMenu = ({ row, handleRefresh }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [orderStatus, setOrderStatus] = useState(null);
  const [reasonId, setReasonId] = useState(null);
  // STATES
  const [inlineError, setInlineError] = useState({
    selected_status_error: "",
    reason_error: "",
  });

  const handleClick = (e) => {
    setOrderStatus(null);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setOrderStatus(null);
    setAnchorEl(null);
  };

  // use this function to check if any order is selected
  function checkIsOrderStatus() {
    if (!orderStatus) {
      setInlineError((error) => ({
        ...error,
        selected_status_error: "Please select status",
      }));
      return false;
    }
    return true;
  }

  // use this function to check if any reason is selected
  function checkReason() {
    if (!reasonId) {
      setInlineError((error) => ({
        ...error,
        reason_error: "Please select reason",
      }));
      return false;
    }
    return true;
  }

  const updateReturnState = () => {
    const url = `/api/v1/seller/${row.orderId}/item/return`;
    let data = {
      id: row._id,
      returnState: orderStatus,
    };
    if (orderStatus === RETURN_ORDER_STATUS.Reject || orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed || orderStatus === RETURN_ORDER_STATUS.Return_Failed) {
      data.reasonId = reasonId;
    } else { }
    postCall(url, data)
      .then((resp) => {
        cogoToast.success("Status updated successfully");
        handleClose();
        handleRefresh();
      })
      .catch((error) => {
        console.log(error);
        cogoToast.error(error.response?.data?.error || error.message);
      });
  };

  return (
    <>
      <Tooltip title="Update status">
        <IconButton color="primary" disabled={row.state !== "Return_Initiated" && row.state !== "Return_Approved" && row.state !== "Return_Pick_Failed" && row.state !== "Return_Picked"}>
          <EditOutlined onClick={handleClick} />
        </IconButton>
      </Tooltip>
      <Popover
        id="edit-order-status"
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Box sx={{ width: "400px", p: 2 }}>
          <Stack direction="column" spacing={2}>
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label">
                Select Status
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={orderStatus}
                label="Select Status"
                onChange={(e) => {
                  setInlineError((error) => ({
                    ...error,
                    selected_status_error: "",
                  }));
                  setOrderStatus(e.target.value);
                }}
              >
                {row.state === "Return_Initiated" && (
                  [
                    <MenuItem key={RETURN_ORDER_STATUS.Liquidated} value={RETURN_ORDER_STATUS.Liquidated}>
                      Liquidate
                    </MenuItem>,
                    <MenuItem key={RETURN_ORDER_STATUS.Reject} value={RETURN_ORDER_STATUS.Reject}>
                      Reject
                    </MenuItem>,
                    <MenuItem key={RETURN_ORDER_STATUS.Return_Approved} value={RETURN_ORDER_STATUS.Return_Approved}>
                      Accept
                    </MenuItem>
                  ])
                }
                {(row.state === "Return_Approved" || row.state === "Return_Pick_Failed") && (
                  [
                    <MenuItem key={RETURN_ORDER_STATUS.Return_Picked} value={RETURN_ORDER_STATUS.Return_Picked}>
                      Picked
                    </MenuItem>,
                    <MenuItem key={RETURN_ORDER_STATUS.Return_Pick_Failed} value={RETURN_ORDER_STATUS.Return_Pick_Failed}>
                      Pick up Failed
                    </MenuItem>,
                    <MenuItem key={RETURN_ORDER_STATUS.Return_Failed} value={RETURN_ORDER_STATUS.Return_Failed}>
                      Return Failed
                    </MenuItem>
                  ]
                )}
                {row.state === "Return_Picked" && (
                  <MenuItem key={RETURN_ORDER_STATUS.Return_Delivered} value={RETURN_ORDER_STATUS.Return_Delivered}>
                    Delivered
                  </MenuItem>
                )}
              </Select>
              {inlineError.selected_status_error && <Typography color="error" variant="subtitle2" style={{ marginLeft: '5px' }}>{inlineError.selected_status_error}</Typography>}
            </FormControl>
            {
              (orderStatus === RETURN_ORDER_STATUS.Reject || orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed || orderStatus === RETURN_ORDER_STATUS.Return_Failed) && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Reason
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={reasonId}
                    label="Select Status"
                    onChange={(e) => {
                      setInlineError((error) => ({
                        ...error,
                        reason_error: "",
                      }));
                      setReasonId(e.target.value);
                    }}
                  >
                    {orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed ?
                      PICKUP_REJECT_REASONS.map((reason, reasonIndex) => (
                        <MenuItem key={`reason-${reasonIndex}`} value={reason.key} style={{ maxWidth: '500px' }}>
                          {reason.value}
                        </MenuItem>
                      ))
                      :
                      RETURN_REJECT_REASONS.map((reason, reasonIndex) => (
                        <MenuItem key={`reason-${reasonIndex}`} value={reason.key} style={{ maxWidth: '500px' }}>
                          {reason.value}
                        </MenuItem>
                      ))
                    }

                  </Select>
                  {inlineError.reason_error && <Typography color="error" variant="subtitle2" style={{ marginLeft: '5px' }}>{inlineError.reason_error}</Typography>}
                </FormControl>
              )
            }
            <Stack direction="row" spacing={1} justifyContent="flex-end">
              <Button size="small" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="small"
                variant="contained"
                onClick={() => {
                  let allCheckPassed = true;
                  if (orderStatus === RETURN_ORDER_STATUS.Reject || orderStatus === RETURN_ORDER_STATUS.Return_Pick_Failed || orderStatus === RETURN_ORDER_STATUS.Return_Failed) {
                    allCheckPassed = [checkIsOrderStatus(), checkReason()].every(Boolean)
                  } else {
                    allCheckPassed = [checkIsOrderStatus()].every(Boolean);
                  }
                  if (!allCheckPassed) return;

                  updateReturnState()
                }}
              >
                Update
              </Button>
            </Stack>
          </Stack>
        </Box>
      </Popover>
    </>
  );
};

export default function InventoryTable(props) {
  const {
    page,
    rowsPerPage,
    totalRecords,
    handlePageChange,
    handleRowsPerPageChange,
    handleRefresh,
  } = props;

  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10));
    handlePageChange(0);
  };

  const renderCellContent = (column, value) => {
    if (typeof value === "boolean") {
      return (
        <div>
          <span className="ml-2">
            {value === false || value === null ? "No" : "Yes"}
          </span>
        </div>
      );
    } else if (typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value)) {
      // Check if the value is an HTML string
      return (
        <div
          className="html-content"
          dangerouslySetInnerHTML={{ __html: value }}
        />
      );
    } else {
      return column.format ? column.format(value) : value;
    }
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map((column) => (
                <StyledTableCell
                  key={column.id}
                  align={column.align}
                  style={{
                    minWidth: column.minWidth,
                    backgroundColor: "#1976d2",
                    color: "#fff",
                  }}
                  className="font-medium"
                >
                  {column.label}
                </StyledTableCell>
              ))}
              <StyledTableCell
                key="action-header"
                className="font-medium"
                style={{
                  backgroundColor: "#1976d2",
                  color: "#fff",
                }}
              >
                Action
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.data.map((row, index) => {
              return (
                <TableRow hover tabIndex={-1} key={index}>
                  {props.columns.map((column, idx) => {
                    const value = row[column.id];
                    if (column.id === "state") {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {RETURN_ORDER_STATUS[value]}
                        </TableCell>
                      );
                    } else {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {renderCellContent(column, value)}
                        </TableCell>
                      );
                    }
                  })}
                  <TableCell component="th" scope="row">
                    <ActionMenu row={row} handleRefresh={handleRefresh} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalRecords}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    </Paper>
  );
}
