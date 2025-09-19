import React, { useEffect, useState } from "react";
import {
    Tabs,
    Tab,
    Box,
    useTheme,
} from "@mui/material";
import { getCall } from "../../../Api/axios";
import SubCategorySection from "./SubCategorySection";
import AttributesMapSection from "./AttributesMapSection";

const categoryLabelMap = {
    RET10: "Grocery",
    RET12: "Fashion",
    RET13: "BPC",
    RET14: "Electronics",
    RET15: "Appliances",
    RET16: "Home & Decor",
    RET18: "Health & Wellness",
};

const CategoryTaxonomy = () => {
    const [activeCategory, setActiveCategory] = useState("RET10");
    const [subCategories, setSubCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [innerTab, setInnerTab] = useState(0);
    const theme = useTheme();

    const categoryKeys = Object.keys(categoryLabelMap);

    const handleCategoryChange = (event, newValue) => {
        setActiveCategory(newValue);
        setInnerTab(0); // reset to Subcategories tab when switching category
    };

    const handleInnerTabChange = (event, newValue) => {
        setInnerTab(newValue);
    };

    const fetchSubCategories = async (categoryCode) => {
        setLoading(true);
        try {
            const res = await getCall(`/api/v1/seller/reference/category/${categoryCode}`);
            if (res?.data?.length > 0) {
                setSubCategories(res.data.map((item) => item.value));
            } else {
                setSubCategories([]);
            }
        } catch (err) {
            console.error("Error fetching subcategories", err);
            setSubCategories([]);
        } finally {
            setLoading(false);
        }
    };

    const handleAddSubCategory = (newSub) => {
        setSubCategories((prev) => [...prev, newSub]);
    };

    const handleRemoveSubCategory = (index) => {
        setSubCategories((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        fetchSubCategories(activeCategory);
    }, [activeCategory]);

    return (
        <Box className="container mx-auto my-6 px-4" sx={{ width: "100%" }}>
            {/* Title */}
            <div className="mb-4 flex flex-row justify-between items-center">
                <label
                    style={{ color: theme.palette.primary.main }}
                    className="font-semibold text-2xl"
                >
                    Category Taxonomy
                </label>
            </div>

            {/* Top Tabs for Categories */}
            <Tabs
                value={activeCategory}
                onChange={handleCategoryChange}
                indicatorColor="primary"
                textColor="primary"
                variant="scrollable"
                scrollButtons="auto"
                sx={{ mb: 3 }}
            >
                {categoryKeys.map((key) => (
                    <Tab
                        key={key}
                        value={key}
                        label={`${categoryLabelMap[key]} (${key})`}
                    />
                ))}
            </Tabs>

            {/* Inner Tabs for Subcategory vs Attribute Map */}
            <Tabs
                value={innerTab}
                onChange={handleInnerTabChange}
                indicatorColor="secondary"
                textColor="secondary"
                sx={{ mb: 2 }}
            >
                <Tab label="Attribute Map" />
                <Tab label="Subcategories" />

            </Tabs>


            {innerTab === 0 && (
                <Box sx={{ mt: 1 }}>
                    <AttributesMapSection activeCategory={activeCategory} />
                </Box>
            )}
            {/* Inner Tab Panels */}
            {innerTab === 1 && (
                <Box sx={{ mt: 1 }}>
                    <SubCategorySection
                        subCategories={subCategories}
                        loading={loading}
                        onAdd={handleAddSubCategory}
                        onRemove={handleRemoveSubCategory}
                    />
                </Box>
            )}
        </Box>
    );
};

export default CategoryTaxonomy;
