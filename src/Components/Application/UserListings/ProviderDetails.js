import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import RenderInput from "../../../utils/RenderInput";
import { useEffect } from "react";
import { getCall, postCall } from "../../../Api/axios";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import moment from "moment";

const providerFields = [
  {
    id: "name",
    title: "Name",
    placeholder: "Enter your Name",
    type: "input",
    required: true,
  },
  {
    id: "email",
    title: "Email",
    placeholder: "Enter your Email Address",
    type: "input",
    required: true,
  },
  {
    id: "mobile",
    title: "Mobile Number",
    placeholder: "Enter your Mobile Number",
    type: "input",
    required: true,
  },
];

const kycFields = [
  {
    id: "contactEmail",
    title: "Contact Email",
    placeholder: "Enter your Contact Email Address",
    type: "input",
    required: true,
  },
  {
    id: "contactMobile",
    title: "Contact Mobile Number",
    placeholder: "Enter your Contact Mobile Number",
    type: "input",
    required: true,
  },
  {
    id: "fssai",
    title: "FSSAI Number",
    placeholder: "FSSAI Number",
    type: "input",
    required: false,
  },
  {
    id: "address",
    title: "Registered Address",
    placeholder: "Enter your Registered Address",
    type: "input",
    required: true,
  },
  {
    id: "address_proof",
    title: "Address Proof",
    type: "upload",
    file_type: "address_proof",
    required: true,
    fontColor: "#ffffff",
  },
  {
    id: "gst_no",
    title: "GSTIN Certificate",
    placeholder: "GSTIN Certificate",
    type: "input",
    required: true,
  },
  {
    id: "gst_proof",
    title: "GSTIN Proof",
    type: "upload",
    file_type: "gst",
    required: true,
    fontColor: "#ffffff",
  },
  {
    id: "pan_no",
    title: "PAN",
    placeholder: "Enter your PAN",
    type: "input",
    required: true,
  },
  {
    id: "pan_proof",
    title: "PAN Card Proof",
    type: "upload",
    fontColor: "#ffffff",
    file_type: "pan",
    required: true,
  },
  {
    id: "id_proof",
    title: "ID Proof",
    type: "upload",
    fontColor: "#ffffff",
    file_type: "id_proof",
    required: true,
  },
];

const bankFields = [
  {
    id: "bankName",
    title: "Bank Name",
    placeholder: "Enter Bank Name",
    type: "input",
    required: true,
  },
  {
    id: "branchName",
    title: "Branch Name",
    placeholder: "Enter Branch Name",
    type: "input",
    required: true,
  },
  {
    id: "IFSC",
    title: "IFSC Code",
    placeholder: "Enter IFSC Code",
    type: "input",
    required: true,
  },
  {
    id: "accHolderName",
    title: "Account Holder Name",
    placeholder: "Enter Account Holder Name",
    type: "input",
    required: true,
  },
  {
    id: "accNumber",
    title: "Account Number",
    placeholder: "Enter Account Number",
    type: "input",
    required: true,
  },
  {
    id: "cancelledCheque",
    title: "Cancelled Cheque",
    type: "upload",
    fontColor: "#ffffff",
    file_type: "cancelled_check",
    required: true,
  },
];


const ProviderDetails = ({ isFromUserListing = false }) => {
  const navigate = useNavigate();
  const params = useParams();

  const [providerDetails, setProviderDetails] = useState({});
  const [kycDetails, setKycDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});

  const getOrgDetails = async (id) => {
    try {
      const url = `/api/v1/seller/merchantId/${id}/merchant`;
      const result = await getCall(url);
      const res = result.data;
      if (res?.providerDetail?.storeDetails?.deliveryTime) {
        // Get the number of hours from the duration object
        const duration = moment.duration(res.providerDetail.storeDetails.deliveryTime);
        const hours = duration.asHours();
        res.providerDetail.storeDetails.deliveryTime = String(hours);

      }
      setProviderDetails({
        email: res.user.email,
        mobile: res.user.mobile,
        name: res.user.name,
      });

      setKycDetails({
        contactEmail: res?.providerDetail?.contactEmail,
        contactMobile: res?.providerDetail?.contactMobile,
        fssai: res?.providerDetail?.fssaiNo,
        address: res?.providerDetail?.address,
        address_proof: res?.providerDetail?.addressProofUrl,
        gst_no: res?.providerDetail?.gstin,
        gst_proof: res?.providerDetail?.gstinProofUrl,
        pan_no: res?.providerDetail?.pan,
        pan_proof: res?.providerDetail?.panProofUrl,
        id_proof: res?.providerDetail?.idProofUrl,
      });

      setBankDetails({
        bankName: res?.providerDetail?.account?.bankName,
        branchName: res?.providerDetail?.account?.branchName,
        IFSC: res?.providerDetail?.account?.ifscCode,
        accHolderName: res?.providerDetail?.account?.accountHolderName,
        accNumber: res?.providerDetail?.account?.accountNumber,
        cancelledCheque: res?.providerDetail?.account?.cancelledChequeUrl,
        beneficiaryName: res?.providerDetail?.account?.beneficiaryName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let provider_id = params?.id;
    getOrgDetails(provider_id);
  }, [params.id]);

  function addAfter(array, index, newItem) {
    return [...array.slice(0, index), newItem, ...array.slice(index)];
  }

  let userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;

  return (
    <div>
      <div className="container mx-auto my-8">
        <div>
          <div
            className="w-full bg-white px-4 py-4 rounded-md h-full scrollbar-hidden"
            style={{ minHeight: "95%", maxHeight: "100%", overflow: "auto" }}
          >
            <div className="m-auto w-10/12 md:w-3/4 h-max">
              <BackNavigationButton
                onClick={() => navigate("/application/inventory")}
              />
              <p className="text-2xl font-semibold mb-4">Seller Details</p>
              {providerFields.map((item) => (
                <RenderInput previewOnly={true} item={item} state={providerDetails} statehandler={setProviderDetails} />
              ))}
              <p className="text-2xl font-semibold mb-4 mt-14">KYC Details</p>
              {kycFields.map((item) => (
                <RenderInput previewOnly={true} item={item} state={kycDetails} statehandler={setKycDetails} />
              ))}
              <p className="text-2xl font-semibold mb-4 mt-14">Bank Details</p>
              {bankFields.map((item) => (
                <RenderInput previewOnly={true} item={item} state={bankDetails} statehandler={setBankDetails} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetails;
