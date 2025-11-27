import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Tabs,
  Tab,
  Typography,
  Box,
  Container,
  Paper,
  Alert,
} from "@mui/material";
// Assuming getCall, postCall, BackNavigationButton, UserDetailsCard, deleteAllCookies, and dayjs are available
import { getCall, postCall } from "../../../Api/axios";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { useTheme } from "@mui/material/styles";
import UserDetailsCard from "./UserDetailsCard"; // Ensure this is the refactored component
import { deleteAllCookies } from "../../../utils/cookies";
import dayjs from "dayjs";

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
};

const SellerVerification = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const [providerDetails, setProviderDetails] = useState({});
  const [kycDetails, setKycDetails] = useState({});
  const [bankDetails, setBankDetails] = useState({});
  const [reviewDetails, setReviewDetails] = useState({});
  const [activeTab, setActiveTab] = useState(0); // Use index for MUI Tabs
  const [sellerActive, setSellerActive] = useState(false);
  const userRole = JSON.parse(localStorage.getItem("user"))?.role?.name;

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
      const url = `/api/v1/seller/merchantId/${id}/merchant?providerDetails=Y`;
      const result = await getCall(url);
      const res = result.data;
      setSellerActive(res?.user?.organization?.active);

      setProviderDetails({
        name: { "title": "Name", "value": res.user.name, "editable": false },
        email: { "title": "Email", "value": res.user.email, "editable": false },
        mobile: { "title": "Mobile No.(+91) ", "value": res.user.mobile, "editable": false },
        createDateTime: { "title": "Create DateTime ", "value": dayjs(res?.providerDetail?.createdAt).format("DD MMM YYYY, hh:mm A"), "editable": false },
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

  const tabItems = [
    { label: "Basic Details", key: "provider", details: providerDetails },
    { label: "KYC Details", key: "kyc", details: kycDetails },
    { label: "Bank Details", key: "bank", details: bankDetails },
    { label: "Review Details", key: "review", details: reviewDetails },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 3,
            flexDirection: { xs: "column", md: "row" },
          }}
        >
          {sellerActive || userRole === "Super Admin" ? (
            <Box>
              <BackNavigationButton
                onClick={() => {
                  if (userRole === "Super Admin") {
                    navigate("/application/user-listings?view=provider");
                  } else {
                    navigate("/application/inventory");
                  }
                }}
              />
              {/* <Typography
                variant="h4"
                component="h1"
                sx={{
                  color: theme.palette.primary.main,
                  fontWeight: "bold",
                  mt: 1,
                }}
              >
                Seller Details
              </Typography> */}
            </Box>
          ) : (
            <Box sx={{ width: "100%" }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                  mb: 2,
                }}
              >
                <Button
                  variant="contained"
                  color="error"
                  onClick={logout}
                  size="small"
                >
                  Exit
                </Button>
              </Box>
              <Alert severity="info" sx={{ mb: 3 }}>
                Your documents are currently under review. Please allow up to 2
                working days for the review process to be completed. Thank you
                for your patience.
              </Alert>
            </Box>
          )}
        </Box>

        {/* Tabs for Navigation */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(event, newValue) => setActiveTab(newValue)}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
          >
            {tabItems.map((tab, index) => (
              <Tab key={tab.key} label={tab.label} value={index} />
            ))}
          </Tabs>
        </Box>

        {/* Tab Content */}
        {tabItems.map((tab, index) => (
          <TabPanel key={tab.key} value={activeTab} index={index}>
            <UserDetailsCard
              selectedTab={tab.key}
              details={tab.details}
              // Pass getOrgDetails as a prop to refresh data after edit
              onUpdateSuccess={() => getOrgDetails(params.id)} 
            />
          </TabPanel>
        ))}
      </Paper>
    </Container>
  );
};

export default SellerVerification;