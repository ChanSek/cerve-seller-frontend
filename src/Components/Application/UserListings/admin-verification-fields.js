export default [
    { id: "name", title: "Name", placeholder: "Enter your Name", type: "input", required: true,width: '350px' },
    { id: "email", title: "Email", placeholder: "Enter your Email Address", type: "input", required: true },
    { id: "mobile", title: "Mobile Number", placeholder: "Enter your Mobile Number", type: "number",value: "+91",prefix: "+91",mobile: true,maxLength: 10, attributes: {readonlyPrefix: true}, required: true },
    { id: "contactEmail", title: "Contact Email", placeholder: "Enter your Contact Email Address", type: "input", required: true },
    { id: "contactMobile", title: "Contact Mobile No.", placeholder: "Enter your Contact Mobile Number", type: "number",value: "+91",prefix: "+91",mobile: true,maxLength: 10, attributes: {readonlyPrefix: true}, required: true },
    { id: "fssaiNo", title: "FSSAI Number", placeholder: "FSSAI Number", type: "number", required: true, maxLength: 14 },
    { id: "address", title: "Registered Address", placeholder: "Enter your Registered Address", type: "input", required: true },
    { id: "addressProofUrl", title: "Address Proof", type: "upload", file_type: "address_proof", required: true, fontColor: "#ffffff" },
    { id: "gstin", title: "GSTIN Certificate", placeholder: "GSTIN Certificate", type: "input", required: true, maxLength: 15 },
    { id: "gstinProofUrl", title: "GSTIN Proof", type: "upload", file_type: "gst", required: true, fontColor: "#ffffff" },
    { id: "pan", title: "PAN", placeholder: "Enter your PAN", type: "input", required: true },
    { id: "panProofUrl", title: "PAN Card Proof", type: "upload", fontColor: "#ffffff", file_type: "pan", required: true },
    { id: "idProofUrl", title: "ID Proof", type: "upload", fontColor: "#ffffff", file_type: "id_proof", required: true },
    { id: "bankName", title: "Bank Name", placeholder: "Enter Bank Name", type: "input", required: true },
    { id: "branchName", title: "Branch Name", placeholder: "Enter Branch Name", type: "input", required: true },
    { id: "ifscCode", title: "IFSC Code", placeholder: "Enter IFSC Code", type: "input", required: true },
    { id: "accountHolderName", title: "Account Holder Name", placeholder: "Enter Account Holder Name", type: "input", required: true },
    { id: "accountNumber", title: "Account Number", placeholder: "Enter Account Number", type: "number", required: true,minLength:9,maxLength: 18 },
    { id: "cancelledChequeUrl", title: "Cancelled Cheque", type: "upload", fontColor: "#ffffff", file_type: "cancelled_check", required: true },
    { id: "addressStatus", title: "Address", options: [{ key: "Pending", value: "Review Pending" }, { key: "InProgress", value: "Review In Progress" },{ key: "Approve", value: "Approved" }, { key: "Reject", value: "Rejected" }], type: "select", required: true },
    { id: "panStatus", title: "PAN", options: [{ key: "Pending", value: "Review Pending" }, { key: "InProgress", value: "Review In Progress" },{ key: "Approve", value: "Approved" }, { key: "Reject", value: "Rejected" }], type: "select", required: true },
    { id: "fssaiStatus", title: "FSSAI No.", options: [{ key: "Pending", value: "Review Pending" }, { key: "InProgress", value: "Review In Progress" },{ key: "Approve", value: "Approved" }, { key: "Reject", value: "Rejected" }], type: "select", required: true },
    { id: "gstinStatus", title: "GSTIN", options: [{ key: "Pending", value: "Review Pending" }, { key: "InProgress", value: "Review In Progress" },{ key: "Approve", value: "Approved" }, { key: "Reject", value: "Rejected" }], type: "select", required: true},
    { id: "bankDetailStatus", title: "Bank Details", options: [{ key: "Pending", value: "Review Pending" }, { key: "InProgress", value: "Review In Progress" },{ key: "Approve", value: "Approved" }, { key: "Reject", value: "Rejected" }], type: "select", required: true },
    { id: "active", title: "Activate Seller", options: [{ key: "Approve", value: "true" }, { key: "Reject", value: "false" }], type: "radio", required: true },
    { id: "reviewerComment", title: "Reviewer Comment", placeholder: "Review Comment", type: "input", required: false },
  ];