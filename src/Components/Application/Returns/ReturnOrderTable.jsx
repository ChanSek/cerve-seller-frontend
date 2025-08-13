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
  Button,
  Box,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import ReturnDetails from "./ReturnDetails"; // ⬅️ import your modal component

const StyledTableCell = styled(TableCell)({
  "&.MuiTableCell-root": {
    fontWeight: "bold",
  },
});

export default function InventoryTable(props) {
  const {
    page,
    rowsPerPage,
    totalRecords,
    handlePageChange,
    handleRowsPerPageChange,
    handleRefresh,
    columns,
    data,
  } = props;

  const [selectedReturnId, setSelectedReturnId] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const handleRowClick = (id,category) => {
    setSelectedReturnId(id);
    setSelectedCategory(category);
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setSelectedReturnId(null);
    setOpenDialog(false);
  };

  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10));
    handlePageChange(0);
  };

  const renderCellContent = (column, value) => {
    if (typeof value === "boolean") {
      return <span className="ml-2">{value ? "Yes" : "No"}</span>;
    } else if (typeof value === "string" && /<\/?[a-z][\s\S]*>/i.test(value)) {
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
    <>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
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
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  hover
                  key={index}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleRowClick(row?.order,row?.category)}
                >
                  {columns.map((column) => {
                    const value = row[column.id];
                    return (
                      <TableCell key={column.id} align={column.align}>
                        {renderCellContent(column, value)}
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

      {/* Return Details Modal */}
      {selectedReturnId && (
        <ReturnDetails
          id={selectedReturnId}
          open={openDialog}
          category={selectedCategory}
          onClose={handleDialogClose}
        />
      )}
    </>
  );
}
