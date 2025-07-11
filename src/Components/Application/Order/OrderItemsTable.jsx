// OrderItemsTable.jsx - Refactored and styled

import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Collapse,
  Menu,
  MenuItem,
  Card,
  CardContent,
  Typography,
  Tooltip,
  Box
} from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const OrderItemsTable = ({ order, onPartialOrderCancel, isSuperAdmin }) => {
  const [expandedRow, setExpandedRow] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleExpandClick = (index) => {
    setExpandedRow(expandedRow === index ? null : index);
  };

  const handleMenuClick = (event, item) => {
    setAnchorEl(event.currentTarget);
    setSelectedItem(item);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedItem(null);
  };

  const handlePartialCancel = () => {
    if (selectedItem) {
      onPartialOrderCancel({ order_id: order?._id, item: selectedItem });
      handleMenuClose();
    }
  };

  const items = order?.items || [];

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>Items Summary</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Item</TableCell>
              <TableCell align="center">Qty</TableCell>
              <TableCell align="center">Price</TableCell>
              <TableCell align="center">Total</TableCell>
              {!isSuperAdmin && <TableCell align="right">Actions</TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item, index) => {
              const isExpanded = expandedRow === index;
              const total = parseFloat(item?.price?.value || 0) * (item?.quantity?.count || 1);
              return (
                <React.Fragment key={item.id}>
                  <TableRow hover>
                    <TableCell>
                      <IconButton onClick={() => handleExpandClick(index)}>
                        {isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </IconButton>
                    </TableCell>
                    <TableCell>{item?.descriptor?.name}</TableCell>
                    <TableCell align="center">{item?.quantity?.count}</TableCell>
                    <TableCell align="center">₹ {item?.price?.value}</TableCell>
                    <TableCell align="center">₹ {total.toFixed(2)}</TableCell>
                    {!isSuperAdmin && (
                      <TableCell align="right">
                        <Tooltip title="Actions">
                          <IconButton onClick={(e) => handleMenuClick(e, item)}>
                            <MoreVertIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    )}
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Box margin={2}>
                          <Typography variant="body2">
                            ID: {item.id}<br />
                            Category: {item.category_id || "-"}<br />
                            Tags: {item.tags?.map(tag => tag.code).join(", ") || "-"}
                          </Typography>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              );
            })}
          </TableBody>
        </Table>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handlePartialCancel}>Partial Cancel</MenuItem>
        </Menu>
      </CardContent>
    </Card>
  );
};

export default OrderItemsTable;
