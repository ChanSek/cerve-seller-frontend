import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";

/** Styled header cell */
export const StyledTableHeadCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  fontSize: "0.9rem",
  backgroundColor: theme.palette.grey[200],
  color: theme.palette.text.primary,
  borderBottom: `2px solid ${theme.palette.divider}`,
}));

/** Styled body cell */
export const StyledTableBodyCell = styled(TableCell)(() => ({
  fontSize: "0.9rem",
  borderBottom: "1px solid #eee",
}));
