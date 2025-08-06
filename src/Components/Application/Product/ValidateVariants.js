export const validateVariantForm = (variants, fields, setVariantErrors) => {
    let isValid = true;
    const newErrors = [];

    variants.forEach((variant, index) => {
        const variantErrors = {};
        const data = variant.data || {};

        fields.forEach((field) => {
            const { id, title, required, maxLength, min, type, valueInDecimal } = field;
            const value = data[id];

            // Required field check
            if (
                required &&
                (value === "" || value === null || value === undefined || (Array.isArray(value) && value.length === 0))
            ) {
                variantErrors[id] = `${title} is required`;
                isValid = false;
                return;
            }

            // Max length
            if (maxLength && typeof value === "string" && value.length > maxLength) {
                variantErrors[id] = `${title} cannot exceed ${maxLength} characters`;
                isValid = false;
                return;
            }

            // Min value
            if (min !== undefined && typeof value === "number" && value < min) {
                variantErrors[id] = `${title} cannot be less than ${min}`;
                isValid = false;
                return;
            }

            // Number validation
            if (type === "number") {
                if (value !== undefined && value !== null && value !== "" && isNaN(value)) {
                    variantErrors[id] = `${title} must be a number`;
                    isValid = false;
                    return;
                }

                if (!isNaN(value) && Number(value) < 0) {
                    variantErrors[id] = `${title} cannot be negative`;
                    isValid = false;
                    return;
                }
            }

            // Decimal validation
            if (valueInDecimal && value !== null && value !== "" && isNaN(parseFloat(value))) {
                variantErrors[id] = `${title} must be a valid decimal number`;
                isValid = false;
                return;
            }

            // MRP validation
            if (id === "price" && value && !/^\d+(\.\d{1,2})?$/.test(value)) {
                variantErrors[id] = "Please enter a valid MRP (e.g. 99.99)";
                isValid = false;
                return;
            }

            // Selling price validation
            if (id === "purchasePrice" && value && !/^\d+(\.\d{1,2})?$/.test(value)) {
                variantErrors[id] = "Please enter a valid Selling Price (e.g. 99.99)";
                isValid = false;
                return;
            }

            // Price comparison
            if (id === "purchasePrice") {
                const price = parseFloat(data["price"]);
                const purchasePrice = parseFloat(value);
                if (!isNaN(price) && !isNaN(purchasePrice) && purchasePrice > price) {
                    variantErrors[id] = "Selling Price cannot be greater than MRP";
                    isValid = false;
                    return;
                }
            }
        });

        newErrors[index] = variantErrors;
    });
console.log("newErrors ",newErrors);
    setVariantErrors(newErrors);
    return isValid;
};
