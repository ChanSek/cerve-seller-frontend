import { useEffect, useState } from "react";
import InventoryTable from "../Inventory/InventoryTable";
import Button from "../../Shared/Button";
import { Add as AddIcon, Download as DownloadIcon, FileUpload as FileUploadIcon } from "@mui/icons-material";
import StorefrontIcon from "@mui/icons-material/Storefront";
import SyncIcon from "@mui/icons-material/Sync";
import { useNavigate } from "react-router-dom";
import { getCall, postCall, putCall } from "../../../Api/axios";
import useCancellablePromise from "../../../Api/cancelRequest";
import { isObjEmpty } from "../../../utils/validations";
import { useTheme } from "@mui/material/styles";
import AddProductDialog from "../Product/AddProductDialog";
import SelectProductDialog from "../Product/SelectProductDialog";
import FilterComponent from "../../Shared/FilterComponent";
import AddCustomization from "../Product/AddCustomization";
import downloadExcel from "../Inventory/DownloadExcel";
import { useStore } from "../../../Router/StoreContext";
import ConnectShopifyDialog from "../Shopify/ConnectShopifyDialog";
import SyncShopifyDialog from "../Shopify/SyncShopifyDialog";

const fieldsToDelete = [
  "_id",
  "type",
  "timing",
  "organization",
  "images",
  "createdBy",
  "published",
  "createdAt",
  "updatedAt",
  "__v",
];

