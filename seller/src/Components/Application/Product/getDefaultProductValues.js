const getDefaultProductValues = (fieldList = []) => {
    const defaultValues = {};

    fieldList.forEach((field) => {
        switch (field.id) {
            case "availableQty":
                defaultValues.availableQty = 99;
                break;
            case "minAllowedQty":
                defaultValues.minAllowedQty = 1;
                break;
            case "maxAllowedQty":
                defaultValues.maxAllowedQty = 99;
                break;
            //   case "uom":
            //     defaultValues.uom = "gram";
            //     break;
            //   case "uomValue":
            //     defaultValues.uomValue = "1";
            //     break;
            // case "longDescription":
            //     defaultValues.longDescription = "This is a sample product description.";
            //     break;
            case "fulfillmentOption":
                defaultValues.fulfillmentOption = "Delivery";
                break;
            case "countryOfOrigin":
                defaultValues.countryOfOrigin = "India";
                break;
            case "vegNonVeg":
                defaultValues.vegNonVeg = "VEG";
                break;
            case "sku":
                defaultValues.sku = "SKU12345";
                break;
            case "productCode":
                defaultValues.productCode = Date.now().toString();
                break;
            case "brandOwnerFssaiLicenseNo":
                defaultValues.brandOwnerFssaiLicenseNo = (Date.now().toString() + Math.floor(Math.random() * 10_000))
                    .substring(0, 14);
                break;
            case "manufacturerName":
                defaultValues.manufacturerName = "Refer to the product image.";
                break;
            case "manufacturerAddress":
                defaultValues.manufacturerAddress = "Refer to the product image.";
                break;
            case "nutritionalInfo":
                defaultValues.nutritionalInfo = "Refer to the product image.";
                break;
            case "additiveInfo":
                defaultValues.additiveInfo = "Refer to the product image.";
                break;
            case "instructions":
                defaultValues.instructions = "Refer to the product image.";
                break;
            case "ingredientsInfo":
                defaultValues.ingredientsInfo = "Refer to the product image.";
                break;
            default:
                defaultValues[field.id] = "";
                break;
        }
    });

    return defaultValues;
};

export default getDefaultProductValues;
