import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Tab } from "@mui/material";
import { getCall } from "../../../Api/axios";
import { useTheme } from "@mui/material/styles";
import AdminDetailsCard from "./AdminDetailsCard";
import AddAdminDetails from "./AddAdminDetails";
import Button from "../../Shared/Button";

const AdminDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [basicDetails, setBasicDetails] = useState({});
  const [bppDescriptor, setBppDescriptor] = useState({});
  const [bankDetails, setBankDetails] = useState([]);
  const [activeTab, setActiveTab] = useState("bank");
  const [shouldFetchDetails, setShouldFetchDetails] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const processBankDetails = (bankDetails) => {
    const bankAccounts = [];

    bankDetails.forEach((bankDetail) => {
      let accountId = bankDetail.accountId;
      let bankAccountType = bankDetail.bankAccountType;
      const account = {
        bankAccountType: { title: "Bank Account Type", value: bankDetail.bankAccountType || "", editable: false },
        accountType: { _id: accountId, _type: bankAccountType, title: "Account Type", value: bankDetail.accountType || "", editable: true },
        accountHolderName: { _id: accountId, _type: bankAccountType, title: "Account Holder Name", value: bankDetail.accountHolderName || "", editable: true },
        accountNumber: { _id: accountId, _type: bankAccountType, title: "Account Number", value: bankDetail.accountNumber || "", editable: true },
        ifscCode: { _id: accountId, _type: bankAccountType, title: "IFSC Code", value: bankDetail.ifscCode || "", editable: true },
        bankName: { _id: accountId, _type: bankAccountType, title: "Bank Name", value: bankDetail.bankName || "", editable: true },
        branchName: { _id: accountId, _type: bankAccountType, title: "Branch Name", value: bankDetail.branchName || "", editable: true },
      };
      bankAccounts.push(account);
    });

    return bankAccounts;
  };

  const getAdminDetails = async () => {
    try {
      const result = await getCall("/api/v1/seller/adminDetails");

      if (result.status === 200) {
        setBasicDetails({
          gstin: { title: "GSTIN", value: result?.data?.basicDetail?.gstin || "", editable: true },
        });

        setBppDescriptor({
          name: { title: "NP Name", value: result?.data?.bppDescriptor?.name || "", editable: true },
          short_desc: { title: "Short Description", value: result?.data?.bppDescriptor?.short_desc || "", editable: true },
          long_desc: { title: "Long Description", value: result?.data?.bppDescriptor?.long_desc || "", editable: true },
        });
        // Call this after fetching data
        const bankAccounts = processBankDetails(result.data.bankDetails);

        // Set state
        setBankDetails(bankAccounts);

      }
    } catch (error) {
      console.error("Error fetching admin details:", error);
    }
  };

  const handleSave = (formData) => {
    console.log("Form Data Saved:", formData);
    // Call API to save formData to DB here
  };

  useEffect(() => {
    if (shouldFetchDetails) {
      getAdminDetails();
      setShouldFetchDetails(false);
    }
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "basic":
        return <AdminDetailsCard selectedTab="basic" details={basicDetails} />;
      case "bppDescriptor":
        return <AdminDetailsCard selectedTab="bppDescriptor" details={bppDescriptor} />;
      case "bank":
      default:
        return null;
    }
  };

  const tabItems = [
    { label: "Basic Details", key: "basic" },
    { label: "BPP Descriptor", key: "bppDescriptor" },
    { label: "Bank Details", key: "bank" },
  ];

  return (
    <div>
      <div className="container mx-auto my-8">
        <div className="w-full bg-white px-4 py-4 rounded-md h-full">
          <div className="m-auto w-full">
            <div className="mb-4 flex flex-col md:flex-row justify-between items-left">
              <label
                style={{ color: theme.palette.primary.main }}
                className="font-semibold text-2xl"
              >
                Admin Details
              </label>
              <Button
                type="button"
                title="Add Details"
                className="text-black"
                onClick={() => setIsModalOpen(true)}
              />
              <AddAdminDetails
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSave}
              />
            </div>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDetails;
