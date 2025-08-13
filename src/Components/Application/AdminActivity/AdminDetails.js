// src/components/AdminDetails/AdminDetails.jsx

import React, { useState, useEffect } from "react";
import { Tabs, Tab, CircularProgress, Box, Typography } from "@mui/material";
import { getCall, postCall } from "../../../Api/axios";
import { useTheme } from "@mui/material/styles";
import AddAdminDetails from "./AddAdminDetails";
import Button from "../../Shared/Button";
import cogoToast from "cogo-toast";
import DynamicTableDisplay from "./DynamicTableDisplay.jsx";

const AdminDetails = () => {
  const theme = useTheme();

  const [tabData, setTabData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [initialFormData, setInitialFormData] = useState(null);

  const [activeTab, setActiveTab] = useState("basic");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("");

  const transformArrayToObject = (array, type) => {
    const obj = {};
    if (array && Array.isArray(array)) {
      array.forEach(item => {
        // This part handles non-nested fields or fields that are not bankDetails
        if (!item.code.includes('.')) { // Ensure it's not a bankDetails nested code
          obj[item.code] = item.value;
        }
      });
    }

    if (type === "bankDetails" && Array.isArray(array)) {

      // Helper function to find a value by code
      const findValueByCode = (code) => {
        const item = array.find(i => i.code === code);
        return item ? item.value : '';
      };

      const bankDetailsArray = [
        // Operative Bank (index 0)
        {
          accountHolderName: findValueByCode('accountHolderName'),
          accountNumber: findValueByCode('accountNumber'),
          ifscCode: findValueByCode('ifscCode'),
          bankName: findValueByCode('bankName'),
        },
        // Non-Operative Bank (index 1)
        {
          accountHolderName: findValueByCode('accountHolderName'),
          accountNumber: findValueByCode('accountNumber'),
          ifscCode: findValueByCode('ifscCode'),
          bankName: findValueByCode('bankName'),
        }
      ];
      return bankDetailsArray;
    }

    return obj;
  };

  const getAdminDetails = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getCall(`/api/v1/seller/snpDetails/${activeTab}`);
      if (result.status === 200 && Array.isArray(result.data)) {
        setTabData(result.data);

        let currentInitialData = {};
        switch (activeTab) {
          case "basic":
            currentInitialData = { basicDetail: transformArrayToObject(result.data, 'basicDetail') };
            break;
          case "bppDescriptor":
            currentInitialData = { bppDescriptor: transformArrayToObject(result.data, 'bppDescriptor') };
            break;
          case "bank":
            currentInitialData = { bankDetails: transformArrayToObject(result.data, 'bankDetails') };
            break;
          case "contact":
            currentInitialData = { contactDetail: transformArrayToObject(result.data, 'contactDetail') };
            break;
          default:
            currentInitialData = {};
        }
        setInitialFormData(currentInitialData);
      } else {
        setTabData([]);
        setInitialFormData({"basicDetail":{},"contactDetail":{},"bppDescriptor":{},"bankDetails":[]});
        cogoToast.info("No details found for this section.", { hideAfter: 3 });
      }
    } catch (err) {
      console.error("Error fetching admin details:", err);
      setError("Failed to fetch details.");
      setTabData([]);
      setInitialFormData(null);
      cogoToast.error("Failed to fetch details: " + (err.response?.data?.message || err.message), { hideAfter: 5 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAdminDetails();
  }, [activeTab]);

  function convertJsonToCodeValueArray(json) {
    const result = [];
    function recurse(obj, path = '') {
      for (const key in obj) {
        const fullPath = path ? `${path}.${key}` : key;
        const value = obj[key];
        if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
          recurse(value, fullPath);
        } else {
          result.push({ code: fullPath, value });
        }
      }
    }
    recurse(json);
    return result;
  }

  const handleSave = async (formData) => {
    let dataToSend = [];
    let api_url = '/api/v1/seller/props/update?key=';

    if (selectedSection === "basic") {
      api_url += "snp.details.basic";
      dataToSend = convertJsonToCodeValueArray(formData.basicDetail);
    } else if (selectedSection === "bppDescriptor") {
      api_url += "snp.details.descriptor";
      dataToSend = convertJsonToCodeValueArray(formData.bppDescriptor);
    } else if (selectedSection === "operativeBank") {
      api_url += "snp.details.operativeBank";
      dataToSend = convertJsonToCodeValueArray(formData.bankDetails[0]);
    } else if (selectedSection === "nonOperativeBank") {
      api_url += "snp.details.nonOperativeBank";
      dataToSend = convertJsonToCodeValueArray(formData.bankDetails[1]);
    } else if (selectedSection === "contact") {
      api_url += "snp.details.contact";
      dataToSend = convertJsonToCodeValueArray(formData.contactDetail);
    }

    const res = await postCall(api_url, dataToSend);
    if (res.status && res.status !== 200) {
      cogoToast.error(res.message, { hideAfter: 5 });
    } else if (res.status && res.status === 200) {
      cogoToast.success("Details updated successfully!", { hideAfter: 5 });
      setIsModalOpen(false);
      getAdminDetails();
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleOpenModal = (sectionKey) => {
    setSelectedSection(sectionKey);
    setIsModalOpen(true);
  };

  const renderTabContent = () => {
    if (loading) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px">
          <CircularProgress />
          <Typography ml={2}>Loading details...</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Box display="flex" justifyContent="center" alignItems="center" height="200px" color="error.main">
          <Typography>Error: {error}</Typography>
        </Box>
      );
    }

    const currentDataExists = tabData && tabData.length > 0;
    let addButtons = null;

    switch (activeTab) {
      case "basic":
        addButtons = (
          <Button
            type="button"
            title="Set Basic Details"
            className="text-black"
            onClick={() => handleOpenModal("basic")}
          />
        );
        break;
      case "bppDescriptor":
        addButtons = (
          <Button
            type="button"
            title="Set Buyer Param"
            className="text-black"
            onClick={() => handleOpenModal("bppDescriptor")}
          />
        );
        break;
      case "bank":
        addButtons = (
          <>
            <Button
              type="button"
              title="Set Operative Bank"
              className="text-black"
              onClick={() => handleOpenModal("operativeBank")}
            />
            {/* {!nonOperativeDataPresent && (
              <Button
                type="button"
                title="Add Non-Operative Bank"
                className="text-black"
                onClick={() => handleOpenModal("nonOperativeBank")}
              />
            )} */}
          </>
        );
        break;
      case "contact":
        addButtons = (
          <Button
            type="button"
            title="Set contact Details"
            className="text-black"
            onClick={() => handleOpenModal("contact")}
          />
        );
        break;
      default:
        addButtons = null;
    }

    return (
      <div className="flex flex-col mt-4 gap-4">
        {/* Container for the table, with width constraint */}
        <div className="w-full md:w-1/2 lg:w-1/3"> {/* Re-added width classes */}
          {currentDataExists ? (
            <DynamicTableDisplay data={tabData} />
          ) : (
            <Box display="flex" justifyContent="center" alignItems="center" height="200px">
              <Typography variant="h6" color="textSecondary">No details available for this section.</Typography>
            </Box>
          )}
        </div>
        {/* Buttons now clearly below the table container */}
        <div className="flex justify-start gap-2">
          {addButtons}
        </div>
      </div>
    );
  };

  const tabItems = [
    { label: "Basic Details", key: "basic" },
    { label: "Buyer Param", key: "bppDescriptor" },
    { label: "Bank Details", key: "bank" },
    { label: "contact Details", key: "contact" },
  ];

  return (
    <div className="container mx-auto my-8">
      <div className="w-full bg-white px-4 py-4 rounded-md h-full">
        <div className="mb-4 flex flex-col md:flex-row justify-between items-start gap-4">
          <label
            style={{ color: '#1976d2' }} // Hardcoded color
            className="font-semibold text-2xl"
          >
            SNP Details
          </label>
        </div>

        <Tabs
          value={activeTab}
          onChange={handleTabChange}
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

        <div>{renderTabContent()}</div>

        <AddAdminDetails
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          selectedSection={selectedSection}
          initialData={initialFormData}
        />
      </div>
    </div>
  );
};

export default AdminDetails;