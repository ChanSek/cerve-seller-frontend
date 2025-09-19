export const validateProductForm = (formData, fields, setErrors) => {
    let isValid = true;
    const newErrors = {};

    fields.forEach((field) => {
        const { id, title, required, maxLength, min, type, valueInDecimal } = field;
        const value = formData[id];

        // Required field
        if (
            required &&
            (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0))
        ) {
            newErrors[id] = `${title} is required`;
            isValid = false;
            return;
        }

        // Max length
        if (maxLength && typeof value === "string" && value.length > maxLength) {
            newErrors[id] = `${title} cannot exceed ${maxLength} characters`;
            isValid = false;
            return;
        }

        // Min value
        if (min !== undefined && typeof value === "number" && value < min) {
            newErrors[id] = `${title} cannot be less than ${min}`;
            isValid = false;
            return;
        }

        // Number validation
        if (type === "number") {
            if (value !== undefined && value !== null && value !== "" && isNaN(value)) {
                newErrors[id] = `${title} must be a number`;
                isValid = false;
                return;
            }

            if (!isNaN(value) && Number(value) < 0) {
                newErrors[id] = `${title} cannot be negative`;
                isValid = false;
                return;
            }
        }

        // Decimal validation
        if (valueInDecimal && value !== null && value !== "" && isNaN(parseFloat(value))) {
            newErrors[id] = `${title} must be a valid decimal number`;
            isValid = false;
            return;
        }

        // MRP format validation
        if (id === "price" && value && !/^\d+(\.\d{1,2})?$/.test(value)) {
            newErrors[id] = "Please enter a valid MRP (e.g. 99.99)";
            isValid = false;
            return;
        }

        // Selling price format validation
        if (id === "sellingPrice" && value && !/^\d+(\.\d{1,2})?$/.test(value)) {
            newErrors[id] = "Please enter a valid Selling Price (e.g. 99.99)";
            isValid = false;
            return;
        }

        // MRP vs Selling price comparison
        if (id === "sellingPrice") {
            const price = parseFloat(formData["price"]);
            const sellingPrice = parseFloat(value);
            if (!isNaN(price) && !isNaN(sellingPrice) && sellingPrice > price) {
                newErrors[id] = "Selling Price cannot be greater than MRP";
                isValid = false;
                return;
            }
        }

        // Quantity vs Max Allowed Qty
        if (id === "maxAllowedQty") {
            const availableQty = parseFloat(formData["availableQty"]);
            const maxAllowedQty = parseFloat(value);
            if (!isNaN(availableQty) && !isNaN(maxAllowedQty) && maxAllowedQty > availableQty) {
                newErrors[id] = "Max Allowed Quantity should be less than or equal to Quantity";
                isValid = false;
                return;
            }
        }
    });

    console.log("newErrors", newErrors);
    setErrors(newErrors);
    return isValid;
};
