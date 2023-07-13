import { useEffect, useState } from "react";

import MyButton from "../../Shared/Button";
import RenderInput from "../../../utils/RenderInput";
import { useLocation, useNavigate } from "react-router-dom";
import useForm from "../../../hooks/useForm";
import BackNavigationButton from "../../Shared/BackNavigationButton";
import { allProductFieldDetails, categoryFields } from "./product-fields";
import AddGenericProduct from "./AddGenericProduct";
import { PRODUCT_SUBCATEGORY } from "../../../utils/constants";
import { allProperties } from "./categoryProperties";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

export default function AddProduct() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [fields, setFields] = useState(allProductFieldDetails);
  const [properties, setProperties] = useState([]);
  const [variants, setVariants] = useState([]);
  const [variantsCheckboxState, setVariantsCheckboxState] = useState({});
  const [renderCategories, setRenderCategories] = useState(!state?.productId);

  const categoryInitialValues = {
    productCategory: "",
    productSubcategory1: "",
  };

  const categoryForm = useForm(categoryInitialValues);

  const getProductFieldDetails = (category_id) => {
    return allProductFieldDetails.find((field) => field.id === category_id);
  };

  useEffect(() => {
    if (categoryForm.formValues?.productCategory) {
      let data = [...fields]; // Create a copy of the fields array
      const subCategoryIndex = data.findIndex(
        (item) => item.id === "productSubcategory1"
      );
      data[subCategoryIndex].options =
        PRODUCT_SUBCATEGORY[categoryForm.formValues?.productCategory];
      setFields(data);
    }
  }, [categoryForm.formValues]);

  useEffect(() => {
    let category = categoryForm.formValues["productCategory"];
    let sub_category = categoryForm.formValues["productSubcategory1"];
    console.log(category);
    console.log(sub_category);
    if (category && sub_category) {
      let properties = allProperties[category][sub_category];
      let variants = properties?.filter(
        (property) => property.variationAllowed
      );
      let variants_checkbox_map = variants?.reduce((acc, variant) => {
        acc[variant.name] = false;
        return acc;
      }, {});
      setProperties(properties);
      setVariants(variants);
      setVariantsCheckboxState(variants_checkbox_map);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryForm.formValues.productSubcategory1]);

  const renderCategoryFields = () => {
    return categoryFields.map((category_id) => {
      let item = getProductFieldDetails(category_id);
      return (
        item && (
          <RenderInput
            item={{
              ...item,
              error: categoryForm.errors?.[item?.id] ? true : false,
              helperText: categoryForm.errors?.[item.id] || "",
            }}
            state={categoryForm.formValues}
            stateHandler={categoryForm.setFormValues}
          />
        )
      );
    });
  };

  const handleVariantCheckboxChange = (event) => {
    console.log("here....");
    setVariantsCheckboxState({
      ...variantsCheckboxState,
      [event.target.name]: event.target.checked,
    });
  };

  const renderVariants = () => {
    return (
      <div>
        <label className="text-sm py-2 ml-1 font-medium text-left text-[#606161] inline-block mt-2">
          Select Variants
        </label>
        <Box sx={{ display: "flex" }}>
          <FormControl
            sx={{ ml: 3, display: "flex" }}
            component="fieldset"
            variant="standard"
          >
            <FormGroup sx={{ display: "flex" }}>
              {variants?.map(({ name }) => (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={variantsCheckboxState[name]}
                      onChange={handleVariantCheckboxChange}
                      name={name}
                    />
                  }
                  label={name}
                />
              ))}
            </FormGroup>
          </FormControl>
        </Box>
      </div>
    );
  };

  const renderFields = () => {
    if (
      renderCategories
      // !state?.productId &&
      // (!categoryForm.formValues["productCategory"] ||
      //   !categoryForm.formValues["productSubcategory1"])
    ) {
      return (
        <div>
          {renderCategoryFields()}
          {variants && renderVariants()}
        </div>
      );
    } else {
      return (
        <AddGenericProduct
          state={state}
          categoryForm={categoryForm}
          category={categoryForm.formValues?.productCategory}
          subCategory={categoryForm.formValues?.productSubcategory1}
        />
      );
    }
  };

  return (
    <>
      <div className="container mx-auto my-8">
        <BackNavigationButton
          onClick={() => navigate("/application/inventory")}
        />
        <div className="w-full !h-full">
          <label className="ml-2 md:mb-4 md:mt-3 mt-2 font-semibold text-xl">
            {state?.productId == undefined ? "Add Product" : "Update Product"}
          </label>
          <form>
            <div className="mt-2">{renderFields()}</div>
            {}
            <div className="flex flex-row justify-center py-2 sm:pt-5 md:!mt-10">
              <MyButton
                type="button"
                title="CANCEL"
                className="text-black"
                onClick={() => navigate("/application/inventory")}
              />
              <MyButton
                type="button"
                title="NEXT"
                className="text-black"
                disabled={
                  !(
                    categoryForm.formValues["productCategory"] &&
                    categoryForm.formValues["productSubcategory1"]
                  )
                }
                onClick={() => setRenderCategories(false)}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
