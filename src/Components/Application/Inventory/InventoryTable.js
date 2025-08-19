import { useState, Fragment } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CachedIcon from "@mui/icons-material/Cached";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import { styled } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { getCall, putCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import Tooltip from "@mui/material/Tooltip";
import { convertDateInStandardFormat } from "../../../utils/formatting/date.js";
import {
  FormControlLabel,
  IconButton,
  InputAdornment,
  Modal,
  Radio,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
  useTheme
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import PublishIcon from '@mui/icons-material/Publish';
import LinkIcon from '@mui/icons-material/Link';

import ViewProductDetails from '../Product/ViewProductDetails';
import AddProductDialog from "../Product/AddProductDialog";

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
    maxWidth: '250px', // Adjust as needed to prevent excessive width
}));

const StyledModalPaper = styled(Paper)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(3, 5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: theme.shadows[5],
  minWidth: 400,
  maxWidth: 600,
}));

export default function InventoryTable(props) {
  const theme = useTheme();

  const {
    page,
    rowsPerPage,
    totalRecords,
    handlePageChange,
    handleRowsPerPageChange,
    onRefresh,
    setShowCustomizationModal,
    getProducts,
    fetchCustomizationItem,
    customizationGroups = [],
    storeId,
    data,
    category
  } = props;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [initialGroup, setInitialGroup] = useState(null);

  const [isAddEditDialogOpen, setIsAddEditDialogOpen] = useState(false);
  const [productToEditId, setProductToEditId] = useState(null);
  const [productToEditCategory, setProductToEditCategory] = useState(null);

  const [viewProductDialogOpen, setViewProductDialogOpen] = useState(false);
  const [productToViewId, setProductToViewId] = useState(null);


  const updateInitialCustomizationGroup = async () => {
    if (!selectedRow || !initialGroup) {
      cogoToast.error("Please select a product and a customization group.");
      return;
    }
    try {
      const url = `/api/v1/products/${selectedRow.commonDetails.productId}`;
      const data = { commonDetails: { customizationGroupId: initialGroup } };
      const res = await putCall(url, data);
      setSelectedRow(null);
      setInitialGroup(null);
      setShowModal(false);
      getProducts();
      cogoToast.success("Customization group updated successfully!");
    } catch (error) {
      console.error("Error updating customization group:", error);
      cogoToast.error(error.response?.data?.error || "Failed to update customization group.");
    }
  };

  const onPageChange = (event, newPage) => {
    handlePageChange(newPage);
  };

  const onRowsPerPageChange = (event) => {
    handleRowsPerPageChange(parseInt(event.target.value, 10));
    handlePageChange(0);
  };

  // ThreeDotsMenu (inline as requested, but be aware of React Hook rule violation)
  const ThreeDotsMenu = (props) => {
    // WARNING: This useState violates the "React Hook 'useState' cannot be called inside a callback" rule.
    // If you encounter that error, this component needs to be moved outside InventoryTable.
    const [anchorEl, setAnchorEl] = useState(null);
    const openMenu = Boolean(anchorEl);

    const handleClick = (e) => {
      setAnchorEl(e.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    const { row } = props;

    const handlePublishState = async (product_id, published) => {
      try {
        const url = `/api/v1/seller/productId/${category}/${product_id}/publish`;
        await putCall(url, { published: !published });
        cogoToast.success(`Product ${published ? "unpublished" : "published"} successfully!`);
        onRefresh();
      } catch (error) {
        console.error("Error updating publish state:", error);
        cogoToast.error(error.response?.data?.error || "Failed to update product state.");
      } finally {
        handleClose();
      }
    };

    const handleEditProductClick = () => {
      handleClose();
      if (row.type === "customization") {
        fetchCustomizationItem(row.productId);
        setShowCustomizationModal(true);
      } else {
        setProductToEditId(row.commonDetails?.productId);
        setProductToEditCategory(row.commonDetails?.category);
        setIsAddEditDialogOpen(true);
      }
    };

    const handleChooseInitialGroupClick = () => {
      handleClose();
      setSelectedRow(row);
      setShowModal(true);
    };

    const handleViewProductClick = () => {
      handleClose();
      setProductToViewId(row.commonDetails?.productId);
      setViewProductDialogOpen(true);
    };

    return (
      <Fragment>
        <Tooltip title="Actions">
          <IconButton onClick={handleClick} size="small">
            <MoreVertIcon />
          </IconButton>
        </Tooltip>
        <Menu
          id="card-actions-menu"
          anchorEl={anchorEl}
          keepMounted
          open={openMenu}
          onClose={handleClose}
        >
          {/* <MenuItem onClick={handleViewProductClick}>
            <VisibilityIcon sx={{ mr: 1 }} fontSize="small" /> View Details
          </MenuItem> */}
          <MenuItem onClick={handleEditProductClick}>
            <EditIcon sx={{ mr: 1 }} fontSize="small" /> Edit
          </MenuItem>
          <MenuItem onClick={() => handlePublishState(row?.commonDetails?.productId, row?.commonDetails?.published)}>
            <PublishIcon sx={{ mr: 1 }} fontSize="small" />
            {row?.commonDetails?.published ? "Unpublish" : "Publish"}
          </MenuItem>
          {/* {row.type !== "customization" && (
            <MenuItem onClick={handleChooseInitialGroupClick}>
              <LinkIcon sx={{ mr: 1 }} fontSize="small" /> Choose Initial Group
            </MenuItem>
          )} */}
        </Menu>
      </Fragment>
    );
  };

  const renderCellContent = (column, value) => {
    if (typeof value === "boolean") {
      return (
        <Box component="span" sx={{ ml: 1, fontWeight: value ? 'normal' : 'bold', color: value ? 'success.main' : 'error.main' }}>
          {value ? "Yes" : "No"}
        </Box>
      );
    }
    // This assumes 'column' is a full column object passed from 'props.columns'
    // If column.format exists, apply it. Otherwise, return the value directly.
    return column && column.format ? column.format(value) : value;
  };

  const renderCustomizationGroups = () => {
    const filteredProducts = customizationGroups.filter((product) =>
      product.name.toLowerCase().includes(searchInput.toLowerCase())
    );
    return filteredProducts.map((customizationItem) => (
      <Box
        key={customizationItem._id}
        onClick={() => setInitialGroup(customizationItem._id)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 1.5,
          mb: 1,
          border: `1px solid ${theme.palette.primary.light}`,
          borderRadius: theme.shape.borderRadius,
          cursor: 'pointer',
          backgroundColor: initialGroup === customizationItem._id ? theme.palette.primary.light + '1A' : theme.palette.background.paper,
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: theme.palette.action.hover,
          },
        }}
      >
        <Typography variant="body1" sx={{ ml: 1 }}>
          {customizationItem.name} {customizationItem.description && ` - (${customizationItem.description})`}
        </Typography>
        <FormControlLabel
          value={false}
          control={
            <Radio
              size="small"
              checked={initialGroup === customizationItem._id}
              onChange={() => setInitialGroup(customizationItem._id)}
            />
          }
          label=""
          sx={{ mr: 0 }}
        />
      </Box>
    ));
  };

  const handleProductClick = (productId) => {
    setProductToViewId(productId);
    setViewProductDialogOpen(true);
  };

  const handleProductViewClose = () => {
    setViewProductDialogOpen(false);
    setProductToViewId(null);
  };

  const handleAddEditDialogClose = () => {
    setIsAddEditDialogOpen(false);
    setProductToEditId(null);
    setProductToEditCategory(null);
    onRefresh();
  };

  // Define the columns for the table. SKU is NOT a direct column here.
  // Ensure the order matches how you want to render them in TableBody.
  const columns = [
    { id: 'subCategory', label: 'Category', minWidth: 150, align: 'left' },
    // { id: 'productId', label: 'Parent Item Id', minWidth: 150, align: 'left' },
    // { id: 'productVariantId', label: 'Item Id', minWidth: 150, align: 'left' },
    {
      id: 'productName',
      label: 'Product Name',
      minWidth: 200,
      align: 'left',
      // No format here, as it will be a clickable name with tooltip
    },
    { id: 'published', label: 'Published', minWidth: 100, align: 'left' },
    { id: 'createdAt', label: 'Created At', minWidth: 100, align: 'left' },
    { id: 'updatedAt', label: 'Updated At', minWidth: 100, align: 'left' },
  ];


  return (
    <StyledPaper>
      {/* <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}>
          Product Inventory
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon color="action" />
                </InputAdornment>
              ),
              sx: { borderRadius: theme.shape.borderRadius * 2 }
            }}
            sx={{ minWidth: 200 }}
          />
          <Tooltip title="Refresh Inventory">
            <IconButton onClick={onRefresh} color="primary" sx={{ p: 1, borderRadius: '50%' }}>
              <CachedIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box> */}

      <TableContainer>
        <Table stickyHeader aria-label="inventory table">
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
              <StyledTableHeadCell>
                Actions
              </StyledTableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length === 0 ? (
              <TableRow>
                <StyledTableBodyCell colSpan={columns.length + 1} align="center">
                  <Typography variant="subtitle1" color="text.secondary" sx={{ py: 3 }}>
                    No products found.
                  </Typography>
                </StyledTableBodyCell>
              </TableRow>
            ) : (
              data?.map((item, index) => (
                <Fragment key={item._id || `product-${index}`}>
                  {item.variantSpecificDetails.map((variant, idx) => (
                    <TableRow
                      key={`${variant._id}`}
                      hover
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                      {/* Common details for the product (rowSpanned) */}
                      {idx === 0 && (
                        <>
                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'subCategory'), item.commonDetails.subCategory)}
                          </StyledTableBodyCell>
                          {/* <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'productId'), variant.productId)}
                          </StyledTableBodyCell> */}
                          {/* <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'productVariantId'), variant.productVariantId)}
                          </StyledTableBodyCell> */}


                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {/* Product Name with Tooltip for all variants */}
                            <Tooltip
                              title={
                                <Box sx={{ p: 1 }}>
                                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                    {item.commonDetails.productName} Details:
                                  </Typography>
                                  {item.variantSpecificDetails.map((v, vIdx) => (
                                    <Box key={v.sku || vIdx} sx={{ mb: vIdx < item.variantSpecificDetails.length - 1 ? 1 : 0 }}>
                                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        SKU: {v.sku || 'N/A'}
                                      </Typography>
                                      <Typography variant="body2">
                                        Qty: {v.availableQty}
                                      </Typography>
                                      <Typography variant="body2">
                                        MRP: {v.price?.toFixed(2) || 'N/A'}
                                      </Typography>
                                      <Typography variant="body2">
                                        Selling Price: {v.purchasePrice?.toFixed(2) || 'N/A'}
                                      </Typography>
                                      <Typography variant="body2">
                                        Measure: {v.uomValue || ''} {item.commonDetails.uom || ''}
                                      </Typography>
                                    </Box>
                                  ))}
                                </Box>
                              }
                              arrow
                              placement="right"
                            >
                              <Button
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent row click if any
                                  handleProductClick(item.commonDetails.productId);
                                }}
                                variant="text"
                                sx={{ textTransform: 'none', minWidth: 'unset', p: 0 }}
                              >
                                <Typography variant="body2" color="primary" sx={{ textDecoration: 'underline', cursor: 'help' }}>
                                  {renderCellContent(columns.find(c => c.id === 'productName'), item.commonDetails.productName)}
                                </Typography>
                              </Button>
                            </Tooltip>
                          </StyledTableBodyCell>
                        </>
                      )}

                      {/* Published state and actions (rowSpanned) */}
                      {idx === 0 && (
                        <>
                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'published'), item.commonDetails.published)}
                          </StyledTableBodyCell>
                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'createdAt'), convertDateInStandardFormat(item.commonDetails.createdAt))}
                          </StyledTableBodyCell>
                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            {renderCellContent(columns.find(c => c.id === 'updatedAt'), convertDateInStandardFormat(item.commonDetails.updatedAt))}
                          </StyledTableBodyCell>
                          <StyledTableBodyCell rowSpan={item.variantSpecificDetails.length}>
                            <ThreeDotsMenu row={item} />
                          </StyledTableBodyCell>
                        </>
                      )}
                    </TableRow>
                  ))}
                </Fragment>
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

      {/* Product Details View Dialog */}
      {productToViewId && (
        <Dialog open={viewProductDialogOpen} onClose={handleProductViewClose} maxWidth="md" fullWidth>
          <DialogTitle>
            Product Details
            <Button
              onClick={handleProductViewClose}
              style={{
                position: "absolute",
                right: "16px",
                top: "8px",
              }}
              size="small"
              variant="text"
            >
              Close
            </Button>
          </DialogTitle>
          <DialogContent dividers>
            <ViewProductDetails productId={productToViewId} category={category} prodType="Product" />
          </DialogContent>
          <DialogActions></DialogActions>
        </Dialog>
      )}

      {/* "Choose Initial Group" Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)}>
        <StyledModalPaper>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
            Choose Initial Customization Group
          </Typography>
          <TextField
            size="small"
            variant="outlined"
            placeholder="Search Customizations..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            sx={{ mb: 2, width: '100%' }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconButton size="small" sx={{ ml: -1 }}>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
              sx: { borderRadius: theme.shape.borderRadius * 2 }
            }}
          />

          <Box sx={{ minHeight: 250, maxHeight: 400, overflowY: 'auto', pr: 1 }}>
            {customizationGroups.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                No customization groups available.
              </Typography>
            ) : (
              renderCustomizationGroups()
            )}
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3, gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => {
                setShowModal(false);
                setSelectedRow(null);
                setInitialGroup(null);
              }}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={updateInitialCustomizationGroup} disabled={!initialGroup}>
              Save
            </Button>
          </Box>
        </StyledModalPaper>
      </Modal>

      {/* Add/Edit Product Dialog */}
      {isAddEditDialogOpen && (
        <AddProductDialog
          storeId={storeId}
          category={productToEditCategory}
          open={isAddEditDialogOpen}
          onClose={handleAddEditDialogClose}
          refreshProducts={onRefresh}
          currentProductId={productToEditId}
        />
      )}
    </StyledPaper>
  );
}