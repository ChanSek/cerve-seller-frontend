import React, { useState, useEffect } from "react";
import MyButton from "../../Shared/Button";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../../Shared/Navbar";
import { getCall, postCall } from "../../../Api/axios.js";
import { Link, Button, CircularProgress } from "@mui/material";
import cogoToast from "cogo-toast";
import BackNavigationButton from "../../Shared/BackNavigationButton";

const BulkUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("")

  const uploadSelectedFile = () => {
    if (selectedFile) {
      setLoading(true)
      const formData = new FormData();
      formData.append("file", selectedFile);
      postCall(`api/v1/seller/upload/bulk/storeId/${storeId}/products?category=${encodeURIComponent(category)}`, formData)
        .then(resp => {
          cogoToast.success("Product added successfully!");
        }).catch(error => {
          console.log(error);
          cogoToast.error(error.response.data.error);
        }).finally(() => setLoading(false));
    } else {
      alert("Please select the file to upload");
    }
  }

  const getUser = async (id) => {
    const url = `/api/v1/seller/subscriberId/${id}/subscriber`;
    const res = await getCall(url);
    return res[0];
  };

  const getOrgDetails = async (org_id) => {
    const url = `/api/v1/seller/merchantId/${org_id}/merchant`;
    const res = await getCall(url);
    return res.data;
  };

  useEffect(() => {
    const user_id = localStorage.getItem("user_id");
    getUser(user_id).then((u) => {
      getOrgDetails(u.organization._id).then((org) => {
        setCategory(org?.providerDetail.storeDetails?.category);
        setStoreId(org?.providerDetail.storeDetails?.storeId);
      });
    });
  }, [])

  return (
    <div>
      <div className="container mx-auto my-8">
        <BackNavigationButton onClick={() => navigate("/application/inventory")} />
        <div className="w-full !h-full">
          <label className="ml-2 md:mb-4 md:mt-3 mt-2 font-semibold text-xl">
            Bulk Upload
          </label>
          <div className="mt-6 flex flex-col">
            <label className="ml-2 md:mb-4 md:mt-3 mt-2 font text-xm">
              Please select an excel file. To download sample template, click <Link href={`${process.env.REACT_APP_SELLER_BACKEND_URL}api/v1/products//template?category=${encodeURIComponent(category)}`} target="_blank" style={{}}>here</Link>
            </label>
            <input
              className="ml-2"
              id="contained-button-file"
              style={{ opacity: "none" }}
              accept=".xlsx"
              type="file"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              //   key={item?.id}
            />
          </div>
          <div className="mt-6 flex flex-col-1">
            <Button variant="contained" color="primary" onClick={uploadSelectedFile}>
              {loading ? <>Upload&nbsp;&nbsp;<CircularProgress size={24} sx={{ color: 'white' }} /></>: <span>Upload</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
