import React, { useState } from "react";
import { Modal, Box } from "@mui/material";
import RenderInput from "../../../utils/RenderInput";

const AddAdminDetails = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    basicDetail: { gstin: "" },
    bppDescriptor: {
      name: "",
      code: "",
      symbol: "",
      short_desc: "",
      long_desc: "",
      images: "",
      audio: "",
      "3d_render": "",
      tags: "",
    },
    bankDetails: [
      {
        accountId: "",
        accountType: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        cancelledChequeUrl: "",
        bankName: "",
        branchName: "",
        beneficiaryName: "",
        upiAddress: "",
        bankAccountType: "",
      },
      {
        accountId: "",
        accountType: "",
        accountHolderName: "",
        accountNumber: "",
        ifscCode: "",
        cancelledChequeUrl: "",
        bankName: "",
        branchName: "",
        beneficiaryName: "",
        upiAddress: "",
        bankAccountType: "",
      },
    ],
  });

  const basicFields = [
    {
      id: "gstin",
      title: "GSTIN",
      placeholder: "GSTIN",
      type: "input",
      required: true,
    },
  ];

  const bppFields = [
    {
      id: "name",
      title: "Name",
      placeholder: "Name",
      type: "input",
      required: true,
    },
    {
      id: "code",
      title: "Code",
      placeholder: "Code",
      type: "input",
      required: true,
    },
    {
      id: "symbol",
      title: "Symbol",
      placeholder: "Symbol",
      type: "input",
      required: true,
    },
    {
      id: "short_desc",
      title: "Short Description",
      placeholder: "Short Description",
      type: "input",
      required: true,
    },
    {
      id: "long_desc",
      title: "Long Description",
      placeholder: "Long Description",
      type: "input",
      required: true,
    },
    {
      id: "images",
      title: "Images",
      placeholder: "Upload Images",
      type: "upload",
      required: true,
    },
  ];

  const bankFields = [
    {
      id: "accountHolderName",
      title: "Account Holder Name",
      placeholder: "Account Holder Name",
      type: "input",
      required: true,
    },
    {
      id: "accountNumber",
      title: "Account Number",
      placeholder: "Account Number",
      type: "input",
      required: true,
    },
    {
      id: "ifscCode",
      title: "IFSC Code",
      placeholder: "IFSC Code",
      type: "input",
      required: true,
    },
    {
      id: "bankName",
      title: "Bank Name",
      placeholder: "Bank Name",
      type: "input",
      required: true,
    },
  ];

  const handleInputChange = (field, value, section, index) => {
    if (section === "bankDetails") {
      const updatedBankDetails = [...formData.bankDetails];
      updatedBankDetails[index][field] = value;
      setFormData({ ...formData, bankDetails: updatedBankDetails });
    } else if (section) {
      setFormData({
        ...formData,
        [section]: { ...formData[section], [field]: value },
      });
    } else {
      setFormData({ ...formData, [field]: value });
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50vw",
          height: "85vh",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          overflow: "auto",
        }}
      >
        <div>
          <h2 className="text-xl font-bold mb-4">New Record Entry</h2>

          {/* Basic Details */}
          <div className="mb-4">
            <h3 className="font-semibold">Basic Details</h3>
            {basicFields.map((field) => (
              <RenderInput
                key={field.id}
                item={{
                  id: field.id,
                  value: formData.basicDetail[field.id],
                  placeholder: field.placeholder,
                  type: field.type,
                  required: field.required,
                }}
                state={formData}
                stateHandler={(newState) =>
                  handleInputChange(field.id, newState.basicDetail[field.id], "basicDetail")
                }
                labelClasses="font-medium"
                inputClasses="w-full p-2 border border-gray-300 rounded mt-2"
              />
            ))}
          </div>

          {/* BPP Descriptor */}
          <div className="mb-4">
            <h3 className="font-semibold">BPP Descriptor</h3>
            {bppFields.map((field) => (
              <RenderInput
                key={field.id}
                item={{
                  id: field.id,
                  value: formData.bppDescriptor[field.id],
                  placeholder: field.placeholder,
                  type: field.type,
                  required: field.required,
                }}
                state={formData}
                stateHandler={(newState) =>
                  handleInputChange(field.id, newState.bppDescriptor[field.id], "bppDescriptor")
                }
                labelClasses="font-medium"
                inputClasses="w-full p-2 border border-gray-300 rounded mt-2"
              />
            ))}
          </div>

          {/* Bank Details */}
          <div className="mb-4">
            <h3 className="font-semibold">Bank Details</h3>
            {formData.bankDetails.map((bank, index) => (
              <div key={index} className="mb-4 border p-4 rounded">
                <h4 className="font-semibold">Bank #{index + 1}</h4>
                {bankFields.map((field) => (
                  <RenderInput
                    key={`${field.id}-${index}`}
                    item={{
                      id: `${field.id}-${index}`,
                      value: bank[field.id],
                      placeholder: field.placeholder,
                      type: field.type,
                      required: field.required,
                    }}
                    state={formData}
                    stateHandler={(newState) =>
                      handleInputChange(field.id, newState.bankDetails[index][field.id], "bankDetails", index)
                    }
                    labelClasses="font-medium"
                    inputClasses="w-full p-2 border border-gray-300 rounded mt-2"
                  />
                ))}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save
            </button>
          </div>
        </div>
      </Box>
    </Modal>
  );
};

export default AddAdminDetails;
