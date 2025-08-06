import { useState, Fragment } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// Removed MoreVertIcon, MenuItem, Button, Menu as they are for the removed actions menu
import { styled, useTheme } from "@mui/material/styles";
import moment from "moment"; // Keep if convertDateInStandardFormat uses it or if needed elsewhere
import { useNavigate } from "react-router-dom";
import { Box, Typography, Tooltip, Tabs, Tab } from "@mui/material"; // Removed IconButton

import { getFullAddress } from "./../../../utils/orders.js";
import { convertDateInStandardFormat } from "../../../utils/formatting/date.js";

// Styled components for better readability and reusability
const StyledPaper = styled(Paper)(({ theme }) => ({
  width: "100%",
  overflow: "hidden",
  boxShadow: theme.shadows[3],
  borderRadius: theme.shape.borderRadius,
}));

const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: "bold",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  whiteSpace: 'nowrap',
  padding: theme.spacing(1.5, 2),
}));

const StyledTableBodyCell = styled(TableCell)(({ theme }) => ({
  padding: theme.spacing(1.5, 2),
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '250px', // Adjust as needed
}));

export default function OrderTable(props) {
  const theme = useTheme();

  const {
    page,
    columns,
    data,
    rowsPerPage,
    totalRecords,
    handlePageChange,
    handleRowsPerPageChange,
    onTabChange,
  } = props;
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const orderStateCategories = ['ONGOING', 'COMPLETED', 'CANCELLED'];
  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10));
    handlePageChange(0);
  };

  // Handler for changing the active tab.
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
   // page(0); // Reset to the first page when the tab changes.

    // Propagate the new tab value to the parent component
    if (onTabChange) {
      onTabChange(orderStateCategories[newValue]);
    }

    // Propagate page reset to the parent.
    if (handlePageChange) {
      handlePageChange(0);
    }
  };

  const renderColumn = (row, column) => {
    switch (column.id) {
      case "orderId":
        return (
          // Make the Order ID itself clickable for navigation
          <Typography
            variant="body2"
            color="primary"
            sx={{ textDecoration: 'underline', cursor: 'pointer' }}
            onClick={(e) => {
              e.stopPropagation(); // Prevent any parent click handlers
              navigate(`/application/orders/${row?.orderId}`);
            }}
          >
            {row.orderId}
          </Typography>
        );
      case "transactionId":
        return <Typography variant="body2">{row.transactionId}</Typography>;
      case "createdAt":
        return <Typography variant="body2">{convertDateInStandardFormat(row.createdAt)}</Typography>;
      case "updatedAt":
        return <Typography variant="body2">{convertDateInStandardFormat(row.updatedAt)}</Typography>;
      case "state":
        return (
          <Typography
            variant="body2"
            sx={{
              fontWeight: 'medium',
              color: theme.palette.mode === 'dark' ? theme.palette.info.light : theme.palette.info.dark
            }}
          >
            {row.state}
          </Typography>
        );
      case "payment_type":
        return <Typography variant="body2">{row.paymentType}</Typography>;
      case "provider_name":
        return <Typography variant="body2">{row.organization?.name || 'N/A'}</Typography>;
      case "total_amt":
        return (
          <Typography variant="body2" fontWeight="bold">
            ₹{parseFloat(row.totalAmount).toFixed(2)}
          </Typography>
        );
      case "delivery_info":
        return (
          <Typography variant="body2" sx={{ textTransform: "capitalize" }}>
            {getFullAddress(row.deliveryAddress)}
          </Typography>
        );
      default:
        return <Typography variant="body2">{row[column.id]}</Typography>;
    }
  };

  return (
    <Fragment>
      <Box sx={{ borderColor: 'divider', mb: 2 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="order state tabs">
          <Tab label="Ongoing" />
          <Tab label="Completed" />
          <Tab label="Cancelled" />
        </Tabs>
      </Box>
      <StyledPaper>
        <TableContainer>
          <Table stickyHeader aria-label="order table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <StyledTableHeadCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                  >
                    {column.label}
                  </StyledTableHeadCell>
                ))}
                {/* Removed Actions column header */}
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <StyledTableBodyCell colSpan={columns.length} align="center"> {/* Adjusted colSpan */}
                    <Typography variant="subtitle1" color="text.secondary" sx={{ py: 3 }}>
                      No orders found.
                    </Typography>
                  </StyledTableBodyCell>
                </TableRow>
              ) : (
                data.map((row) => (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.orderId || row.id}
                  // Removed onClick from TableRow
                  >
                    {columns.map((column) => {
                      const cellContent = renderColumn(row, column);
                      const tooltipText = (() => {
                        // Handle specific cases for tooltip text if renderColumn returns JSX
                        if (column.id === "delivery_info") {
                          return getFullAddress(row.deliveryAddress);
                        }
                        // For other columns, try to get the raw string value
                        // Ensure this is a string to avoid issues with Tooltip 'title' prop
                        return row[column.id] ? String(row[column.id]) : '';
                      })();

                      return (
                        <StyledTableBodyCell key={column.id} align={column.align}>
                          <Tooltip
                            title={tooltipText}
                            placement="bottom-start"
                            arrow
                          >
                            <Box
                              sx={{
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {cellContent}
                            </Box>
                          </Tooltip>
                        </StyledTableBodyCell>
                      );
                    })}
                    {/* Removed Actions cell */}
                  </TableRow>
                ))
              )}
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
      </StyledPaper></Fragment>
  );
}