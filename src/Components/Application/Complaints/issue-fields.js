export const allIssueFieldDetails = [
    {
        id: "merchantId",
        title: "Merchant",
        placeholder: "Select Merchant",
        options: [],
        type: "select",
        required: true,
    },
    {
        id: "transactionId",
        title: "Transaction Id",
        placeholder: "Transaction Id",
        type: "input",
        required: true,
    },
    {
        id: "bapId",
        title: "BAP ID",
        placeholder: "BAP ID",
        type: "input",
        required: true,
    },
    {
        id: "bapUri",
        title: "BAP URI",
        placeholder: "BAP URI",
        type: "input",
        required: true,
    },
    {
      id: "description",
      title: "Description",
      placeholder: "Description",
      type: "input",
      required: true,
      multiline: true,
    },
    {
      id: "imageUrls",
      title: "Issue Images",
      type: "upload",
      multiple: true,
      file_type: "issue_image",
      required: true,
    }
];
