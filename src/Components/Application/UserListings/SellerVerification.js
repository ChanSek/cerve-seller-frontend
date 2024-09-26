import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Tabs, Tab } from "@mui/material";
import { getCall, postCall } from "../../../Api/axios";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { useTheme } from "@mui/material/styles";
import UserDetailsCard from "./UserDetailsCard.js";
import { deleteAllCookies } from "../../../utils/cookies";

const SellerVerification = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const [providerDetails, setProviderDetails] = useState({});
  const [kycDetails, setKycDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [reviewDetails, setReviewDetails] = useState({});
  const [activeTab, setActiveTab] = useState("provider");
  const [sellerActive, setSellerActive] = useState(false);
  async function logout() {
    if (window.confirm("Are you sure want to logout your session?")) {
      await postCall(`/api/v1/auth/logout`);
      deleteAllCookies();
      localStorage.clear();
      navigate("/");
    }
  }
  const getOrgDetails = async (id) => {
    let userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;
    const isSuperAdmin = userRole === "Super Admin";
    try {
      const url = `/api/v1/seller/merchantId/${id}/merchant`;
      const result = await getCall(url);
      const res = result.data;
      setSellerActive(res?.user?.organization?.active);

      setProviderDetails({
        name: { "title": "Name", "value": res.user.name, "editable": false },
        email: { "title": "Email", "value": res.user.email, "editable": false },
        mobile: { "title": "Mobile No.(+91) ", "value": res.user.mobile, "editable": false },
      });

      var addressStatus = res?.providerDetail?.merchantReview?.addressStatus;
      var panStatus = res?.providerDetail?.merchantReview?.panStatus;
      var gstinStatus = res?.providerDetail?.merchantReview?.gstinStatus;
      var fssaiStatus = res?.providerDetail?.merchantReview?.fssaiStatus;
      var bankDetailStatus = res?.providerDetail?.merchantReview?.bankDetailStatus;
      var isSellerActive = res?.providerDetail?.active;
      var reviewId = res?.providerDetail?.merchantReview?._id;
      var accountId = res?.providerDetail?.account?.accountId;
      setKycDetails({
        contactEmail: { "title": "Contact Email", "value": res?.providerDetail?.contactEmail, "editable": (!isSuperAdmin ? true : false) },
        contactMobile: { "title": "Contact Mobile No.(+91) ", "value": res?.providerDetail?.contactMobile, "editable": (!isSuperAdmin ? true : false) },
        fssaiNo: { "title": "FSSAI Number", "value": res?.providerDetail?.fssaiNo, "editable": (!isSuperAdmin && !isSellerActive && fssaiStatus !== 'Approved' ? true : false) },
        address: { "title": "Registered Address", "value": res?.providerDetail?.address, "editable": (!isSuperAdmin && !isSellerActive && addressStatus !== 'Approved' ? true : false) },
        addressProofUrl: { "title": "Address Proof", "value": res?.providerDetail?.addressProofUrl, "editable": (!isSuperAdmin && !isSellerActive && addressStatus !== 'Approved' ? true : false) },
        gstin: { "title": "GSTIN Certificate", "value": res?.providerDetail?.gstin, "editable": (!isSuperAdmin && !isSellerActive && gstinStatus !== 'Approved' ? true : false) },
        gstinProofUrl: { "title": "GSTIN Proof", "value": res?.providerDetail?.gstinProofUrl, "editable": (!isSuperAdmin && !isSellerActive && gstinStatus !== 'Approved' ? true : false) },
        pan: { "title": "PAN", "value": res?.providerDetail?.pan, "editable": (!isSuperAdmin && !isSellerActive && panStatus !== 'Approved' ? true : false) },
        panProofUrl: { "title": "PAN Card Proof", "value": res?.providerDetail?.panProofUrl, "editable": (!isSuperAdmin && !isSellerActive && panStatus !== 'Approved' ? true : false) },
        idProofUrl: { "title": "ID Proof", "value": res?.providerDetail?.idProofUrl, "editable": (!isSuperAdmin && !isSellerActive ? true : false) },
      });

      setBankDetails({
        bankName: { _id: accountId, "title": "Bank Name", "value": res?.providerDetail?.account?.bankName, "editable": false },
        branchName: { _id: accountId, "title": "Branch Name", "value": res?.providerDetail?.account?.branchName, "editable": false },
        ifscCode: { _id: accountId, "title": "IFSC Code", "value": res?.providerDetail?.account?.ifscCode, "editable": false },
        accountHolderName: { _id: accountId, "title": "Account Holder Name", "value": res?.providerDetail?.account?.accountHolderName, "editable": (!isSuperAdmin && !isSellerActive && bankDetailStatus !== 'Approved' ? true : false) },
        accountNumber: { _id: accountId, "title": "Account Number", "value": res?.providerDetail?.account?.accountNumber, "editable": (!isSuperAdmin && !isSellerActive && bankDetailStatus !== 'Approved' ? true : false) },
        cancelledChequeUrl: { _id: accountId, "title": "Cancelled Cheque", "value": res?.providerDetail?.account?.cancelledChequeUrl, "editable": (!isSuperAdmin && !isSellerActive && bankDetailStatus !== 'Approved' ? true : false) },
      });

      setReviewDetails({
        addressStatus: { _id: reviewId, "title": "Address", "value": addressStatus, "editable": (isSuperAdmin ? true : false) },
        panStatus: { _id: reviewId, "title": "PAN", "value": panStatus, "editable": (isSuperAdmin ? true : false) },
        fssaiStatus: { _id: reviewId, "title": "FSSAI No.", "value": fssaiStatus, "editable": (isSuperAdmin ? true : false) },
        gstinStatus: { _id: reviewId, "title": "GSTIN", "value": gstinStatus, "editable": (isSuperAdmin ? true : false) },
        bankDetailStatus: { _id: reviewId, "title": "Bank Details", "value": bankDetailStatus, "editable": (isSuperAdmin ? true : false) },
        active: { _id: reviewId, "title": "Seller Active", "value": isSellerActive, "editable": false },
        //reviewerComment: { _id: reviewId, "title": "Reviewer Comment", "value": res?.providerDetail?.reviewerComment, "editable": (isSuperAdmin ? true : false) },
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    let provider_id = params?.id;
    getOrgDetails(provider_id);
  }, [params.id]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "provider":
        return <UserDetailsCard selectedTab="provider" details={providerDetails} />;
      case "kyc":
        return <UserDetailsCard selectedTab="kyc" details={kycDetails} />;
      case "bank":
        return <UserDetailsCard selectedTab="bank" details={bankDetails} />;
      case "review":
        return <UserDetailsCard selectedTab="review" details={reviewDetails} />;
      default:
        return null;
    }
  };

  const tabItems = [
    { label: "Basic Details", key: "provider" },
    { label: "KYC Details", key: "kyc" },
    { label: "Bank Details", key: "bank" },
    { label: "Review Details", key: "review" },
  ];
  let userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;

  return (
    <div>
      <div className="container mx-auto my-8">
        <div className="w-full bg-white px-4 py-4 rounded-md h-full scrollbar-hidden">
          <div className="m-auto w-full md:w-3/4">
            <br />
            {(sellerActive || userRole === "Super Admin") ? (
              <>
                <BackNavigationButton
                  onClick={() => {
                    if (userRole === "Super Admin") {
                      navigate("/application/user-listings?view=provider");
                    } else {
                      navigate("/application/inventory");
                    }
                  }}
                />
                <div className="mb-4 flex flex-col md:flex-row justify-between items-left">
                  <label
                    style={{ color: theme.palette.primary.main }}
                    className="font-semibold text-2xl"
                  >
                    Seller Details
                  </label>
                </div>
              </>
            ) : (
              <>
                <div
                  style={{ display: "flex", justifyContent: "flex-end", width: "100%" }}
                  className="mb-4"
                >
                  <Button
                    type="button"
                    size="small"
                    style={{ marginRight: 10 }}
                    variant="contained"
                    color="primary"
                    onClick={() => logout()}
                  >
                    Exit
                  </Button>
                </div>
                <div style={{ display: "flex", width: "100%" }} className="flex-col">
                  <div className="document-review-message">
                    <p>
                      Your documents are currently under review. Please allow up to 2 working days
                      for the review process to be completed. Thank you for your patience.
                    </p>
                  </div>
                </div>
              </>
            )}
  
            <div className="flex flex-col md:flex-row justify-between items-center">
              <Tabs
                value={activeTab}
                onChange={(event, newValue) => setActiveTab(newValue)}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                allowScrollButtonsMobile
              >
                {tabItems.map((tab) => (
                  <Tab key={tab.key} label={tab.label} value={tab.key} />
                ))}
              </Tabs>
            </div>
  
            <div>{renderTabContent()}</div>
            <br />
            <br />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerVerification;
