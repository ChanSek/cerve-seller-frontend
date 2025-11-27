import React, { useState, useEffect } from "react";
import MyButton from "../../Shared/Button";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Navbar from "../../Shared/Navbar";
import { getCall, postCall } from "../../../Api/axios.js";
import { Link, Button, CircularProgress } from "@mui/material";
import cogoToast from "cogo-toast";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { useStore } from "../../../Router/StoreContext";

const BulkUpload = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = React.useState(null);
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState("");
  const [msg, setMsg] = useState('');
  const [error, setError] = useState(false);
  const { store } = useStore();
  

  const uploadSelectedFile = () => {
    if (selectedFile) {
      setLoading(true)
      const formData = new FormData();
      formData.append("file", selectedFile);
      postCall(`api/v1/seller/upload/bulk/${category}/storeId/${storeId}/products`, formData)
        .then(resp => {
          if (resp.status == 200) {
            setError(false);
            setMsg("");
            cogoToast.success("Product added successfully!");
          } else {
            setError(true);
            setMsg(resp.message);
          }
        }).catch(error => {
          console.log("error ",error);
          if (error.response){
            setError(true);
            setMsg(error.response.data.message);
          }
        }).finally(() => {
          setLoading(false);
          setSelectedFile(null);
          document.getElementById('contained-button-file').value = null;
        });
    } else {
      alert("Please select the file to upload");
    }
  }

  useEffect(() => {
    if (store?.storeId && store?.category) {
      setStoreId(store.storeId);
      setCategory(store.category);
    }
  }, [])

  return (
    <div>
      <div className="container mx-auto my-8">
        <BackNavigationButton onClick={() => navigate("/application/inventory")} />
        <div className="w-full !h-full">
          <label className="ml-2 md:mb-4 md:mt-3 mt-2 font-semibold text-xl">
          <span class="highlight">Bulk Upload</span>
          </label>
          <div className="mt-6 flex flex-col">
            <div class="note-container">
              <p class="note-title">Notes:</p>
              <p class="note-text">
                1. If <span class="highlight">Default Non-Cancellable</span> and <span class="highlight">Default Non-Returnable</span> are selected from the store, the system will prioritize these settings, irrespective of the product.
              </p>
              <p class="note-text">
              2. To add or update products please download the latest excel file from Inventory by clicking on <span class="highlight">Download Products</span> Button.
              </p>
            </div>
            <br/>
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
          {msg && (
            <p
              className={`text-xs ${error ? 'text-red-600' : 'text-green-600'} mt-2`}
              dangerouslySetInnerHTML={{ __html: msg }}
            />
          )}
          <div className="mt-6 flex flex-col-1">
            <Button variant="contained" color="primary" onClick={uploadSelectedFile}>
              {loading ? <>Upload&nbsp;&nbsp;<CircularProgress size={24} sx={{ color: 'white' }} /></> : <span>Upload</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUpload;
