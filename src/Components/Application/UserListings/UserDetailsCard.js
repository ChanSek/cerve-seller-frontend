import React, { useState } from 'react';
import RenderInput from "../../../utils/RenderInput";
import verficationFields from "./admin-verification-fields";
import { useParams } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import { Button } from "@mui/material";
import { putCall } from "../../../Api/axios";
import cogoToast from "cogo-toast";
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Tooltip from '@mui/material/Tooltip';
import {
  isValidBankAccountNumber,
  isValidIFSC,
  isNameValid,
  isEmailValid,
  isValidPAN,
  isPhoneNoValid,
  isValidFSSAI,
  isValidGSTIN,
  isValidChars,
  isValidDescription,
  hasRepeatedChars,
} from "../../../utils/validations";

const UserDetailsCard = ({ selectedTab, details }) => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentField, setCurrentField] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkContent, setLinkContent] = useState('');

  const { formValues, setFormValues, errors, setErrors } = useForm({});

  const getFieldById = (id) => {
    return verficationFields.find(field => field.id === id);
  };
  const params = useParams();
  const handleEditClick = (key, value, _id) => {
    const matchedField = getFieldById(key);
    setFormValues({
      [key]: value,
    });
    setCurrentField(matchedField);
    setCurrentId(_id);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setCurrentField({});
  };

  const handleLinkClick = (url) => {
    setLinkContent(url);
    setIsLinkModalOpen(true);
  };

  const handleLinkModalClose = () => {
    setLinkContent("");
    setIsLinkModalOpen(false);
  };

  const handleSubmit = async () => {
    try {
      const validationErrors = validateFields(formValues);
      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        return;
      }
      setErrors({});
      // Proceed with form submission if validation passes
      const key = Object.keys(formValues)[0];
      const value = formValues[key];
      let data = {};

      if (selectedTab === 'bank') {
        data = {
          updatedEntity: selectedTab,
          updatedField: key,
          account: {
            accountId: currentId,
            [key]: value,
          },
        };
      } else if (selectedTab === 'review') {
        data = {
          updatedEntity: selectedTab,
          updatedField: key,
          merchantReview: {
            _id: currentId,
            [key]: value,
          },
        };
      } else {
        data = {
          updatedEntity: selectedTab,
          updatedField: key,
          [key]: value,
        };
      }

      const url = `/api/v1/seller/merchantId/${params?.id}/review`;
      const res = await putCall(url, data);

      if (res.status && res.status === 200) {
        details[key].value = value;
        cogoToast.success(formatLabel(key) + ' updated successfully.', { hideAfter: 5 });
      }
    } catch (error) {
      console.log("error", error);
      console.log("error.response", error.response);
      cogoToast.error(error.response.data.error);
    }

    handleModalClose();
  };

  const validateFields = (formData) => {
    const errors = {};
    const key = Object.keys(formData)[0]
    const field = getFieldById(key);
    const value = formValues[key];
    if (field.required && !value) {
      errors[field.id] = `${field.title} is required`;
      return errors;
    }

    switch (field.id) {
      case "email":
      case "contactEmail":
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors[field.id] = "Invalid email format";
        }
        break;

      case "mobile":
      case "contactMobile":
        if (value && !/^\d{10}$/.test(value)) {
          errors[field.id] = "Invalid mobile number (10 digits required)";
        }
        break;

      case "fssaiNo":
        if (value && value.toString().length !== 14) {
          errors[field.id] = "FSSAI Number must be 14 digits";
        } else if (value && !isValidFSSAI(value)) {
          errors[field.id] = "FSSAI Number must be in valid format";
        }
        break;

      case "gstin":
        if (value && value.length !== 15) {
          errors[field.id] = "GSTIN must be 15 characters";
        } else if (value && !isValidGSTIN(value)) {
          errors[field.id] = "GSTIN must be in valid format";
        }
        break;

      case "ifscCode":
        if (value && !isValidIFSC(value)) {
          errors[field.id] = "Invalid IFSC code format";
        }
        break;

      case "accountNumber":
        if (value && value.toString().length < 9 || value.toString().length > 18) {
          errors[field.id] = "Invliad Account Number";
        }else if (value && isValidBankAccountNumber(value)) {
          errors[field.id] = "Invliad Account Number";
        }
        break;

      default:
        if (field.maxLength && value && value.length > field.maxLength) {
          errors[field.id] = `${field.title} exceeds maximum length of ${field.maxLength}`;
        }
        break;
    }

    if (field.type === "upload" && !value) {
      errors[field.id] = `${field.title} is required`;
    }

    return errors;
  };


  const isEmpty = Object.keys(details).length === 0;
  return (
    <>
      <br />
      <div style={styles.card}>
        {isEmpty ? (
          <p>No details available</p>
        ) : (
          <table style={styles.table}>
            <tbody>
              {Object.entries(details).map(([key, item], index) => {
                const renderEditLink = () => (
                  item.editable && (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        handleEditClick(key, item.value, item._id);
                      }}
                      style={styles.editLink}
                    >
                      <Tooltip title={`Update ${item.title}`}>
                        <EditIcon />
                      </Tooltip>
                    </a>
                  )
                );
                const renderValue = () => {
                  if (typeof item.value === 'boolean') {
                    return (
                      <span style={item.value ? styles.yes : styles.no}>
                        {item.value ? 'Yes' : 'No'}
                      </span>
                    );
                  }
                  switch (item.value) {
                    case 'Approved':
                      return (
                        <>
                          <span style={styles.yes}>Approved</span>
                          {renderEditLink()}
                        </>
                      );
                    case 'Rejected':
                      return (
                        <>
                          <span style={styles.no}>Rejected</span>
                          {renderEditLink()}
                        </>
                      );
                    default:
                      if (item.value && item.value.toString().startsWith('http')) {
                        return (
                          <>
                            <a
                              href="javascript:void(0)"
                              onClick={() => handleLinkClick(item.value)}
                              style={styles.link}
                            >
                              <Tooltip title={`Click to View ${item.title}`}>
                                <VisibilityIcon />
                              </Tooltip>
                            </a>
                            {renderEditLink()}
                          </>
                        );
                      }
                      return (
                        <>
                          {item.value || 'Not Available'}
                          {renderEditLink()}
                        </>
                      );
                  }
                };
                return (
                  <tr key={index}>
                    <td style={styles.tableCell}>
                      <strong>{item.title}:</strong>
                    </td>
                    <td style={styles.tableCell}>{renderValue()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

        )}
      </div>

      {isModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <form>
              {currentField && (
                <RenderInput
                  item={{
                    ...currentField,
                    error: !!errors?.[currentField.id], // Show error if it exists
                    helperText: errors?.[currentField.id] || "", // Display the error message if present
                  }}
                  state={formValues}
                  stateHandler={setFormValues}
                />
              )}
              <div className="flex mt-6">
                <Button
                  type="button"
                  size="small"
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                >
                  Update
                </Button>
                <Button
                  type="button"
                  size="small"
                  style={{ marginRight: 5 }}
                  variant="text"
                  onClick={handleModalClose}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isLinkModalOpen && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <a href="#" onClick={(e) => { e.preventDefault(); handleLinkModalClose(); }} style={styles.closeLink} role="button" tabIndex="0">
              X</a>
            <img src={linkContent} alt="Preview" style={styles.image} />
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to format labels (convert camelCase or snake_case to readable text)
const formatLabel = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1') // Add space before capital letters
    .replace(/_/g, ' ') // Replace underscores with spaces
    .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize first letter of each word
};

const styles = {
  card: {
    width: '100%',
    maxWidth: '100%',
    overflowX: 'auto', // Allow horizontal scrolling if content exceeds screen width
    padding: '16px',
    boxSizing: 'border-box',
    //margin: '0 auto', // Center the card
  },
  tableCell: {
    padding: '6px',
    whiteSpace: 'nowrap', // Prevent line breaks
    //overflow: 'hidden', // Hide overflowed text
    //textOverflow: 'ellipsis', // Add ellipsis (...) for overflowed text
    border: '0px solid #ddd', // Optional: add borders for table cells
    minWidth: '150px', // Optional: Adjust based on the available space
  },
  field: {
    marginBottom: '10px',
    fontSize: '16px',
  },
  yes: {
    color: 'green',
    fontWeight: 'bold',
  },
  no: {
    color: 'red',
    fontWeight: 'bold',
  },
  link: {
    color: '#007BFF',
    textDecoration: 'none',
    fontWeight: 'bold',
  },
  editLink: {
    marginLeft: '10px',
    color: '#FFA500',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  modalContent: {
    position: 'relative',
    background: '#fff',
    padding: '20px',
    borderRadius: '3px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    maxWidth: '90vw', // Limit the width to 90% of the viewport width
    maxHeight: '90vh', // Keep height within 90% of the viewport height
    overflowY: 'auto', // Allow scrolling if content overflows
    zIndex: 10000,
  },
  input: {
    width: '100%',
    padding: '10px',
    marginBottom: '10px',
  },
  closeLink: {
    position: 'absolute',
    top: '3px',
    right: '6px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  image: {
    maxWidth: '100%',
    height: 'auto',
  },
  button: {
    padding: '10px 20px',
    margin: '5px',
    cursor: 'pointer',
  },
};

export default UserDetailsCard;
