import { useEffect, useState } from "react";
import InventoryTable from "../Inventory/InventoryTable";
import Button from "../../Shared/Button";
import { Add as AddIcon, Download as DownloadIcon, FileUpload as FileUploadIcon } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { getCall, postCall, putCall } from "../../../Api/axios";
import useCancellablePromise from "../../../Api/cancelRequest";
import { isObjEmpty } from "../../../utils/validations";
import { FILTER_OPTIONS, PRODUCT_CATEGORY } from "../../../utils/constants";
import { useTheme } from "@mui/material/styles";
import FilterComponent from "../../Shared/FilterComponent";
import AddCustomization from "../Product/AddCustomization";
import downloadExcel from "../Inventory/DownloadExcel";

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
      id: "purchasePrice",
      label: "Purchase Price",
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
      id: "cancellable",
      label: "Cancellable",
      boolean: true,
      minWidth: 100,
    },
    {
      id: "returnable",
      label: "Returnable",
      boolean: true,
      minWidth: 100,
    },
    { id: "variationOn", label: "Variation On", minWidth: 100 },
    /*{
      id: "customizationGroupId",
      label: "Customization",
      format: (value) => {
        for (let i = 0; i < customizationGroups.length; i++) {
          if (customizationGroups[i]._id === value) {
            console.log("customizationGroupId", customizationGroups[i]);
            if (customizationGroups[i].description) {
              return `${customizationGroups[i].name} ( ${customizationGroups[i].description} )`;
            } else {
              return `${customizationGroups[i].name}`;
            }
          }
        }
        return "-";
      },
    },*/
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

  const [filters, setFilters] = useState({
    name: "",
    category: "",
    stock: false,
  });

  const [customizationGroups, setCustomizationGroups] = useState([]);

  const [showCustomizationModal, setShowCustomizationModal] = useState(false);
  const [customizationId, setCustomizationId] = useState(null);
  const [newCustomizationData, setNewCustomizationData] = useState({
    productName: "",
    MRP: 0,
    UOM: "",
    UOMValue: "",
    quantity: "",
    maxAllowedQty: "",
    vegNonVeg: "veg",
  });

  const getProducts = async (storeId) => {
    try {
      const res = await cancellablePromise(getCall(`/api/v1/seller/storeId/${storeId}/products?pageSize=${rowsPerPage}&fromIndex=${page}`));
      setProducts(res.content);
      setTotalRecords(res.totalElements);
    } catch (error) {
      // cogoToast.error("Something went wrong!");
    }
  };

  const getTempProducts = async () => {
    try {
      const res = await cancellablePromise(getCall(`/api/v1/seller/storeId/${storeId}/products?pageSize=${rowsPerPage}&fromIndex=${page}&${queryString}`));
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

  const fetchCustomizationGroups = async () => {
    const url = `/api/v1/customizationGroups?limit=10&offset=0`;

    try {
      const res = await getCall(url);
      setCustomizationGroups(res.data);
      return res.data;
    } catch (error) {
      console.log("Error fetching customziation groups:", error);
    }
  };

  const fetchCustomizationItem = async (id) => {
    setCustomizationId(id);
    try {
      const url = `/api/v1/product/customization/${id}`;
      const res = await getCall(url);
      setNewCustomizationData(res);
    } catch (error) {
      console.log("Error fetching customization item: ", error);
    }
  };

  const handleAddCustomization = async () => {
    try {
      const url = `/api/v1/product/customization`;

      const res = await postCall(url, newCustomizationData);
      console.log("handleAddCustomization: ", res);
      setNewCustomizationData({ MRP: 0 });
      setShowCustomizationModal(false);
      getProducts();
    } catch (error) { }
  };

  const handleUpdateCustomization = async () => {
    try {
      const url = `/api/v1/product/customization/${customizationId}`;
      fieldsToDelete.forEach((field) => {
        if (newCustomizationData.hasOwnProperty(field)) {
          delete newCustomizationData[field];
        }
      });
      const res = await putCall(url, newCustomizationData);
      setNewCustomizationData({ MRP: 0 });
      setCustomizationId(null);
      setShowCustomizationModal(false);
      getProducts();
    } catch (error) { }
  };

  const getProductCategory = async (categoryId) => {
    try {
      const url = `/api/v1/seller/reference/category/${categoryId}`;
      const result = await getCall(url);
      return result.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    let data = [...filterFields]; // Create a copy of the fields array
    const subCategoryIndex = data.findIndex((item) => item.id === "category");
    getProductCategory('RET10').then((categoryList) => {
      data[subCategoryIndex].options = categoryList;
      setCategoryOptions(categoryList);
    });
  }, []);

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    getUser(user_id).then((u) => {
      // roles - Organization Admin, Super Admin
      if (u?.isSystemGeneratedPassword) {
        navigate("/initial-steps")
      } else {
        if (u.role.name == "Organization Admin") {
          const merchantId = u?.organization?._id;
          if (!isObjEmpty(merchantId)) {
            var isActive = u?.organization?.active;
            if (!isActive) {
              navigate(`/user-listings/provider-details/${merchantId}`);
            } else {
              getOrgDetails(merchantId).then((org) => {
                let category = u?.organization?.category;
                if (!category) {
                  navigate(`/application/store-details/${merchantId}`);
                } else {
                  setStoreId(org.data.storeId);
                  getProducts(org.data.storeId);
                }
              });
            }
          } else {
            navigate("/add-provider-info")
          }
        } else if (u.role.name == "Super Admin") {
          navigate("/application/user-listings");
        }
      }
    });
    //fetchCustomizationGroups();
  }, []);

  useEffect(() => {
    if (storeId && storeId !== undefined) {
      getTempProducts();
    }
  }, [page, rowsPerPage, storeId]);

  const handleRefresh = () => {
    getProducts(storeId);
  };

  const onReset = () => {
    setFilters({ name: "", category: null, stock: false });
    getProducts(storeId);
  };

  const onFilter = async () => {
    const filterParams = [];
    if (filters.name.trim() !== "") {
      filterParams.push(`name=${encodeURIComponent(filters.name.trim())}`);
    }

    if (filters.category != undefined && filters.category !== "") {
      filterParams.push(`category=${encodeURIComponent(filters.category)}`);
    }

    if (!filters.stock) {
      filterParams.push(`stock=inStock`);
    } else {
      filterParams.push(`stock=outOfStock`);
    }

    const queryString = filterParams.join("&");
    const url = `/api/v1/seller/storeId/${storeId}/products?${queryString}`;

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
            <div className="mb-2 sm:mb-0 sm:mr-4">
              <Button
                variant="contained"
                icon={<AddIcon />}
                title="ADD PRODUCT"
                onClick={() => navigate("/application/add-products")}
              />
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
          rowsPerPage={rowsPerPage}
          customizationGroups={customizationGroups}
          setShowCustomizationModal={setShowCustomizationModal}
          getProducts={getProducts}
          //fetchCustomizationItem={fetchCustomizationItem}
          handlePageChange={(val) => setPage(val)}
          handleRowsPerPageChange={(val) => setRowsPerPage(val)}
        />

        <AddCustomization
          mode={!customizationId ? "add" : "edit"}
          showModal={showCustomizationModal}
          handleCloseModal={() => {
            setNewCustomizationData({
              productName: "",
              MRP: 0,
              UOM: "",
              UOMValue: "",
              quantity: "",
              maxAllowedQty: "",
            });
            setShowCustomizationModal(false);
            setCustomizationId(null);
          }}
          newCustomizationData={newCustomizationData}
          setNewCustomizationData={setNewCustomizationData}
          handleAddCustomization={() => {
            if (customizationId) handleUpdateCustomization();
            else handleAddCustomization();
          }}
        />
      </div>
    </>
  );
}
