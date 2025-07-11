export const validateProductForm = (formData, fields, setErrors) => {
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
        const value = formData[field.id];

        // Required check
        if (field.required && (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0))) {
            newErrors[field.id] = `${field.title} is required`;
            isValid = false;
            return;
        }

        // Max length
        if (field.maxLength && typeof value === "string" && value.length > field.maxLength) {
            newErrors[field.id] = `${field.title} cannot exceed ${field.maxLength} characters`;
            isValid = false;
            return;
        }

        // Min value
        if (field.min !== undefined && typeof value === "number" && value < field.min) {
            newErrors[field.id] = `${field.title} cannot be less than ${field.min}`;
            isValid = false;
            return;
        }

        // Number validation
        if (field.type === "number") {
            if (value !== undefined && value !== null && value !== "" && isNaN(value)) {
                newErrors[field.id] = `${field.title} must be a number`;
                isValid = false;
                return;
            }

            if (!isNaN(value) && Number(value) < 0) {
                newErrors[field.id] = `${field.title} cannot be negative`;
                isValid = false;
                return;
            }
        }

        // Decimal validation
        if (field.valueInDecimal && value !== null && value !== "" && isNaN(parseFloat(value))) {
            newErrors[field.id] = `${field.title} must be a valid decimal number`;
            isValid = false;
            return;
        }
    });

    // Price validations
    if (!formData.price || !/^\d+(\.\d{1,2})?$/.test(formData.price)) {
        newErrors.price = "Please enter a valid MRP (e.g. 99.99)";
        isValid = false; // ✅ important
    }

    if (!formData.purchasePrice || !/^\d+(\.\d{1,2})?$/.test(formData.purchasePrice)) {
        newErrors.purchasePrice = "Please enter a valid Selling Price (e.g. 99.99)";
        isValid = false; // ✅ important
    }

    const price = parseFloat(formData.price);
    const purchasePrice = parseFloat(formData.purchasePrice);
    if (!isNaN(price) && !isNaN(purchasePrice) && purchasePrice > price) {
        newErrors.purchasePrice = "Selling Price cannot be greater than MRP";
        isValid = false; // ✅ important
    }

    // Quantity validation
    const availableQty = parseFloat(formData.availableQty);
    const maxAllowedQty = parseFloat(formData.maxAllowedQty);
    if (!isNaN(availableQty) && !isNaN(maxAllowedQty)) {
        if (maxAllowedQty > availableQty) {
            newErrors["maxAllowedQty"] = "Max Allowed Quantity should be less than or equal to Quantity";
            isValid = false; // ✅
        }
    }

    setErrors(newErrors);
    return isValid;
};