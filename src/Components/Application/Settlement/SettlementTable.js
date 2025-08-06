import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Button,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { postCall, getCall } from "../../../Api/axios";
import PendingSettlementModal from "./PendingSettlementModal.js";
import SettledSettlementModal from "./SettledSettlementModal.js";


const StyledTableCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    fontWeight: "bold",
  },
});

const ThreeDotsMenu = (props) => {
  const { row, view } = props;
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [settlementDetails, setSettlementDetails] = useState(null);
  const [error, setError] = useState(null);

  const handleOpen = async (status) => {
    setOpen(true);
    setLoading(true);
    setError(null);
    await fetchSettlementDetails(status);
  };

  const handleClose = () => {
    setOpen(false);
    setSettlementDetails(null);
    setError(null);
  };

  const fetchSettlementDetails = async (status) => {
    setLoading?.(true);
    setError?.(null);
    try {
      const response = await getCall(`/api/v1/seller/${row?.merchantId}/${status}/settlement`);
      setSettlementDetails(response.data);
    } catch (err) {
      setError("Failed to fetch settlement details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const buttonText = view === "pending" ? "SETTLEMENT" : "VIEW";

  return (
    <>
      <Button variant="contained" size="small" onClick={() => handleOpen(view)}>
        {buttonText}
      </Button>
        <PendingSettlementModal
          open={open}
          onClose={handleClose}
          loading={loading}
          settlementDetails={settlementDetails}
          error={error}
          view={view}
          handleSettlementRefresh={() => fetchSettlementDetails(view)}
        />
    </>
  );
};


const SettlementTable = (props) => {
  const {
    view,
    columns,
    data,
    page,
    rowsPerPage,
    totalRecords,
    handlePageChange,
    handleRowsPerPageChange,
  } = props;
  const navigate = useNavigate();

  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10));
    handlePageChange(0);
  };

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            {columns.map((column) => (
              <StyledTableCell
                key={column.id}
                align={column.align}
                style={{
                  minWidth: column.minWidth,
                  backgroundColor: "#1976d2",
                  color: "#fff",
                }}
              >
                {column.label}
              </StyledTableCell>
            ))}
          </TableHead>
          <TableBody>
            {data.map((row, index) => (
              <TableRow hover tabIndex={-1} key={index}>
                {columns.map((column) => {
                  const value = row[column.id];
                  if (column.id === "Action") {
                    return (
                      <TableCell key={column.id} align={"left"}>
                        <ThreeDotsMenu view={view} row={row} />
                      </TableCell>
                    );
                  }
                  return (
                    <TableCell style={styles.tableCell} key={column.id} align={column.align}>
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
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
};

export default SettlementTable;

const styles = {
  tableCell: {
    padding: '6px',
    whiteSpace: 'nowrap', // Prevent line breaks
    //overflow: 'hidden', // Hide overflowed text
    //textOverflow: 'ellipsis', // Add ellipsis (...) for overflowed text
    minWidth: '150px', // Optional: Adjust based on the available space
  }
}