export default function Inventory() {
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [queryString, setQueryString] = useState('');
  const [open, setOpen] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);
  const [shopifyConnectOpen, setShopifyConnectOpen] = useState(false);
  const [shopifySyncOpen, setShopifySyncOpen] = useState(false);
  const { store } = useStore();
  const [merchantId, setMerchantId] = useState('');
  const filterFields = [
    {
      id: "category",
      title: "",
      placeholder: "Please Select Product Category",
      options: categoryOptions,
      type: "select",
      variant: "standard",
      disableClearable: true,
    },
    {
      id: "name",
      title: "",
      placeholder: "Search by Product Name",
      type: "input",
      variant: "standard",
    },
    {
      id: "stock",
      title: "Out of Stock",
      placeholder: "Please Select Product Category",
      type: "switch",
      containerClasses: "flex items-center",
      styles: {
        marginLeft: 2,
      },
    },
  ];
  const columns = [
    { id: "subCategory", label: "Category", minWidth: 100 },
    { id: "productName", label: "Product Name", minWidth: 100 },
    {
      id: "availableQty",
      label: "Quantity",
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "sellingPrice",
      label: "Selling Price",
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "price",
      label: "Price",
      minWidth: 100,
      format: (value) => value.toLocaleString("en-US"),
    },
    {
      id: "measure",
      label: "Measure",
    },
    {
      id: "published",
      label: "Published",
    },
  ];
  const theme = useTheme();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const navigate = useNavigate();
  const { cancellablePromise } = useCancellablePromise();
  const [products, setProducts] = useState([]);
  const [storeId, setStoreId] = useState('');
  const [category, setCategory] = useState('');
  const [filters, setFilters] = useState({
    name: "",
    category: "",
    stock: false,
  });

  const getProducts = async (storeId) => {
    try {
      const res = await cancellablePromise(getCall(`/api/v1/seller/${category}/storeId/${storeId}/products?pageSize=${rowsPerPage}&fromIndex=${page}`));
      setProducts(res.content);
      setTotalRecords(res.totalElements);
    } catch (error) {
      // cogoToast.error("Something went wrong!");
    }
  };

  const getTempProducts = async () => {
    try {
      const baseUrl = `/api/v1/seller/${category}/storeId/${storeId}/products`;
      const paginationParams = `pageSize=${rowsPerPage}&fromIndex=${page}`;
      //const queryParams = queryString ? `&${queryString}` : "";
      const finalUrl = `${baseUrl}?${paginationParams}`;

      const res = await cancellablePromise(getCall(finalUrl));
      setProducts(res.content);
      setTotalRecords(res.totalElements);
    } catch (error) {
      // cogoToast.error("Something went wrong!");
    }
  };

  const getOrgDetails = async (org_id) => {
    const url = `/api/v1/seller/merchantId/${org_id}/store`;
    const res = await getCall(url);
    return res;
  };

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    return res[0];
  };

  const getProductCategory = async () => {
    try {
      console.log("storeId: ", store?.storeId);
      console.log("category: ", store?.category);
      const url = `/api/v1/seller/reference/category/${category}`;
      const result = await getCall(url);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let data = [...filterFields]; // Create a copy of the fields array
    const subCategoryIndex = data.findIndex((item) => item.id === "category");
    getProductCategory().then((categoryList) => {
      data[subCategoryIndex].options = categoryList;
      setCategoryOptions(categoryList);
    });
  }, [category]);

  useEffect(() => {
    const userId = localStorage.getItem("user_id");
    // If store is already available from context, use it
    if (store?.storeId && store?.category) {
      setStoreId(store.storeId);
      setCategory(store.category);
      return;
    }
    // Else fetch user and determine path
    getUser(userId).then((user) => {
      if (user?.isSystemGeneratedPassword) {
        navigate("/initial-steps");
        return;
      }

      const role = user?.role?.name;
      console.log("1");
      if (role === "Organization Admin") {
        console.log("2");
        const merchantIdFromUser = user?.organization?._id;
        const isActive = user?.organization?.active;

        // Set merchantId for Shopify integration
        if (merchantIdFromUser) {
          setMerchantId(merchantIdFromUser);
          localStorage.setItem("organization_id", merchantIdFromUser);
        }

        // Store storeId for Shopify integration if available
        if (store?.storeId) {
          localStorage.setItem("store_id", store.storeId);
        }

        if (!merchantIdFromUser) {
          navigate("/add-provider-info");
          return;
        }

        if (!isActive) {
          navigate(`/user-listings/provider-details/${merchantIdFromUser}`);
          return;
        }
        const storeDetailsAvailable = user?.organization?.storeDetailsAvailable;
        if (!storeDetailsAvailable) {
          navigate(`/application/store-details/${merchantIdFromUser}`);
          return;
        }

        // const category = user?.organization?.category;
        // if (!category) {
        //   navigate(`/application/store-details/${merchantId}`);
        //   return;
        // }

      } else if (role === "Super Admin") {
        navigate("/application/user-listings");
      }
    });
  }, [store, category]);  // Optional: Add store dependency


  useEffect(() => {
    if (storeId && storeId !== undefined) {
      setFilters({
        name: "",
        category: null,
        stock: false,
      });

      setQueryString("");
      getTempProducts();
    }
  }, [page, rowsPerPage, storeId, category]);

  const handleRefresh = () => {
    getProducts(storeId);
  };

  const onReset = () => {
    setFilters({
      name: "",
      category: null,
      stock: false,
    });

    setQueryString("");

    if (storeId) {
      getProducts(storeId);
    } else {
      console.warn("Store ID is missing. Cannot fetch products.");
    }
  };


  const onFilter = async () => {
    const filterParams = [];
    if (filters.name.trim() !== "") {
      filterParams.push(`name=${encodeURIComponent(filters.name.trim())}`);
    }

    if (filters.category != undefined && filters.category !== "") {
      filterParams.push(`subCategory=${encodeURIComponent(filters.category)}`);
    }

    if (!filters.stock) {
      filterParams.push(`stock=inStock`);
    } else {
      filterParams.push(`stock=outOfStock`);
    }

    const queryString = filterParams.join("&");
    const url = `/api/v1/seller/${category}/storeId/${storeId}/products?${queryString}`;

    const res = await cancellablePromise(getCall(url));
    setProducts(res.content);
    setTotalRecords(res.totalElements);
    setQueryString(queryString)
  };

  return (
    <>
      <div className="container mx-auto my-8">
        <div className="mb-4 flex flex-col sm:flex-row justify-between items-start">
          <label
            style={{ color: theme.palette.primary.main }}
            className="font-semibold text-2xl mb-4 sm:mb-0"
          >
            Inventory
          </label>
          <div className="flex flex-col sm:flex-row">
            {/* <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<AddIcon />}
                title="ADD Old PRODUCT"
                onClick={() => navigate("/application/add-products")}
              />
            </div> */}
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<AddIcon />}
                title="SELECT PRODUCT"
                onClick={() => setSelectOpen(true)}
              >
                SELECT PRODUCT
              </Button>
            </div>
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<AddIcon />}
                title="ADD PRODUCT"
                onClick={() => setOpen(true)}
              >
                ADD PRODUCT
              </Button>
              <AddProductDialog storeId={storeId} category={category} open={open} onClose={() => setOpen(false)} refreshProducts={handleRefresh} />
              <SelectProductDialog storeId={storeId} category={category} open={selectOpen} onClose={() => setSelectOpen(false)} refreshProducts={handleRefresh} />
              <ConnectShopifyDialog open={shopifyConnectOpen} onClose={() => setShopifyConnectOpen(false)} />
              <SyncShopifyDialog open={shopifySyncOpen} onClose={() => setShopifySyncOpen(false)} refreshProducts={handleRefresh} merchantId={merchantId} storeId={storeId} />
            </div>
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<FileUploadIcon />}
                title="Bulk Upload"
                onClick={() => navigate("/application/bulk-upload")}
              />
            </div>
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<DownloadIcon />}
                title="Download Products"
                onClick={() => downloadExcel(storeId)} // Pass storeId here
              />
            </div>
            {/* Shopify Integration Buttons */}
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<StorefrontIcon />}
                title="Connect Shopify Store"
                onClick={() => setShopifyConnectOpen(true)}
              >
                CONNECT SHOPIFY
              </Button>
            </div>
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<SyncIcon />}
                title="Sync from Shopify"
                onClick={() => setShopifySyncOpen(true)}
              >
                SYNC SHOPIFY
              </Button>
            </div>
            {/* Additional buttons can be added here */}
          </div>
        </div>
        <FilterComponent
          fields={filterFields}
          state={filters}
          stateHandler={setFilters}
          onReset={onReset}
          onFilter={onFilter}
        />
        <InventoryTable
          columns={columns}
          data={products}
          onRefresh={handleRefresh}
          totalRecords={totalRecords}
          page={page}
          category={category}
          rowsPerPage={rowsPerPage}
          getProducts={getProducts}
          storeId={storeId}
          handlePageChange={(val) => setPage(val)}
          handleRowsPerPageChange={(val) => setRowsPerPage(val)}
        />
      </div>
    </>
  );
}
